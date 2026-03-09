#!/usr/bin/env python3
"""
BL MOTORCYCLES - Fix Table Schema Issue
======================================
Add missing batch_id column to ebay_listings table
"""

import requests
import json

def fix_table_schema():
    """Add missing batch_id column to fix 400 errors"""
    
    # Load config
    env_vars = {}
    with open('.env', 'r') as f:
        for line in f:
            if '=' in line and not line.startswith('#'):
                key, value = line.strip().split('=', 1)
                env_vars[key] = value.strip('"\'')
    
    supabase_url = env_vars.get('SUPABASE_URL')
    service_key = env_vars.get('SUPABASE_SERVICE_KEY')
    
    print("BL MOTORCYCLES - TABLE SCHEMA FIX")
    print("=" * 40)
    print("ISSUE: Missing 'batch_id' column causing 400 errors")
    print("FIX: Add batch_id column to ebay_listings table")
    print("=" * 40)
    
    # Use service key for schema changes
    headers = {
        'apikey': service_key,
        'Authorization': f'Bearer {service_key}',
        'Content-Type': 'application/json'
    }
    
    # SQL to add missing column
    sql_query = """
    ALTER TABLE ebay_listings 
    ADD COLUMN IF NOT EXISTS batch_id TEXT;
    """
    
    try:
        print("Adding batch_id column...")
        
        # Execute SQL via Supabase REST API
        response = requests.post(
            f"{supabase_url}/rest/v1/rpc/exec_sql",
            headers=headers,
            json={"sql": sql_query},
            timeout=30
        )
        
        if response.status_code in [200, 201]:
            print("OK Column added successfully")
        else:
            print(f"ERROR SQL execution failed: {response.status_code}")
            print(f"Response: {response.text}")
            
            # Try alternative approach - direct SQL execution
            print("\nTrying alternative SQL execution...")
            
            alt_response = requests.post(
                f"{supabase_url}/rest/v1/rpc/sql",
                headers=headers,
                json={"query": sql_query},
                timeout=30
            )
            
            if alt_response.status_code in [200, 201]:
                print("OK Alternative SQL execution successful")
            else:
                print(f"ERROR Alternative failed: {alt_response.status_code}")
                print(f"Response: {alt_response.text}")
                
                # Manual approach - try to understand current schema
                print("\nChecking current table schema...")
                schema_response = requests.get(
                    f"{supabase_url}/rest/v1/ebay_listings?limit=0",
                    headers=headers,
                    timeout=10
                )
                
                print(f"Schema check: {schema_response.status_code}")
                if schema_response.headers.get('content-range'):
                    print(f"Table exists with range: {schema_response.headers.get('content-range')}")
    
    except Exception as e:
        print(f"ERROR Schema fix failed: {e}")
    
    # Test the fix
    print("\nTesting fix with sample upload...")
    test_record = {
        'ebay_listing_id': f'SCHEMA_TEST_{int(__import__("time").time())}',
        'title': 'Schema Test Record',
        'description': 'Testing schema fix',
        'price': 9.99,
        'category': 'Test',
        'brand': 'Test Brand',
        'sku': 'TEST001',
        'condition': 'New',
        'quantity': 1,
        'shipping_cost': 4.99,
        'images': ['https://via.placeholder.com/400x300?text=Test'],
        'listing_type': 'FixedPrice',
        'duration': 30,
        'created_at': __import__("datetime").datetime.now().isoformat(),
        'source_file': 'schema_test.csv',
        'batch_id': 'SCHEMA_FIX_TEST'
    }
    
    try:
        test_response = requests.post(
            f"{supabase_url}/rest/v1/ebay_listings",
            headers=headers,
            json=[test_record],
            timeout=15
        )
        
        print(f"Test upload: {test_response.status_code}")
        if test_response.status_code in [200, 201]:
            print("OK Schema fix successful - uploads working")
        else:
            print(f"ERROR Test upload failed: {test_response.text}")
            
    except Exception as e:
        print(f"ERROR Test upload error: {e}")
    
    print("\n" + "=" * 40)
    print("SCHEMA FIX COMPLETE")
    print("=" * 40)

if __name__ == "__main__":
    fix_table_schema()