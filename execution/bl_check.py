import requests, sys, json
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
N8N = "https://n8n.jonnyai.co.uk"
s = requests.Session()
s.post(f"{N8N}/rest/login",
    json={"emailOrLdapLoginId":"info@jonnyai.co.uk","password":"Aprilia100!69."},
    headers={"Content-Type":"application/json"})
H = {"Content-Type":"application/json"}
# Fetch bl-order-cancel and inspect webhook node
wfs = s.get(f"{N8N}/rest/workflows?limit=50", headers=H).json().get("data",[])
for wf in wfs:
    if wf.get("name") == "bl-order-cancel":
        full = s.get(f"{N8N}/rest/workflows/{wf['id']}", headers=H).json()
        wdata = full.get("data", full)
        nodes = wdata.get("nodes", [])
        for node in nodes:
            if "webhook" in node.get("type","").lower():
                print("WEBHOOK NODE:")
                print(json.dumps(node, indent=2))
