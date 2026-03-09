
import psycopg2
import sys
from pathlib import Path

# Proven connection details from apply_bl_triggers.py
CONN = "postgresql://postgres.ddjuoeyaoxllockcusgf:Aprilia100!69.@aws-1-eu-west-2.pooler.supabase.com:6543/postgres"
MIGRATION_PATH = Path("c:/Users/jonny/Desktop/JonnyAI_JaiOS_4.0/Clients/BL-Motorcycles-Enterprise/website/supabase/migrations/001_admin_ops_hub.sql")

def run_migration():
    if not MIGRATION_PATH.exists():
        print(f"❌ Migration file not found at {MIGRATION_PATH}")
        return

    try:
        sql = MIGRATION_PATH.read_text(encoding='utf-8')
        
        print("Connecting to BL Supabase (ddjuoeyaoxllockcusgf)...")
        conn = psycopg2.connect(CONN)
        conn.autocommit = True
        cur = conn.cursor()
        
        print("Applying Admin Ops Hub migration...")
        cur.execute(sql)
        print("✅ Migration applied successfully.")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"❌ Error applying migration: {str(e).encode('ascii', 'ignore').decode('ascii')}")

if __name__ == "__main__":
    run_migration()
