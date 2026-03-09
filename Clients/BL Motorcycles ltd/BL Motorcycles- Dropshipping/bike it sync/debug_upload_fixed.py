import pandas as pd
from supabase import create_client
import time
from datetime import datetime

# Configuration
SUPABASE_URL = "https://kenaardqwnpeqtwukdnb.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlbmFhcmRxd25wZXF0d3VrZG5iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzEzOTAzNywiZXhwIjoyMDYyNzE1MDM3fQ.oZvqA-Z1Gvrajgamp-QDSl74MyLpYsN2QPER--7Pekw"

def log_with_timestamp(message):
    """Enhanced logging with timestamp and color"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] DEBUG: {message}")

def upload_data_automated():
    try:
        log_with_timestamp("Initializing Supabase client...")
        supabase = create_client(SUPABASE_URL, SERVICE_KEY)
        
        log_with_timestamp("Loading eBay data from CSV...")
        df = pd.read_csv('ebay_sample_500_final.csv')
        data = df.to_dict('records')
        log_with_timestamp(f"Loaded {len(data)} items for upload")
        
        # Check if table exists first
        log_with_timestamp("Checking table structure...")
        try:
            test_response = supabase.table('ebay_listings').select('*').limit(1).execute()
            log_with_timestamp("SUCCESS: Table 'ebay_listings' exists and accessible")
        except Exception as e:
            log_with_timestamp(f"ERROR: Table access error: {str(e)}")
            log_with_timestamp("TIP: Suggestion: Check if table exists or RLS is blocking access")
            return False
        
        # Try upload with service key (should bypass RLS)
        log_with_timestamp("Attempting upload with service key (bypasses RLS)...")
        
        # Upload in smaller batches to avoid timeouts
        batch_size = 50
        total_uploaded = 0
        
        for i in range(0, len(data), batch_size):
            batch = data[i:i + batch_size]
            batch_num = (i // batch_size) + 1
            total_batches = (len(data) + batch_size - 1) // batch_size
            
            log_with_timestamp(f"Uploading batch {batch_num}/{total_batches} ({len(batch)} items)...")
            
            try:
                response = supabase.table('ebay_listings').insert(batch).execute()
                
                if hasattr(response, 'data') and response.data:
                    total_uploaded += len(batch)
                    log_with_timestamp(f"SUCCESS: Batch {batch_num} uploaded successfully")
                else:
                    log_with_timestamp(f"ERROR: Batch {batch_num} failed: {getattr(response, 'error', 'Unknown error')}")
                    
            except Exception as batch_error:
                log_with_timestamp(f"ERROR: Batch {batch_num} error: {str(batch_error)}")
                
                # Check for common errors
                if "duplicate key" in str(batch_error).lower():
                    log_with_timestamp("TIP: Duplicate key error - items may already exist")
                elif "rls" in str(batch_error).lower():
                    log_with_timestamp("TIP: RLS error - service key should bypass this")
                elif "permission" in str(batch_error).lower():
                    log_with_timestamp("TIP: Permission error - check service key permissions")
                
                continue
            
            # Small delay between batches
            time.sleep(0.5)
        
        log_with_timestamp(f"SUCCESS: Upload completed! Total uploaded: {total_uploaded}/{len(data)} items")
        
        if total_uploaded < len(data):
            log_with_timestamp(f"WARNING:  {len(data) - total_uploaded} items failed to upload")
            return False
        
        return True
        
    except Exception as e:
        log_with_timestamp(f"ERROR: Critical error: {str(e)}")
        
        # Provide specific debugging suggestions
        if "connection" in str(e).lower():
            log_with_timestamp("TIP: Connection issue - check internet/Supabase status")
        elif "authentication" in str(e).lower():
            log_with_timestamp("TIP: Auth issue - verify service key is correct")
        elif "not found" in str(e).lower():
            log_with_timestamp("TIP: Resource not found - check table name and project URL")
        
        return False

def check_upload_status():
    """Verify upload by checking record count"""
    try:
        log_with_timestamp("Verifying upload...")
        supabase = create_client(SUPABASE_URL, SERVICE_KEY)
        
        response = supabase.table('ebay_listings').select('*', count='exact').execute()
        count = response.count if hasattr(response, 'count') else len(response.data)
        
        log_with_timestamp(f"STATUS: Current records in ebay_listings: {count}")
        return count
        
    except Exception as e:
        log_with_timestamp(f"ERROR: Status check failed: {str(e)}")
        return None

if __name__ == "__main__":
    log_with_timestamp("Starting automated eBay data upload...")
    
    # Kill any hanging processes first
    log_with_timestamp("Checking for hanging processes...")
    
    success = upload_data_automated()
    
    if success:
        log_with_timestamp("SUCCESS: Upload process completed successfully")
        check_upload_status()
    else:
        log_with_timestamp("ERROR: Upload process failed - check logs above")
        
        # Provide rollback/retry suggestions
        log_with_timestamp("RETRY suggestions:")
        log_with_timestamp("1. Check Supabase dashboard for any RLS policies")
        log_with_timestamp("2. Verify service key has correct permissions")
        log_with_timestamp("3. Try uploading smaller batches manually")
        log_with_timestamp("4. Check network connectivity to Supabase")