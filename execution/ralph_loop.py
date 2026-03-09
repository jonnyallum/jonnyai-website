import os
import sys
import json
import subprocess
from pathlib import Path
from datetime import datetime
import psycopg2
from dotenv import load_dotenv

load_dotenv()

# Configuration
CONNECTION_STRING = os.getenv("ANTIGRAVITY_BRAIN_CONNECTION_STRING")
ROOT_DIR = Path(__file__).parent.parent
MEMORY_DIR = ROOT_DIR / ".agent" / "memory"
RALPH_HISTORY = MEMORY_DIR / "ralph-history.json"

def get_db():
    if not CONNECTION_STRING:
        return None
    return psycopg2.connect(CONNECTION_STRING)

def run_command(command, cwd=ROOT_DIR):
    print(f">>> Running: {command}")
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True, cwd=cwd)
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def log_iteration(project_id, iteration, status, agent, note, error=None):
    entry = {
        "timestamp": datetime.now().isoformat(),
        "project": project_id,
        "iteration": iteration,
        "status": status,
        "agent": agent,
        "note": note,
        "error": error
    }
    
    # Local log
    history = []
    if RALPH_HISTORY.exists():
        with open(RALPH_HISTORY, "r", encoding="utf-8") as f:
            history = json.load(f)
    history.append(entry)
    with open(RALPH_HISTORY, "w", encoding="utf-8") as f:
        json.dump(history, f, indent=2)
        
    # Supabase log
    conn = get_db()
    if conn:
        try:
            cur = conn.cursor()
            cur.execute("""
                INSERT INTO learnings (agent_id, content, created_at)
                VALUES (%s, %s, %s)
            """, (agent, f"RALPH_ITERATION {iteration}: {status} - {note}", datetime.now()))
            conn.commit()
            cur.close()
            conn.close()
        except Exception as e:
            print(f"Supabase logging error: {e}")

def ralph_loop(plan_path, agent_handle, max_iters=10, done_check="npm test"):
    print(f"=== RALPH WIGGUM LOOP STARTING: {plan_path} ===")
    project_id = Path(plan_path).stem
    
    for i in range(1, max_iters + 1):
        print(f"\n--- Iteration {i}/{max_iters} ---")
        
        # 1. Spawn Agent Session (This is a conceptual trigger for the orchestrator)
        # In this implementation, we assume the agent work happens externally or via a specific tool.
        # But here we provide the infrastructure to log and check.
        
        # Note: The actual "spawning" of a fresh session is handled by the AI platform/orchestrator.
        # This script monitors the result.
        
        # 2. Run Done Check
        success, stdout, stderr = run_command(done_check)
        
        if success:
            log_iteration(project_id, i, "success", agent_handle, f"Done criteria '{done_check}' met.")
            print(f"RALPH LOOP SUCCESS: Criteria met in iteration {i}")
            return True
        else:
            log_iteration(project_id, i, "fail", agent_handle, f"Iteration failed criteria '{done_check}'", error=stderr)
            print(f"RALPH LOOP CONTINUE: Iteration {i} did not satisfy '{done_check}'")
            
            # Here, the orchestrator (Marcus) would usually re-trigger the agent.
            # Since this script is the "harness", we exit and let Marcus handle the next call if needed,
            # or we could implement a recursive call if the platform allowed long-running tool execution.
            
    print(f"RALPH LOOP TERMINATED: Reached max iterations {max_iters}")
    return False

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Ralph Wiggum Loop Harness")
    parser.add_argument("--plan", required=True, help="Path to implementation plan")
    parser.add_argument("--agent", required=True, help="Target agent handle")
    parser.add_argument("--iters", type=int, default=10, help="Max iterations")
    parser.add_argument("--check", default="npm test", help="Done check command")
    
    args = parser.parse_args()
    ralph_loop(args.plan, args.agent, args.iters, args.check)
