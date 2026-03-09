import requests, json

SUPABASE_URL = "https://ddjuoeyaoxllockcusgf.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkanVvZXlhb3hsbG9ja2N1c2dmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM4ODM3OSwiZXhwIjoyMDgwOTY0Mzc5fQ.tQTpdQCkE-V-aCfdt7GgN5FF-IdXQzGCAEuRE6gNupE"

headers = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json"
}

# 1. Get ALL orders
r = requests.get(f"{SUPABASE_URL}/rest/v1/orders?select=*&order=created_at.desc", headers=headers)
print(f"Orders fetch: {r.status_code}")
orders = r.json()
print(f"Total orders: {len(orders)}\n")

# 2. Status breakdown
from collections import Counter
statuses = Counter(o.get('status','?') for o in orders)
print("Status breakdown:")
for s, c in statuses.items():
    print(f"  {s}: {c}")

# 3. Show rejected orders detail
print("\n--- REJECTED ORDERS (SKU analysis) ---")
rejected = [o for o in orders if o.get('status') in ('rejected','failed','REJECTED')]
for o in rejected[:5]:
    print(f"  Order: {o.get('ebay_order_id')} | SKU: {o.get('sku')} | Customer: {o.get('customer_name')} | Error: {o.get('error_message','none')}")

# 4. List all tables available
r2 = requests.get(f"{SUPABASE_URL}/rest/v1/", headers=headers)
print(f"\nAPI root: {r2.status_code}")

# Check for inventory/products table
for table in ['products', 'inventory', 'stock', 'items', 'catalog', 'listings']:
    rt = requests.get(f"{SUPABASE_URL}/rest/v1/{table}?select=*&limit=3", headers=headers)
    if rt.status_code == 200:
        print(f"\n[TABLE: {table}] {len(rt.json())} rows (sample)")
        if rt.json():
            print(json.dumps(rt.json()[0], indent=2)[:300])
    else:
        print(f"[TABLE: {table}] {rt.status_code} - not found")
