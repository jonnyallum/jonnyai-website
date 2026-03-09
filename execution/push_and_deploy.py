import subprocess
import sys
import os

REPO = r"c:\Users\jonny\Desktop\JonnyAI_JaiOS_4.0"

def sh(cmd, cwd=None):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True, cwd=cwd or REPO)
    if r.stdout.strip(): print(r.stdout.strip())
    if r.stderr.strip(): print("ERR: " + r.stderr.strip()[:300])
    return r.returncode

print("=== Step 1: Git status ===")
sh("git status --short")

print("\n=== Step 2: Stage BL order scripts ===")
files = [
    "execution/process_orders.py",
    "execution/ebay_order_poller.py",
    "execution/bikeit_order_bot.py",
    "execution/cmpo_order_bot.py",
]
for f in files:
    if os.path.exists(os.path.join(REPO, f)):
        sh(f"git add {f}")
        print(f"  staged: {f}")
    else:
        print(f"  missing locally: {f}")

print("\n=== Step 3: Commit & push ===")
r = subprocess.run(
    ["git", "commit", "-m", "feat: BL order processor scripts for cloud deployment"],
    capture_output=True, text=True, cwd=REPO
)
print(r.stdout.strip() or r.stderr.strip())

sh("git push origin main")

print("\nDone - now run ssh_deploy.py to pull on VM")
