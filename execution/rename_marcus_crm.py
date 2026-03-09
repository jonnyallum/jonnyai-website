import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

# Using Supabase Pooler for better reliability
DB_URL = "postgresql://postgres.sspbbdimkhsputpehybk:Aprilia100%2169.@aws-1-eu-west-2.pooler.supabase.com:6543/postgres?sslmode=require"


conn = psycopg2.connect(DB_URL)
cur = conn.cursor()

# Change the email back to marcus@jonnyai.co.uk
query = """
UPDATE core."user"
SET email = 'marcus@jonnyai.co.uk'
WHERE email = 'marcus_DISABLED@jonnyai.co.uk';
"""

cur.execute(query)
conn.commit()

print(f"Updated {cur.rowcount} user(s) to marcus@jonnyai.co.uk")

cur.close()
conn.close()
