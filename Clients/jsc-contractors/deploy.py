import os
import paramiko
import zipfile
import time

# Deployment Configuration
# Deployment Configuration
HOST = '92.112.189.250'
PORT = 65002 # Owen's Port: Shared Hosting standard
USER = 'u384342620'
PASS = 'Aprilia100!69.'
REMOTE_BASE = '/home/u384342620/domains/jsccontractors.co.uk/public_html'
LOCAL_OUT = 'out'
ZIP_NAME = 'deployment_package.zip'

def deploy():
    print('--- Starting ZIP-Based Deployment to Hostinger ---')
    
    # 1. Create ZIP package
    print(f'Compressing {LOCAL_OUT} into {ZIP_NAME}...')
    with zipfile.ZipFile(ZIP_NAME, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(LOCAL_OUT):
            for file in files:
                local_path = os.path.join(root, file)
                rel_path = os.path.relpath(local_path, LOCAL_OUT)
                zipf.write(local_path, rel_path)

    # 2. Upload ZIP with Retry
    max_retries = 3
    for attempt in range(max_retries):
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        try:
            print(f'Connecting to {HOST}:{PORT} (Attempt {attempt + 1}/{max_retries})...')
            ssh.connect(HOST, port=PORT, username=USER, password=PASS, timeout=60)
            sftp = ssh.open_sftp()
            
            print(f'Uploading {ZIP_NAME}...')
            sftp.put(ZIP_NAME, f'{REMOTE_BASE}/{ZIP_NAME}')
            
            # 3. Unzip on server
            print('Extracting package on server...')
            stdin, stdout, stderr = ssh.exec_command(f'cd {REMOTE_BASE} && unzip -o {ZIP_NAME} && rm {ZIP_NAME}')
            # Wait for command to finish
            stdout.channel.recv_exit_status()
            
            # 4. Final Permission Fix
            print('Ensuring permissions...')
            ssh.exec_command(f'find {REMOTE_BASE} -type d -exec chmod 755 {{}} +')
            ssh.exec_command(f'find {REMOTE_BASE} -type f -exec chmod 644 {{}} +')
            
            print('\n--- Deployment Complete ---')
            break # Success
            
        except Exception as e:
            print(f'Error on attempt {attempt + 1}: {e}')
            if attempt == max_retries - 1:
                print('Max retries reached. Deployment failed.')
            else:
                time.sleep(10) # Wait before retry
        finally:
            ssh.close()

    # Cleanup local zip
    if os.path.exists(ZIP_NAME):
        os.remove(ZIP_NAME)

if __name__ == '__main__':
    deploy()
