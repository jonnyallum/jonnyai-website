import requests
import json
import os
import time
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv(override=True)

# Supabase Connection
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

BASE_URL = "http://api.llexeter.co.uk"

def get_fitment(code):
    """Fetch compatibility/fitment for a part."""
    try:
        url = f"{BASE_URL}/compatibility/{code}"
        r = requests.get(url, timeout=10)
        if r.status_code == 200:
            data = r.json()
            if isinstance(data, list):
                # Format into a clean string list
                fit_list = [f"{item.get('make')} {item.get('model')}" for item in data if item.get('make')]
                return "\n".join(fit_list[:50]) # Limit to 50 for description
        return ""
    except:
        return ""

def ingest_lextek_engine(limit=500):
    print(f"🚀 --- Starting MEGA LLEXETER (Lextek Focus) Ingestion ---")
    
    # 1. Fetch code list
    try:
        r_list = requests.get(f"{BASE_URL}/list")
        codes = r_list.json().get("list", [])
        print(f"Found {len(codes)} total codes.")
    except Exception as e:
        print(f"Failed to fetch list: {e}")
        return

    # 2. Filter for Lextek or high-value parts (Starting with Lextek patterns)
    # Most Lextek parts have 'L' or specific patterns, but searching title is better.
    # We'll just fetch a large batch and filter locally.
    
    count = 0
    batch_size = 20
    products_to_upsert = []

    for i, code in enumerate(codes):
        if count >= limit:
            break

        print(f"[{count+1}/{limit}] Processing {code}...", end=" ")
        try:
            r_detail = requests.get(f"{BASE_URL}/code/{code}", timeout=10)
            p = r_detail.json()
            
            if "error" in p:
                print("SKIPPED")
                continue

            # Filter for Lextek or specific categories
            name = p.get("name", "").lower()
            if "lextek" not in name:
                # If not Lextek, skip for now to save API calls in this run
                print("Skipped (Non-Lextek)")
                continue

            # Fetch Fitment
            fitment = get_fitment(code)
            
            retail_price = float(p.get("retail_price", 0))
            desc = p.get("fullname", "")
            if fitment:
                desc += f"\n\n--- COMPATIBILITY / FITMENT ---\n{fitment}"

            p_data = {
                "sku": p.get("code"),
                "supplier_sku": p.get("code"),
                "supplier_id": "LLEXETER",
                "title": p.get("name"),
                "brand": "Lextek",
                "trade_price": retail_price * 0.65,
                "retail_price": retail_price,
                "selling_price": retail_price * 0.95,
                "stock_level": int(p.get("stock", 0)),
                "image_url": p.get("images")[0] if p.get("images") and len(p.get("images")) > 0 else None,
                "category": p.get("category"),
                "description": desc,
                "is_active_on_ebay": True
            }

            products_to_upsert.append(p_data)
            count += 1
            print("OK")

            # Progressive Upsert
            if len(products_to_upsert) >= batch_size:
                print(f"Upserting batch of {len(products_to_upsert)}...")
                supabase.table("products").upsert(products_to_upsert, on_conflict="sku").execute()
                products_to_upsert = []

        except Exception as e:
            print(f"ERROR: {e}")

    # Final Upsert
    if products_to_upsert:
        supabase.table("products").upsert(products_to_upsert, on_conflict="sku").execute()

    print(f"\n✅ Finished! Ingested {count} Lextek products with fitment.")

if __name__ == "__main__":
    ingest_lextek_engine(200) # Ingest 200 Lextek items
