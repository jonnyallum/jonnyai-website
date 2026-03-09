"""
Project Workspace Initializer - Creates new project workspaces from master template.
Part of the AgOS 2.0 Ecosystem Creator system.

Usage:
    python init_workspace.py --name "ProjectName" [--type saas|ecommerce|trading|content|agency]
    python init_workspace.py --list
"""

import os
import sys
import shutil
import json
from pathlib import Path
from datetime import datetime
import argparse

# Paths
MASTER_WORKSPACE = Path(__file__).parent.parent
CLIENTS_DIR = MASTER_WORKSPACE / "Clients"
ECOSYSTEMS_MANIFEST = MASTER_WORKSPACE / ".agent" / "memory" / "ecosystems.json"

# Files/folders to ALWAYS copy
CORE_STRUCTURE = [
    ".agent/skills",
    ".agent/boardroom",
    ".agent/memory/FEEDBACK_PROTOCOL.md",
    ".agent/library",
    "execution",
    "docs/BOARDROOM_CULTURE.md",
    "CLAUDE.md",
    "AGENTS.md",
    "GEMINI.md",
]

# Files/folders to EXCLUDE
EXCLUDE_PATTERNS = [
    "Clients",
    ".git",
    "__pycache__",
    "*.pyc",
    ".tmp",
    "node_modules",
    ".next",
    ".vercel",
    ".env*",
    "*.log",
]

# Project type configurations
PROJECT_TYPES = {
    "agency": {
        "description": "Full agency with all agents active",
        "active_agents": "all",
        "exclude_agents": [],
    },
    "saas": {
        "description": "SaaS platform with user auth, subscriptions, analytics",
        "active_agents": [
            "conductor", "jonny-ai", "datastore", "sentinel", "metric",
            "forge", "autoflow", "devops", "vaultguard", "helpline",
            "archivist", "echo", "pixel", "deploy"
        ],
        "exclude_agents": ["clippers", "warehouse", "delboy"],
    },
    "ecommerce": {
        "description": "E-commerce with products, payments, fulfillment",
        "active_agents": [
            "conductor", "jonny-ai", "datastore", "warehouse", "forge",
            "pixel", "goldie", "echo", "helpline", "sentinel",
            "vaultguard", "metric", "deploy", "archivist"
        ],
        "exclude_agents": ["delboy", "clippers"],
    },
    "trading": {
        "description": "Trading system with risk management and backtesting",
        "active_agents": [
            "conductor", "jonny-ai", "delboy", "datastore", "metric",
            "vaultguard", "sentinel", "autoflow", "archivist"
        ],
        "exclude_agents": ["warehouse", "clippers", "goldie", "echo", "pixel"],
    },
    "content": {
        "description": "Content platform with SEO, social, viral optimization",
        "active_agents": [
            "conductor", "jonny-ai", "echo", "goldie", "clippers",
            "scout", "pixel", "metric", "archivist", "sentinel", "deploy"
        ],
        "exclude_agents": ["warehouse", "delboy", "forge"],
    },
}


def should_exclude(path: Path) -> bool:
    """Check if a path should be excluded from copy."""
    path_str = str(path)
    for pattern in EXCLUDE_PATTERNS:
        if pattern.startswith("*"):
            if path_str.endswith(pattern[1:]):
                return True
        elif pattern in path_str:
            return True
    return False


def copy_structure(src: Path, dst: Path):
    """Copy master structure to new project."""
    print(f"Copying master structure to {dst}...")

    # Create destination
    dst.mkdir(parents=True, exist_ok=True)

    for item in CORE_STRUCTURE:
        src_path = src / item
        dst_path = dst / item

        if not src_path.exists():
            print(f"  [SKIP] {item} (not found)")
            continue

        if src_path.is_file():
            dst_path.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src_path, dst_path)
            print(f"  [FILE] {item}")
        else:
            if dst_path.exists():
                shutil.rmtree(dst_path)
            shutil.copytree(
                src_path, dst_path,
                ignore=shutil.ignore_patterns(*EXCLUDE_PATTERNS)
            )
            print(f"  [DIR]  {item}")


def create_project_config(dst: Path, name: str, project_type: str):
    """Create project-specific configuration."""
    config = PROJECT_TYPES.get(project_type, PROJECT_TYPES["agency"])

    # Create project manifest
    manifest = {
        "ecosystem": {
            "name": f"{name} Ecosystem",
            "derived_from": "AgOS 2.0 Master",
            "master_version": "2.0.0",
            "created": datetime.now().strftime("%Y-%m-%d %H:%M"),
            "project_type": project_type,
            "agents": {
                "active": config["active_agents"],
                "dormant": config["exclude_agents"],
                "customized": []
            },
            "customizations": [],
            "notes": f"Auto-generated {project_type} ecosystem"
        }
    }

    manifest_path = dst / ".agent" / "ecosystem-manifest.json"
    manifest_path.parent.mkdir(parents=True, exist_ok=True)

    with open(manifest_path, 'w') as f:
        json.dump(manifest, f, indent=2)

    print(f"  [CONFIG] Created ecosystem manifest")


def update_master_registry(name: str, path: Path, project_type: str):
    """Register the new ecosystem in master registry."""
    registry = {"ecosystems": []}

    if ECOSYSTEMS_MANIFEST.exists():
        try:
            with open(ECOSYSTEMS_MANIFEST) as f:
                registry = json.load(f)
        except:
            pass

    # Add new ecosystem
    registry["ecosystems"].append({
        "name": name,
        "path": str(path),
        "type": project_type,
        "created": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "last_sync": None
    })

    ECOSYSTEMS_MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    with open(ECOSYSTEMS_MANIFEST, 'w') as f:
        json.dump(registry, f, indent=2)

    print(f"  [REGISTRY] Added to ecosystem registry")


def list_ecosystems():
    """List all registered ecosystems."""
    if not ECOSYSTEMS_MANIFEST.exists():
        print("No ecosystems registered yet.")
        return

    with open(ECOSYSTEMS_MANIFEST) as f:
        registry = json.load(f)

    print("\n" + "=" * 60)
    print("REGISTERED ECOSYSTEMS")
    print("=" * 60)

    for eco in registry.get("ecosystems", []):
        print(f"\n{eco['name']}")
        print(f"  Path: {eco['path']}")
        print(f"  Type: {eco['type']}")
        print(f"  Created: {eco['created']}")
        print(f"  Last Sync: {eco.get('last_sync', 'Never')}")

    print("\n" + "=" * 60)


def init_workspace(name: str, project_type: str = "agency") -> bool:
    """
    Initialize a new project workspace from master.

    Args:
        name: Project name (becomes folder name)
        project_type: Type of project (saas, ecommerce, trading, content, agency)

    Returns:
        True if successful
    """
    print(f"\nAgOS 2.0 - Ecosystem Creator")
    print("=" * 40)
    print(f"Project: {name}")
    print(f"Type: {project_type}")
    print("=" * 40)

    # Validate project type
    if project_type not in PROJECT_TYPES:
        print(f"\nError: Unknown project type '{project_type}'")
        print(f"Available types: {', '.join(PROJECT_TYPES.keys())}")
        return False

    # Create project path
    project_path = CLIENTS_DIR / name

    if project_path.exists():
        print(f"\nError: Project already exists at {project_path}")
        print("Use sync_ecosystem.py to update existing projects.")
        return False

    # Copy master structure
    copy_structure(MASTER_WORKSPACE, project_path)

    # Create project-specific config
    create_project_config(project_path, name, project_type)

    # Register in master
    update_master_registry(name, project_path, project_type)

    # Create .tmp folder for project
    (project_path / ".tmp").mkdir(exist_ok=True)

    print(f"\n{'=' * 40}")
    print(f"SUCCESS: Workspace created at:")
    print(f"  {project_path}")
    print(f"\nNext steps:")
    print(f"  1. cd \"{project_path}\"")
    print(f"  2. Review .agent/ecosystem-manifest.json")
    print(f"  3. Customize agent skills as needed")
    print(f"  4. Run: python execution/validate_agents.py")
    print(f"{'=' * 40}")

    return True


def main():
    parser = argparse.ArgumentParser(
        description="Initialize new project workspaces from AgOS 2.0 master"
    )
    parser.add_argument(
        "--name", "-n",
        help="Project name"
    )
    parser.add_argument(
        "--type", "-t",
        choices=list(PROJECT_TYPES.keys()),
        default="agency",
        help="Project type (default: agency)"
    )
    parser.add_argument(
        "--list", "-l",
        action="store_true",
        help="List all registered ecosystems"
    )

    args = parser.parse_args()

    if args.list:
        list_ecosystems()
        return

    if not args.name:
        parser.print_help()
        print("\nProject types available:")
        for ptype, config in PROJECT_TYPES.items():
            print(f"  {ptype}: {config['description']}")
        sys.exit(1)

    success = init_workspace(args.name, args.type)
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
