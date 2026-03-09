import psycopg2
import sys

conn_str = "postgresql://postgres.sspbbdimkhsputpehybk:Aprilia100%2169.@aws-1-eu-west-2.pooler.supabase.com:6543/postgres?sslmode=require"

try:
    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()
    
    with open(".tmp/crm_users_audit.txt", "w") as f:
        f.write("--- Users in core.user ---\n")
        cur.execute("SELECT id, email, disabled, \"firstName\", \"lastName\" FROM core.\"user\";")
        rows = cur.fetchall()
        for r in rows:
            f.write(str(r) + "\n")
            
    cur.close()
    conn.close()
    print("Audit saved to .tmp/crm_users_audit.txt")
except Exception as e:
    print(f"Error: {e}")
