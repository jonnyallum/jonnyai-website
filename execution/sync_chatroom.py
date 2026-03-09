"""
sync_chatroom.py — Parse local chatroom.md and upsert all history to Supabase.

Parses every session and message from .agent/boardroom/chatroom.md and
inserts them into the Supabase `chatroom` table using deterministic UUIDs
(UUID5 of content+timestamp) so re-runs never create duplicates.

Usage:
    python execution/sync_chatroom.py            # sync only
    python execution/sync_chatroom.py --archive  # sync + archive local file monthly
"""

import os
import re
import uuid
import sys
import shutil
from pathlib import Path
from datetime import datetime, timezone

# Force UTF-8 output on Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

import psycopg2
from dotenv import load_dotenv

load_dotenv()

ROOT_DIR = Path(__file__).parent.parent
CHATROOM_FILE = ROOT_DIR / ".agent" / "boardroom" / "chatroom.md"
ARCHIVE_DIR = ROOT_DIR / ".agent" / "boardroom" / "archive"
CONNECTION_STRING = os.getenv("ANTIGRAVITY_BRAIN_CONNECTION_STRING")

# ─── Namespace for deterministic UUIDs ────────────────────────────────────────
UUID_NS = uuid.UUID("6ba7b810-9dad-11d1-80b4-00c04fd430c8")

# ─── Legacy handle → current handle mapping ───────────────────────────────────
# Old chatroom used different handles. Map them to current agents or None (NULL).
HANDLE_MAP = {
    "conductor": "marcus",
    "jonny-ai": None,
    "jonny": None,
    "sentinel": "sam",
    "ecosystem-creator": "genesis",
    "nucleus": "quinn",
    "watcher": "watcher",
    "pixel": "priya",
    "archivist": "arthur",
    "forge": "sebastian",
    "gaffer": "marcus",
    "goldie": "felix",
    "echo": "elena",
    "devops": "derek",
    "deploy": "owen",
    "bookie": "sterling",
    "monte": "monty",
    "handicapper": "gareth",
    "scout": "sophie",
    "pitwall": "pietro",
    "tungsten": "theo",
    "manus": "executor",
    "warehouse": "quartermaster",
    "vaultguard": "victor",
    "counsel": "luna",
    "datastore": "diana",
    "adapter": "mason",
    "autoflow": "alex",
    "clippers": "carlos",
}

# ─── Regex patterns ───────────────────────────────────────────────────────────
SESSION_RE = re.compile(
    r"^###\s+(\d{4}-\d{2}-\d{2})\s*\|\s*(\d{2}:\d{2}(?::\d{2})?)\s*UTC",
    re.IGNORECASE,
)
# Matches: **@handle:** message  OR  @handle: message
MSG_RE = re.compile(r"^\*{0,2}@([\w\-]+)\*{0,2}:\s*(.+)", re.DOTALL)


def parse_chatroom(filepath: Path) -> list[dict]:
    """Parse chatroom.md into a list of message dicts."""
    lines = filepath.read_text(encoding="utf-8", errors="ignore").splitlines()

    messages = []
    current_ts = datetime(2026, 2, 1, 0, 0, 0, tzinfo=timezone.utc)  # fallback
    buffer_agent = None
    buffer_lines = []

    def flush_buffer():
        if buffer_agent and buffer_lines:
            text = " ".join(buffer_lines).strip()
            if len(text) < 3:
                return
            det_id = str(uuid.uuid5(UUID_NS, f"{buffer_agent}:{text[:200]}:{current_ts.isoformat()}"))
            messages.append({
                "id": det_id,
                "agent_id": buffer_agent.lower(),
                "message": text,
                "created_at": current_ts.isoformat(),
                "ai_source": "claude",
                "machine_id": "jonny-desktop",
                "message_type": "broadcast",
            })

    for line in lines:
        # New session header → flush buffer, update timestamp
        m = SESSION_RE.match(line.strip())
        if m:
            flush_buffer()
            buffer_agent = None
            buffer_lines = []
            date_str, time_str = m.group(1), m.group(2)
            try:
                current_ts = datetime.strptime(
                    f"{date_str} {time_str}", "%Y-%m-%d %H:%M"
                ).replace(tzinfo=timezone.utc)
            except ValueError:
                pass
            continue

        # New message line
        msg_match = MSG_RE.match(line.strip())
        if msg_match:
            flush_buffer()
            buffer_agent = msg_match.group(1)
            buffer_lines = [msg_match.group(2).strip()]
            continue

        # Continuation of current message (table rows, bullet points, etc.)
        if buffer_agent and line.strip() and not line.startswith("#"):
            buffer_lines.append(line.strip())

    flush_buffer()
    return messages


def resolve_agent_id(raw_handle: str, known_agents: set) -> str | None:
    """Map a raw chatroom handle to a valid agent ID or None."""
    h = raw_handle.lower()
    # Direct match
    if h in known_agents:
        return h
    # Legacy map
    if h in HANDLE_MAP:
        mapped = HANDLE_MAP[h]
        if mapped and mapped in known_agents:
            return mapped
        return None  # mapped to None = legacy/unknown, store as NULL
    return None  # completely unknown — store as NULL


def get_known_agents(conn) -> set:
    """Fetch all current agent IDs from Supabase."""
    cur = conn.cursor()
    cur.execute("SELECT id FROM agents;")
    ids = {row[0] for row in cur.fetchall()}
    cur.close()
    return ids


def sync_to_supabase(messages: list[dict]) -> tuple[int, int]:
    """Upsert messages to Supabase chatroom table. Returns (inserted, skipped)."""
    conn = psycopg2.connect(CONNECTION_STRING)
    known = get_known_agents(conn)
    cur = conn.cursor()

    inserted = 0
    skipped = 0

    for msg in messages:
        agent_id = resolve_agent_id(msg["agent_id"], known)
        try:
            cur.execute(
                """
                INSERT INTO chatroom (id, ai_source, machine_id, agent_id, message,
                                      message_type, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO NOTHING;
                """,
                (
                    msg["id"],
                    msg["ai_source"],
                    msg["machine_id"],
                    agent_id,
                    msg["message"],
                    msg["message_type"],
                    msg["created_at"],
                ),
            )
            if cur.rowcount == 1:
                inserted += 1
            else:
                skipped += 1
        except Exception as e:
            print(f"  [!] Error inserting {msg['id'][:8]}: {e}")
            conn.rollback()
            conn = psycopg2.connect(CONNECTION_STRING)
            known = get_known_agents(conn)
            cur = conn.cursor()

    conn.commit()
    cur.close()
    conn.close()
    return inserted, skipped


def archive_chatroom():
    """
    Archive chatroom.md with a dated filename and reset the local file
    to the standard header (preserving the last 30 days of entries is
    handled by Supabase — local file is now just the active scratchpad).
    """
    ARCHIVE_DIR.mkdir(parents=True, exist_ok=True)
    today = datetime.now().strftime("%Y-%m")
    dest = ARCHIVE_DIR / f"chatroom_{today}.md"
    shutil.copy2(CHATROOM_FILE, dest)
    print(f"  Archived to: {dest}")

    # Reset local file to clean header
    header = """# 💬 The Antigravity Chatroom

> **Status:** LIVE | **Mode:** High-Velocity Collaboration
> This is a shared space for the Antigravity Agent Orchestra to brainstorm, banter, and coordinate in real-time.
> Full history is preserved in the Supabase Shared Brain — archive at: `.agent/boardroom/archive/`

---

## 📜 Chatroom Protocol

1. **Handle Prefixing:** Always prefix your message with your agent name (e.g., `@Pixel: `).
2. **Contextual Threading:** Use the date/time header for new sessions.
3. **Actionable Banter:** Banter is encouraged, but keep the mission in sight.
4. **Knowledge Harvest:** @arthur will periodically extract key decisions into `DECISION_LOG.md`.
5. **Session Separation:** Use `---` with a timestamp to separate chat blocks.

---

## 📡 The Feed

"""
    CHATROOM_FILE.write_text(header, encoding="utf-8")
    print("  Local chatroom.md reset to clean state.")


def main():
    archive = "--archive" in sys.argv

    print("=" * 60)
    print("CHATROOM SYNC — Supabase Shared Brain")
    print("=" * 60)

    if not CHATROOM_FILE.exists():
        print(f"ERROR: {CHATROOM_FILE} not found.")
        sys.exit(1)

    if not CONNECTION_STRING:
        print("ERROR: ANTIGRAVITY_BRAIN_CONNECTION_STRING not set in .env")
        sys.exit(1)

    print(f"\nParsing {CHATROOM_FILE.name}…")
    messages = parse_chatroom(CHATROOM_FILE)
    print(f"  Found {len(messages)} messages to sync.")

    if not messages:
        print("Nothing to sync.")
        return

    print("\nUpserting to Supabase chatroom table…")
    inserted, skipped = sync_to_supabase(messages)
    print(f"  OK Inserted: {inserted}  |  Already existed: {skipped}")

    if archive:
        print("\nArchiving local chatroom.md…")
        archive_chatroom()

    print("\nSync complete. Chatroom history is now in the Shared Brain.")
    print(f"To archive locally: python execution/sync_chatroom.py --archive")


if __name__ == "__main__":
    main()
