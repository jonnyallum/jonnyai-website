import pandas as pd

# Read original file with explicit column mapping
df = pd.read_csv('01_All_Products_CSV.csv', low_memory=False).head(500)

# Map your source columns to eBay format
ebay_data = df.rename(columns={
    'sku': 'ItemNumber',
    'item_title': 'Title',
    'sku': 'CustomLabel',  # Using SKU as custom label
    'stock_quantity': 'AvailableQuantity',
    'price_type': 'Format',
    'currency': 'Currency',
    'trade': 'CurrentPrice',
    'condition': 'Condition'
})[['ItemNumber', 'Title', 'CustomLabel', 'AvailableQuantity', 
    'Format', 'Currency', 'CurrentPrice', 'Condition']]

# Save to new CSV
ebay_data.to_csv('ebay_sample_500.csv', index=False)
print("Created ebay_sample_500.csv with 500 items")
print("Columns used:", list(ebay_data.columns))