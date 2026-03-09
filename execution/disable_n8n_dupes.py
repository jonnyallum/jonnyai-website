import requests, sys, json

N8N_BASE = "https://n8n.jonnyai.co.uk"
EMAIL    = "info@jonnyai.co.uk"
PASSWORD = "Aprilia100!69."

session = requests.Session()
r = session.post(f"{N8N_BASE}/rest/login", json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD})

to_deactivate = [
    "hqZk5CXtXWBguyEt", # Old generic BL manual dispatch alert, overlaps with LDz7RsTQoaSEnBx3 (the one with Local Stock filter)
    "LVhGxQdypNhnIL07", # Old generic bl-order-cancel, overlaps with 9XitRAsKEG2A4BMh (which has the Switch Cancel Reason setup)
]

for wid in to_deactivate:
    print(f"Deactivating {wid}...")
    session.patch(f"{N8N_BASE}/rest/workflows/{wid}", json={"active": False})
    
print("n8n environment cleaned and duplicates deactivated.")
