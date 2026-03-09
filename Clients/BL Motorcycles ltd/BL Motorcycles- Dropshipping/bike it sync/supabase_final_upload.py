import pandas as pd
from supabase import create_client
import json

# Initialize client
url = "https://kenaardqwnpeqtwukdnb.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlbmFhcmRxd25wZXF0d3VrZG5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMzkwMzcsImV4cCI6MjA2MjcxNTAzN30.eOfY8zr3E5hljBDyUuP5d1VIyvuusf9SHSAU5P88UyU"
supabase = create_client(url, key)

def upload_data():
    try:
        df = pd.read_csv('fully_cleaned_ebay_listings.csv')
        
        # Convert to list of dicts and validate
        data = df.to_dict('records')
        print(f"Attempting to insert {len(data)} records")
        
        # Insert in batches of 500
        for i in range(0, len(data), 500):
            batch = data[i:i+500]
            response = supabase.table('ebay_listings').insert(batch).execute()
            
            if hasattr(response, 'error'):
                print(f"Error in batch {i//500}: {response.error}")
            else:
                print(f"Inserted batch {i//500} successfully")
                
        print("Upload completed!")
        
    except Exception as e:
        print(f"Critical error: {str(e)}")

if __name__ == "__main__":
    upload_data()