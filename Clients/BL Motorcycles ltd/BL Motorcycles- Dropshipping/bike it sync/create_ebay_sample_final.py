import pandas as pd

# Load source data with correct column mapping
df = pd.read_csv('01_All_Products_CSV.csv', low_memory=False).head(500)

# Map source columns to eBay format
ebay_data = df[[
    'sku',          # Will become ItemNumber
    'item_title',   # Will become Title  
    'trade',        # Will become CurrentPrice
    'type'         # Will become Format
]].copy()

# Add required eBay fields with defaults
ebay_data['ItemNumber'] = 'BIKEIT-' + ebay_data['sku']
ebay_data['Title'] = ebay_data['item_title'].str[:80] + ' - Bike Part'
ebay_data['CustomLabel'] = ebay_data['sku']
ebay_data['AvailableQuantity'] = 1  # Default stock
ebay_data['Format'] = 'FixedPrice'  # Default format
ebay_data['Currency'] = 'GBP'       # Default currency
ebay_data['CurrentPrice'] = ebay_data['trade']
ebay_data['Condition'] = 'New'      # Default condition

# Select final eBay columns
final_cols = [
    'ItemNumber', 'Title', 'CustomLabel', 'AvailableQuantity',
    'Format', 'Currency', 'CurrentPrice', 'Condition'
]
ebay_data = ebay_data[final_cols]

# Save to CSV
ebay_data.to_csv('ebay_sample_500_final.csv', index=False)
print(f"Created ebay_sample_500_final.csv with {len(ebay_data)} items")
print("Sample columns:", ebay_data.columns.tolist())