import requests, sys, json
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

N8N_BASE = "https://35.230.148.83"
# Disable SSL verification for IP access
verify_ssl = False


EMAIL    = "info@jonnyai.co.uk"
PASSWORD = "Aprilia100!69."

session = requests.Session()
session.headers.update({"Host": "n8n.jonnyai.co.uk"})

print("Logging in...")
r = session.post(f"{N8N_BASE}/rest/login",
    json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD},
    headers={"Content-Type": "application/json"},
    verify=verify_ssl)
if r.status_code != 200:
    print(f"Login failed {r.status_code}")
    sys.exit(1)

r = session.get(f"{N8N_BASE}/rest/workflows", headers={"Content-Type": "application/json"}, verify=verify_ssl)

workflows = r.json().get("data", [])

print("--- ACTIVE WORKFLOWS ---")
for w in workflows:
    # Print all just in case
    status = "REALLY ACTIVE" if w.get('active') else "INACTIVE"
    print(f"ID: '{w['id']}' | Name: '{w['name']}' | Status: {status}")

