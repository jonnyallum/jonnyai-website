import psycopg2

conn_str = "postgresql://postgres.sspbbdimkhsputpehybk:Aprilia100%2169.@aws-1-eu-west-2.pooler.supabase.com:6543/postgres?sslmode=require"

try:
    conn = psycopg2.connect(conn_str)
    conn.autocommit = True
    cur = conn.cursor()
    
    # Drop all workspace schemas
    cur.execute("SELECT schema_name FROM information_schema.schemata WHERE schema_name LIKE 'workspace_%';")
    schemas = cur.fetchall()
    for s in schemas:
        print(f"Dropping schema {s[0]}")
        cur.execute(f'DROP SCHEMA "{s[0]}" CASCADE;')
        
    print("Dropping core schema")
    cur.execute('DROP SCHEMA IF EXISTS "core" CASCADE;')
    print("Done. Restart Twenty to recreate.")
    
except Exception as e:
    print(e)
