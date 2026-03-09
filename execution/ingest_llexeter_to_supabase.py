import requests
import json
import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv(override=True)

# Supabase BL
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Supabase credentials missing from .env")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

BASE_URL = "http://api.llexeter.co.uk"

def ingest_batch(limit=50):
    print(f"--- Starting Llexeter Ingestion ({limit} items) ---")
    
    # 1. Fetch code list
    try:
        r_list = requests.get(f"{BASE_URL}/list")
        codes_data = r_list.json()
        codes = codes_data.get("list", [])
        print(f"Found {len(codes)} total codes.")
    except Exception as e:
        print(f"Failed to fetch list: {e}")
        return

    # 2. Fetch details for a batch
    batch_codes = codes[:limit]
    products_to_upsert = []

    for i, code in enumerate(batch_codes):
        print(f"[{i+1}/{limit}] Fetching {code}...", end=" ")
        try:
            r_detail = requests.get(f"{BASE_URL}/code/{code}", timeout=10)
            p = r_detail.json()
            
            if "error" in p:
                print(f"SKIPPED (Not found)")
                continue

            # Mandatory Fields: 
            # title, sku, brand, trade_price, retail_price, selling_price, 
            # stock_level, category, image_url, description, supplier_id, is_active_on_ebay
            
            retail_price = float(p.get("retail_price", 0))
            
            p_data = {
                "sku": p.get("code"),
                "supplier_sku": p.get("code"), # Store original code
                "supplier_id": "LLEXETER",
                "title": p.get("name"),
                "brand": "Lextek" if "lextek" in p.get("name", "").lower() else "Llexeter",
                "trade_price": retail_price * 0.65, # Estimate 35% margin
                "retail_price": retail_price,
                "selling_price": retail_price * 0.95, # 5% discount for eBay competitiveness
                "stock_level": int(p.get("stock", 0)),
                "image_url": p.get("images")[0] if p.get("images") and len(p.get("images")) > 0 else None,
                "category": p.get("category"),
                "description": p.get("fullname", ""),
                "is_active_on_ebay": True
            }

            products_to_upsert.append(p_data)
            print("OK")

        except Exception as e:
            print(f"ERROR: {e}")

    # 3. Upsert to Supabase
    if products_to_upsert:
        print(f"\nUpserting {len(products_to_upsert)} products to Supabase...")
        try:
            # Use SKU as the unique key for upsert
            result = supabase.table("products").upsert(products_to_upsert, on_conflict="sku").execute()
            print("Upsert successful.")
        except Exception as e:
            print(f"Upsert failed: {e}")
    else:
        print("No products to upsert.")

if __name__ == "__main__":
    ingest_batch(100) # Ingest 100 items for pilot
