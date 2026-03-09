import requests
import json
import time

BASE_URL = "http://api.llexeter.co.uk"

def get_list():
    """Fetch all part codes from the Llexeter catalogue."""
    url = f"{BASE_URL}/list"
    print(f"Fetching part list from {url}...")
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error fetching list: {response.status_code}")
        return []

def get_code_details(code):
    """Fetch details for a single part code."""
    url = f"{BASE_URL}/code/{code}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error fetching code {code}: {response.status_code}")
        return None

def get_stocklist():
    """Fetch the full stock level list."""
    url = f"{BASE_URL}/stocklist"
    print(f"Fetching stock list from {url}...")
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error fetching stockist: {response.status_code}")
        return {}

def test_api():
    # 1. Fetch the list
    part_codes = get_list()
    print(f"Response type: {type(part_codes)}")
    print(f"Raw Response snippet: {str(part_codes)[:200]}...")
    
    if isinstance(part_codes, dict):
        # Maybe it's a dict with a key?
        print(f"Keys: {part_codes.keys()}")
        # Check if it has a 'list' or 'data' key
        if 'list' in part_codes:
            part_codes = part_codes['list']
        elif 'data' in part_codes:
            part_codes = part_codes['data']
        else:
            # Maybe the dict IS the list of codes as keys?
            part_codes = list(part_codes.keys())

    if part_codes and len(part_codes) > 0:
        # 2. Extract first code and fetch details
        test_code = part_codes[0]
        print(f"Testing fetch for part: {test_code}")
        details = get_code_details(test_code)
        print(json.dumps(details, indent=2))
        
    # 3. Fetch stock levels
    stocklist = get_stocklist()
    print(f"Stock list type: {type(stocklist)}")
    print(f"Stock list snippet: {str(stocklist)[:200]}...")

if __name__ == "__main__":
    test_api()
