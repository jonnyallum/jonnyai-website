"""
apply_bl_triggers.py — installs pg_net webhook triggers on BL orders table
"""
import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

SQL = """
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_carrier TEXT DEFAULT 'Royal Mail';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS dispatched_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS dispatch_email_sent BOOLEAN DEFAULT FALSE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS review_email_sent BOOLEAN DEFAULT FALSE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS upsell_email_sent BOOLEAN DEFAULT FALSE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS escalated BOOLEAN DEFAULT FALSE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS escalated_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes TEXT;

CREATE TABLE IF NOT EXISTS customer_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  email_type TEXT NOT NULL,
  to_address TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_preview TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  sent_by TEXT DEFAULT 'system',
  resend_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_customer_emails_order ON customer_emails(order_id);
CREATE INDEX IF NOT EXISTS idx_customer_emails_type ON customer_emails(email_type);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_name);
CREATE INDEX IF NOT EXISTS idx_orders_dispatched ON orders(dispatched_at);

CREATE OR REPLACE FUNCTION auto_categorise_order()
RETURNS TRIGGER AS $$
DECLARE
  product_title TEXT;
BEGIN
  SELECT title INTO product_title FROM products WHERE sku = NEW.sku LIMIT 1;
  
  IF product_title IS NOT NULL THEN
    product_title := LOWER(product_title);
    
    IF product_title LIKE '%exhaust%' OR product_title LIKE '%silencer%' OR product_title LIKE '%pipe%' THEN
      NEW.category := 'Exhausts';
    ELSIF product_title LIKE '%brake%' OR product_title LIKE '%pad%' OR product_title LIKE '%disc%' OR product_title LIKE '%caliper%' THEN
      NEW.category := 'Brakes';
    ELSIF product_title LIKE '%filter%' OR product_title LIKE '%air filter%' OR product_title LIKE '%oil filter%' THEN
      NEW.category := 'Filters';
    ELSIF product_title LIKE '%chain%' OR product_title LIKE '%sprocket%' THEN
      NEW.category := 'Chain & Sprockets';
    ELSIF product_title LIKE '%helmet%' OR product_title LIKE '%jacket%' OR product_title LIKE '%glove%' OR product_title LIKE '%boot%' THEN
      NEW.category := 'Apparel';
    ELSIF product_title LIKE '%battery%' OR product_title LIKE '%charger%' THEN
      NEW.category := 'Electrical';
    ELSIF product_title LIKE '%oil%' OR product_title LIKE '%lubricant%' OR product_title LIKE '%coolant%' THEN
      NEW.category := 'Oils & Fluids';
    ELSIF product_title LIKE '%lever%' OR product_title LIKE '%mirror%' OR product_title LIKE '%grip%' OR product_title LIKE '%bar%' THEN
      NEW.category := 'Controls';
    ELSIF product_title LIKE '%light%' OR product_title LIKE '%indicator%' OR product_title LIKE '%bulb%' THEN
      NEW.category := 'Lighting';
    ELSIF product_title LIKE '%tyre%' OR product_title LIKE '%tire%' OR product_title LIKE '%tube%' THEN
      NEW.category := 'Tyres';
    ELSE
      NEW.category := 'Accessories';
    END IF;
  ELSE
    NEW.category := 'Uncategorised';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_auto_categorise ON orders;
CREATE TRIGGER trg_auto_categorise
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.category IS NULL)
  EXECUTE FUNCTION auto_categorise_order();

SELECT 'Migration complete' AS result;
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
