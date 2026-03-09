import requests, sys, json
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

N8N_BASE = "https://n8n.jonnyai.co.uk"
EMAIL    = "info@jonnyai.co.uk"
PASSWORD = "Aprilia100!69."

session = requests.Session()
r = session.post(f"{N8N_BASE}/rest/login",
    json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD},
    headers={"Content-Type": "application/json"})
if r.status_code != 200:
    print(f"Login failed {r.status_code}")
    sys.exit(1)

r = session.get(f"{N8N_BASE}/rest/workflows", headers={"Content-Type": "application/json"})
if r.status_code == 200:
    with open(".tmp/all_workflows.json", "w") as f:
        json.dump(r.json(), f, indent=2)
    print("All workflows saved to .tmp/all_workflows.json")
else:
    print(f"Failed to fetch {r.status_code}")
