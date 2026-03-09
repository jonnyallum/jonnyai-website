import warnings; warnings.filterwarnings("ignore")
import paramiko

host = "92.112.189.250"
port = 65002
username = "u384342620"
password = "Aprilia100!69."
remote = "/home/u384342620/domains/blmotorcyclesltd.co.uk/public_html/admin/index.html"

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(host, port=port, username=username, password=password, timeout=30)
sftp = ssh.open_sftp()

with sftp.open(remote, "r") as f:
    content = f.read().decode("utf-8", errors="ignore")

# Find all script src in the HTML
import re
scripts = re.findall(r'src="([^"]+\.js)"', content)
print("Scripts in admin/index.html:")
for s in scripts:
    print(f"  {s}")

# Also find any inline supabase/auth references
for kw in ["supabase", "signIn", "password", "ADMIN_", "cipher", "credential"]:
    idx = content.lower().find(kw.lower())
    if idx > -1:
        print(f"\n[{kw}]: ...{content[max(0,idx-50):idx+200]}...")

sftp.close()
ssh.close()
