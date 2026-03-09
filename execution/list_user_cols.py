import psycopg2
import sys

conn_str = "postgresql://postgres.sspbbdimkhsputpehybk:Aprilia100%2169.@aws-1-eu-west-2.pooler.supabase.com:6543/postgres?sslmode=require"

try:
    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()
    
    cur.execute("SELECT column_name FROM information_schema.columns WHERE table_schema = 'core' AND table_name = 'user';")
    rows = cur.fetchall()
    for r in rows:
        print(r[0])
        
    cur.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
