from supabase import create_client

# Initialize client with service role key
url = "https://kenaardqwnpeqtwukdnb.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlbmFhcmRxd25wZXF0d3VrZG5iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzEzOTAzNywiZXhwIjoyMDYyNzE1MDM3fQ.oZvqA-Z1Gvrajgamp-QDSl74MyLpYsN2QPER--7Pekw"
supabase = create_client(url, key)

def create_table():
    try:
        # Enable unsafe mode for schema changes
        supabase.rpc('live_dangerously', {'service': 'database', 'enable_unsafe_mode': True}).execute()
        
        # Create table with indexes
        create_query = """
        CREATE TABLE IF NOT EXISTS ebay_listings (
          ItemNumber TEXT PRIMARY KEY,
          Title TEXT NOT NULL,
          CustomLabel TEXT,
          AvailableQuantity INTEGER DEFAULT 1,
          Format TEXT DEFAULT 'FIXED_PRICE',
          Currency TEXT DEFAULT 'GBP',
          CurrentPrice NUMERIC(10,2) CHECK (CurrentPrice >= 0),
          Condition TEXT DEFAULT 'New',
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_ebay_sku ON ebay_listings(CustomLabel);
        """
        
        response = supabase.rpc('execute_postgresql', {
            'query': create_query,
            'migration_name': 'create_ebay_listings_table'
        }).execute()
        
        print("Table created successfully!")
        return True
        
    except Exception as e:
        print(f"Error creating table: {str(e)}")
        return False

if __name__ == "__main__":
    create_table()