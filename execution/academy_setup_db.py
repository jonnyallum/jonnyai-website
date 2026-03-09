import os
import psycopg2
import uuid
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

CONNECTION_STRING = os.getenv("ANTIGRAVITY_BRAIN_CONNECTION_STRING")

def setup_academy_db():
    """Create the academy_leads table in Supabase."""
    if not CONNECTION_STRING:
        print("❌ ERROR: ANTIGRAVITY_BRAIN_CONNECTION_STRING missing.")
        return

    conn = psycopg2.connect(CONNECTION_STRING)
    cur = conn.cursor()

    try:
        # Create table for academy leads/students
        cur.execute("""
            CREATE TABLE IF NOT EXISTS academy_leads (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                email TEXT UNIQUE NOT NULL,
                name TEXT,
                source TEXT DEFAULT 'academy-direct',
                tier TEXT DEFAULT 'founding-member',
                price_paid TEXT DEFAULT '£297',
                status TEXT DEFAULT 'pending',
                onboarding_sent BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                synced_at TIMESTAMPTZ DEFAULT NOW()
            );
        """)
        
        # Log the system event
        cur.execute("""
            INSERT INTO chatroom (id, agent_id, message, message_type, machine_id, ai_source, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, NOW())
        """, (
            str(uuid.uuid4()),
            "marcus", 
            "INFRASTRUCTURE UPGRADE: academy_leads registry initialized in Shared Brain. Ready for March 10th intake.", 
            "deterministic_state_packet",
            "jonny-desktop",
            "claude"
        ))

        conn.commit()
        print("[OK] Shared Brain: academy_leads initialized.")
    except Exception as e:
        print(f"[FAIL] DB Error: {str(e)}")
        conn.rollback()
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    setup_academy_db()
