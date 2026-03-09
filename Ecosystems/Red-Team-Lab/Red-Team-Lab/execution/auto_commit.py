"""
Smart Auto-Commit - Generates intelligent commit messages based on changes.
Part of the AgOS Auto-Sync System.

Usage:
    python auto_commit.py [--dry-run] [--push]
"""

import subprocess
import sys
from pathlib import Path
from datetime import datetime


def run_git(args: list, capture: bool = True) -> tuple:
    """
    Run a git command.

    Args:
        args: List of git arguments
        capture: Whether to capture output

    Returns:
        Tuple of (return_code, stdout, stderr)
    """
    try:
        result = subprocess.run(
            ["git"] + args,
            capture_output=capture,
            text=True,
            cwd=Path(__file__).parent.parent
        )
        return result.returncode, result.stdout.strip(), result.stderr.strip()
    except Exception as e:
        return 1, "", str(e)


def get_changed_files() -> list:
    """Get list of all changed files (staged and unstaged)."""
    # Get staged files
    code, staged, _ = run_git(["diff", "--name-only", "--cached"])
    staged_files = [f for f in staged.split('\n') if f.strip()]

    # Get unstaged files
    code, unstaged, _ = run_git(["diff", "--name-only"])
    unstaged_files = [f for f in unstaged.split('\n') if f.strip()]

    # Get untracked files
    code, untracked, _ = run_git(["ls-files", "--others", "--exclude-standard"])
    untracked_files = [f for f in untracked.split('\n') if f.strip()]

    return list(set(staged_files + unstaged_files + untracked_files))


def categorize_changes(files: list) -> dict:
    """
    Categorize changes by type for smart commit message.

    Args:
        files: List of changed file paths

    Returns:
        Dict of categorized changes
    """
    categories = {
        "agents": [],
        "methodology": [],
        "boardroom": [],
        "memory": [],
        "library": [],
        "docs": [],
        "execution": [],
        "config": [],
        "workflows": [],
        "other": []
    }

    for file in files:
        file_lower = file.lower()

        if ".agent/skills/methodology" in file_lower:
            categories["methodology"].append(file)
        elif ".agent/skills/" in file_lower:
            categories["agents"].append(file)
        elif ".agent/boardroom" in file_lower:
            categories["boardroom"].append(file)
        elif ".agent/memory" in file_lower:
            categories["memory"].append(file)
        elif ".agent/library" in file_lower:
            categories["library"].append(file)
        elif ".agent/workflows" in file_lower:
            categories["workflows"].append(file)
        elif file_lower.startswith("docs/") or (file_lower.endswith(".md") and "/" not in file_lower):
            categories["docs"].append(file)
        elif file_lower.startswith("execution/"):
            categories["execution"].append(file)
        elif file_lower in ["claude.md", "agents.md", "gemini.md"]:
            categories["config"].append(file)
        else:
            categories["other"].append(file)

    return categories


def generate_commit_message(categories: dict) -> str:
    """
    Generate a smart commit message based on categorized changes.

    Args:
        categories: Dict of categorized changes

    Returns:
        Commit message string
    """
    parts = []
    details = []

    # Agents
    if categories["agents"]:
        agent_names = list(set([
            Path(f).parent.name for f in categories["agents"]
            if Path(f).parent.name != "skills"
        ]))
        if len(agent_names) == 1:
            parts.append(f"agent({agent_names[0]}): update skill definition")
        elif len(agent_names) <= 3:
            parts.append(f"agents: update {', '.join(agent_names)}")
        else:
            parts.append(f"agents: update {len(agent_names)} agent profiles")
        details.append(f"- Updated {len(categories['agents'])} agent file(s)")

    # Boardroom
    if categories["boardroom"]:
        parts.append("boardroom: update meeting protocols")
        details.append(f"- Updated {len(categories['boardroom'])} boardroom file(s)")

    # Memory/Feedback
    if categories["memory"]:
        parts.append("feedback: update learning system")
        details.append(f"- Updated {len(categories['memory'])} memory file(s)")

    # Methodology
    if categories["methodology"]:
        parts.append("methodology: update best practices")
        details.append(f"- Updated {len(categories['methodology'])} methodology file(s)")

    # Library
    if categories["library"]:
        parts.append("library: update shared resources")
        details.append(f"- Updated {len(categories['library'])} library file(s)")

    # Workflows
    if categories["workflows"]:
        parts.append("workflows: update automation flows")
        details.append(f"- Updated {len(categories['workflows'])} workflow file(s)")

    # Docs
    if categories["docs"]:
        parts.append("docs: update documentation")
        details.append(f"- Updated {len(categories['docs'])} documentation file(s)")

    # Execution scripts
    if categories["execution"]:
        parts.append("execution: update automation scripts")
        details.append(f"- Updated {len(categories['execution'])} execution script(s)")

    # Config files
    if categories["config"]:
        parts.append("config: update workspace configuration")
        details.append(f"- Updated {len(categories['config'])} config file(s)")

    # Other
    if categories["other"] and not parts:
        parts.append("chore: miscellaneous updates")
        details.append(f"- Updated {len(categories['other'])} other file(s)")

    # Build message
    if not parts:
        return None  # No changes

    if len(parts) == 1:
        title = parts[0]
    else:
        # Multi-area update
        title = "chore: multi-area AgOS update"

    # Build full message
    message = title
    if details:
        message += "\n\n" + "\n".join(details)

    # Add footer
    message += f"\n\n[AgOS Auto-Sync {datetime.now().strftime('%Y-%m-%d %H:%M')}]"

    return message


def auto_commit(dry_run: bool = False, push: bool = False) -> bool:
    """
    Stage and commit changes with smart message.

    Args:
        dry_run: If True, don't actually commit
        push: If True, push after commit

    Returns:
        True if successful
    """
    # Get changed files
    files = get_changed_files()
    if not files:
        print("No changes to commit")
        return True

    print(f"Found {len(files)} changed file(s)")

    # Categorize changes
    categories = categorize_changes(files)

    # Generate commit message
    message = generate_commit_message(categories)
    if not message:
        print("No changes to commit")
        return True

    print(f"\nCommit message:\n{'-' * 40}")
    print(message)
    print(f"{'-' * 40}")

    if dry_run:
        print("\n[DRY RUN] Would commit with above message")
        return True

    # Stage all changes
    print("\nStaging changes...")
    code, _, err = run_git(["add", "-A"])
    if code != 0:
        print(f"Error staging: {err}")
        return False

    # Commit
    print("Committing...")
    code, out, err = run_git(["commit", "-m", message])
    if code != 0:
        if "nothing to commit" in err or "nothing to commit" in out:
            print("Nothing to commit")
            return True
        print(f"Error committing: {err}")
        return False

    print(f"Committed: {message.split(chr(10))[0]}")

    # Push if requested
    if push:
        print("Pushing...")
        code, _, err = run_git(["push"])
        if code != 0:
            print(f"Error pushing: {err}")
            return False
        print("Pushed successfully")

    return True


def main():
    """CLI entry point."""
    dry_run = '--dry-run' in sys.argv
    push = '--push' in sys.argv

    print("AgOS Auto-Commit")
    print("=" * 40)

    success = auto_commit(dry_run=dry_run, push=push)

    if success:
        print("\nAuto-commit completed successfully")
        sys.exit(0)
    else:
        print("\nAuto-commit failed")
        sys.exit(1)


if __name__ == "__main__":
    main()
