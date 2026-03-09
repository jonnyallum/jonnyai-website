import sys
import io

# Force UTF-8 for stdout/stderr
if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
if sys.stderr.encoding != 'utf-8':
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

import os
import sys
from pathlib import Path

ROOT = Path(r"C:\Users\jonny\Desktop\JonnyAI_JaiOS_5.0")
CLIENTS_DIR = ROOT / "Clients"

def onboard_project(name):
    print(f"🚀 INITIATING ONBOARDING: {name}")
    
    # 1. Create client directory
    project_path = CLIENTS_DIR / name
    if project_path.exists():
        print(f"❌ Project already exists at {project_path}")
        return
    
    project_path.mkdir(parents=True)
    (project_path / "src").mkdir()
    (project_path / "docs").mkdir()
    (project_path / "assets").mkdir()
    
    # 2. Create Initial Tasklist
    tasklist = ROOT / ".tmp" / f"{name.lower()}-tasklist.md"
    with open(tasklist, 'w', encoding='utf-8') as f:
        f.write(f"# {name} Tasklist\n\n## Phase 1: Scaffolding\n- [ ] Initialize Repository\n- [ ] Configure Environment Variables\n- [ ] Design System Handshake (@Priya)\n")
    
    # 3. Create context placeholder
    os.system(f"python execution/inject_context.py create {name}")
    
    print(f"✅ ONBOARDING COMPLETE: {project_path}")
    print(f"📄 Local Tasklist: {tasklist}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python onboard_project.py [project_name]")
        sys.exit(1)
    
    onboard_project(sys.argv[1])
