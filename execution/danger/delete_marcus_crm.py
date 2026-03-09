import psycopg2
import sys

# connection to supabase CRM db
conn_str = "postgresql://postgres.sspbbdimkhsputpehybk:Aprilia100%2169.@aws-1-eu-west-2.pooler.supabase.com:6543/postgres?sslmode=require"

try:
    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()
    
    cur.execute("SELECT id FROM core.\"user\" WHERE email='marcus@jonnyai.co.uk'")
    rows = cur.fetchall()
    if rows:
        user_id = rows[0][0]
        print(f"Marcus user ID: {user_id}")
        
        # Disable him by changing email
        cur.execute("UPDATE core.\"user\" SET email='marcus_DISABLED@jonnyai.co.uk' WHERE id=%s", (user_id,))
        conn.commit()
        print("Updated email to disable the account.")
    else:
        print("Marcus not found in core.user")
        
    cur.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
