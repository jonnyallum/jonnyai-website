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
        data={"grant_type": "refresh_token", "refresh_token": EBAY_REFRESH_TOKEN, "scope": "https://api.ebay.com/oauth/api_scope/sell.inventory https://api.ebay.com/oauth/api_scope/sell.account"},
        headers={"Authorization": f"Basic {b64}"}
    )
    return r.json().get("access_token")

def extract_policies():
    token = get_oauth_token()
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    
    results = {}
    for ptype in ["fulfillment", "return", "payment"]:
        r = requests.get(f"https://api.ebay.com/sell/account/v1/{ptype}_policy?marketplace_id=EBAY_GB", headers=headers)
        data = r.json()
        results[ptype] = data.get(f"{ptype}Policies", [])
    
    # Save to JSON for reference
    with open("ebay_policies.json", "w") as f:
        json.dump(results, f, indent=2)
    
    print("Policies saved to ebay_policies.json")
    for ptype, policies in results.items():
        print(f"\n--- {ptype.upper()} ---")
        for p in policies:
            print(f"[{'D' if p.get('default') else ' '}] {p.get('name')}: {p.get(ptype + 'PolicyId')}")

if __name__ == "__main__":
    extract_policies()
