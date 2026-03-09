#!/usr/bin/env python3
"""
BL MOTORCYCLES - 5,000 RECORD STRESS TEST
============================================
Based on proven upload_batch_2_stress_test.py approach
"""

import pandas as pd
import numpy as np
import requests
import json
import time
import os
import sys
from datetime import datetime
import logging
import re
import unicodedata

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)s | %(message)s',
    handlers=[
        logging.FileHandler('stress_test_5000.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

class StressTest5000:
    """5,000 record stress test using proven methods"""
    
    def __init__(self):
        self.load_config()
        self.start_time = time.time()
        self.records_processed = 0
        self.successful_uploads = 0
        self.failed_uploads = 0
        self.batch_times = []
        
    def load_config(self):
        """Load Supabase configuration from .env file"""
        try:
            env_vars = {}
            with open('.env', 'r') as f:
                for line in f:
                    if '=' in line and not line.startswith('#'):
                        key, value = line.strip().split('=', 1)
                        env_vars[key] = value.strip('"\'')
            
            self.supabase_url = env_vars.get('SUPABASE_URL')
            self.supabase_key = env_vars.get('SUPABASE_ANON_KEY')
            
            if not self.supabase_url or not self.supabase_key:
                raise ValueError("Missing Supabase credentials in .env file")
                
            logger.info(f"[OK] Supabase config loaded: {self.supabase_url[:30]}...")
            
        except Exception as e:
            logger.error(f"[ERROR] Config load failed: {e}")
            raise
    
    def clean_text(self, text):
        """Clean text for Windows compatibility"""
        if pd.isna(text) or text is None:
            return ""
        
        text = str(text)
        # Remove problematic characters that caused issues before
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
            return 0.0
        
        try:
            price_str = str(price_val).strip()
            price_str = re.sub(r'[£$€¥₹,\s]', '', price_str)
            
            if not price_str:
                return 0.0
            
            price = float(price_str)
            
            if price < 0 or price > 100000:
                return 0.0
            
            return round(price, 2)
            
        except (ValueError, TypeError):
            return 0.0
    
    def transform_record(self, row, index):
        """Transform product record to eBay format"""
        try:
            # Generate unique eBay listing ID
            ebay_id = f"BL{str(index + 1001).zfill(6)}"  # Start from 1001 to avoid conflicts
            
            # Clean and validate data
            title = self.clean_text(row.get('item_title', ''))
            if not title:
                title = f"Motorcycle Part - {row.get('sku', 'Unknown')}"
            
            # Ensure title length limits
            if len(title) > 80:
                title = title[:77] + "..."
            
            description = self.clean_text(row.get('short_description', ''))
            if not description:
                description = f"Quality motorcycle part from {row.get('brand', 'BL Motorcycles')}"
            
            # Price handling
            trade_price = self.validate_price(row.get('trade'))
            srp_price = self.validate_price(row.get('srp'))
            
            # Use SRP if available, otherwise trade price with markup
            if srp_price > 0:
                price = srp_price
            elif trade_price > 0:
                price = round(trade_price * 1.3, 2)  # 30% markup
            else:
                price = 9.99  # Default price
            
            # Category mapping
            category_map = {
                'bags': 'Motorcycle Bags & Luggage',
                'top_boxes': 'Motorcycle Top Boxes',
                'tailbags': 'Motorcycle Tail Bags',
                'luggage_accessories': 'Motorcycle Luggage Accessories',
                'road': 'Motorcycle Parts',
                'offroad': 'Off-Road Motorcycle Parts',
                'cycle': 'Bicycle Parts'
            }
            
            category = category_map.get(row.get('family', ''), 'Motorcycle Parts')
            
            # Image handling
            images = []
            for i in range(1, 16):  # Check image1 to image15
                img_url = row.get(f'image{i}')
                if pd.notna(img_url) and str(img_url).startswith('http'):
                    images.append(str(img_url))
            
            # Ensure at least one image
            if not images:
                images = ['https://via.placeholder.com/400x300?text=No+Image']
            
            return {
                'ebay_listing_id': ebay_id,
                'title': title,
                'description': description,
                'price': price,
                'category': category,
                'brand': self.clean_text(row.get('brand', 'BL Motorcycles')),
                'sku': self.clean_text(row.get('sku', '')),
                'condition': 'New',
                'quantity': 1,
                'shipping_cost': 4.99,
                'images': images[:10],  # Limit to 10 images
                'listing_type': 'FixedPrice',
                'duration': 30,
                'created_at': datetime.now().isoformat(),
                'source_file': '01_All_Products_CSV.csv',
                'batch_id': f"STRESS_5K_{int(time.time())}"
            }
            
        except Exception as e:
            logger.error(f"[ERROR] Transform failed for row {index}: {e}")
            raise
    
    def upload_batch(self, batch_data, batch_num):
        """Upload a batch with comprehensive error handling"""
        batch_start = time.time()
        successful = 0
        failed = 0
        
        try:
            headers = {
                'apikey': self.supabase_key,
                'Authorization': f'Bearer {self.supabase_key}',
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            }
            
            url = f"{self.supabase_url}/rest/v1/ebay_listings"
            
            # Attempt batch upload
            response = requests.post(
                url,
                headers=headers,
                json=batch_data,
                timeout=30
            )
            
            if response.status_code in [200, 201]:
                successful = len(batch_data)
                batch_time = time.time() - batch_start
                self.batch_times.append(batch_time)
                self.successful_uploads += successful
                self.records_processed += len(batch_data)
                
                logger.info(f"[OK] Batch {batch_num}: {successful} records uploaded in {batch_time:.2f}s")
                
            else:
                # Batch failed, try individual uploads
                logger.warning(f"[WARNING] Batch {batch_num} failed ({response.status_code}), trying individual uploads...")
                
                for record in batch_data:
                    try:
                        individual_response = requests.post(
                            url,
                            headers=headers,
                            json=[record],
                            timeout=15
                        )
                        
                        if individual_response.status_code in [200, 201]:
                            successful += 1
                        else:
                            failed += 1
                            
                    except Exception:
                        failed += 1
                
                self.successful_uploads += successful
                self.failed_uploads += failed
                self.records_processed += len(batch_data)
                
                batch_time = time.time() - batch_start
                self.batch_times.append(batch_time)
                
                logger.info(f"[RETRY] Batch {batch_num}: {successful} success, {failed} failed in {batch_time:.2f}s")
        
        except Exception as e:
            failed = len(batch_data)
            self.records_processed += len(batch_data)
            self.failed_uploads += failed
            logger.error(f"[ERROR] Batch {batch_num} failed: {e}")
        
        return successful, failed
    
    def print_progress(self):
        """Print progress report"""
        elapsed = time.time() - self.start_time
        rate = self.records_processed / elapsed if elapsed > 0 else 0
        success_rate = (self.successful_uploads / self.records_processed * 100) if self.records_processed > 0 else 0
        
        print(f"\n{'='*60}")
        print(f"[START] STRESS TEST PROGRESS")
        print(f"{'='*60}")
        print(f"[STATS] Records Processed: {self.records_processed:,} / 5,000")
        print(f"[OK] Successful: {self.successful_uploads:,}")
        print(f"[ERROR] Failed: {self.failed_uploads:,}")
        print(f"[RATE] Success Rate: {success_rate:.1f}%")
        print(f"[SPEED] Speed: {rate:.1f} records/second")
        print(f"[TIME] Elapsed: {elapsed/60:.1f} minutes")
        print(f"{'='*60}\n")
    
    def run_stress_test(self):
        """Execute the 5,000 record stress test"""
        logger.info("[START] STARTING 5,000 RECORD STRESS TEST")
        logger.info("="*50)
        
        try:
            # Load the large dataset
            logger.info("[LOAD] Loading 01_All_Products_CSV.csv...")
            df = pd.read_csv('01_All_Products_CSV.csv', low_memory=False)
            logger.info(f"[OK] Loaded {len(df):,} total records")
            
            # Take first 5,000 records
            df_5k = df.head(5000).copy()
            logger.info(f"[TARGET] Selected first 5,000 records for stress test")
            
            # Transform all records
            logger.info("[RETRY] Transforming records to eBay format...")
            transformed_records = []
            
            for index, row in df_5k.iterrows():
                try:
                    record = self.transform_record(row, index)
                    transformed_records.append(record)
                except Exception as e:
                    logger.error(f"[ERROR] Failed to transform record {index}: {e}")
                    continue
            
            logger.info(f"[OK] Transformed {len(transformed_records):,} records successfully")
            
            # Batch configuration
            BATCH_SIZE = 10  # Proven batch size from previous success
            
            batches = [
                transformed_records[i:i + BATCH_SIZE] 
                for i in range(0, len(transformed_records), BATCH_SIZE)
            ]
            
            logger.info(f"📦 Created {len(batches)} batches of {BATCH_SIZE} records each")
            
            # Execute uploads with progress tracking
            for i, batch in enumerate(batches, 1):
                successful, failed = self.upload_batch(batch, i)
                
                # Print progress every 50 batches
                if i % 50 == 0:
                    self.print_progress()
                
                # Small delay to avoid overwhelming the server
                time.sleep(0.1)
            
            # Final report
            self.print_final_report()
            
        except Exception as e:
            logger.error(f"[ERROR] STRESS TEST FAILED: {e}")
            raise
    
    def print_final_report(self):
        """Print final performance report"""
        total_time = time.time() - self.start_time
        
        print(f"\n{'='*80}")
        print(f"[COMPLETE] 5,000 RECORD STRESS TEST COMPLETED")
        print(f"{'='*80}")
        print(f"[STATS] FINAL RESULTS:")
        print(f"   • Total Records: {self.records_processed:,}")
        print(f"   • Successful: {self.successful_uploads:,}")
        print(f"   • Failed: {self.failed_uploads:,}")
        print(f"   • Success Rate: {(self.successful_uploads/self.records_processed*100):.2f}%")
        print(f"")
        print(f"[SPEED] PERFORMANCE:")
        print(f"   • Total Time: {total_time/60:.2f} minutes")
        print(f"   • Average Speed: {self.records_processed/total_time:.2f} records/second")
        
        if self.batch_times:
            print(f"   • Average Batch Time: {np.mean(self.batch_times):.2f}s")
            print(f"   • Fastest Batch: {min(self.batch_times):.2f}s")
            print(f"   • Slowest Batch: {max(self.batch_times):.2f}s")
        
        print(f"")
        print(f"[TARGET] SCALABILITY ASSESSMENT:")
        success_rate = (self.successful_uploads/self.records_processed*100) if self.records_processed > 0 else 0
        if success_rate >= 99:
            print(f"   [OK] EXCELLENT: Ready for production at scale")
        elif success_rate >= 95:
            print(f"   [OK] GOOD: Minor optimizations recommended")
        else:
            print(f"   [WARNING] NEEDS WORK: Investigate failure causes")
        
        print(f"{'='*80}")

def main():
    """Main execution function"""
    print("BL MOTORCYCLES - 5,000 RECORD STRESS TEST")
    print("=" * 50)
    print("Testing system scalability with 5,000 motorcycle product records")
    print("Expected duration: 8-15 minutes")
    print("=" * 50)
    
    try:
        uploader = StressTest5000()
        uploader.run_stress_test()
        
    except KeyboardInterrupt:
        print("\n[WARNING] Test interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n[ERROR] Test failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()