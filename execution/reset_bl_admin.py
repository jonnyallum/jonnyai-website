import requests

SUPABASE_URL = "https://ddjuoeyaoxllockcusgf.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkanVvZXlhb3hsbG9ja2N1c2dmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM4ODM3OSwiZXhwIjoyMDgwOTY0Mzc5fQ.tQTpdQCkE-V-aCfdt7GgN5FF-IdXQzGCAEuRE6gNupE"
NEW_PASS = "BLAdmin2026!"

headers = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json"
}

# Get user ID first
r = requests.get(f"{SUPABASE_URL}/auth/v1/admin/users", headers=headers)
users = r.json().get("users", [])
brett = next((u for u in users if u.get("email") == "blmotorcyclesltd@gmail.com"), None)
if not brett:
    print("User not found!")
else:
    uid = brett["id"]
    print(f"Found user: {brett['email']} | ID: {uid}")
    # Reset password
    r2 = requests.put(
        f"{SUPABASE_URL}/auth/v1/admin/users/{uid}",
        headers=headers,
        json={"password": NEW_PASS}
    )
    print(f"Password reset: {r2.status_code}")
    if r2.ok:
        print(f"SUCCESS! Login with:")
        print(f"  Email: blmotorcyclesltd@gmail.com")
        print(f"  Password: {NEW_PASS}")
    else:
        print(r2.text[:200])
