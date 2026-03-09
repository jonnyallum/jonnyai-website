-- BL Motorcycles Enterprise - Master Schema Build
-- Database: ddjuoeyaoxllockcusgf

-- 1. Inventory Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT UNIQUE NOT NULL,
  supplier_sku TEXT,
  supplier_id TEXT NOT NULL,
  brand TEXT,
  title TEXT NOT NULL,
  description TEXT,
  trade_price NUMERIC(10,2) NOT NULL,
  retail_price NUMERIC(10,2),
  selling_price NUMERIC(10,2),
  stock_level INTEGER DEFAULT 0,
  category TEXT,
  image_url TEXT,
  is_active_on_ebay BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Fitment Table
CREATE TABLE IF NOT EXISTS public.fitment (
  id BIGSERIAL PRIMARY KEY,
  sku TEXT NOT NULL REFERENCES public.products(sku) ON DELETE CASCADE,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  cc INTEGER,
  year_start INTEGER,
  year_end INTEGER,
  is_verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel TEXT NOT NULL,
  channel_order_id TEXT UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  shipping_address JSONB NOT NULL,
  items JSONB NOT NULL,
  total_price NUMERIC(10,2),
  fulfillment_status TEXT DEFAULT 'PENDING',
  supplier_order_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Pricing Trigger
CREATE OR REPLACE FUNCTION public.calculate_selling_price()
RETURNS TRIGGER AS $$
BEGIN
  NEW.selling_price := (NEW.trade_price * 1.5) + 6.00;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_selling_price ON public.products;
CREATE TRIGGER trg_update_selling_price
BEFORE INSERT OR UPDATE OF trade_price ON public.products
FOR EACH ROW EXECUTE FUNCTION public.calculate_selling_price();

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_products_supplier_sku ON public.products(supplier_id, sku);
CREATE INDEX IF NOT EXISTS idx_products_image_rank ON public.products((image_url IS NOT NULL) DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_ebay_active ON public.products(is_active_on_ebay) WHERE is_active_on_ebay = TRUE;
CREATE INDEX IF NOT EXISTS idx_fitment_make_model_year ON public.fitment(make, model, year_start, year_end);
CREATE INDEX IF NOT EXISTS idx_fitment_sku ON public.fitment(sku);
