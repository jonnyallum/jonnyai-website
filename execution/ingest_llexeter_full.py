import sys
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import requests
import json
from supabase import create_client, Client

# BL Motorcycles Supabase
supabase: Client = create_client(
    "https://ddjuoeyaoxllockcusgf.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkanVvZXlhb3hsbG9ja2N1c2dmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM4ODM3OSwiZXhwIjoyMDgwOTY0Mzc5fQ.tQTpdQCkE-V-aCfdt7GgN5FF-IdXQzGCAEuRE6gNupE"
)

BASE_URL = "http://api.llexeter.co.uk"
BATCH_SIZE = 500


def flatten_desc(desc) -> str:
    """Convert LL Exeter's nested desc dict to a plain string."""
    if not desc or not isinstance(desc, dict):
        return ""
    parts = []
    for k, v in desc.items():
        if k.isdigit():
            parts.append(str(v))
        elif isinstance(v, list):
            parts.extend(v)
    return " ".join(str(p) for p in parts if p)


def main():
    print("=== BL Motorcycles — LL Exeter Full Catalog Ingest ===")

    # 1. Fetch all codes
    print("Fetching code list...", end=" ", flush=True)
    r = requests.get(f"{BASE_URL}/list", timeout=30)
    data = r.json()
    all_codes = data.get("list", [])
    print(f"{len(all_codes)} codes found.")

    success = 0
    skipped = 0
    errors = 0
    batch = []

    for i, code in enumerate(all_codes):
        try:
            r = requests.get(f"{BASE_URL}/code/{code}", timeout=10)
            p = r.json()

            # Skip discontinued or error responses
            if "error" in p or p.get("discontinued", 0) == 1:
                skipped += 1
                continue

            retail_price = float(p.get("retail_price") or 0)
            if retail_price <= 0:
                skipped += 1
                continue

            stock = int(p.get("stock") or 0)
            images = p.get("images") or []
            img_url = images[0] if images else None

            # Determine brand from name
            name = p.get("name") or p.get("fullname") or code
            brand = "Lextek" if "lextek" in name.lower() else "LL Exeter"

            description = flatten_desc(p.get("desc")) or p.get("fullname") or name

            batch.append({
                "sku": code,
                "supplier_sku": code,
                "supplier_id": "LLEXETER",
                "title": name,
                "brand": brand,
                "trade_price": round(retail_price * 0.65, 2),
                "retail_price": retail_price,
                "selling_price": round(retail_price * 0.95, 2),
                "stock_level": stock,
                "image_url": img_url,
                "category": p.get("lextek_category") or p.get("category"),
                "description": description,
                "is_active_on_ebay": False,  # Don't auto-list — review first
            })
            success += 1

        except Exception as e:
            errors += 1

        # Progress every 500
        if (i + 1) % 500 == 0:
            print(f"  [{i+1}/{len(all_codes)}] processed | {success} queued | {skipped} skipped | {errors} errors")

        # Upsert in batches of 500
        if len(batch) >= BATCH_SIZE:
            supabase.table("products").upsert(batch, on_conflict="sku").execute()
            print(f"  >> Upserted batch of {len(batch)}")
            batch = []

    # Final batch
    if batch:
        supabase.table("products").upsert(batch, on_conflict="sku").execute()
        print(f"  >> Upserted final batch of {len(batch)}")

    print(f"\n=== DONE: {success} ingested | {skipped} skipped | {errors} errors ===")


if __name__ == "__main__":
    main()
