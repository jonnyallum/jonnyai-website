import pandas as pd
from supabase import create_client
import requests
from tqdm import tqdm

# Configuration
SUPABASE_URL = "https://kenaardqwnpeqtwukdnb.supabase.co"
API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlbmFhcmRxd25wZXF0d3VrZG5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMzkwMzcsImV4cCI6MjA2MjcxNTAzN30.eOfY8zr3E5hljBDyUuP5d1VIyvuusf9SHSAU5P88UyU"

def get_table_columns():
    try:
        response = requests.get(
            f"{SUPABASE_URL}/rest/v1/ebay_listings?limit=1",
            headers={"apikey": API_KEY}
        )
        if response.json():
            return list(response.json()[0].keys())
        return None
    except:
        return None

def upload_data():
    supabase = create_client(SUPABASE_URL, API_KEY)
    columns = get_table_columns()
    
    if not columns:
        print("Error: Could not determine table columns")
        return False

    try:
        df = pd.read_csv('fully_cleaned_ebay_listings.csv')
        # Auto-map columns
        data = df.rename(columns={col: col.lower() for col in df.columns}).to_dict('records')
        
        # Upload in batches
        for i in tqdm(range(0, len(data), 200), desc="Uploading"):
            batch = data[i:i+200]
            response = supabase.table('ebay_listings').insert(batch).execute()
            if hasattr(response, 'error'):
                print(f"Error in batch {i//200}: {response.error}")
                return False
                
        print("Upload completed successfully!")
        return True
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

if __name__ == "__main__":
    upload_data()