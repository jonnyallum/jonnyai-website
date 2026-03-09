"""bl_admin_fix.py — Fix Brett's auth on the active orders DB"""
import sys, requests, json
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# Active project (kenaardqwnpeqtwukdnb is dead - DNS fails)
ADMIN_URL = "https://ddjuoeyaoxllockcusgf.supabase.co"
ADMIN_SRK = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkanVvZXlhb3hsbG9ja2N1c2dmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM4ODM3OSwiZXhwIjoyMDgwOTY0Mzc5fQ.tQTpdQCkE-V-aCfdt7GgN5FF-IdXQzGCAEuRE6gNupE"
ORDERS_REF = "ddjuoeyaoxllockcusgf"
MGMT_TOKEN = "sbp_8fc2dd4a65e8e58a691e46d2545b6c65379a3ee5"
H  = {"apikey": ADMIN_SRK, "Authorization": f"Bearer {ADMIN_SRK}", "Content-Type": "application/json"}
MH = {"Authorization": f"Bearer {MGMT_TOKEN}", "Content-Type": "application/json"}
TARGET_EMAIL = "blmotorcyclesltd@gmail.com"
NEW_PASSWORD = "StalKERS8206@"

print("[1] Checking existing users in active orders DB...")
r = requests.get(f"{ADMIN_URL}/auth/v1/admin/users?per_page=50", headers=H)
print(f"  Status: {r.status_code}")
if r.status_code == 200:
    data = r.json()
    users = data.get("users", []) if isinstance(data, dict) else data
    user_id = None
    for u in users:
        print(f"  User: {u.get('email')} [{u.get('id','?')[:8]}...]")
        if u.get("email") == TARGET_EMAIL:
            user_id = u.get("id")
    if user_id:
        print(f"\n[2] Updating password for existing user {TARGET_EMAIL}...")
        r2 = requests.put(f"{ADMIN_URL}/auth/v1/admin/users/{user_id}",
            headers=H, json={"password": NEW_PASSWORD, "email_confirm": True})
        print(f"  ✅ Password updated: {r2.status_code}" if r2.status_code in [200,201] else f"  ❌ {r2.status_code}: {r2.text[:200]}")
    else:
        print(f"\n[2] Creating admin user {TARGET_EMAIL}...")
        r3 = requests.post(f"{ADMIN_URL}/auth/v1/admin/users", headers=H,
            json={"email": TARGET_EMAIL, "password": NEW_PASSWORD, "email_confirm": True, "role": "authenticated"})
        print(f"  ✅ Created: {r3.status_code}" if r3.status_code in [200,201] else f"  ❌ {r3.status_code}: {r3.text[:200]}")
else:
    print(f"  ❌ {r.text[:200]}")

# 3. Configure public signups restriction + Google OAuth
print("\n[3] Restricting public signups via Management API...")
r4 = requests.patch(f"https://api.supabase.com/v1/projects/{ORDERS_REF}/config/auth",
    headers=MH, json={"disable_signup": True})
print(f"  disable_signup: {r4.status_code} — {r4.text[:200]}")

print("\nDone.")
