### STEP 1: `.env` file (place in project root)

SUPABASE_URL=https://kenaardqwnpeqtwukdnb.supabase.co
SUPABASE_KEY=YOUR_SERVICE_OR_ANON_KEY
SUPABASE_TABLE=bike_parts


### STEP 2: `orchestrator.py`

import os
import pandas as pd
from scripts.parse_bikeit import parse_file, load_schema_map

RAW_DIR = 'raw'
PARSED_DIR = 'parsed'
SCHEMA_PATH = 'config/schema_map.json'
LOG_PATH = 'logs/process_log.txt'

def log(message):
    with open(LOG_PATH, 'a') as log_file:
        log_file.write(message + '\n')
    print(message)

def main():
    schema_map = load_schema_map(SCHEMA_PATH)
    for filename in os.listdir(RAW_DIR):
        raw_path = os.path.join(RAW_DIR, filename)
        log(f"Processing: {filename}")
        df, error = parse_file(raw_path, schema_map)
        if error:
            log(f"ERROR: {error}")
            continue
        output_path = os.path.join(PARSED_DIR, f"parsed_{filename}.csv")
        os.makedirs(PARSED_DIR, exist_ok=True)
        df.to_csv(output_path, index=False)
        log(f"Saved: {output_path}")

if __name__ == "__main__":
    main()


### STEP 3: `scripts/parse_bikeit.py`

import pandas as pd
import json

def load_schema_map(schema_path):
    with open(schema_path, 'r') as f:
        return json.load(f)

def unify_columns(df, schema_map):
    col_map = {}
    for standard, variants in schema_map.items():
        for col in df.columns:
            if col.strip() in variants:
                col_map[col] = standard
    return df.rename(columns=col_map)

def clean_dataframe(df):
    df = df.applymap(lambda x: x.strip() if isinstance(x, str) else x)
    return df

def parse_file(file_path, schema_map):
    try:
        if file_path.endswith('.csv'):
            df = pd.read_csv(file_path)
        elif file_path.endswith('.xlsx'):
            df = pd.read_excel(file_path)
        else:
            return None, f"Unsupported file format: {file_path}"

        df = clean_dataframe(df)
        df = unify_columns(df, schema_map)
        return df, None
    except Exception as e:
        return None, str(e)


### STEP 4: `scripts/merge_master.py`

import os
import pandas as pd

def merge_parsed_files(parsed_dir, output_file):
    all_dfs = []
    for file in os.listdir(parsed_dir):
        if file.endswith('.csv'):
            path = os.path.join(parsed_dir, file)
            try:
                df = pd.read_csv(path)
                df["source_file"] = file
                all_dfs.append(df)
            except Exception as e:
                print(f"Skip {file}: {e}")
    if all_dfs:
        master_df = pd.concat(all_dfs, ignore_index=True)
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        master_df.to_csv(output_file, index=False)
        print(f"✅ Merged {len(all_dfs)} files into {output_file}")
    else:
        print("⚠️ No parsed files found to merge.")

if __name__ == "__main__":
    merge_parsed_files("parsed", "parsed/master_ebay_ready.csv")


### STEP 5: `scripts/upload_to_supabase.py`

import os
import pandas as pd
import requests
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_TABLE = os.getenv("SUPABASE_TABLE")
CSV_PATH = "parsed/master_ebay_ready.csv"

def upload_to_supabase():
    if not SUPABASE_URL or not SUPABASE_KEY or not SUPABASE_TABLE:
        raise ValueError("Missing required Supabase environment variables.")

    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }

    try:
        df = pd.read_csv(CSV_PATH)
        records = df.to_dict(orient="records")
        success_count = 0

        for row in records:
            response = requests.post(
                f"{SUPABASE_URL}/rest/v1/{SUPABASE_TABLE}",
                headers=headers,
                json=row
            )
            if response.status_code in [200, 201]:
                success_count += 1
            else:
                print(f"❌ Error uploading row: {response.status_code} - {response.text}")

        print(f"✅ Successfully uploaded {success_count} records to {SUPABASE_TABLE}.")

    except Exception as e:
        print(f"⚠️ Failed to upload data: {e}")

if __name__ == "__main__":
    upload_to_supabase()


### STEP 6: `config/schema_map.json`

{
  "sku": ["SKU", "Part Number", "ProductCode"],
  "title": ["Title", "Name", "Description"],
  "price": ["Trade", "DealerPrice", "SRP"],
  "quantity": ["Stock", "Qty", "OnHand"]
}

