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

def get_locations():
    token = get_oauth_token()
    r = requests.get("https://api.ebay.com/sell/inventory/v1/location", headers={"Authorization": f"Bearer {token}"})
    data = r.json()
    for loc in data.get('locations', []):
        print(f"Location Key: {loc.get('merchantLocationKey')}")

if __name__ == "__main__":
    get_locations()
