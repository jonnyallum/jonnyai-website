import psycopg2

conn_str = "postgresql://postgres.sspbbdimkhsputpehybk:Aprilia100%2169.@aws-1-eu-west-2.pooler.supabase.com:6543/postgres?sslmode=require"

try:
    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()
    cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='core';")
    tables = cur.fetchall()
    print("Core tables:", [t[0] for t in tables])
    
    cur.execute("SELECT schema_name FROM information_schema.schemata WHERE schema_name LIKE 'workspace_%';")
    ws_schema = cur.fetchone()
    if ws_schema:
        schema = ws_schema[0]
        cur.execute(f"SELECT table_name FROM information_schema.tables WHERE table_schema='{schema}';")
        tables = cur.fetchall()
        print(f"\nTables in {schema}:", [t[0] for t in tables])
except Exception as e:
    print(e)
