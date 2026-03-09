import sys, requests
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BL_URL = "https://ddjuoeyaoxllockcusgf.supabase.co"
BL_SRK = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkanVvZXlhb3hsbG9ja2N1c2dmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM4ODM3OSwiZXhwIjoyMDgwOTY0Mzc5fQ.tQTpdQCkE-V-aCfdt7GgN5FF-IdXQzGCAEuRE6gNupE"
H = {"apikey": BL_SRK, "Authorization": f"Bearer {BL_SRK}"}

# Get distinct statuses
r = requests.get(f"{BL_URL}/rest/v1/orders?select=status&limit=200", headers=H)
rows = r.json()
statuses = set(x.get("status") for x in rows)
print("Distinct statuses:", statuses)

# Get cancelled orders with error_message
r2 = requests.get(
    f"{BL_URL}/rest/v1/orders?select=channel_order_id,status,error_message,customer_email&limit=10",
    headers=H
)
print("\nSample orders (status + error_message):")
for row in r2.json():
    print(f"  status={row.get('status')!r:20} error_message={row.get('error_message')!r}")
