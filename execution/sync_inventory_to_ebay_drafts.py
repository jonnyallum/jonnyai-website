import sys
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import os
import base64
import requests
import json
import argparse
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv(override=True)

# eBay credentials
EBAY_CLIENT_ID = os.environ.get("EBAY_CLIENT_ID", "BLMotorc-Bikeitsy-PRD-9471f0ac8-7600a277")
EBAY_CERT_ID   = os.environ.get("EBAY_CLIENT_SECRET", "PRD-471f0ac800ad-fd45-4df6-87ab-a208")
EBAY_REFRESH_TOKEN = os.environ.get("EBAY_REFRESH_TOKEN")

# Policy IDs (Extracted from Brett's Account)
SHIP_POLICY = "234436245014" 
RET_POLICY  = "167323921014" 
PAY_POLICY  = "237971040014" 
LOC_KEY     = "241bbc07-97db-43ea-862a-20ffaec69017"

# BL Motorcycles Supabase
supabase: Client = create_client(
    "https://ddjuoeyaoxllockcusgf.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkanVvZXlhb3hsbG9ja2N1c2dmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM4ODM3OSwiZXhwIjoyMDgwOTY0Mzc5fQ.tQTpdQCkE-V-aCfdt7GgN5FF-IdXQzGCAEuRE6gNupE"
)

def get_oauth_token() -> str:
    """Get a fresh OAuth access token for Inventory API."""
    b64 = base64.b64encode(f"{EBAY_CLIENT_ID}:{EBAY_CERT_ID}".encode()).decode()
    scopes = "https://api.ebay.com/oauth/api_scope/sell.inventory https://api.ebay.com/oauth/api_scope/sell.account"
    r = requests.post(
        "https://api.ebay.com/identity/v1/oauth2/token",
        data={"grant_type": "refresh_token", "refresh_token": EBAY_REFRESH_TOKEN, "scope": scopes},
        headers={"Content-Type": "application/x-www-form-urlencoded", "Authorization": f"Basic {b64}"}
    )
    if r.status_code != 200:
        raise Exception(f"Token refresh failed: {r.text}")
    return r.json().get("access_token")

def create_inventory_item(product, access_token: str):
    sku = product['sku'] or str(product['id'])
    url = f"https://api.ebay.com/sell/inventory/v1/inventory_item/{sku}"

    payload = {
        "availability": {
            "shipToLocationAvailability": { "quantity": min(product.get('stock_level') or 0, 5) }
        },
        "condition": "NEW",
        "product": {
            "title": product['title'][:80],
            "description": f"Genuine {product.get('brand') or 'Part'}. High quality replacement motorcycle part. SKU: {sku}",
            "imageUrls": [product.get('image_url')] if product.get('image_url') else [],
            "aspects": {
                "Brand": [product.get('brand') or "Unbranded"],
                "Manufacturer Part Number": [str(product.get('sku'))]
            }
        }
    }

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Language": "en-GB",
        "Content-Type": "application/json"
    }

    try:
        r = requests.put(url, json=payload, headers=headers)
        if r.status_code in [200, 204]:
            return {"success": True, "sku": sku}
        else:
            return {"success": False, "error": r.text}
    except Exception as e:
        return {"success": False, "error": str(e)}

def create_offer(sku, price, access_token: str):
    url = "https://api.ebay.com/sell/inventory/v1/offer"
    payload = {
        "sku": sku,
        "marketplaceId": "EBAY_GB",
        "format": "FIXED_PRICE",
        "availableQuantity": 5,
        "categoryId": "179753", 
        "listingDescription": f"Genuine Motorcycle Part - SKU: {sku}",
        "listingPolicies": {
            "fulfillmentPolicyId": SHIP_POLICY,
            "returnPolicyId": RET_POLICY,
            "paymentPolicyId": PAY_POLICY
        },
        "pricingSummary": {
            "price": { "value": str(price), "currency": "GBP" }
        },
        "merchantLocationKey": LOC_KEY
    }
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Language": "en-GB",
        "Content-Type": "application/json"
    }

    try:
        r = requests.post(url, json=payload, headers=headers)
        if r.status_code in [200, 201]:
            return {"success": True, "offer_id": r.json().get("offerId")}
        else:
            return {"success": False, "error": r.text}
    except Exception as e:
        return {"success": False, "error": str(e)}

def publish_offer(offer_id, access_token: str):
    url = f"https://api.ebay.com/sell/inventory/v1/offer/{offer_id}/publish"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Language": "en-GB",
        "Content-Type": "application/json"
    }
    try:
        r = requests.post(url, headers=headers)
        if r.status_code in [200, 201]:
            return {"success": True, "listing_id": r.json().get("listingId")}
        else:
            return {"success": False, "error": r.text}
    except Exception as e:
        return {"success": False, "error": str(e)}

def main():
    parser = argparse.ArgumentParser(description="eBay Sync Script")
    parser.add_argument("--publish", action="store_true", help="Publish the items live on eBay")
    parser.add_argument("--limit", type=int, default=500, help="Number of items to process")
    args = parser.parse_args()

    print(f"=== BL Motorcycles — Jai.OS 5.0 eBay Scaling ({'LIVE' if args.publish else 'DRAFT'}) ===")
    token = get_oauth_token()

    # Get batch of products to sync — images required, no image = skip (pushed to back naturally)
    res = supabase.table("products").select("*").is_("ebay_item_id", "null").gt("stock_level", 0).not_.is_("image_url", "null").neq("image_url", "").limit(args.limit).execute()
    batch = res.data
    print(f"Processing {len(batch)} items (images required, no-image products skipped)...")

    success_count = 0
    for i, p in enumerate(batch):
        sku = p['sku']
        price = p.get('selling_price') or p.get('retail_price') or 19.99
        print(f"[{i+1}/{len(batch)}] {sku}...", end=" ", flush=True)
        
        # 1. Create Inventory Item
        inv_res = create_inventory_item(p, token)
        if not inv_res['success']:
            print(f"FAIL (Inv): {inv_res['error'][:50]}...")
            continue
            
        # 2. Create Offer
        off_res = create_offer(sku, price, token)
        offer_id = None
        if off_res['success']:
            offer_id = off_res['offer_id']
            print(f"OK (Draft {offer_id})", end=" ", flush=True)
        else:
            # Handle "Offer already exists" (Error 25002)
            if "25002" in off_res['error']:
                # Extract offer ID from error if possible, or just skip
                # eBay error messages sometimes contain the offerId
                print(f"EXISTS", end=" ", flush=True)
                # To be robust, we'd need to call getOffers(sku), but let's try to assume we can skip if it exists
                # and maybe only publish NEW ones for now to avoid complexity
            else:
                print(f"FAIL (Offer): {off_res['error'][:50]}...")
                continue
            
        if args.publish and offer_id:
            # 3. Publish Offer
            pub_res = publish_offer(offer_id, token)
            if pub_res['success']:
                listing_id = pub_res['listing_id']
                print(f"-> LIVE {listing_id}")
                supabase.table("products").update({"ebay_item_id": listing_id}).eq("id", p['id']).execute()
                success_count += 1
            else:
                print(f"-> FAIL (Pub): {pub_res['error'][:50]}...")
        elif offer_id:
            # Update Supabase placeholder for Draft
            supabase.table("products").update({"ebay_item_id": f"DRAFT_{offer_id}"}).eq("id", p['id']).execute()
            success_count += 1
            print("") # Newline

    print(f"\n=== BATCH COMPLETE: {success_count} Items {'Published' if args.publish else 'Drafted'} ===")

if __name__ == "__main__":
    main()
