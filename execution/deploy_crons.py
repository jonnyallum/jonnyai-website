"""
Master deploy: push all new scripts to GitHub + install on VM as systemd timers.
"""
import warnings
warnings.filterwarnings("ignore")
import paramiko, os, subprocess, sys
from pathlib import Path

VM_IP = "34.105.146.38"
VM_USER = "antigravity-ai"
KEY_PATH = r"c:\Users\jonny\Desktop\JonnyAI_JaiOS_4.0\execution\vps_key"
LOCAL_EXEC = r"c:\Users\jonny\Desktop\JonnyAI_JaiOS_4.0\execution"
REMOTE_EXEC = "/home/antigravity-ai/Antigravity_Orchestra/execution"
REPO = r"c:\Users\jonny\Desktop\JonnyAI_JaiOS_4.0"

SCRIPTS = [
    "process_orders.py",
    "agent_ralph_rotation.py",
    "daily_standup.py",
    "ecosystem_audit.py",
    "analytics_report.py",
    "repo_scan.py",
]

UNITS = {
    "daily-standup": {
        "service": "[Unit]\nDescription=Antigravity Daily Standup @Marcus\nAfter=network.target\n\n[Service]\nType=oneshot\nUser=antigravity-ai\nWorkingDirectory=/home/antigravity-ai/Antigravity_Orchestra\nEnvironmentFile=/home/antigravity-ai/Antigravity_Orchestra/.env\nExecStart=/usr/bin/python3 execution/daily_standup.py\nStandardOutput=journal\nStandardError=journal\n\n[Install]\nWantedBy=multi-user.target\n",
        "timer": "[Unit]\nDescription=Daily Standup at 09:50 UTC\n\n[Timer]\nOnCalendar=*-*-* 09:50:00 UTC\nPersistent=true\nUnit=daily-standup.service\n\n[Install]\nWantedBy=timers.target\n"
    },
    "agent-ralph-rotation": {
        "service": "[Unit]\nDescription=Daily Agent Ralph Loop Rotation\nAfter=network.target\n\n[Service]\nType=oneshot\nUser=antigravity-ai\nWorkingDirectory=/home/antigravity-ai/Antigravity_Orchestra\nEnvironmentFile=/home/antigravity-ai/Antigravity_Orchestra/.env\nExecStart=/usr/bin/python3 execution/agent_ralph_rotation.py\nStandardOutput=journal\nStandardError=journal\nTimeoutStartSec=600\n\n[Install]\nWantedBy=multi-user.target\n",
        "timer": "[Unit]\nDescription=Daily Agent Ralph Loop at 10:00 UTC\n\n[Timer]\nOnCalendar=*-*-* 10:00:00 UTC\nPersistent=true\nUnit=agent-ralph-rotation.service\n\n[Install]\nWantedBy=timers.target\n"
    }
}

def connect():
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    for kc in [paramiko.Ed25519Key, paramiko.ECDSAKey, paramiko.RSAKey]:
        try:
            k = kc.from_private_key_file(KEY_PATH)
            c.connect(VM_IP, username=VM_USER, pkey=k, timeout=15)
            return c
        except: continue
    c.connect(VM_IP, username=VM_USER, key_filename=KEY_PATH, timeout=15)
    return c

def run(c, cmd, label="", timeout=60):
    if label: print(f"\n=== {label} ===")
    _, out, err = c.exec_command(cmd, timeout=timeout)
    o = out.read().decode().strip()
    e = err.read().decode().strip()
    if o: print(o)
    if e and "Created symlink" not in e and "Removed" not in e: print("ERR: " + e[:150])
    return o

def push_to_github():
    print("\n=== PUSH TO GITHUB ===")
    r = subprocess.run(
        ["git", "add"] + [f"execution/{s}" for s in SCRIPTS],
        capture_output=True, text=True, cwd=REPO
    )
    r2 = subprocess.run(
        ["git", "commit", "-m",
         "feat: agent ralph rotation, daily standup, fixed order processor, harmony crons"],
        capture_output=True, text=True, cwd=REPO
    )
    msg = r2.stdout.strip() or r2.stderr.strip()
    print(msg[:100] if msg else "Nothing new to commit")
    r3 = subprocess.run(["git", "push", "origin", "main"],
                        capture_output=True, text=True, cwd=REPO, timeout=30)
    print(r3.stdout.strip() or r3.stderr.strip()[:100] or "Pushed OK")

def deploy():
    print("\n=== CONNECT TO VM ===")
    c = connect()
    print("Connected!")

    # Upload scripts
    sftp = c.open_sftp()
    for s in SCRIPTS:
        lp = os.path.join(LOCAL_EXEC, s)
        if os.path.exists(lp):
            sftp.put(lp, f"{REMOTE_EXEC}/{s}")
            print(f"  Uploaded: {s}")
        else:
            print(f"  SKIP (missing): {s}")
    sftp.close()

    # Install new units
    for name, unit in UNITS.items():
        run(c, f"cat > /tmp/{name}.service << 'EOF'\n{unit['service']}\nEOF")
        run(c, f"cat > /tmp/{name}.timer << 'EOF'\n{unit['timer']}\nEOF")
        run(c, f"sudo cp /tmp/{name}.service /etc/systemd/system/{name}.service")
        run(c, f"sudo cp /tmp/{name}.timer /etc/systemd/system/{name}.timer")
        print(f"  Installed: {name}")

    run(c, "sudo systemctl daemon-reload", "Daemon reload")
    for name in UNITS:
        run(c, f"sudo systemctl enable --now {name}.timer")
        print(f"  Enabled: {name}.timer")

    # Full timer list
    print("\n=== ALL ACTIVE TIMERS ===")
    result = run(c, "systemctl list-timers --all --no-pager 2>&1 | grep -v 'n/a.*n/a' | head -25")
    print(result)

    # Run ecosystem audit NOW
    print("\n=== RUNNING ECOSYSTEM AUDIT NOW ===")
    run(c, "cd /home/antigravity-ai/Antigravity_Orchestra && /usr/bin/python3 execution/ecosystem_audit.py 2>&1", timeout=120)

    c.close()

def main():
    push_to_github()
    deploy()
    print("\nAll systems deployed and harmonised!")

if __name__ == "__main__":
    main()
