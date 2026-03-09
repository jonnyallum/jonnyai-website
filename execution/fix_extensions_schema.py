import psycopg2

conn_str = "postgresql://postgres.sspbbdimkhsputpehybk:Aprilia100%2169.@aws-1-eu-west-2.pooler.supabase.com:5432/postgres?sslmode=require"

try:
    conn = psycopg2.connect(conn_str)
    conn.autocommit = True
    cur = conn.cursor()
    
    # Try moving uuid-ossp to public
    try:
        cur.execute('ALTER EXTENSION "uuid-ossp" SET SCHEMA public;')
        print("Success: Moved uuid-ossp to public.")
    except Exception as e:
        print(f"Failed to move uuid-ossp: {e}")
        
    # Also try moving pgcrypto to public just in case
    try:
        cur.execute('ALTER EXTENSION "pgcrypto" SET SCHEMA public;')
        print("Success: Moved pgcrypto to public.")
    except Exception as e:
        print(f"Failed to move pgcrypto: {e}")

except Exception as e:
    print(f"Connection error: {e}")
