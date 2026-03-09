import requests, sys, json
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

N8N_BASE = "https://35.230.148.83"
EMAIL    = "info@jonnyai.co.uk"
PASSWORD = "Aprilia100!69."
W_ID     = "IXnG6uZu3LSiPctj"
verify_ssl = False

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

with open(".tmp/workflow_updated.json", "r") as f:
    full_data = json.load(f)

# The API expects just the core workflow properties
update_payload = {
    "nodes": full_data["nodes"],
    "connections": full_data["connections"]
}

print(f"Updating workflow {W_ID}...")
r = session.patch(f"{N8N_BASE}/rest/workflows/{W_ID}",
    json=update_payload,
    headers={"Content-Type": "application/json"},
    verify=verify_ssl)

if r.status_code == 200:
    print(f"Workflow {W_ID} successfully updated.")
    # Activate
    r = session.post(f"{N8N_BASE}/rest/workflows/{W_ID}/activate", verify=verify_ssl)
    print(f"Workflow activation: {r.status_code}")
else:
    print(f"Failed to update workflow: {r.status_code}")
    print(r.text)
