"""
BL Motorcycles — Batch Draft All Products to eBay
Runs sync_inventory_to_ebay_drafts in loops of 500 until all products with images are drafted.
Safe to stop and restart — picks up where it left off (ebay_item_id IS NULL filter).
"""
import sys
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import os
import time
import base64
import requests
import json
from datetime import datetime
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv(override=True)

EBAY_CLIENT_ID    = os.environ.get("EBAY_CLIENT_ID", "BLMotorc-Bikeitsy-PRD-9471f0ac8-7600a277")
EBAY_CERT_ID      = os.environ.get("EBAY_CLIENT_SECRET", "PRD-471f0ac800ad-fd45-4df6-87ab-a208")
EBAY_REFRESH_TOKEN = os.environ.get("EBAY_REFRESH_TOKEN")

SHIP_POLICY = "234436245014"
RET_POLICY  = "167323921014"
PAY_POLICY  = "237971040014"
LOC_KEY     = "241bbc07-97db-43ea-862a-20ffaec69017"

BATCH_SIZE  = 100   # Items per batch (eBay-safe rate)
SLEEP_SEC   = 0.3   # Delay between items (avoid rate limits)
TOKEN_TTL   = 7000  # Refresh token every ~2hrs (7000 seconds)

supabase: Client = create_client(
    "https://ddjuoeyaoxllockcusgf.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkanVvZXlhb3hsbG9ja2N1c2dmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM4ODM3OSwiZXhwIjoyMDgwOTY0Mzc5fQ.tQTpdQCkE-V-aCfdt7GgN5FF-IdXQzGCAEuRE6gNupE"
)


def ts():
    return datetime.now().strftime("%H:%M:%S")


def get_token() -> str:
    b64 = base64.b64encode(f"{EBAY_CLIENT_ID}:{EBAY_CERT_ID}".encode()).decode()
    scopes = "https://api.ebay.com/oauth/api_scope/sell.inventory https://api.ebay.com/oauth/api_scope/sell.account"
    r = requests.post(
        "https://api.ebay.com/identity/v1/oauth2/token",
        data={"grant_type": "refresh_token", "refresh_token": EBAY_REFRESH_TOKEN, "scope": scopes},
        headers={"Content-Type": "application/x-www-form-urlencoded", "Authorization": f"Basic {b64}"}
    )
    if r.status_code != 200:
        raise Exception(f"Token refresh failed: {r.text}")
    print(f"[{ts()}] OAuth token refreshed.")
    return r.json().get("access_token")


def create_inventory_item(product, token: str) -> bool:
    sku = str(product['sku'])
    payload = {
        "availability": {"shipToLocationAvailability": {"quantity": min(product.get('stock_level') or 0, 5)}},
        "condition": "NEW",
        "product": {
            "title": product['title'][:80],
            "description": f"Genuine {product.get('brand') or 'Part'}. Motorcycle replacement part. SKU: {sku}",
            "imageUrls": [product['image_url']],
            "aspects": {
                "Brand": [product.get('brand') or "Unbranded"],
                "Manufacturer Part Number": [sku]
            }
        }
    }
    r = requests.put(
        f"https://api.ebay.com/sell/inventory/v1/inventory_item/{sku}",
        json=payload,
        headers={"Authorization": f"Bearer {token}", "Content-Language": "en-GB", "Content-Type": "application/json"}
    )
    return r.status_code in [200, 204]


def create_or_get_offer(sku, price, token: str) -> str | None:
    """Create offer — if already exists (25002) fetch the existing offer ID via getOffers."""
    payload = {
        "sku": sku,
        "marketplaceId": "EBAY_GB",
        "format": "FIXED_PRICE",
        "availableQuantity": 5,
        "categoryId": "179753",
        "listingDescription": f"Genuine Motorcycle Part. SKU: {sku}",
        "listingPolicies": {
            "fulfillmentPolicyId": SHIP_POLICY,
            "returnPolicyId": RET_POLICY,
            "paymentPolicyId": PAY_POLICY
        },
        "pricingSummary": {"price": {"value": str(round(float(price), 2)), "currency": "GBP"}},
        "merchantLocationKey": LOC_KEY
    }
    headers = {"Authorization": f"Bearer {token}", "Content-Language": "en-GB", "Content-Type": "application/json"}
    r = requests.post("https://api.ebay.com/sell/inventory/v1/offer", json=payload, headers=headers)

    if r.status_code in [200, 201]:
        return r.json().get("offerId")

    # Offer already exists — fetch real offer ID
    if r.status_code == 409 or (r.status_code == 400 and "25002" in r.text):
        gr = requests.get(
            f"https://api.ebay.com/sell/inventory/v1/offer?sku={sku}&marketplace_id=EBAY_GB",
            headers={"Authorization": f"Bearer {token}"}
        )
        if gr.status_code == 200 and gr.json().get("offers"):
            return gr.json()["offers"][0].get("offerId")

    return None


def count_remaining() -> int:
    r = supabase.table("products").select("id", count="exact") \
        .is_("ebay_item_id", "null").gt("stock_level", 0) \
        .not_.is_("image_url", "null").neq("image_url", "").execute()
    return r.count or 0


def main():
    print(f"\n{'='*60}")
    print(f"  BL Motorcycles — Batch Draft to eBay")
    print(f"  Batch size: {BATCH_SIZE} | Delay: {SLEEP_SEC}s/item")
    print(f"{'='*60}\n")

    remaining = count_remaining()
    print(f"[{ts()}] Products left to draft: {remaining}")
    if remaining == 0:
        print("Nothing to do — all products already drafted!")
        return

    token = get_token()
    token_fetched_at = time.time()

    total_success = 0
    total_fail = 0
    batch_num = 0

    while True:
        # Refresh token if near expiry
        if time.time() - token_fetched_at > TOKEN_TTL:
            token = get_token()
            token_fetched_at = time.time()

        # Fetch next batch
        res = supabase.table("products").select("*") \
            .is_("ebay_item_id", "null").gt("stock_level", 0) \
            .not_.is_("image_url", "null").neq("image_url", "") \
            .limit(BATCH_SIZE).execute()

        batch = res.data
        if not batch:
            break

        batch_num += 1
        print(f"\n[{ts()}] --- Batch {batch_num} ({len(batch)} items) ---")

        for i, p in enumerate(batch):
            sku = str(p['sku'])
            price = p.get('selling_price') or p.get('retail_price') or 19.99

            # 1. Inventory item
            inv_ok = create_inventory_item(p, token)
            if not inv_ok:
                print(f"  [{i+1}] {sku} SKIP (inv fail)")
                total_fail += 1
                time.sleep(SLEEP_SEC)
                continue

            # 2. Offer (create or retrieve existing)
            offer_id = create_or_get_offer(sku, price, token)
            if offer_id:
                supabase.table("products").update({"ebay_item_id": f"DRAFT_{offer_id}"}).eq("id", p['id']).execute()
                print(f"  [{i+1}] {sku} OK -> DRAFT_{offer_id}")
                total_success += 1
            else:
                print(f"  [{i+1}] {sku} FAIL (offer)")
                total_fail += 1

            time.sleep(SLEEP_SEC)

        remaining = count_remaining()
        print(f"[{ts()}] Batch {batch_num} done. Remaining: {remaining} | Total: +{total_success} drafted, {total_fail} failed")

        if remaining == 0:
            break

        # Brief pause between batches
        time.sleep(2)

    print(f"\n{'='*60}")
    print(f"  COMPLETE: {total_success} drafted, {total_fail} failed")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    main()
