"""
@Marcus — Daily Standup Briefing (9:50am UTC)
Reads all overnight cron outputs + chatroom + analytics
Generates morning briefing → chatroom + GitHub
Answers: What ran? What found? What's today's priority?
"""
import os, json, subprocess, urllib.request
from datetime import datetime, timezone, timedelta
from pathlib import Path

REPO = Path("/home/antigravity-ai/Antigravity_Orchestra")
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", os.environ.get("SUPABASE_KEY", ""))
NOW = datetime.now(timezone.utc)
TODAY = NOW.strftime("%Y-%m-%d")
YESTERDAY = (NOW - timedelta(days=1)).strftime("%Y-%m-%d")

# 7-day Ralph rotation (same as agent_ralph_rotation.py)
DOW = NOW.weekday()
WEEK_NUM = int(NOW.strftime("%W"))
ROTATION_MAP = {
    (0, 0): ("vigil", "Quality"),  (0, 1): ("sebastian", "Code"),
    (0, 2): ("priya", "Design"),   (0, 3): ("felix", "Monetization"),
    (0, 4): ("scholar", "Research"),(0, 5): ("dreamer", "Ventures"),
    (0, 6): ("diana", "Database"), (1, 0): ("elena", "Copy"),
    (1, 1): ("grace", "SEO"),      (1, 2): ("hugo", "GitHub"),
    (1, 3): ("maya", "Analytics"), (1, 4): ("nathan", "Automation"),
    (1, 5): ("rowan", "Content"),  (1, 6): ("nina", "Intelligence"),
}

def sb_get(table, params=""):
    try:
        url = f"{SUPABASE_URL}/rest/v1/{table}?{params}&limit=50"
        req = urllib.request.Request(url, headers={
            "apikey": SUPABASE_KEY, "Authorization": "Bearer " + SUPABASE_KEY
        })
        with urllib.request.urlopen(req, timeout=10) as r:
            return json.loads(r.read())
    except: return []

def sb_post(table, payload):
    try:
        data = json.dumps(payload).encode()
        req = urllib.request.Request(
            f"{SUPABASE_URL}/rest/v1/{table}", data=data,
            headers={"apikey": SUPABASE_KEY, "Authorization": "Bearer " + SUPABASE_KEY,
                     "Content-Type": "application/json", "Prefer": "return=minimal"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=10): pass
    except Exception as e:
        print(f"  Supabase error: {e}")

def get_timer_status():
    """Check all systemd timers."""
    try:
        r = subprocess.run(["systemctl", "list-timers", "--all", "--no-pager"],
                          capture_output=True, text=True, timeout=10)
        lines = [l for l in r.stdout.split("\n") if ".timer" in l]
        active = [(l.split()[4] if len(l.split()) > 4 else "?") for l in lines]
        # Check for failed
        r2 = subprocess.run(["systemctl", "list-units", "--state=failed", "--no-pager"],
                           capture_output=True, text=True, timeout=10)
        failed = [l for l in r2.stdout.split("\n") if ".service" in l and "failed" in l]
        return {"total": len(lines), "failed": failed}
    except Exception as e:
        return {"total": 0, "failed": [], "error": str(e)}

def get_overnight_chatroom():
    """Read chatroom messages from last 24h."""
    messages = sb_get("chatroom", f"created_at=gte.{YESTERDAY}T00:00:00Z&order=created_at.desc")
    return messages[:20]

def get_overnight_orders():
    """Orders processed overnight."""
    orders = sb_get("orders", f"created_at=gte.{YESTERDAY}T00:00:00Z&select=id,status,sku,ebay_order_id,total_price")
    return orders

def get_latest_audit():
    """Read most recent ecosystem audit."""
    audits_dir = REPO / "docs" / "audits"
    if audits_dir.exists():
        files = sorted(audits_dir.glob(f"ecosystem-audit-*.md"), reverse=True)
        if files:
            content = files[0].read_text(errors="ignore")
            # Extract key sections
            lines = content.split("\n")
            return "\n".join(lines[:30])
    return "No ecosystem audit found for today."

def get_todays_ralph_agent():
    week_parity = WEEK_NUM % 2
    agent, domain = ROTATION_MAP.get((week_parity, DOW), ("vigil", "Quality"))
    return agent, domain

def build_briefing(timers, messages, orders, audit_summary, ralph_agent, ralph_domain):
    total_orders = len(orders)
    ordered = len([o for o in orders if o.get("status") == "ordered"])
    failed = len([o for o in orders if o.get("status") == "failed"])
    revenue = sum(float(o.get("total_price", 0) or 0) for o in orders)

    active_agents = list(set(m.get("agent", "") for m in messages if m.get("agent")))
    key_messages = [f"@{m.get('agent','?')}: {m.get('message','')[:80]}" for m in messages[:5]]

    # Get high priority audit items
    high_items = []
    for line in audit_summary.split("\n"):
        if "[HIGH]" in line:
            high_items.append(line.strip())

    lines = [
        f"# Daily Standup — {TODAY}",
        f"**@Marcus** | {NOW.strftime('%H:%M UTC')} | Jai.OS 5.0 Morning Briefing",
        "",
        "## Overnight Summary",
        f"- Orders processed: {total_orders} ({ordered} success | {failed} failed) | Revenue: £{revenue:.2f}",
        f"- Timers running: {timers.get('total', 0)} | Failed services: {len(timers.get('failed', []))}",
        f"- Active agents in chatroom: {len(active_agents)} ({', '.join(active_agents[:5])})",
        "",
        "## Today's Schedule",
        f"- 08:00 — Ecosystem Audit (@Vigil/@Watcher)",
        f"- 09:00 — Analytics Report (@Nina)",
        f"- 09:50 — THIS Standup (@Marcus) [you are here]",
        f"- 10:00 — Ralph Loop: **@{ralph_agent}** ({ralph_domain} domain)",
        f"- Ongoing — BL stock sync (15min) | Order processor (10min)",
        "",
    ]

    if high_items:
        lines += ["## High Priority Items", ""]
        for item in high_items[:5]:
            lines.append(f"- {item}")
        lines.append("")

    if len(timers.get("failed", [])) > 0:
        lines += [
            "## ALERTS",
            f"- FAILED SERVICES: {', '.join(timers['failed'][:3])}",
            ""
        ]

    if failed > 0:
        lines += [f"- {failed} ORDER(S) FAILED overnight — review Supabase orders table", ""]

    lines += [
        "## Chatroom Overnight",
        ""
    ]
    for msg in key_messages:
        lines.append(f"- {msg}")

    lines += [
        "",
        "## Today's Rallying Call",
        f"@{ralph_agent} is running their Ralph Loop on {ralph_domain} at 10:00 UTC.",
        "Tribe, build fast, learn daily, ship clean. — @Marcus",
        "",
        "---",
        f"*Generated by daily_standup.py | {NOW.isoformat()}*"
    ]
    return "\n".join(lines)

def main():
    print(f"\n=== DAILY STANDUP | @Marcus | {TODAY} ===\n")

    ralph_agent, ralph_domain = get_todays_ralph_agent()
    print(f"Today's Ralph agent: @{ralph_agent} ({ralph_domain})")

    print("[1/4] Timer health...")
    timers = get_timer_status()
    print(f"  {timers.get('total', 0)} timers | {len(timers.get('failed', []))} failed")

    print("[2/4] Overnight chatroom...")
    messages = get_overnight_chatroom()
    print(f"  {len(messages)} messages overnight")

    print("[3/4] Orders...")
    orders = get_overnight_orders()
    print(f"  {len(orders)} orders")

    print("[4/4] Latest audit...")
    audit_summary = get_latest_audit()

    briefing = build_briefing(timers, messages, orders, audit_summary, ralph_agent, ralph_domain)
    print("\n" + briefing[:400] + "...\n")

    # Save briefing to docs
    try:
        briefings_dir = REPO / "docs" / "audits"
        briefings_dir.mkdir(exist_ok=True)
        path = briefings_dir / f"standup-{TODAY}.md"
        path.write_text(briefing)
        subprocess.run(["git", "-C", str(REPO), "add", str(path)], timeout=10)
        subprocess.run(["git", "-C", str(REPO), "commit", "-m", f"standup: daily briefing {TODAY}"], timeout=15)
        subprocess.run(["git", "-C", str(REPO), "push", "origin", "main"], timeout=30)
        print(f"Briefing saved + pushed: {path.name}")
    except Exception as e:
        print(f"Save error: {e}")

    # Post to chatroom
    chatroom_msg = f"STANDUP {TODAY}: {len(orders)} orders | {timers.get('total', 0)} timers running | Today's Ralph: @{ralph_agent} ({ralph_domain}) | Build fast."
    sb_post("chatroom", {
        "agent": "marcus",
        "message": chatroom_msg,
        "status": "info",
        "created_at": NOW.isoformat(),
        "session": f"standup-{TODAY}"
    })

    # Save to Supabase
    sb_post("learnings", {
        "agent": "marcus",
        "category": "daily_standup",
        "content": briefing[:5000],
        "tags": ["standup", "daily", "briefing"],
        "created_at": NOW.isoformat()
    })

    print("Standup complete. Orchestra briefed.")

if __name__ == "__main__":
    main()
