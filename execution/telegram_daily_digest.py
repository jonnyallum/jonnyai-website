#!/usr/bin/env python3
"""
telegram_daily_digest.py — Morning task + agency digest to Telegram.

Run daily at 08:00 via cron:
  0 8 * * * cd /home/antigravity-ai/Antigravity_Orchestra && python3 execution/telegram_daily_digest.py

Sends Jonny a morning brief:
- CRM task stats (open, in-progress, overdue)
- BL Motorcycles overnight orders
- Pi node health
- Any stuck/overdue tasks highlighted
"""
import os, sys, json, urllib.request, urllib.parse
from datetime import datetime, timezone, timedelta
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")

TELEGRAM_TOKEN  = os.getenv("TELEGRAM_BOT_TOKEN", "")
CHAT_ID         = os.getenv("TELEGRAM_ALLOWED_CHAT_ID", "")
BRAIN_URL       = os.getenv("ANTIGRAVITY_BRAIN_URL", "")
BRAIN_KEY       = os.getenv("ANTIGRAVITY_BRAIN_SERVICE_ROLE_KEY", "")
BL_URL          = os.getenv("SUPABASE_URL", "")
BL_KEY          = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
CRM_GQL         = "http://localhost:3000/graphql"
CRM_API_KEY     = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3ZTkxY2UyNC0xZjkyLTRiZmMtYTk3NC02MzY5NjNlYWFjYjAi"
    "LCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiN2U5MWNlMjQtMWY5Mi00YmZjLWE5NzQtNjM2OTYzZWFhY2IwIiwi"
    "aWF0IjoxNzczMDAyODc5LCJleHAiOjQ5MjY2MDI4NzcsImp0aSI6IjQwOGQxNzQ0LWMzMWItNGMxZi1hM2Q2LWE4ZmQxMzgz"
    "MTZmYiJ9.1uOtmlrrG--EetlapjYpewC8PqiZogvNpZQxvabJoYQ"
)


def sb_get(base, key, table, params=""):
    try:
        req = urllib.request.Request(
            f"{base}/rest/v1/{table}?{params}",
            headers={"apikey": key, "Authorization": f"Bearer {key}"}
        )
        with urllib.request.urlopen(req, timeout=8) as r:
            return json.loads(r.read())
    except Exception:
        return []


def crm_gql(query):
    try:
        d = json.dumps({"query": query}).encode()
        req = urllib.request.Request(CRM_GQL, data=d, headers={
            "Authorization": f"Bearer {CRM_API_KEY}",
            "Content-Type": "application/json"
        })
        with urllib.request.urlopen(req, timeout=8) as r:
            return json.loads(r.read()).get("data", {})
    except Exception:
        return {}


def send_telegram(message: str):
    if not TELEGRAM_TOKEN or not CHAT_ID:
        print("No Telegram token/chat ID configured")
        return False
    url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
    payload = json.dumps({"chat_id": CHAT_ID, "text": message}).encode()
    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return r.status == 200
    except Exception as e:
        print(f"Telegram send failed: {e}")
        return False


def get_task_stats():
    data = crm_gql('{tasks(first:200){edges{node{title status dueAt taskTargets{edges{node{company{name}}}}}}}}')
    tasks = data.get("tasks", {}).get("edges", [])
    now = datetime.now(timezone.utc)
    overdue = []
    todo = in_progress = done = 0
    for t in tasks:
        n = t["node"]
        s = n.get("status", "TODO")
        if s == "TODO":       todo += 1
        elif s == "IN_PROGRESS": in_progress += 1
        elif s == "DONE":     done += 1
        due = n.get("dueAt")
        if due and s != "DONE":
            try:
                due_dt = datetime.fromisoformat(due.replace("Z", "+00:00"))
                if due_dt < now:
                    co = ""
                    for tgt in (n.get("taskTargets", {}).get("edges") or [])[:1]:
                        co = " [" + ((tgt.get("node", {}).get("company") or {}).get("name", "") or "") + "]"
                    overdue.append(n.get("title", "?")[:50] + co)
            except Exception:
                pass
    return {"todo": todo, "in_progress": in_progress, "done": done, "overdue": overdue}


def get_overnight_orders():
    now = datetime.now(timezone.utc)
    cutoff = (now - timedelta(hours=10)).strftime("%Y-%m-%dT%H:%M:%SZ")
    orders = sb_get(BL_URL, BL_KEY, "orders",
                    f"created_at=gte.{cutoff}&order=created_at.desc&limit=20")
    revenue = sum(float(o.get("total_price", 0) or 0) for o in orders)
    pending = sum(1 for o in orders if o.get("status") == "pending")
    return {"count": len(orders), "revenue": round(revenue, 2), "pending": pending}


def get_pi_status():
    rows = sb_get(BRAIN_URL, BRAIN_KEY, "node_status", "order=last_seen.desc&limit=3")
    lines = []
    now = datetime.now(timezone.utc)
    for r in rows:
        last = r.get("last_seen", "")
        status = r.get("status", "?")
        nid = r.get("node_id", "?")
        # Check if stale (no heartbeat in 15 min)
        stale = ""
        if last:
            try:
                last_dt = datetime.fromisoformat(last.replace("Z", "+00:00"))
                mins_ago = (now - last_dt).total_seconds() / 60
                if mins_ago > 15:
                    stale = f" [STALE {int(mins_ago)}m]"
            except Exception:
                pass
        lines.append(f"{nid}: {status}{stale}")
    return lines


def build_digest() -> str:
    now = datetime.now(timezone.utc)
    day = now.strftime("%A %d %b")
    lines = [f"Good morning boss. {day}.", ""]

    # Task stats
    stats = get_task_stats()
    lines.append(f"CRM Tasks: {stats['todo']} todo | {stats['in_progress']} in progress | {stats['done']} done")
    if stats["overdue"]:
        lines.append(f"OVERDUE ({len(stats['overdue'])}):")
        for t in stats["overdue"][:5]:
            lines.append(f"  ! {t}")
    lines.append("")

    # BL orders
    o = get_overnight_orders()
    if o["count"] > 0:
        lines.append(f"BL Motorcycles overnight: {o['count']} orders | £{o['revenue']:.2f} | {o['pending']} pending")
    else:
        lines.append("BL Motorcycles: no overnight orders")
    lines.append("")

    # Pi status
    pi_lines = get_pi_status()
    if pi_lines:
        lines.append("Pi: " + " | ".join(pi_lines))
    lines.append("")

    lines.append("Use /tasks to see full list. /addtask to add. /done to close.")
    return "\n".join(lines)


if __name__ == "__main__":
    digest = build_digest()
    print(digest)
    print()
    ok = send_telegram(digest)
    print("Sent to Telegram:", ok)
