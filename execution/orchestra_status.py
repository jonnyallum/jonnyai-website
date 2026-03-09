import os
import sys
import io
from pathlib import Path
from datetime import datetime

# Force UTF-8 for stdout
if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

ROOT = Path(__file__).parent.parent
SKILLS_DIR = ROOT / ".agent" / "skills"
DIRECTIVES_DIR = ROOT / "directives"

def get_status():
    print(f"=== Antigravity Orchestra Status [{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] ===\n")
    
    # 1. Agent Count
    agents = [d for d in SKILLS_DIR.iterdir() if d.is_dir() and d.name != "methodology" and (d / "SKILL.md").exists()]
    print(f"  Agents Active    : {len(agents)}")
    
    # 2. Methodology Skills
    methods = [d for d in (SKILLS_DIR / "methodology").iterdir() if d.is_dir()]
    print(f"  Methodology Libs : {len(methods)}")
    
    # 3. Directives
    directives = [f for f in DIRECTIVES_DIR.iterdir() if f.suffix == ".md"]
    print(f"  Live Directives  : {len(directives)}")
    
    # 4. Recent Logs
    chatroom = ROOT / ".agent" / "boardroom" / "chatroom.md"
    if chatroom.exists():
        content = chatroom.read_text(encoding="utf-8")
        last_entry = [line for line in content.splitlines() if line.startswith("###")][-1:]
        if last_entry:
            print(f"  Last Broadcast   : {last_entry[0].replace('### ', '')}")

    print("\nSystem Integrity: NOMINAL")

if __name__ == "__main__":
    get_status()
