
import os
import shutil
from pathlib import Path
from datetime import datetime, timedelta

# Configuration
ROOT_DIR = Path(__file__).parent.parent
TMP_DIR = ROOT_DIR / ".tmp"
CACHE_PATTERNS = ["__pycache__", "*.pyc", "*.pyo"]
GHOST_FILES = ["nul", "con", "prn", "aux"] # Windows reserved names that break things

def purge_cache():
    print("Purging Python cache...")
    count = 0
    for p in ROOT_DIR.rglob("__pycache__"):
        if p.is_dir():
            shutil.rmtree(p)
            count += 1
    
    for ext in ["*.pyc", "*.pyo"]:
        for p in ROOT_DIR.rglob(ext):
            p.unlink()
            count += 1
    print(f"Removed {count} cache items.")

def purge_ghosts():
    print("Searching for ghost files (Windows reserved names)...")
    count = 0
    # Walk carefully to find files named 'nul' etc.
    for root, dirs, files in os.walk(ROOT_DIR):
        for f in files:
            if f.lower() in GHOST_FILES:
                path = Path(root) / f
                try:
                    # Using OS-level remove to handle tricky names
                    os.remove(str(path))
                    print(f"  [DELETED] {path}")
                    count += 1
                except Exception as e:
                    print(f"  [FAILED] {path}: {e}")
    print(f"Purged {count} ghost files.")

def purge_stale_tmp():
    print("Cleaning stale artifacts from .tmp...")
    if not TMP_DIR.exists():
        return
    
    count = 0
    cutoff = datetime.now() - timedelta(hours=24)
    
    for p in TMP_DIR.iterdir():
        if p.is_file():
            # Don't delete handoff messages
            if p.name.startswith("message4"):
                continue
                
            mtime = datetime.fromtimestamp(p.stat().st_mtime)
            if mtime < cutoff:
                p.unlink()
                count += 1
    print(f"Removed {count} stale tmp files.")

def purge_placeholders():
    """Identifies and removes known placeholder file names in client projects."""
    print("Scanning client directories for placeholders...")
    placeholder_names = ["placeholder.png", "temp-hero.jpg", "dummy.png", "test.jpg"]
    count = 0
    
    clients_dir = ROOT_DIR / "Clients"
    if not clients_dir.exists():
        return

    for root, dirs, files in os.walk(clients_dir):
        for f in files:
            if f.lower() in placeholder_names:
                path = Path(root) / f
                print(f"  [FOUND PLACEHOLDER] {path}")
                # For safety, we only report placeholders unless --force is used
                # In this case, we'll just log them.
                # os.remove(str(path))
                # count += 1
    
    print("Placeholder scan complete. (Manual deletion recommended for safety).")

if __name__ == "__main__":
    print(f"--- AgOS 3.0 REDUNDANCY PURGE ---")
    purge_cache()
    purge_ghosts()
    purge_stale_tmp()
    purge_placeholders()
    print("Purge complete.")
