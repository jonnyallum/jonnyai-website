import os
import paramiko
from pathlib import Path

def deploy_bl():
    host = "92.112.189.250"
    port = 65002
    username = "u384342620"
    password = "Aprilia100!69."
    local_dir = r"c:\Users\jonny\Desktop\JonnyAI_JaiOS_4.0\Clients\BL-Motorcycles-Enterprise\website\out"
    remote_dir = "/home/u384342620/domains/blmotorcyclesltd.co.uk/public_html"

    print(f"Connecting to {host}:{port} for BL Motorcycles...")

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    try:
        ssh.connect(host, port=port, username=username, password=password, timeout=60)
        print("Connected successfully!")

        sftp = ssh.open_sftp()
        print(f"Remote path: {remote_dir}")

        uploaded = 0

        def upload_directory(local_dir_path, remote_dir_path):
            nonlocal uploaded
            try:
                sftp.stat(remote_dir_path)
            except FileNotFoundError:
                print(f"Creating remote dir: {remote_dir_path}")
                sftp.mkdir(remote_dir_path)

            for item in os.listdir(local_dir_path):
                local_item = os.path.join(local_dir_path, item)
                remote_item = f"{remote_dir_path}/{item}"

                if os.path.isfile(local_item):
                    print(f"  Uploading: {item}")
                    sftp.put(local_item, remote_item)
                    uploaded += 1
                elif os.path.isdir(local_item):
                    upload_directory(local_item, remote_item)

        # We won't clear the whole folder to be safe, just push
        print(f"Uploading files from {local_dir}...")
        upload_directory(local_dir, remote_dir)

        print(f"\nDeployed {uploaded} files successfully!")
        sftp.close()
        ssh.close()
        return True

    except Exception as e:
        print(f"Deployment failed: {e}")
        return False

if __name__ == "__main__":
    deploy_bl()
