import requests, sys, json
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

N8N_BASE = "https://n8n.jonnyai.co.uk"
EMAIL    = "info@jonnyai.co.uk"
PASSWORD = "Aprilia100!69."

def check_workflows():
    session = requests.Session()
    r = session.post(f"{N8N_BASE}/rest/login", json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD})
    if r.status_code != 200:
        print("Login failed")
        return

    workflows_meta = session.get(f"{N8N_BASE}/rest/workflows").json().get("data", [])
    report = []
    
    for meta in workflows_meta:
        wid = meta['id']
        wf_data = session.get(f"{N8N_BASE}/rest/workflows/{wid}").json()
        if 'data' in wf_data:
            wf = wf_data['data']
        else:
            wf = wf_data
            
        name = wf.get('name', 'Unknown')
        active = wf.get('active', False)
        nodes = [n.get('name', 'node') for n in wf.get('nodes', [])]
        conns = bool(wf.get('connections', {}))
        
        report.append({
            "id": wid,
            "name": name,
            "active": active,
            "nodes": nodes,
            "has_connections": conns
        })
        
    with open("tmp_n8n_report.json", "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)

    print("Saved report to tmp_n8n_report.json")

if __name__ == "__main__":
    check_workflows()
