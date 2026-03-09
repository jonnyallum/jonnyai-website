import requests
import base64
import os
from dotenv import load_dotenv
import sys

if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

load_dotenv(override=True)

EBAY_CLIENT_ID  = "BLMotorc-Bikeitsy-PRD-9471f0ac8-7600a277"
EBAY_CERT_ID    = "PRD-471f0ac800ad-fd45-4df6-87ab-a208"
EBAY_REFRESH    = os.environ.get("EBAY_REFRESH_TOKEN")

def get_token():
    b64 = base64.b64encode(f"{EBAY_CLIENT_ID}:{EBAY_CERT_ID}".encode()).decode()
    r = requests.post(
        "https://api.ebay.com/identity/v1/oauth2/token",
        data={"grant_type": "refresh_token", "refresh_token": EBAY_REFRESH,
              "scope": "https://api.ebay.com/oauth/api_scope"},
        headers={"Content-Type": "application/x-www-form-urlencoded", "Authorization": f"Basic {b64}"}
    )
    return r.json()["access_token"]

def get_item_info(item_id):
    token = get_token()
    headers = {
        "X-EBAY-API-CALL-NAME": "GetItem",
        "X-EBAY-API-SITEID": "3",
        "X-EBAY-API-COMPATIBILITY-LEVEL": "967",
        "X-EBAY-API-IAF-TOKEN": token,
        "Content-Type": "text/xml"
    }
    xml = f"""<?xml version="1.0" encoding="utf-8"?>
<GetItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <ItemID>{item_id}</ItemID>
</GetItemRequest>"""
    r = requests.post("https://api.ebay.com/ws/api.dll", data=xml, headers=headers)
    print(r.text)

if __name__ == "__main__":
    get_item_info("197996315012")
