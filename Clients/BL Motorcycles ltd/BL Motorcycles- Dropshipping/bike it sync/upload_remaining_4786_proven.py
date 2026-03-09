#!/usr/bin/env python3
"""
BL MOTORCYCLES - Upload Remaining 4,786 Records
==============================================
Using PROVEN schema from upload_batch_2_stress_test.py
Records 5501-10286 with 100% success rate approach
"""

import pandas as pd
import numpy as np
from supabase import create_client, Client
import time
from datetime import datetime
import json
import re
import unicodedata

# BL Motorcycles Supabase Configuration
SUPABASE_URL = "https://kenaardqwnpeqtwukdnb.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlbmFhcmRxd25wZXF0d3VrZG5iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzEzOTAzNywiZXhwIjoyMDYyNzE1MDM3fQ.oZvqA-Z1Gvrajgamp-QDSl74MyLpYsN2QPER--7Pekw"

class ProvenUploader:
    """Upload using proven schema and methods"""
    
    def __init__(self):
        self.start_time = None
        self.batch_times = []
        self.total_records = 0
        self.successful_uploads = 0
        self.failed_uploads = 0
        self.errors = []
    
    def start(self):
        self.start_time = time.time()
        self.log("PROVEN UPLOAD STARTED - REMAINING 4,786 RECORDS")
    
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

    def clean_text(self, text):
        """Clean text for Windows compatibility"""
        if pd.isna(text) or text is None:
            return ""
        
        text = str(text)
        # Remove problematic characters for Windows
        text = re.sub(r'[^\x00-\x7F]+', '', text)
        text = unicodedata.normalize('NFKD', text)
        text = text.encode('ascii', 'ignore').decode('ascii')
        
        # Clean HTML and normalize whitespace
        text = re.sub(r'<[^>]+>', '', text)
        text = re.sub(r'\s+', ' ', text)
        
        return text.strip()

    def validate_price(self, price_val):
        """Validate and clean price values"""
        if pd.isna(price_val) or price_val is None:
            return 0.99  # Default price
        
        try:
            price_str = str(price_val).strip()
            price_str = re.sub(r'[£$€¥₹,\s]', '', price_str)
            
            if not price_str:
                return 0.99
            
            price = float(price_str)
            
            if price <= 0 or price > 100000:
                return 0.99
            
            return round(price, 2)
            
        except (ValueError, TypeError):
            return 0.99

    def transform_to_proven_schema(self, df):
        """Transform 01_All_Products_CSV.csv to proven eBay schema"""
        self.log("Transforming records to PROVEN schema format...")
        
        transformed_records = []
        
        for index, row in df.iterrows():
            try:
                # Generate unique ItemNumber starting from BL005501
                item_number = f"BL{str(index + 5501).zfill(6)}"
                
                # Clean and validate data
                title = self.clean_text(row.get('item_title', ''))
                if not title:
                    title = f"Motorcycle Part - {row.get('sku', 'Unknown')}"
                
                # Ensure title length limits (eBay max 80 chars)
                if len(title) > 80:
                    title = title[:77] + "..."
                
                # Price handling with validation
                trade_price = self.validate_price(row.get('trade'))
                srp_price = self.validate_price(row.get('srp'))
                
                # Use SRP if available, otherwise trade price with markup
                if srp_price > 0.99:
                    current_price = srp_price
                elif trade_price > 0.99:
                    current_price = round(trade_price * 1.3, 2)  # 30% markup
                else:
                    current_price = 9.99  # Default price
                
                # Create record using PROVEN schema structure
                record = {
                    'ItemNumber': item_number,
                    'Title': title,
                    'CustomLabel': self.clean_text(row.get('sku', '')),
                    'CurrentPrice': current_price,
                    'AvailableQuantity': 1,
                    'Format': 'FixedPrice',
                    'Currency': 'GBP',
                    'Condition': 'New'
                }
                
                transformed_records.append(record)
                
            except Exception as e:
                self.log(f"Transform error for row {index}: {e}")
                continue
        
        self.log(f"Transformed {len(transformed_records)} records successfully")
        return transformed_records

    def upload_remaining_records(self):
        """Upload remaining 4,786 records using proven methods"""
        self.start()
        
        try:
            # Load the full dataset
            self.log("Loading 01_All_Products_CSV.csv...")
            df = pd.read_csv('01_All_Products_CSV.csv', low_memory=False)
            self.log(f"Loaded {len(df):,} total records")
            
            # Take records 5501-10286 (skip first 5500)
            df_remaining = df.iloc[5500:].copy()
            self.log(f"Selected final {len(df_remaining):,} records for upload")
            
            # Transform to proven schema
            data = self.transform_to_proven_schema(df_remaining)
            
            # Initialize Supabase client
            supabase: Client = create_client(SUPABASE_URL, SERVICE_KEY)
            
            # Check current database state
            self.log("Checking current database state...")
            current_count_response = supabase.table('ebay_listings').select('*', count='exact').execute()
            current_count = current_count_response.count
            self.log(f"Current database contains {current_count} records")
            
            # Upload in batches with proven settings
            batch_size = 10  # Proven batch size
            total_batches = (len(data) + batch_size - 1) // batch_size
            
            self.log(f"Starting upload: {total_batches} batches of {batch_size} items each")
            
            for i in range(0, len(data), batch_size):
                batch = data[i:i + batch_size]
                batch_num = (i // batch_size) + 1
                
                batch_start_time = time.time()
                
                try:
                    # Use upsert to handle potential duplicates (proven method)
                    response = supabase.table('ebay_listings').upsert(batch).execute()
                    batch_duration = time.time() - batch_start_time
                    
                    self.log_batch(batch_num, len(batch), True, batch_duration)
                    
                    # Progress indicator every 50 batches
                    if batch_num % 50 == 0:
                        progress = (batch_num / total_batches) * 100
                        self.log(f"Progress: {progress:.1f}% ({batch_num}/{total_batches} batches)")
                    
                except Exception as batch_error:
                    batch_duration = time.time() - batch_start_time
                    error_msg = str(batch_error)
                    self.log_batch(batch_num, len(batch), False, batch_duration, error_msg)
                    
                    # Try individual items if batch fails (proven fallback)
                    self.log(f"Batch {batch_num} failed, trying individual items...")
                    for j, item in enumerate(batch):
                        try:
                            supabase.table('ebay_listings').upsert([item]).execute()
                            self.successful_uploads += 1
                        except Exception as item_error:
                            self.failed_uploads += 1
                            self.errors.append(f"Item {item.get('ItemNumber', 'Unknown')}: {str(item_error)}")
                
                # Small delay to prevent overwhelming the server
                time.sleep(0.1)
            
            # Final verification
            self.log("Verifying final database state...")
            final_count_response = supabase.table('ebay_listings').select('*', count='exact').execute()
            final_count = final_count_response.count
            
            # Performance statistics
            stats = self.get_stats()
            
            self.log("=== FINAL UPLOAD RESULTS ===")
            self.log(f"Total upload time: {stats['total_time']:.2f} seconds ({stats['total_time']/60:.1f} minutes)")
            self.log(f"Records uploaded: {stats['successful_uploads']}")
            self.log(f"Records failed: {stats['failed_uploads']}")
            self.log(f"Success rate: {stats['success_rate']:.1f}%")
            self.log(f"Average batch time: {stats['avg_batch_time']:.2f} seconds")
            self.log(f"Overall upload rate: {stats['overall_rate']:.1f} records/second")
            self.log(f"Database before: {current_count} records")
            self.log(f"Database after: {final_count} records")
            self.log(f"Net increase: {final_count - current_count} records")
            self.log("=== BL MOTORCYCLES UPLOAD COMPLETE ===")
            
            if stats['errors']:
                self.log(f"Errors encountered: {len(stats['errors'])}")
                for error in stats['errors'][:5]:  # Show first 5 errors
                    self.log(f"  - {error}")
            
            return stats
            
        except Exception as e:
            self.log(f"CRITICAL ERROR: {str(e)}")
            return None

def main():
    """Main execution function"""
    print("=" * 70)
    print("BL MOTORCYCLES - FINAL 4,786 RECORD UPLOAD")
    print("Using PROVEN schema and methods from successful uploads")
    print("=" * 70)
    
    uploader = ProvenUploader()
    results = uploader.upload_remaining_records()
    
    if results:
        print(f"\nUPLOAD COMPLETED SUCCESSFULLY!")
        print(f"Performance: {results['overall_rate']:.1f} records/second")
        print(f"Success Rate: {results['success_rate']:.1f}%")
        print(f"Total Database Records: ~{5500 + results['successful_uploads']:,}")
    else:
        print("\nUPLOAD FAILED - Check logs above")

if __name__ == "__main__":
    main()