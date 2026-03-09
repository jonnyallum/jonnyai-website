"""
refresh_n8n_key.py
Logs into n8n with email/password, generates a fresh API key, updates .env
"""
import requests
import json
import re
import sys

N8N_BASE = "https://n8n.jonnyai.co.uk"
EMAIL = "info@jonnyai.co.uk"
PASSWORD = "Aprilia100!69."
ENV_PATH = "c:/Users/jonny/Desktop/JonnyAI_JaiOS_4.0/.env"

session = requests.Session()

# Step 1: Login
print("Logging in to n8n...")
resp = session.post(
    f"{N8N_BASE}/rest/login",
    json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD},
    headers={"Content-Type": "application/json"}
)
print(f"Login status: {resp.status_code}")
if resp.status_code != 200:
    print(f"Login failed: {resp.text[:300]}")
    sys.exit(1)

print("Login OK. Cookies:", dict(session.cookies))

# Step 2: Get existing API keys
resp = session.get(f"{N8N_BASE}/rest/user/api-key")
print(f"Get API key status: {resp.status_code} — {resp.text[:200]}")

# Step 3: Generate new API key
print("\nGenerating new API key...")
resp = session.post(
    f"{N8N_BASE}/rest/user/api-key",
    json={"label": "cline-automation"},
    headers={"Content-Type": "application/json"}
)
print(f"Generate status: {resp.status_code}")
print(f"Response: {resp.text[:500]}")

if resp.status_code in [200, 201]:
    data = resp.json()
    # n8n returns the key in different shapes — find it
    api_key = (
        data.get("apiKey") or
        data.get("data", {}).get("apiKey") or
        data.get("key") or
        data.get("data", {}).get("key") or
        ""
    )
    if not api_key:
        print(f"Could not extract key from: {json.dumps(data, indent=2)}")
        sys.exit(1)

    print(f"\n✅ New API key: {api_key}")

    # Step 4: Update .env
    with open(ENV_PATH, "r", encoding="utf-8-sig", errors="ignore") as f:
        content = f.read()

    # Replace old key
    new_content = re.sub(
        r"N8N_API_KEY=.*",
        f"N8N_API_KEY={api_key}",
        content
    )
    with open(ENV_PATH, "w", encoding="utf-8") as f:
        f.write(new_content)

    print("✅ .env updated with new N8N_API_KEY")
    print(f"\nNew key for reference:\n{api_key}")
else:
    print("❌ Failed to generate key")
    sys.exit(1)
