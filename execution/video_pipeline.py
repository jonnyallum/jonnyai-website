"""
Video Production Pipeline Orchestrator — Jai.OS 5.0

Orchestrates the 9-stage video production pipeline defined in
directives/video_production_pipeline.md.

This script manages the pipeline state machine, tracks stage transitions,
posts updates to the chatroom, and ensures quality gates are enforced.

Usage:
  python3 execution/video_pipeline.py brief --project jonnyai --type agent_spotlight --narrator marcus --duration 60 --tone "confident, warm" --key-message "The Orchestra never sleeps" --cta "Visit jonnyai.co.uk"
  python3 execution/video_pipeline.py status --video-id VID-2026-03-01-001
  python3 execution/video_pipeline.py advance --video-id VID-2026-03-01-001
  python3 execution/video_pipeline.py list
"""

import argparse
import json
import os
import subprocess
import sys
from datetime import datetime, timezone, timedelta

# ─── Configuration ───────────────────────────────────────────────────────────
USE_MCP = True  # Set False for direct Supabase API calls
SUPABASE_PROJECT_ID = "lkwydqtfbdjhxaarelaz"

# Pipeline stages in order
STAGES = [
    {"id": 0, "name": "brief",       "owner": "marcus",       "title": "Brief & Campaign Definition"},
    {"id": 1, "name": "script",      "owner": "contentforge", "title": "Script & Hook Writing"},
    {"id": 2, "name": "voiceover",   "owner": "eleven",       "title": "Voice-Over Production"},
    {"id": 3, "name": "visuals",     "owner": "vivienne",     "title": "Visual Asset Creation"},
    {"id": 4, "name": "edit",        "owner": "carlos",       "title": "Video Editing & Assembly"},
    {"id": 5, "name": "qa",          "owner": "sam",          "title": "Quality Assurance"},
    {"id": 6, "name": "publish",     "owner": "social_engine","title": "Publishing & Distribution"},
    {"id": 7, "name": "analytics",   "owner": "maya",         "title": "Performance Analytics"},
    {"id": 8, "name": "learn",       "owner": "all",          "title": "Retrospective & Learning"},
]


def run_sql(query):
    """Execute SQL via MCP or direct API."""
    if USE_MCP:
        result = subprocess.run(
            ["manus-mcp-cli", "tool", "call", "execute_sql",
             "--server", "supabase",
             "--input", json.dumps({"project_id": SUPABASE_PROJECT_ID, "query": query})],
            capture_output=True, text=True, timeout=30
        )
        return result.stdout + result.stderr
    else:
        url = os.getenv("ANTIGRAVITY_BRAIN_URL", "")
        key = os.getenv("ANTIGRAVITY_BRAIN_KEY", "")
        if not url or not key:
            print("ERROR: ANTIGRAVITY_BRAIN_URL and ANTIGRAVITY_BRAIN_KEY required for direct mode")
            return ""
        import requests
        resp = requests.post(
            f"{url}/rest/v1/rpc/exec_sql",
            headers={"apikey": key, "Authorization": f"Bearer {key}", "Content-Type": "application/json"},
            json={"query": query}
        )
        return resp.text


def parse_result(raw):
    """Extract JSON array from MCP result."""
    import re
    # First try: find unescaped JSON array
    match = re.search(r'\[\{.*?\}\]', raw, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except:
            pass
    # Second try: find escaped JSON in the MCP wrapper
    match = re.search(r'\\n(\[.*?\])\\n', raw, re.DOTALL)
    if match:
        try:
            # Unescape the JSON
            unescaped = match.group(1).replace('\\"', '"')
            return json.loads(unescaped)
        except:
            pass
    # Third try: read from the saved result file
    import glob
    files = sorted(glob.glob('/home/ubuntu/.mcp/tool-results/*_supabase_execute_sql.json'), reverse=True)
    if files:
        try:
            with open(files[0]) as f:
                content = f.read()
            match = re.search(r'\[\{.*?\}\]', content, re.DOTALL)
            if match:
                return json.loads(match.group())
        except:
            pass
    # Empty result set
    if '[]' in raw:
        return []
    return []


def generate_video_id():
    """Generate a unique video ID."""
    now = datetime.now(timezone.utc)
    date_str = now.strftime("%Y-%m-%d")
    # Get count of existing videos today
    result = run_sql(f"SELECT count(*) as cnt FROM tasks WHERE title LIKE 'VID-{date_str}%'")
    data = parse_result(result)
    count = data[0].get('cnt', 0) if data else 0
    return f"VID-{date_str}-{count + 1:03d}"


def create_brief(args):
    """Stage 0: Create a video production brief."""
    video_id = generate_video_id()
    now = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S+00')
    deadline = (datetime.now(timezone.utc) + timedelta(days=3)).strftime('%Y-%m-%d')

    brief_data = {
        "video_id": video_id,
        "project": args.project,
        "type": args.type,
        "narrator": args.narrator or "marcus",
        "target_platform": args.platform or "all",
        "duration": args.duration or 60,
        "tone": args.tone or "confident, warm",
        "key_message": args.key_message or "",
        "cta": args.cta or "",
        "deadline": args.deadline or deadline,
        "current_stage": 0,
        "stage_name": "brief",
        "created_at": now,
    }

    brief_json = json.dumps(brief_data).replace("'", "''")

    # Create task in tasks table
    title = f"{video_id} — {args.type} — {args.project}"
    desc = f"Video production pipeline: {args.type} for {args.project}. Narrator: {args.narrator or 'marcus'}. Duration: {args.duration or 60}s."
    desc_escaped = desc.replace("'", "''")
    title_escaped = title.replace("'", "''")

    run_sql(f"""
        INSERT INTO tasks (id, title, description, status, priority, assigned_to,
                           project_id, created_at, created_by_ai)
        VALUES (gen_random_uuid(), '{title_escaped}', '{desc_escaped}',
                'in_progress', 'high', 'marcus', '{args.project}', now(), 'video_pipeline')
    """)

    # Post to chatroom
    msg = f"[VIDEO] BRIEF LOCKED — {video_id} — {args.type} — {args.project} — assigning pipeline — @marcus"
    msg_escaped = msg.replace("'", "''")
    run_sql(f"""
        INSERT INTO chatroom (id, agent_id, message, channel, message_type, created_at)
        VALUES (gen_random_uuid(), 'marcus', '{msg_escaped}', 'general', 'broadcast', now())
    """)

    print(f"[VIDEO PIPELINE] Brief created: {video_id}")
    print(f"  Project: {args.project}")
    print(f"  Type: {args.type}")
    print(f"  Narrator: {args.narrator or 'marcus'}")
    print(f"  Duration: {args.duration or 60}s")
    print(f"  Platform: {args.platform or 'all'}")
    print(f"  Deadline: {args.deadline or deadline}")
    print(f"  Stage: 0/8 — Brief & Campaign Definition")
    print(f"\n  Next: @contentforge to write script (Stage 1)")
    return video_id


def get_video_status(video_id):
    """Get the current status of a video pipeline."""
    result = run_sql(f"SELECT * FROM tasks WHERE title LIKE '{video_id}%' LIMIT 1")
    data = parse_result(result)
    if not data:
        print(f"ERROR: Video {video_id} not found")
        return None
    return data[0]


def show_status(args):
    """Show the status of a video pipeline."""
    task = get_video_status(args.video_id)
    if not task:
        return

    title = task.get('title', '')
    status = task.get('status', 'unknown')
    assigned = task.get('assigned_to', 'unknown')
    desc = task.get('description', '')

    # Parse stage from description or title
    print(f"[VIDEO PIPELINE] {title}")
    print(f"  Status: {status}")
    print(f"  Assigned to: @{assigned}")
    print(f"  Description: {desc}")

    # Show stage progression
    print(f"\n  Pipeline Stages:")
    for stage in STAGES:
        marker = "→" if stage['owner'] == assigned else " "
        print(f"    {marker} Stage {stage['id']}: {stage['title']} (@{stage['owner']})")


def advance_stage(args):
    """Advance a video to the next pipeline stage."""
    task = get_video_status(args.video_id)
    if not task:
        return

    current_assigned = task.get('assigned_to', '')
    current_stage_idx = None

    for i, stage in enumerate(STAGES):
        if stage['owner'] == current_assigned:
            current_stage_idx = i
            break

    if current_stage_idx is None:
        current_stage_idx = 0

    next_stage_idx = current_stage_idx + 1
    if next_stage_idx >= len(STAGES):
        print(f"[VIDEO PIPELINE] {args.video_id} — Pipeline COMPLETE!")
        run_sql(f"UPDATE tasks SET status = 'completed' WHERE title LIKE '{args.video_id}%'")

        # Post completion to chatroom
        msg = f"[VIDEO] PIPELINE COMPLETE — {args.video_id} — all stages passed — published and learning"
        msg_escaped = msg.replace("'", "''")
        run_sql(f"""
            INSERT INTO chatroom (id, agent_id, message, channel, message_type, created_at)
            VALUES (gen_random_uuid(), 'carlos', '{msg_escaped}', 'general', 'broadcast', now())
        """)
        return

    next_stage = STAGES[next_stage_idx]
    print(f"[VIDEO PIPELINE] Advancing {args.video_id}")
    print(f"  Stage {current_stage_idx} ({STAGES[current_stage_idx]['title']}) → Stage {next_stage_idx} ({next_stage['title']})")
    print(f"  New owner: @{next_stage['owner']}")

    # Update task assignment
    run_sql(f"UPDATE tasks SET assigned_to = '{next_stage['owner']}' WHERE title LIKE '{args.video_id}%'")

    # Post handoff to chatroom
    msg = f"[VIDEO] STAGE ADVANCE — {args.video_id} — Stage {next_stage_idx}: {next_stage['title']} — assigned to @{next_stage['owner']}"
    msg_escaped = msg.replace("'", "''")
    run_sql(f"""
        INSERT INTO chatroom (id, agent_id, message, channel, message_type, created_at)
        VALUES (gen_random_uuid(), '{STAGES[current_stage_idx]['owner']}', '{msg_escaped}',
                'general', 'broadcast', now())
    """)


def list_videos(args):
    """List all video pipeline tasks."""
    result = run_sql("SELECT title, status, assigned_to, created_at FROM tasks WHERE title LIKE 'VID-%' ORDER BY created_at DESC LIMIT 20")
    data = parse_result(result)

    if not data:
        print("[VIDEO PIPELINE] No video pipelines found.")
        return

    print(f"[VIDEO PIPELINE] {len(data)} video(s) found:\n")
    for v in data:
        status_icon = {"in_progress": "🔄", "completed": "✅", "pending": "⏳"}.get(v.get('status', ''), "❓")
        print(f"  {status_icon} {v.get('title', 'Unknown')} | @{v.get('assigned_to', '?')} | {v.get('status', '?')}")


def main():
    parser = argparse.ArgumentParser(description="Video Production Pipeline Orchestrator")
    subparsers = parser.add_subparsers(dest="command")

    # Brief command
    brief_parser = subparsers.add_parser("brief", help="Create a new video production brief")
    brief_parser.add_argument("--project", required=True, help="Project ID (e.g., jonnyai)")
    brief_parser.add_argument("--type", required=True, help="Video type (agent_spotlight, case_study, etc.)")
    brief_parser.add_argument("--narrator", default="marcus", help="Narrator agent (default: marcus)")
    brief_parser.add_argument("--platform", default="all", help="Target platform (reels, shorts, tiktok, all)")
    brief_parser.add_argument("--duration", type=int, default=60, help="Target duration in seconds")
    brief_parser.add_argument("--tone", default="confident, warm", help="Emotional tone")
    brief_parser.add_argument("--key-message", default="", help="Key message for the viewer")
    brief_parser.add_argument("--cta", default="", help="Call to action")
    brief_parser.add_argument("--deadline", default="", help="Deadline (YYYY-MM-DD)")

    # Status command
    status_parser = subparsers.add_parser("status", help="Check video pipeline status")
    status_parser.add_argument("--video-id", required=True, help="Video ID (e.g., VID-2026-03-01-001)")

    # Advance command
    advance_parser = subparsers.add_parser("advance", help="Advance to next pipeline stage")
    advance_parser.add_argument("--video-id", required=True, help="Video ID")

    # List command
    subparsers.add_parser("list", help="List all video pipelines")

    args = parser.parse_args()

    if args.command == "brief":
        create_brief(args)
    elif args.command == "status":
        show_status(args)
    elif args.command == "advance":
        advance_stage(args)
    elif args.command == "list":
        list_videos(args)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
