import psycopg2

conn_str = "postgresql://postgres.sspbbdimkhsputpehybk:Aprilia100%2169.@aws-1-eu-west-2.pooler.supabase.com:5432/postgres?sslmode=require"

try:
    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()
    
    # Check extensions
    print("--- Extensions ---")
    cur.execute("SELECT extname, nspname FROM pg_extension e JOIN pg_namespace n ON e.extnamespace = n.oid;")
    extensions = cur.fetchall()
    for ext in extensions:
        print(f"Extension: {ext[0]}, Schema: {ext[1]}")
        
    # Check function uuid_generate_v4
    print("\n--- Function uuid_generate_v4 ---")
    cur.execute("""
        SELECT n.nspname, p.proname 
        FROM pg_proc p 
        JOIN pg_namespace n ON p.pronamespace = n.oid 
        WHERE p.proname = 'uuid_generate_v4';
    """)
    funcs = cur.fetchall()
    for f in funcs:
        print(f"Function: {f[1]}, Schema: {f[0]}")
        
    # Test executing the function with public prefix
    print("\n--- Testing execution ---")
    try:
        cur.execute("SELECT public.uuid_generate_v4();")
        val = cur.fetchone()[0]
        print(f"Result of public.uuid_generate_v4(): {val}")
    except Exception as e:
        print(f"Error executing public.uuid_generate_v4(): {e}")
        
    # Check search_path
    cur.execute("SHOW search_path;")
    print(f"\nsearch_path: {cur.fetchone()[0]}")

except Exception as e:
    print(f"Database error: {e}")
finally:
    if conn:
        conn.close()
