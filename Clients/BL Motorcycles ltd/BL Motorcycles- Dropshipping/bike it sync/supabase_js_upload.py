import pandas as pd
from supabase import create_client, Client
import json

# Initialize client
url: str = "https://kenaardqwnpeqtwukdnb.supabase.co"
key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlbmFhcmRxd25wZXF0d3VrZG5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMzkwMzcsImV4cCI6MjA2MjcxNTAzN30.eOfY8zr3E5hljBDyUuP5d1VIyvuusf9SHSAU5P88UyU"
supabase: Client = create_client(url, key)

def upload_data():
    try:
        # Read and clean data
        df = pd.read_csv('fully_cleaned_ebay_listings.csv')
        records = df.to_dict('records')
        
        # Convert to JSON string for better error reporting
        data = json.dumps(records)
        
        # Direct REST API call
        response = supabase.table('ebay_listings').insert(json.loads(data)).execute()
        
        if hasattr(response, 'error'):
            print("Error details:", response.error)
        else:
            print(f"Successfully inserted {len(records)} rows")
            
    except Exception as e:
        print("Full error details:")
        print(str(e))
        print("\nTroubleshooting steps:")
        print("1. Verify table exists with correct columns")
        print("2. Check API key permissions")
        print("3. Test with smaller dataset")

if __name__ == "__main__":
    upload_data()