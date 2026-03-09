"""
Health Dashboard - Visual system status and metrics.
Built by @Metric (Maya Singh "The Oracle") for AgOS 2.0.

Generates visual reports, tracks KPIs, and surfaces insights
across the entire AgOS ecosystem.

Usage:
    python health_dashboard.py show
    python health_dashboard.py agents
    python health_dashboard.py projects
    python health_dashboard.py export [--format=FORMAT]
"""

import json
import subprocess
import sys
from datetime import datetime, timedelta
from pathlib import Path

# Directory structure
ROOT_DIR = Path(__file__).parent.parent
MEMORY_DIR = ROOT_DIR / ".agent" / "memory"
LEARNINGS_DIR = MEMORY_DIR / "learnings"
SESSIONS_DIR = MEMORY_DIR / "sessions"
TMP_DIR = ROOT_DIR / ".tmp"
CLIENTS_DIR = ROOT_DIR / "Clients"

# ANSI colors for terminal output
class Colors:
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    BOLD = '\033[1m'
    END = '\033[0m'


def colorize(text: str, color: str) -> str:
    """Add color to text if terminal supports it."""
    return f"{color}{text}{Colors.END}"


def get_agent_metrics() -> dict:
    """Gather metrics for all agents."""
    metrics = {}

    if not LEARNINGS_DIR.exists():
        return metrics

    for agent_file in LEARNINGS_DIR.glob("*.json"):
        try:
            with open(agent_file, 'r', encoding='utf-8') as f:
                data = json.load(f)

            agent = agent_file.stem
            tasks = data.get("tasks", [])

            if not tasks:
                continue

            # Recent tasks (last 30 days)
            cutoff = datetime.now() - timedelta(days=30)
            recent = [
                t for t in tasks
                if datetime.fromisoformat(t["timestamp"]) > cutoff
            ]

            if not recent:
                recent = tasks[-20:]  # Fallback to last 20

            total = len(recent)
            successes = sum(1 for t in recent if t.get("success"))

            metrics[agent] = {
                "total_tasks": total,
                "successful": successes,
                "success_rate": round(successes / total, 2) if total > 0 else 0,
                "learnings": len(data.get("learnings", [])),
                "last_active": tasks[-1]["timestamp"] if tasks else None
            }
        except:
            continue

    return metrics


def get_session_metrics() -> dict:
    """Gather session-related metrics."""
    if not SESSIONS_DIR.exists():
        return {"total": 0, "active": False}

    sessions = list(SESSIONS_DIR.glob("*.json"))
    total = len(sessions)

    # Count recent sessions
    recent_count = 0
    total_duration = 0
    success_count = 0

    cutoff = datetime.now() - timedelta(days=7)

    for session_file in sessions:
        try:
            with open(session_file, 'r', encoding='utf-8') as f:
                session = json.load(f)

            if session.get("ended_at"):
                ended = datetime.fromisoformat(session["ended_at"])
                if ended > cutoff:
                    recent_count += 1
                    total_duration += session.get("duration_minutes", 0)
                    if session.get("outcome") == "success":
                        success_count += 1
        except:
            continue

    # Check for active session
    active_file = MEMORY_DIR / "active-session.json"
    has_active = active_file.exists()

    return {
        "total_all_time": total,
        "recent_7_days": recent_count,
        "avg_duration": round(total_duration / recent_count, 1) if recent_count > 0 else 0,
        "success_rate": round(success_count / recent_count, 2) if recent_count > 0 else 0,
        "active_session": has_active
    }


def get_git_activity() -> dict:
    """Get git activity metrics."""
    try:
        since_date = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")

        result = subprocess.run(
            ["git", "log", f"--since={since_date}", "--oneline"],
            capture_output=True, text=True, cwd=ROOT_DIR
        )

        commits = [l for l in result.stdout.strip().split('\n') if l]

        return {
            "commits_7_days": len(commits),
            "recent_commits": commits[:5]
        }
    except:
        return {"commits_7_days": 0, "recent_commits": []}


def get_inter_ai_status() -> dict:
    """Check inter-AI communication status."""
    messages = {}

    for msg_file in TMP_DIR.glob("message4*.md"):
        target = msg_file.stem.replace("message4", "")
        stat = msg_file.stat()
        age_hours = (datetime.now().timestamp() - stat.st_mtime) / 3600

        messages[target] = {
            "age_hours": round(age_hours, 1),
            "stale": age_hours > 24
        }

    return messages


def get_project_status() -> list:
    """Get status of all client projects."""
    projects = []

    if not CLIENTS_DIR.exists():
        return projects

    for client_dir in CLIENTS_DIR.iterdir():
        if not client_dir.is_dir():
            continue

        # Check for CLAUDE.md
        has_claude = (client_dir / "CLAUDE.md").exists()

        # Check for package.json
        has_package = (client_dir / "package.json").exists()

        # Check for git status
        try:
            result = subprocess.run(
                ["git", "status", "--porcelain"],
                capture_output=True, text=True, cwd=client_dir
            )
            uncommitted = len([l for l in result.stdout.strip().split('\n') if l])
        except:
            uncommitted = -1

        projects.append({
            "name": client_dir.name,
            "path": str(client_dir),
            "has_claude_md": has_claude,
            "has_package_json": has_package,
            "uncommitted_changes": uncommitted
        })

    return projects


def display_dashboard():
    """Display the full health dashboard."""
    print(f"\n{Colors.BOLD}{'='*70}{Colors.END}")
    print(f"{Colors.BOLD}@Metric: AgOS 2.0 HEALTH DASHBOARD{Colors.END}")
    print(f"{Colors.BOLD}{'='*70}{Colors.END}")
    print(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    # Session metrics
    sessions = get_session_metrics()
    print(f"\n{Colors.CYAN}--- SESSION METRICS ---{Colors.END}")
    print(f"  Total sessions (all time): {sessions['total_all_time']}")
    print(f"  Sessions (7 days): {sessions['recent_7_days']}")
    print(f"  Avg duration: {sessions['avg_duration']} min")

    success_color = Colors.GREEN if sessions['success_rate'] >= 0.8 else Colors.YELLOW if sessions['success_rate'] >= 0.6 else Colors.RED
    rate_str = f"{sessions['success_rate']*100:.0f}%"
    print(f"  Success rate: {colorize(rate_str, success_color)}")

    active_status = colorize("ACTIVE", Colors.GREEN) if sessions['active_session'] else "None"
    print(f"  Active session: {active_status}")

    # Agent metrics
    agents = get_agent_metrics()
    print(f"\n{Colors.CYAN}--- AGENT HEALTH ---{Colors.END}")

    if not agents:
        print("  No agent data yet.")
    else:
        for agent, data in sorted(agents.items(), key=lambda x: -x[1]['success_rate']):
            rate = data['success_rate']
            rate_color = Colors.GREEN if rate >= 0.8 else Colors.YELLOW if rate >= 0.6 else Colors.RED
            rate_str = colorize(f"{rate*100:.0f}%", rate_color)

            print(f"  @{agent}: {data['successful']}/{data['total_tasks']} tasks ({rate_str})")

    # Git activity
    git = get_git_activity()
    print(f"\n{Colors.CYAN}--- GIT ACTIVITY (7 days) ---{Colors.END}")
    print(f"  Commits: {git['commits_7_days']}")
    if git['recent_commits']:
        for commit in git['recent_commits'][:3]:
            print(f"    {commit[:60]}")

    # Inter-AI comms
    messages = get_inter_ai_status()
    print(f"\n{Colors.CYAN}--- INTER-AI COMMS ---{Colors.END}")

    if not messages:
        print("  No active messages.")
    else:
        for target, info in messages.items():
            status = colorize("STALE", Colors.RED) if info['stale'] else colorize("FRESH", Colors.GREEN)
            print(f"  message4{target}: {info['age_hours']}h old [{status}]")

    # System health score
    print(f"\n{Colors.CYAN}--- SYSTEM HEALTH SCORE ---{Colors.END}")

    # Calculate composite score
    score_components = []

    # Session success (40%)
    if sessions['recent_7_days'] > 0:
        score_components.append(sessions['success_rate'] * 40)
    else:
        score_components.append(20)  # Neutral if no data

    # Agent health (30%)
    if agents:
        avg_agent_rate = sum(a['success_rate'] for a in agents.values()) / len(agents)
        score_components.append(avg_agent_rate * 30)
    else:
        score_components.append(15)

    # Git activity (15%)
    git_score = min(git['commits_7_days'] / 10, 1) * 15
    score_components.append(git_score)

    # Comms freshness (15%)
    if messages:
        fresh_count = sum(1 for m in messages.values() if not m['stale'])
        comms_score = (fresh_count / len(messages)) * 15
    else:
        comms_score = 7.5
    score_components.append(comms_score)

    total_score = sum(score_components)
    score_color = Colors.GREEN if total_score >= 75 else Colors.YELLOW if total_score >= 50 else Colors.RED

    print(f"\n  {colorize(f'HEALTH SCORE: {total_score:.0f}/100', score_color)}")

    if total_score >= 75:
        print(f"  {colorize('STATUS: OPTIMAL', Colors.GREEN)}")
    elif total_score >= 50:
        print(f"  {colorize('STATUS: NEEDS ATTENTION', Colors.YELLOW)}")
    else:
        print(f"  {colorize('STATUS: CRITICAL', Colors.RED)}")

    print(f"\n{Colors.BOLD}{'='*70}{Colors.END}")


def display_agents():
    """Display detailed agent metrics."""
    agents = get_agent_metrics()

    print(f"\n{Colors.BOLD}@Metric: AGENT PERFORMANCE REPORT{Colors.END}")
    print("=" * 60)

    if not agents:
        print("No agent data available yet.")
        print("Use feedback_engine.py to log task outcomes.")
        return

    for agent, data in sorted(agents.items(), key=lambda x: -x[1]['total_tasks']):
        rate = data['success_rate']
        rate_color = Colors.GREEN if rate >= 0.8 else Colors.YELLOW if rate >= 0.6 else Colors.RED

        print(f"\n  @{agent}")
        print(f"    Tasks: {data['total_tasks']}")
        print(f"    Success rate: {colorize(f'{rate*100:.0f}%', rate_color)}")
        print(f"    Learnings captured: {data['learnings']}")
        if data['last_active']:
            print(f"    Last active: {data['last_active'][:10]}")


def display_projects():
    """Display project status."""
    projects = get_project_status()

    print(f"\n{Colors.BOLD}@Metric: PROJECT STATUS REPORT{Colors.END}")
    print("=" * 60)

    if not projects:
        print("No projects found in Clients/ directory.")
        return

    for p in projects:
        claude_status = colorize("YES", Colors.GREEN) if p['has_claude_md'] else colorize("NO", Colors.RED)
        changes_status = colorize(str(p['uncommitted_changes']), Colors.YELLOW if p['uncommitted_changes'] > 0 else Colors.GREEN)

        print(f"\n  {p['name']}")
        print(f"    CLAUDE.md: {claude_status}")
        print(f"    package.json: {'YES' if p['has_package_json'] else 'NO'}")
        print(f"    Uncommitted: {changes_status}")


def export_dashboard(format: str = "json") -> str:
    """Export dashboard data to file."""
    data = {
        "generated_at": datetime.now().isoformat(),
        "sessions": get_session_metrics(),
        "agents": get_agent_metrics(),
        "git": get_git_activity(),
        "inter_ai": get_inter_ai_status(),
        "projects": get_project_status()
    }

    output_dir = ROOT_DIR / "docs" / "reports"
    output_dir.mkdir(parents=True, exist_ok=True)

    filename = f"health-report-{datetime.now().strftime('%Y%m%d-%H%M%S')}"

    if format == "json":
        output_file = output_dir / f"{filename}.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
    elif format == "md":
        output_file = output_dir / f"{filename}.md"
        md_content = generate_markdown_report(data)
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(md_content)
    else:
        print(f"Unknown format: {format}")
        return None

    print(f"@Metric: Report exported to {output_file}")
    return str(output_file)


def generate_markdown_report(data: dict) -> str:
    """Generate a markdown report from dashboard data."""
    sessions = data['sessions']
    agents = data['agents']
    git = data['git']

    report = f"""# AgOS 2.0 Health Report
Generated: {data['generated_at']}

## Session Metrics
- Total sessions (all time): {sessions['total_all_time']}
- Sessions (7 days): {sessions['recent_7_days']}
- Avg duration: {sessions['avg_duration']} min
- Success rate: {sessions['success_rate']*100:.0f}%

## Agent Performance
| Agent | Tasks | Success Rate | Learnings |
|:------|------:|-------------:|----------:|
"""

    for agent, info in sorted(agents.items(), key=lambda x: -x[1]['success_rate']):
        report += f"| @{agent} | {info['total_tasks']} | {info['success_rate']*100:.0f}% | {info['learnings']} |\n"

    report += f"""
## Git Activity (7 days)
- Commits: {git['commits_7_days']}

## Projects
| Project | CLAUDE.md | Uncommitted |
|:--------|:---------:|------------:|
"""

    for p in data['projects']:
        claude = "Yes" if p['has_claude_md'] else "No"
        report += f"| {p['name']} | {claude} | {p['uncommitted_changes']} |\n"

    report += "\n---\n*Generated by @Metric (Maya Singh \"The Oracle\")*\n"

    return report


def main():
    """CLI entry point."""
    if len(sys.argv) < 2:
        print("""
Health Dashboard - AgOS 2.0
Built by @Metric (Maya Singh "The Oracle")

Usage:
    python health_dashboard.py show
    python health_dashboard.py agents
    python health_dashboard.py projects
    python health_dashboard.py export [--format=json|md]

Examples:
    python health_dashboard.py show
    python health_dashboard.py export --format=md
        """)
        sys.exit(1)

    command = sys.argv[1]

    if command == "show":
        display_dashboard()

    elif command == "agents":
        display_agents()

    elif command == "projects":
        display_projects()

    elif command == "export":
        format = "json"
        for arg in sys.argv[2:]:
            if arg.startswith("--format="):
                format = arg.split("=")[1]

        export_dashboard(format)

    else:
        print(f"Unknown command: {command}")
        sys.exit(1)


if __name__ == "__main__":
    main()
