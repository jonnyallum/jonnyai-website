-- BL Motorcycles: Orders Table Migration
-- Run in Supabase SQL Editor for project ddjuoeyaoxllockcusgf
-- Safe to re-run: all statements use IF NOT EXISTS

-- orders table already exists with (id, shipping_address, created_at)
-- Add all missing columns:

ALTER TABLE orders ADD COLUMN IF NOT EXISTS ebay_order_id      TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS ebay_line_item_id  TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS ebay_item_id       TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS sku                TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS buyer_username     TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS buyer_name         TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS buyer_email        TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS qty                INT NOT NULL DEFAULT 1;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS sale_price         DECIMAL(10,2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS trade_price        DECIMAL(10,2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS bikeit_order_ref   TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS status             TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number    TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS carrier            TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS error_message      TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at         TIMESTAMPTZ DEFAULT NOW();

-- Unique constraint on ebay_order_id (prevents duplicates)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'orders_ebay_order_id_key'
  ) THEN
    ALTER TABLE orders ADD CONSTRAINT orders_ebay_order_id_key UNIQUE (ebay_order_id);
  END IF;
END $$;

-- Status check constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'orders_status_check'
  ) THEN
    ALTER TABLE orders ADD CONSTRAINT orders_status_check
      CHECK (status IN ('pending','ordering','ordered','dispatched','failed','cancelled'));
  END IF;
END $$;

-- Add ebay_item_id to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS ebay_item_id TEXT;

-- Indexes
CREATE INDEX IF NOT EXISTS orders_status_idx        ON orders(status);
CREATE INDEX IF NOT EXISTS orders_sku_idx           ON orders(sku);
CREATE INDEX IF NOT EXISTS orders_ebay_order_id_idx ON orders(ebay_order_id);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_orders_updated_at();
