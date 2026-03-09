import requests, json

SUPABASE_URL = "https://ddjuoeyaoxllockcusgf.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkanVvZXlhb3hsbG9ja2N1c2dmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM4ODM3OSwiZXhwIjoyMDgwOTY0Mzc5fQ.tQTpdQCkE-V-aCfdt7GgN5FF-IdXQzGCAEuRE6gNupE"

headers = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
}

r = requests.get(f"{SUPABASE_URL}/auth/v1/admin/users", headers=headers)
print(f"Status: {r.status_code}")
data = r.json()
users = data.get("users", [])
print(f"Total users: {len(users)}\n")
for u in users:
    email = u.get("email", "NO_EMAIL")
    identities = u.get("identities") or []
    providers = [i.get("provider","?") for i in identities]
    confirmed = u.get("email_confirmed_at","")[:10] if u.get("email_confirmed_at") else "unconfirmed"
    created = u.get("created_at","")[:10]
    print(f"  {email} | providers: {providers} | confirmed: {confirmed} | created: {created}")
