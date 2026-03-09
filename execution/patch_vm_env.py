"""Write env aliases directly via SFTP — no SSH grep issues."""
import warnings
warnings.filterwarnings("ignore")
import paramiko, os, io

VM_IP = "34.105.146.38"
VM_USER = "antigravity-ai"
KEY_PATH = r"c:\Users\jonny\Desktop\JonnyAI_JaiOS_4.0\execution\vps_key"
REPO = "/home/antigravity-ai/Antigravity_Orchestra"

SB_URL = "https://lkwydqtfbdjhxaarelaz.supabase.co"
SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxrd3lkcXRmYmRqaHhhYXJlbGF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDI5ODI4MiwiZXhwIjoyMDg1ODc0MjgyfQ.35gJkeetflYO5FYXrjELwikxqFvcScxFCQr5qDD-Z24"
OAI_KEY = "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"

ENV_CONTENT = f"""# Antigravity Cron Env Aliases
SUPABASE_URL={SB_URL}
SUPABASE_KEY={SB_KEY}
SUPABASE_SERVICE_KEY={SB_KEY}
OPENAI_API_KEY={OAI_KEY}
"""

def connect():
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    for kc in [paramiko.Ed25519Key, paramiko.ECDSAKey, paramiko.RSAKey]:
        try:
            k = kc.from_private_key_file(KEY_PATH)
            c.connect(VM_IP, username=VM_USER, pkey=k, timeout=15)
            return c
        except: continue

def run(c, cmd, timeout=30):
    _, out, err = c.exec_command(cmd, timeout=timeout)
    o = out.read().decode().strip()
    if o: print(o)
    return o

def main():
    c = connect()
    print("Connected!")

    # Read current .env
    sftp = c.open_sftp()
    try:
        with sftp.open(f"{REPO}/.env", "r") as f:
            current = f.read().decode("utf-8", errors="ignore")
    except:
        current = ""

    # Remove any old partial aliases, append clean ones
    lines = [l for l in current.split("\n") if not any(
        l.startswith(k) for k in ["SUPABASE_URL=", "SUPABASE_KEY=", "SUPABASE_SERVICE_KEY=",
                                   "OPENAI_API_KEY=", "# Antigravity Cron Env"]
    )]
    new_content = "\n".join(lines).rstrip() + "\n\n" + ENV_CONTENT

    with sftp.open(f"{REPO}/.env", "w") as f:
        f.write(new_content)
    sftp.close()
    print("Wrote .env with aliases!")

    # Verify
    result = run(c, f"cd {REPO} && python3 -c \"from dotenv import load_dotenv; import os; load_dotenv(override=True); sb=os.environ.get('SUPABASE_URL','MISSING'); oai=os.environ.get('OPENAI_API_KEY','MISSING'); print('SB:', sb[:35]); print('OAI:', oai[:20])\"")
    print("Verify:", result)

    c.close()
    print("Done!")

if __name__ == "__main__":
    main()
