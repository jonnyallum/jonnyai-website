import pandas as pd
from supabase import create_client

# Configuration
SUPABASE_URL = "https://kenaardqwnpeqtwukdnb.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlbmFhcmRxd25wZXF0d3VrZG5iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzEzOTAzNywiZXhwIjoyMDYyNzE1MDM3fQ.oZvqA-Z1Gvrajgamp-QDSl74MyLpYsN2QPER--7Pekw"

def upload_data():
    try:
        # Initialize client
        supabase = create_client(SUPABASE_URL, SERVICE_KEY)
        
        # Load prepared eBay data
        df = pd.read_csv('ebay_sample_500_final.csv')
        data = df.to_dict('records')
        
        # Disable RLS via dashboard first (manual step)
        print("Please disable RLS in Supabase dashboard before continuing")
        input("Press Enter after disabling RLS...")
        
        # Upload data
        response = supabase.table('ebay_listings').insert(data).execute()
        
        if hasattr(response, 'error'):
            print(f"Upload failed: {response.error}")
        else:
            print(f"Successfully uploaded {len(data)} items")
            
        # Reminder to re-enable RLS
        print("\nIMPORTANT: Re-enable RLS in Supabase dashboard when done")
        
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    upload_data()