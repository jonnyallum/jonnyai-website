import requests, json

SUPABASE_URL = "https://ddjuoeyaoxllockcusgf.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkanVvZXlhb3hsbG9ja2N1c2dmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM4ODM3OSwiZXhwIjoyMDgwOTY0Mzc5fQ.tQTpdQCkE-V-aCfdt7GgN5FF-IdXQzGCAEuRE6gNupE"
headers = {"apikey": SERVICE_KEY, "Authorization": f"Bearer {SERVICE_KEY}"}

# Get ALL failed orders with full detail
r = requests.get(f"{SUPABASE_URL}/rest/v1/orders?status=eq.failed&select=*&order=created_at.desc", headers=headers)
orders = r.json()
print(f"Failed orders: {len(orders)}\n")

error_groups = {}
for o in orders:
    err = o.get('error_message') or 'unknown'
    error_groups.setdefault(err, []).append(o.get('ebay_order_id'))

print("=== FAILURE GROUPS ===")
for err, ids in error_groups.items():
    print(f"\n[{len(ids)}x] {err}")
    for oid in ids:
        print(f"    {oid}")

# Full product catalog
print("\n=== PRODUCT CATALOG ===")
r2 = requests.get(f"{SUPABASE_URL}/rest/v1/products?select=sku,supplier_id,brand,title,trade_price&limit=50", headers=headers)
products = r2.json()
print(f"Total products in DB: {len(products)}")
for p in products:
    print(f"  [{p.get('supplier_id')}] {p.get('sku')} — {p.get('title','')[:40]} @ £{p.get('trade_price')}")

# Check for suppliers table
r3 = requests.get(f"{SUPABASE_URL}/rest/v1/suppliers?select=*&limit=10", headers=headers)
if r3.status_code == 200:
    print(f"\n=== SUPPLIERS ===")
    for s in r3.json():
        print(f"  {s}")
else:
    print(f"\nNo suppliers table ({r3.status_code})")
