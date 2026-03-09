"""
setup_bl_supabase_webhooks.py
Creates Supabase DB webhook triggers on BL Motorcycles orders table.
Uses pg_net (built-in to Supabase) to POST to n8n webhooks on UPDATE.
Jai.OS 5.0 | @Nathan / @Diana
"""
import sys, requests, json
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# BL Supabase
BL_URL      = "https://ddjuoeyaoxllockcusgf.supabase.co"
BL_SRK      = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkanVvZXlhb3hsbG9ja2N1c2dmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM4ODM3OSwiZXhwIjoyMDgwOTY0Mzc5fQ.tQTpdQCkE-V-aCfdt7GgN5FF-IdXQzGCAEuRE6gNupE"

HEADERS = {
    "apikey": BL_SRK,
    "Authorization": f"Bearer {BL_SRK}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

# n8n webhook base
N8N = "https://n8n.jonnyai.co.uk/webhook"

# SQL to set up pg_net webhook triggers
SQL = f"""
-- Enable pg_net if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Drop existing triggers to allow re-run
DROP TRIGGER IF EXISTS trg_bl_order_cancel    ON orders;
DROP TRIGGER IF EXISTS trg_bl_manual_dispatch ON orders;
DROP TRIGGER IF EXISTS trg_bl_sku_alert       ON orders;

DROP FUNCTION IF EXISTS fn_bl_order_cancel_webhook();
DROP FUNCTION IF EXISTS fn_bl_manual_dispatch_webhook();
DROP FUNCTION IF EXISTS fn_bl_sku_alert_webhook();

-- ── TRIGGER 1: Cancellation Follow-Up ──────────────────────────────────────
CREATE OR REPLACE FUNCTION fn_bl_order_cancel_webhook()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.status = 'cancelled' AND (OLD.status IS DISTINCT FROM NEW.status) THEN
    PERFORM net.http_post(
      url     := '{N8N}/bl-order-cancel',
      body    := json_build_object('record', row_to_json(NEW))::text,
      headers := '{{"Content-Type": "application/json"}}'::jsonb
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_bl_order_cancel
AFTER UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION fn_bl_order_cancel_webhook();

-- ── TRIGGER 2: Manual Dispatch Alert ───────────────────────────────────────
CREATE OR REPLACE FUNCTION fn_bl_manual_dispatch_webhook()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.failure_reason = 'Brett own stock — dispatch manually'
     AND (OLD.failure_reason IS DISTINCT FROM NEW.failure_reason) THEN
    PERFORM net.http_post(
      url     := '{N8N}/bl-manual-dispatch',
      body    := json_build_object('record', row_to_json(NEW))::text,
      headers := '{{"Content-Type": "application/json"}}'::jsonb
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_bl_manual_dispatch
AFTER UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION fn_bl_manual_dispatch_webhook();

-- ── TRIGGER 3: SKU Not Found Alert ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION fn_bl_sku_alert_webhook()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.failure_reason = 'SKU not found on portal'
     AND (OLD.failure_reason IS DISTINCT FROM NEW.failure_reason) THEN
    PERFORM net.http_post(
      url     := '{N8N}/bl-sku-alert',
      body    := json_build_object('record', row_to_json(NEW))::text,
      headers := '{{"Content-Type": "application/json"}}'::jsonb
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_bl_sku_alert
AFTER UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION fn_bl_sku_alert_webhook();

SELECT 'All 3 webhook triggers installed successfully' AS result;
"""

def run_sql(sql):
    """Execute SQL via Supabase REST RPC — requires a helper function or direct pg."""
    # Try Supabase's /rest/v1/rpc/exec_sql if it exists
    r = requests.post(
        f"{BL_URL}/rest/v1/rpc/exec_sql",
        headers=HEADERS,
        json={"query": sql}
    )
    return r.status_code, r.text[:500]

# First check if orders table exists
print("Checking BL Supabase connection...")
r = requests.get(
    f"{BL_URL}/rest/v1/orders?limit=1",
    headers=HEADERS
)
print(f"Orders table probe: {r.status_code}")
if r.status_code == 200:
    print("Connection OK - orders table accessible")
    rows = r.json()
    if rows:
        print(f"Sample order keys: {list(rows[0].keys())}")
elif r.status_code == 404:
    print("WARNING: orders table not found - check table name")
else:
    print(f"Response: {r.text[:200]}")

print("\n--- SQL Migration (apply via Supabase Dashboard SQL editor) ---")
print(SQL)
print("\n--- OR run via psql ---")
print("psql postgresql://postgres.ddjuoeyaoxllockcusgf:PASSWORD@aws-1-eu-west-2.pooler.supabase.com:6543/postgres")
print("Then paste the SQL above.")
print("\nAlternatively use Supabase Dashboard:")
print("  https://supabase.com/dashboard/project/ddjuoeyaoxllockcusgf/database/hooks")
