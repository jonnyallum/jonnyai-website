import pandas as pd

# Read original file and extract first 500 items
df = pd.read_csv('01_All_Products_CSV.csv').head(500)

# Select and rename columns to match eBay format
ebay_data = df[[
    'ItemNumber', 'Title', 'CustomLabel', 
    'AvailableQuantity', 'Format', 'Currency',
    'CurrentPrice', 'Condition'
]].rename(columns={
    'ItemNumber': 'ItemNumber',
    'Title': 'Title',
    'CustomLabel': 'CustomLabel',
    'AvailableQuantity': 'AvailableQuantity',
    'Format': 'Format',
    'Currency': 'Currency',
    'CurrentPrice': 'CurrentPrice',
    'Condition': 'Condition'
})

# Save to new CSV
ebay_data.to_csv('ebay_sample_500.csv', index=False)
print("Created ebay_sample_500.csv with 500 items")