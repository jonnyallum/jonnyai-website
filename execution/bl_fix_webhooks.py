import requests, sys, time, json
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
N8N = "https://n8n.jonnyai.co.uk"
s = requests.Session()
s.post(f"{N8N}/rest/login",
    json={"emailOrLdapLoginId":"info@jonnyai.co.uk","password":"Aprilia100!69."},
    headers={"Content-Type":"application/json"})
H = {"Content-Type":"application/json"}
targets = {"LVhGxQdypNhnIL07":"bl-order-cancel","7fU4cJyQeC9nklEX":"bl-manual-dispatch","B1U78Zdoei3DmgAF":"bl-sku-alert"}
for wid, name in targets.items():
    full = s.get(f"{N8N}/rest/workflows/{wid}", headers=H).json()
    wdata = full.get("data", full)
    vid = wdata.get("versionId","")
    nodes = wdata.get("nodes", [])
    # Fix positions to valid numbers (spacing 300px apart)
    for i, node in enumerate(nodes):
        node["position"] = [i * 300, 0]
    # Deactivate
    s.post(f"{N8N}/rest/workflows/{wid}/deactivate", headers=H, json={"versionId": vid})
    time.sleep(0.5)
    # PATCH workflow with fixed positions
    patch_data = {"name": wdata["name"], "nodes": nodes,
                  "connections": wdata.get("connections",{}),
                  "settings": wdata.get("settings",{}),
                  "staticData": wdata.get("staticData"), "versionId": vid}
    pr = s.patch(f"{N8N}/rest/workflows/{wid}", headers=H, json=patch_data)
    new_data = pr.json().get("data", {})
    new_vid = new_data.get("versionId", vid)
    print(f"  {name}: PATCH={pr.status_code} newVid={new_vid[:8]}...")
    time.sleep(0.5)
    # Re-activate with new versionId
    ar = s.post(f"{N8N}/rest/workflows/{wid}/activate", headers=H, json={"versionId": new_vid})
    ad = ar.json().get("data", {})
    print(f"    Activate={ar.status_code} active={ad.get('active')}")
    time.sleep(1)
# Final webhook test
print("\nTesting webhooks...")
for path in ["bl-order-cancel","bl-sku-alert","bl-manual-dispatch"]:
    r = requests.post(f"{N8N}/webhook/{path}",
        json={"record":{"channel_order_id":"TEST","customer_email":"test@test.com","status":"failed"}}, timeout=10)
    print(f"  /webhook/{path}: {r.status_code}")
