
import subprocess
import os
import sys

def generate_key():
    key_path = os.path.abspath("hostinger_deploy_key")
    if os.path.exists(key_path):
        os.remove(key_path)
    if os.path.exists(key_path + ".pub"):
        os.remove(key_path + ".pub")

    cmd = ["ssh-keygen", "-t", "ed25519", "-f", key_path, "-N", ""]
    
    print(f"Running: {' '.join(cmd)}")
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    if result.returncode == 0:
        print("Success!")
        print(result.stdout)
    else:
        print("Error!")
        print(result.stderr)

if __name__ == "__main__":
    generate_key()
