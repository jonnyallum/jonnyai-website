import pandas as pd

def prepare_next_batch():
    # Read original CSV and skip first 500 rows
    df = pd.read_csv('01_All_Products_CSV.csv', low_memory=False).iloc[500:1000]
    
    # Same transformation as first batch
    # Handle missing titles
    titles = df['item_title'].fillna('Bike Part')
    
    ebay_data = pd.DataFrame({
        'ItemNumber': 'BIKEIT-' + df['sku'],
        'Title': titles.str[:80] + ' - Bike Part',
        'CustomLabel': df['sku'],
        'AvailableQuantity': 1,
        'Format': 'FixedPrice',
        'Currency': 'GBP',
        'CurrentPrice': df['trade'],
        'Condition': 'New'
    })
    
    # Save to new CSV
    ebay_data.to_csv('ebay_sample_501_1000.csv', index=False)
    print("Created ebay_sample_501_1000.csv with 500 items (501-1000)")

if __name__ == "__main__":
    prepare_next_batch()