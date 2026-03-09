import subprocess

env_append = """
# -- Added for Full Wiring --

# Resend Mail Settings
EMAIL_SYSTEM_ADDRESS=system@jonnyai.co.uk
EMAIL_FROM_ADDRESS=crm@jonnyai.co.uk
EMAIL_FROM_NAME='Jonny AI CRM'
EMAIL_DRIVER=SMTP
EMAIL_SMTP_HOST=smtp.resend.com
EMAIL_SMTP_PORT=465
EMAIL_SMTP_USER=resend
EMAIL_SMTP_PASSWORD=re_ikc6Lxw5_Nas1LoakZvaGN1oybWkAQQAg
EMAIL_SMTP_SECURE=true

# Google Auth (for Users logging in via SSO)
AUTH_GOOGLE_ENABLED=true
AUTH_GOOGLE_CLIENT_ID=619376892953-baso4q45trisvjebtjisvh7gr4dgp1le.apps.googleusercontent.com
AUTH_GOOGLE_CLIENT_SECRET=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
AUTH_GOOGLE_CALLBACK_URL=https://crm.jonnyai.co.uk/auth/google/callback

# Google APIs (for Syncing Calendar & Emails)
CONNECTED_ACCOUNT_GOOGLE_ENABLED=true
CONNECT_GOOGLE_CLIENT_ID=619376892953-baso4q45trisvjebtjisvh7gr4dgp1le.apps.googleusercontent.com
CONNECT_GOOGLE_CLIENT_SECRET=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
"""

with open("append_env.txt", "w") as f:
    f.write(env_append)

def run_cmd(cmd_list):
    result = subprocess.run(cmd_list, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error running: {' '.join(cmd_list)}")
        print(result.stderr)
    return result

# Scp the file over
print("Copying to VPS...")
run_cmd(['scp', '-i', 'execution/vps_key', '-o', 'StrictHostKeyChecking=no', 'append_env.txt', 'antigravity-ai@34.105.146.38:~/append_env.txt'])

# Append to .env and restart
print("Appending and restarting...")
cmd = ['python', 'execution/ssh_to_vps.py', "cat ~/append_env.txt >> ~/branding-crm/.env && cd ~/branding-crm && docker compose restart server worker"]
res = run_cmd(cmd)
print("Done.")
print(res.stdout)
print(res.stderr)
