"""
BL Motorcycles — Apply Schema Migration
Runs the 001_admin_ops_hub.sql migration against BL's Supabase instance.
"""
import requests, os

SUPABASE_URL = "https://ddjuoeyaoxllockcusgf.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkanVvZXlhb3hsbG9ja2N1c2dmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM4ODM3OSwiZXhwIjoyMDgwOTY0Mzc5fQ.tQTpdQCkE-V-aCfdt7GgN5FF-IdXQzGCAEuRE6gNupE"

headers = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

# Read the migration SQL
migration_path = os.path.join(os.path.dirname(__file__), 
    "..", "Clients", "BL-Motorcycles-Enterprise", "website", "supabase", "migrations", "001_admin_ops_hub.sql")

with open(migration_path, "r", encoding="utf-8") as f:
    sql = f.read()

# Split into individual statements and execute
statements = [s.strip() for s in sql.split(";") if s.strip() and not s.strip().startswith("--")]

print("🚀 Applying BL Motorcycles schema migration...")
print(f"Found {len(statements)} SQL statements\n")

for i, stmt in enumerate(statements):
    # Skip empty or comment-only
    clean = "\n".join(l for l in stmt.split("\n") if not l.strip().startswith("--")).strip()
    if not clean:
        continue
    
    print(f"[{i+1}] {clean[:80]}...")
    
    # Use Supabase RPC to execute raw SQL
    r = requests.post(
        f"{SUPABASE_URL}/rest/v1/rpc/exec_sql",
        headers=headers,
        json={"query": clean + ";"}
    )
    
    if r.status_code in (200, 201, 204):
        print(f"    ✅ OK")
    elif r.status_code == 404:
        # exec_sql function might not exist, try direct approach
        # For ALTER TABLE, we can use the pg_net extension or just note it
        print(f"    ⚠️  exec_sql RPC not found — run this SQL directly in Supabase SQL editor")
        break
    else:
        print(f"    ❌ {r.status_code}: {r.text[:200]}")

print("\n" + "="*60)
print("If RPC method failed, paste the migration SQL directly into:")
print(f"  https://supabase.com/dashboard/project/ddjuoeyaoxllockcusgf/sql/new")
print(f"  File: Clients/BL-Motorcycles-Enterprise/website/supabase/migrations/001_admin_ops_hub.sql")
print("="*60)
