import os
import pandas as pd
import psycopg2
from tqdm import tqdm
from psycopg2.extras import execute_batch

# Postgres connection details
DB_HOST = "172.64.149.246"  # Using direct IP from DNS lookup
DB_NAME = "postgres"
DB_USER = "postgres"
DB_PASS = "StalKERS8206@"
DB_PORT = 5432
BATCH_SIZE = 100  # Records per insert

def create_table(conn):
    """Create eBay listings table if not exists"""
    create_sql = """
    CREATE TABLE IF NOT EXISTS ebay_listings (
        ItemNumber TEXT PRIMARY KEY,
        Title TEXT NOT NULL,
        CustomLabel TEXT,
        AvailableQuantity INTEGER,
        Format TEXT,
        Currency TEXT,
        CurrentPrice NUMERIC,
        Condition TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_ebay_listings_custom_label ON ebay_listings(CustomLabel);
    """
    with conn.cursor() as cur:
        cur.execute(create_sql)
    conn.commit()

def upload_ebay_listings():
    """Upload all eBay-ready CSV files via direct Postgres connection"""
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS,
            port=DB_PORT
        )
        
        create_table(conn)

        # Process all chunk files with progress tracking
        ebay_dir = "ebay_ready"
        insert_sql = """
        INSERT INTO ebay_listings 
        (ItemNumber, Title, CustomLabel, AvailableQuantity, Format, Currency, CurrentPrice, Condition)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (ItemNumber) DO NOTHING
        """
        
        for filename in tqdm(os.listdir(ebay_dir)):
            if filename.endswith(".csv"):
                filepath = os.path.join(ebay_dir, filename)
                df = pd.read_csv(filepath)
                
                # Convert to list of tuples for executemany
                records = [
                    tuple(row) for row in df[[
                        'ItemNumber', 'Title', 'CustomLabel', 'AvailableQuantity',
                        'Format', 'Currency', 'CurrentPrice', 'Condition'
                    ]].itertuples(index=False)
                ]
                
                # Insert in batches
                with conn.cursor() as cur:
                    execute_batch(cur, insert_sql, records, page_size=BATCH_SIZE)
                conn.commit()
                
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    upload_ebay_listings()