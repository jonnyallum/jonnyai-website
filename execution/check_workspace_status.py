import psycopg2

conn_str = "postgresql://postgres.sspbbdimkhsputpehybk:Aprilia100%2169.@aws-1-eu-west-2.pooler.supabase.com:5432/postgres?sslmode=require"

try:
    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()
    cur.execute('SELECT "displayName", "activationStatus" FROM "core"."workspace";')
    workspaces = cur.fetchall()
    print("Workspaces:", workspaces)
    
except Exception as e:
    print(e)
