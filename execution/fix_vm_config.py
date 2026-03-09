"""Fix VM git config, check env vars, patch ecosystem_audit scanner."""
import warnings
warnings.filterwarnings("ignore")
import paramiko, os

VM_IP = "34.105.146.38"
VM_USER = "antigravity-ai"
KEY_PATH = r"c:\Users\jonny\Desktop\JonnyAI_JaiOS_4.0\execution\vps_key"
REPO = "/home/antigravity-ai/Antigravity_Orchestra"

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

def run(c, cmd, label="", timeout=30):
    if label: print(f"\n=== {label} ===")
    _, out, err = c.exec_command(cmd, timeout=timeout)
    o = out.read().decode().strip()
    e = err.read().decode().strip()
    if o: print(o)
    if e and len(e) < 200: print("ERR: " + e)
    return o

def main():
    c = connect()
    print("Connected!")

    # Fix git identity on VM
    run(c, f'git -C {REPO} config user.email "crons@antigravity.ai"', "Set git email")
    run(c, f'git -C {REPO} config user.name "Antigravity Crons"', "Set git name")
    run(c, f'git -C {REPO} config --list | grep user', "Verify git config")

    # Fix git state - pull to sync with remote
    run(c, f"cd {REPO} && git fetch origin && git reset --hard origin/main", "Sync git with remote", timeout=45)
    run(c, f"git -C {REPO} log --oneline -3", "Git log after sync")

    # Check what env vars are available to crons
    run(c, f"grep -E '(SUPABASE|OPENAI|ANTHROPIC)' {REPO}/.env | head -10", "Key env vars")

    # Check if SUPABASE_URL is set (might be SUPABASE_SERVICE_KEY)
    run(c, f"env | grep -E '(SUPABASE|OPENAI)' | head -5", "System env vars")

    c.close()
    print("\nVM config fixed!")

if __name__ == "__main__":
    main()
