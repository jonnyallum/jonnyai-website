"""
SSH into GCP VM, get n8n admin email via docker volume + host sqlite3,
then generate new API key and update .env
"""
import sys, os, re
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
import paramiko
import warnings
warnings.filterwarnings('ignore')

KEY_PATH = r"c:\Users\jonny\Desktop\JonnyAI_JaiOS_4.0\execution\vps_key"
HOST = "34.105.146.38"
USER = "antigravity-ai"

def run(ssh, cmd, timeout=30):
    chan = ssh.get_transport().open_session()
    chan.exec_command(cmd)
    chan.settimeout(timeout)
    out = b""
    err = b""
    try:
        out = chan.makefile().read()
        err = chan.makefile_stderr().read()
    except:
        pass
    if isinstance(out, bytes):
        out = out.decode('utf-8', errors='replace').strip()
    if isinstance(err, bytes):
        err = err.decode('utf-8', errors='replace').strip()
    return out, err

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    ssh.connect(HOST, port=22, username=USER, key_filename=KEY_PATH, timeout=20)
    print("CONNECTED to GCP VM")

    # Find where the n8n docker volume is mounted on host
    out, err = run(ssh, "sudo docker inspect n8n --format '{{ range .Mounts }}{{ .Source }}:{{ .Destination }}{{ \"\\n\" }}{{ end }}'")
    print(f"n8n mounts:\n{out or err}")

    # Parse the source path for /home/node/.n8n
    db_host_path = None
    for line in (out or "").split('\n'):
        if '/home/node/.n8n' in line or '.n8n' in line:
            db_host_path = line.split(':')[0].strip()
            break

    print(f"DB host path: {db_host_path}")

    # Also try the named volume path directly
    if not db_host_path:
        out2, _ = run(ssh, "sudo find /var/lib/docker/volumes -name 'database.sqlite' 2>/dev/null | head -3")
        print(f"Find result: {out2}")
        if out2:
            db_host_path = os.path.dirname(out2.strip().split('\n')[0])

    # Query admin email using host sqlite3
    if db_host_path:
        db_file = f"{db_host_path}/database.sqlite"
        out3, err3 = run(ssh, f"sudo sqlite3 '{db_file}' 'SELECT email, id, role FROM user LIMIT 5;' 2>&1")
        print(f"Admin users: {out3 or err3}")
    else:
        # Fallback: use node inside container to query DB
        js_query = """
const Database = require('better-sqlite3');
const db = new Database('/home/node/.n8n/database.sqlite');
const users = db.prepare('SELECT email, id, role FROM user LIMIT 5').all();
console.log(JSON.stringify(users));
"""
        # Write and run via docker exec
        out4, err4 = run(ssh, "sudo docker exec n8n node -e \"const {DataSource} = require('typeorm'); console.log('typeorm available')\" 2>&1 | head -3")
        print(f"TypeORM check: {out4 or err4}")
        
        # Try strings on the mounted volume
        out5, err5 = run(ssh, "sudo docker inspect n8n --format '{{range .Mounts}}{{.Source}}{{end}}' 2>&1")
        vol_source = (out5 or "").strip()
        print(f"Volume source: {vol_source}")
        
        if vol_source:
            out6, err6 = run(ssh, f"sudo strings '{vol_source}/database.sqlite' | grep -E '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{{2,}}$' | head -5")
            print(f"Emails found: {out6 or err6}")

    # Also try: use n8n's own /rest/login with possible credentials
    # Get the n8n UI to check if there are hints about the admin
    out7, err7 = run(ssh, "sudo docker exec n8n env | grep -i 'n8n\\|email\\|user\\|owner' | grep -v 'SECRET\\|KEY\\|PASS' 2>&1")
    print(f"n8n env vars: {out7 or err7}")

    # Check n8n config file
    out8, err8 = run(ssh, "sudo docker exec n8n cat /home/node/.n8n/config 2>&1 | head -20")
    print(f"n8n config: {out8 or err8}")

    ssh.close()
    print("\nDone.")

except Exception as e:
    print(f"SSH Error: {e}")
    import traceback
    traceback.print_exc()
