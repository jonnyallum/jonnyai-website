import os
import paramiko
import zipfile
import time
from pathlib import Path

# Deployment Configuration
HOST = '92.112.189.250'
PORT = 65002
USER = 'u384342620'
PASS = 'Aprilia100!69.'
REMOTE_BASE = '/home/u384342620/domains/jsccontractors.co.uk/public_html'
LOCAL_OUT = 'out'
ZIP_NAME = 'jsc_god_tier_deploy.zip'

def deploy():
    print('--- Starting God-Tier Deployment to Hostinger (JSC) ---')
    
    # Absolute paths
    base_dir = Path(__file__).parent
    local_out_path = base_dir / LOCAL_OUT
    zip_path = base_dir / ZIP_NAME

    # 1. Create ZIP package
    print(f'Compressing {local_out_path} into {zip_path}...')
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(local_out_path):
            for file in files:
                local_file_path = os.path.join(root, file)
                rel_path = os.path.relpath(local_file_path, local_out_path)
                zipf.write(local_file_path, rel_path)

    # 2. Upload and Extract
    max_retries = 3
    for attempt in range(max_retries):
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        try:
            print(f'Connecting to {HOST}:{PORT} (Attempt {attempt + 1}/{max_retries})...')
            ssh.connect(HOST, port=PORT, username=USER, password=PASS, timeout=60)
            
            sftp = ssh.open_sftp()
            
            print(f'Uploading {ZIP_NAME}...')
            sftp.put(str(zip_path), f'{REMOTE_BASE}/{ZIP_NAME}')
            sftp.close()

            # 3. Clean and Unzip on server
            print('Cleaning remote directory and extracting package...')
            # NOTE: We be careful not to delete .htaccess if it's managed by Hostinger, 
            # but usually public_html on a static site needs a full refreshing.
            # We will wipe most things then unzip.
            ssh.exec_command(f'cd {REMOTE_BASE} && find . -maxdepth 1 ! -name ".htaccess" ! -name "{ZIP_NAME}" ! -name "." -exec rm -rf {{}} +')
            
            print('Extracting...')
            stdin, stdout, stderr = ssh.exec_command(f'cd {REMOTE_BASE} && unzip -o {ZIP_NAME} && rm {ZIP_NAME}')
            stdout.channel.recv_exit_status()
            
            # 4. Permissions
            print('Finalizing permissions...')
            ssh.exec_command(f'find {REMOTE_BASE} -type d -exec chmod 755 {{}} +')
            ssh.exec_command(f'find {REMOTE_BASE} -type f -exec chmod 644 {{}} +')
            
            print('\n--- God-Tier Deployment Complete: https://jsccontractors.co.uk ---')
            break
            
        except Exception as e:
            print(f'Error: {e}')
            if attempt < max_retries - 1:
                time.sleep(5)
            else:
                print('Deployment failed after retries.')
        finally:
            ssh.close()

    # Cleanup
    if zip_path.exists():
        os.remove(zip_path)

if __name__ == '__main__':
    deploy()
