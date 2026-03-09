"""
Session Logger - Auto-captures Claude Code session outcomes for feedback.
Part of the AgOS 2.0 Feedback Loop System.

This integrates with the feedback_engine to automatically log session
outcomes, learnings, and inter-AI collaboration metrics.

Usage:
    python session_logger.py start <session_type> [--project=NAME]
    python session_logger.py end <session_id> <success> [--summary=TEXT]
    python session_logger.py log-collab <from_ai> <to_ai> <message_type>
    python session_logger.py report [--days=7]
"""

import json
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path
import uuid
import subprocess

# Directory structure
AGENT_DIR = Path(__file__).parent.parent / ".agent"
MEMORY_DIR = AGENT_DIR / "memory"
SESSIONS_DIR = MEMORY_DIR / "sessions"
COLLAB_LOG = MEMORY_DIR / "collaboration-log.json"
TMP_DIR = Path(__file__).parent.parent / ".tmp"


def ensure_directories():
    """Create necessary directories if they don't exist."""
    SESSIONS_DIR.mkdir(parents=True, exist_ok=True)
    MEMORY_DIR.mkdir(parents=True, exist_ok=True)


def start_session(
    session_type: str,
    project: str = None,
    agents_involved: list = None
) -> dict:
    """
    Start a new Claude Code session.

    Args:
        session_type: Type of session (debug, feature, review, collab, etc.)
        project: Project name if applicable
        agents_involved: List of agents expected to be involved

    Returns:
        Session record with ID
    """
    ensure_directories()

    session_id = f"ses_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:6]}"

    session = {
        "id": session_id,
        "type": session_type,
        "project": project,
        "started_at": datetime.now().isoformat(),
        "ended_at": None,
        "status": "active",
        "agents_involved": agents_involved or ["conductor"],
        "tasks_completed": [],
        "files_modified": [],
        "learnings": [],
        "inter_ai_messages": 0,
        "outcome": None,
        "summary": None
    }

    # Save session
    session_file = SESSIONS_DIR / f"{session_id}.json"
    with open(session_file, 'w', encoding='utf-8') as f:
        json.dump(session, f, indent=2)

    # Track active session
    active_file = MEMORY_DIR / "active-session.json"
    with open(active_file, 'w', encoding='utf-8') as f:
        json.dump({"session_id": session_id}, f)

    print(f"Session started: {session_id}")
    print(f"Type: {session_type}")
    if project:
        print(f"Project: {project}")

    return session


def end_session(
    session_id: str,
    success: bool,
    summary: str = None,
    learnings: list = None,
    files_modified: list = None
) -> dict:
    """
    End a Claude Code session and record outcomes.

    Args:
        session_id: The session ID to end
        success: Whether the session was successful
        summary: Brief summary of what was accomplished
        learnings: List of learnings from the session
        files_modified: List of files that were modified

    Returns:
        Updated session record
    """
    ensure_directories()

    session_file = SESSIONS_DIR / f"{session_id}.json"

    if not session_file.exists():
        print(f"Session not found: {session_id}")
        return None

    with open(session_file, 'r', encoding='utf-8') as f:
        session = json.load(f)

    # Update session
    session["ended_at"] = datetime.now().isoformat()
    session["status"] = "completed" if success else "failed"
    session["outcome"] = "success" if success else "failure"
    session["summary"] = summary

    if learnings:
        session["learnings"].extend(learnings)

    if files_modified:
        session["files_modified"].extend(files_modified)

    # Calculate duration
    start = datetime.fromisoformat(session["started_at"])
    end = datetime.fromisoformat(session["ended_at"])
    session["duration_minutes"] = round((end - start).total_seconds() / 60, 1)

    # Save updated session
    with open(session_file, 'w', encoding='utf-8') as f:
        json.dump(session, f, indent=2)

    # Clear active session
    active_file = MEMORY_DIR / "active-session.json"
    if active_file.exists():
        active_file.unlink()

    # Log to feedback engine
    try:
        from feedback_engine import log_task_outcome
        for agent in session["agents_involved"]:
            log_task_outcome(
                agent=agent,
                task_type=session["type"],
                success=success,
                duration_minutes=int(session["duration_minutes"]),
                learnings=learnings or []
            )
    except ImportError:
        pass

    print(f"Session ended: {session_id}")
    print(f"Duration: {session['duration_minutes']} minutes")
    print(f"Outcome: {session['outcome']}")

    return session


def log_collaboration(
    from_ai: str,
    to_ai: str,
    message_type: str,
    context: str = None
) -> dict:
    """
    Log an inter-AI collaboration event.

    Args:
        from_ai: Source AI (claude, antigravity, gemini)
        to_ai: Target AI
        message_type: Type of message (handoff, status, request, response)
        context: Additional context

    Returns:
        Collaboration record
    """
    ensure_directories()

    # Load existing log
    if COLLAB_LOG.exists():
        with open(COLLAB_LOG, 'r', encoding='utf-8') as f:
            log = json.load(f)
    else:
        log = {"events": [], "stats": {}}

    # Create event
    event = {
        "timestamp": datetime.now().isoformat(),
        "from": from_ai,
        "to": to_ai,
        "type": message_type,
        "context": context
    }
    log["events"].append(event)

    # Update stats
    pair = f"{from_ai}->{to_ai}"
    if pair not in log["stats"]:
        log["stats"][pair] = 0
    log["stats"][pair] += 1

    # Keep only last 1000 events
    if len(log["events"]) > 1000:
        log["events"] = log["events"][-1000:]

    # Save
    with open(COLLAB_LOG, 'w', encoding='utf-8') as f:
        json.dump(log, f, indent=2)

    # Update active session if exists
    active_file = MEMORY_DIR / "active-session.json"
    if active_file.exists():
        with open(active_file, 'r', encoding='utf-8') as f:
            active = json.load(f)

        session_file = SESSIONS_DIR / f"{active['session_id']}.json"
        if session_file.exists():
            with open(session_file, 'r', encoding='utf-8') as f:
                session = json.load(f)
            session["inter_ai_messages"] += 1
            with open(session_file, 'w', encoding='utf-8') as f:
                json.dump(session, f, indent=2)

    return event


def get_active_session() -> dict:
    """Get the currently active session if any."""
    active_file = MEMORY_DIR / "active-session.json"

    if not active_file.exists():
        return None

    with open(active_file, 'r', encoding='utf-8') as f:
        active = json.load(f)

    session_file = SESSIONS_DIR / f"{active['session_id']}.json"
    if session_file.exists():
        with open(session_file, 'r', encoding='utf-8') as f:
            return json.load(f)

    return None


def generate_report(days: int = 7) -> dict:
    """
    Generate a session activity report.

    Args:
        days: Number of days to include in report

    Returns:
        Report dict with metrics and trends
    """
    ensure_directories()

    cutoff = datetime.now() - timedelta(days=days)
    sessions = []

    for session_file in SESSIONS_DIR.glob("*.json"):
        with open(session_file, 'r', encoding='utf-8') as f:
            session = json.load(f)

        if session.get("ended_at"):
            ended = datetime.fromisoformat(session["ended_at"])
            if ended >= cutoff:
                sessions.append(session)

    if not sessions:
        return {
            "period_days": days,
            "total_sessions": 0,
            "message": "No sessions in this period"
        }

    # Calculate metrics
    total = len(sessions)
    successful = sum(1 for s in sessions if s.get("outcome") == "success")
    total_duration = sum(s.get("duration_minutes", 0) for s in sessions)
    total_collab = sum(s.get("inter_ai_messages", 0) for s in sessions)

    # Session types breakdown
    types = {}
    for s in sessions:
        t = s.get("type", "unknown")
        types[t] = types.get(t, 0) + 1

    # All learnings
    all_learnings = []
    for s in sessions:
        all_learnings.extend(s.get("learnings", []))

    # Load collaboration stats
    collab_stats = {}
    if COLLAB_LOG.exists():
        with open(COLLAB_LOG, 'r', encoding='utf-8') as f:
            log = json.load(f)
        collab_stats = log.get("stats", {})

    return {
        "generated": datetime.now().isoformat(),
        "period_days": days,
        "metrics": {
            "total_sessions": total,
            "successful_sessions": successful,
            "success_rate": round(successful / total, 3) if total > 0 else 0,
            "total_duration_minutes": round(total_duration, 1),
            "avg_duration_minutes": round(total_duration / total, 1) if total > 0 else 0,
            "total_inter_ai_messages": total_collab,
            "avg_collab_per_session": round(total_collab / total, 2) if total > 0 else 0
        },
        "session_types": types,
        "collaboration_stats": collab_stats,
        "learnings_captured": len(all_learnings),
        "recent_learnings": all_learnings[-10:]  # Last 10 learnings
    }


def detect_git_changes() -> list:
    """Detect files modified in current git status."""
    try:
        result = subprocess.run(
            ["git", "status", "--porcelain"],
            capture_output=True,
            text=True,
            cwd=Path(__file__).parent.parent
        )
        files = []
        for line in result.stdout.strip().split('\n'):
            if line.strip():
                # Format: "XY filename" or "XY old -> new"
                parts = line.strip().split()
                if len(parts) >= 2:
                    files.append(parts[-1])
        return files
    except:
        return []


def main():
    """CLI entry point."""
    if len(sys.argv) < 2:
        print("""
Session Logger - AgOS 2.0

Usage:
    python session_logger.py start <type> [--project=NAME]
    python session_logger.py end <session_id> <success> [--summary=TEXT]
    python session_logger.py log-collab <from> <to> <type>
    python session_logger.py active
    python session_logger.py report [--days=7]

Session Types:
    debug, feature, review, collab, bugfix, deployment, research

Examples:
    python session_logger.py start debug --project=Poundtrades
    python session_logger.py end ses_20260201_1200_abc123 true --summary="Fixed SSR crash"
    python session_logger.py log-collab claude antigravity handoff
    python session_logger.py report --days=14
        """)
        sys.exit(1)

    command = sys.argv[1]

    if command == "start":
        if len(sys.argv) < 3:
            print("Usage: python session_logger.py start <type> [--project=NAME]")
            sys.exit(1)

        session_type = sys.argv[2]
        project = None

        for arg in sys.argv[3:]:
            if arg.startswith('--project='):
                project = arg.split('=')[1]

        session = start_session(session_type, project)
        print(f"\nSession ID: {session['id']}")

    elif command == "end":
        if len(sys.argv) < 4:
            print("Usage: python session_logger.py end <session_id> <success>")
            sys.exit(1)

        session_id = sys.argv[2]
        success = sys.argv[3].lower() in ('true', '1', 'yes')
        summary = None
        learnings = []

        for arg in sys.argv[4:]:
            if arg.startswith('--summary='):
                summary = arg.split('=', 1)[1]
            elif arg.startswith('--learning='):
                learnings.append(arg.split('=', 1)[1])

        # Auto-detect modified files
        files = detect_git_changes()

        end_session(session_id, success, summary, learnings, files)

    elif command == "log-collab":
        if len(sys.argv) < 5:
            print("Usage: python session_logger.py log-collab <from> <to> <type>")
            sys.exit(1)

        from_ai = sys.argv[2]
        to_ai = sys.argv[3]
        msg_type = sys.argv[4]
        context = sys.argv[5] if len(sys.argv) > 5 else None

        event = log_collaboration(from_ai, to_ai, msg_type, context)
        print(f"Logged: {from_ai} -> {to_ai} ({msg_type})")

    elif command == "active":
        session = get_active_session()
        if session:
            print(json.dumps(session, indent=2))
        else:
            print("No active session")

    elif command == "report":
        days = 7
        for arg in sys.argv[2:]:
            if arg.startswith('--days='):
                days = int(arg.split('=')[1])

        report = generate_report(days)
        print(json.dumps(report, indent=2))

    else:
        print(f"Unknown command: {command}")
        sys.exit(1)


if __name__ == "__main__":
    main()
