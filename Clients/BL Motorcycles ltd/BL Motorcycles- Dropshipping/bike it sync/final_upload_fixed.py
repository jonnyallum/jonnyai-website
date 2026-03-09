import pandas as pd
from supabase import create_client

# Configuration
SUPABASE_URL = "https://kenaardqwnpeqtwukdnb.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlbmFhcmRxd25wZXF0d3VrZG5iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzEzOTAzNywiZXhwIjoyMDYyNzE1MDM3fQ.oZvqA-Z1Gvrajgamp-QDSl74MyLpYsN2QPER--7Pekw"

def upload_data():
    try:
        # Initialize client
        supabase = create_client(SUPABASE_URL, SERVICE_KEY)
        
        # Disable RLS via direct SQL
        supabase.rpc('execute_postgresql', {
            'query': "ALTER TABLE ebay_listings DISABLE ROW LEVEL SECURITY;",
            'migration_name': 'disable_rls_for_upload'
        }).execute()
        
        # Load and prepare data
        df = pd.read_csv('fully_cleaned_ebay_listings.csv').head(500)
        data = [{
            'itemnumber': str(row['ItemNumber']),
            'title': str(row['Title'])[:255],
            'customlabel': str(row['CustomLabel'])[:100],
            'availablequantity': int(row['AvailableQuantity']),
            'format': str(row['Format']),
            'currency': str(row['Currency']),
            'currentprice': float(row['CurrentPrice']),
            'condition': str(row['Condition'])[:50]
        } for _, row in df.iterrows()]

        # Execute upload
        response = supabase.table('ebay_listings').insert(data).execute()
        print(f"Successfully uploaded {len(data)} items")
        
        # Re-enable RLS
        supabase.rpc('execute_postgresql', {
            'query': "ALTER TABLE ebay_listings ENABLE ROW LEVEL SECURITY;",
            'migration_name': 're_enable_rls'
        }).execute()
        
        return True
        
    except Exception as e:
        print(f"Error during upload: {str(e)}")
        # Ensure RLS gets re-enabled if error occurs
        supabase.rpc('execute_postgresql', {
            'query': "ALTER TABLE ebay_listings ENABLE ROW LEVEL SECURITY;"
        }).execute()
        return False

if __name__ == "__main__":
    upload_data()