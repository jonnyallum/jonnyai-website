import pandas as pd
from supabase import create_client
import time
from datetime import datetime
import requests
import json

# Configuration with correct BL Motorcycles credentials
SUPABASE_URL = "https://kenaardqwnpeqtwukdnb.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlbmFhcmRxd25wZXF0d3VrZG5iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzEzOTAzNywiZXhwIjoyMDYyNzE1MDM3fQ.oZvqA-Z1Gvrajgamp-QDSl74MyLpYsN2QPER--7Pekw"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlbmFhcmRxd25wZXF0d3VrZG5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMzkwMzcsImV4cCI6MjA2MjcxNTAzN30.eOfY8zr3E5hljBDyUuP5d1VIyvuusf9SHSAU5P88UyU"

def log_with_timestamp(message):
    """Enhanced logging with timestamp"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] {message}")

def execute_sql_via_rest(sql_query):
    """Execute SQL using Supabase REST API directly"""
    try:
        log_with_timestamp(f"Executing SQL via REST API...")
        
        # Use PostgREST to execute raw SQL
        url = f"{SUPABASE_URL}/rest/v1/rpc/exec_sql"
        headers = {
            'apikey': SERVICE_KEY,
            'Authorization': f'Bearer {SERVICE_KEY}',
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
        }
        
        payload = {
            'sql': sql_query
        }
        
        response = requests.post(url, headers=headers, json=payload)
        
        if response.status_code in [200, 201, 204]:
            log_with_timestamp("SUCCESS: SQL executed successfully")
            return True
        else:
            log_with_timestamp(f"ERROR: SQL execution failed: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        log_with_timestamp(f"ERROR: SQL execution exception: {str(e)}")
        return False

def create_table_programmatically():
    """Create the ebay_listings table programmatically"""
    try:
        log_with_timestamp("Creating ebay_listings table programmatically...")
        
        # SQL to create table with exact CSV column names
        create_table_sql = """
        -- Drop existing table if it exists
        DROP TABLE IF EXISTS public.ebay_listings;
        
        -- Create table with column names matching CSV exactly
        CREATE TABLE public.ebay_listings (
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
        CREATE INDEX IF NOT EXISTS idx_ebay_customlabel ON public.ebay_listings("CustomLabel");
        
        -- Disable RLS for easier uploads (can be enabled later)
        ALTER TABLE public.ebay_listings DISABLE ROW LEVEL SECURITY;
        
        -- Grant permissions
        GRANT ALL ON public.ebay_listings TO service_role;
        GRANT SELECT, INSERT, UPDATE, DELETE ON public.ebay_listings TO anon;
        """
        
        # Try multiple approaches to execute SQL
        
        # Approach 1: Try using supabase client with raw SQL
        try:
            log_with_timestamp("Approach 1: Using Supabase client...")
            supabase = create_client(SUPABASE_URL, SERVICE_KEY)
            
            # Split SQL into individual statements
            statements = [stmt.strip() for stmt in create_table_sql.split(';') if stmt.strip()]
            
            for i, stmt in enumerate(statements, 1):
                if stmt:
                    log_with_timestamp(f"Executing statement {i}/{len(statements)}...")
                    try:
                        # Try using rpc if available
                        response = supabase.rpc('exec_sql', {'sql': stmt}).execute()
                        log_with_timestamp(f"Statement {i} executed successfully")
                    except Exception as stmt_error:
                        log_with_timestamp(f"Statement {i} failed: {str(stmt_error)}")
                        # Continue with other statements
                        continue
            
            return True
            
        except Exception as e:
            log_with_timestamp(f"Approach 1 failed: {str(e)}")
        
        # Approach 2: Direct HTTP request to PostgREST
        try:
            log_with_timestamp("Approach 2: Direct HTTP to PostgREST...")
            return execute_sql_via_rest(create_table_sql)
            
        except Exception as e:
            log_with_timestamp(f"Approach 2 failed: {str(e)}")
        
        # Approach 3: Create table using Python client methods
        try:
            log_with_timestamp("Approach 3: Using Python client table operations...")
            supabase = create_client(SUPABASE_URL, SERVICE_KEY)
            
            # Try to create a simple record to test if table exists
            test_record = {
                "ItemNumber": "TEST-001",
                "Title": "Test Item",
                "CustomLabel": "TEST",
                "AvailableQuantity": 1,
                "Format": "FixedPrice",
                "Currency": "GBP",
                "CurrentPrice": 1.00,
                "Condition": "New"
            }
            
            # This will fail if table doesn't exist, which tells us we need to create it
            try:
                response = supabase.table('ebay_listings').select('*').limit(1).execute()
                log_with_timestamp("Table already exists!")
                return True
            except:
                log_with_timestamp("Table doesn't exist - manual creation required")
                return False
                
        except Exception as e:
            log_with_timestamp(f"Approach 3 failed: {str(e)}")
        
        return False
        
    except Exception as e:
        log_with_timestamp(f"ERROR: Table creation failed: {str(e)}")
        return False

def upload_data_with_retry():
    """Upload data with retry logic and detailed error handling"""
    try:
        log_with_timestamp("Starting data upload process...")
        supabase = create_client(SUPABASE_URL, SERVICE_KEY)
        
        # Load CSV data
        log_with_timestamp("Loading CSV data...")
        df = pd.read_csv('ebay_sample_500_final.csv')
        
        log_with_timestamp(f"CSV columns: {list(df.columns)}")
        log_with_timestamp(f"CSV shape: {df.shape}")
        
        # Show sample data
        log_with_timestamp("Sample CSV data:")
        for i, row in df.head(2).iterrows():
            log_with_timestamp(f"  Row {i+1}: {dict(row)}")
        
        # Convert to records
        data = df.to_dict('records')
        log_with_timestamp(f"Prepared {len(data)} records for upload")
        
        # Test table access
        log_with_timestamp("Testing table access...")
        try:
            test_response = supabase.table('ebay_listings').select('*').limit(1).execute()
            log_with_timestamp("SUCCESS: Table is accessible")
        except Exception as e:
            log_with_timestamp(f"ERROR: Table access failed: {str(e)}")
            log_with_timestamp("Table may not exist or have wrong schema")
            return False
        
        # Upload in small batches with retry
        batch_size = 10  # Very small batches for reliability
        total_uploaded = 0
        failed_batches = []
        
        for i in range(0, len(data), batch_size):
            batch = data[i:i + batch_size]
            batch_num = (i // batch_size) + 1
            total_batches = (len(data) + batch_size - 1) // batch_size
            
            log_with_timestamp(f"Uploading batch {batch_num}/{total_batches} ({len(batch)} items)...")
            
            # Try batch upload with retries
            success = False
            for attempt in range(3):  # 3 attempts per batch
                try:
                    response = supabase.table('ebay_listings').insert(batch).execute()
                    
                    if hasattr(response, 'data') and response.data:
                        total_uploaded += len(batch)
                        log_with_timestamp(f"SUCCESS: Batch {batch_num} uploaded (attempt {attempt + 1})")
                        success = True
                        break
                    else:
                        log_with_timestamp(f"WARNING: Batch {batch_num} - no data in response (attempt {attempt + 1})")
                        
                except Exception as batch_error:
                    error_msg = str(batch_error)
                    log_with_timestamp(f"ERROR: Batch {batch_num} attempt {attempt + 1} failed: {error_msg}")
                    
                    if attempt == 2:  # Last attempt
                        failed_batches.append((batch_num, batch, error_msg))
                    else:
                        time.sleep(1)  # Wait before retry
            
            if not success:
                log_with_timestamp(f"FAILED: Batch {batch_num} failed all attempts")
            
            # Small delay between batches
            time.sleep(0.2)
        
        # Summary
        log_with_timestamp(f"UPLOAD SUMMARY:")
        log_with_timestamp(f"  Total uploaded: {total_uploaded}/{len(data)}")
        log_with_timestamp(f"  Failed batches: {len(failed_batches)}")
        
        if failed_batches:
            log_with_timestamp("Failed batch details:")
            for batch_num, batch_data, error in failed_batches:
                log_with_timestamp(f"  Batch {batch_num}: {error}")
        
        return total_uploaded > 0
        
    except Exception as e:
        log_with_timestamp(f"CRITICAL ERROR: {str(e)}")
        return False

def verify_final_state():
    """Verify the final state of the database"""
    try:
        log_with_timestamp("Verifying final database state...")
        supabase = create_client(SUPABASE_URL, SERVICE_KEY)
        
        # Get record count
        response = supabase.table('ebay_listings').select('*', count='exact').execute()
        count = response.count if hasattr(response, 'count') else len(response.data)
        
        log_with_timestamp(f"Final record count: {count}")
        
        # Show sample records
        if count > 0:
            sample_response = supabase.table('ebay_listings').select('*').limit(3).execute()
            log_with_timestamp("Sample records:")
            for i, record in enumerate(sample_response.data[:3], 1):
                item_num = record.get('ItemNumber', 'N/A')
                title = record.get('Title', 'N/A')[:40] + '...' if len(record.get('Title', '')) > 40 else record.get('Title', 'N/A')
                price = record.get('CurrentPrice', 'N/A')
                log_with_timestamp(f"  {i}. {item_num} - {title} - £{price}")
        
        return count
        
    except Exception as e:
        log_with_timestamp(f"ERROR: Verification failed: {str(e)}")
        return None

if __name__ == "__main__":
    log_with_timestamp("=== AUTOMATED BL MOTORCYCLES SETUP ===")
    log_with_timestamp("Starting automated table creation and data upload...")
    
    # Step 1: Create table
    log_with_timestamp("STEP 1: Creating table...")
    table_success = create_table_programmatically()
    
    if not table_success:
        log_with_timestamp("WARNING: Automated table creation failed")
        log_with_timestamp("MANUAL SOLUTION: Please run this SQL in Supabase dashboard:")
        log_with_timestamp("URL: https://supabase.com/dashboard/project/kenaardqwnpeqtwukdnb/sql")
        print("""
DROP TABLE IF EXISTS public.ebay_listings;

CREATE TABLE public.ebay_listings (
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

CREATE INDEX IF NOT EXISTS idx_ebay_customlabel ON public.ebay_listings("CustomLabel");
ALTER TABLE public.ebay_listings DISABLE ROW LEVEL SECURITY;
        """)
        log_with_timestamp("After running the SQL, press Enter to continue...")
        input()
    
    # Step 2: Upload data
    log_with_timestamp("STEP 2: Uploading data...")
    upload_success = upload_data_with_retry()
    
    # Step 3: Verify
    log_with_timestamp("STEP 3: Verifying results...")
    final_count = verify_final_state()
    
    # Final summary
    log_with_timestamp("=== FINAL SUMMARY ===")
    if upload_success and final_count and final_count > 0:
        log_with_timestamp(f"SUCCESS: Setup complete! {final_count} records uploaded")
        log_with_timestamp("Next steps:")
        log_with_timestamp("1. Verify data in Supabase dashboard")
        log_with_timestamp("2. Set up eBay API integration")
        log_with_timestamp("3. Configure automated sync processes")
    else:
        log_with_timestamp("INCOMPLETE: Setup had issues - check logs above")
        log_with_timestamp("Troubleshooting steps:")
        log_with_timestamp("1. Verify all Supabase credentials are correct")
        log_with_timestamp("2. Check table exists with correct schema")
        log_with_timestamp("3. Ensure CSV file format matches expectations")
        log_with_timestamp("4. Try running individual components separately")