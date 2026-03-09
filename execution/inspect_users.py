import psycopg2

conn_str = "postgresql://postgres.sspbbdimkhsputpehybk:Aprilia100%2169.@aws-1-eu-west-2.pooler.supabase.com:5432/postgres?sslmode=require"

try:
    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()
    cur.execute('SELECT email FROM "core"."user";')
    emails = cur.fetchall()
    print("Emails in user table:", emails)
    
except Exception as e:
    print(e)
