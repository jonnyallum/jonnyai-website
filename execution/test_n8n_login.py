import requests
import sys

N8N_BASE = "https://n8n.jonnyai.co.uk"

# Try info@jonnyai.co.uk
r = requests.post(f"{N8N_BASE}/rest/login", 
    json={"emailOrLdapLoginId": "info@jonnyai.co.uk", "password": "Aprilia100!69."},
    headers={"Content-Type": "application/json"})

if r.status_code == 200:
    print("SUCCESS info@jonnyai.co.uk")
else:
    print(f"FAILED info@jonnyai.co.uk: {r.status_code} {r.text}")
    
    # Try crm@jonnyai.co.uk
    r2 = requests.post(f"{N8N_BASE}/rest/login", 
        json={"emailOrLdapLoginId": "crm@jonnyai.co.uk", "password": "Aprilia100!69."},
        headers={"Content-Type": "application/json"})
    
    if r2.status_code == 200:
        print("SUCCESS crm@jonnyai.co.uk")
    else:
        print(f"FAILED crm@jonnyai.co.uk: {r2.status_code} {r2.text}")
