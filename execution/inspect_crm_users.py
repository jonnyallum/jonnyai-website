import psycopg2
import sys

conn_str = "postgresql://postgres.sspbbdimkhsputpehybk:Aprilia100%2169.@aws-1-eu-west-2.pooler.supabase.com:6543/postgres?sslmode=require"

try:
    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()
    
    print("--- Users in core.user ---")
    cur.execute("SELECT id, email, disabled, \"firstName\", \"lastName\" FROM core.\"user\";")
    rows = cur.fetchall()
    for r in rows:
        print(r)
        
    cur.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
