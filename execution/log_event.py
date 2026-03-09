"""
log_event.py — Log incidents, fixes, wins, deploys, and training days to Supabase.

Every significant event gets a permanent record in the `events` table:
what happened, which project, which agent, severity, how long to fix.

Usage:
    python execution/log_event.py incident "DB timeout on KPI views" --project glasbox --severity high
    python execution/log_event.py fix "Added connection pooling + retry" --resolves <uuid> --mins 45
    python execution/log_event.py win "Lighthouse score 97 on mobile" --project glasbox
    python execution/log_event.py deploy "v1.2.0 to production" --project glasbox --agent @owen
    python execution/log_event.py training "Training Day 12 — betting agents" --agent @marcus
    python execution/log_event.py milestone "63 agents fully validated" --agent @marcus
    python execution/log_event.py note "Discovered Supabase RLS blocks anon chatroom reads"

    # List recent events
    python execution/log_event.py list
    python execution/log_event.py list --type incident --status open
    python execution/log_event.py list --project glasbox --limit 20
"""

import sys
import os
import argparse
import json
from pathlib import Path
from datetime import datetime, timezone

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

import psycopg2
import psycopg2.extras
from dotenv import load_dotenv

load_dotenv()
ROOT = Path(__file__).parent.parent
CONNECTION_STRING = os.getenv("ANTIGRAVITY_BRAIN_CONNECTION_STRING")

VALID_TYPES = ("incident", "fix", "win", "deploy", "training", "milestone", "learning", "note")
VALID_SEVERITIES = ("critical", "high", "medium", "low")

TYPE_ICONS = {
    "incident": "[!!]",
    "fix":      "[FX]",
    "win":      "[OK]",
    "deploy":   "[UP]",
    "training": "[TD]",
    "milestone":"[**]",
    "learning": "[LN]",
    "note":     "[--]",
}


def get_conn():
    if not CONNECTION_STRING:
        print("ERROR: ANTIGRAVITY_BRAIN_CONNECTION_STRING not set in .env")
        sys.exit(1)
    return psycopg2.connect(CONNECTION_STRING)


def log_event(
    event_type: str,
    title: str,
    description: str = None,
    project: str = None,
    agent: str = None,
    severity: str = None,
    resolves_id: str = None,
    duration_mins: int = None,
    tags: list = None,
    meta: dict = None,
) -> str:
    """Insert an event. Returns the new event UUID."""
    conn = get_conn()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    # Normalise agent handle
    if agent and not agent.startswith("@"):
        agent = f"@{agent}"

    now = datetime.now(timezone.utc)
    resolved_at = now if event_type in ("fix", "win", "deploy", "milestone") else None

    cur.execute(
        """
        INSERT INTO events
            (event_type, project, title, description, agent, severity, status,
             resolves_id, duration_mins, tags, meta, created_at, resolved_at)
        VALUES
            (%s, %s, %s, %s, %s, %s,
             CASE WHEN %s IN ('fix','win','deploy','milestone') THEN 'resolved' ELSE 'open' END,
             %s, %s, %s, %s, %s, %s)
        RETURNING id;
        """,
        (
            event_type, project, title, description, agent, severity,
            event_type,
            resolves_id, duration_mins,
            tags or [], json.dumps(meta or {}),
            now, resolved_at,
        ),
    )
    row = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    event_id = str(row["id"])

    # If this fix resolves an incident, mark the incident resolved
    if event_type == "fix" and resolves_id:
        mark_resolved(resolves_id, event_id, now)

    return event_id


def mark_resolved(incident_id: str, fix_id: str, resolved_at: datetime):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        "UPDATE events SET status = 'resolved', resolved_at = %s WHERE id = %s;",
        (resolved_at, incident_id),
    )
    conn.commit()
    cur.close()
    conn.close()


def list_events(
    event_type: str = None,
    project: str = None,
    status: str = None,
    agent: str = None,
    limit: int = 20,
):
    conn = get_conn()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    conditions = []
    params = []
    if event_type:
        conditions.append("event_type = %s")
        params.append(event_type)
    if project:
        conditions.append("project ILIKE %s")
        params.append(f"%{project}%")
    if status:
        conditions.append("status = %s")
        params.append(status)
    if agent:
        a = agent if agent.startswith("@") else f"@{agent}"
        conditions.append("agent = %s")
        params.append(a)

    where = f"WHERE {' AND '.join(conditions)}" if conditions else ""
    params.append(limit)

    cur.execute(
        f"""
        SELECT id, event_type, project, title, agent, severity, status,
               duration_mins, created_at, resolved_at
        FROM events
        {where}
        ORDER BY created_at DESC
        LIMIT %s;
        """,
        params,
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows


def print_event_row(row: dict):
    icon = TYPE_ICONS.get(row["event_type"], "[?]")
    ts = row["created_at"].strftime("%Y-%m-%d %H:%M") if row["created_at"] else "?"
    project = f"[{row['project']}] " if row["project"] else ""
    agent = f" — {row['agent']}" if row["agent"] else ""
    severity = f" ({row['severity'].upper()})" if row["severity"] else ""
    status_tag = f" [{row['status'].upper()}]" if row["status"] != "resolved" else ""
    mins = f" {row['duration_mins']}m" if row["duration_mins"] else ""
    id_short = str(row["id"])[:8]

    print(f"  {icon} {ts} {project}{row['title']}{severity}{agent}{status_tag}{mins}  [{id_short}]")


def main():
    parser = argparse.ArgumentParser(description="Log events to the Antigravity Shared Brain")
    parser.add_argument("command", choices=[*VALID_TYPES, "list"], help="Event type or 'list'")
    parser.add_argument("title", nargs="?", default=None, help="Event title / description")
    parser.add_argument("--description", "-d", default=None, help="Extended description")
    parser.add_argument("--project", "-p", default=None, help="Project name")
    parser.add_argument("--agent", "-a", default=None, help="Agent handle (e.g. @marcus)")
    parser.add_argument("--severity", "-s", choices=VALID_SEVERITIES, default=None)
    parser.add_argument("--resolves", "-r", default=None, metavar="UUID", help="UUID of incident this fixes")
    parser.add_argument("--mins", "-m", type=int, default=None, help="Minutes to resolve")
    parser.add_argument("--tags", "-t", nargs="+", default=None, help="Tags")
    parser.add_argument("--type", dest="filter_type", default=None, help="Filter by type (list only)")
    parser.add_argument("--status", dest="filter_status", default=None, help="Filter by status (list only)")
    parser.add_argument("--limit", type=int, default=20, help="Max results (list only)")

    args = parser.parse_args()

    if args.command == "list":
        rows = list_events(
            event_type=args.filter_type,
            project=args.project,
            status=args.filter_status,
            agent=args.agent,
            limit=args.limit,
        )
        if not rows:
            print("  No events found.")
            return
        print(f"\n  {'=' * 56}")
        print(f"  EVENTS ({len(rows)} results)")
        print(f"  {'=' * 56}")
        for row in rows:
            print_event_row(row)
        print()
        return

    if not args.title:
        print(f"ERROR: title required for event type '{args.command}'")
        sys.exit(1)

    event_id = log_event(
        event_type=args.command,
        title=args.title,
        description=args.description,
        project=args.project,
        agent=args.agent,
        severity=args.severity,
        resolves_id=args.resolves,
        duration_mins=args.mins,
        tags=args.tags,
    )

    icon = TYPE_ICONS.get(args.command, "[?]")
    print(f"  {icon} Logged [{args.command.upper()}]: {args.title}")
    print(f"      ID: {event_id}")
    if args.resolves:
        print(f"      Resolves: {args.resolves}")


if __name__ == "__main__":
    main()
