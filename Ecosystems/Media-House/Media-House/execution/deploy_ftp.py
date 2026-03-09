
import os
import sys
import ftplib
from ftplib import FTP, error_perm

def upload_directory(ftp, local_path, remote_path):
    """
    Recursively upload a directory to the FTP server.
    """
    print(f"Entering directory: {local_path} -> {remote_path}")
    
    # Try to create the remote directory if it doesn't exist
    try:
        ftp.mkd(remote_path)
        print(f"Created remote directory: {remote_path}")
    except error_perm as e:
        # Ignore "directory already exists" errors
        if not str(e).startswith('550'):
             print(f"Warning: Could not create directory {remote_path}: {e}")

    # Enter the directory
    try:
        ftp.cwd(remote_path)
    except error_perm as e:
        print(f"Error changing to directory {remote_path}: {e}")
        return

    # Upload files and recursion
    for item in os.listdir(local_path):
        local_item_path = os.path.join(local_path, item)
        
        if os.path.isfile(local_item_path):
            print(f"Uploading file: {item}")
            try:
                with open(local_item_path, 'rb') as f:
                    ftp.storbinary(f'STOR {item}', f)
            except Exception as e:
                print(f"Failed to upload {item}: {e}")
        elif os.path.isdir(local_item_path):
            # Recurse
            upload_directory(ftp, local_item_path, item)
            # Go back up
            ftp.cwd('..')

def deploy(host, user, passwd, local_dir, remote_dir):
    try:
        print(f"Connecting to {host}...")
        ftp = FTP(host)
        ftp.login(user=user, passwd=passwd)
        print("Connected and logged in.")
        
        # Navigate to the target root directory
        try:
            ftp.cwd(remote_dir)
            print(f"Changed to remote root: {remote_dir}")
        except error_perm as e:
            print(f"Could not verify remote root {remote_dir}, attempting to create or defaulting to root.")
            pass 
        
        # Now loop through local items and upload them
        for item in os.listdir(local_dir):
            local_item_path = os.path.join(local_dir, item)
            if os.path.isfile(local_item_path):
                print(f"Uploading root file: {item}")
                with open(local_item_path, 'rb') as f:
                    ftp.storbinary(f'STOR {item}', f)
            elif os.path.isdir(local_item_path):
                # For directories, we call the recursive function
                upload_directory(ftp, local_item_path, item)
                ftp.cwd('..') # Return to root after directory upload
                
        ftp.quit()
        print("Deployment complete.")

    except Exception as e:
        print(f"Deployment failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 6:
        print("Usage: python deploy_ftp.py <host> <user> <pass> <local_dir> <remote_dir>")
        sys.exit(1)
    
    host = sys.argv[1]
    user = sys.argv[2]
    passwd = sys.argv[3]
    local_dir = sys.argv[4]
    remote_dir = sys.argv[5]
    
    deploy(host, user, passwd, local_dir, remote_dir)
