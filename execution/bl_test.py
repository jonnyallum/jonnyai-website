import requests, time, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

N8N = "https://n8n.jonnyai.co.uk/webhook"
base = {"channel_order_id":"TEST-BL-001","customer_name":"John Test",
        "customer_email":"jonny@kliqtmedia.co.uk","sku":"BK-TEST-001",
        "shipping_address":"1 Test St, Fareham, PO14 1BA","items":"Brake Pads x1"}

print("[TEST 1] bl-order-cancel → Brett own stock route")
r = requests.post(f"{N8N}/bl-order-cancel",
    json={"record":{**base,"error_message":"Brett own stock - dispatch from workshop","status":"failed"}}, timeout=15)
print(f"  {r.status_code} — {r.text[:120]}")

time.sleep(2)

print("[TEST 2] bl-sku-alert → Bike It + CMPO notifications")
r2 = requests.post(f"{N8N}/bl-sku-alert",
    json={"record":{**base,"error_message":"SKU not found in supplier catalog","status":"failed"}}, timeout=15)
print(f"  {r2.status_code} — {r2.text[:120]}")

time.sleep(2)

print("[TEST 3] bl-manual-dispatch → Brett action alert")
r3 = requests.post(f"{N8N}/bl-manual-dispatch",
    json={"record":{**base,"error_message":"Brett own stock","status":"failed"}}, timeout=15)
print(f"  {r3.status_code} — {r3.text[:120]}")

print("\nAll tests fired. Check jonny@kliqtmedia.co.uk inbox.")
