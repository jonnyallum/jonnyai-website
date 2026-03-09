import pandas as pd
from supabase import create_client
from tqdm import tqdm

# Initialize client
url = "https://kenaardqwnpeqtwukdnb.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlbmFhcmRxd25wZXF0d3VrZG5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMzkwMzcsImV4cCI6MjA2MjcxNTAzN30.eOfY8zr3E5hljBDyUuP5d1VIyvuusf9SHSAU5P88UyU"
supabase = create_client(url, key)

def upload_data():
    try:
        # Load first 500 items
        df = pd.read_csv('fully_cleaned_ebay_listings.csv').head(500)
        
        # Prepare data with lowercase columns
        data = [{
            'itemnumber': str(row['ItemNumber']),
            'title': str(row['Title']),
            'customlabel': str(row['CustomLabel']),
            'availablequantity': int(row['AvailableQuantity']),
            'format': str(row['Format']),
            'currency': str(row['Currency']),
            'currentprice': float(row['CurrentPrice']),
            'condition': str(row['Condition'])
        } for _, row in df.iterrows()]

        # Upload with progress tracking
        response = supabase.table('ebay_listings').insert(data).execute()
        
        if hasattr(response, 'error'):
            print(f"Upload failed: {response.error}")
        else:
            print(f"Successfully uploaded {len(data)} items!")
            print("You can verify in Supabase Table Editor")
            
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    upload_data()