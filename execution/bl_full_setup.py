"""
bl_full_setup.py — BL Motorcycles Full Infrastructure Setup
@Nathan | Jai.OS 5.0
- Creates mailing_list table on ddjuoeyaoxllockcusgf
- Installs 3 pg_net webhook triggers on orders table
- Resets admin user password on kenaardqwnpeqtwukdnb
- Applies Google OAuth email whitelist
"""
import sys, requests, json
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

MGMT_TOKEN = "sbp_8fc2dd4a65e8e58a691e46d2545b6c65379a3ee5"
ORDERS_REF  = "ddjuoeyaoxllockcusgf"
ADMIN_REF   = "kenaardqwnpeqtwukdnb"
MGMT_H = {"Authorization": f"Bearer {MGMT_TOKEN}", "Content-Type": "application/json"}

def run_sql(project_ref, sql, label=""):
    url = f"https://api.supabase.com/v1/projects/{project_ref}/database/query"
    r = requests.post(url, headers=MGMT_H, json={"query": sql})
    if r.status_code in [200, 201]:
        print(f"  ✅ {label}")
        return True
    else:
        print(f"  ❌ {label}: {r.status_code} {r.text[:200]}")
        return False

print("=" * 60)
print("BL MOTORCYCLES — FULL SETUP")
print("=" * 60)

# ── STEP 1: mailing_list table on orders DB ───────────────────────────────────
print("\n[1] Creating mailing_list table...")
run_sql(ORDERS_REF, """
CREATE TABLE IF NOT EXISTS mailing_list (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email        TEXT UNIQUE NOT NULL,
  name         TEXT,
  source       TEXT DEFAULT 'order',
  order_count  INTEGER DEFAULT 1,
  last_order   TIMESTAMPTZ DEFAULT now(),
  subscribed   BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_mailing_list_email ON mailing_list(email);
""", "mailing_list table created")

# ── STEP 2: pg_net triggers on orders ─────────────────────────────────────────
print("\n[2] Installing webhook triggers on orders table...")
run_sql(ORDERS_REF, "CREATE EXTENSION IF NOT EXISTS pg_net;", "pg_net extension")

run_sql(ORDERS_REF, """
DROP TRIGGER IF EXISTS trg_bl_order_failed    ON orders;
DROP TRIGGER IF EXISTS trg_bl_manual_dispatch ON orders;
DROP TRIGGER IF EXISTS trg_bl_sku_alert       ON orders;
DROP FUNCTION IF EXISTS fn_bl_order_failed_wh();
DROP FUNCTION IF EXISTS fn_bl_manual_dispatch_wh();
DROP FUNCTION IF EXISTS fn_bl_sku_alert_wh();
""", "Old triggers dropped")

run_sql(ORDERS_REF, """
CREATE OR REPLACE FUNCTION fn_bl_order_failed_wh()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.status = 'failed' AND (OLD.status IS DISTINCT FROM NEW.status) THEN
    PERFORM net.http_post(
      url     := 'https://n8n.jonnyai.co.uk/webhook/bl-order-cancel',
      body    := json_build_object('record', row_to_json(NEW))::text,
      headers := '{"Content-Type":"application/json"}'::jsonb);
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER trg_bl_order_failed
  AFTER UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION fn_bl_order_failed_wh();
""", "Trigger 1: failed order router")

run_sql(ORDERS_REF, """
CREATE OR REPLACE FUNCTION fn_bl_manual_dispatch_wh()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.error_message ILIKE 'Brett own stock%'
     AND (OLD.error_message IS DISTINCT FROM NEW.error_message) THEN
    PERFORM net.http_post(
      url     := 'https://n8n.jonnyai.co.uk/webhook/bl-manual-dispatch',
      body    := json_build_object('record', row_to_json(NEW))::text,
      headers := '{"Content-Type":"application/json"}'::jsonb);
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER trg_bl_manual_dispatch
  AFTER UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION fn_bl_manual_dispatch_wh();
""", "Trigger 2: Brett manual dispatch")

run_sql(ORDERS_REF, """
CREATE OR REPLACE FUNCTION fn_bl_sku_alert_wh()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.error_message ILIKE '%not found%'
     AND (OLD.error_message IS DISTINCT FROM NEW.error_message) THEN
    PERFORM net.http_post(
      url     := 'https://n8n.jonnyai.co.uk/webhook/bl-sku-alert',
      body    := json_build_object('record', row_to_json(NEW))::text,
      headers := '{"Content-Type":"application/json"}'::jsonb);
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER trg_bl_sku_alert
  AFTER UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION fn_bl_sku_alert_wh();
""", "Trigger 3: SKU not found")

# ── STEP 3: Admin password reset on kenaardqwnpeqtwukdnb ─────────────────────
print("\n[3] Resetting admin password on kenaardqwnpeqtwukdnb...")
run_sql(ADMIN_REF, """
UPDATE auth.users
SET encrypted_password = crypt('StalKERS8206@', gen_salt('bf')),
    updated_at = now()
WHERE email = 'blmotorcyclesltd@gmail.com';
""", "Admin password reset to StalKERS8206@")

# ── STEP 4: Google OAuth whitelist — only blmotorcyclesltd@gmail.com allowed ──
print("\n[4] Installing Google OAuth email whitelist on admin DB...")
run_sql(ADMIN_REF, """
CREATE OR REPLACE FUNCTION public.enforce_email_whitelist()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NEW.email NOT IN ('blmotorcyclesltd@gmail.com') THEN
    DELETE FROM auth.users WHERE id = NEW.id;
    RAISE EXCEPTION 'Unauthorized email: access restricted to approved addresses.';
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_email_whitelist ON auth.users;
CREATE TRIGGER trg_email_whitelist
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.enforce_email_whitelist();
""", "Email whitelist trigger installed")

# ── STEP 5: Verify triggers installed ─────────────────────────────────────────
print("\n[5] Verifying triggers on orders DB...")
r = requests.post(
    f"https://api.supabase.com/v1/projects/{ORDERS_REF}/database/query",
    headers=MGMT_H,
    json={"query": "SELECT trigger_name, event_manipulation, event_object_table FROM information_schema.triggers WHERE trigger_schema='public' ORDER BY trigger_name;"}
)
if r.status_code == 200:
    rows = r.json()
    if isinstance(rows, list):
        for row in rows:
            print(f"  📌 {row}")
    else:
        print(f"  {rows}")

print("\n[6] Verifying whitelist trigger on admin DB...")
r2 = requests.post(
    f"https://api.supabase.com/v1/projects/{ADMIN_REF}/database/query",
    headers=MGMT_H,
    json={"query": "SELECT trigger_name, event_object_table FROM information_schema.triggers WHERE trigger_name='trg_email_whitelist';"}
)
if r2.status_code == 200:
    print(f"  📌 {r2.json()}")

print("\n" + "=" * 60)
print("SETUP COMPLETE")
print("=" * 60)
