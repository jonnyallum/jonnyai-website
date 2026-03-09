import paramiko
import time

HOSTS = ['153.92.11.137', '195.200.9.152', '92.112.189.250']
USERS = ['u384342620', 'u384342620.insydetradar.com']
PASSES = ['Contractors!2025', 'Aprilia100!69.']
PORT = 65002

def test_connection():
    for host in HOSTS:
        for user in USERS:
            for passwd in PASSES:
                ssh = paramiko.SSHClient()
                ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
                try:
                    print(f"Testing {host}:{PORT} | User: {user} | Pass: {passwd}")
                    ssh.connect(host, port=PORT, username=user, password=passwd, timeout=5)
                    print(f"--- SUCCESS! ---")
                    print(f"Host: {host}, User: {user}, Pass: {passwd}")
                    ssh.close()
                    return
                except Exception as e:
                    print(f"Failed: {e}")
                finally:
                    ssh.close()

if __name__ == "__main__":
    test_connection()
