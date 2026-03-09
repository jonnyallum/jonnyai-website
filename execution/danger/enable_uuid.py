import psycopg2

conn_str = "postgresql://postgres.sspbbdimkhsputpehybk:Aprilia100%2169.@aws-1-eu-west-2.pooler.supabase.com:5432/postgres?sslmode=require"

try:
    conn = psycopg2.connect(conn_str)
    conn.autocommit = True
    cur = conn.cursor()
    cur.execute('CREATE EXTENSION IF NOT EXISTS "pgcrypto";')
    print("Success: pgcrypto")
    cur.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    print("Success: uuid-ossp")
    cur.execute('CREATE EXTENSION IF NOT EXISTS "pg_trgm";')
    print("Success: pg_trgm")
    # Verify extensions
    cur.execute("SELECT extname FROM pg_extension ORDER BY extname;")
    exts = [row[0] for row in cur.fetchall()]
    print(f"Active extensions: {exts}")
except Exception as e:
    print(f"Error: {e}")
