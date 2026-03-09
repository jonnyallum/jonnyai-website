"""
chatroom_listener.py — Antigravity Social Broadcast Loop v2.0
==============================================================
Jai.OS 5.0 | Upgraded to use social_engine.py for all content generation.

Upgrades over v1:
  1. Uses SocialEngine v2.0 (10 pillars, quality gate, delegation, context)
  2. Expanded trigger map (6 new tags: [CLIENT_WIN], [BTS], [TIP], [POLL], [CULTURE], [REPORT])
  3. Content calendar processing — checks for scheduled content every cycle
  4. Auto-onboarding hook — detects new agent inserts and fires [AGENT] tag
  5. Post history logged to social_posts table for dedup and analytics
  6. LinkedIn copy generated (queued for future integration)

Architecture: REST API polling (cursor-based). No WebSocket needed.
Confirmed working: FB post ID 969852546211527_122109040251242995 (2026-02-27)

Auto-start: Registered in Windows Startup folder.
    C:\\Users\\jonny\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\antigravity_listener.bat

Usage:
    python execution/chatroom_listener.py
    python execution/chatroom_listener.py --dry-run    # detect tags only, no posting
"""

import os
import sys
import json
import time
import argparse
from pathlib import Path
from datetime import datetime, timezone, timedelta

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(r"C:\Users\jonny\Desktop\JonnyAI_JaiOS_5.0")

# ── Supabase (Shared Brain) ──────────────────────────────────────────────────
BRAIN_URL = os.getenv("ANTIGRAVITY_BRAIN_URL")
BRAIN_KEY = os.getenv("ANTIGRAVITY_BRAIN_ANON_KEY")

# ── State files ───────────────────────────────────────────────────────────────
STATE_DIR = ROOT / ".tmp" / "social-sync"
STATE_DIR.mkdir(parents=True, exist_ok=True)
PROCESSED_LOG = STATE_DIR / "listener_processed.json"
CURSOR_FILE   = STATE_DIR / "listener_cursor.json"
AGENT_CURSOR  = STATE_DIR / "agent_cursor.json"

POLL_INTERVAL = 5  # seconds
CALENDAR_CHECK_INTERVAL = 300  # check content calendar every 5 minutes

# ── Import Social Engine ─────────────────────────────────────────────────────
sys.path.insert(0, str(ROOT / "execution"))
try:
    from social_engine import SocialEngine, TRIGGER_MAP
except ImportError:
    # Fallback: define locally if social_engine not found
    sys.path.insert(0, str(Path(__file__).parent))
    from social_engine import SocialEngine, TRIGGER_MAP


# ── Helpers ───────────────────────────────────────────────────────────────────

def _load_processed() -> set:
    if PROCESSED_LOG.exists():
        return set(json.loads(PROCESSED_LOG.read_text(encoding="utf-8")))
    return set()


def _mark_processed(msg_id: str):
    p = _load_processed()
    p.add(str(msg_id))
    PROCESSED_LOG.write_text(json.dumps(list(p), indent=2), encoding="utf-8")


def _load_cursor() -> str:
    """Load the last-seen `created_at` timestamp."""
    if CURSOR_FILE.exists():
        data = json.loads(CURSOR_FILE.read_text(encoding="utf-8"))
        return data.get("since", "1970-01-01T00:00:00Z")
    # Default: only pick up messages from right now
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")


def _save_cursor(since: str):
    CURSOR_FILE.write_text(json.dumps({
        "since": since,
        "updated": datetime.now().isoformat()
    }), encoding="utf-8")


def _load_agent_cursor() -> str:
    """Track the last known agent count for auto-onboarding detection."""
    if AGENT_CURSOR.exists():
        data = json.loads(AGENT_CURSOR.read_text(encoding="utf-8"))
        return data.get("last_count", 0)
    return 0


def _save_agent_cursor(count: int):
    AGENT_CURSOR.write_text(json.dumps({
        "last_count": count,
        "updated": datetime.now().isoformat()
    }), encoding="utf-8")


def _get_supabase():
    from supabase import create_client
    return create_client(BRAIN_URL, BRAIN_KEY)


def _detect_tag(message: str):
    """Return (tag, pillar) for the first matching trigger tag, or (None, None)."""
    for tag, pillar in TRIGGER_MAP.items():
        if tag in message:
            return tag, pillar
    return None, None


# ── Core processing ───────────────────────────────────────────────────────────

def process_row(row: dict, engine: SocialEngine, dry_run: bool = False):
    """Handle a single chatroom row via SocialEngine v2.0."""
    msg_id = str(row.get("id", ""))
    message = row.get("message", "")
    agent = row.get("agent_id", "unknown")
    project = row.get("project_context", None)
    ts = row.get("created_at", "")[:16]

    processed = _load_processed()
    if msg_id in processed:
        return  # Already handled

    tag, pillar = _detect_tag(message)
    if not pillar:
        return  # No trigger

    print(f"\n[{ts}] @{agent} -- {tag} detected -> {pillar}")
    print(f"  Message: {message[:120]}...")

    # ── [COLLAB] → Gemini parallel run (no social post) ──────────────────────
    if pillar == "COLLAB":
        try:
            from gemini_collab import run_collab
            task = message.replace("[COLLAB]", "").strip()
            print(f"  Spinning up Gemini collab run...")
            run_collab(task, context="Antigravity Orchestra, industrial AI agency tone")
        except Exception as e:
            print(f"  Gemini collab error: {e}")
        _mark_processed(msg_id)
        return

    # ── Standard trigger → SocialEngine v2.0 pipeline ────────────────────────
    result = engine.process_trigger(
        message=message,
        source_agent=agent,
        project_id=project,
        dry_run=dry_run
    )

    # Save audit trail
    out = STATE_DIR / f"listener_{msg_id}.json"
    out.write_text(json.dumps({
        "id": msg_id, "agent": agent, "tag": tag, "pillar": pillar,
        "message": message, "result": result,
        "timestamp": datetime.now().isoformat()
    }, indent=2, ensure_ascii=False), encoding="utf-8")

    _mark_processed(msg_id)


def check_new_agents(sb, engine: SocialEngine, dry_run: bool = False):
    """
    Auto-onboarding hook: detect new agents added to the agents table
    and fire an [AGENT] spotlight if the listener hasn't seen them yet.
    """
    try:
        result = sb.table("agents").select("id, name, role, created_at", count="exact").execute()
        current_count = result.count or len(result.data or [])
        last_count = _load_agent_cursor()

        if current_count > last_count and last_count > 0:
            # New agents detected — find the ones added since last check
            new_agents = sorted(result.data, key=lambda x: x.get("created_at", ""))[-( current_count - last_count):]
            for agent in new_agents:
                name = agent.get("name", "Unknown")
                handle = agent.get("id", "unknown")
                role = agent.get("role", "Specialist")
                print(f"\n  NEW AGENT DETECTED: @{handle} ({name}) — {role}")
                message = f"[AGENT] Meet @{handle} — {name}, {role}. The newest member of the Antigravity Orchestra."
                engine.process_trigger(message, source_agent="system", dry_run=dry_run)

        _save_agent_cursor(current_count)

    except Exception as e:
        print(f"  Agent check error: {e}")


# ── Main polling loop ─────────────────────────────────────────────────────────

def run(dry_run: bool = False):
    print(f"""
+==============================================================+
|  Antigravity Social Broadcast Loop v2.0                       |
|  Jai.OS 5.0 | SocialEngine v2.0                              |
|  Poll: {POLL_INTERVAL}s | Pillars: 10 | Quality Gate: ACTIVE             |
|  Calendar check: every {CALENDAR_CHECK_INTERVAL}s                                |
|  Auto-onboarding: ACTIVE                                     |
+--------------------------------------------------------------+
|  {"DRY RUN MODE -- no social posts will fire" if dry_run else "LIVE MODE -- trigger tags will post to FB + IG + LI (queued)"}
+==============================================================+
""")

    if not BRAIN_URL or not BRAIN_KEY:
        print("ANTIGRAVITY_BRAIN_URL or ANTIGRAVITY_BRAIN_ANON_KEY missing. Check .env")
        sys.exit(1)

    sb = _get_supabase()
    engine = SocialEngine()
    since = _load_cursor()
    last_calendar_check = 0

    print(f"  Cursor: {since}")
    print(f"  Triggers: {', '.join(TRIGGER_MAP.keys())}")
    print(f"  Listening... (Ctrl+C to stop)\n")

    while True:
        try:
            # ── Poll chatroom for new trigger-tagged messages ────────────────
            rows = (
                sb.table("chatroom")
                .select("id, agent_id, message, project_context, created_at")
                .gt("created_at", since)
                .order("created_at", desc=False)
                .execute()
            )

            if rows.data:
                since = rows.data[-1]["created_at"]
                _save_cursor(since)

                for row in rows.data:
                    process_row(row, engine, dry_run=dry_run)

            # ── Check content calendar (every 5 minutes) ────────────────────
            now = time.time()
            if now - last_calendar_check > CALENDAR_CHECK_INTERVAL:
                last_calendar_check = now
                print(f"  [{datetime.now().strftime('%H:%M')}] Checking content calendar...")
                engine.process_calendar(dry_run=dry_run)

                # Also check for new agents (auto-onboarding hook)
                check_new_agents(sb, engine, dry_run=dry_run)

        except KeyboardInterrupt:
            print("\n  Listener stopped.")
            break
        except Exception as e:
            print(f"  Poll error: {e} -- retrying in {POLL_INTERVAL}s")

        time.sleep(POLL_INTERVAL)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Antigravity Social Broadcast Loop v2.0")
    parser.add_argument("--dry-run", action="store_true", help="Detect tags only, no posting")
    args = parser.parse_args()
    run(dry_run=args.dry_run)
