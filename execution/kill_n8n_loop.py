import requests, sys, json
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

N8N_BASE = "https://n8n.jonnyai.co.uk"
EMAIL    = "info@jonnyai.co.uk"
PASSWORD = "Aprilia100!69."

session = requests.Session()

print("Logging in...")
r = session.post(f"{N8N_BASE}/rest/login",
    json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD},
    headers={"Content-Type": "application/json"})
if r.status_code != 200:
    print(f"Login failed {r.status_code}")
    sys.exit(1)

# Correct ID this time
to_disable = [
    "22e0388tq7U9gS2I", # Already disabled probably
    "uQ99B1rK7oYtW4kl"  # Master Supabase Chatroom Orchestrator
]

HEADERS = {"Content-Type": "application/json"}
for wid in to_disable:
    print(f"Disabling workflow {wid}...")
    r = session.patch(f"{N8N_BASE}/rest/workflows/{wid}", headers=HEADERS, json={"active": False})
    print(f"Result: {r.status_code} - {r.text[:50]}")
