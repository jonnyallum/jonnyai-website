"""
BL Motorcycles — eBay Order Poller
Polls eBay Fulfillment API for new orders on our dropshipping listings,
saves them to Supabase orders table for processing.
"""
import sys
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import os
import base64
import json
import requests
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv(override=True)

EBAY_CLIENT_ID  = os.environ.get("EBAY_CLIENT_ID",     "BLMotorc-Bikeitsy-PRD-9471f0ac8-7600a277")
EBAY_CERT_ID    = os.environ.get("EBAY_CLIENT_SECRET", "PRD-471f0ac800ad-fd45-4df6-87ab-a208")
EBAY_REFRESH    = os.environ.get("EBAY_REFRESH_TOKEN")

supabase: Client = create_client(
    "https://ddjuoeyaoxllockcusgf.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkanVvZXlhb3hsbG9ja2N1c2dmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM4ODM3OSwiZXhwIjoyMDgwOTY0Mzc5fQ.tQTpdQCkE-V-aCfdt7GgN5FF-IdXQzGCAEuRE6gNupE"
)


def get_token() -> str:
    b64 = base64.b64encode(f"{EBAY_CLIENT_ID}:{EBAY_CERT_ID}".encode()).decode()
    r = requests.post(
        "https://api.ebay.com/identity/v1/oauth2/token",
        data={"grant_type": "refresh_token", "refresh_token": EBAY_REFRESH,
              "scope": "https://api.ebay.com/oauth/api_scope/sell.fulfillment"},
        headers={"Content-Type": "application/x-www-form-urlencoded", "Authorization": f"Basic {b64}"}
    )
    if r.status_code != 200:
        raise Exception(f"Token failed: {r.text}")
    return r.json()["access_token"]


def fetch_new_orders(token: str, hours_back: int = 24) -> list[dict]:
    """Fetch orders created in the last N hours that are awaiting fulfilment."""
    since = (datetime.now(timezone.utc) - timedelta(hours=hours_back)).strftime("%Y-%m-%dT%H:%M:%S.000Z")
    url = f"https://api.ebay.com/sell/fulfillment/v1/order?filter=creationdate:[{since}..],orderfulfillmentstatus:{{NOT_STARTED|IN_PROGRESS}}&limit=200"
    r = requests.get(url, headers={"Authorization": f"Bearer {token}"})
    if r.status_code != 200:
        raise Exception(f"GetOrders failed: {r.text}")
    return r.json().get("orders", [])


def get_our_item_ids() -> set[str]:
    """Get the eBay item IDs of our dropshipping listings from Supabase."""
    res = supabase.table("products").select("ebay_item_id").eq("supplier_id", "BIKEIT").eq("is_active_on_ebay", True).execute()
    return {row["ebay_item_id"] for row in res.data if row.get("ebay_item_id")}


def get_sku_for_item_id(item_id: str) -> str | None:
    """Reverse lookup: eBay ItemID → our SKU."""
    res = supabase.table("products").select("sku,trade_price").eq("ebay_item_id", item_id).limit(1).execute()
    if res.data:
        return res.data[0]
    return None


def order_already_saved(ebay_order_id: str) -> bool:
    res = supabase.table("orders").select("id").eq("ebay_order_id", ebay_order_id).limit(1).execute()
    return len(res.data) > 0


def extract_address(fulfillment_start_instructions: list) -> dict:
    """Pull shipping address from eBay order fulfillment instructions."""
    for inst in fulfillment_start_instructions:
        addr = inst.get("shippingStep", {}).get("shipTo", {})
        if addr:
            contact = addr.get("contactAddress", {})
            return {
                "name":         addr.get("fullName", ""),
                "line1":        contact.get("addressLine1", ""),
                "line2":        contact.get("addressLine2", ""),
                "city":         contact.get("city", ""),
                "county":       contact.get("stateOrProvince", ""),
                "postcode":     contact.get("postalCode", ""),
                "country":      contact.get("countryCode", "GB"),
                "phone":        addr.get("primaryPhone", {}).get("phoneNumber", ""),
            }
    return {}


def save_orders_to_supabase(new_orders: list[dict]) -> int:
    saved = 0
    for order in new_orders:
        ebay_order_id = order.get("orderId")

        if order_already_saved(ebay_order_id):
            continue

        buyer = order.get("buyer", {})
        address = extract_address(order.get("fulfillmentStartInstructions", []))

        line_items = order.get("lineItems", [])
        for item in line_items:
            item_id  = item.get("legacyItemId") or item.get("listingId")
            line_id  = item.get("lineItemId")
            qty      = item.get("quantity", 1)
            price    = float(item.get("lineItemCost", {}).get("value", 0))
            sku      = item.get("sku")  # eBay may return this if set

            # Try to get trade price from our DB
            trade_price = None
            if sku:
                prod = supabase.table("products").select("trade_price").eq("sku", sku).limit(1).execute()
                if prod.data:
                    trade_price = prod.data[0].get("trade_price")

            record = {
                "ebay_order_id":     ebay_order_id,
                "ebay_line_item_id": line_id,
                "ebay_item_id":      item_id,
                "sku":               sku,
                "buyer_username":    buyer.get("username"),
                "buyer_name":        address.get("name"),
                "shipping_address":  address,
                "qty":               qty,
                "sale_price":        price,
                "trade_price":       trade_price,
                "status":            "pending",
                "channel":           "EBAY",
                "fulfillment_status": "PENDING",
                "customer_name":     address.get("name"),
                "items":             [{"sku": sku, "qty": qty, "price": price}],
                "channel_order_id":  ebay_order_id
            }

            try:
                supabase.table("orders").insert(record).execute()
                saved += 1
                print(f"  + Saved order {ebay_order_id} | SKU:{sku} | Qty:{qty} | £{price} | → {address.get('name')} {address.get('postcode')}")
            except Exception as e:
                print(f"  ! Failed to save order {ebay_order_id}: {e}")

    return saved


def poll():
    print(f"\n=== eBay Order Poll | {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} ===")
    token = get_token()
    orders = fetch_new_orders(token, hours_back=24)
    print(f"Found {len(orders)} recent order(s) awaiting fulfilment.")

    if not orders:
        print("Nothing to process.")
        return

    saved = save_orders_to_supabase(orders)
    print(f"Saved {saved} new line item(s) to Supabase orders table.")


if __name__ == "__main__":
    poll()
