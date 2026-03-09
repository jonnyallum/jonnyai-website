-- First, remove existing table if it exists
DROP TABLE IF EXISTS ebay_listings;

-- Create the table with proper column names and constraints
CREATE TABLE ebay_listings (
  itemnumber TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  customlabel TEXT,
  availablequantity INTEGER DEFAULT 1,
  format TEXT DEFAULT 'FIXED_PRICE',
  currency TEXT DEFAULT 'GBP',
  currentprice NUMERIC(10,2) CHECK (currentprice >= 0),
  condition TEXT DEFAULT 'New',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX idx_ebay_sku ON ebay_listings(customlabel);

-- Add row-level security if needed (disabled by default)
ALTER TABLE ebay_listings ENABLE ROW LEVEL SECURITY;

-- Verify table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM 
  information_schema.columns 
WHERE 
  table_name = 'ebay_listings'
ORDER BY 
  ordinal_position;