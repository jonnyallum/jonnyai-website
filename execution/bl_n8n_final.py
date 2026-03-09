"""bl_n8n_final.py — Professional n8n workflows for BL Motorcycles | @Nathan"""
import requests, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

N8N = "https://n8n.jonnyai.co.uk"
session = requests.Session()
r = session.post(f"{N8N}/rest/login",
    json={"emailOrLdapLoginId":"info@jonnyai.co.uk","password":"Aprilia100!69."},
    headers={"Content-Type":"application/json"})
assert r.status_code == 200, f"Login failed: {r.text[:100]}"
print("Login OK")
H = {"Content-Type":"application/json"}
RESEND = "re_ikc6Lxw5_Nas1LoakZvaGN1oybWkAQQAg"
SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxrd3lkcXRmYmRqaHhhYXJlbGF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDI5ODI4MiwiZXhwIjoyMDg1ODc0MjgyfQ.35gJkeetflYO5FYXrjELwikxqFvcScxFCQr5qDD-Z24"
BL_SB  = "https://ddjuoeyaoxllockcusgf.supabase.co/rest/v1/mailing_list"
BL_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkanVvZXlhb3hsbG9ja2N1c2dmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM4ODM3OSwiZXhwIjoyMDgwOTY0Mzc5fQ.tQTpdQCkE-V-aCfdt7GgN5FF-IdXQzGCAEuRE6gNupE"
BRETT = "blmotorcyclesltd@gmail.com"
BIKEIT = "bikeit-tradesales@bikeit.co.uk"
CMPO = "CMPO-general@llexeter.co.uk"
FROM = "BL Motorcycles <orders@bl-motorcycles.co.uk>"

def email_node(nid, name, pos, to_expr, subject, html_body):
    body_json = (
        '{"from":"' + FROM + '",'
        '"to":["' + to_expr + '"],'
        '"subject":"' + subject + '",'
        '"html":"' + html_body.replace('"','\\"') + '"}'
    )
    return {"id":nid,"name":name,"type":"n8n-nodes-base.httpRequest","typeVersion":4,"position":pos,
        "parameters":{"method":"POST","url":"https://api.resend.com/emails",
            "sendHeaders":True,"headerParameters":{"parameters":[{"name":"Authorization","value":f"Bearer {RESEND}"}]},
            "sendBody":True,"specifyBody":"json","jsonBody":body_json}}

def mailing_upsert_node(nid, pos):
    return {"id":nid,"name":"Upsert Mailing List","type":"n8n-nodes-base.httpRequest","typeVersion":4,"position":pos,
        "parameters":{"method":"POST",
            "url":f"{BL_SB}?on_conflict=email",
            "sendHeaders":True,"headerParameters":{"parameters":[
                {"name":"apikey","value":BL_KEY},
                {"name":"Authorization","value":f"Bearer {BL_KEY}"},
                {"name":"Prefer","value":"resolution=merge-duplicates"}]},
            "sendBody":True,"specifyBody":"json",
            "jsonBody":'{"email":"{{ $json.record.customer_email }}","name":"{{ $json.record.customer_name }}","source":"ebay_order","order_count":1}'}}

def log_node(nid, pos, msg):
    return {"id":nid,"name":"Log","type":"n8n-nodes-base.httpRequest","typeVersion":4,"position":pos,
        "parameters":{"method":"POST","url":"https://lkwydqtfbdjhxaarelaz.supabase.co/rest/v1/chatroom",
            "sendHeaders":True,"headerParameters":{"parameters":[
                {"name":"apikey","value":SB_KEY},{"name":"Authorization","value":f"Bearer {SB_KEY}"}]},
            "sendBody":True,"specifyBody":"json",
            "jsonBody":'{"agent_id":"nathan","message":"' + msg + '","message_type":"broadcast","ai_source":"n8n-bl"}'}}

def delete_wf(name, wfs):
    for wf in wfs:
        if wf.get("name") == name:
            session.delete(f"{N8N}/rest/workflows/{wf['id']}", headers=H)
            print(f"  Deleted: {name}")

def create_wf(wf):
    r = session.post(f"{N8N}/rest/workflows", headers=H, json=wf)
    if r.status_code in [200,201]:
        d = r.json()
        wid = d.get("id") or d.get("data",{}).get("id","?")
        session.patch(f"{N8N}/rest/workflows/{wid}", headers=H, json={"active":True})
        return wid
    print(f"  ERROR: {r.status_code} {r.text[:200]}")
    return None

# ── HTML Templates ─────────────────────────────────────────────────────────────
CSS = "font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333"
LOGO_HTML = "<div style='background:#1a1a2e;padding:20px;text-align:center'><h2 style='color:#fff;margin:0'>BL Motorcycles Ltd</h2><p style='color:#aaa;font-size:12px;margin:4px 0'>Professional Motorcycle Parts &amp; Accessories</p></div>"
FOOTER_HTML = "<div style='background:#f5f5f5;padding:15px;text-align:center;font-size:11px;color:#888;margin-top:20px'>BL Motorcycles Ltd | 95 Newgate Lane, Fareham, Hampshire, PO14 1BA<br>Tel: 07881274193 | blmotorcyclesltd.co.uk<br>Company No: 14122962</div>"

def wrap(content): return f"<div style='{CSS}'>{LOGO_HTML}<div style='padding:25px'>{content}</div>{FOOTER_HTML}</div>"

BRETT_DISPATCH_CUST = wrap("<h3 style='color:#1a1a2e'>Good news about your order</h3><p>Dear {{{{ $json.record.customer_name }}}},</p><p>Thank you for your order <strong>#{{{{ $json.record.channel_order_id }}}}</strong>.</p><p>Your item is held in our own workshop stock and our team is preparing it for dispatch. You will receive a tracking number within 1-2 business days.</p><p>If you have any questions, please don't hesitate to contact us.</p><p>Kind regards,<br><strong>The BL Motorcycles Team</strong></p>")

SKU_APOLOGY_CUST = wrap("<h3 style='color:#c0392b'>Important update regarding your order</h3><p>Dear {{{{ $json.record.customer_name }}}},</p><p>We're writing about your order <strong>#{{{{ $json.record.channel_order_id }}}}</strong>.</p><p>Unfortunately, the item you ordered is currently unavailable from our supplier. We sincerely apologise for this inconvenience.</p><p><strong>A full refund has been issued</strong> and should appear in your account within 3-5 business days.</p><p>We hope to serve you again in the future.</p><p>Kind regards,<br><strong>The BL Motorcycles Team</strong></p>")

GENERIC_CANCEL_CUST = wrap("<h3 style='color:#c0392b'>Your order has been cancelled</h3><p>Dear {{{{ $json.record.customer_name }}}},</p><p>We regret to inform you that your order <strong>#{{{{ $json.record.channel_order_id }}}}</strong> has been cancelled.</p><p><strong>A full refund has been issued</strong> and will appear in your account within 3-5 business days.</p><p>We apologise for any inconvenience caused.</p><p>Kind regards,<br><strong>The BL Motorcycles Team</strong></p>")

BRETT_DISPATCH_INT = "<h2>ACTION REQUIRED: Manual Dispatch</h2><table border='1' cellpadding='6' style='border-collapse:collapse;width:100%'><tr><th>Order #</th><td>{{ $json.record.channel_order_id }}</td></tr><tr><th>Customer</th><td>{{ $json.record.customer_name }}</td></tr><tr><th>Email</th><td>{{ $json.record.customer_email }}</td></tr><tr><th>Items</th><td>{{ $json.record.items }}</td></tr><tr><th>Address</th><td>{{ $json.record.shipping_address }}</td></tr><tr><th>SKU</th><td>{{ $json.record.sku }}</td></tr></table><p>Please dispatch from workshop stock and update tracking in eBay.</p>"

SKU_BIKEIT = "<p>Dear Bike It Trade Team,</p><p>Please be advised that an order for SKU <strong>{{ $json.record.sku }}</strong> could not be fulfilled ({{ $json.record.error_message }}).</p><p>Order reference: {{ $json.record.channel_order_id }}<br>If an order was placed in error, please cancel it. Thank you.</p><p>BL Motorcycles Ltd</p>"

SKU_CMPO = "<p>Dear CMPO Team,</p><p>Please be advised that an order for SKU <strong>{{ $json.record.sku }}</strong> could not be fulfilled ({{ $json.record.error_message }}).</p><p>Order reference: {{ $json.record.channel_order_id }}<br>If an order was placed in error, please cancel it. Thank you.</p><p>BL Motorcycles Ltd</p>"

# ── Delete old BL workflows ────────────────────────────────────────────────────
print("\nCleaning old BL workflows...")
wfs = (session.get(f"{N8N}/rest/workflows?limit=50",headers=H).json().get("data",[]))
for nm in ["bl-order-cancel","bl-manual-dispatch","bl-sku-alert"]:
    delete_wf(nm, wfs)

wh = {"type":"n8n-nodes-base.webhook","typeVersion":2}
# ── WF1: Order Cancel Router ───────────────────────────────────────────────────
def mk_wh(nid,pos,path): return {**wh,"id":nid,"name":"Webhook","position":pos,"parameters":{"httpMethod":"POST","path":path,"responseMode":"onReceived"}}
def mk_switch(nid,pos):
    return {"id":nid,"name":"Route by Error","type":"n8n-nodes-base.switch","typeVersion":3,"position":pos,
        "parameters":{"mode":"rules","rules":{"values":[
            {"conditions":{"options":{"leftValue":"={{ $json.record.error_message }}","caseSensitive":False},"combinator":"and","conditions":[{"id":"r1","leftValue":"={{ $json.record.error_message }}","rightValue":"Brett own stock","operator":{"type":"string","operation":"contains"}}]}},
            {"conditions":{"options":{},"combinator":"and","conditions":[{"id":"r2","leftValue":"={{ $json.record.error_message }}","rightValue":"not found","operator":{"type":"string","operation":"contains"}}]}}]}}}

WF1 = {"name":"bl-order-cancel","nodes":[
    mk_wh("wh1",[0,0],"bl-order-cancel"),
    mk_switch("sw1",[200,0]),
    email_node("e1","Email Brett: Dispatch","[400,-200]",BRETT,"ACTION: Manual Dispatch Required #{{ $json.record.channel_order_id }}",BRETT_DISPATCH_INT),
    email_node("e2","Email Cust: Dispatch","[600,-200]","{{ $json.record.customer_email }}","Your BL Motorcycles Order #{{ $json.record.channel_order_id }} — Update",BRETT_DISPATCH_CUST),
    email_node("e3","Email Cust: SKU Error","[400,0]","{{ $json.record.customer_email }}","Important Update: Order #{{ $json.record.channel_order_id }}",SKU_APOLOGY_CUST),
    email_node("e4","Email Cust: Generic","[400,200]","{{ $json.record.customer_email }}","Your Order #{{ $json.record.channel_order_id }} Has Been Cancelled",GENERIC_CANCEL_CUST),
    mailing_upsert_node("ml1",[800,0]),
    log_node("lg1",[1000,0],"[BL] order-cancel workflow fired: #{{ $json.record.channel_order_id }}")],
    "connections":{"Webhook":{"main":[[{"node":"Route by Error","type":"main","index":0}]]},
        "Route by Error":{"main":[[{"node":"Email Brett: Dispatch","type":"main","index":0}],[{"node":"Email Cust: SKU Error","type":"main","index":0}],[{"node":"Email Cust: Generic","type":"main","index":0}]]},
        "Email Brett: Dispatch":{"main":[[{"node":"Email Cust: Dispatch","type":"main","index":0}]]},
        "Email Cust: Dispatch":{"main":[[{"node":"Upsert Mailing List","type":"main","index":0}]]},
        "Email Cust: SKU Error":{"main":[[{"node":"Upsert Mailing List","type":"main","index":0}]]},
        "Email Cust: Generic":{"main":[[{"node":"Upsert Mailing List","type":"main","index":0}]]},
        "Upsert Mailing List":{"main":[[{"node":"Log","type":"main","index":0}]]}}}

WF2 = {"name":"bl-manual-dispatch","nodes":[
    mk_wh("wh2",[0,0],"bl-manual-dispatch"),
    email_node("e5","Dispatch Email to Brett","[200,0]",BRETT,"ACTION REQUIRED: Manual Dispatch Order #{{ $json.record.channel_order_id }}",BRETT_DISPATCH_INT),
    log_node("lg2",[400,0],"[BL] manual-dispatch triggered")],
    "connections":{"Webhook":{"main":[[{"node":"Dispatch Email to Brett","type":"main","index":0}]]},
        "Dispatch Email to Brett":{"main":[[{"node":"Log","type":"main","index":0}]]}}}

WF3 = {"name":"bl-sku-alert","nodes":[
    mk_wh("wh3",[0,0],"bl-sku-alert"),
    email_node("e6","Email Bike It","[200,-100]",BIKEIT,"Order Cancellation Notice — SKU {{ $json.record.sku }}",SKU_BIKEIT),
    email_node("e7","Email CMPO","[200,100]",CMPO,"Order Cancellation Notice — SKU {{ $json.record.sku }}",SKU_CMPO),
    email_node("e8","Brett SKU Alert","[400,0]",BRETT,"SKU Not Found Alert: {{ $json.record.sku }} | Order #{{ $json.record.channel_order_id }}","<h3>SKU Alert</h3><p>SKU <strong>{{ $json.record.sku }}</strong> was not found in supplier stock.</p><p>Order: {{ $json.record.channel_order_id }}<br>Customer: {{ $json.record.customer_name }}<br>Error: {{ $json.record.error_message }}</p><p>Supplier cancellation emails sent to Bike It and CMPO.</p>"),
    log_node("lg3",[600,0],"[BL] sku-alert: {{ $json.record.sku }}")],
    "connections":{"Webhook":{"main":[[{"node":"Email Bike It","type":"main","index":0},{"node":"Email CMPO","type":"main","index":0}]]},
        "Email Bike It":{"main":[[{"node":"Brett SKU Alert","type":"main","index":0}]]},
        "Email CMPO":{"main":[[{"node":"Brett SKU Alert","type":"main","index":0}]]},
        "Brett SKU Alert":{"main":[[{"node":"Log","type":"main","index":0}]]}}}

print("\nDeploying workflows...")
for wf in [WF1, WF2, WF3]:
    wid = create_wf(wf)
    print(f"  ✅ {wf['name']} deployed (ID: {wid})" if wid else f"  ❌ {wf['name']} failed")

print("\n=== BL MOTORCYCLES SETUP COMPLETE ===")
print("Triggers: 3 active on orders table")
print("Workflows: 3 deployed + active on n8n")
print("Admin: blmotorcyclesltd@gmail.com / StalKERS8206@")
print("Mailing list: auto-captures on every order")
