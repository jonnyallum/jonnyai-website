#!/usr/bin/env python3
"""
BL Motorcycles - Batch 2 Stress Test Upload
Tests system performance with second 500 items (501-1000)
Enhanced monitoring and performance metrics
"""

import pandas as pd
import numpy as np
from supabase import create_client, Client
import time
from datetime import datetime
import json

# BL Motorcycles Supabase Configuration
SUPABASE_URL = "https://kenaardqwnpeqtwukdnb.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlbmFhcmRxd25wZXF0d3VrZG5iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzEzOTAzNywiZXhwIjoyMDYyNzE1MDM3fQ.oZvqA-Z1Gvrajgamp-QDSl74MyLpYsN2QPER--7Pekw"

class PerformanceMonitor:
    def __init__(self):
        self.start_time = None
        self.batch_times = []
        self.total_records = 0
        self.successful_uploads = 0
        self.failed_uploads = 0
        self.errors = []
    
    def start(self):
        self.start_time = time.time()
        self.log("STRESS TEST STARTED")
    
    def log_batch(self, batch_num, batch_size, success, duration, error=None):
        self.batch_times.append(duration)
        if success:
            self.successful_uploads += batch_size
        else:
            self.failed_uploads += batch_size
            if error:
                self.errors.append(f"Batch {batch_num}: {error}")
        
        rate = batch_size / duration if duration > 0 else 0
        self.log(f"Batch {batch_num}: {batch_size} items in {duration:.2f}s ({rate:.1f} items/sec)")
    
    def get_stats(self):
        total_time = time.time() - self.start_time if self.start_time else 0
        avg_batch_time = np.mean(self.batch_times) if self.batch_times else 0
        overall_rate = self.successful_uploads / total_time if total_time > 0 else 0
        
        return {
            'total_time': total_time,
            'successful_uploads': self.successful_uploads,
            'failed_uploads': self.failed_uploads,
            'success_rate': (self.successful_uploads / (self.successful_uploads + self.failed_uploads)) * 100 if (self.successful_uploads + self.failed_uploads) > 0 else 0,
            'avg_batch_time': avg_batch_time,
            'overall_rate': overall_rate,
            'errors': self.errors
        }
    
    def log(self, message):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] {message}")

def clean_data_advanced(df):
    """Advanced data cleaning with comprehensive validation"""
    monitor = PerformanceMonitor()
    monitor.log("Starting advanced data cleaning...")
    
    original_count = len(df)
    
    # Handle missing values
    df['Title'] = df['Title'].fillna('Bike It Product - See CustomLabel for Details')
    df['CustomLabel'] = df['CustomLabel'].fillna('UNKNOWN')
    df['AvailableQuantity'] = pd.to_numeric(df['AvailableQuantity'], errors='coerce').fillna(1)
    df['CurrentPrice'] = pd.to_numeric(df['CurrentPrice'], errors='coerce').fillna(0.99)
    df['Format'] = df['Format'].fillna('FixedPrice')
    df['Currency'] = df['Currency'].fillna('GBP')
    df['Condition'] = df['Condition'].fillna('New')
    
    # Data validation
    df = df[df['CurrentPrice'] > 0]  # Remove zero/negative prices
    df = df[df['AvailableQuantity'] > 0]  # Remove zero quantity items
    df = df[df['ItemNumber'].notna()]  # Remove items without ItemNumber
    
    # Remove duplicates
    df = df.drop_duplicates(subset=['ItemNumber'])
    
    # Clean text fields
    df['Title'] = df['Title'].str.strip()
    df['CustomLabel'] = df['CustomLabel'].str.strip()
    
    cleaned_count = len(df)
    monitor.log(f"Data cleaning complete: {original_count} -> {cleaned_count} records")
    
    return df

def upload_with_performance_monitoring(csv_file):
    """Upload with comprehensive performance monitoring"""
    monitor = PerformanceMonitor()
    monitor.start()
    
    try:
        # Load and clean data
        monitor.log(f"Loading CSV file: {csv_file}")
        df = pd.read_csv(csv_file)
        monitor.log(f"Loaded {len(df)} records")
        
        # Clean data
        df = clean_data_advanced(df)
        
        # Convert to records and clean NaN values
        data = df.to_dict('records')
        
        # Advanced NaN cleaning
        for record in data:
            for key, value in record.items():
                if pd.isna(value):
                    if key == 'Title':
                        record[key] = f"Bike It Product {record.get('CustomLabel', 'Unknown')}"
                    elif key in ['CurrentPrice']:
                        record[key] = 0.99
                    elif key in ['AvailableQuantity']:
                        record[key] = 1
                    elif key == 'Condition':
                        record[key] = 'New'
                    elif key == 'Format':
                        record[key] = 'FixedPrice'
                    elif key == 'Currency':
                        record[key] = 'GBP'
                    else:
                        record[key] = ''
        
        monitor.log(f"Prepared {len(data)} records for upload")
        
        # Initialize Supabase client
        supabase: Client = create_client(SUPABASE_URL, SERVICE_KEY)
        
        # Check current database state
        monitor.log("Checking current database state...")
        current_count_response = supabase.table('ebay_listings').select('*', count='exact').execute()
        current_count = current_count_response.count
        monitor.log(f"Current database contains {current_count} records")
        
        # Upload in batches with performance monitoring
        batch_size = 10
        total_batches = (len(data) + batch_size - 1) // batch_size
        
        monitor.log(f"Starting upload: {total_batches} batches of {batch_size} items each")
        
        for i in range(0, len(data), batch_size):
            batch = data[i:i + batch_size]
            batch_num = (i // batch_size) + 1
            
            batch_start_time = time.time()
            
            try:
                # Use upsert to handle potential duplicates
                response = supabase.table('ebay_listings').upsert(batch).execute()
                batch_duration = time.time() - batch_start_time
                
                monitor.log_batch(batch_num, len(batch), True, batch_duration)
                
                # Progress indicator
                if batch_num % 10 == 0:
                    progress = (batch_num / total_batches) * 100
                    monitor.log(f"Progress: {progress:.1f}% ({batch_num}/{total_batches} batches)")
                
            except Exception as batch_error:
                batch_duration = time.time() - batch_start_time
                error_msg = str(batch_error)
                monitor.log_batch(batch_num, len(batch), False, batch_duration, error_msg)
                
                # Try individual items if batch fails
                monitor.log(f"Batch {batch_num} failed, trying individual items...")
                for j, item in enumerate(batch):
                    try:
                        supabase.table('ebay_listings').upsert([item]).execute()
                        monitor.successful_uploads += 1
                    except Exception as item_error:
                        monitor.failed_uploads += 1
                        monitor.errors.append(f"Item {item.get('ItemNumber', 'Unknown')}: {str(item_error)}")
            
            # Small delay to prevent overwhelming the server
            time.sleep(0.1)
        
        # Final verification
        monitor.log("Verifying final database state...")
        final_count_response = supabase.table('ebay_listings').select('*', count='exact').execute()
        final_count = final_count_response.count
        
        # Performance statistics
        stats = monitor.get_stats()
        
        monitor.log("=== STRESS TEST RESULTS ===")
        monitor.log(f"Total upload time: {stats['total_time']:.2f} seconds")
        monitor.log(f"Records uploaded: {stats['successful_uploads']}")
        monitor.log(f"Records failed: {stats['failed_uploads']}")
        monitor.log(f"Success rate: {stats['success_rate']:.1f}%")
        monitor.log(f"Average batch time: {stats['avg_batch_time']:.2f} seconds")
        monitor.log(f"Overall upload rate: {stats['overall_rate']:.1f} records/second")
        monitor.log(f"Database before: {current_count} records")
        monitor.log(f"Database after: {final_count} records")
        monitor.log(f"Net increase: {final_count - current_count} records")
        
        if stats['errors']:
            monitor.log(f"Errors encountered: {len(stats['errors'])}")
            for error in stats['errors'][:5]:  # Show first 5 errors
                monitor.log(f"  - {error}")
        
        return stats
        
    except Exception as e:
        monitor.log(f"CRITICAL ERROR: {str(e)}")
        return None

if __name__ == "__main__":
    print("=" * 60)
    print("BL MOTORCYCLES - BATCH 2 STRESS TEST")
    print("=" * 60)
    
    # Run stress test
    results = upload_with_performance_monitoring('ebay_sample_501_1000.csv')
    
    if results:
        print("\nSTRESS TEST COMPLETED SUCCESSFULLY!")
        print(f"Performance: {results['overall_rate']:.1f} records/second")
        print(f"Success Rate: {results['success_rate']:.1f}%")
    else:
        print("\nSTRESS TEST FAILED - Check logs above")