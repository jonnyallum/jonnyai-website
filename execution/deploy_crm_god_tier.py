import os
import subprocess
import time
from pathlib import Path

# --- CONFIG ---
PROJECT_NAME = "twenty-crm"
LOCAL_REPO_DIR = r"c:\Users\jonny\Desktop\JonnyAI_JaiOS_4.0\Clients\twenty-crm"
VPS_IP = "34.105.146.38"
VPS_USER = "antigravity-ai"
SSH_KEY_PATH = r"c:\Users\jonny\Desktop\JonnyAI_JaiOS_4.0\execution\vps_key"
REMOTE_DEPLOY_DIR = "~/branding-crm"

def run_command(cmd, cwd=None):
    print(f"Executing: {cmd}")
    return subprocess.run(cmd, shell=True, cwd=cwd)

def deploy():
    print("🚀 STARTING GOD-TIER CRM DEPLOYMENT...")

    # 1. Package Source (ZIP or TAR)
    # Exclude node_modules, .git, etc.
    print("📦 Bundling branded source code...")
    bundle_path = Path("crm_deploy.tar.gz").absolute()
    # Using tar (available in bash/powershell usually)
    # We must ensure we are in the local repo dir or use -C
    tar_cmd = f"tar --exclude='node_modules' --exclude='.git' --exclude='packages/twenty-front/node_modules' -czf {bundle_path} ."
    run_command(tar_cmd, cwd=LOCAL_REPO_DIR)

    # 2. Upload to VPS
    print("📡 Uploading to VPS...")
    # Create dir first
    run_command(f'python execution/ssh_to_vps.py "mkdir -p {REMOTE_DEPLOY_DIR}"')
    
    # Use scp for the large bundle
    # Note: scp on windows might need full path to binary or use python libs
    # I'll try calling scp directly
    scp_cmd = f'scp -i "{SSH_KEY_PATH}" -o StrictHostKeyChecking=no "{bundle_path}" {VPS_USER}@{VPS_IP}:{REMOTE_DEPLOY_DIR}/'
    run_command(scp_cmd)

    # 3. Remote Extraction & Setup
    print("🔧 Extracting and setting up environment...")
    remote_cmds = [
        f"cd {REMOTE_DEPLOY_DIR} && tar -xzf crm_deploy.tar.gz",
        f"cp {REMOTE_DEPLOY_DIR}/packages/twenty-server/.env {REMOTE_DEPLOY_DIR}/.env",
    ]
    for cmd in remote_cmds:
        run_command(f'python execution/ssh_to_vps.py "{cmd}"')

    # 4. Launch Docker Stack
    print("🐳 Launching Docker stack...")
    # Trigger docker-compose
    launch_cmd = f'python execution/ssh_to_vps.py "cd {REMOTE_DEPLOY_DIR} && docker compose -f packages/twenty-docker/docker-compose.yml up -d"'
    run_command(launch_cmd)

    print("✅ DEPLOYMENT SEQUENCE INITIATED.")
    print("🌎 CRM will be available at https://crm.jonnyai.co.uk shortly (pending build/startup).")

if __name__ == "__main__":
    deploy()
