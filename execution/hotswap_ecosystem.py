import os
import shutil
import argparse
from pathlib import Path

def hotswap_ecosystem(target_name):
    """
    Hotswaps the root ecosystem configuration (CLAUDE.md, AGENTS.md, GEMINI.md)
    with a specialized variant from the Clients/ directory.
    """
    root_dir = Path("c:/Users/jonny/Desktop/Jonny AI")
    clients_dir = root_dir / "Clients"
    
    # Check if target exists
    target_dir = clients_dir / target_name
    if not target_dir.exists():
        # Try finding by partial name if exact match fails
        matching = [d for d in clients_dir.iterdir() if d.is_dir() and target_name.lower() in d.name.lower()]
        if matching:
            target_dir = matching[0]
            print(f"Found matching ecosystem: {target_dir.name}")
        else:
            print(f"Error: Ecosystem '{target_name}' not found in Clients/")
            return

    # Files to swap
    files_to_swap = ["CLAUDE.md", "AGENTS.md", "GEMINI.md"]
    backup_dir = root_dir / ".agent" / "backups" / "ecosystem_last_swap"
    backup_dir.mkdir(parents=True, exist_ok=True)

    print(f"Activating '{target_dir.name}' ecosystem...")

    for filename in files_to_swap:
        root_file = root_dir / filename
        variant_file = target_dir / filename
        
        if not variant_file.exists():
            print(f"  ! Warning: {filename} not found in variant, skipping.")
            continue

        # Backup current
        if root_file.exists():
            shutil.copy2(root_file, backup_dir / filename)
        
        # Copy new
        shutil.copy2(variant_file, root_file)
        print(f"  + {filename} updated.")

    print(f"Success. The orchestra is now tuned for {target_dir.name}.")
    print("Note: Master Core agents are preserved as they are inherited by the variant config.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="AgOS 2.0 Ecosystem Hotswapper")
    parser.add_argument("target", help="Name of the client ecosystem to activate (e.g. Betting)")
    args = parser.parse_args()
    
    hotswap_ecosystem(args.target)
