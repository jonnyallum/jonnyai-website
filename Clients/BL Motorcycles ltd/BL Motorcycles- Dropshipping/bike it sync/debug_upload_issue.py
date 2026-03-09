#!/usr/bin/env python3
"""
BL MOTORCYCLES - Debug Upload Issue
==================================
Diagnose the 400 error pattern in uploads
"""

import requests
import json
import pandas as pd
from datetime import datetime

def test_supabase_connection():
    """Test basic Supabase connection and table structure"""
    
    # Load config
    env_vars = {}
    with open('.env', 'r') as f:
        for line in f:
            if '=' in line and not line.startswith('#'):
                key, value = line.strip().split('=', 1)
                env_vars[key] = value.strip('"\'')
    
    supabase_url = env_vars.get('SUPABASE_URL')
    supabase_key = env_vars.get('SUPABASE_ANON_KEY')
    service_key = env_vars.get('SUPABASE_SERVICE_KEY')
    
    print("DEBUG BL MOTORCYCLES - UPLOAD DEBUG")
    print("=" * 50)
    print(f"URL: {supabase_url}")
    print(f"ANON Key: {supabase_key[:20]}...")
    print(f"SERVICE Key: {service_key[:20]}...")
    print()
    
    # Test 1: Check table exists
    print("TEST 1: Check table structure")
    headers = {
        'apikey': supabase_key,
        'Authorization': f'Bearer {supabase_key}',
        'Content-Type': 'application/json'
    }
    
    try:
        # Get table info
        response = requests.get(
            f"{supabase_url}/rest/v1/ebay_listings?limit=1",
            headers=headers,
            timeout=10
        )
        print(f"Table check: {response.status_code}")
        if response.status_code == 200:
            print("OK Table exists and accessible")
        else:
            print(f"ERROR Table issue: {response.text}")
            return
    except Exception as e:
        print(f"ERROR Connection failed: {e}")
        return
    
    # Test 2: Try single record upload with ANON key
    print("\nTEST 2: Single record upload (ANON key)")
    test_record = {
        'ebay_listing_id': f'DEBUG_{int(datetime.now().timestamp())}',
        'title': 'Debug Test Record',
        'description': 'Testing upload functionality',
        'price': 9.99,
        'category': 'Test Category',
        'brand': 'Debug Brand',
        'sku': 'DEBUG001',
        'condition': 'New',
        'quantity': 1,
        'shipping_cost': 4.99,
        'images': ['https://via.placeholder.com/400x300?text=Debug'],
        'listing_type': 'FixedPrice',
        'duration': 30,
        'created_at': datetime.now().isoformat(),
        'source_file': 'debug_test.csv',
        'batch_id': 'DEBUG_BATCH'
    }
    
    try:
        response = requests.post(
            f"{supabase_url}/rest/v1/ebay_listings",
            headers=headers,
            json=[test_record],
            timeout=15
        )
        print(f"ANON upload: {response.status_code}")
        if response.status_code in [200, 201]:
            print("OK ANON key upload successful")
        else:
            print(f"ERROR ANON upload failed: {response.text}")
    except Exception as e:
        print(f"ERROR ANON upload error: {e}")
    
    # Test 3: Try with SERVICE key
    print("\nTEST 3: Single record upload (SERVICE key)")
    service_headers = {
        'apikey': service_key,
        'Authorization': f'Bearer {service_key}',
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
    }
    
    test_record['ebay_listing_id'] = f'DEBUG_SERVICE_{int(datetime.now().timestamp())}'
    
    try:
        response = requests.post(
            f"{supabase_url}/rest/v1/ebay_listings",
            headers=service_headers,
            json=[test_record],
            timeout=15
        )
        print(f"SERVICE upload: {response.status_code}")
        if response.status_code in [200, 201]:
            print("OK SERVICE key upload successful")
        else:
            print(f"ERROR SERVICE upload failed: {response.text}")
    except Exception as e:
        print(f"ERROR SERVICE upload error: {e}")
    
    # Test 4: Check current record count
    print("\nTEST 4: Current database count")
    try:
        count_response = requests.get(
            f"{supabase_url}/rest/v1/ebay_listings?select=count",
            headers={'apikey': supabase_key, 'Authorization': f'Bearer {supabase_key}'},
            timeout=10
        )
        if count_response.status_code == 200:
            count_data = count_response.json()
            print(f"Current records: {len(count_data)}")
        else:
            print(f"Count check failed: {count_response.status_code}")
    except Exception as e:
        print(f"Count error: {e}")
    
    # Test 5: Check for duplicate IDs
    print("\nTEST 5: Check for ID conflicts")
    try:
        # Check if BL005501 already exists
        check_response = requests.get(
            f"{supabase_url}/rest/v1/ebay_listings?ebay_listing_id=eq.BL005501",
            headers=headers,
            timeout=10
        )
        if check_response.status_code == 200:
            existing = check_response.json()
            if existing:
                print(f"ERROR CONFLICT: BL005501 already exists!")
                print(f"Existing record: {existing[0].get('created_at', 'Unknown date')}")
            else:
                print("OK No conflict: BL005501 available")
        else:
            print(f"ID check failed: {check_response.status_code}")
    except Exception as e:
        print(f"ID check error: {e}")
    
    print("\n" + "=" * 50)
    print("DIAGNOSIS COMPLETE")
    print("=" * 50)

if __name__ == "__main__":
    test_supabase_connection()