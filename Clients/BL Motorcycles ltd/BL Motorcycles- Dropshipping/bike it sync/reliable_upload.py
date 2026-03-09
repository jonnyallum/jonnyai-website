import pandas as pd
from supabase import create_client
import time

# Config
SUPABASE_URL = "https://kenaardqwnpeqtwukdnb.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlbmFhcmRxd25wZXF0d3VrZG5iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzEzOTAzNywiZXhwIjoyMDYyNzE1MDM3fQ.oZvqA-Z1Gvrajgamp-QDSl74MyLpYsN2QPER--7Pekw"
CHUNK_SIZE = 50  # Smaller batches for reliability
MAX_RETRIES = 3

def upload_data():
    try:
        print("Initializing Supabase client...")
        supabase = create_client(SUPABASE_URL, SERVICE_KEY)
        
        print("Loading data...")
        df = pd.read_csv('ebay_sample_500_final.csv')
        total_items = len(df)
        print(f"Preparing to upload {total_items} items in chunks of {CHUNK_SIZE}")
        
        # Process in chunks with retries
        for i in range(0, total_items, CHUNK_SIZE):
            chunk = df[i:i+CHUNK_SIZE].to_dict('records')
            uploaded = False
            attempts = 0
            
            while not uploaded and attempts < MAX_RETRIES:
                attempts += 1
                try:
                    print(f"Uploading items {i+1}-{min(i+CHUNK_SIZE, total_items)} (Attempt {attempts})")
                    response = supabase.table('ebay_listings').insert(chunk).execute()
                    
                    if hasattr(response, 'error'):
                        print(f"Error on attempt {attempts}: {response.error}")
                        time.sleep(2)  # Backoff before retry
                    else:
                        print(f"Successfully uploaded {len(chunk)} items")
                        uploaded = True
                        
                except Exception as e:
                    print(f"Exception on attempt {attempts}: {str(e)}")
                    time.sleep(3)  # Longer backoff for exceptions
            
            if not uploaded:
                print(f"Failed to upload chunk {i+1}-{i+CHUNK_SIZE} after {MAX_RETRIES} attempts")
                return False
        
        print("All items processed successfully!")
        return True
        
    except Exception as e:
        print(f"Fatal error: {str(e)}")
        return False

if __name__ == "__main__":
    upload_data()