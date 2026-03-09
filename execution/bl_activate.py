import requests, sys, time
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
N8N = "https://n8n.jonnyai.co.uk"
s = requests.Session()
s.post(f"{N8N}/rest/login",
    json={"emailOrLdapLoginId":"info@jonnyai.co.uk","password":"Aprilia100!69."},
    headers={"Content-Type":"application/json"})
H = {"Content-Type":"application/json"}
targets = ["bl-order-cancel","bl-manual-dispatch","bl-sku-alert"]
wfs = s.get(f"{N8N}/rest/workflows?limit=50", headers=H).json().get("data",[])
for wf in wfs:
    nm = wf.get("name","")
    wid = wf.get("id")
    if nm not in targets: continue
    # Get full workflow to get versionId
    full = s.get(f"{N8N}/rest/workflows/{wid}", headers=H).json()
    wdata = full.get("data", full)
    vid = wdata.get("versionId","")
    print(f"  {nm} | {wid} | versionId:{vid[:8]}...")
    # Activate with versionId in POST body
    r = s.post(f"{N8N}/rest/workflows/{wid}/activate",
        headers=H, json={"versionId": vid})
    print(f"    POST activate: {r.status_code} {r.text[:200]}")
    time.sleep(0.5)

# Final check
print("\nFinal status:")
for wf in s.get(f"{N8N}/rest/workflows?limit=50",headers=H).json().get("data",[]):
    if wf.get("name") in targets:
        print(f"  {wf['name']}: active={wf.get('active')}")
