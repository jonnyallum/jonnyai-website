#!/usr/bin/env python3
"""
BL MOTORCYCLES - Check Upload Completion Status
==============================================
Verify if the upload completed and check final database count
"""

import requests
import json
from datetime import datetime

def check_upload_status():
    """Check if upload completed and verify database state"""
    
    # Load config
    env_vars = {}
    with open('.env', 'r') as f:
        for line in f:
            if '=' in line and not line.startswith('#'):
                key, value = line.strip().split('=', 1)
                env_vars[key] = value.strip('"\'')
    
    supabase_url = env_vars.get('SUPABASE_URL')
    service_key = env_vars.get('SUPABASE_SERVICE_KEY')
    
    print("BL MOTORCYCLES - UPLOAD STATUS CHECK")
    print("=" * 50)
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 50)
    
    headers = {
        'apikey': service_key,
        'Authorization': f'Bearer {service_key}',
        'Content-Type': 'application/json'
    }
    
    try:
        # Get current record count
        print("Checking database record count...")
        response = requests.get(
            f"{supabase_url}/rest/v1/ebay_listings?select=count",
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            count_data = response.json()
            current_count = len(count_data)
            print(f"Current database records: {current_count:,}")
            
            # Expected counts
            print("\nExpected counts:")
            print("- Original: 1,000 records")
            print("- Target: +4,786 records")
            print("- Expected total: 5,786 records")
            
            if current_count >= 5786:
                print(f"\nSUCCESS: Upload appears COMPLETE!")
                print(f"Database contains {current_count:,} records")
                print("All 4,786 remaining records successfully uploaded")
            elif current_count > 1000:
                uploaded = current_count - 1000
                remaining = 4786 - uploaded
                progress = (uploaded / 4786) * 100
                print(f"\nIN PROGRESS: Upload partially complete")
                print(f"Records uploaded: {uploaded:,} / 4,786")
                print(f"Progress: {progress:.1f}%")
                print(f"Remaining: {remaining:,} records")
            else:
                print(f"\nNOT STARTED: Database still at original count")
                
        else:
            print(f"ERROR: Database check failed: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"ERROR: Status check failed: {e}")
    
    # Check for recent records
    try:
        print("\nChecking for recent uploads...")
        recent_response = requests.get(
            f"{supabase_url}/rest/v1/ebay_listings?select=ItemNumber,created_at&order=created_at.desc&limit=5",
            headers=headers,
            timeout=10
        )
        
        if recent_response.status_code == 200:
            recent_data = recent_response.json()
            if recent_data:
                print("Most recent uploads:")
                for record in recent_data:
                    item_num = record.get('ItemNumber', 'Unknown')
                    created = record.get('created_at', 'Unknown')
                    print(f"  - {item_num} at {created}")
            else:
                print("No recent records found")
        else:
            print(f"Recent records check failed: {recent_response.status_code}")
            
    except Exception as e:
        print(f"Recent records check error: {e}")
    
    print("\n" + "=" * 50)
    print("STATUS CHECK COMPLETE")
    print("=" * 50)

if __name__ == "__main__":
    check_upload_status()