import sys
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import csv
from supabase import create_client, Client

# BL Motorcycles Supabase — ddjuoeyaoxllockcusgf
SUPABASE_URL = "https://ddjuoeyaoxllockcusgf.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkanVvZXlhb3hsbG9ja2N1c2dmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM4ODM3OSwiZXhwIjoyMDgwOTY0Mzc5fQ.tQTpdQCkE-V-aCfdt7GgN5FF-IdXQzGCAEuRE6gNupE"

CATALOG_PATH = r'C:\Users\jonny\Desktop\JonnyAI_JaiOS_5.0\Clients\BL Motorcycles- Dropshipping\bike it sync\01_All_Products_CSV.csv'
STOCK_PATH = r'C:\Users\jonny\Desktop\JonnyAI_JaiOS_5.0\Clients\BL Motorcycles- Dropshipping\Stock\stock_level_Sku_Desc_Qty_SRP.csv'
BATCH_SIZE = 500

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def ingest_catalog():
    print("🚀 @patrick: Beginning Master Catalog Ingestion (Bike It)...")

    # 1. Load Real-time Stock & Price
    stock_map = {}
    with open(STOCK_PATH, mode='r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            sku = row['SKU'].strip()
            stock_map[sku] = {
                "stock": int(row['OnHandQuantity']) if row['OnHandQuantity'] else 0,
                "srp": float(row['SRP']) if row['SRP'] else 0,
                "trade": float(row['Trade']) if row['Trade'] else 0
            }

    # 2. Process Master Catalog with Images
    with open(CATALOG_PATH, mode='r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        batch = []
        total_upserted = 0

        for row in reader:
            sku = row['sku'].strip()
            if not sku:
                continue

            stock_data = stock_map.get(sku, {"stock": 0, "srp": 0, "trade": 0})
            
            # Fallback to catalog data if stock file is missing prices
            trade_price = stock_data["trade"] if stock_data["trade"] > 0 else (float(row['trade']) if row.get('trade') else 0)
            retail_price = stock_data["srp"] if stock_data["srp"] > 0 else (float(row['srp']) if row.get('srp') else 0)

            product = {
                "sku": sku,
                "supplier_id": "BIKEIT",
                "title": row.get('item_title') or row.get('parent_title') or f"Product {sku}",
                "brand": row.get('brand'),
                "image_url": row.get('image1'),
                "trade_price": trade_price,
                "retail_price": retail_price,
                "stock_level": stock_data["stock"],
                "is_active_on_ebay": False # Selection AI will flip this
            }

            batch.append(product)

            if len(batch) >= BATCH_SIZE:
                try:
                    supabase.table("products").upsert(batch, on_conflict="sku").execute()
                    total_upserted += len(batch)
                    print(f"✅ Batch complete. Total ingested: {total_upserted}")
                except Exception as e:
                    print(f"❌ Batch error: {e}")
                batch = []

        # Final batch
        if batch:
            supabase.table("products").upsert(batch, on_conflict="sku").execute()
            total_upserted += len(batch)
            print(f"✅ Ingestion complete. Total: {total_upserted}")

if __name__ == "__main__":
    ingest_catalog()
