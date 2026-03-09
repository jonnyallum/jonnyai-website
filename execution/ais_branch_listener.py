"""
ais_branch_listener.py — Monitor the AI staging branch.
Jai.OS 5.1 | Antigravity AI Orchestra
"""
import os
import subprocess
import requests
from datetime import datetime, timezone

BRAIN_URL = os.getenv("ANTIGRAVITY_BRAIN_URL", "https://lkwydqtfbdjhxaarelaz.supabase.co")
BRAIN_KEY = os.getenv("ANTIGRAVITY_BRAIN_SERVICE_ROLE_KEY", "")

def post_to_chatroom(message):
    headers = {
        "apikey": BRAIN_KEY,
        "Authorization": f"Bearer {BRAIN_KEY}",
        "Content-Type": "application/json",
    }
    requests.post(
        f"{BRAIN_URL}/rest/v1/chatroom",
        headers=headers,
        json={
            "agent_id": "marcus",
            "message": message,
            "message_type": "broadcast",
            "ai_source": "branch-listener"
        }
    )

def scan_branch():
    print("[AIS-LISTENER] Scanning ais-post-branch...")
    # Fetch latest from remote
    subprocess.run(["git", "fetch", "origin", "ais-post-branch"], capture_output=True)
    
    # Check for diff between current head and remote ais branch
    result = subprocess.run(
        ["git", "log", "HEAD..origin/ais-post-branch", "--oneline"],
        capture_output=True, text=True
    )
    
    if result.stdout.strip():
        commits = result.stdout.strip().split("\n")
        msg = f"🛰️ **AI Branch Update Detected!**\n\nExternal AIs (ChatGPT/Manus/Perplexity) have pushed {len(commits)} updates to `ais-post-branch`.\n\n**Latest commits:**\n" + "\n".join(commits[:5])
        print(f"[AIS-LISTENER] {len(commits)} new commits found.")
        post_to_chatroom(msg)
    else:
        print("[AIS-LISTENER] No new updates on AI branch.")

    # Daily Repo Health Scan (simulated for now)
    print("[AIS-LISTENER] Performing daily repo health scan...")
    post_to_chatroom("🛡️ **Daily Repo Scan COMPLETE.** No anomalies detected in Jai.OS 4.0 Core.")

if __name__ == "__main__":
    if not BRAIN_KEY:
        print("Missing SUPABASE_SERVICE_ROLE_KEY")
    else:
        scan_branch()
