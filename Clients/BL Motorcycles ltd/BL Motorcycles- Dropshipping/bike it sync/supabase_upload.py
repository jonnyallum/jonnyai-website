import pandas as pd
from supabase import create_client
from tqdm import tqdm

# Initialize client
url = "https://kenaardqwnpeqtwukdnb.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlbmFhcmRxd25wZXF0d3VrZG5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMzkwMzcsImV4cCI6MjA2MjcxNTAzN30.eOfY8zr3E5hljBDyUuP5d1VIyvuusf9SHSAU5P88UyU"
supabase = create_client(url, key)

# Upload function with error handling
def upload_to_supabase():
    try:
        # Process in chunks with progress bar
        chunks = pd.read_csv('fully_cleaned_ebay_listings.csv', chunksize=500)
        for chunk in tqdm(chunks, desc="Uploading chunks"):
            data = chunk.to_dict('records')
            response = supabase.table('ebay_listings').insert(data).execute()
            
            # Enhanced error handling
            if isinstance(response, dict) and 'error' in response:
                print(f"Error in chunk: {response['error']}")
                continue
            elif not isinstance(response.data, list):
                print(f"Unexpected response format: {response}")
                continue
                
        print("Upload completed successfully!")
        
    except Exception as e:
        print(f"Upload failed. Full error details:")
        print(str(e))
        print("Please check:")
        print("- Table structure matches the CSV columns")
        print("- API key has proper permissions")
        print("- Network connection is stable")

if __name__ == "__main__":
    upload_to_supabase()