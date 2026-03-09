import requests, sys

N8N_BASE = "https://n8n.jonnyai.co.uk"
EMAIL    = "info@jonnyai.co.uk"
PASSWORD = "Aprilia100!69."

session = requests.Session()
r = session.post(f"{N8N_BASE}/rest/login", json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD})

to_delete = [
    "KJqyWHRflNKUeZ55", # Inactive duplicate of CRM Sync
    "rM6UpaZPbR5BdSNZ", # Inactive duplicate of CRM Sync
]

for wid in to_delete:
    print(f"Deleting {wid}...")
    session.delete(f"{N8N_BASE}/rest/workflows/{wid}")
