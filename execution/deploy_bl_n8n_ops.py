"""
Deploy BL Motorcycles n8n Ops Workflows (4 new)
Uses session cookie auth like deploy_bl_n8n_workflows.py
"""
import requests, sys, json, os
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

N8N_BASE = "https://n8n.jonnyai.co.uk"
EMAIL    = "info@jonnyai.co.uk"
PASSWORD = "Aprilia100!69."

session = requests.Session()

print("Logging in to n8n...")
r = session.post(f"{N8N_BASE}/rest/login",
    json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD},
    headers={"Content-Type": "application/json"})
if r.status_code != 200:
    print(f"Login failed {r.status_code}: {r.text[:200]}")
    sys.exit(1)
print("Login OK")

HEADERS = {"Content-Type": "application/json"}
WF_DIR = os.path.join(os.path.dirname(__file__), "..", "Clients", "BL-Motorcycles-Enterprise", "n8n-workflows")

WORKFLOWS = [
    "workflow_dispatch_email.json",
    "workflow_overdue_escalator.json",
    "workflow_oversell_guard.json",
    "workflow_weekly_summary.json",
]

def list_existing():
    r = session.get(f"{N8N_BASE}/rest/workflows", headers=HEADERS)
    if r.status_code == 200:
        d = r.json()
        return d.get("data", d) if isinstance(d, dict) else d
    return []

def deploy(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        wf = json.load(f)
    name = wf.get("name", os.path.basename(filepath))
    existing = list_existing()
    match = next((w for w in existing if w.get("name") == name), None)
    if match:
        print(f"  Already exists [{match['id']}] {name} - updating...")
        r = session.put(f"{N8N_BASE}/rest/workflows/{match['id']}",
            headers=HEADERS, json=wf)
        if r.status_code == 200:
            session.patch(f"{N8N_BASE}/rest/workflows/{match['id']}",
                headers=HEADERS, json={"active": True})
            print(f"  Updated + activated [{match['id']}]")
            return match["id"]
        print(f"  Update failed: {r.status_code}")
        return None

    r = session.post(f"{N8N_BASE}/rest/workflows", headers=HEADERS, json=wf)
    if r.status_code in [200, 201]:
        wid = r.json().get("id", "?")
        session.patch(f"{N8N_BASE}/rest/workflows/{wid}",
            headers=HEADERS, json={"active": True})
        print(f"  Created + activated [{wid}] {name}")
        return wid
    else:
        print(f"  Failed [{r.status_code}]: {r.text[:200]}")
        return None

print("\n=== Deploying 4 BL Ops Workflows ===\n")
results = {}
for wf_file in WORKFLOWS:
    path = os.path.join(WF_DIR, wf_file)
    if not os.path.exists(path):
        print(f"  File not found: {path}")
        continue
    print(f"Deploying {wf_file}...")
    wid = deploy(path)
    if wid:
        results[wf_file] = wid

print(f"\n=== DONE: {len(results)}/{len(WORKFLOWS)} deployed ===")
for name, wid in results.items():
    print(f"  [{wid}] {name}")
