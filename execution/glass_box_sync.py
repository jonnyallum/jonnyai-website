import os
import json
import re
from pathlib import Path

# Paths
ROOT = Path(__file__).parent.parent
CHATROOM = ROOT / ".agent" / "boardroom" / "chatroom.md"
PUBLIC_DATA = ROOT / "Clients" / "jonnyai.website" / "public" / "data"
PUBLIC_DATA.mkdir(parents=True, exist_ok=True)
OUTPUT_FILE = PUBLIC_DATA / "glass_box.json"

def parse_chatroom():
    if not CHATROOM.exists():
        return []
        
    content = CHATROOM.read_text(encoding="utf-8")
    
    # Find all messages: **@Agent:** Message
    messages = re.findall(r'\*\*@([\w\s\-]+):\*\* (.*?)(?=\n\*\*@|\n\n|\n---|$)', content, re.DOTALL)
    
    tasks = []
    # Just take the last 15 messages for the feed
    for i, (agent, action) in enumerate(messages[-15:]):
        # Clean up agent handle
        agent_clean = agent.split()[0].replace("@", "")
        
        # Determine status
        status = "active"
        action_up = action.upper()
        if any(x in action_up for x in ["[SUCCESS]", "[COMPLETE]", "✅", "FINISHED", "DEPLOYED"]):
            status = "success"
        elif any(x in action_up for x in ["[ERROR]", "[FAIL]", "❌", "ISSUE"]):
            status = "alert"
            
        tasks.append({
            "id": i,
            "agent": agent_clean,
            "action": action.strip().replace("\n", " ")[:120],
            "status": status,
            "time": "LIVE"
        })
        
    return tasks[::-1] # Newest first

if __name__ == "__main__":
    tasks = parse_chatroom()
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(tasks, f, indent=2)
    print(f"Synced {len(tasks)} tasks to {OUTPUT_FILE}")
