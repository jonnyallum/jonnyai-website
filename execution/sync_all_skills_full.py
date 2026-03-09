
import os
import sys
import json
from pathlib import Path
import psycopg2
from dotenv import load_dotenv

load_dotenv()

# Configuration
CONNECTION_STRING = os.getenv("ANTIGRAVITY_BRAIN_CONNECTION_STRING")
ROOT_DIR = Path(__file__).parent.parent
SKILLS_DIR = ROOT_DIR / ".agent" / "skills"

def get_db():
    if not CONNECTION_STRING:
        print("[ERROR] No ANTIGRAVITY_BRAIN_CONNECTION_STRING found in .env")
        return None
    return psycopg2.connect(CONNECTION_STRING)

def sync_full_skills():
    """Sync EVERY agent's full SKILL.md content to Supabase philosophy column."""
    print("=== Jai.OS 5.0 Full Skill Sync ===")
    
    conn = get_db()
    if not conn: return
    cur = conn.cursor()

    # 1. Detect actual column name for philosophy/skill
    try:
        cur.execute("SELECT * FROM agents LIMIT 1;")
        colnames = [desc[0] for desc in cur.description]
        phil_col = next((c for c in ["philosophy", "skill_content", "description", "bio"] if c in colnames), None)
        handle_col = next((c for c in ["id", "handle", "agent_id"] if c in colnames), "id")
        print(f"  Detected columns: handle={handle_col}, philosophy={phil_col}")
    except Exception as e:
        print(f"  Column detection failed: {e}")
        conn.rollback()
        return

    if not phil_col:
        print("  [ERROR] Could not find philosophy/skill column in 'agents' table.")
        cur.close()
        conn.close()
        return

    # 2. Iterate and Update
    updated_count = 0
    for agent_dir in sorted(SKILLS_DIR.iterdir()):
        if agent_dir.is_dir() and agent_dir.name != "methodology":
            skill_file = agent_dir / "SKILL.md"
            if skill_file.exists():
                handle = agent_dir.name
                content = skill_file.read_text(encoding="utf-8")
                
                try:
                    # Update philosophy
                    cur.execute(f"""
                        UPDATE agents 
                        SET {phil_col} = %s, last_active = NOW()
                        WHERE {handle_col} = %s;
                    """, (content, handle))
                    
                    if cur.rowcount > 0:
                        updated_count += 1
                        print(f"  [OK] @{handle:15} synced ({len(content.encode())/1024:.1f}KB)")
                    else:
                        # Try case-insensitive or name match if id fails?
                        # For now, Jai.OS 5.0 expects handles to match IDs.
                        print(f"  [WARN] @{handle:14} not found in DB table.")
                except Exception as e:
                    print(f"  [FAIL] @{handle:14} sync error: {e}")
                    conn.rollback()
    
    conn.commit()
    cur.close()
    conn.close()
    print(f"\nDONE: {updated_count} agents fully synced to Shared Brain.")

if __name__ == "__main__":
    sync_full_skills()
