
import sys
import psycopg2
from pathlib import Path

# Proven connection string from apply_bl_triggers.py
CONN = "postgresql://postgres.ddjuoeyaoxllockcusgf:Aprilia100!69.@aws-1-eu-west-2.pooler.supabase.com:6543/postgres"
MIGRATION_FILE = Path("c:/Users/jonny/Desktop/JonnyAI_JaiOS_4.0/Clients/BL-Motorcycles-Enterprise/website/supabase/migrations/001_admin_ops_hub.sql")

def main():
    if not MIGRATION_FILE.exists():
        print(f"ERROR: {MIGRATION_FILE} not found.")
        return

    sql = MIGRATION_FILE.read_text(encoding='utf-8')
    
    try:
        print("Connecting to BL Supabase via pooler...")
        conn = psycopg2.connect(CONN)
        conn.autocommit = True
        cur = conn.cursor()
        print("Connected! Executing migration SQL...")
        cur.execute(sql)
        print("✅ Migration applied successfully!")
        cur.close()
        conn.close()
    except Exception as e:
        print(f"❌ Connection failed: {str(e).encode('ascii', 'ignore').decode('ascii')}")

if __name__ == "__main__":
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    main()
