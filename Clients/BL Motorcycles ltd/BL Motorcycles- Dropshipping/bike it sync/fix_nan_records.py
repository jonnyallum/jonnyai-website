#!/usr/bin/env python3
"""
Quick fix for NaN records in CSV
Cleans empty titles and re-uploads failed batches
"""

import pandas as pd
import numpy as np
from supabase import create_client, Client
import os
from datetime import datetime

# Supabase config - BL Motorcycles
SUPABASE_URL = "https://kenaardqwnpeqtwukdnb.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlbmFhcmRxd25wZXF0d3VrZG5iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzEzOTAzNywiZXhwIjoyMDYyNzE1MDM3fQ.oZvqA-Z1Gvrajgamp-QDSl74MyLpYsN2QPER--7Pekw"

def log(msg):
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {msg}")

def main():
    log("QUICK FIX: Cleaning NaN records...")
    
    # Load CSV
    df = pd.read_csv('ebay_sample_500_final.csv')
    log(f"Loaded {len(df)} records")
    
    # Identify problematic records (rows 471-500, batches 48-50)
    problem_start = 470  # 0-indexed
    problem_records = df.iloc[problem_start:].copy()
    
    log(f"Processing {len(problem_records)} potentially problematic records")
    
    # Clean empty titles
    problem_records['Title'] = problem_records['Title'].fillna('Bike It Product - See CustomLabel for Details')
    
    # Ensure all numeric fields are clean
    problem_records['CurrentPrice'] = pd.to_numeric(problem_records['CurrentPrice'], errors='coerce').fillna(39.99)
    problem_records['AvailableQuantity'] = pd.to_numeric(problem_records['AvailableQuantity'], errors='coerce').fillna(1)
    
    # Convert to records
    records = problem_records.to_dict('records')
    
    # Clean any remaining NaN values
    for record in records:
        for key, value in record.items():
            if pd.isna(value):
                if key == 'Title':
                    record[key] = f"Bike It Product {record.get('CustomLabel', 'Unknown')}"
                elif key in ['CurrentPrice']:
                    record[key] = 39.99
                elif key in ['AvailableQuantity']:
                    record[key] = 1
                else:
                    record[key] = 'New' if key == 'Condition' else 'Unknown'
    
    log(f"Cleaned {len(records)} records")
    
    # Upload to Supabase
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    batch_size = 10
    uploaded = 0
    
    for i in range(0, len(records), batch_size):
        batch = records[i:i+batch_size]
        batch_num = (i // batch_size) + 48  # Start from batch 48
        
        try:
            log(f"Uploading batch {batch_num} ({len(batch)} items)...")
            result = supabase.table('ebay_listings').upsert(batch).execute()
            uploaded += len(batch)
            log(f"SUCCESS: Batch {batch_num} uploaded successfully")
        except Exception as e:
            log(f"ERROR: Batch {batch_num} failed: {e}")
    
    log(f"QUICK FIX COMPLETE: {uploaded}/{len(records)} records uploaded")
    
    # Verify final count
    try:
        count_result = supabase.table('ebay_listings').select('*', count='exact').execute()
        total_count = count_result.count
        log(f"Final database count: {total_count}/500 records")
    except Exception as e:
        log(f"Could not verify count: {e}")

if __name__ == "__main__":
    main()