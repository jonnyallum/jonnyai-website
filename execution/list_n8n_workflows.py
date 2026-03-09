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

r = session.get(f"{N8N_BASE}/rest/workflows", headers={"Content-Type": "application/json"})
workflows = r.json().get("data", [])

print("--- ACTIVE WORKFLOWS ---")
for w in workflows:
    if w.get('active'):
        print(f"[{w['id']}] {w['name']}")
