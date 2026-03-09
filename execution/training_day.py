"""
training_day.py — Agent Training Day protocol.

Designed to run as a scheduled cron job (Windows Task Scheduler or cron).
Produces a training brief, logs the session, and posts to chatroom.

What it does:
  1. Validates all agents (fail-fast if any broken)
  2. Queries Supabase for learning activity in the last N days
  3. Identifies inactive agents (no learnings recently)
  4. Analyses skill gaps from the catalog
  5. Generates a TRAINING_BRIEF.md with focused tasks for each tier
  6. Logs the training day event to the events table
  7. Posts a broadcast to the chatroom

Usage:
    python execution/training_day.py              # standard run (last 7 days)
    python execution/training_day.py --days 14    # look back 14 days
    python execution/training_day.py --dry-run    # generate brief without writing to Supabase
    python execution/training_day.py --brief-only # generate brief, skip Supabase writes

Cron setup (Windows Task Scheduler):
    Action: python C:\\path\\to\\execution\\training_day.py
    Trigger: Weekly, Monday 09:00
    Working dir: C:\\Users\\jonny\\Desktop\\JonnyAI_JaiOS_5.0

Cron setup (Unix/WSL):
    0 9 * * 1 cd /path/to/JonnyAI_JaiOS_5.0 && python execution/training_day.py
"""

import sys
import os
import subprocess
import re
from pathlib import Path
from datetime import datetime, timedelta, timezone, date
import argparse

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from dotenv import load_dotenv
load_dotenv()

import psycopg2
import psycopg2.extras

ROOT = Path(__file__).parent.parent
SKILLS_DIR = ROOT / ".agent" / "skills"
CATALOG_FILE = ROOT / ".agent" / "library" / "SKILL_CATALOG.md"
CHATROOM = ROOT / ".agent" / "boardroom" / "chatroom.md"
OUTPUT = ROOT / ".agent" / "boardroom" / "TRAINING_BRIEF.md"
CONNECTION_STRING = os.getenv("ANTIGRAVITY_BRAIN_CONNECTION_STRING")

SEP = "=" * 60


def get_conn():
    if not CONNECTION_STRING:
        print("  ERROR: ANTIGRAVITY_BRAIN_CONNECTION_STRING not set")
        sys.exit(1)
    return psycopg2.connect(CONNECTION_STRING)


def run_validator() -> tuple[int, int]:
    """Run validate_agents.py and return (total, valid)."""
    result = subprocess.run(
        [sys.executable, str(ROOT / "execution" / "validate_agents.py")],
        capture_output=True, text=True, encoding="utf-8", errors="replace",
        cwd=str(ROOT),
    )
    out = result.stdout + result.stderr
    total_m = re.search(r"Total agents checked:\s*(\d+)", out)
    valid_m = re.search(r"Valid.*?:\s*(\d+)", out)
    total = int(total_m.group(1)) if total_m else 0
    valid = int(valid_m.group(1)) if valid_m else 0
    return total, valid


def get_recent_learnings(days: int) -> dict[str, list[str]]:
    """Return {agent_handle: [learning, ...]} for learnings in last N days."""
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)
    conn = get_conn()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        """
        SELECT source_agent, learning
        FROM learnings
        WHERE created_at >= %s
        ORDER BY created_at DESC;
        """,
        (cutoff,),
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()

    result: dict[str, list[str]] = {}
    for row in rows:
        handle = row["source_agent"] or "unknown"
        result.setdefault(handle, []).append(row["learning"])
    return result


def get_all_agents() -> list[dict]:
    """Read agent handles and tiers from SKILL.md files."""
    agents = []
    for d in sorted(SKILLS_DIR.iterdir()):
        if not d.is_dir() or d.name == "methodology":
            continue
        sf = d / "SKILL.md"
        if not sf.exists():
            continue
        content = sf.read_text(encoding="utf-8", errors="ignore")
        tier_m = re.search(r"^tier:\s*(.+)", content, re.MULTILINE)
        agents.append({
            "handle": d.name,
            "tier": tier_m.group(1).strip() if tier_m else "Uncategorized",
        })
    return agents


def get_skill_sop_coverage() -> dict[str, bool]:
    """Return {skill_handle: has_sop} from the catalog."""
    if not CATALOG_FILE.exists():
        return {}
    lines = CATALOG_FILE.read_text(encoding="utf-8", errors="ignore").splitlines()
    row_re = re.compile(r"^\|\s*`([\w\-]+)`\s*\|")
    coverage = {}
    for line in lines:
        m = row_re.match(line)
        if m:
            handle = m.group(1)
            sop_path = SKILLS_DIR / "methodology" / handle / "SKILL.md"
            coverage[handle] = sop_path.exists()
    return coverage


def get_open_incidents() -> list[dict]:
    """Fetch open incidents from the events table."""
    try:
        conn = get_conn()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            """
            SELECT id, title, project, agent, severity, created_at
            FROM events
            WHERE event_type = 'incident' AND status = 'open'
            ORDER BY
                CASE severity
                    WHEN 'critical' THEN 1
                    WHEN 'high'     THEN 2
                    WHEN 'medium'   THEN 3
                    ELSE 4
                END,
                created_at;
            """
        )
        rows = [dict(r) for r in cur.fetchall()]
        cur.close()
        conn.close()
        return rows
    except Exception:
        return []


def log_training_event(day_number: int, brief_summary: str, dry_run: bool):
    """Log this training day to the events table."""
    if dry_run:
        print("  [DRY] Would log training day event to Supabase")
        return None
    try:
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO events (event_type, title, description, agent, tags, status)
            VALUES ('training', %s, %s, '@marcus', ARRAY['training-day', 'orchestra'], 'resolved')
            RETURNING id;
            """,
            (
                f"Training Day — {date.today().isoformat()}",
                brief_summary,
            ),
        )
        row = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        return str(row[0])
    except Exception as e:
        print(f"  [WARN] Could not log to events table: {e}")
        return None


def append_chatroom(message: str, dry_run: bool):
    if dry_run:
        print(f"  [DRY] Would post to chatroom: {message[:80]}...")
        return
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    if CHATROOM.exists():
        existing = CHATROOM.read_text(encoding="utf-8", errors="ignore")
        CHATROOM.write_text(existing + f"\n[{ts}] {message}\n", encoding="utf-8")


def build_brief(
    agents: list[dict],
    recent_learnings: dict[str, list[str]],
    total_valid: tuple[int, int],
    open_incidents: list[dict],
    sop_coverage: dict[str, bool],
    days: int,
) -> str:
    today = date.today().isoformat()
    total, valid = total_valid

    active_agents = set(recent_learnings.keys())
    all_handles = {a["handle"] for a in agents}
    inactive = sorted(all_handles - active_agents)
    total_learnings = sum(len(v) for v in recent_learnings.values())
    skills_missing_sop = [k for k, v in sop_coverage.items() if not v]

    lines = [
        f"# Training Day Brief — {today}",
        f"",
        f"> Auto-generated by `execution/training_day.py`",
        f"",
        f"---",
        f"",
        f"## Orchestra Status",
        f"",
        f"| Metric | Value |",
        f"|:---|:---|",
        f"| Agents validated | {valid} / {total} |",
        f"| Active agents (last {days}d) | {len(active_agents)} / {total} |",
        f"| Inactive agents (last {days}d) | {len(inactive)} |",
        f"| New learnings (last {days}d) | {total_learnings} |",
        f"| Open incidents | {len(open_incidents)} |",
        f"| Skills missing SOP | {len(skills_missing_sop)} |",
        f"",
    ]

    # Open incidents
    if open_incidents:
        lines += [
            "## Open Incidents — Address First",
            "",
            "| ID | Title | Project | Severity | Agent |",
            "|:---|:---|:---|:---|:---|",
        ]
        for inc in open_incidents:
            id_short = str(inc["id"])[:8]
            sev = inc["severity"] or "?"
            project = inc["project"] or "—"
            agent = inc["agent"] or "—"
            lines.append(f"| `{id_short}` | {inc['title']} | {project} | **{sev}** | {agent} |")
        lines += [""]

    # Inactive agents
    if inactive:
        lines += [
            f"## Inactive Agents — Need Training Tasks (no learnings in {days}d)",
            "",
        ]
        tiers: dict[str, list[str]] = {}
        for a in agents:
            if a["handle"] in inactive:
                tiers.setdefault(a["tier"], []).append(a["handle"])
        for tier, handles in sorted(tiers.items()):
            lines.append(f"**{tier}:** {', '.join(f'@{h}' for h in sorted(handles))}")
        lines += [""]

    # Active agents learning summary
    if recent_learnings:
        lines += [
            f"## Recent Learnings (last {days}d)",
            "",
        ]
        for handle in sorted(recent_learnings.keys()):
            learnings = recent_learnings[handle]
            lines.append(f"**@{handle}** ({len(learnings)} learning{'s' if len(learnings) != 1 else ''}):")
            for l in learnings[:3]:
                snippet = l[:120] + "..." if len(l) > 120 else l
                lines.append(f"  - {snippet}")
            if len(learnings) > 3:
                lines.append(f"  - _{len(learnings) - 3} more..._")
            lines.append("")

    # Skills gaps
    if skills_missing_sop:
        lines += [
            "## Skills Missing SOP Files",
            "",
            f"{len(skills_missing_sop)} skills in the catalog have no SOP on disk:",
            "",
        ]
        for s in sorted(skills_missing_sop)[:20]:
            lines.append(f"  - `{s}`")
        if len(skills_missing_sop) > 20:
            lines.append(f"  - _...and {len(skills_missing_sop) - 20} more_")
        lines += [""]

    # Training tasks
    lines += [
        "## Suggested Training Tasks",
        "",
        "### Priority 1 — Resolve open incidents",
    ]
    if open_incidents:
        for inc in open_incidents[:3]:
            lines.append(f"- `log_event.py fix` when resolved: **{inc['title']}**")
    else:
        lines.append("- No open incidents.")

    lines += [
        "",
        "### Priority 2 — Re-engage inactive agents",
    ]
    if inactive:
        for h in inactive[:5]:
            lines.append(f"- @{h}: run a domain task and log a learning to the Shared Brain")
        if len(inactive) > 5:
            lines.append(f"- _{len(inactive) - 5} more inactive agents_")
    else:
        lines.append("- All agents active — no inactive agents this period.")

    lines += [
        "",
        "### Priority 3 — Fill SOP gaps",
    ]
    if skills_missing_sop:
        for s in skills_missing_sop[:5]:
            lines.append(f"- Create `.agent/skills/methodology/{s}/SKILL.md`")
    else:
        lines.append("- All skills have SOP files.")

    lines += [
        "",
        "---",
        "",
        f"*Generated: {today} | Next training day: {(date.today() + timedelta(days=7)).isoformat()}*",
        "",
    ]

    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="Agent Training Day Protocol")
    parser.add_argument("--days", type=int, default=7, help="Lookback period in days")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--brief-only", action="store_true", help="Generate brief, skip Supabase writes")
    args = parser.parse_args()

    dry_run = args.dry_run or args.brief_only

    print(f"\n{SEP}")
    print(f"  TRAINING DAY — {date.today().isoformat()}")
    print(SEP)

    # 1. Validate
    print("\n  [1/5] Validating agents...")
    total, valid = run_validator()
    print(f"        {valid}/{total} valid")
    if valid < total:
        print(f"  ABORT: {total - valid} agent(s) failing validation. Fix before training day.")
        sys.exit(1)

    # 2. Recent learnings
    print(f"\n  [2/5] Fetching learnings (last {args.days} days)...")
    recent_learnings = get_recent_learnings(args.days)
    print(f"        {sum(len(v) for v in recent_learnings.values())} learnings from {len(recent_learnings)} agents")

    # 3. Agent list
    print("\n  [3/5] Reading agent roster...")
    agents = get_all_agents()
    print(f"        {len(agents)} agents in roster")

    # 4. Open incidents
    print("\n  [4/5] Checking open incidents...")
    open_incidents = get_open_incidents()
    print(f"        {len(open_incidents)} open incident(s)")

    # 5. SOP coverage
    sop_coverage = get_skill_sop_coverage()
    missing_sop = sum(1 for v in sop_coverage.values() if not v)

    # Build brief
    print("\n  [5/5] Generating training brief...")
    brief = build_brief(
        agents, recent_learnings, (total, valid),
        open_incidents, sop_coverage, args.days,
    )
    OUTPUT.write_text(brief, encoding="utf-8")
    print(f"        Brief written to: {OUTPUT.relative_to(ROOT)}")

    # Summary for event log + chatroom
    active = len(recent_learnings)
    inactive = len(agents) - active
    summary = (
        f"Training Day {date.today().isoformat()} — {valid}/{total} agents valid, "
        f"{active} active, {inactive} inactive, {len(open_incidents)} open incidents."
    )

    # Log to events table
    if not dry_run:
        event_id = log_training_event(0, summary, dry_run)
        if event_id:
            print(f"\n  [OK] Logged to events table: {event_id}")

    # Chatroom broadcast
    chatroom_msg = (
        f"TRAINING DAY COMPLETE — {valid}/{total} agents valid | "
        f"{active} active | {inactive} inactive | "
        f"{len(open_incidents)} open incidents | Brief: .agent/boardroom/TRAINING_BRIEF.md — @marcus"
    )
    append_chatroom(chatroom_msg, dry_run)
    if not dry_run:
        print(f"  [OK] Posted to chatroom")

    print(f"\n{SEP}")
    print(f"  TRAINING DAY COMPLETE")
    print(SEP)
    print(f"\n  Brief: .agent/boardroom/TRAINING_BRIEF.md")
    print(f"  Run `python execution/log_event.py list --type training` to see history\n")


if __name__ == "__main__":
    main()
