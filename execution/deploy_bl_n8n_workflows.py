"""
deploy_bl_n8n_workflows.py
Deploys all 3 BL Motorcycles n8n workflows using session cookie auth.
Jai.OS 5.0 | @Nathan / @Marcus
"""
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
        print(f"⚠️  Already exists: [{match['id']}] {name} — skipping")
        return match["id"]
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

# ── WORKFLOW 1: CANCELLATION FOLLOW-UP ────────────────────────────────────────
WF_CANCELLATION = {
    "name": "BL Motorcycles — Order Cancellation Follow-Up",
    "active": True,
    "nodes": [
        {"id":"n1","name":"Webhook: Order Cancel","type":"n8n-nodes-base.webhook",
         "typeVersion":2,"position":[240,300],
         "parameters":{"httpMethod":"POST","path":"bl-order-cancel",
                        "responseMode":"onReceived","responseData":"firstEntryJson"}},
        {"id":"n2","name":"Filter: Cancelled","type":"n8n-nodes-base.filter",
         "typeVersion":1,"position":[460,300],
         "parameters":{"conditions":{"string":[{
             "value1":"={{ $json.record.status }}","operation":"equals","value2":"cancelled"}]}}},
        {"id":"n3","name":"Switch: Cancel Reason","type":"n8n-nodes-base.switch",
         "typeVersion":1,"position":[680,300],
         "parameters":{"dataType":"string","value1":"={{ $json.record.failure_reason }}",
             "rules":{"rules":[
                 {"value2":"Brett own stock — dispatch manually","output":0},
                 {"value2":"SKU not found on portal","output":1}
             ]},"fallbackOutput":2}},
        {"id":"n4","name":"Email: Local Stock","type":"n8n-nodes-base.httpRequest",
         "typeVersion":4,"position":[900,160],
         "parameters":{"method":"POST","url":"https://api.resend.com/emails",
             "sendHeaders":True,"headerParameters":{"parameters":[
                 {"name":"Authorization","value":"Bearer re_ikc6Lxw5_Nas1LoakZvaGN1oybWkAQQAg"}]},
             "sendBody":True,"specifyBody":"json","jsonBody":
                 '{"from":"BL Motorcycles <orders@bl-motorcycles.co.uk>","to":"={{ $json.record.customer_email }}","subject":"Your Order is Being Prepared — BL Motorcycles","html":"<h2>Great news!</h2><p>Your order <strong>#{{ $json.record.order_number }}</strong> contains items from our own workshop stock and Brett will dispatch it within 1-2 business days. You will receive tracking info shortly.</p><p>— BL Motorcycles</p>"}'}},
        {"id":"n5","name":"Email: SKU Not Found","type":"n8n-nodes-base.httpRequest",
         "typeVersion":4,"position":[900,300],
         "parameters":{"method":"POST","url":"https://api.resend.com/emails",
             "sendHeaders":True,"headerParameters":{"parameters":[
                 {"name":"Authorization","value":"Bearer re_ikc6Lxw5_Nas1LoakZvaGN1oybWkAQQAg"}]},
             "sendBody":True,"specifyBody":"json","jsonBody":
                 '{"from":"BL Motorcycles <orders@bl-motorcycles.co.uk>","to":"={{ $json.record.customer_email }}","subject":"Important Update on Your Order — BL Motorcycles","html":"<h2>We\'re sorry.</h2><p>One or more items in order <strong>#{{ $json.record.order_number }}</strong> are out of stock. A full refund has been issued (3-5 business days).</p><p>— BL Motorcycles</p>"}'}},
        {"id":"n6","name":"Email: Generic Cancel","type":"n8n-nodes-base.httpRequest",
         "typeVersion":4,"position":[900,440],
         "parameters":{"method":"POST","url":"https://api.resend.com/emails",
             "sendHeaders":True,"headerParameters":{"parameters":[
                 {"name":"Authorization","value":"Bearer re_ikc6Lxw5_Nas1LoakZvaGN1oybWkAQQAg"}]},
             "sendBody":True,"specifyBody":"json","jsonBody":
                 '{"from":"BL Motorcycles <orders@bl-motorcycles.co.uk>","to":"={{ $json.record.customer_email }}","subject":"Order Cancelled — BL Motorcycles","html":"<h2>Order Cancelled</h2><p>Order <strong>#{{ $json.record.order_number }}</strong> was cancelled. A full refund will appear in 3-5 days.</p><p>— BL Motorcycles</p>"}'}},
        {"id":"n7","name":"Log to Chatroom","type":"n8n-nodes-base.httpRequest",
         "typeVersion":4,"position":[1120,300],
         "parameters":{"method":"POST",
             "url":"https://lkwydqtfbdjhxaarelaz.supabase.co/rest/v1/chatroom",
             "sendHeaders":True,"headerParameters":{"parameters":[
                 {"name":"apikey","value":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxrd3lkcXRmYmRqaHhhYXJlbGF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDI5ODI4MiwiZXhwIjoyMDg1ODc0MjgyfQ.35gJkeetflYO5FYXrjELwikxqFvcScxFCQr5qDD-Z24"},
                 {"name":"Authorization","value":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxrd3lkcXRmYmRqaHhhYXJlbGF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDI5ODI4MiwiZXhwIjoyMDg1ODc0MjgyfQ.35gJkeetflYO5FYXrjELwikxqFvcScxFCQr5qDD-Z24"}]},
             "sendBody":True,"specifyBody":"json","jsonBody":
                 '{"agent_id":"nathan","message":"📧 Cancel email sent for order #{{ $json.record.order_number }} ({{ $json.record.failure_reason }})","message_type":"broadcast","ai_source":"n8n-bl-cancellation"}'}}
    ],
    "connections": {
        "Webhook: Order Cancel": {"main":[[{"node":"Filter: Cancelled","type":"main","index":0}]]},
        "Filter: Cancelled":     {"main":[[{"node":"Switch: Cancel Reason","type":"main","index":0}]]},
        "Switch: Cancel Reason": {"main":[
            [{"node":"Email: Local Stock","type":"main","index":0}],
            [{"node":"Email: SKU Not Found","type":"main","index":0}],
            [{"node":"Email: Generic Cancel","type":"main","index":0}]]},
        "Email: Local Stock":  {"main":[[{"node":"Log to Chatroom","type":"main","index":0}]]},
        "Email: SKU Not Found":{"main":[[{"node":"Log to Chatroom","type":"main","index":0}]]},
        "Email: Generic Cancel":{"main":[[{"node":"Log to Chatroom","type":"main","index":0}]]}
    },
    "settings":{"executionOrder":"v1","saveManualExecutions":True}
}

# ── WORKFLOW 2: BRETT MANUAL DISPATCH ALERT ───────────────────────────────────
WF_MANUAL_DISPATCH = {
    "name": "BL Motorcycles — Manual Dispatch Alert (Brett)",
    "active": True,
    "nodes": [
        {"id":"m1","name":"Webhook: Manual Dispatch","type":"n8n-nodes-base.webhook",
         "typeVersion":2,"position":[240,300],
         "parameters":{"httpMethod":"POST","path":"bl-manual-dispatch",
                        "responseMode":"onReceived","responseData":"firstEntryJson"}},
        {"id":"m2","name":"Filter: Local Stock","type":"n8n-nodes-base.filter",
         "typeVersion":1,"position":[460,300],
         "parameters":{"conditions":{"string":[{
             "value1":"={{ $json.record.failure_reason }}",
             "operation":"equals",
             "value2":"Brett own stock — dispatch manually"}]}}},
        {"id":"m3","name":"Email Brett","type":"n8n-nodes-base.httpRequest",
         "typeVersion":4,"position":[680,300],
         "parameters":{"method":"POST","url":"https://api.resend.com/emails",
             "sendHeaders":True,"headerParameters":{"parameters":[
                 {"name":"Authorization","value":"Bearer re_ikc6Lxw5_Nas1LoakZvaGN1oybWkAQQAg"}]},
             "sendBody":True,"specifyBody":"json","jsonBody":
                 '{"from":"BL Motorcycles System <orders@bl-motorcycles.co.uk>","to":"blmotorcyclesltd@gmail.com","subject":"⚡ ACTION REQUIRED: Manual Dispatch Order #{{ $json.record.order_number }}","html":"<h2>Manual Dispatch Required</h2><table><tr><td><strong>Order #</strong></td><td>{{ $json.record.order_number }}</td></tr><tr><td><strong>Customer</strong></td><td>{{ $json.record.customer_name }}</td></tr><tr><td><strong>Email</strong></td><td>{{ $json.record.customer_email }}</td></tr><tr><td><strong>Items</strong></td><td>{{ $json.record.items }}</td></tr><tr><td><strong>Address</strong></td><td>{{ $json.record.shipping_address }}</td></tr></table><p>This item is from workshop stock. Please dispatch and update tracking in the portal.</p>"}'}},
        {"id":"m4","name":"Log Dispatch Alert","type":"n8n-nodes-base.httpRequest",
         "typeVersion":4,"position":[900,300],
         "parameters":{"method":"POST",
             "url":"https://lkwydqtfbdjhxaarelaz.supabase.co/rest/v1/chatroom",
             "sendHeaders":True,"headerParameters":{"parameters":[
                 {"name":"apikey","value":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxrd3lkcXRmYmRqaHhhYXJlbGF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDI5ODI4MiwiZXhwIjoyMDg1ODc0MjgyfQ.35gJkeetflYO5FYXrjELwikxqFvcScxFCQr5qDD-Z24"},
                 {"name":"Authorization","value":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxrd3lkcXRmYmRqaHhhYXJlbGF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDI5ODI4MiwiZXhwIjoyMDg1ODc0MjgyfQ.35gJkeetflYO5FYXrjELwikxqFvcScxFCQr5qDD-Z24"}]},
             "sendBody":True,"specifyBody":"json","jsonBody":
                 '{"agent_id":"nathan","message":"🔧 Brett dispatch alert sent for order #{{ $json.record.order_number }}","message_type":"broadcast","ai_source":"n8n-bl-manual-dispatch"}'}}
    ],
    "connections": {
        "Webhook: Manual Dispatch": {"main":[[{"node":"Filter: Local Stock","type":"main","index":0}]]},
        "Filter: Local Stock":      {"main":[[{"node":"Email Brett","type":"main","index":0}]]},
        "Email Brett":              {"main":[[{"node":"Log Dispatch Alert","type":"main","index":0}]]}
    },
    "settings":{"executionOrder":"v1","saveManualExecutions":True}
}

# ── WORKFLOW 3: SKU NOT FOUND OPS ALERT ───────────────────────────────────────
WF_SKU_NOT_FOUND = {
    "name": "BL Motorcycles — SKU Not Found Ops Alert",
    "active": True,
    "nodes": [
        {"id":"s1","name":"Webhook: SKU Alert","type":"n8n-nodes-base.webhook",
         "typeVersion":2,"position":[240,300],
         "parameters":{"httpMethod":"POST","path":"bl-sku-alert",
                        "responseMode":"onReceived","responseData":"firstEntryJson"}},
        {"id":"s2","name":"Filter: SKU Not Found","type":"n8n-nodes-base.filter",
         "typeVersion":1,"position":[460,300],
         "parameters":{"conditions":{"string":[{
             "value1":"={{ $json.record.failure_reason }}",
             "operation":"equals",
             "value2":"SKU not found on portal"}]}}},
        {"id":"s3","name":"Email Ops Alert","type":"n8n-nodes-base.httpRequest",
         "typeVersion":4,"position":[680,300],
         "parameters":{"method":"POST","url":"https://api.resend.com/emails",
             "sendHeaders":True,"headerParameters":{"parameters":[
                 {"name":"Authorization","value":"Bearer re_ikc6Lxw5_Nas1LoakZvaGN1oybWkAQQAg"}]},
             "sendBody":True,"specifyBody":"json","jsonBody":
                 '{"from":"BL Motorcycles System <orders@bl-motorcycles.co.uk>","to":"blmotorcyclesltd@gmail.com","subject":"🚨 SKU Not Found — Order #{{ $json.record.order_number }} Needs Review","html":"<h2>SKU Not Found Alert</h2><p>Order <strong>#{{ $json.record.order_number }}</strong> failed because a SKU could not be located on the supplier portal.</p><table><tr><td><strong>Customer</strong></td><td>{{ $json.record.customer_name }}</td></tr><tr><td><strong>Items</strong></td><td>{{ $json.record.items }}</td></tr><tr><td><strong>eBay Order ID</strong></td><td>{{ $json.record.ebay_order_id }}</td></tr></table><p>Customer refund has been issued automatically. Please review supplier inventory for this SKU.</p>"}'}},
        {"id":"s4","name":"Log SKU Alert","type":"n8n-nodes-base.httpRequest",
         "typeVersion":4,"position":[900,300],
         "parameters":{"method":"POST",
             "url":"https://lkwydqtfbdjhxaarelaz.supabase.co/rest/v1/chatroom",
             "sendHeaders":True,"headerParameters":{"parameters":[
                 {"name":"apikey","value":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxrd3lkcXRmYmRqaHhhYXJlbGF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDI5ODI4MiwiZXhwIjoyMDg1ODc0MjgyfQ.35gJkeetflYO5FYXrjELwikxqFvcScxFCQr5qDD-Z24"},
                 {"name":"Authorization","value":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxrd3lkcXRmYmRqaHhhYXJlbGF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDI5ODI4MiwiZXhwIjoyMDg1ODc0MjgyfQ.35gJkeetflYO5FYXrjELwikxqFvcScxFCQr5qDD-Z24"}]},
             "sendBody":True,"specifyBody":"json","jsonBody":
                 '{"agent_id":"nathan","message":"🚨 SKU not found alert for order #{{ $json.record.order_number }} — ops notified","message_type":"broadcast","ai_source":"n8n-bl-sku-alert"}'}}
    ],
    "connections": {
        "Webhook: SKU Alert":    {"main":[[{"node":"Filter: SKU Not Found","type":"main","index":0}]]},
        "Filter: SKU Not Found": {"main":[[{"node":"Email Ops Alert","type":"main","index":0}]]},
        "Email Ops Alert":       {"main":[[{"node":"Log SKU Alert","type":"main","index":0}]]}
    },
    "settings":{"executionOrder":"v1","saveManualExecutions":True}
}

# ── MAIN ──────────────────────────────────────────────────────────────────────
print("\n=== Deploying BL Motorcycles Workflows ===\n")
ids = {}
for wf in [WF_CANCELLATION, WF_MANUAL_DISPATCH, WF_SKU_NOT_FOUND]:
    wid = deploy(wf)
    if wid:
        ids[wf["name"]] = wid

print("\n=== DEPLOYMENT SUMMARY ===")
for name, wid in ids.items():
    print(f"  [{wid}] {name}")

print("\n=== SUPABASE WEBHOOK ENDPOINTS ===")
print(f"  Cancellation : POST {N8N_BASE}/webhook/bl-order-cancel")
print(f"  Manual Dispatch: POST {N8N_BASE}/webhook/bl-manual-dispatch")
print(f"  SKU Alert    : POST {N8N_BASE}/webhook/bl-sku-alert")
print("\nConfigure each as a Supabase Database Webhook on:")
print("  Table: orders  |  Event: UPDATE")
print("  Filter on 'failure_reason' or 'status' as appropriate")
