import requests, sys, json
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

N8N_BASE = "https://n8n.jonnyai.co.uk"
EMAIL    = "info@jonnyai.co.uk"
PASSWORD = "Aprilia100!69."

session = requests.Session()

# ── LOGIN ──────────────────────────────────────────────────────────────────────
print("Logging in...")
r = session.post(f"{N8N_BASE}/rest/login",
    json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD},
    headers={"Content-Type": "application/json"})
if r.status_code != 200:
    print(f"Login failed {r.status_code}: {r.text[:200]}")
    sys.exit(1)
print("Login OK ✅")

HEADERS = {"Content-Type": "application/json"}

# ── HELPER ─────────────────────────────────────────────────────────────────────
def list_existing():
    r = session.get(f"{N8N_BASE}/rest/workflows", headers=HEADERS)
    if r.status_code == 200:
        d = r.json()
        data = d.get("data", d) if isinstance(d, dict) else d
        return data
    print(f"Could not list workflows: {r.status_code}")
    return []

def deploy(workflow_def):
    name = workflow_def["name"]
    existing = list_existing()
    match = next((w for w in existing if w.get("name") == name), None)
    if match:
        print(f"⚠️  Already exists: [{match['id']}] {name} — updating...")
        r = session.put(f"{N8N_BASE}/rest/workflows/{match['id']}",
            headers=HEADERS, json=workflow_def)
        if r.status_code == 200:
            print(f"✅ Updated: [{match['id']}] {name}")
            return match["id"]
        else:
            print(f"❌ Update failed [{r.status_code}]: {r.text[:300]}")
            return None
    r = session.post(f"{N8N_BASE}/rest/workflows",
        headers=HEADERS, json=workflow_def)
    if r.status_code in [200, 201]:
        wid = r.json().get("id", "?")
        print(f"✅ Created: [{wid}] {name}")
        # Activate it
        session.patch(f"{N8N_BASE}/rest/workflows/{wid}",
            headers=HEADERS, json={"active": True})
        return wid
    else:
        print(f"❌ Failed [{r.status_code}]: {r.text[:300]}")
        return None

# ── WORKFLOW: CRM TO MARCUS SYNC ──────────────────────────────────────────────
WF_CRM_SYNC = {
    "name": "Antigravity CRM -> Marcus Sync",
    "active": True,
    "nodes": [
        {"id":"n1","name":"Webhook: CRM Event","type":"n8n-nodes-base.webhook",
         "typeVersion":2,"position":[240,300],
         "parameters":{"httpMethod":"POST","path":"crm-webhook",
                        "responseMode":"onReceived","responseData":"firstEntryJson"}},
        {"id":"n2","name":"Log to Chatroom (@Marcus)","type":"n8n-nodes-base.httpRequest",
         "typeVersion":4,"position":[460,300],
         "parameters":{"method":"POST",
             "url":"https://lkwydqtfbdjhxaarelaz.supabase.co/rest/v1/chatroom",
             "sendHeaders":True,"headerParameters":{"parameters":[
                 {"name":"apikey","value":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxrd3lkcXRmYmRqaHhhYXJlbGF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDI5ODI4MiwiZXhwIjoyMDg1ODc0MjgyfQ.35gJkeetflYO5FYXrjELwikxqFvcScxFCQr5qDD-Z24"},
                 {"name":"Authorization","value":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxrd3lkcXRmYmRqaHhhYXJlbGF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDI5ODI4MiwiZXhwIjoyMDg1ODc0MjgyfQ.35gJkeetflYO5FYXrjELwikxqFvcScxFCQr5qDD-Z24"}
             ]},
             "sendBody":True,"specifyBody":"json","jsonBody":
                 '{"agent_id":"marcus","message":"🔔 CRM Event Received: {{ $json.body.action || \'Update\' }} on {{ $json.body.object_name || \'Record\' }}\\nData: {{ JSON.stringify($json.body.data) }}","message_type":"broadcast","ai_source":"n8n-crm-sync"}'
         }}
    ],
    "connections": {
        "Webhook: CRM Event": {"main":[[{"node":"Log to Chatroom (@Marcus)","type":"main","index":0}]]}
    },
    "settings":{"executionOrder":"v1","saveManualExecutions":True}
}

# ── MAIN ──────────────────────────────────────────────────────────────────────
print("\n=== Deploying CRM n8n Workflows ===\n")
ids = {}
for wf in [WF_CRM_SYNC]:
    wid = deploy(wf)
    if wid:
        ids[wf["name"]] = wid

print("\n=== DEPLOYMENT SUMMARY ===")
for name, wid in ids.items():
    print(f"  [{wid}] {name}")

print("\n=== SUPABASE WEBHOOK ENDPOINTS ===")
print(f"  CRM Webhook : POST {N8N_BASE}/webhook/crm-webhook")
print("\nConfigure this webhook in Twenty CRM (Settings -> Integrations -> Webhooks)")
