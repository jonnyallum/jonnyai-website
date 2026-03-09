import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

DB_URL = "postgresql://postgres.sspbbdimkhsputpehybk:Aprilia100%2169.@aws-1-eu-west-2.pooler.supabase.com:6543/postgres?sslmode=require"

try:
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    cur.execute("SELECT id, email, disabled FROM core.\"user\" WHERE email LIKE '%marcus%';")
    marcus = cur.fetchall()
    print("Marcus users found:", marcus)
    cur.close()
    conn.close()
except Exception as e:
    print(e)
