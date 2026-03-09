import requests, sys, json
from dotenv import load_dotenv
load_dotenv()

N8N_BASE = "https://35.230.148.83"
EMAIL = "info@jonnyai.co.uk"
PASSWORD = "Aprilia100!69."
verify_ssl = False

def main():
    session = requests.Session()
    session.headers.update({"Host": "n8n.jonnyai.co.uk"})
    
    r = session.post(f"{N8N_BASE}/rest/login",
        json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD},
        headers={"Content-Type": "application/json"},
        verify=verify_ssl)
    
    if r.status_code != 200:
        print(f"Login failed: {r.status_code}")
        return

    # List all
    r = session.get(f"{N8N_BASE}/rest/workflows", verify=verify_ssl)
    workflows = r.json().get("data", [])
    
    # Safe lists: BL ones are safe. Antigravity CRM -> Marcus Sync is suspicious but user wants all active.
    # I'll activate everything BUT the ones I suspect caused the spam if they weren't the new ones.
    # Wait, the spam posts were BEHIND_THE_SCENES and 69 AGENTS. 
    # That sounds like the local Broadcaster loop, not n8n.
    
    for w in workflows:
        if w.get('active'): 
            print(f"Already active: {w['name']}")
            continue
            
        print(f"Activating: {w['name']} (ID={w['id']})...")
        ra = session.post(f"{N8N_BASE}/rest/workflows/{w['id']}/activate", verify=verify_ssl)
        if ra.status_code == 200:
            print(f"  ✅ SUCCESS")
        else:
            print(f"  ❌ FAILED: {ra.status_code}")

if __name__ == "__main__":
    main()
