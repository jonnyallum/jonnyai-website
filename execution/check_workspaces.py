import psycopg2

conn_str = "postgresql://postgres.sspbbdimkhsputpehybk:Aprilia100%2169.@aws-1-eu-west-2.pooler.supabase.com:5432/postgres?sslmode=require"

try:
    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()
    cur.execute("SELECT schema_name FROM information_schema.schemata;")
    schemas = [s[0] for s in cur.fetchall()]
    
    found_workspace = False
    for s in schemas:
        if s.startswith('workspace_'):
            cur.execute(f"SELECT count(*) FROM information_schema.tables WHERE table_schema='{s}';")
            count = cur.fetchone()[0]
            print(f"Workspace schema {s} has {count} tables.")
            found_workspace = True
            
    if not found_workspace:
        print("No workspace_ schema found yet.")
            
except Exception as e:
    print(e)
