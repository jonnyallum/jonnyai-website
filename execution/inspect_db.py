import psycopg2

conn_str = "postgresql://postgres.sspbbdimkhsputpehybk:Aprilia100%2169.@aws-1-eu-west-2.pooler.supabase.com:5432/postgres?sslmode=require"

try:
    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()
    cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='core' AND table_name ILIKE '%user%';")
    tables = [t[0] for t in cur.fetchall()]
    print("User related tables:", tables)
    
except Exception as e:
    print(e)
