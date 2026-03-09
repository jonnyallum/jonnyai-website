import pandas as pd
import os
from datetime import datetime

def clean_title(title):
    """Clean product titles for eBay listings with NaN handling"""
    if pd.isna(title):
        return "Bike Part"
    return str(title).replace('"', '').strip()

def generate_ebay_id(sku):
    """Generate eBay item number from SKU"""
    return f"BIKEIT-{sku}-{datetime.now().strftime('%Y%m')}"

def transform_to_ebay(input_path, output_dir="ebay_ready"):
    """
    Transform Bike It product CSV to eBay listing format
    Processes in chunks of 500 items to avoid memory issues
    """
    os.makedirs(output_dir, exist_ok=True)
    
    # Process in chunks
    chunk_size = 500
    chunk_num = 1
    
    for chunk in pd.read_csv(input_path, chunksize=chunk_size):
        # Apply transformations
        transformed = chunk.assign(
            ItemNumber=lambda x: x['sku'].apply(generate_ebay_id),
            Title=lambda x: x['item_title'].apply(clean_title),
            CustomLabel=lambda x: x['sku'],
            AvailableQuantity=1,  # Default for eBay
            Format="FIXED_PRICE",
            Currency="GBP",
            CurrentPrice=lambda x: x['trade'].fillna(0),  # Handle missing prices
            Condition="New"  # Default assumption
        )
        
        # Select and reorder eBay-required columns
        ebay_cols = [
            'ItemNumber', 'Title', 'CustomLabel', 'AvailableQuantity',
            'Format', 'Currency', 'CurrentPrice', 'Condition'
        ]
        
        # Save chunk
        output_path = os.path.join(output_dir, f"ebay_listings_chunk_{chunk_num}.csv")
        transformed[ebay_cols].to_csv(output_path, index=False)
        print(f"Saved chunk {chunk_num} to {output_path}")
        chunk_num += 1

if __name__ == "__main__":
    input_file = "01_All_Products_CSV.csv"
    transform_to_ebay(input_file)