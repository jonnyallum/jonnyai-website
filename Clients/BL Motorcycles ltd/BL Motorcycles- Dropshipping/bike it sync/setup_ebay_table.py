from supabase import create_client

url = "https://kenaardqwnpeqtwukdnb.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlbmFhcmRxd25wZXF0d3VrZG5iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzEzOTAzNywiZXhwIjoyMDYyNzE1MDM3fQ.oZvqA-Z1Gvrajgamp-QDSl74MyLpYsN2QPER--7Pekw"

def setup_table():
    supabase = create_client(url, key)
    
    # Drop table if exists
    supabase.rpc('execute_postgresql', {
        'query': "DROP TABLE IF EXISTS ebay_listings;"
    }).execute()
    
    # Create table with proper schema
    create_table = """
    CREATE TABLE ebay_listings (
        item_number TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        custom_label TEXT,
        available_quantity INTEGER,
        format TEXT,
        currency TEXT,
        current_price NUMERIC,
        condition TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
    );
    """
    supabase.rpc('execute_postgresql', {
        'query': create_table
    }).execute()
    
    print("Table 'ebay_listings' created with proper schema")

if __name__ == "__main__":
    setup_table()