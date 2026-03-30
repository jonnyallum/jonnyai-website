"""
BL Motorcycles website rollback — uploads backup public_html to Hostinger FTP.
Restores the working Vite/React site from the 01/03/26 snapshot.
"""

import ftplib
import os
from pathlib import Path

FTP_HOST = "92.112.189.250"
FTP_PORT = 21
FTP_USER = "u384342620"
FTP_PASS = "Aprilia100!69."
REMOTE_BASE = "public_html"

LOCAL_DIR = Path(r"C:\Users\jonny\Desktop\JonnyAI_JaiOS_4.0\Clients\BL Motorcycles ltd\blwebsite as of 010326\public_html")


def ensure_remote_dir(ftp, remote_path):
    """Create remote directory if it doesn't exist."""
    try:
        ftp.mkd(remote_path)
        print(f"  Created dir: {remote_path}")
    except ftplib.error_perm:
        pass  # already exists


def upload_dir(ftp, local_path: Path, remote_path: str):
    """Recursively upload a local directory using pure path strings (no cwd)."""
    ensure_remote_dir(ftp, remote_path)

    for item in local_path.iterdir():
        if item.name.startswith("."):
            continue  # skip .gitkeep etc.

        remote_item = f"{remote_path}/{item.name}"

        if item.is_dir():
            upload_dir(ftp, item, remote_item)
        else:
            with open(item, "rb") as f:
                ftp.storbinary(f"STOR {remote_item}", f)
            print(f"  Uploaded: {remote_item}")


def main():
    print(f"Connecting to {FTP_HOST}:{FTP_PORT}...")
    with ftplib.FTP() as ftp:
        ftp.connect(FTP_HOST, FTP_PORT, timeout=30)
        ftp.login(FTP_USER, FTP_PASS)
        ftp.set_pasv(True)
        print(f"Logged in as {FTP_USER}")
        print(f"FTP root: {ftp.pwd()}")

        print(f"\nUploading backup to /{REMOTE_BASE}/...\n")
        upload_dir(ftp, LOCAL_DIR, REMOTE_BASE)

    print("\nDone. Site should be restored at blmotorcyclesltd.co.uk")


if __name__ == "__main__":
    main()
