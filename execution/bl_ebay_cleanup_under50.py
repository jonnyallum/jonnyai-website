"""
BL Motorcycles — Remove Bike It & CMPO eBay listings under £50
Queries products table for BIKEIT and CMPO/LLEXETER items where retail_price < 50
and is_active_on_ebay = true, then ends those eBay listings via Inventory API.

Usage: python execution/bl_ebay_cleanup_under50.py [--dry-run]
"""
import os, sys, requests, json, time
from dotenv import load_dotenv

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# Load env
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
load_dotenv(os.path.join(os.path.dirname(__file__), '..', 'Clients', 'BL-Motorcycles-Enterprise', '.env'))

DRY_RUN = "--dry-run" in sys.argv

# Supabase
SUPABASE_URL = "https://ddjuoeyaoxllockcusgf.supabase.co"
SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkanVvZXlhb3hsbG9ja2N1c2dmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM4ODM3OSwiZXhwIjoyMDgwOTY0Mzc5fQ.tQTpdQCkE-V-aCfdt7GgN5FF-IdXQzGCAEuRE6gNupE"

sb_headers = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

# eBay
EBAY_AUTH_TOKEN = os.getenv("EBAY_AUTH_TOKEN", "")
EBAY_BASE = "https://api.ebay.com"

ebay_headers = {
    "Authorization": f"Bearer {EBAY_AUTH_TOKEN}",
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Content-Language": "en-GB",
}

def refresh_ebay_token():
    """Try to get a fresh application token using client credentials."""
    client_id = os.getenv("EBAY_CLIENT_ID", "")
    client_secret = os.getenv("EBAY_CLIENT_SECRET", "")
    refresh_token = os.getenv("EBAY_REFRESH_TOKEN", "")
    
    if refresh_token:
        # Use refresh token for user token
        import base64
        creds = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()
        r = requests.post(
            "https://api.ebay.com/identity/v1/oauth2/token",
            headers={
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": f"Basic {creds}"
            },
            data={
                "grant_type": "refresh_token",
                "refresh_token": refresh_token,
                "scope": "https://api.ebay.com/oauth/api_scope/sell.inventory https://api.ebay.com/oauth/api_scope/sell.fulfillment https://api.ebay.com/oauth/api_scope/sell.account"
            }
        )
        if r.status_code == 200:
            token = r.json().get("access_token")
            print(f"  Refreshed eBay token OK (len={len(token)})")
            return token
        else:
            print(f"  Token refresh failed: {r.status_code} {r.text[:200]}")
    return None

# ────────────────────────────────────────────────────
# 1. Query products: BIKEIT + CMPO/LLEXETER, price < £50, active on eBay
# ────────────────────────────────────────────────────
print("=" * 60)
print("BL MOTORCYCLES — eBay Cleanup: Remove items under £50")
print("Suppliers: BIKEIT, CMPO, LLEXETER")
print(f"Mode: {'DRY RUN (no changes)' if DRY_RUN else 'LIVE — will end listings!'}")
print("=" * 60)

# Fetch Bike It items under £50
r1 = requests.get(
    f"{SUPABASE_URL}/rest/v1/products?supplier_id=eq.BIKEIT&retail_price=lt.50&is_active_on_ebay=eq.true&select=id,sku,title,retail_price,trade_price,supplier_id,ebay_listing_id",
    headers=sb_headers
)
bikeit_items = r1.json() if r1.status_code == 200 else []

# Fetch CMPO items under £50
r2 = requests.get(
    f"{SUPABASE_URL}/rest/v1/products?supplier_id=eq.CMPO&retail_price=lt.50&is_active_on_ebay=eq.true&select=id,sku,title,retail_price,trade_price,supplier_id,ebay_listing_id",
    headers=sb_headers
)
cmpo_items = r2.json() if r2.status_code == 200 else []

# Fetch LLEXETER items under £50
r3 = requests.get(
    f"{SUPABASE_URL}/rest/v1/products?supplier_id=eq.LLEXETER&retail_price=lt.50&is_active_on_ebay=eq.true&select=id,sku,title,retail_price,trade_price,supplier_id,ebay_listing_id",
    headers=sb_headers
)
llexeter_items = r3.json() if r3.status_code == 200 else []

all_items = bikeit_items + cmpo_items + llexeter_items

print(f"\nFound {len(all_items)} items under £50 active on eBay:")
print(f"  Bike It:   {len(bikeit_items)}")
print(f"  CMPO:      {len(cmpo_items)}")
print(f"  LLEXETER:  {len(llexeter_items)}")

if not all_items:
    print("\nNo items to remove. Done!")
    sys.exit(0)

# Show sample
print(f"\nSample (first 20):")
for item in all_items[:20]:
    print(f"  {item.get('supplier_id'):10s} | {item.get('sku'):20s} | £{item.get('retail_price', 0):6.2f} | {item.get('title', '')[:50]}")

if len(all_items) > 20:
    print(f"  ... and {len(all_items) - 20} more")

# ────────────────────────────────────────────────────
# 2. Refresh eBay token
# ────────────────────────────────────────────────────
print("\n--- Refreshing eBay token ---")
fresh_token = refresh_ebay_token()
if fresh_token:
    ebay_headers["Authorization"] = f"Bearer {fresh_token}"
else:
    print("  Using existing token from .env")

# ────────────────────────────────────────────────────
# 3. For each item: withdraw offer / delete inventory item via eBay Inventory API
# ────────────────────────────────────────────────────
print(f"\n--- {'DRY RUN: Would remove' if DRY_RUN else 'Removing'} {len(all_items)} eBay listings ---\n")

removed = 0
failed = 0
skipped = 0

for i, item in enumerate(all_items):
    sku = item.get("sku", "")
    title = item.get("title", "")[:40]
    price = item.get("retail_price", 0)
    supplier = item.get("supplier_id", "")
    
    if not sku:
        print(f"  [{i+1}] SKIP — no SKU for {title}")
        skipped += 1
        continue
    
    if DRY_RUN:
        print(f"  [{i+1}] DRY RUN: Would remove {supplier} | {sku} | £{price:.2f} | {title}")
        removed += 1
        continue
    
    # Step A: Delete offer for this SKU (withdraws from eBay)
    # First get the offer ID
    r = requests.get(
        f"{EBAY_BASE}/sell/inventory/v1/offer?sku={sku}&limit=10",
        headers=ebay_headers
    )
    
    if r.status_code == 200:
        offers = r.json().get("offers", [])
        for offer in offers:
            offer_id = offer.get("offerId")
            if offer_id:
                # Withdraw the offer (ends listing)
                wr = requests.post(
                    f"{EBAY_BASE}/sell/inventory/v1/offer/{offer_id}/withdraw",
                    headers=ebay_headers
                )
                if wr.status_code in (200, 204):
                    print(f"  [{i+1}] WITHDRAWN offer {offer_id} | {supplier} | {sku} | £{price:.2f}")
                else:
                    print(f"  [{i+1}] Withdraw failed ({wr.status_code}): {sku} — {wr.text[:100]}")
    elif r.status_code == 404:
        # No offers found — may not be listed via Inventory API
        pass
    else:
        if r.status_code == 401:
            print(f"  [{i+1}] AUTH EXPIRED — token needs refresh. Stopping.")
            break
    
    # Step B: Delete the inventory item
    dr = requests.delete(
        f"{EBAY_BASE}/sell/inventory/v1/inventory_item/{sku}",
        headers=ebay_headers
    )
    
    if dr.status_code in (200, 204):
        print(f"  [{i+1}] DELETED from eBay inventory | {supplier} | {sku} | £{price:.2f} | {title}")
        removed += 1
    elif dr.status_code == 404:
        print(f"  [{i+1}] Not in eBay inventory (already removed?) | {sku}")
        skipped += 1
    else:
        print(f"  [{i+1}] Delete failed ({dr.status_code}): {sku} — {dr.text[:100]}")
        failed += 1
    
    # Step C: Update Supabase — mark as inactive on eBay
    requests.patch(
        f"{SUPABASE_URL}/rest/v1/products?id=eq.{item['id']}",
        headers=sb_headers,
        json={"is_active_on_ebay": False}
    )
    
    # Rate limit — eBay allows ~5000 calls/day
    if (i + 1) % 50 == 0:
        print(f"  ... processed {i+1}/{len(all_items)}, pausing 2s...")
        time.sleep(2)

# ────────────────────────────────────────────────────
# Summary
# ────────────────────────────────────────────────────
print(f"\n{'=' * 60}")
print(f"CLEANUP COMPLETE {'(DRY RUN)' if DRY_RUN else ''}")
print(f"  Removed:  {removed}")
print(f"  Failed:   {failed}")
print(f"  Skipped:  {skipped}")
print(f"  Total:    {len(all_items)}")
print(f"{'=' * 60}")
