import sys
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import os
import base64
import requests
import xml.etree.ElementTree as ET
from urllib.parse import quote
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv(override=True)

# eBay credentials
EBAY_CLIENT_ID = os.environ.get("EBAY_CLIENT_ID", "BLMotorc-Bikeitsy-PRD-9471f0ac8-7600a277")
EBAY_DEV_ID    = os.environ.get("EBAY_DEV_ID",    "8cb9bb9c-70d3-4409-8d8f-4c9eac24fec3")
EBAY_CERT_ID   = os.environ.get("EBAY_CLIENT_SECRET", "PRD-471f0ac800ad-fd45-4df6-87ab-a208")
EBAY_REFRESH_TOKEN = os.environ.get("EBAY_REFRESH_TOKEN")

# BL Motorcycles Supabase
supabase: Client = create_client(
    "https://ddjuoeyaoxllockcusgf.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkanVvZXlhb3hsbG9ja2N1c2dmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM4ODM3OSwiZXhwIjoyMDgwOTY0Mzc5fQ.tQTpdQCkE-V-aCfdt7GgN5FF-IdXQzGCAEuRE6gNupE"
)


def get_oauth_token() -> str:
    """Get a fresh OAuth access token using the refresh token."""
    b64 = base64.b64encode(f"{EBAY_CLIENT_ID}:{EBAY_CERT_ID}".encode()).decode()
    scopes = "https://api.ebay.com/oauth/api_scope/sell.inventory https://api.ebay.com/oauth/api_scope/sell.account https://api.ebay.com/oauth/api_scope/sell.fulfillment"
    r = requests.post(
        "https://api.ebay.com/identity/v1/oauth2/token",
        data={"grant_type": "refresh_token", "refresh_token": EBAY_REFRESH_TOKEN, "scope": scopes},
        headers={"Content-Type": "application/x-www-form-urlencoded", "Authorization": f"Basic {b64}"}
    )
    if r.status_code != 200:
        raise Exception(f"Token refresh failed: {r.text}")
    token = r.json().get("access_token")
    print(f"[OAuth] Fresh access token obtained (expires in 2h)")
    return token


def create_ebay_listing(product, access_token: str):
    url = "https://api.ebay.com/ws/api.dll"

    headers = {
        "X-EBAY-API-CALL-NAME": "AddItem",
        "X-EBAY-API-SITEID": "3",  # UK
        "X-EBAY-API-APP-NAME": EBAY_CLIENT_ID,
        "X-EBAY-API-DEV-NAME": EBAY_DEV_ID,
        "X-EBAY-API-CERT-NAME": EBAY_CERT_ID,
        "X-EBAY-API-COMPATIBILITY-LEVEL": "967",
        "X-EBAY-API-IAF-TOKEN": access_token,  # OAuth — no RequesterCredentials in XML
        "Content-Type": "text/xml"
    }

    title = product['title'][:80]
    brand = product.get('brand') or 'Bike It'
    sku = product.get('sku', '')
    description = f"<h1>{product['title']}</h1><p>Genuine {brand} Part. High quality replacement/upgrade.</p><p>SKU: {sku}</p>"
    qty = min(product.get('stock_level') or 1, 5)
    price = product.get('selling_price') or product.get('retail_price') or 9.99
    img_url = product.get('image_url') or ''
    valid_img = img_url.startswith('http://') or img_url.startswith('https://')
    if valid_img:
        parts = img_url.split('/', 3)
        if len(parts) == 4:
            img_url = '/'.join(parts[:3]) + '/' + quote(parts[3], safe='/')
    pic_block = f"<PictureDetails><PictureURL>{img_url}</PictureURL></PictureDetails>" if valid_img else ""

    xml_data = f"""<?xml version="1.0" encoding="utf-8"?>
<AddItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <ErrorLanguage>en_GB</ErrorLanguage>
  <WarningLevel>High</WarningLevel>
  <Item>
    <Title><![CDATA[{title}]]></Title>
    <Description><![CDATA[{description}]]></Description>
    <PrimaryCategory>
      <CategoryID>179753</CategoryID>
    </PrimaryCategory>
    <StartPrice>{price}</StartPrice>
    <ConditionID>1000</ConditionID>
    <Country>GB</Country>
    <Currency>GBP</Currency>
    <DispatchTimeMax>3</DispatchTimeMax>
    <ListingDuration>GTC</ListingDuration>
    <ListingType>FixedPriceItem</ListingType>
    <ItemSpecifics>
      <NameValueList><Name>Brand</Name><Value><![CDATA[{brand}]]></Value></NameValueList>
      <NameValueList><Name>Manufacturer Part Number</Name><Value>{sku}</Value></NameValueList>
    </ItemSpecifics>
    {pic_block}
    <PostalCode>PO14 1BA</PostalCode>
    <Quantity>{qty}</Quantity>
    <ShippingDetails>
      <ShippingType>Flat</ShippingType>
      <ShippingServiceOptions>
        <ShippingServicePriority>1</ShippingServicePriority>
        <ShippingService>UK_OtherCourier</ShippingService>
        <ShippingServiceCost>0.00</ShippingServiceCost>
      </ShippingServiceOptions>
    </ShippingDetails>
    <Site>UK</Site>
  </Item>
</AddItemRequest>"""

    try:
        response = requests.post(url, data=xml_data.encode("utf-8"), headers=headers)
        root = ET.fromstring(response.text)
        ns = "{urn:ebay:apis:eBLBaseComponents}"
        ack = root.find(f"{ns}Ack").text

        if ack in ["Success", "Warning"]:
            item_id = root.find(f"{ns}ItemID").text
            return {"success": True, "item_id": item_id}
        else:
            errors = root.findall(f".//{ns}Errors")
            msgs = [e.find(f"{ns}LongMessage").text for e in errors if e.find(f"{ns}LongMessage") is not None]
            return {"success": False, "errors": msgs}
    except Exception as e:
        return {"success": False, "errors": [str(e)]}


def main():
    print("=== BL Motorcycles — eBay Sync (Top 500) ===")

    # Get fresh OAuth token
    access_token = get_oauth_token()

    # Fetch Top 500 active products with stock
    res = supabase.table("products").select("*").eq("is_active_on_ebay", True).gt("stock_level", 0).limit(330).execute()
    products = res.data
    print(f"Found {len(products)} active products to sync.")

    success_count = 0
    fail_count = 0

    for i, p in enumerate(products):
        print(f"[{i+1}/{len(products)}] {p['sku']} - {p['title'][:40]}...", end=" ")
        result = create_ebay_listing(p, access_token)

        if result['success']:
            print(f"OK -> ItemID {result['item_id']}")
            success_count += 1
        else:
            errs = ', '.join(result['errors'])
            print(f"FAIL -> {errs}")
            fail_count += 1

    print(f"\n=== DONE: {success_count} listed, {fail_count} failed ===")


if __name__ == "__main__":
    main()
