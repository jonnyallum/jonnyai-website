import pandas as pd
import requests
import json

# Supabase configuration
SUPABASE_URL = "https://kenaardqwnpeqtwukdnb.supabase.co/rest/v1/ebay_listings"
API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlbmFhcmRxd25wZXF0d3VrZG5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMzkwMzcsImV4cCI6MjA2MjcxNTAzN30.eOfY8zr3E5hljBDyUuP5d1VIyvuusf9SHSAU5P88UyU"

def upload_data():
    try:
        # Load and prepare data
        df = pd.read_csv('fully_cleaned_ebay_listings.csv')
        records = df.to_dict('records')
        
        # Split into batches of 500
        for i in range(0, len(records), 500):
            batch = records[i:i+500]
            
            # Make API request
            headers = {
                "apikey": API_KEY,
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            }
            
            response = requests.post(
                SUPABASE_URL,
                headers=headers,
                json=batch
            )
            
            # Check response
            if response.status_code == 201:
                print(f"Successfully uploaded batch {i//500 + 1}")
            else:
                print(f"Error in batch {i//500 + 1}: {response.status_code}")
                print("Response:", response.text)
                break
                
    except Exception as e:
        print("Critical error:", str(e))

if __name__ == "__main__":
    upload_data()