import requests
import json

# Supabase configuration
SUPABASE_URL = "https://kenaardqwnpeqtwukdnb.supabase.co/rest/v1/rpc/execute_postgresql"
API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlbmFhcmRxd25wZXF0d3VrZG5iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzEzOTAzNywiZXhwIjoyMDYyNzE1MDM3fQ.oZvqA-Z1Gvrajgamp-QDSl74MyLpYsN2QPER--7Pekw"

def create_tables():
    try:
        headers = {
            "apikey": API_KEY,
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        }
        
        # Table creation SQL
        sql = """
        CREATE TABLE ebay_listings (
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
        CREATE INDEX idx_ebay_sku ON ebay_listings(CustomLabel);
        """
        
        response = requests.post(
            SUPABASE_URL,
            headers=headers,
            json={"query": sql}
        )
        
        if response.status_code == 200:
            print("Tables created successfully!")
            return True
        else:
            print(f"Error creating tables: {response.status_code}")
            print(response.text)
            return False
            
    except Exception as e:
        print(f"Critical error: {str(e)}")
        return False

if __name__ == "__main__":
    create_tables()