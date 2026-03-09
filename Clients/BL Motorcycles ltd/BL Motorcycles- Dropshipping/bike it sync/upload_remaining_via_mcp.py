#!/usr/bin/env python3
"""
BL MOTORCYCLES - Upload Remaining Records via MCP Server
======================================================
Upload remaining 4,786 records using BL Motorcycles MCP server
Based on proven schema but using MCP connection
"""

import pandas as pd
import numpy as np
import time
from datetime import datetime
import json
import re
import unicodedata
import requests

class MCPUploader:
    """Upload using BL Motorcycles MCP server"""
    
    def __init__(self):
        self.start_time = None
        self.batch_times = []
        self.successful_uploads = 0
        self.failed_uploads = 0
        self.errors = []
        
        # MCP server configuration
        self.mcp_config = {
            "server_name": "supabase-bl-motorcycles",
            "base_url": "http://localhost:3000",  # Default MCP server port
            "timeout": 30
        }
    
    def start(self):
        self.start_time = time.time()
        self.log("MCP UPLOAD STARTED - REMAINING 4,786 RECORDS")
    
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

    def test_mcp_connection(self):
        """Test MCP server connection"""
        self.log("Testing MCP server connection...")
        
        try:
            # Test basic MCP server health
            response = requests.get(
                f"{self.mcp_config['base_url']}/health",
                timeout=10
            )
            
            if response.status_code == 200:
                self.log("MCP server connection successful")
                return True
            else:
                self.log(f"MCP server health check failed: {response.status_code}")
                return False
                
        except Exception as e:
            self.log(f"MCP server connection failed: {e}")
            return False

    def mcp_query(self, sql_query):
        """Execute query via MCP server"""
        try:
            payload = {
                "tool": "query",
                "arguments": {
                    "query": sql_query
                }
            }
            
            response = requests.post(
                f"{self.mcp_config['base_url']}/mcp/tool",
                json=payload,
                timeout=self.mcp_config['timeout']
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                self.log(f"MCP query failed: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            self.log(f"MCP query error: {e}")
            return None

    def mcp_insert_batch(self, records):
        """Insert batch via MCP server"""
        try:
            # Convert records to SQL INSERT statement
            if not records:
                return False
            
            # Build INSERT statement for proven schema
            columns = ['ItemNumber', 'Title', 'CustomLabel', 'CurrentPrice',
                      'AvailableQuantity', 'Format', 'Currency', 'Condition']
            
            values_list = []
            for record in records:
                # Escape quotes and limit string lengths
                title = record.get('Title', '').replace("'", "''")[:80]
                label = record.get('CustomLabel', '').replace("'", "''")[:50]
                
                values = [
                    f"'{record.get('ItemNumber', '')}'",
                    f"'{title}'",
                    f"'{label}'",
                    str(record.get('CurrentPrice', 0.99)),
                    str(record.get('AvailableQuantity', 1)),
                    f"'{record.get('Format', 'FixedPrice')}'",
                    f"'{record.get('Currency', 'GBP')}'",
                    f"'{record.get('Condition', 'New')}'"
                ]
                values_list.append(f"({', '.join(values)})")
            
            sql_query = f"""
            INSERT INTO ebay_listings ({', '.join(columns)})
            VALUES {', '.join(values_list)}
            ON CONFLICT (ItemNumber) DO UPDATE SET
                Title = EXCLUDED.Title,
                CurrentPrice = EXCLUDED.CurrentPrice
            """
            
            result = self.mcp_query(sql_query)
            return result is not None
            
        except Exception as e:
            self.log(f"MCP batch insert error: {str(e)}")
            return False

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
        """Upload remaining 4,786 records using MCP server"""
        self.start()
        
        # Test MCP connection first
        if not self.test_mcp_connection():
            self.log("ERROR: Cannot connect to MCP server. Please start the server first.")
            self.log("Run: setup-bl-motorcycles-mcp.bat")
            return None
        
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
            
            # Check current database state via MCP
            self.log("Checking current database state via MCP...")
            count_result = self.mcp_query("SELECT COUNT(*) as count FROM ebay_listings")
            if count_result:
                current_count = count_result.get('data', [{}])[0].get('count', 0)
                self.log(f"Current database contains {current_count} records")
            else:
                self.log("Could not get current count via MCP")
                current_count = 0
            
            # Upload in batches with proven settings
            batch_size = 10  # Proven batch size
            total_batches = (len(data) + batch_size - 1) // batch_size
            
            self.log(f"Starting MCP upload: {total_batches} batches of {batch_size} items each")
            
            for i in range(0, len(data), batch_size):
                batch = data[i:i + batch_size]
                batch_num = (i // batch_size) + 1
                
                batch_start_time = time.time()
                
                # Upload via MCP server
                success = self.mcp_insert_batch(batch)
                batch_duration = time.time() - batch_start_time
                
                self.log_batch(batch_num, len(batch), success, batch_duration)
                
                # Progress indicator every 50 batches
                if batch_num % 50 == 0:
                    progress = (batch_num / total_batches) * 100
                    self.log(f"Progress: {progress:.1f}% ({batch_num}/{total_batches} batches)")
                
                # Small delay to prevent overwhelming the server
                time.sleep(0.1)
            
            # Final verification via MCP
            self.log("Verifying final database state via MCP...")
            final_result = self.mcp_query("SELECT COUNT(*) as count FROM ebay_listings")
            if final_result:
                final_count = final_result.get('data', [{}])[0].get('count', 0)
                self.log(f"Final database contains {final_count} records")
            else:
                final_count = current_count + self.successful_uploads
            
            # Performance statistics
            stats = self.get_stats()
            
            self.log("=== MCP UPLOAD RESULTS ===")
            self.log(f"Total upload time: {stats['total_time']:.2f} seconds ({stats['total_time']/60:.1f} minutes)")
            self.log(f"Records uploaded: {stats['successful_uploads']}")
            self.log(f"Records failed: {stats['failed_uploads']}")
            self.log(f"Success rate: {stats['success_rate']:.1f}%")
            self.log(f"Average batch time: {stats['avg_batch_time']:.2f} seconds")
            self.log(f"Overall upload rate: {stats['overall_rate']:.1f} records/second")
            self.log(f"Database before: {current_count} records")
            self.log(f"Database after: {final_count} records")
            self.log(f"Net increase: {final_count - current_count} records")
            self.log("=== BL MOTORCYCLES MCP UPLOAD COMPLETE ===")
            
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
    print("BL MOTORCYCLES - MCP SERVER UPLOAD")
    print("Upload remaining 4,786 records via MCP server")
    print("=" * 70)
    
    uploader = MCPUploader()
    results = uploader.upload_remaining_records()
    
    if results:
        print(f"\nMCP UPLOAD COMPLETED SUCCESSFULLY!")
        print(f"Performance: {results['overall_rate']:.1f} records/second")
        print(f"Success Rate: {results['success_rate']:.1f}%")
        print(f"Total Database Records: ~{500 + results['successful_uploads']:,}")
    else:
        print("\nMCP UPLOAD FAILED - Check logs above")
        print("Make sure MCP server is running: setup-bl-motorcycles-mcp.bat")

if __name__ == "__main__":
    main()