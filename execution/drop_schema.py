import psycopg2

conn_str = "postgresql://postgres.sspbbdimkhsputpehybk:Aprilia100%2169.@aws-1-eu-west-2.pooler.supabase.com:5432/postgres?sslmode=require"

try:
    conn = psycopg2.connect(conn_str)
    conn.autocommit = True
    cur = conn.cursor()
    cur.execute('DROP SCHEMA "core" CASCADE;')
    print("Success: Dropped current core schema to trigger fresh migration and workspace creation.")
except Exception as e:
    print(e)
