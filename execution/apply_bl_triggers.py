"""
apply_bl_triggers.py — installs pg_net webhook triggers on BL orders table
"""
import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

SQL = """
CREATE EXTENSION IF NOT EXISTS pg_net;
DROP TRIGGER IF EXISTS trg_bl_order_cancel    ON orders;
DROP TRIGGER IF EXISTS trg_bl_manual_dispatch ON orders;
DROP TRIGGER IF EXISTS trg_bl_sku_alert       ON orders;
DROP FUNCTION IF EXISTS fn_bl_order_cancel_wh();
DROP FUNCTION IF EXISTS fn_bl_manual_dispatch_wh();
DROP FUNCTION IF EXISTS fn_bl_sku_alert_wh();

CREATE OR REPLACE FUNCTION fn_bl_order_cancel_wh()
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
CREATE TRIGGER trg_bl_order_cancel
  AFTER UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION fn_bl_order_cancel_wh();

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

SELECT 'Triggers installed OK' AS result;
"""

try:
    import psycopg2
    CONN = "postgresql://postgres.ddjuoeyaoxllockcusgf:Aprilia100!69.@aws-1-eu-west-2.pooler.supabase.com:6543/postgres"
    print("Connecting to BL Supabase via pooler...")
    conn = psycopg2.connect(CONN)
    conn.autocommit = True
    cur = conn.cursor()
    print("Connected! Executing SQL...")
    cur.execute(SQL)
    try:
        row = cur.fetchone()
        print(f"Result: {row}")
    except Exception:
        pass
    cur.close()
    conn.close()
    print("Triggers installed successfully!")

except ImportError:
    print("psycopg2 not installed. Install with: pip install psycopg2-binary")
    print("Then re-run this script.")
except Exception as e:
    print(f"Connection failed: {e}")
    print("\nManual fallback — paste this SQL in Supabase dashboard:")
    print("https://supabase.com/dashboard/project/ddjuoeyaoxllockcusgf/sql/new")
    print(SQL)
