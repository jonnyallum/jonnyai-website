"""
Ecosystem Sync - Syncs master workspace changes to project ecosystems.
Part of the AgOS 2.0 Ecosystem Creator system.

Usage:
    python sync_ecosystem.py --all              # Sync all ecosystems
    python sync_ecosystem.py --project "Name"   # Sync specific project
    python sync_ecosystem.py --dry-run --all    # Preview changes
"""

import os
import sys
import json
import shutil
from pathlib import Path
from datetime import datetime
import argparse
import filecmp

# Paths
MASTER_WORKSPACE = Path(__file__).parent.parent
CLIENTS_DIR = MASTER_WORKSPACE / "Clients"
ECOSYSTEMS_MANIFEST = MASTER_WORKSPACE / ".agent" / "memory" / "ecosystems.json"

# Files that sync from master (core system files)
SYNC_ITEMS = [
    ".agent/skills",           # Agent definitions
    ".agent/boardroom",        # Meeting protocols
    ".agent/library",          # Shared assets
    "execution",               # Automation scripts
    "docs/BOARDROOM_CULTURE.md",
]

# Files that are project-specific (never sync)
NEVER_SYNC = [
    ".agent/ecosystem-manifest.json",
    ".agent/memory/agent-health.json",
    ".agent/memory/task-history.json",
    "CLAUDE.md",               # May have project customizations
    "AGENTS.md",
    "GEMINI.md",
    ".tmp",
    ".git",
    "src",                     # Project source code
    "app",
    "components",
    "public",
]


def get_ecosystems() -> list:
    """Get list of registered ecosystems."""
    if not ECOSYSTEMS_MANIFEST.exists():
        return []

    try:
        with open(ECOSYSTEMS_MANIFEST) as f:
            registry = json.load(f)
        return registry.get("ecosystems", [])
    except:
        return []


def compare_files(src: Path, dst: Path) -> dict:
    """Compare source and destination files/folders."""
    changes = {
        "new": [],
        "modified": [],
        "deleted": [],
    }

    if not src.exists():
        return changes

    if src.is_file():
        if not dst.exists():
            changes["new"].append(str(src.relative_to(MASTER_WORKSPACE)))
        elif not filecmp.cmp(src, dst, shallow=False):
            changes["modified"].append(str(src.relative_to(MASTER_WORKSPACE)))
    else:
        # Directory comparison
        for src_file in src.rglob("*"):
            if src_file.is_file():
                rel_path = src_file.relative_to(src)
                dst_file = dst / rel_path

                # Skip ignored patterns
                if any(p in str(rel_path) for p in ["__pycache__", ".pyc"]):
                    continue

                if not dst_file.exists():
                    changes["new"].append(str(src_file.relative_to(MASTER_WORKSPACE)))
                elif not filecmp.cmp(src_file, dst_file, shallow=False):
                    changes["modified"].append(str(src_file.relative_to(MASTER_WORKSPACE)))

    return changes


def sync_item(src: Path, dst: Path, dry_run: bool = False) -> dict:
    """Sync a single item from master to project."""
    changes = compare_files(src, dst)

    if dry_run:
        return changes

    if not src.exists():
        return changes

    if src.is_file():
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)
    else:
        # Sync directory
        for src_file in src.rglob("*"):
            if src_file.is_file():
                rel_path = src_file.relative_to(src)
                dst_file = dst / rel_path

                # Skip ignored
                if any(p in str(rel_path) for p in ["__pycache__", ".pyc"]):
                    continue

                dst_file.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(src_file, dst_file)

    return changes


def sync_ecosystem(project_path: Path, dry_run: bool = False) -> dict:
    """
    Sync master changes to a project ecosystem.

    Args:
        project_path: Path to the project
        dry_run: If True, only report what would change

    Returns:
        Dict with sync results
    """
    results = {
        "project": str(project_path),
        "status": "success",
        "new_files": [],
        "modified_files": [],
        "errors": [],
    }

    if not project_path.exists():
        results["status"] = "error"
        results["errors"].append(f"Project not found: {project_path}")
        return results

    print(f"\n{'=' * 50}")
    print(f"Syncing: {project_path.name}")
    print("=" * 50)

    for item in SYNC_ITEMS:
        src = MASTER_WORKSPACE / item
        dst = project_path / item

        print(f"\n  Checking: {item}")

        try:
            changes = sync_item(src, dst, dry_run)

            for f in changes["new"]:
                results["new_files"].append(f)
                print(f"    [NEW] {f}")

            for f in changes["modified"]:
                results["modified_files"].append(f)
                print(f"    [MOD] {f}")

            if not changes["new"] and not changes["modified"]:
                print("    [OK] Up to date")

        except Exception as e:
            results["errors"].append(f"{item}: {str(e)}")
            print(f"    [ERR] {str(e)}")

    # Update sync timestamp
    if not dry_run and not results["errors"]:
        update_sync_timestamp(project_path.name)

    return results


def update_sync_timestamp(project_name: str):
    """Update the last sync timestamp for a project."""
    if not ECOSYSTEMS_MANIFEST.exists():
        return

    try:
        with open(ECOSYSTEMS_MANIFEST) as f:
            registry = json.load(f)

        for eco in registry.get("ecosystems", []):
            if eco["name"] == project_name:
                eco["last_sync"] = datetime.now().strftime("%Y-%m-%d %H:%M")
                break

        with open(ECOSYSTEMS_MANIFEST, 'w') as f:
            json.dump(registry, f, indent=2)
    except:
        pass


def sync_all(dry_run: bool = False) -> list:
    """Sync all registered ecosystems."""
    ecosystems = get_ecosystems()

    if not ecosystems:
        print("No ecosystems registered.")
        print("Use init_workspace.py to create projects.")
        return []

    results = []
    for eco in ecosystems:
        project_path = Path(eco["path"])
        result = sync_ecosystem(project_path, dry_run)
        results.append(result)

    return results


def print_summary(results: list, dry_run: bool):
    """Print sync summary."""
    print("\n" + "=" * 50)
    if dry_run:
        print("SYNC PREVIEW (dry run - no changes made)")
    else:
        print("SYNC SUMMARY")
    print("=" * 50)

    total_new = 0
    total_mod = 0
    total_err = 0

    for r in results:
        status = "OK" if r["status"] == "success" else "ERROR"
        new = len(r["new_files"])
        mod = len(r["modified_files"])
        err = len(r["errors"])

        print(f"\n{Path(r['project']).name}: [{status}]")
        if new:
            print(f"  New files: {new}")
        if mod:
            print(f"  Modified: {mod}")
        if err:
            print(f"  Errors: {err}")
            for e in r["errors"]:
                print(f"    - {e}")

        total_new += new
        total_mod += mod
        total_err += err

    print(f"\n{'=' * 50}")
    print(f"Total: {total_new} new, {total_mod} modified, {total_err} errors")
    print("=" * 50)


def main():
    parser = argparse.ArgumentParser(
        description="Sync AgOS 2.0 master changes to project ecosystems"
    )
    parser.add_argument(
        "--project", "-p",
        help="Sync specific project by name"
    )
    parser.add_argument(
        "--all", "-a",
        action="store_true",
        help="Sync all registered ecosystems"
    )
    parser.add_argument(
        "--dry-run", "-d",
        action="store_true",
        help="Preview changes without applying"
    )

    args = parser.parse_args()

    if args.project:
        # Find project path
        ecosystems = get_ecosystems()
        project = next(
            (e for e in ecosystems if e["name"] == args.project),
            None
        )

        if not project:
            # Try direct path in Clients
            project_path = CLIENTS_DIR / args.project
            if not project_path.exists():
                print(f"Project not found: {args.project}")
                sys.exit(1)
        else:
            project_path = Path(project["path"])

        result = sync_ecosystem(project_path, args.dry_run)
        print_summary([result], args.dry_run)

    elif args.all:
        results = sync_all(args.dry_run)
        print_summary(results, args.dry_run)

    else:
        parser.print_help()
        print("\nRegistered ecosystems:")
        for eco in get_ecosystems():
            print(f"  - {eco['name']} ({eco['type']})")
        sys.exit(1)


if __name__ == "__main__":
    main()
