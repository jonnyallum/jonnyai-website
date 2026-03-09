import requests, sys, json
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

N8N_BASE = "https://n8n.jonnyai.co.uk"
EMAIL    = "info@jonnyai.co.uk"
PASSWORD = "Aprilia100!69."

W_ID = "IXnG6uZu3LSiPctj"

session = requests.Session()
r = session.post(f"{N8N_BASE}/rest/login",
    json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD},
    headers={"Content-Type": "application/json"})
if r.status_code != 200:
    print(f"Login failed {r.status_code}")
    sys.exit(1)

r = session.get(f"{N8N_BASE}/rest/workflows/{W_ID}", headers={"Content-Type": "application/json"})
if r.status_code == 200:
    with open(f".tmp/workflow_{W_ID}.json", "w") as f:
        json.dump(r.json(), f, indent=2)
    print(f"Workflow {W_ID} saved to .tmp/workflow_{W_ID}.json")
else:
    print(f"Failed to fetch {r.status_code}")
