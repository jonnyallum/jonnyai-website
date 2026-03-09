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
    
    # Login
    print("🔐 Logging into n8n...")
    r = session.post(f"{N8N_BASE}/rest/login",
        json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD},
        headers={"Content-Type": "application/json"},
        verify=verify_ssl)
    
    if r.status_code != 200:
        print(f"❌ Login failed: {r.status_code}")
        return
    print("✅ Logged in.")

    # Get all workflows
    r = session.get(f"{N8N_BASE}/rest/workflows", verify=verify_ssl)
    if r.status_code != 200:
        print(f"❌ Failed to fetch workflows: {r.status_code}")
        return
    
    workflows = r.json().get("data", [])
    print(f"📋 Found {len(workflows)} workflows.")
    
    results = []
    for w in workflows:
        wid = w['id']
        name = w['name']
        is_active = w.get('active', False)
        
        if is_active:
            print(f"🟢 Already active: {name} (ID={wid})")
            results.append((name, "ALREADY_ACTIVE"))
            continue
            
        print(f"⚡ Activating: {name} (ID={wid})...")
        ra = session.post(f"{N8N_BASE}/rest/workflows/{wid}/activate", verify=verify_ssl)
        if ra.status_code == 200:
            print(f"  ✅ SUCCESS")
            results.append((name, "ACTIVATED"))
        else:
            print(f"  ❌ FAILED: {ra.status_code} - {ra.text[:100]}")
            results.append((name, f"FAILED:{ra.status_code}"))

    print("\n" + "="*60)
    print("📊 FINAL ACTIVATION REPORT")
    print("="*60)
    for name, status in results:
        icon = "✅" if "ACTIVE" in status else "❌"
        print(f"  {icon} {name:40s} | {status}")

if __name__ == "__main__":
    main()
