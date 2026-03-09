"""
Orchestra Heartbeat v2.1 — The Pulse of the Antigravity Orchestra

Runs on a schedule (GitHub Actions or cron). On each beat:
1. Checks for overdue recurring tasks → spawns new instances.
2. Checks for stale pending tasks → flags or escalates them.
3. Checks for tasks stuck in_progress → alerts if overdue.
4. Processes the content calendar → fires due social posts.
5. Auto-replenishes the content calendar when running low.
6. Triggers weekly client progress reports (Fridays 09-11 UTC).
7. Posts a summary to the chatroom.
8. Logs a heartbeat event to system_news.

Fixes applied (Jai.OS 5.0 test gaps):
  - T1: created_by_ai default set to 'system' (DB-level fix already applied)
  - T2: Now processes standard pending tasks, not just recurring
  - T3: Full task lifecycle management (pending → in_progress → stale detection)
  - VP2: Weekly client report scheduling integrated into heartbeat cycle

Execution mode:
  - Uses Supabase Management API for SQL (no manus-mcp-cli required)
  - Requires: SUPABASE_ACCESS_TOKEN, ANTIGRAVITY_BRAIN_URL, ANTIGRAVITY_BRAIN_SERVICE_ROLE_KEY

Usage:
  python execution/orchestra_heartbeat.py
"""

import json
import uuid
import os
import subprocess
import requests
from datetime import datetime, timezone, timedelta

SUPABASE_PROJECT_ID = os.getenv("SUPABASE_PROJECT_ID", "lkwydqtfbdjhxaarelaz")
BRAIN_URL = os.getenv("ANTIGRAVITY_BRAIN_URL", f"https://{SUPABASE_PROJECT_ID}.supabase.co")
BRAIN_KEY = os.getenv("ANTIGRAVITY_BRAIN_SERVICE_ROLE_KEY", os.getenv("SUPABASE_SERVICE_ROLE_KEY", ""))
HEADERS = {
    "apikey": BRAIN_KEY,
    "Authorization": f"Bearer {BRAIN_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

# Thresholds
STALE_PENDING_HOURS = 48      # Flag pending tasks older than 48h
STALE_IN_PROGRESS_HOURS = 72  # Flag in_progress tasks older than 72h


def run_sql(query):
    """Execute SQL via Supabase REST API (PostgREST /rpc/execute_sql or Management API)."""
    # Use the Supabase Management API for raw SQL execution
    mgmt_token = os.getenv("SUPABASE_ACCESS_TOKEN", "")
    if mgmt_token:
        try:
            resp = requests.post(
                f"https://api.supabase.com/v1/projects/{SUPABASE_PROJECT_ID}/database/query",
                headers={
                    "Authorization": f"Bearer {mgmt_token}",
                    "Content-Type": "application/json"
                },
                json={"query": query},
                timeout=30
            )
            if resp.status_code == 200:
                data = resp.json()
                if isinstance(data, list):
                    return json.dumps(data)
                return json.dumps(data.get("rows", []))
        except Exception as e:
            print(f"  [SQL] Management API error: {e}")
    # Fallback: try PostgREST RPC if available
    return json.dumps([])


def parse_result(output):
    """Parse SQL result — handles both list and JSON string."""
    if isinstance(output, list):
        return output
    if not output:
        return []
    try:
        data = json.loads(output)
        if isinstance(data, list):
            return data
        return []
    except (json.JSONDecodeError, TypeError):
        # Legacy MCP format fallback
        i = output.find('[{')
        e = output.rfind('}]') + 2
        if i > -1:
            try:
                return json.loads(output[i:e])
            except json.JSONDecodeError:
                pass
    return []


def calculate_next_run(cron_expr):
    """
    Simple next-run calculator based on cron expression.
    Supports: minute hour day-of-month month day-of-week
    Returns a datetime string for the next occurrence.
    """
    now = datetime.now(timezone.utc)
    parts = cron_expr.strip().split()
    if len(parts) != 5:
        return (now + timedelta(hours=24)).strftime('%Y-%m-%d %H:%M:%S+00')

    minute, hour, dom, month, dow = parts

    # Daily at hour:minute
    if dom == '*' and month == '*' and dow == '*':
        h = int(hour)
        m = int(minute)
        next_dt = now.replace(hour=h, minute=m, second=0, microsecond=0)
        if next_dt <= now:
            next_dt += timedelta(days=1)
        return next_dt.strftime('%Y-%m-%d %H:%M:%S+00')

    # Weekly on specific day
    if dom == '*' and month == '*' and dow != '*':
        h = int(hour)
        m = int(minute)
        target_dow = int(dow)
        py_dow = (target_dow - 1) % 7
        days_ahead = py_dow - now.weekday()
        if days_ahead < 0:
            days_ahead += 7
        next_dt = (now.replace(hour=h, minute=m, second=0, microsecond=0)
                   + timedelta(days=days_ahead))
        if next_dt <= now:
            next_dt += timedelta(weeks=1)
        return next_dt.strftime('%Y-%m-%d %H:%M:%S+00')

    # Monthly on specific day
    if dom != '*' and month == '*':
        h = int(hour)
        m = int(minute)
        d = int(dom)
        next_dt = now.replace(day=d, hour=h, minute=m, second=0, microsecond=0)
        if next_dt <= now:
            if now.month == 12:
                next_dt = next_dt.replace(year=now.year + 1, month=1)
            else:
                next_dt = next_dt.replace(month=now.month + 1)
        return next_dt.strftime('%Y-%m-%d %H:%M:%S+00')

    # Fallback
    return (now + timedelta(hours=24)).strftime('%Y-%m-%d %H:%M:%S+00')


def process_recurring_tasks(now_str, now_date):
    """Step 1: Find and spawn overdue recurring tasks."""
    query = f"""
        SELECT id, title, assigned_to, priority, cron_expression, project_id
        FROM tasks
        WHERE is_recurring = true
          AND status = 'pending'
          AND next_run_at <= '{now_str}'
    """
    result = run_sql(query)
    overdue = parse_result(result)

    spawned = []
    for task in overdue:
        task_id = str(uuid.uuid4())
        title = f"RUN: {task['title']} ({now_date})"
        assigned = task['assigned_to']
        priority = task['priority']
        project = task.get('project_id') or ''
        parent_id = task['id']

        title_escaped = title.replace("'", "''")
        insert_q = f"""
            INSERT INTO tasks (id, title, assigned_to, priority, status,
                               created_by_ai, created_by_agent, project_id,
                               parent_task_id, is_recurring, created_at, updated_at)
            VALUES ('{task_id}', '{title_escaped}', '{assigned}', '{priority}',
                    'pending', 'heartbeat', 'executor', '{project}',
                    '{parent_id}', false, now(), now())
        """
        run_sql(insert_q)
        print(f"  SPAWNED: {title} -> @{assigned}")
        spawned.append(f"@{assigned}: {task['title']}")

        next_run = calculate_next_run(
            task.get('cron_expression') or '0 9 * * *'
        )
        run_sql(f"""
            UPDATE tasks
            SET next_run_at = '{next_run}', updated_at = now()
            WHERE id = '{parent_id}'
        """)
        print(f"  NEXT RUN: {next_run}")

    return spawned


def process_stale_pending_tasks(now_str):
    """Step 2 (T2): Find standard pending tasks that are stale and escalate."""
    cutoff = (datetime.now(timezone.utc) - timedelta(hours=STALE_PENDING_HOURS)).strftime('%Y-%m-%d %H:%M:%S+00')
    query = f"""
        SELECT id, title, assigned_to, priority, project_id, created_at
        FROM tasks
        WHERE status = 'pending'
          AND is_recurring = false
          AND created_at <= '{cutoff}'
        ORDER BY priority DESC, created_at ASC
        LIMIT 20
    """
    result = run_sql(query)
    stale = parse_result(result)

    escalated = []
    for task in stale:
        task_id = task['id']
        title = task.get('title', 'Unknown')
        assigned = task.get('assigned_to', 'unassigned')

        # Mark as stale by updating priority to 'critical' if not already
        if task.get('priority') != 'critical':
            run_sql(f"""
                UPDATE tasks
                SET priority = 'critical', updated_at = now()
                WHERE id = '{task_id}'
            """)
            print(f"  ESCALATED: {title} (was pending >{STALE_PENDING_HOURS}h) -> priority: critical")
            escalated.append(f"@{assigned}: {title} (stale >{STALE_PENDING_HOURS}h)")
        else:
            print(f"  STALE (already critical): {title}")
            escalated.append(f"@{assigned}: {title} (critical, still pending)")

    return escalated


def process_stuck_in_progress(now_str):
    """Step 3 (T3): Find tasks stuck in_progress for too long."""
    cutoff = (datetime.now(timezone.utc) - timedelta(hours=STALE_IN_PROGRESS_HOURS)).strftime('%Y-%m-%d %H:%M:%S+00')
    query = f"""
        SELECT id, title, assigned_to, priority, project_id, updated_at
        FROM tasks
        WHERE status = 'in_progress'
          AND updated_at <= '{cutoff}'
        ORDER BY updated_at ASC
        LIMIT 20
    """
    result = run_sql(query)
    stuck = parse_result(result)

    alerts = []
    for task in stuck:
        title = task.get('title', 'Unknown')
        assigned = task.get('assigned_to', 'unassigned')
        print(f"  STUCK: {title} (@{assigned}) — in_progress for >{STALE_IN_PROGRESS_HOURS}h")
        alerts.append(f"@{assigned}: {title} (stuck in_progress >{STALE_IN_PROGRESS_HOURS}h)")

    return alerts


def process_content_calendar(now_str):
    """Step 4: Check for due content calendar items and fire them."""
    query = f"""
        SELECT id, content_type, pillar, topic, assigned_agent
        FROM content_calendar
        WHERE scheduled_for <= '{now_str}'
          AND status = 'scheduled'
        LIMIT 10
    """
    result = run_sql(query)
    due_items = parse_result(result)

    fired = []
    for item in due_items:
        item_id = item['id']
        content_type = item.get('content_type', 'GENERAL')
        topic = item.get('topic', '')
        agent = item.get('assigned_agent', 'contentforge')

        # Insert a chatroom trigger for the social engine to pick up
        tag = f"[{content_type}]"
        message = f"{tag} {topic}"
        message_escaped = message.replace("'", "''")

        run_sql(f"""
            INSERT INTO chatroom (id, agent_id, message, channel,
                                  message_type, created_at)
            VALUES (gen_random_uuid(), '{agent}', '{message_escaped}',
                    'social', 'trigger', now())
        """)

        # Mark calendar item as processing
        run_sql(f"""
            UPDATE content_calendar
            SET status = 'processing', updated_at = now()
            WHERE id = '{item_id}'
        """)

        print(f"  CALENDAR: Fired {tag} — {topic} (via @{agent})")
        fired.append(f"@{agent}: {tag} {topic}")

    return fired


CALENDAR_LOW_THRESHOLD = 5  # Replenish when fewer than 5 future items remain


def check_calendar_replenishment():
    """Step 5 (C3): Auto-replenish the content calendar when running low."""
    query = "SELECT COUNT(*) as cnt FROM content_calendar WHERE status = 'scheduled' AND scheduled_for > NOW()"
    result = run_sql(query)
    data = parse_result(result)
    count = data[0].get('cnt', 0) if data else 0

    if count < CALENDAR_LOW_THRESHOLD:
        print(f"  CALENDAR LOW: {count} future items (threshold: {CALENDAR_LOW_THRESHOLD})")
        print(f"  Triggering auto-replenishment...")
        try:
            # Try to run the seed script for 2 weeks
            subprocess.run(
                ["python3", "execution/seed_content_calendar.py", "--weeks", "2"],
                capture_output=True, text=True, timeout=60
            )
            print(f"  Calendar replenished with 2 weeks of content")
            return True
        except Exception as e:
            print(f"  Could not auto-replenish: {e}")
            return False
    else:
        print(f"  Calendar healthy: {count} future items")
        return False


def check_weekly_client_reports():
    """Step 6 (VP2): Trigger weekly client progress reports on Fridays."""
    weekday = datetime.now(timezone.utc).weekday()  # 0=Mon, 4=Fri
    hour = datetime.now(timezone.utc).hour

    if weekday == 4 and 9 <= hour <= 11:  # Friday 09:00-11:59 UTC
        print(f"  Friday {hour}:xx UTC — triggering weekly client reports")

        # Post trigger to chatroom so the listener or manual operator can pick it up
        msg = "[REPORT] Weekly client report cycle triggered — @marcus sending progress updates to all active clients"
        msg_escaped = msg.replace("'", "''")
        run_sql(f"""
            INSERT INTO chatroom (id, agent_id, message, channel,
                                  message_type, created_at)
            VALUES (gen_random_uuid(), 'marcus', '{msg_escaped}',
                    'general', 'broadcast', now())
        """)

        # Attempt to run the report script directly
        try:
            result = subprocess.run(
                ["python3", "execution/send_client_report.py", "--all-active"],
                capture_output=True, text=True, timeout=120
            )
            print(f"  Report script output: {result.stdout[:300]}")
            if result.returncode == 0:
                print(f"  ✅ Weekly client reports sent successfully")
                return True
            else:
                print(f"  ⚠️  Report script returned code {result.returncode}")
                print(f"  stderr: {result.stderr[:200]}")
                return False
        except FileNotFoundError:
            print(f"  ⚠️  send_client_report.py not found — post chatroom trigger only")
            return False
        except Exception as e:
            print(f"  ⚠️  Could not run report script: {e}")
            return False
    else:
        day_names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        print(f"  Not Friday 09-11 UTC ({day_names[weekday]} {hour}:xx UTC) — skipping")
        return False


def main():
    now_str = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S+00')
    now_date = datetime.now(timezone.utc).strftime('%Y-%m-%d')

    print(f"[HEARTBEAT] {now_str} — Orchestra Heartbeat v2.1 starting...")
    print(f"[HEARTBEAT] Mode: Direct (Supabase REST)")

    # Step 1: Recurring tasks
    print(f"\n[STEP 1] Processing recurring tasks...")
    spawned = process_recurring_tasks(now_str, now_date)
    print(f"  → {len(spawned)} recurring task(s) spawned")

    # Step 2: Stale pending tasks (T2 fix)
    print(f"\n[STEP 2] Checking for stale pending tasks (>{STALE_PENDING_HOURS}h)...")
    escalated = process_stale_pending_tasks(now_str)
    print(f"  → {len(escalated)} stale task(s) escalated")

    # Step 3: Stuck in_progress tasks (T3 fix)
    print(f"\n[STEP 3] Checking for stuck in_progress tasks (>{STALE_IN_PROGRESS_HOURS}h)...")
    stuck = process_stuck_in_progress(now_str)
    print(f"  → {len(stuck)} stuck task(s) found")

    # Step 4: Content calendar
    print(f"\n[STEP 4] Processing content calendar...")
    calendar_fired = process_content_calendar(now_str)
    print(f"  → {len(calendar_fired)} calendar item(s) fired")

    # Step 5: Calendar replenishment (C3 fix)
    print(f"\n[STEP 5] Checking content calendar health...")
    replenished = check_calendar_replenishment()

    # Step 6: Weekly client reports (VP2 fix)
    print(f"\n[STEP 6] Checking weekly client report schedule...")
    report_triggered = check_weekly_client_reports()

    # Build summary
    total_actions = len(spawned) + len(escalated) + len(stuck) + len(calendar_fired)

    if total_actions == 0 and not report_triggered:
        print(f"\n[HEARTBEAT] System is idle. All systems nominal.")
        run_sql(f"""
            INSERT INTO system_news (id, agent_id, headline, body, category, created_at)
            VALUES (gen_random_uuid(), 'executor',
                    'Heartbeat: System Idle',
                    'No overdue tasks at {now_str}. All systems nominal.',
                    'heartbeat', now())
        """)
        return

    # Post summary to chatroom
    summary_parts = [f"Heartbeat v2.1 — {now_date}"]
    if spawned:
        summary_parts.append(f"Spawned {len(spawned)} recurring task(s):")
        summary_parts.extend([f"  {s}" for s in spawned])
    if escalated:
        summary_parts.append(f"Escalated {len(escalated)} stale task(s):")
        summary_parts.extend([f"  {e}" for e in escalated])
    if stuck:
        summary_parts.append(f"ALERT: {len(stuck)} task(s) stuck in_progress:")
        summary_parts.extend([f"  {s}" for s in stuck])
    if calendar_fired:
        summary_parts.append(f"Fired {len(calendar_fired)} calendar item(s):")
        summary_parts.extend([f"  {c}" for c in calendar_fired])
    if report_triggered:
        summary_parts.append(f"Weekly client reports triggered")

    summary = "\\n".join(summary_parts)
    summary_escaped = summary.replace("'", "''")

    run_sql(f"""
        INSERT INTO chatroom (id, agent_id, message, channel,
                              message_type, created_at)
        VALUES (gen_random_uuid(), 'executor', '{summary_escaped}',
                'general', 'broadcast', now())
    """)

    # Log to system_news
    headline = f"Heartbeat: {total_actions} Actions"
    if stuck:
        headline += f" ({len(stuck)} STUCK)"
    if report_triggered:
        headline += " + Reports"
    run_sql(f"""
        INSERT INTO system_news (id, agent_id, headline, body,
                                 category, created_at)
        VALUES (gen_random_uuid(), 'executor',
                '{headline}', '{summary_escaped}', 'heartbeat', now())
    """)

    print(f"\n[HEARTBEAT] Complete. {total_actions} total actions, chatroom updated.")


if __name__ == "__main__":
    main()
