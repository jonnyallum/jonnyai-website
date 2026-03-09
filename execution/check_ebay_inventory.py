import os
import requests
import base64
import json
from dotenv import load_dotenv

load_dotenv(override=True)

# eBay credentials
EBAY_CLIENT_ID = os.environ.get("EBAY_CLIENT_ID")
EBAY_CERT_ID   = os.environ.get("EBAY_CLIENT_SECRET")
EBAY_REFRESH_TOKEN = os.environ.get("EBAY_REFRESH_TOKEN")

def get_oauth_token():
    b64 = base64.b64encode(f"{EBAY_CLIENT_ID}:{EBAY_CERT_ID}".encode()).decode()
    r = requests.post(
        "https://api.ebay.com/identity/v1/oauth2/token",
        data={"grant_type": "refresh_token", "refresh_token": EBAY_REFRESH_TOKEN, "scope": "https://api.ebay.com/oauth/api_scope/sell.inventory"},
        headers={"Authorization": f"Basic {b64}"}
    )
    return r.json().get("access_token")

def check_inventory():
    token = get_oauth_token()
    # List first 10 inventory items
    url = "https://api.ebay.com/sell/inventory/v1/inventory_item?limit=10"
    r = requests.get(url, headers={"Authorization": f"Bearer {token}"})
    data = r.json()
    total = data.get('total', 0)
    print(f"Total Inventory Items Found: {total}")
    # print(json.dumps(data, indent=2))

if __name__ == "__main__":
    check_inventory()
