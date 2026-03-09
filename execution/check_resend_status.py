import os
import requests
from dotenv import load_dotenv

import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

load_dotenv()

RESEND_API_KEY = os.getenv("RESEND_API_KEY")

def check_resend_status():
    if not RESEND_API_KEY:
        print("❌ RESEND_API_KEY not found in .env")
        return

    print(f"🔍 Checking Resend API status...")
    
    # Check API key by listing domains
    url = "https://api.resend.com/domains"
    headers = {
        "Authorization": f"Bearer {RESEND_API_KEY}"
    }

    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            domains = response.json().get("data", [])
            print(f"✅ API Key Valid. Found {len(domains)} domains.")
            import json
            print(json.dumps(domains, indent=2))
        else:
            print(f"❌ API Error: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Connection Error: {e}")

if __name__ == "__main__":
    check_resend_status()
