#!/usr/bin/env python3
"""
BL MOTORCYCLES - Upload Without batch_id
========================================
Quick fix: Remove batch_id from upload payload
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
        logging.FileHandler('upload_fixed.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

class QuickFixUploader:
    """Upload without problematic batch_id field"""
    
    def __init__(self):
        self.load_config()
        self.start_time = time.time()
        self.records_processed = 0
        self.successful_uploads = 0
        self.failed_uploads = 0
        
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
            self.supabase_key = env_vars.get('SUPABASE_SERVICE_KEY')  # Use service key
            
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
        # Remove problematic characters
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
        """Transform product record to eBay format WITHOUT batch_id"""
        try:
            # Generate unique eBay listing ID starting from 5501
            ebay_id = f"BL{str(index + 5501).zfill(6)}"
            
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
            
            # FIXED: Remove batch_id field that's causing 400 errors
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
                'source_file': '01_All_Products_CSV.csv'
                # REMOVED: 'batch_id': f"FINAL_4786_{int(time.time())}"
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
                self.successful_uploads += successful
                self.records_processed += len(batch_data)
                
                logger.info(f"[OK] Batch {batch_num}: {successful} records uploaded in {batch_time:.2f}s")
                
            else:
                # Batch failed, try individual uploads
                logger.warning(f"[WARNING] Batch {batch_num} failed ({response.status_code}), trying individual uploads...")
                logger.warning(f"Error: {response.text}")
                
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
                            logger.error(f"Individual upload failed: {individual_response.text}")
                            
                    except Exception as e:
                        failed += 1
                        logger.error(f"Individual upload error: {e}")
                
                self.successful_uploads += successful
                self.failed_uploads += failed
                self.records_processed += len(batch_data)
                
                batch_time = time.time() - batch_start
                
                logger.info(f"[RETRY] Batch {batch_num}: {successful} success, {failed} failed in {batch_time:.2f}s")
        
        except Exception as e:
            failed = len(batch_data)
            self.records_processed += len(batch_data)
            self.failed_uploads += failed
            logger.error(f"[ERROR] Batch {batch_num} failed: {e}")
        
        return successful, failed
    
    def run_upload(self):
        """Execute the upload with fixed schema"""
        logger.info("[START] QUICK FIX UPLOAD - NO BATCH_ID")
        logger.info("="*50)
        
        try:
            # Load the dataset
            logger.info("[LOAD] Loading 01_All_Products_CSV.csv...")
            df = pd.read_csv('01_All_Products_CSV.csv', low_memory=False)
            logger.info(f"[OK] Loaded {len(df):,} total records")
            
            # Take records 5501-5510 for testing (first 10 records)
            df_test = df.iloc[5500:5510].copy()
            logger.info(f"[TEST] Selected {len(df_test):,} records for testing")
            
            # Transform all records
            logger.info("[TRANSFORM] Converting records to eBay format...")
            transformed_records = []
            
            for index, row in df_test.iterrows():
                try:
                    # Use original index for unique ID generation
                    record = self.transform_record(row, index - 5500)
                    transformed_records.append(record)
                except Exception as e:
                    logger.error(f"[ERROR] Failed to transform record {index}: {e}")
                    continue
            
            logger.info(f"[OK] Transformed {len(transformed_records):,} records successfully")
            
            # Upload in single batch for testing
            successful, failed = self.upload_batch(transformed_records, 1)
            
            # Final report
            total_time = time.time() - self.start_time
            
            print(f"\n{'='*60}")
            print(f"[COMPLETE] QUICK FIX TEST COMPLETED")
            print(f"{'='*60}")
            print(f"[RESULTS] TEST STATISTICS:")
            print(f"   • Total Records: {self.records_processed:,}")
            print(f"   • Successful: {self.successful_uploads:,}")
            print(f"   • Failed: {self.failed_uploads:,}")
            print(f"   • Success Rate: {(self.successful_uploads/self.records_processed*100):.2f}%")
            print(f"   • Total Time: {total_time:.2f} seconds")
            print(f"{'='*60}")
            
            if self.successful_uploads > 0:
                print("[SUCCESS] Schema fix working! Ready for full upload.")
            else:
                print("[ERROR] Schema fix failed. Need different approach.")
            
        except Exception as e:
            logger.error(f"[ERROR] UPLOAD FAILED: {e}")
            raise

def main():
    """Main execution function"""
    print("BL MOTORCYCLES - QUICK FIX TEST")
    print("=" * 40)
    print("Testing upload without batch_id field")
    print("=" * 40)
    
    try:
        uploader = QuickFixUploader()
        uploader.run_upload()
        
    except KeyboardInterrupt:
        print("\n[WARNING] Upload interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n[ERROR] Upload failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()