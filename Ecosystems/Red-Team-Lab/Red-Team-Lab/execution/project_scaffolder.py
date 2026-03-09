"""
Project Scaffolder - Rapid client project initialization.
Built by @Genesis (The Cloner) for AgOS 2.0.

Creates new client projects with proper AgOS structure, inherited
CLAUDE.md, pre-configured ports, and agent assignments.

Usage:
    python project_scaffolder.py create <project_name> [--type=TYPE] [--port=PORT]
    python project_scaffolder.py list
    python project_scaffolder.py info <project_name>
"""

import json
import os
import shutil
import sys
from datetime import datetime
from pathlib import Path

# Directory structure
ROOT_DIR = Path(__file__).parent.parent
CLIENTS_DIR = ROOT_DIR / "Clients"
TEMPLATE_DIR = ROOT_DIR / ".agent" / "library" / "templates"
PROJECTS_LOG = ROOT_DIR / ".agent" / "memory" / "projects.json"

# Project type templates
PROJECT_TYPES = {
    "expo": {
        "description": "Expo React Native app (iOS/Android/Web)",
        "default_port": 8080,
        "tech_stack": ["Expo 54", "React 19", "NativeWind v4", "TypeScript"],
        "agents": ["jonny-ai", "pixel", "sentinel", "datastore"],
        "structure": [
            "app/",
            "components/",
            "lib/",
            "hooks/",
            "assets/",
            "supabase/",
        ]
    },
    "nextjs": {
        "description": "Next.js 14+ web application",
        "default_port": 3000,
        "tech_stack": ["Next.js 14", "React", "Tailwind CSS v4", "TypeScript"],
        "agents": ["jonny-ai", "pixel", "goldie", "sentinel"],
        "structure": [
            "app/",
            "components/",
            "lib/",
            "public/",
            "styles/",
        ]
    },
    "api": {
        "description": "Backend API service",
        "default_port": 4000,
        "tech_stack": ["Node.js", "Express/Fastify", "TypeScript"],
        "agents": ["jonny-ai", "sentinel", "datastore", "vaultguard"],
        "structure": [
            "src/",
            "src/routes/",
            "src/middleware/",
            "src/services/",
            "tests/",
        ]
    },
    "trading": {
        "description": "Trading system with backtesting",
        "default_port": 5000,
        "tech_stack": ["Python", "pandas", "ccxt", "backtrader"],
        "agents": ["delboy", "metric", "sentinel", "datastore"],
        "structure": [
            "strategies/",
            "backtests/",
            "data/",
            "signals/",
            "lib/",
        ]
    },
    "dropship": {
        "description": "Dropshipping/e-commerce system",
        "default_port": 3001,
        "tech_stack": ["Next.js", "Stripe", "Supabase", "TypeScript"],
        "agents": ["warehouse", "forge", "pixel", "datastore"],
        "structure": [
            "app/",
            "components/",
            "lib/",
            "suppliers/",
            "products/",
        ]
    }
}


def ensure_directories():
    """Create necessary directories if they don't exist."""
    CLIENTS_DIR.mkdir(parents=True, exist_ok=True)
    PROJECTS_LOG.parent.mkdir(parents=True, exist_ok=True)


def load_projects_log() -> dict:
    """Load the projects log file."""
    if PROJECTS_LOG.exists():
        with open(PROJECTS_LOG, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {"projects": [], "port_registry": {}}


def save_projects_log(log: dict):
    """Save the projects log file."""
    with open(PROJECTS_LOG, 'w', encoding='utf-8') as f:
        json.dump(log, f, indent=2)


def get_next_port(project_type: str, log: dict) -> int:
    """Get the next available port for a project type."""
    base_port = PROJECT_TYPES.get(project_type, {}).get("default_port", 8080)
    used_ports = set(log.get("port_registry", {}).values())

    port = base_port
    while port in used_ports:
        port += 1

    return port


def create_project_claude_md(project_path: Path, project_name: str, project_type: str, port: int) -> str:
    """Generate project-specific CLAUDE.md content."""
    type_info = PROJECT_TYPES.get(project_type, PROJECT_TYPES["expo"])
    agents = type_info["agents"]
    tech_stack = type_info["tech_stack"]

    agent_list = "\n".join([f"- @{agent}" for agent in agents])
    tech_list = "\n".join([f"- {tech}" for tech in tech_stack])

    return f"""# {project_name} - AgOS 2.0 Client Project
*Managed by the Antigravity Agency*

> **Inherits from:** Master Workspace (`Jonny AI/CLAUDE.md`)

## Project Overview

**Type:** {type_info['description']}
**Port:** {port}
**Created:** {datetime.now().strftime('%Y-%m-%d')}

---

## Tech Stack

{tech_list}

---

## Assigned Agents

{agent_list}

---

## Quick Commands

```bash
# Start development server
npm run dev  # or: npx expo start --port {port}

# Run tests
npm test

# Deploy
python ../execution/auto_commit.py --push
```

---

## Project-Specific Notes

<!-- Add project-specific context here -->

---

*This project inherits all AgOS 2.0 operating principles from the master workspace.*
"""


def create_project(
    project_name: str,
    project_type: str = "expo",
    port: int = None,
    description: str = None
) -> dict:
    """
    Create a new client project with AgOS structure.

    Args:
        project_name: Name of the project
        project_type: Type of project (expo, nextjs, api, trading, dropship)
        port: Optional specific port number
        description: Optional project description

    Returns:
        Project info dict
    """
    ensure_directories()
    log = load_projects_log()

    # Validate project type
    if project_type not in PROJECT_TYPES:
        print(f"Unknown project type: {project_type}")
        print(f"Available types: {', '.join(PROJECT_TYPES.keys())}")
        return None

    # Check if project already exists
    project_path = CLIENTS_DIR / project_name
    if project_path.exists():
        print(f"Project already exists: {project_path}")
        return None

    # Get port
    if port is None:
        port = get_next_port(project_type, log)

    type_info = PROJECT_TYPES[project_type]

    # Create project directory
    project_path.mkdir(parents=True)

    # Create structure
    for folder in type_info["structure"]:
        (project_path / folder).mkdir(parents=True, exist_ok=True)

    # Create CLAUDE.md
    claude_md = create_project_claude_md(project_path, project_name, project_type, port)
    (project_path / "CLAUDE.md").write_text(claude_md, encoding='utf-8')

    # Create .gitignore
    gitignore_content = """# Dependencies
node_modules/
.pnpm-store/

# Environment
.env
.env.local
.env*.backup

# Build
dist/
build/
.next/
.expo/

# IDE
.idea/
.vscode/settings.json

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
"""
    (project_path / ".gitignore").write_text(gitignore_content, encoding='utf-8')

    # Create README.md
    readme_content = f"""# {project_name}

{description or type_info['description']}

## Getting Started

```bash
# Install dependencies
npm install  # or: pnpm install

# Start development
npm run dev
```

## Port: {port}

---

*Built with AgOS 2.0 by the Antigravity Agency*
"""
    (project_path / "README.md").write_text(readme_content, encoding='utf-8')

    # Log project
    project_record = {
        "name": project_name,
        "type": project_type,
        "port": port,
        "path": str(project_path),
        "created_at": datetime.now().isoformat(),
        "agents": type_info["agents"],
        "tech_stack": type_info["tech_stack"],
        "description": description or type_info["description"],
        "status": "active"
    }

    log["projects"].append(project_record)
    log["port_registry"][project_name] = port
    save_projects_log(log)

    print(f"\n@Genesis: Project '{project_name}' created successfully!")
    print(f"  Path: {project_path}")
    print(f"  Type: {project_type}")
    print(f"  Port: {port}")
    print(f"  Agents: {', '.join(type_info['agents'])}")

    return project_record


def list_projects() -> list:
    """List all registered projects."""
    log = load_projects_log()
    return log.get("projects", [])


def get_project_info(project_name: str) -> dict:
    """Get detailed info about a project."""
    log = load_projects_log()

    for project in log.get("projects", []):
        if project["name"] == project_name:
            # Check if path still exists
            project["exists"] = Path(project["path"]).exists()
            return project

    return None


def main():
    """CLI entry point."""
    if len(sys.argv) < 2:
        print("""
Project Scaffolder - AgOS 2.0
Built by @Genesis (The Cloner)

Usage:
    python project_scaffolder.py create <name> [--type=TYPE] [--port=PORT]
    python project_scaffolder.py list
    python project_scaffolder.py info <name>
    python project_scaffolder.py types

Project Types:
    expo      - Expo React Native app (iOS/Android/Web)
    nextjs    - Next.js 14+ web application
    api       - Backend API service
    trading   - Trading system with backtesting
    dropship  - Dropshipping/e-commerce system

Examples:
    python project_scaffolder.py create MyNewApp --type=expo --port=8085
    python project_scaffolder.py create TradingBot --type=trading
    python project_scaffolder.py list
        """)
        sys.exit(1)

    command = sys.argv[1]

    if command == "create":
        if len(sys.argv) < 3:
            print("Usage: python project_scaffolder.py create <name>")
            sys.exit(1)

        project_name = sys.argv[2]
        project_type = "expo"
        port = None

        for arg in sys.argv[3:]:
            if arg.startswith("--type="):
                project_type = arg.split("=")[1]
            elif arg.startswith("--port="):
                port = int(arg.split("=")[1])

        create_project(project_name, project_type, port)

    elif command == "list":
        projects = list_projects()

        if not projects:
            print("\nNo projects registered yet.")
            print("Use 'python project_scaffolder.py create <name>' to create one.")
        else:
            print("\n@Genesis: Registered Projects")
            print("=" * 60)
            for p in projects:
                status = "ACTIVE" if Path(p["path"]).exists() else "MISSING"
                print(f"\n  {p['name']} ({p['type']})")
                print(f"    Port: {p['port']} | Status: {status}")
                print(f"    Agents: {', '.join(p['agents'])}")

    elif command == "info":
        if len(sys.argv) < 3:
            print("Usage: python project_scaffolder.py info <name>")
            sys.exit(1)

        project_name = sys.argv[2]
        info = get_project_info(project_name)

        if info:
            print(json.dumps(info, indent=2))
        else:
            print(f"Project not found: {project_name}")

    elif command == "types":
        print("\n@Genesis: Available Project Types")
        print("=" * 60)
        for name, info in PROJECT_TYPES.items():
            print(f"\n  {name}")
            print(f"    {info['description']}")
            print(f"    Default Port: {info['default_port']}")
            print(f"    Stack: {', '.join(info['tech_stack'][:3])}...")

    else:
        print(f"Unknown command: {command}")
        sys.exit(1)


if __name__ == "__main__":
    main()
