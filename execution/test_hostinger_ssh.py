
import paramiko
import os
from dotenv import load_dotenv

def test_ssh_connection():
    host = "92.112.189.250"
    port = 65002
    username = "u384342620"
    password = "Aprilia100!69."

    print(f"Connecting to {host}:{port} as {username}...")
    
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(host, port=port, username=username, password=password)
        
        print("Connected successfully. Listing root directory...")
        with open("ssh_results.txt", "w") as f_out:
            def run_cmd(cmd):
                f_out.write(f"\nExecuting: {cmd}\n")
                stdin, stdout, stderr = ssh.exec_command(cmd)
                out = stdout.read().decode()
                err = stderr.read().decode()
                if out: f_out.write(f"STDOUT:\n{out}\n")
                if err: f_out.write(f"STDERR:\n{err}\n")

            run_cmd("cat domains/insydetradar.com/index.html")
            run_cmd("cat public_html/index.html")
        ssh.close()
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    test_ssh_connection()
