import requests
import json

url = 'https://ddjuoeyaoxllockcusgf.supabase.co/rest/v1/'
key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkanVvZXlhb3hsbG9ja2N1c2dmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM4ODM3OSwiZXhwIjoyMDgwOTY0Mzc5fQ.tQTpdQCkE-V-aCfdt7GgN5FF-IdXQzGCAEuRE6gNupE'
headers = {
    'apikey': key,
    'Authorization': f'Bearer {key}'
}

ids = [
    '09-14315-61271',
    '02-14320-82428',
    '22-14290-61069',
    '08-14306-75895',
    '16-14296-75946',
    '22-14286-43751',
    '01-14317-05773',
    '25-14278-26019'
]

ids_str = ','.join([f'"{i}"' for i in ids])
r = requests.get(f'{url}orders?channel_order_id=in.({ids_str})&select=channel_order_id,customer_name,status,error_message', headers=headers)

if r.status_code == 200:
    for order in r.json():
        print(f"ID: {order['channel_order_id']}")
        print(f"Customer: {order['customer_name']}")
        print(f"Status: {order['status']}")
        print(f"Error: {order['error_message']}")
        print("-" * 20)
else:
    print(f"Error: {r.status_code}")
    print(r.text)
