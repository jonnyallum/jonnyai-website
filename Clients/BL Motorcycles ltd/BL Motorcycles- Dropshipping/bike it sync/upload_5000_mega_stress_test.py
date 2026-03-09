#!/usr/bin/env python3
"""
🚀 BL MOTORCYCLES - MEGA STRESS TEST: 5,000 RECORDS
==================================================
Ultimate scalability test with advanced monitoring and analytics
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
from typing import Dict, List, Any, Tuple
import re
import unicodedata
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading
from dataclasses import dataclass
from collections import defaultdict

# Configure logging with enhanced formatting
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)s | %(message)s',
    handlers=[
        logging.FileHandler('mega_stress_test_5000.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class PerformanceMetrics:
    """Real-time performance tracking"""
    start_time: float
    records_processed: int = 0
    successful_uploads: int = 0
    failed_uploads: int = 0
    batch_times: List[float] = None
    error_log: List[str] = None
    
    def __post_init__(self):
        if self.batch_times is None:
            self.batch_times = []
        if self.error_log is None:
            self.error_log = []
    
    @property
    def success_rate(self) -> float:
        if self.records_processed == 0:
            return 0.0
        return (self.successful_uploads / self.records_processed) * 100
    
    @property
    def records_per_second(self) -> float:
        elapsed = time.time() - self.start_time
        if elapsed == 0:
            return 0.0
        return self.records_processed / elapsed
    
    @property
    def estimated_completion(self) -> str:
        if self.records_per_second == 0:
            return "Unknown"
        remaining = 5000 - self.records_processed
        eta_seconds = remaining / self.records_per_second
        return f"{eta_seconds/60:.1f} minutes"

class MegaStressTestUploader:
    """Advanced uploader with enterprise-grade monitoring"""
    
    def __init__(self):
        self.load_config()
        self.metrics = PerformanceMetrics(start_time=time.time())
        self.lock = threading.Lock()
        
    def load_config(self):
        """Load Supabase configuration"""
        try:
            with open('.env', 'r') as f:
                env_vars = {}
                for line in f:
                    if '=' in line and not line.startswith('#'):
                        key, value = line.strip().split('=', 1)
                        env_vars[key] = value.strip('"\'')
            
            self.supabase_url = env_vars.get('SUPABASE_URL')
            self.supabase_key = env_vars.get('SUPABASE_ANON_KEY')
            
            if not self.supabase_url or not self.supabase_key:
                raise ValueError("Missing Supabase credentials")
                
            logger.info(f"✅ Supabase config loaded: {self.supabase_url[:30]}...")
            
        except Exception as e:
            logger.error(f"❌ Config load failed: {e}")
            raise
    
    def clean_unicode_text(self, text: str) -> str:
        """Advanced Unicode cleaning for Windows compatibility"""
        if pd.isna(text) or text is None:
            return ""
        
        text = str(text)
        
        # Remove problematic Unicode characters
        text = re.sub(r'[^\x00-\x7F]+', '', text)  # Remove non-ASCII
        text = unicodedata.normalize('NFKD', text)  # Normalize
        text = text.encode('ascii', 'ignore').decode('ascii')  # Force ASCII
        
        # Clean HTML and special chars
        text = re.sub(r'<[^>]+>', '', text)  # Remove HTML tags
        text = re.sub(r'[""''„"‚']', '"', text)  # Normalize quotes
        text = re.sub(r'[–—]', '-', text)  # Normalize dashes
        text = re.sub(r'\s+', ' ', text)  # Normalize whitespace
        
        return text.strip()
    
    def validate_and_clean_price(self, price_val) -> float:
        """Advanced price validation and cleaning"""
        if pd.isna(price_val) or price_val is None:
            return 0.0
        
        try:
            # Convert to string and clean
            price_str = str(price_val).strip()
            
            # Remove currency symbols and spaces
            price_str = re.sub(r'[£$€¥₹,\s]', '', price_str)
            
            # Handle empty strings
            if not price_str:
                return 0.0
            
            # Convert to float
            price = float(price_str)
            
            # Validate range (0 to 100,000)
            if price < 0 or price > 100000:
                logger.warning(f"Price out of range: {price}, setting to 0")
                return 0.0
            
            return round(price, 2)
            
        except (ValueError, TypeError) as e:
            logger.warning(f"Price conversion failed for '{price_val}': {e}")
            return 0.0
    
    def transform_record_to_ebay_format(self, row: pd.Series, index: int) -> Dict[str, Any]:
        """Transform product record to eBay-compatible format"""
        try:
            # Generate unique eBay listing ID
            ebay_id = f"BL{str(index + 1).zfill(6)}"
            
            # Clean and validate data
            title = self.clean_unicode_text(row.get('item_title', ''))
            if not title:
                title = f"Motorcycle Part - {row.get('sku', 'Unknown')}"
            
            # Ensure title length limits
            if len(title) > 80:
                title = title[:77] + "..."
            
            description = self.clean_unicode_text(row.get('short_description', ''))
            if not description:
                description = f"Quality motorcycle part from {row.get('brand', 'BL Motorcycles')}"
            
            # Price handling
            trade_price = self.validate_and_clean_price(row.get('trade'))
            srp_price = self.validate_and_clean_price(row.get('srp'))
            
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
                'brand': self.clean_unicode_text(row.get('brand', 'BL Motorcycles')),
                'sku': self.clean_unicode_text(row.get('sku', '')),
                'condition': 'New',
                'quantity': 1,
                'shipping_cost': 4.99,
                'images': images[:10],  # Limit to 10 images
                'listing_type': 'FixedPrice',
                'duration': 30,
                'created_at': datetime.now().isoformat(),
                'source_file': '01_All_Products_CSV.csv',
                'batch_id': f"MEGA_5K_{int(time.time())}"
            }
            
        except Exception as e:
            logger.error(f"❌ Transform failed for row {index}: {e}")
            raise
    
    def upload_batch(self, batch_data: List[Dict], batch_num: int) -> Tuple[int, int, List[str]]:
        """Upload a batch with comprehensive error handling"""
        batch_start = time.time()
        successful = 0
        failed = 0
        errors = []
        
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
                
                with self.lock:
                    self.metrics.batch_times.append(batch_time)
                    self.metrics.successful_uploads += successful
                    self.metrics.records_processed += len(batch_data)
                
                logger.info(f"✅ Batch {batch_num}: {successful} records uploaded in {batch_time:.2f}s")
                
            else:
                # Batch failed, try individual uploads
                logger.warning(f"⚠️ Batch {batch_num} failed ({response.status_code}), trying individual uploads...")
                
                for i, record in enumerate(batch_data):
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
                            error_msg = f"Individual upload failed: {individual_response.status_code}"
                            errors.append(error_msg)
                            
                    except Exception as e:
                        failed += 1
                        error_msg = f"Individual upload exception: {str(e)}"
                        errors.append(error_msg)
                
                with self.lock:
                    self.metrics.successful_uploads += successful
                    self.metrics.records_processed += len(batch_data)
                    self.metrics.failed_uploads += failed
                    self.metrics.error_log.extend(errors)
                
                batch_time = time.time() - batch_start
                self.metrics.batch_times.append(batch_time)
                
                logger.info(f"🔄 Batch {batch_num}: {successful} success, {failed} failed in {batch_time:.2f}s")
        
        except Exception as e:
            failed = len(batch_data)
            error_msg = f"Batch {batch_num} exception: {str(e)}"
            errors.append(error_msg)
            
            with self.lock:
                self.metrics.records_processed += len(batch_data)
                self.metrics.failed_uploads += failed
                self.metrics.error_log.append(error_msg)
            
            logger.error(f"❌ Batch {batch_num} failed: {e}")
        
        return successful, failed, errors
    
    def print_progress_report(self):
        """Print comprehensive progress report"""
        print(f"\n{'='*80}")
        print(f"🚀 MEGA STRESS TEST - LIVE PERFORMANCE DASHBOARD")
        print(f"{'='*80}")
        print(f"📊 Records Processed: {self.metrics.records_processed:,} / 5,000")
        print(f"✅ Successful Uploads: {self.metrics.successful_uploads:,}")
        print(f"❌ Failed Uploads: {self.metrics.failed_uploads:,}")
        print(f"📈 Success Rate: {self.metrics.success_rate:.1f}%")
        print(f"⚡ Speed: {self.metrics.records_per_second:.1f} records/second")
        print(f"⏱️ ETA: {self.metrics.estimated_completion}")
        
        if self.metrics.batch_times:
            avg_batch_time = np.mean(self.metrics.batch_times)
            print(f"⏰ Avg Batch Time: {avg_batch_time:.2f}s")
        
        elapsed = time.time() - self.metrics.start_time
        print(f"🕐 Elapsed Time: {elapsed/60:.1f} minutes")
        print(f"{'='*80}\n")
    
    def run_mega_stress_test(self):
        """Execute the 5,000 record mega stress test"""
        logger.info("🚀 STARTING MEGA STRESS TEST: 5,000 RECORDS")
        logger.info("="*60)
        
        try:
            # Load the large dataset
            logger.info("📂 Loading 01_All_Products_CSV.csv...")
            df = pd.read_csv('01_All_Products_CSV.csv', low_memory=False)
            logger.info(f"✅ Loaded {len(df):,} total records")
            
            # Take first 5,000 records
            df_5k = df.head(5000).copy()
            logger.info(f"🎯 Selected first 5,000 records for stress test")
            
            # Transform all records
            logger.info("🔄 Transforming records to eBay format...")
            transformed_records = []
            
            for index, row in df_5k.iterrows():
                try:
                    record = self.transform_record_to_ebay_format(row, index)
                    transformed_records.append(record)
                except Exception as e:
                    logger.error(f"❌ Failed to transform record {index}: {e}")
                    continue
            
            logger.info(f"✅ Transformed {len(transformed_records):,} records successfully")
            
            # Batch configuration for optimal performance
            BATCH_SIZE = 20  # Larger batches for better throughput
            MAX_WORKERS = 5   # Parallel processing
            
            batches = [
                transformed_records[i:i + BATCH_SIZE] 
                for i in range(0, len(transformed_records), BATCH_SIZE)
            ]
            
            logger.info(f"📦 Created {len(batches)} batches of {BATCH_SIZE} records each")
            logger.info(f"🔧 Using {MAX_WORKERS} parallel workers")
            
            # Execute parallel uploads with progress tracking
            with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
                future_to_batch = {
                    executor.submit(self.upload_batch, batch, i + 1): i + 1
                    for i, batch in enumerate(batches)
                }
                
                completed_batches = 0
                
                for future in as_completed(future_to_batch):
                    batch_num = future_to_batch[future]
                    completed_batches += 1
                    
                    try:
                        successful, failed, errors = future.result()
                        
                        # Print progress every 10 batches
                        if completed_batches % 10 == 0:
                            self.print_progress_report()
                            
                    except Exception as e:
                        logger.error(f"❌ Batch {batch_num} execution failed: {e}")
            
            # Final comprehensive report
            self.print_final_report()
            
        except Exception as e:
            logger.error(f"❌ MEGA STRESS TEST FAILED: {e}")
            raise
    
    def print_final_report(self):
        """Print comprehensive final performance report"""
        total_time = time.time() - self.metrics.start_time
        
        print(f"\n{'='*100}")
        print(f"🏁 MEGA STRESS TEST COMPLETED - FINAL PERFORMANCE REPORT")
        print(f"{'='*100}")
        print(f"📊 SUMMARY STATISTICS:")
        print(f"   • Total Records Processed: {self.metrics.records_processed:,}")
        print(f"   • Successful Uploads: {self.metrics.successful_uploads:,}")
        print(f"   • Failed Uploads: {self.metrics.failed_uploads:,}")
        print(f"   • Success Rate: {self.metrics.success_rate:.2f}%")
        print(f"")
        print(f"⚡ PERFORMANCE METRICS:")
        print(f"   • Total Time: {total_time/60:.2f} minutes")
        print(f"   • Average Speed: {self.metrics.records_per_second:.2f} records/second")
        print(f"   • Peak Throughput: {max(self.metrics.batch_times) if self.metrics.batch_times else 0:.2f}s per batch")
        print(f"   • Database Growth: +{self.metrics.successful_uploads:,} records")
        
        if self.metrics.batch_times:
            print(f"")
            print(f"📈 BATCH PERFORMANCE:")
            print(f"   • Total Batches: {len(self.metrics.batch_times)}")
            print(f"   • Average Batch Time: {np.mean(self.metrics.batch_times):.2f}s")
            print(f"   • Fastest Batch: {min(self.metrics.batch_times):.2f}s")
            print(f"   • Slowest Batch: {max(self.metrics.batch_times):.2f}s")
        
        if self.metrics.error_log:
            print(f"")
            print(f"⚠️ ERROR ANALYSIS:")
            print(f"   • Total Errors: {len(self.metrics.error_log)}")
            print(f"   • Error Rate: {(len(self.metrics.error_log)/self.metrics.records_processed)*100:.2f}%")
        
        print(f"")
        print(f"🎯 SCALABILITY ASSESSMENT:")
        if self.metrics.success_rate >= 99:
            print(f"   ✅ EXCELLENT: System handles 5K records with {self.metrics.success_rate:.1f}% success")
            print(f"   🚀 READY FOR: 10K+ record production deployments")
        elif self.metrics.success_rate >= 95:
            print(f"   ✅ GOOD: System stable with {self.metrics.success_rate:.1f}% success rate")
            print(f"   🔧 OPTIMIZE: Minor improvements needed for production")
        else:
            print(f"   ⚠️ NEEDS WORK: {self.metrics.success_rate:.1f}% success rate requires investigation")
        
        print(f"")
        print(f"💾 LOG FILES:")
        print(f"   • Detailed logs: mega_stress_test_5000.log")
        print(f"   • Performance data: Available for analysis")
        print(f"{'='*100}")
        
        # Save performance metrics to file
        metrics_data = {
            'test_date': datetime.now().isoformat(),
            'total_records': self.metrics.records_processed,
            'successful_uploads': self.metrics.successful_uploads,
            'failed_uploads': self.metrics.failed_uploads,
            'success_rate': self.metrics.success_rate,
            'total_time_minutes': total_time / 60,
            'records_per_second': self.metrics.records_per_second,
            'batch_times': self.metrics.batch_times,
            'error_count': len(self.metrics.error_log)
        }
        
        with open('mega_stress_test_metrics.json', 'w') as f:
            json.dump(metrics_data, f, indent=2)
        
        logger.info("📊 Performance metrics saved to mega_stress_test_metrics.json")

def main():
    """Main execution function"""
    print("🚀 BL MOTORCYCLES - MEGA STRESS TEST: 5,000 RECORDS")
    print("=" * 60)
    print("This will upload 5,000 motorcycle product records to test system scalability")
    print("Expected duration: 5-10 minutes depending on system performance")
    print("=" * 60)
    
    try:
        uploader = MegaStressTestUploader()
        uploader.run_mega_stress_test()
        
    except KeyboardInterrupt:
        print("\n⚠️ Test interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()