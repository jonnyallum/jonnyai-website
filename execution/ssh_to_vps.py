#!/usr/bin/env python3
"""
SSH to Antigravity Orchestra GCP VM
====================================
Usage:
    python execution/ssh_to_vps.py                    # Interactive shell
    python execution/ssh_to_vps.py "uptime"           # Run single command
    python execution/ssh_to_vps.py status              # Check VM status
    python execution/ssh_to_vps.py "docker ps -a"     # Any remote command

Connection Details:
    Host: 34.105.146.38
    User: antigravity-ai (primary) or info (GCP OS Login)
    Key:  execution/vps_key
    
For other AIs / manual SSH:
    ssh -i execution/vps_key -o StrictHostKeyChecking=no antigravity-ai@34.105.146.38
"""

import subprocess
import sys
import os

# === CONNECTION CONFIG ===
VM_IP = "34.105.146.38"
VM_USER = "antigravity-ai"
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
KEY_PATH = os.path.join(SCRIPT_DIR, "vps_key")

SSH_BASE = [
    "ssh",
    "-i", KEY_PATH,
    "-o", "StrictHostKeyChecking=no",
    "-o", "ConnectTimeout=10",
    f"{VM_USER}@{VM_IP}"
]


def run_command(cmd=None):
    """Run a command on the VPS or open interactive shell."""
    if cmd:
        full_cmd = SSH_BASE + [cmd]
    else:
        full_cmd = SSH_BASE  # Interactive shell
    
    try:
        result = subprocess.run(full_cmd, timeout=3600 if cmd else None)
        return result.returncode
    except subprocess.TimeoutExpired:
        print("ERROR: Command timed out after 3600 seconds")
        return 1
    except FileNotFoundError:
        print(f"ERROR: SSH key not found at {KEY_PATH}")
        print(f"Expected location: {KEY_PATH}")
        return 1


def status():
    """Quick health check."""
    print(f"=== Antigravity Orchestra VM ===")
    print(f"  IP: {VM_IP}")
    print(f"  User: {VM_USER}")
    print(f"  Key: {KEY_PATH}")
    print(f"  Key exists: {os.path.exists(KEY_PATH)}")
    print()
    
    rc = run_command("echo 'CONNECTION: OK' && hostname && uptime && echo '---' && df -h / && free -h")
    if rc != 0:
        print("\n❌ CONNECTION FAILED")
        print(f"Try manually: ssh -i {KEY_PATH} {VM_USER}@{VM_IP}")
    return rc


if __name__ == "__main__":
    if len(sys.argv) > 1:
        arg = " ".join(sys.argv[1:])
        if arg == "status":
            sys.exit(status())
        else:
            sys.exit(run_command(arg))
    else:
        # Interactive shell
        print(f"Connecting to {VM_USER}@{VM_IP}...")
        sys.exit(run_command())
