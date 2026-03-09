"""
Feedback Engine - Processes task outcomes and extracts learnings.
Part of the AgOS 2.0 Feedback Loop System.

Enhanced with git integration for tracking commits, file changes,
and correlating development activity with task outcomes.

Usage:
    python feedback_engine.py log <agent> <task_type> <success> [options]
    python feedback_engine.py health <agent>
    python feedback_engine.py gaps
    python feedback_engine.py report
    python feedback_engine.py git-stats [--days=7]
    python feedback_engine.py commit-log <agent> [--limit=10]
"""

import json
import os
import re
import subprocess
import sys
from datetime import datetime, timedelta
from pathlib import Path

# Directory structure
AGENT_DIR = Path(__file__).parent.parent / ".agent"
MEMORY_DIR = AGENT_DIR / "memory"
LEARNINGS_DIR = MEMORY_DIR / "learnings"
INCIDENTS_DIR = MEMORY_DIR / "incidents"
HEALTH_FILE = MEMORY_DIR / "agent-health.json"


def ensure_directories():
    """Create necessary directories if they don't exist."""
    LEARNINGS_DIR.mkdir(parents=True, exist_ok=True)
    INCIDENTS_DIR.mkdir(parents=True, exist_ok=True)


def log_task_outcome(
    agent: str,
    task_type: str,
    success: bool,
    duration_minutes: int = 0,
    blockers: list = None,
    human_intervention: bool = False,
    learnings: list = None
) -> dict:
    """
    Log the outcome of a completed task for feedback analysis.

    Args:
        agent: Name of the agent (e.g., 'jonny-ai')
        task_type: Category of task (e.g., 'feature', 'bugfix', 'review')
        success: Whether the task was successful
        duration_minutes: How long the task took
        blockers: List of blockers encountered
        human_intervention: Whether human help was needed
        learnings: List of learnings from the task

    Returns:
        Updated agent data dict
    """
    ensure_directories()

    agent_file = LEARNINGS_DIR / f"{agent}.json"

    # Load existing data or create new
    if agent_file.exists():
        with open(agent_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
    else:
        data = {
            "agent": agent,
            "tasks": [],
            "learnings": [],
            "patterns": {},
            "created": datetime.now().isoformat()
        }

    # Add task record
    task_record = {
        "timestamp": datetime.now().isoformat(),
        "task_type": task_type,
        "success": success,
        "duration_minutes": duration_minutes,
        "blockers": blockers or [],
        "human_intervention": human_intervention,
        "learnings": learnings or []
    }
    data["tasks"].append(task_record)

    # Extract learnings
    if learnings:
        for learning in learnings:
            data["learnings"].append({
                "timestamp": datetime.now().isoformat(),
                "learning": learning,
                "source": task_type
            })

    # Detect patterns (same blocker 3+ times triggers flag)
    if blockers:
        for blocker in blockers:
            if blocker not in data["patterns"]:
                data["patterns"][blocker] = 0
            data["patterns"][blocker] += 1

    # Update last modified
    data["last_updated"] = datetime.now().isoformat()

    # Save
    with open(agent_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

    return data


def get_agent_health(agent: str) -> dict:
    """
    Calculate agent health metrics from logged data.

    Args:
        agent: Name of the agent

    Returns:
        Health metrics dict
    """
    agent_file = LEARNINGS_DIR / f"{agent}.json"

    if not agent_file.exists():
        return {"status": "no_data", "agent": agent}

    with open(agent_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    tasks = data.get("tasks", [])
    if not tasks:
        return {"status": "no_tasks", "agent": agent}

    # Filter to recent tasks (last 30 days)
    thirty_days_ago = datetime.now().timestamp() - (30 * 24 * 60 * 60)
    recent_tasks = [
        t for t in tasks
        if datetime.fromisoformat(t["timestamp"]).timestamp() > thirty_days_ago
    ]

    if not recent_tasks:
        recent_tasks = tasks[-50:]  # Fall back to last 50 tasks

    # Calculate metrics
    total = len(recent_tasks)
    successes = sum(1 for t in recent_tasks if t["success"])
    human_interventions = sum(1 for t in recent_tasks if t.get("human_intervention", False))
    total_duration = sum(t.get("duration_minutes", 0) for t in recent_tasks)
    avg_duration = total_duration / total if total > 0 else 0

    # Detect training needs (patterns with 3+ occurrences)
    training_needs = [k for k, v in data.get("patterns", {}).items() if v >= 3]

    return {
        "agent": agent,
        "period": datetime.now().strftime("%Y-W%W"),
        "metrics": {
            "tasks_completed": total,
            "tasks_successful": successes,
            "success_rate": round(successes / total, 3) if total > 0 else 0,
            "human_intervention_rate": round(human_interventions / total, 3) if total > 0 else 0,
            "avg_duration_minutes": round(avg_duration, 1)
        },
        "learnings_count": len(data.get("learnings", [])),
        "training_needs": training_needs,
        "last_updated": data.get("last_updated", "unknown")
    }


def detect_skill_gaps() -> list:
    """
    Scan all agents for skill gaps based on performance data.

    Returns:
        List of detected gaps with recommendations
    """
    ensure_directories()
    gaps = []

    for agent_file in LEARNINGS_DIR.glob("*.json"):
        agent = agent_file.stem
        health = get_agent_health(agent)

        if health.get("status"):
            continue

        metrics = health.get("metrics", {})

        # Flag if success rate < 80%
        if metrics.get("success_rate", 1) < 0.8:
            gaps.append({
                "agent": agent,
                "issue": "low_success_rate",
                "value": metrics["success_rate"],
                "severity": "high" if metrics["success_rate"] < 0.6 else "medium",
                "recommendation": "Review SKILL.md competencies and update training"
            })

        # Flag if human intervention > 20%
        if metrics.get("human_intervention_rate", 0) > 0.2:
            gaps.append({
                "agent": agent,
                "issue": "high_human_intervention",
                "value": metrics["human_intervention_rate"],
                "severity": "medium",
                "recommendation": "Add autonomy guidance to SKILL.md"
            })

        # Flag training needs from patterns
        for need in health.get("training_needs", []):
            gaps.append({
                "agent": agent,
                "issue": "recurring_blocker",
                "pattern": need,
                "severity": "medium",
                "recommendation": f"Add methodology or workflow for: {need}"
            })

    return gaps


def generate_report() -> dict:
    """
    Generate a full system health report.

    Returns:
        Report dict with all agent health and gaps
    """
    ensure_directories()

    agents = []
    for agent_file in LEARNINGS_DIR.glob("*.json"):
        agents.append(get_agent_health(agent_file.stem))

    gaps = detect_skill_gaps()

    # Calculate system-wide metrics
    total_tasks = sum(a.get("metrics", {}).get("tasks_completed", 0) for a in agents if "metrics" in a)
    total_successful = sum(a.get("metrics", {}).get("tasks_successful", 0) for a in agents if "metrics" in a)

    return {
        "generated": datetime.now().isoformat(),
        "period": datetime.now().strftime("%Y-W%W"),
        "system_metrics": {
            "total_agents_tracked": len(agents),
            "total_tasks": total_tasks,
            "system_success_rate": round(total_successful / total_tasks, 3) if total_tasks > 0 else 0,
            "gaps_detected": len(gaps)
        },
        "agents": agents,
        "gaps": gaps
    }


def log_incident(
    incident_id: str,
    severity: str,
    agents_involved: list,
    description: str,
    root_cause: str,
    resolution: str,
    learnings: list
) -> dict:
    """
    Log an incident for post-mortem analysis.

    Args:
        incident_id: Unique identifier
        severity: SEV1, SEV2, SEV3
        agents_involved: List of agent names
        description: What happened
        root_cause: Why it happened
        resolution: How it was fixed
        learnings: What we learned

    Returns:
        Incident record dict
    """
    ensure_directories()

    incident = {
        "id": incident_id,
        "timestamp": datetime.now().isoformat(),
        "severity": severity,
        "agents_involved": agents_involved,
        "description": description,
        "root_cause": root_cause,
        "resolution": resolution,
        "learnings": learnings,
        "status": "documented"
    }

    # Save incident
    incident_file = INCIDENTS_DIR / f"{datetime.now().strftime('%Y-%m-%d')}-{incident_id}.json"
    with open(incident_file, 'w', encoding='utf-8') as f:
        json.dump(incident, f, indent=2)

    # Also log learnings to each involved agent
    for agent in agents_involved:
        log_task_outcome(
            agent=agent,
            task_type="incident_response",
            success=True,
            learnings=learnings
        )

    return incident


# ============================================================================
# Git Integration Functions
# ============================================================================

def get_git_commits(days: int = 7, path: str = None) -> list:
    """
    Get recent git commits with metadata.

    Args:
        days: Number of days to look back
        path: Optional path to filter commits by

    Returns:
        List of commit dicts
    """
    repo_root = Path(__file__).parent.parent

    since_date = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d")

    cmd = [
        "git", "log",
        f"--since={since_date}",
        "--pretty=format:%H|%an|%ae|%ad|%s",
        "--date=iso"
    ]

    if path:
        cmd.append("--")
        cmd.append(path)

    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            cwd=repo_root
        )

        commits = []
        for line in result.stdout.strip().split('\n'):
            if not line:
                continue

            parts = line.split('|', 4)
            if len(parts) >= 5:
                commits.append({
                    "hash": parts[0],
                    "author": parts[1],
                    "email": parts[2],
                    "date": parts[3],
                    "message": parts[4]
                })

        return commits
    except Exception as e:
        print(f"Error getting git commits: {e}")
        return []


def get_commit_files(commit_hash: str) -> list:
    """
    Get list of files changed in a specific commit.

    Args:
        commit_hash: Git commit hash

    Returns:
        List of changed file paths
    """
    repo_root = Path(__file__).parent.parent

    try:
        result = subprocess.run(
            ["git", "diff-tree", "--no-commit-id", "--name-only", "-r", commit_hash],
            capture_output=True,
            text=True,
            cwd=repo_root
        )
        return [f.strip() for f in result.stdout.strip().split('\n') if f.strip()]
    except Exception as e:
        print(f"Error getting commit files: {e}")
        return []


def extract_agent_from_commit(commit: dict) -> str:
    """
    Extract agent name from commit message or author.

    Args:
        commit: Commit dict with message and author

    Returns:
        Agent name or 'unknown'
    """
    message = commit.get("message", "").lower()
    author = commit.get("author", "").lower()

    # Check for Co-Authored-By pattern
    coauthor_match = re.search(r"co-authored-by:\s*(\w+)", message, re.IGNORECASE)
    if coauthor_match:
        return coauthor_match.group(1).lower()

    # Check for agent mentions in message
    agent_patterns = [
        r"@(\w+)",  # @agent mentions
        r"\[(\w+)\]",  # [agent] tags
        r"agent[:\s]+(\w+)",  # agent: name
    ]

    for pattern in agent_patterns:
        match = re.search(pattern, message)
        if match:
            return match.group(1).lower()

    # Map common authors to agents
    author_mapping = {
        "claude": "conductor",
        "jonny": "jonny-ai",
        "antigravity": "antigravity",
        "gemini": "antigravity",
    }

    for key, agent in author_mapping.items():
        if key in author:
            return agent

    return "unknown"


def get_git_stats(days: int = 7) -> dict:
    """
    Generate git activity statistics.

    Args:
        days: Number of days to analyze

    Returns:
        Stats dict with commit metrics
    """
    commits = get_git_commits(days)

    if not commits:
        return {
            "period_days": days,
            "total_commits": 0,
            "message": "No commits in this period"
        }

    # Collect all files changed
    all_files = []
    for commit in commits:
        files = get_commit_files(commit["hash"])
        all_files.extend(files)
        commit["files_changed"] = files

    # Count by agent
    agent_commits = {}
    for commit in commits:
        agent = extract_agent_from_commit(commit)
        if agent not in agent_commits:
            agent_commits[agent] = []
        agent_commits[agent].append(commit)

    # File type distribution
    file_types = {}
    for f in all_files:
        ext = Path(f).suffix or "no_ext"
        file_types[ext] = file_types.get(ext, 0) + 1

    # Directory distribution
    dir_activity = {}
    for f in all_files:
        parts = Path(f).parts
        if parts:
            top_dir = parts[0]
            dir_activity[top_dir] = dir_activity.get(top_dir, 0) + 1

    return {
        "generated": datetime.now().isoformat(),
        "period_days": days,
        "metrics": {
            "total_commits": len(commits),
            "total_files_changed": len(all_files),
            "unique_files": len(set(all_files)),
            "avg_files_per_commit": round(len(all_files) / len(commits), 1) if commits else 0
        },
        "by_agent": {
            agent: {
                "commits": len(clist),
                "files_touched": sum(len(c.get("files_changed", [])) for c in clist)
            }
            for agent, clist in agent_commits.items()
        },
        "file_types": dict(sorted(file_types.items(), key=lambda x: -x[1])[:10]),
        "directory_activity": dict(sorted(dir_activity.items(), key=lambda x: -x[1])[:10])
    }


def get_agent_commit_log(agent: str, limit: int = 10) -> list:
    """
    Get recent commits attributed to a specific agent.

    Args:
        agent: Agent name to filter by
        limit: Maximum commits to return

    Returns:
        List of commit dicts
    """
    all_commits = get_git_commits(days=30)
    agent_commits = []

    for commit in all_commits:
        if extract_agent_from_commit(commit) == agent.lower():
            agent_commits.append(commit)
            if len(agent_commits) >= limit:
                break

    return agent_commits


def correlate_git_with_tasks(agent: str) -> dict:
    """
    Correlate git commits with logged tasks for an agent.

    Args:
        agent: Agent name

    Returns:
        Correlation analysis dict
    """
    agent_file = LEARNINGS_DIR / f"{agent}.json"

    if not agent_file.exists():
        return {"status": "no_task_data", "agent": agent}

    with open(agent_file, 'r', encoding='utf-8') as f:
        task_data = json.load(f)

    commits = get_agent_commit_log(agent, limit=50)

    # Find tasks without corresponding commits
    tasks = task_data.get("tasks", [])
    tasks_without_commits = []

    for task in tasks[-20:]:  # Check last 20 tasks
        task_time = datetime.fromisoformat(task["timestamp"])
        has_nearby_commit = False

        for commit in commits:
            try:
                commit_time = datetime.fromisoformat(commit["date"].replace(" ", "T").split("+")[0])
                time_diff = abs((commit_time - task_time).total_seconds())
                if time_diff < 3600:  # Within 1 hour
                    has_nearby_commit = True
                    break
            except:
                continue

        if not has_nearby_commit and task["success"]:
            tasks_without_commits.append(task)

    return {
        "agent": agent,
        "total_recent_tasks": len(tasks[-20:]),
        "total_recent_commits": len(commits),
        "tasks_without_commits": len(tasks_without_commits),
        "correlation_score": round(1 - (len(tasks_without_commits) / max(len(tasks[-20:]), 1)), 2),
        "recommendation": "Consider committing more frequently" if tasks_without_commits else "Good commit coverage"
    }


def main():
    """CLI entry point."""
    if len(sys.argv) < 2:
        print("""
Feedback Engine - AgOS 2.0 (with Git Integration)

Usage:
    python feedback_engine.py log <agent> <task_type> <success> [--duration=N] [--blocker=X] [--learning=Y]
    python feedback_engine.py health <agent>
    python feedback_engine.py gaps
    python feedback_engine.py report
    python feedback_engine.py git-stats [--days=7]
    python feedback_engine.py commit-log <agent> [--limit=10]
    python feedback_engine.py correlate <agent>

Examples:
    python feedback_engine.py log jonny-ai feature true --duration=15
    python feedback_engine.py health sentinel
    python feedback_engine.py gaps
    python feedback_engine.py git-stats --days=14
    python feedback_engine.py commit-log conductor
    python feedback_engine.py correlate jonny-ai
        """)
        sys.exit(1)

    command = sys.argv[1]

    if command == "log":
        if len(sys.argv) < 5:
            print("Usage: python feedback_engine.py log <agent> <task_type> <success>")
            sys.exit(1)

        agent = sys.argv[2]
        task_type = sys.argv[3]
        success = sys.argv[4].lower() in ('true', '1', 'yes')

        # Parse optional args
        duration = 0
        blockers = []
        learnings = []
        human = False

        for arg in sys.argv[5:]:
            if arg.startswith('--duration='):
                duration = int(arg.split('=')[1])
            elif arg.startswith('--blocker='):
                blockers.append(arg.split('=')[1])
            elif arg.startswith('--learning='):
                learnings.append(arg.split('=')[1])
            elif arg == '--human':
                human = True

        result = log_task_outcome(
            agent=agent,
            task_type=task_type,
            success=success,
            duration_minutes=duration,
            blockers=blockers,
            learnings=learnings,
            human_intervention=human
        )
        print(f"Logged task for {agent}: {task_type} ({'success' if success else 'failure'})")

    elif command == "health":
        if len(sys.argv) < 3:
            print("Usage: python feedback_engine.py health <agent>")
            sys.exit(1)

        agent = sys.argv[2]
        health = get_agent_health(agent)
        print(json.dumps(health, indent=2))

    elif command == "gaps":
        gaps = detect_skill_gaps()
        print(json.dumps(gaps, indent=2))

    elif command == "report":
        report = generate_report()
        print(json.dumps(report, indent=2))

    elif command == "git-stats":
        days = 7
        for arg in sys.argv[2:]:
            if arg.startswith('--days='):
                days = int(arg.split('=')[1])

        stats = get_git_stats(days)
        print(json.dumps(stats, indent=2))

    elif command == "commit-log":
        if len(sys.argv) < 3:
            print("Usage: python feedback_engine.py commit-log <agent>")
            sys.exit(1)

        agent = sys.argv[2]
        limit = 10

        for arg in sys.argv[3:]:
            if arg.startswith('--limit='):
                limit = int(arg.split('=')[1])

        commits = get_agent_commit_log(agent, limit)
        print(f"\nRecent commits for {agent}:")
        print("=" * 60)

        if not commits:
            print("No commits found for this agent.")
        else:
            for c in commits:
                print(f"\n{c['hash'][:8]} | {c['date'][:10]}")
                print(f"  {c['message'][:70]}")
                files = get_commit_files(c['hash'])
                if files:
                    print(f"  Files: {', '.join(files[:3])}" + ("..." if len(files) > 3 else ""))

    elif command == "correlate":
        if len(sys.argv) < 3:
            print("Usage: python feedback_engine.py correlate <agent>")
            sys.exit(1)

        agent = sys.argv[2]
        correlation = correlate_git_with_tasks(agent)
        print(json.dumps(correlation, indent=2))

    else:
        print(f"Unknown command: {command}")
        sys.exit(1)


if __name__ == "__main__":
    main()
