import pandas as pd
from supabase import create_client
import time
from datetime import datetime

# Updated Configuration with correct credentials
SUPABASE_URL = "https://kenaardqwnpeqtwukdnb.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlbmFhcmRxd25wZXF0d3VrZG5iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzEzOTAzNywiZXhwIjoyMDYyNzE1MDM3fQ.oZvqA-Z1Gvrajgamp-QDSl74MyLpYsN2QPER--7Pekw"

def log_with_timestamp(message):
    """Enhanced logging with timestamp"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] {message}")

def create_table_if_needed():
    """Create or recreate the ebay_listings table with correct schema"""
    try:
        log_with_timestamp("Creating/updating ebay_listings table...")
        supabase = create_client(SUPABASE_URL, SERVICE_KEY)
        
        # SQL to create table with correct column names matching CSV
        create_table_sql = """
        -- Drop existing table if it exists
        DROP TABLE IF EXISTS ebay_listings;
        
        -- Create table with column names matching CSV exactly
        CREATE TABLE ebay_listings (
          "ItemNumber" TEXT PRIMARY KEY,
          "Title" TEXT NOT NULL,
          "CustomLabel" TEXT,
          "AvailableQuantity" INTEGER DEFAULT 1,
          "Format" TEXT DEFAULT 'FixedPrice',
          "Currency" TEXT DEFAULT 'GBP',
          "CurrentPrice" NUMERIC(10,2) CHECK ("CurrentPrice" >= 0),
          "Condition" TEXT DEFAULT 'New',
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        -- Create index for better performance
        CREATE INDEX idx_ebay_customlabel ON ebay_listings("CustomLabel");
        
        -- Disable RLS for easier uploads (can be enabled later)
        ALTER TABLE ebay_listings DISABLE ROW LEVEL SECURITY;
        """
        
        # Execute the SQL
        response = supabase.rpc('exec_sql', {'sql': create_table_sql}).execute()
        log_with_timestamp("SUCCESS: Table created with correct schema")
        return True
        
    except Exception as e:
        log_with_timestamp(f"ERROR creating table: {str(e)}")
        log_with_timestamp("TIP: You may need to run this SQL manually in Supabase dashboard")
        return False

def upload_data_with_correct_schema():
    """Upload data with schema-matched column names"""
    try:
        log_with_timestamp("Initializing Supabase client...")
        supabase = create_client(SUPABASE_URL, SERVICE_KEY)
        
        log_with_timestamp("Loading eBay data from CSV...")
        df = pd.read_csv('ebay_sample_500_final.csv')
        
        # Verify CSV columns match expected format
        expected_columns = ['ItemNumber', 'Title', 'CustomLabel', 'AvailableQuantity', 'Format', 'Currency', 'CurrentPrice', 'Condition']
        csv_columns = df.columns.tolist()
        
        log_with_timestamp(f"CSV columns: {csv_columns}")
        log_with_timestamp(f"Expected columns: {expected_columns}")
        
        # Check for column mismatches
        missing_columns = [col for col in expected_columns if col not in csv_columns]
        if missing_columns:
            log_with_timestamp(f"WARNING: Missing columns: {missing_columns}")
        
        # Convert to records for upload
        data = df.to_dict('records')
        log_with_timestamp(f"Loaded {len(data)} items for upload")
        
        # Test table access
        log_with_timestamp("Testing table access...")
        try:
            test_response = supabase.table('ebay_listings').select('*').limit(1).execute()
            log_with_timestamp("SUCCESS: Table accessible")
        except Exception as e:
            log_with_timestamp(f"ERROR: Table access failed: {str(e)}")
            log_with_timestamp("TIP: Table may not exist or have wrong schema")
            return False
        
        # Upload in batches
        batch_size = 25  # Smaller batches for reliability
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
                    log_with_timestamp(f"SUCCESS: Batch {batch_num} uploaded")
                else:
                    log_with_timestamp(f"ERROR: Batch {batch_num} failed: {getattr(response, 'error', 'Unknown error')}")
                    
            except Exception as batch_error:
                log_with_timestamp(f"ERROR: Batch {batch_num} error: {str(batch_error)}")
                
                # Detailed error analysis
                error_str = str(batch_error).lower()
                if "duplicate key" in error_str:
                    log_with_timestamp("TIP: Duplicate key - items may already exist")
                elif "column" in error_str and "not found" in error_str:
                    log_with_timestamp("TIP: Column mismatch - check table schema")
                elif "permission" in error_str:
                    log_with_timestamp("TIP: Permission error - check service key")
                
                continue
            
            # Small delay between batches
            time.sleep(0.3)
        
        log_with_timestamp(f"UPLOAD COMPLETE: {total_uploaded}/{len(data)} items uploaded")
        
        if total_uploaded == len(data):
            log_with_timestamp("SUCCESS: All items uploaded successfully!")
            return True
        else:
            log_with_timestamp(f"WARNING: {len(data) - total_uploaded} items failed")
            return False
        
    except Exception as e:
        log_with_timestamp(f"CRITICAL ERROR: {str(e)}")
        return False

def verify_upload():
    """Verify the upload by checking record count"""
    try:
        log_with_timestamp("Verifying upload...")
        supabase = create_client(SUPABASE_URL, SERVICE_KEY)
        
        response = supabase.table('ebay_listings').select('*', count='exact').execute()
        count = response.count if hasattr(response, 'count') else len(response.data)
        
        log_with_timestamp(f"STATUS: Current records in ebay_listings: {count}")
        
        # Show sample records
        if count > 0:
            sample = supabase.table('ebay_listings').select('*').limit(3).execute()
            log_with_timestamp("Sample records:")
            for i, record in enumerate(sample.data[:3], 1):
                log_with_timestamp(f"  {i}. {record.get('ItemNumber', 'N/A')} - {record.get('Title', 'N/A')[:50]}...")
        
        return count
        
    except Exception as e:
        log_with_timestamp(f"ERROR: Verification failed: {str(e)}")
        return None

if __name__ == "__main__":
    log_with_timestamp("=== BL MOTORCYCLES EBAY SETUP ===")
    log_with_timestamp("Starting complete eBay data setup process...")
    
    # Step 1: Create table with correct schema
    log_with_timestamp("STEP 1: Creating table...")
    table_created = create_table_if_needed()
    
    if not table_created:
        log_with_timestamp("ERROR: Table creation failed. Please create manually:")
        log_with_timestamp("SQL to run in Supabase dashboard:")
        print("""
        DROP TABLE IF EXISTS ebay_listings;
        CREATE TABLE ebay_listings (
          "ItemNumber" TEXT PRIMARY KEY,
          "Title" TEXT NOT NULL,
          "CustomLabel" TEXT,
          "AvailableQuantity" INTEGER DEFAULT 1,
          "Format" TEXT DEFAULT 'FixedPrice',
          "Currency" TEXT DEFAULT 'GBP',
          "CurrentPrice" NUMERIC(10,2),
          "Condition" TEXT DEFAULT 'New',
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        ALTER TABLE ebay_listings DISABLE ROW LEVEL SECURITY;
        """)
        exit(1)
    
    # Step 2: Upload data
    log_with_timestamp("STEP 2: Uploading data...")
    upload_success = upload_data_with_correct_schema()
    
    # Step 3: Verify
    log_with_timestamp("STEP 3: Verifying upload...")
    final_count = verify_upload()
    
    # Summary
    log_with_timestamp("=== SUMMARY ===")
    if upload_success and final_count and final_count > 0:
        log_with_timestamp(f"SUCCESS: Setup complete! {final_count} records in database")
        log_with_timestamp("Next steps:")
        log_with_timestamp("1. Check Supabase dashboard to verify data")
        log_with_timestamp("2. Enable RLS if needed for security")
        log_with_timestamp("3. Set up API endpoints for eBay integration")
    else:
        log_with_timestamp("FAILED: Setup incomplete - check errors above")
        log_with_timestamp("Troubleshooting:")
        log_with_timestamp("1. Verify Supabase credentials are correct")
        log_with_timestamp("2. Check table exists with correct schema")
        log_with_timestamp("3. Ensure CSV file is in correct format")