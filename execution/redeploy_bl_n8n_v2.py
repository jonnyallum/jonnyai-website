"""
redeploy_bl_n8n_v2.py
Fixes field names & patterns based on real BL orders data.
- status = 'failed' (not cancelled)
- error_message LIKE 'Brett own stock%' | '%not found%'
- channel_order_id (not order_number)
Jai.OS 5.0 | @Nathan
"""
import requests, sys, json
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

N8N_BASE = "https://n8n.jonnyai.co.uk"
EMAIL    = "info@jonnyai.co.uk"
PASSWORD = "Aprilia100!69."
RESEND   = "re_ikc6Lxw5_Nas1LoakZvaGN1oybWkAQQAg"
SB_KEY   = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxrd3lkcXRmYmRqaHhhYXJlbGF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDI5ODI4MiwiZXhwIjoyMDg1ODc0MjgyfQ.35gJkeetflYO5FYXrjELwikxqFvcScxFCQr5qDD-Z24"

session = requests.Session()
r = session.post(f"{N8N_BASE}/rest/login",
    json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD},
    headers={"Content-Type": "application/json"})
assert r.status_code == 200, f"Login failed: {r.text[:100]}"
print("Login OK")
H = {"Content-Type": "application/json"}

def list_workflows():
    r = session.get(f"{N8N_BASE}/rest/workflows", headers=H)
    d = r.json()
    return d.get("data", d) if isinstance(d, dict) else d

def delete_workflow(wid):
    r = session.delete(f"{N8N_BASE}/rest/workflows/{wid}", headers=H)
    return r.status_code

def create_workflow(wf):
    r = session.post(f"{N8N_BASE}/rest/workflows", headers=H, json=wf)
    if r.status_code in [200,201]:
        data = r.json()
        wid = data.get("id") or data.get("data", {}).get("id", "?")
        return wid
    print(f"  Create failed {r.status_code}: {r.text[:200]}")
    return None

# ── Clean up old broken workflows ─────────────────────────────────────────────
BL_NAMES = [
    "BL Motorcycles — Order Cancellation Follow-Up",
    "BL Motorcycles — Manual Dispatch Alert (Brett)",
    "BL Motorcycles — SKU Not Found Ops Alert",
]
print("\nCleaning up old workflows...")
for wf in list_workflows():
    if wf.get("name") in BL_NAMES:
        sc = delete_workflow(wf["id"])
        print(f"  Deleted [{wf['id']}] {wf['name']} -> {sc}")

# ── WORKFLOW 1: FAILED ORDER EMAIL ROUTER ─────────────────────────────────────
# Triggers on any failed order, classifies by error_message, routes email
WF1 = {
    "name": "BL Motorcycles — Order Cancellation Follow-Up",
    "active": True,
    "nodes": [
        {"id":"n1","name":"Webhook","type":"n8n-nodes-base.webhook","typeVersion":2,"position":[240,300],
         "parameters":{"httpMethod":"POST","path":"bl-order-cancel","responseMode":"onReceived","responseData":"firstEntryJson"}},
        {"id":"n2","name":"Switch: Error Type","type":"n8n-nodes-base.switch","typeVersion":3,"position":[460,300],
         "parameters":{"mode":"rules","rules":{"values":[
             {"conditions":{"options":{"caseSensitive":False},"conditions":[
                 {"leftValue":"={{ $json.record.error_message }}","operator":{"type":"string","operation":"contains"},"rightValue":"Brett own stock"}]},
              "renameOutput":True,"outputKey":"brett"},
             {"conditions":{"options":{"caseSensitive":False},"conditions":[
                 {"leftValue":"={{ $json.record.error_message }}","operator":{"type":"string","operation":"contains"},"rightValue":"not found"}]},
              "renameOutput":True,"outputKey":"sku_missing"}
         ]},"fallbackOutput":"extra","options":{}}},
        {"id":"n3","name":"Email: Brett Dispatch","type":"n8n-nodes-base.httpRequest","typeVersion":4,"position":[700,160],
         "parameters":{"method":"POST","url":"https://api.resend.com/emails",
             "sendHeaders":True,"headerParameters":{"parameters":[{"name":"Authorization","value":f"Bearer {RESEND}"}]},
             "sendBody":True,"specifyBody":"json","jsonBody":
                 '{"from":"BL Motorcycles <orders@bl-motorcycles.co.uk>","to":["{{ $json.record.customer_email }}"],"subject":"Your Order is Being Prepared — BL Motorcycles","html":"<h2>Great news!</h2><p>Your order <strong>#{{ $json.record.channel_order_id }}</strong> contains items held in our own workshop stock. Brett will dispatch it directly within 1-2 business days and you will receive tracking shortly.</p><p>— The BL Motorcycles Team</p>"}'}},
        {"id":"n4","name":"Email: SKU Apology","type":"n8n-nodes-base.httpRequest","typeVersion":4,"position":[700,300],
         "parameters":{"method":"POST","url":"https://api.resend.com/emails",
             "sendHeaders":True,"headerParameters":{"parameters":[{"name":"Authorization","value":f"Bearer {RESEND}"}]},
             "sendBody":True,"specifyBody":"json","jsonBody":
                 '{"from":"BL Motorcycles <orders@bl-motorcycles.co.uk>","to":["{{ $json.record.customer_email }}"],"subject":"Important Update on Your Order — BL Motorcycles","html":"<h2>We\'re Sorry</h2><p>Unfortunately one or more items in order <strong>#{{ $json.record.channel_order_id }}</strong> are currently out of stock with our supplier. A full refund has been issued and will appear within 3-5 business days.</p><p>We apologise for the inconvenience. — BL Motorcycles</p>"}'}},
        {"id":"n5","name":"Log to Chatroom","type":"n8n-nodes-base.httpRequest","typeVersion":4,"position":[940,300],
         "parameters":{"method":"POST","url":"https://lkwydqtfbdjhxaarelaz.supabase.co/rest/v1/chatroom",
             "sendHeaders":True,"headerParameters":{"parameters":[
                 {"name":"apikey","value":SB_KEY},{"name":"Authorization","value":f"Bearer {SB_KEY}"}]},
             "sendBody":True,"specifyBody":"json","jsonBody":
                 '{"agent_id":"nathan","message":"Email sent for failed order #{{ $json.record.channel_order_id }} | {{ $json.record.error_message }}","message_type":"broadcast","ai_source":"n8n-bl-cancel"}'}}
    ],
    "connections":{
        "Webhook":{"main":[[{"node":"Switch: Error Type","type":"main","index":0}]]},
        "Switch: Error Type":{"main":[
            [{"node":"Email: Brett Dispatch","type":"main","index":0}],
            [{"node":"Email: SKU Apology","type":"main","index":0}]]},
        "Email: Brett Dispatch":{"main":[[{"node":"Log to Chatroom","type":"main","index":0}]]},
        "Email: SKU Apology":{"main":[[{"node":"Log to Chatroom","type":"main","index":0}]]}
    },
    "settings":{"executionOrder":"v1","saveManualExecutions":True}
}

# ── WORKFLOW 2: BRETT INTERNAL ALERT ──────────────────────────────────────────
WF2 = {
    "name": "BL Motorcycles — Manual Dispatch Alert (Brett)",
    "active": True,
    "nodes": [
        {"id":"m1","name":"Webhook","type":"n8n-nodes-base.webhook","typeVersion":2,"position":[240,300],
         "parameters":{"httpMethod":"POST","path":"bl-manual-dispatch","responseMode":"onReceived","responseData":"firstEntryJson"}},
        {"id":"m2","name":"Email Brett","type":"n8n-nodes-base.httpRequest","typeVersion":4,"position":[480,300],
         "parameters":{"method":"POST","url":"https://api.resend.com/emails",
             "sendHeaders":True,"headerParameters":{"parameters":[{"name":"Authorization","value":f"Bearer {RESEND}"}]},
             "sendBody":True,"specifyBody":"json","jsonBody":
                 '{"from":"BL System <orders@bl-motorcycles.co.uk>","to":["blmotorcyclesltd@gmail.com"],"subject":"ACTION: Manual Dispatch — Order #{{ $json.record.channel_order_id }}","html":"<h2>Manual Dispatch Required</h2><table style=\\"border-collapse:collapse\\"><tr><td style=\\"padding:4px 8px\\"><b>Order #</b></td><td>{{ $json.record.channel_order_id }}</td></tr><tr><td style=\\"padding:4px 8px\\"><b>Customer</b></td><td>{{ $json.record.customer_name }}</td></tr><tr><td style=\\"padding:4px 8px\\"><b>Email</b></td><td>{{ $json.record.customer_email }}</td></tr><tr><td style=\\"padding:4px 8px\\"><b>Items</b></td><td>{{ $json.record.items }}</td></tr><tr><td style=\\"padding:4px 8px\\"><b>Address</b></td><td>{{ $json.record.shipping_address }}</td></tr></table><p>Please dispatch from workshop stock and update tracking in the portal.</p>"}'}},
        {"id":"m3","name":"Log","type":"n8n-nodes-base.httpRequest","typeVersion":4,"position":[720,300],
         "parameters":{"method":"POST","url":"https://lkwydqtfbdjhxaarelaz.supabase.co/rest/v1/chatroom",
             "sendHeaders":True,"headerParameters":{"parameters":[
                 {"name":"apikey","value":SB_KEY},{"name":"Authorization","value":f"Bearer {SB_KEY}"}]},
             "sendBody":True,"specifyBody":"json","jsonBody":
                 '{"agent_id":"nathan","message":"Brett dispatch alert sent — order #{{ $json.record.channel_order_id }}","message_type":"broadcast","ai_source":"n8n-bl-manual-dispatch"}'}}
    ],
    "connections":{"Webhook":{"main":[[{"node":"Email Brett","type":"main","index":0}]]},
                   "Email Brett":{"main":[[{"node":"Log","type":"main","index":0}]]}},
    "settings":{"executionOrder":"v1","saveManualExecutions":True}
}

# ── WORKFLOW 3: SKU NOT FOUND OPS ALERT ───────────────────────────────────────
WF3 = {
    "name": "BL Motorcycles — SKU Not Found Ops Alert",
    "active": True,
    "nodes": [
        {"id":"s1","name":"Webhook","type":"n8n-nodes-base.webhook","typeVersion":2,"position":[240,300],
         "parameters":{"httpMethod":"POST","path":"bl-sku-alert","responseMode":"onReceived","responseData":"firstEntryJson"}},
        {"id":"s2","name":"Email Ops","type":"n8n-nodes-base.httpRequest","typeVersion":4,"position":[480,300],
         "parameters":{"method":"POST","url":"https://api.resend.com/emails",
             "sendHeaders":True,"headerParameters":{"parameters":[{"name":"Authorization","value":f"Bearer {RESEND}"}]},
             "sendBody":True,"specifyBody":"json","jsonBody":
                 '{"from":"BL System <orders@bl-motorcycles.co.uk>","to":["blmotorcyclesltd@gmail.com"],"subject":"SKU NOT FOUND — Order #{{ $json.record.channel_order_id }} needs review","html":"<h2>SKU Not Found on Portal</h2><p>Order <strong>#{{ $json.record.channel_order_id }}</strong> failed because: <em>{{ $json.record.error_message }}</em></p><p>Customer: {{ $json.record.customer_name }} ({{ $json.record.customer_email }})</p><p>SKU: {{ $json.record.sku }}</p><p>Customer refund has been issued. Please check supplier inventory for this SKU.</p>"}'}},
        {"id":"s3","name":"Log","type":"n8n-nodes-base.httpRequest","typeVersion":4,"position":[720,300],
         "parameters":{"method":"POST","url":"https://lkwydqtfbdjhxaarelaz.supabase.co/rest/v1/chatroom",
             "sendHeaders":True,"headerParameters":{"parameters":[
                 {"name":"apikey","value":SB_KEY},{"name":"Authorization","value":f"Bearer {SB_KEY}"}]},
             "sendBody":True,"specifyBody":"json","jsonBody":
                 '{"agent_id":"nathan","message":"SKU not found alert — order #{{ $json.record.channel_order_id }} | {{ $json.record.error_message }}","message_type":"broadcast","ai_source":"n8n-bl-sku-alert"}'}}
    ],
    "connections":{"Webhook":{"main":[[{"node":"Email Ops","type":"main","index":0}]]},
                   "Email Ops":{"main":[[{"node":"Log","type":"main","index":0}]]}},
    "settings":{"executionOrder":"v1","saveManualExecutions":True}
}

# ── DEPLOY ALL ─────────────────────────────────────────────────────────────────
print("\nDeploying corrected workflows...")
ids = {}
for wf in [WF1, WF2, WF3]:
    wid = create_workflow(wf)
    if wid:
        ids[wf["name"]] = wid
        print(f"  OK [{wid}] {wf['name']}")
        session.patch(f"{N8N_BASE}/rest/workflows/{wid}", headers=H, json={"active": True})

print("\n=== DONE ===")
for name, wid in ids.items():
    print(f"  [{wid}] {name}")

print(f"""
=== SUPABASE TRIGGER SQL (apply in Dashboard SQL editor) ===
URL: https://supabase.com/dashboard/project/ddjuoeyaoxllockcusgf/sql/new

CREATE EXTENSION IF NOT EXISTS pg_net;
DROP TRIGGER IF EXISTS trg_bl_order_cancel    ON orders;
DROP TRIGGER IF EXISTS trg_bl_manual_dispatch ON orders;
DROP TRIGGER IF EXISTS trg_bl_sku_alert       ON orders;
DROP FUNCTION IF EXISTS fn_bl_order_cancel_wh();
DROP FUNCTION IF EXISTS fn_bl_manual_dispatch_wh();
DROP FUNCTION IF EXISTS fn_bl_sku_alert_wh();

CREATE OR REPLACE FUNCTION fn_bl_order_cancel_wh() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.status = 'failed' AND (OLD.status IS DISTINCT FROM NEW.status) THEN
    PERFORM net.http_post(url:='https://n8n.jonnyai.co.uk/webhook/bl-order-cancel',
      body:=json_build_object('record',row_to_json(NEW))::text,
      headers:='{{"Content-Type":"application/json"}}'::jsonb);
  END IF; RETURN NEW; END; $$;
CREATE TRIGGER trg_bl_order_cancel AFTER UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION fn_bl_order_cancel_wh();

CREATE OR REPLACE FUNCTION fn_bl_manual_dispatch_wh() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.error_message ILIKE 'Brett own stock%' AND (OLD.error_message IS DISTINCT FROM NEW.error_message) THEN
    PERFORM net.http_post(url:='https://n8n.jonnyai.co.uk/webhook/bl-manual-dispatch',
      body:=json_build_object('record',row_to_json(NEW))::text,
      headers:='{{"Content-Type":"application/json"}}'::jsonb);
  END IF; RETURN NEW; END; $$;
CREATE TRIGGER trg_bl_manual_dispatch AFTER UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION fn_bl_manual_dispatch_wh();

CREATE OR REPLACE FUNCTION fn_bl_sku_alert_wh() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.error_message ILIKE '%not found%' AND (OLD.error_message IS DISTINCT FROM NEW.error_message) THEN
    PERFORM net.http_post(url:='https://n8n.jonnyai.co.uk/webhook/bl-sku-alert',
      body:=json_build_object('record',row_to_json(NEW))::text,
      headers:='{{"Content-Type":"application/json"}}'::jsonb);
  END IF; RETURN NEW; END; $$;
CREATE TRIGGER trg_bl_sku_alert AFTER UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION fn_bl_sku_alert_wh();

SELECT 'Triggers installed OK' AS result;
""")
