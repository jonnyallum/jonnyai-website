import warnings
warnings.filterwarnings("ignore")
import paramiko, sys, os

VM_IP = "34.105.146.38"
VM_USER = "antigravity-ai"
KEY_PATH = r"c:\Users\jonny\Desktop\JonnyAI_JaiOS_4.0\execution\vps_key"
LOCAL_EXEC = r"c:\Users\jonny\Desktop\JonnyAI_JaiOS_4.0\execution"
REMOTE_EXEC = "/home/antigravity-ai/Antigravity_Orchestra/execution"

ORDER_SERVICE = "[Unit]\nDescription=BL Motorcycles eBay Order Processor\nAfter=network.target\n\n[Service]\nType=oneshot\nUser=antigravity-ai\nWorkingDirectory=/home/antigravity-ai/Antigravity_Orchestra\nEnvironmentFile=/home/antigravity-ai/Antigravity_Orchestra/.env\nExecStart=/usr/bin/python3 execution/process_orders.py\nStandardOutput=journal\nStandardError=journal\n\n[Install]\nWantedBy=multi-user.target\n"
ORDER_TIMER = "[Unit]\nDescription=Run BL Order Processor every 10 minutes\n\n[Timer]\nOnBootSec=3min\nOnUnitActiveSec=10min\nUnit=bl-order-processor.service\n\n[Install]\nWantedBy=timers.target\n"

def connect():
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    for kc in [paramiko.Ed25519Key, paramiko.ECDSAKey, paramiko.RSAKey]:
        try:
            k = kc.from_private_key_file(KEY_PATH)
            c.connect(VM_IP, username=VM_USER, pkey=k, timeout=15)
            return c
        except: continue
    c.connect(VM_IP, username=VM_USER, key_filename=KEY_PATH, timeout=15)
    return c

def run(c, cmd, label="", timeout=60):
    if label: print("\n=== " + label + " ===")
    _, out, err = c.exec_command(cmd, timeout=timeout)
    o = out.read().decode().strip()
    e = err.read().decode().strip()
    if o: print(o)
    if e: print("ERR: " + e[:200])
    return o

def main():
    print("Connecting...")
    c = connect()
    print("Connected!")

    # Upload key scripts via SFTP
    sftp = c.open_sftp()
    scripts = ["process_orders.py", "ebay_order_poller.py", "bikeit_order_bot.py", "cmpo_order_bot.py"]
    for s in scripts:
        lp = os.path.join(LOCAL_EXEC, s)
        rp = REMOTE_EXEC + "/" + s
        if os.path.exists(lp):
            sftp.put(lp, rp)
            print("Uploaded: " + s)
        else:
            print("Missing locally: " + s)
    sftp.close()

    # Verify upload
    run(c, "ls " + REMOTE_EXEC + " | grep -E '(process_orders|ebay_order)'", "Verify upload")

    # Write and install systemd files
    run(c, "printf '%s' '" + ORDER_SERVICE.replace("'", "") + "' > /tmp/bl-order-processor.service", "Write service")
    run(c, "printf '%s' '" + ORDER_TIMER.replace("'", "") + "' > /tmp/bl-order-processor.timer", "Write timer")
    run(c, "sudo cp /tmp/bl-order-processor.service /etc/systemd/system/bl-order-processor.service")
    run(c, "sudo cp /tmp/bl-order-processor.timer /etc/systemd/system/bl-order-processor.timer")
    run(c, "sudo systemctl daemon-reload", "Daemon reload")
    run(c, "sudo systemctl enable --now bl-order-processor.timer", "Enable timer")

    # Final status
    run(c, "systemctl list-timers bl-* --no-pager 2>&1", "All BL timers")

    c.close()
    print("\nDeployment complete!")

if __name__ == "__main__":
    main()
