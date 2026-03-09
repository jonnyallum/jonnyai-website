import psycopg2

conn_str = "postgresql://postgres.sspbbdimkhsputpehybk:Aprilia100%2169.@aws-1-eu-west-2.pooler.supabase.com:5432/postgres?sslmode=require"

with open("c:\\Users\\jonny\\Desktop\\JonnyAI_JaiOS_4.0\\tmp_db_diagnostic_utf8.txt", "w", encoding="utf-8") as f:
    try:
        conn = psycopg2.connect(conn_str)
        cur = conn.cursor()
        
        # Check extensions
        f.write("--- Extensions ---\n")
        cur.execute("SELECT extname, nspname FROM pg_extension e JOIN pg_namespace n ON e.extnamespace = n.oid;")
        extensions = cur.fetchall()
        for ext in extensions:
            f.write(f"Extension: {ext[0]}, Schema: {ext[1]}\n")
            
        # Check function uuid_generate_v4
        f.write("\n--- Function uuid_generate_v4 ---\n")
        cur.execute("""
            SELECT n.nspname, p.proname 
            FROM pg_proc p 
            JOIN pg_namespace n ON p.pronamespace = n.oid 
            WHERE p.proname = 'uuid_generate_v4';
        """)
        funcs = cur.fetchall()
        for func in funcs:
            f.write(f"Function: {func[1]}, Schema: {func[0]}\n")
            
        # Test executing the function with public prefix
        f.write("\n--- Testing execution ---\n")
        try:
            cur.execute("SELECT public.uuid_generate_v4();")
            val = cur.fetchone()[0]
            f.write(f"Result of public.uuid_generate_v4(): {val}\n")
        except Exception as e:
            f.write(f"Error executing public.uuid_generate_v4(): {e}\n")
            
        # Check search_path
        # Use a separate cursor/transaction since the previous might have errored out
        if conn.status == psycopg2.extensions.STATUS_IN_TRANSACTION:
            conn.rollback()
        cur = conn.cursor()
        cur.execute("SHOW search_path;")
        f.write(f"\nsearch_path: {cur.fetchone()[0]}\n")

    except Exception as e:
        f.write(f"Database error: {e}\n")
    finally:
        if 'conn' in locals() and conn:
            conn.close()
