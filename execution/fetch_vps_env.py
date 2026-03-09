import subprocess

def fetch_env():
    cmd = ['python', 'execution/ssh_to_vps.py', 'cat ~/branding-crm/.env']
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode == 0:
        with open('tmp_vps_env.txt', 'w', encoding='utf-8') as f:
            f.write(result.stdout)
        print("Successfully fetched.")
    else:
        print("Error:")
        print(result.stderr)
        
fetch_env()
