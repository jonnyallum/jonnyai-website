"""
Deploy fresh Next.js build of BL Motorcycles website to Hostinger FTP.
Uploads the full out/ directory to public_html/.
"""

import ftplib
import os
from pathlib import Path

FTP_HOST = "92.112.189.250"
FTP_PORT = 21
FTP_USER = "u384342620"
FTP_PASS = "Aprilia100!69."
REMOTE_BASE = ""  # FTP root IS public_html — deploy directly here

LOCAL_DIR = Path(r"C:\Users\jonny\Desktop\JonnyAI_JaiOS_4.0\Clients\BL Motorcycles ltd\BL-Motorcycles-Enterprise\website\out")


def ensure_remote_dir(ftp, remote_path):
    try:
        ftp.mkd(remote_path)
    except ftplib.error_perm:
        pass  # already exists


def upload_dir(ftp, local_path: Path, remote_path: str, depth: int = 0):
    if remote_path:
        ensure_remote_dir(ftp, remote_path)
    count = 0
    for item in sorted(local_path.iterdir()):
        remote_item = f"{remote_path}/{item.name}" if remote_path else item.name
        if item.is_dir():
            count += upload_dir(ftp, item, remote_item, depth + 1)
        else:
            with open(item, "rb") as f:
                ftp.storbinary(f"STOR {remote_item}", f)
            count += 1
            if depth == 0:
                print(f"  {item.name}")
    return count


def main():
    print(f"Connecting to {FTP_HOST}:{FTP_PORT}...")
    with ftplib.FTP() as ftp:
        ftp.connect(FTP_HOST, FTP_PORT, timeout=30)
        ftp.login(FTP_USER, FTP_PASS)
        ftp.set_pasv(True)
        print(f"Logged in. FTP root: {ftp.pwd()}\n")
        print(f"Deploying fresh Next.js build to /{REMOTE_BASE}/...\n")
        total = upload_dir(ftp, LOCAL_DIR, REMOTE_BASE)
        print(f"\nDone. {total} files uploaded.")

    print("Site live at blmotorcyclesltd.co.uk")


if __name__ == "__main__":
    main()
