import sys
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import ftplib
import csv
import io
from datetime import datetime, timezone
from supabase import create_client, Client

# --- Bike It FTP ---
FTP_HOST = "ftp.bikeitinternational.com"
FTP_USER = "B&L"
FTP_PASS = "gFDSPu9sIbK0UFioCwMy"
FTP_STOCK_PATH = "Stock/stock_level_Sku_Desc_Qty_SRP.csv"

# --- BL Motorcycles Supabase ---
SUPABASE_URL = "https://ddjuoeyaoxllockcusgf.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkanVvZXlhb3hsbG9ja2N1c2dmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM4ODM3OSwiZXhwIjoyMDgwOTY0Mzc5fQ.tQTpdQCkE-V-aCfdt7GgN5FF-IdXQzGCAEuRE6gNupE"

BATCH_SIZE = 500


def download_stock_csv() -> list[dict]:
    """Download stock file from Bike It FTP and return parsed rows."""
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Connecting to Bike It FTP...")
    buffer = io.BytesIO()

    ftp = ftplib.FTP()
    ftp.connect(FTP_HOST, 21, timeout=30)
    ftp.login(FTP_USER, FTP_PASS)
    ftp.retrbinary(f"RETR {FTP_STOCK_PATH}", buffer.write)
    ftp.quit()

    buffer.seek(0)
    content = buffer.read().decode("utf-8-sig", errors="replace")
    reader = csv.DictReader(io.StringIO(content))
    rows = list(reader)
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Downloaded {len(rows)} stock rows from FTP.")
    return rows


def sync_stock_to_supabase(rows: list[dict]):
    """Upsert stock levels + prices into Supabase products table."""
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    now = datetime.now(timezone.utc).isoformat()

    batch = []
    skipped = 0
    total_updated = 0

    for row in rows:
        sku = row.get("SKU", "").strip()
        if not sku:
            skipped += 1
            continue

        try:
            stock = int(row.get("OnHandQuantity", 0) or 0)
        except ValueError:
            stock = 0

        try:
            srp = float(row.get("SRP", 0) or 0)
        except ValueError:
            srp = 0.0

        try:
            trade = float(row.get("Trade", 0) or 0)
        except ValueError:
            trade = 0.0

        # Selling price = SRP (Bike It's recommended retail)
        # Fallback: trade * 1.4 if SRP missing
        selling_price = srp if srp > 0 else round(trade * 1.4, 2)

        title = row.get("Description", "").strip() or f"Product {sku}"

        batch.append({
            "sku": sku,
            "supplier_id": "BIKEIT",
            "title": title,
            "stock_level": stock,
            "retail_price": srp,
            "trade_price": trade,
            "selling_price": selling_price,
            "updated_at": now,
        })

        if len(batch) >= BATCH_SIZE:
            supabase.table("products").upsert(batch, on_conflict="sku").execute()
            total_updated += len(batch)
            print(f"  Batch done — {total_updated} updated so far...")
            batch = []

    if batch:
        supabase.table("products").upsert(batch, on_conflict="sku").execute()
        total_updated += len(batch)

    print(f"[{datetime.now().strftime('%H:%M:%S')}] Sync complete. {total_updated} products updated, {skipped} skipped.")


def download_llexeter_stock() -> list[dict]:
    """Download stock feed from CMPO/Llexeter and return mapped rows."""
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Fetching Llexeter Stock Feed...")
    r = requests.get("https://www.cmpoparts.com/stock_feed.csv")
    content = r.text
    reader = csv.DictReader(io.StringIO(content))
    rows = list(reader)
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Received {len(rows)} stock rows from CMPO.")
    return rows

def sync_all_stock():
    print(f"\n=== BL Motorcycles Universal Stock Sync | {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} ===")
    
    # 1. Bike It
    try:
        bikeit_rows = download_stock_csv()
        sync_stock_to_supabase(bikeit_rows)
    except Exception as e:
        print(f"  ! Bike It Sync Failed: {e}")

    # 2. Llexeter
    try:
        llex_rows = download_llexeter_stock()
        
        supabase_client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        now = datetime.now(timezone.utc).isoformat()
        total_updated = 0
        
        print(f"  Syncing CMPO stock (Updating existing rows only)...")
        # To avoid slow 1-by-1 updates, we'll update in small chunks or focus only on what we have
        # But for now, 1-by-1 is safest to avoid the 'upsert insert' failure.
        # Improvement: Fetch all our current LLEXETER SKUs first.
        res_current = supabase_client.table("products").select("sku").eq("supplier_id", "LLEXETER").execute()
        our_skus = {r['sku'] for r in res_current.data}
        
        for row in llex_rows:
            sku = row.get("id", "").strip()
            if not sku or sku not in our_skus: continue
            
            try:
                stock = int(row.get("availability", 0) or 0)
            except:
                stock = 0
                
            supabase_client.table("products").update({
                "stock_level": stock,
                "updated_at": now
            }).eq("sku", sku).execute()
            total_updated += 1

            if total_updated % 500 == 0:
                print(f"    - {total_updated} CMPO items updated...")
            
        print(f"[{datetime.now().strftime('%H:%M:%S')}] CMPO Sync complete. {total_updated} products updated.")
        
    except Exception as e:
        print(f"  ! CMPO Sync Failed: {e}")

    print("\n=== UNIVERSAL SYNC DONE ===\n")

if __name__ == "__main__":
    import requests
    sync_all_stock()
