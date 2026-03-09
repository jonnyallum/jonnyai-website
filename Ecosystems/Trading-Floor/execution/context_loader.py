"""
Context Loader - Rapid project context loading.
Built by @Manus (Mason Drake "The Bridgemaster") for AgOS 2.0.

Quick-loads relevant project context, recent changes, active blockers,
and key files into any session for fast onboarding.

Usage:
    python context_loader.py load <project_path>
    python context_loader.py quick <project_name>
    python context_loader.py status
    python context_loader.py blockers
"""

import json
import subprocess
import sys
from datetime import datetime, timedelta
from pathlib import Path

# Directory structure
ROOT_DIR = Path(__file__).parent.parent
CLIENTS_DIR = ROOT_DIR / "Clients"
MEMORY_DIR = ROOT_DIR / ".agent" / "memory"
TMP_DIR = ROOT_DIR / ".tmp"
CONTEXT_CACHE = MEMORY_DIR / "context-cache.json"


def get_git_info(project_path: Path) -> dict:
    """Get git status and recent commits for a project."""
    try:
        # Current branch
        branch_result = subprocess.run(
            ["git", "branch", "--show-current"],
            capture_output=True, text=True, cwd=project_path
        )
        branch = branch_result.stdout.strip()

        # Git status
        status_result = subprocess.run(
            ["git", "status", "--porcelain"],
            capture_output=True, text=True, cwd=project_path
        )
        changes = [l.strip() for l in status_result.stdout.strip().split('\n') if l.strip()]

        # Recent commits
        log_result = subprocess.run(
            ["git", "log", "-5", "--oneline"],
            capture_output=True, text=True, cwd=project_path
        )
        commits = [l.strip() for l in log_result.stdout.strip().split('\n') if l.strip()]

        return {
            "branch": branch,
            "uncommitted_changes": len(changes),
            "changed_files": changes[:10],
            "recent_commits": commits
        }
    except Exception as e:
        return {"error": str(e)}


def get_package_info(project_path: Path) -> dict:
    """Extract package.json info if it exists."""
    package_file = project_path / "package.json"

    if not package_file.exists():
        return None

    try:
        with open(package_file, 'r', encoding='utf-8') as f:
            pkg = json.load(f)

        return {
            "name": pkg.get("name", "unknown"),
            "version": pkg.get("version", "0.0.0"),
            "scripts": list(pkg.get("scripts", {}).keys())[:10],
            "dependencies_count": len(pkg.get("dependencies", {})),
            "dev_dependencies_count": len(pkg.get("devDependencies", {}))
        }
    except:
        return None


def get_env_vars(project_path: Path) -> dict:
    """Check for environment configuration."""
    env_files = []
    env_example = None

    for env_file in project_path.glob(".env*"):
        if env_file.name == ".env.example":
            env_example = env_file
        elif "backup" not in env_file.name:
            env_files.append(env_file.name)

    # Check for required vars from .env.example
    required_vars = []
    if env_example and env_example.exists():
        content = env_example.read_text(encoding='utf-8')
        for line in content.split('\n'):
            if '=' in line and not line.startswith('#'):
                var_name = line.split('=')[0].strip()
                if var_name:
                    required_vars.append(var_name)

    return {
        "env_files": env_files,
        "has_example": env_example is not None,
        "required_vars": required_vars[:15]
    }


def get_project_structure(project_path: Path) -> dict:
    """Analyze project structure."""
    structure = {
        "directories": [],
        "key_files": [],
        "config_files": []
    }

    # Key directories
    key_dirs = ["app", "src", "components", "lib", "hooks", "pages", "api", "supabase", "scripts"]
    for d in key_dirs:
        dir_path = project_path / d
        if dir_path.exists():
            structure["directories"].append(d)

    # Key files
    key_files = [
        "CLAUDE.md", "README.md", "package.json", "tsconfig.json",
        "app.json", "expo.json", "next.config.js", "tailwind.config.js"
    ]
    for f in key_files:
        if (project_path / f).exists():
            structure["key_files"].append(f)

    # Config files
    config_patterns = ["*.config.*", ".*.json", ".*.js"]
    for pattern in config_patterns:
        for config_file in project_path.glob(pattern):
            if config_file.is_file():
                structure["config_files"].append(config_file.name)

    return structure


def get_claude_context(project_path: Path) -> str:
    """Extract CLAUDE.md content if it exists."""
    claude_file = project_path / "CLAUDE.md"

    if not claude_file.exists():
        return None

    try:
        content = claude_file.read_text(encoding='utf-8')
        # Return first 2000 chars
        return content[:2000] + ("..." if len(content) > 2000 else "")
    except:
        return None


def get_active_blockers() -> list:
    """Check for any documented blockers in the ecosystem."""
    blockers = []

    # Check inter-AI messages for blockers
    for msg_file in TMP_DIR.glob("message4*.md"):
        try:
            content = msg_file.read_text(encoding='utf-8')
            if "BLOCKED" in content.upper() or "BLOCKER" in content.upper():
                blockers.append({
                    "source": msg_file.name,
                    "type": "inter-ai-message"
                })
        except:
            pass

    # Check for pending sessions
    active_session = MEMORY_DIR / "active-session.json"
    if active_session.exists():
        try:
            with open(active_session, 'r', encoding='utf-8') as f:
                session = json.load(f)
            blockers.append({
                "source": "active-session",
                "session_id": session.get("session_id"),
                "type": "incomplete-session"
            })
        except:
            pass

    return blockers


def load_project_context(project_path: Path) -> dict:
    """
    Load comprehensive context for a project.

    Args:
        project_path: Path to the project directory

    Returns:
        Context dict with all relevant information
    """
    if not project_path.exists():
        return {"error": f"Project path not found: {project_path}"}

    context = {
        "project_path": str(project_path),
        "project_name": project_path.name,
        "loaded_at": datetime.now().isoformat(),
        "git": get_git_info(project_path),
        "package": get_package_info(project_path),
        "environment": get_env_vars(project_path),
        "structure": get_project_structure(project_path),
        "claude_md": get_claude_context(project_path),
        "blockers": get_active_blockers()
    }

    # Cache the context
    MEMORY_DIR.mkdir(parents=True, exist_ok=True)
    cache = {}
    if CONTEXT_CACHE.exists():
        try:
            with open(CONTEXT_CACHE, 'r', encoding='utf-8') as f:
                cache = json.load(f)
        except:
            pass

    cache[str(project_path)] = {
        "loaded_at": context["loaded_at"],
        "project_name": context["project_name"]
    }

    with open(CONTEXT_CACHE, 'w', encoding='utf-8') as f:
        json.dump(cache, f, indent=2)

    return context


def display_context(context: dict):
    """Display context in a readable format."""
    print(f"\n{'='*60}")
    print(f"@Manus: PROJECT CONTEXT LOADED")
    print(f"{'='*60}")

    print(f"\nProject: {context['project_name']}")
    print(f"Path: {context['project_path']}")

    # Git info
    git = context.get("git", {})
    if git and not git.get("error"):
        print(f"\n--- GIT STATUS ---")
        print(f"Branch: {git.get('branch', 'unknown')}")
        print(f"Uncommitted changes: {git.get('uncommitted_changes', 0)}")
        if git.get("recent_commits"):
            print(f"Recent commits:")
            for commit in git["recent_commits"][:3]:
                print(f"  {commit}")

    # Package info
    pkg = context.get("package")
    if pkg:
        print(f"\n--- PACKAGE INFO ---")
        print(f"Name: {pkg['name']} v{pkg['version']}")
        print(f"Dependencies: {pkg['dependencies_count']} + {pkg['dev_dependencies_count']} dev")
        if pkg.get("scripts"):
            print(f"Scripts: {', '.join(pkg['scripts'][:5])}")

    # Structure
    structure = context.get("structure", {})
    if structure.get("directories"):
        print(f"\n--- STRUCTURE ---")
        print(f"Directories: {', '.join(structure['directories'])}")
        print(f"Key files: {', '.join(structure['key_files'])}")

    # Environment
    env = context.get("environment", {})
    if env.get("env_files"):
        print(f"\n--- ENVIRONMENT ---")
        print(f"Env files: {', '.join(env['env_files'])}")
        if env.get("required_vars"):
            print(f"Required vars: {len(env['required_vars'])}")

    # Blockers
    blockers = context.get("blockers", [])
    if blockers:
        print(f"\n--- BLOCKERS ({len(blockers)}) ---")
        for b in blockers:
            print(f"  - {b['type']}: {b.get('source', 'unknown')}")

    # CLAUDE.md preview
    claude_md = context.get("claude_md")
    if claude_md:
        print(f"\n--- CLAUDE.MD PREVIEW ---")
        print(claude_md[:500])
        if len(claude_md) > 500:
            print("...")

    print(f"\n{'='*60}")


def quick_load(project_name: str) -> dict:
    """Quick-load context by project name (searches Clients folder)."""
    # Try direct match first
    project_path = CLIENTS_DIR / project_name
    if project_path.exists():
        return load_project_context(project_path)

    # Search for partial match
    for client_dir in CLIENTS_DIR.iterdir():
        if client_dir.is_dir() and project_name.lower() in client_dir.name.lower():
            return load_project_context(client_dir)

    # Search in nested folders
    for client_dir in CLIENTS_DIR.iterdir():
        if client_dir.is_dir():
            for nested in client_dir.iterdir():
                if nested.is_dir() and project_name.lower() in nested.name.lower():
                    return load_project_context(nested)

    return {"error": f"Project not found: {project_name}"}


def show_status():
    """Show status of all known projects."""
    print(f"\n{'='*60}")
    print(f"@Manus: ECOSYSTEM STATUS")
    print(f"{'='*60}")

    # Recent context loads
    if CONTEXT_CACHE.exists():
        with open(CONTEXT_CACHE, 'r', encoding='utf-8') as f:
            cache = json.load(f)

        print(f"\nRecent context loads:")
        for path, info in list(cache.items())[-5:]:
            print(f"  {info['project_name']} - {info['loaded_at'][:10]}")

    # Active blockers
    blockers = get_active_blockers()
    print(f"\nActive blockers: {len(blockers)}")
    for b in blockers:
        print(f"  - {b['type']}: {b.get('source', 'unknown')}")

    # Inter-AI messages
    print(f"\nInter-AI messages:")
    for msg_file in TMP_DIR.glob("message4*.md"):
        target = msg_file.stem.replace("message4", "")
        stat = msg_file.stat()
        age_hours = (datetime.now().timestamp() - stat.st_mtime) / 3600
        print(f"  {target}: {age_hours:.1f}h old")

    print(f"\n{'='*60}")


def main():
    """CLI entry point."""
    if len(sys.argv) < 2:
        print("""
Context Loader - AgOS 2.0
Built by @Manus (Mason Drake "The Bridgemaster")

Usage:
    python context_loader.py load <project_path>
    python context_loader.py quick <project_name>
    python context_loader.py status
    python context_loader.py blockers

Examples:
    python context_loader.py load ./Clients/Poundtrades
    python context_loader.py quick poundtrades
    python context_loader.py status
        """)
        sys.exit(1)

    command = sys.argv[1]

    if command == "load":
        if len(sys.argv) < 3:
            print("Usage: python context_loader.py load <project_path>")
            sys.exit(1)

        project_path = Path(sys.argv[2]).resolve()
        context = load_project_context(project_path)

        if context.get("error"):
            print(f"Error: {context['error']}")
        else:
            display_context(context)

    elif command == "quick":
        if len(sys.argv) < 3:
            print("Usage: python context_loader.py quick <project_name>")
            sys.exit(1)

        context = quick_load(sys.argv[2])

        if context.get("error"):
            print(f"Error: {context['error']}")
        else:
            display_context(context)

    elif command == "status":
        show_status()

    elif command == "blockers":
        blockers = get_active_blockers()
        print(f"\n@Manus: Active Blockers ({len(blockers)})")
        print("=" * 40)

        if not blockers:
            print("No blockers detected. Clear skies.")
        else:
            for b in blockers:
                print(f"\n  Type: {b['type']}")
                print(f"  Source: {b.get('source', 'unknown')}")

    else:
        print(f"Unknown command: {command}")
        sys.exit(1)


if __name__ == "__main__":
    main()
