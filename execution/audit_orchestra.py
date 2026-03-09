
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

CONNECTION_STRING = os.getenv("ANTIGRAVITY_BRAIN_CONNECTION_STRING")

def audit_orchestra():
    print("--- Antigravity Orchestra Health Audit ---")
    try:
        conn = psycopg2.connect(CONNECTION_STRING)
        cur = conn.cursor()
        
        # 1. Check Agent Counts
        cur.execute("SELECT count(*) FROM agents")
        agent_count = cur.fetchone()[0]
        print(f"Total Agents in Brain: {agent_count}/39")
        
        # 2. Check for "Ghost" Agents (Offline/No Activity)
        cur.execute("SELECT id, human_name, status FROM agents WHERE last_active IS NULL OR last_active < NOW() - INTERVAL '7 days'")
        ghosts = cur.fetchall()
        if ghosts:
            print(f"\nGhost Agents Detected ({len(ghosts)}):")
            for g in ghosts:
                print(f" - {g[0]} ({g[1]}) : {g[2]}")
        else:
            print("\nAll active agents are synchronized.")
            
        # 3. Check for Pending Tasks
        cur.execute("SELECT count(*) FROM tasks WHERE status = 'pending'")
        pending = cur.fetchone()[0]
        print(f"\nPending Tasks in Queue: {pending}")
        
        # 4. Check for Recurring Task Health
        cur.execute("SELECT count(*) FROM tasks WHERE is_recurring = true AND next_run_at IS NULL")
        broken_crons = cur.fetchone()[0]
        if broken_crons > 0:
            print(f"CRITICAL: {broken_crons} recurring tasks have no next_run_at schedule!")
            
        cur.close()
        conn.close()
        print("\nAudit Complete.")
    except Exception as e:
        print(f"Audit Error: {e}")

if __name__ == "__main__":
    audit_orchestra()
