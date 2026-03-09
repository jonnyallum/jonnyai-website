import psycopg2

conn_str = "postgresql://postgres.sspbbdimkhsputpehybk:Aprilia100%2169.@aws-1-eu-west-2.pooler.supabase.com:5432/postgres?sslmode=require"

try:
    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()
    cur.execute("SELECT nspname FROM pg_extension e JOIN pg_namespace n ON e.extnamespace = n.oid WHERE extname = 'uuid-ossp';")
    schema = cur.fetchone()
    if schema:
        print(f"uuid-ossp is installed in schema: {schema[0]}")
    else:
        print("uuid-ossp is NOT installed.")
    
    cur.execute("SHOW search_path;")
    print("Current search_path:", cur.fetchone()[0])
    
except Exception as e:
    print(e)
