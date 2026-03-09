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

to_enable = [
    "Zu3LSiPctjwD01jE"  # Antigravity CRM -> Marcus Sync
]

HEADERS = {"Content-Type": "application/json"}
for wid in to_enable:
    print(f"Enabling workflow {wid}...")
    r = session.patch(f"{N8N_BASE}/rest/workflows/{wid}", headers=HEADERS, json={"active": True})
    print(f"Result: {r.status_code} - {r.text[:50]}")
