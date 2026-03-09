"""
@Nina + @Dashboard — Daily Analytics Report
KPIs: Orders, revenue, agent activity, Supabase health, cron run rates
Saves report to Supabase + commits to GitHub
"""
import os, sys, json, urllib.request, urllib.parse
from datetime import datetime, timezone, timedelta
from pathlib import Path
from dotenv import load_dotenv

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# Resolve repo root whether running from execution/ or repo root
_script_dir = Path(__file__).resolve().parent
REPO = _script_dir.parent if _script_dir.name == "execution" else _script_dir
load_dotenv(dotenv_path=REPO / ".env")

# Antigravity Brain (agent activity, learnings, chatroom, projects)
BRAIN_URL = os.environ.get("ANTIGRAVITY_BRAIN_URL", "https://lkwydqtfbdjhxaarelaz.supabase.co")
BRAIN_KEY = os.environ.get("ANTIGRAVITY_BRAIN_SERVICE_ROLE_KEY", "")
# BL Motorcycles (orders, inventory)
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
NOW = datetime.now(timezone.utc)
TODAY = NOW.strftime("%Y-%m-%d")
YESTERDAY = (NOW - timedelta(days=1)).strftime("%Y-%m-%d")

def sb_get(base_url, key, table, params=""):
    if not base_url or not key:
        return []
    try:
        url = f"{base_url}/rest/v1/{table}?{params}"
        req = urllib.request.Request(url, headers={
            "apikey": key,
            "Authorization": "Bearer " + key,
        })
        with urllib.request.urlopen(req, timeout=10) as r:
            return json.loads(r.read())
    except Exception as e:
        print(f"  DB error ({table}): {e}")
        return []

def sb_post(table, payload):
    if not BRAIN_URL or not BRAIN_KEY:
        return
    try:
        data = json.dumps(payload).encode()
        req = urllib.request.Request(
            f"{BRAIN_URL}/rest/v1/{table}",
            data=data,
            headers={
                "apikey": BRAIN_KEY,
                "Authorization": "Bearer " + BRAIN_KEY,
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            }, method="POST"
        )
        with urllib.request.urlopen(req, timeout=10) as r:
            return r.status
    except Exception as e:
        print(f"  Save error: {e}")

def get_order_metrics():
    print("[1/5] Order metrics...")
    orders = sb_get(SUPABASE_URL, SUPABASE_KEY, "orders",
                    f"created_at=gte.{YESTERDAY}T00:00:00Z&select=id,total_price,status,platform")
    total = len(orders)
    revenue = sum(float(o.get("total_price", 0) or 0) for o in orders)
    platforms = {}
    statuses = {}
    for o in orders:
        p = o.get("platform", "unknown")
        s = o.get("status", "unknown")
        platforms[p] = platforms.get(p, 0) + 1
        statuses[s] = statuses.get(s, 0) + 1
    print(f"  Orders (24h): {total} | Revenue: £{revenue:.2f}")
    return {"orders_24h": total, "revenue_24h": round(revenue, 2), "by_platform": platforms, "by_status": statuses}

def get_agent_activity():
    print("[2/5] Agent activity...")
    learnings = sb_get(BRAIN_URL, BRAIN_KEY, "learnings",
                       f"created_at=gte.{YESTERDAY}T00:00:00Z&select=agent_id,category")
    agents_active = list(set(l.get("agent_id", "") for l in learnings if l.get("agent_id")))
    chatroom = sb_get(BRAIN_URL, BRAIN_KEY, "chatroom",
                      f"created_at=gte.{YESTERDAY}T00:00:00Z&select=agent_id")
    chatroom_agents = list(set(c.get("agent_id", "") for c in chatroom if c.get("agent_id")))
    print(f"  Learnings posted: {len(learnings)} | Agents active: {len(agents_active)}")
    return {
        "learnings_24h": len(learnings),
        "agents_posted_learnings": agents_active,
        "chatroom_active_agents": chatroom_agents,
        "chatroom_messages_24h": len(chatroom)
    }

def get_project_health():
    print("[3/5] Project health...")
    projects = sb_get(BRAIN_URL, BRAIN_KEY, "projects", "select=name,status,updated_at")
    active = [p for p in projects if p.get("status") in ["active", "in-progress"]]
    stale = [p for p in projects if p.get("status") == "active" and p.get("updated_at", "") < YESTERDAY]
    print(f"  Active projects: {len(active)} | Stale: {len(stale)}")
    return {"total_projects": len(projects), "active": len(active), "stale": len(stale)}

def get_cron_health():
    print("[4/5] Cron health...")
    import subprocess, platform
    if platform.system() != "Linux":
        print("  Skipping systemd check (not Linux)")
        return {"note": "systemd check skipped on non-Linux"}
    try:
        r = subprocess.run(
            ["systemctl", "list-timers", "--all", "--no-pager"],
            capture_output=True, text=True, timeout=10
        )
        lines = [l for l in r.stdout.split("\n") if ".timer" in l]
        active = len([l for l in lines if "n/a" not in l.lower()])
        failed_check = subprocess.run(
            ["systemctl", "list-units", "--state=failed", "--no-pager"],
            capture_output=True, text=True, timeout=10
        )
        failed = len([l for l in failed_check.stdout.split("\n") if ".service" in l and "failed" in l])
        print(f"  Timers: {len(lines)} total | Active: {active} | Failed: {failed}")
        return {"total_timers": len(lines), "active_timers": active, "failed_services": failed}
    except Exception as e:
        return {"error": str(e)}

def check_inventory():
    print("[5/5] Inventory check...")
    inventory = sb_get(SUPABASE_URL, SUPABASE_KEY, "products",
                       "select=id,stock_quantity,sku&stock_quantity=lt.5&limit=20")
    print(f"  Low stock items (<5): {len(inventory)}")
    return {"low_stock_count": len(inventory), "low_stock_skus": [i.get("sku") for i in inventory[:10]]}

def build_report(metrics):
    orders = metrics.get("orders", {})
    agents = metrics.get("agents", {})
    projects = metrics.get("projects", {})
    crons = metrics.get("crons", {})
    inv = metrics.get("inventory", {})

    lines = [
        f"# Daily Analytics Report — {TODAY}",
        f"**Generated by:** @Nina + @Dashboard | **Run:** {NOW.strftime('%H:%M UTC')}",
        "",
        "## Business KPIs (Last 24h)",
        f"| Metric | Value |",
        f"|--------|-------|",
        f"| Orders | {orders.get('orders_24h', 0)} |",
        f"| Revenue | £{orders.get('revenue_24h', 0)} |",
        f"| Low stock SKUs | {inv.get('low_stock_count', 0)} |",
        "",
        "## Agent Activity",
        f"| Metric | Value |",
        f"|--------|-------|",
        f"| Learnings posted | {agents.get('learnings_24h', 0)} |",
        f"| Active agents | {len(agents.get('agents_posted_learnings', []))} |",
        f"| Chatroom messages | {agents.get('chatroom_messages_24h', 0)} |",
        "",
        "## Infrastructure",
        f"| Metric | Value |",
        f"|--------|-------|",
        f"| Active timers | {crons.get('active_timers', '?')} |",
        f"| Failed services | {crons.get('failed_services', 0)} |",
        f"| Active projects | {projects.get('active', '?')} |",
        f"| Stale projects | {projects.get('stale', 0)} |",
        "",
    ]

    # Alerts
    alerts = []
    if orders.get("orders_24h", 0) == 0:
        alerts.append("⚠️ No orders in last 24h — check eBay poller and order processor")
    if crons.get("failed_services", 0) > 0:
        alerts.append(f"🔴 {crons['failed_services']} failed systemd service(s) — investigate immediately")
    if inv.get("low_stock_count", 0) > 10:
        alerts.append(f"⚠️ {inv['low_stock_count']} SKUs low on stock — review inventory")
    if agents.get("learnings_24h", 0) == 0:
        alerts.append("⚠️ No agent learnings posted today — are sessions being logged?")

    if alerts:
        lines += ["## Alerts", ""] + [f"- {a}" for a in alerts] + [""]

    return "\n".join(lines)

def main():
    print(f"\n=== ANALYTICS REPORT | {TODAY} ===\n")
    metrics = {
        "orders": get_order_metrics(),
        "agents": get_agent_activity(),
        "projects": get_project_health(),
        "crons": get_cron_health(),
        "inventory": check_inventory(),
        "generated_at": NOW.isoformat()
    }

    report_md = build_report(metrics)
    print("\n" + "="*40)

    # Save to file + push
    try:
        reports_dir = REPO / "docs" / "audits"
        reports_dir.mkdir(exist_ok=True)
        report_path = reports_dir / f"analytics-{TODAY}.md"
        report_path.write_text(report_md)

        import subprocess
        subprocess.run(["git", "-C", str(REPO), "add", str(report_path)], timeout=10)
        subprocess.run(["git", "-C", str(REPO), "commit", "-m", f"report: daily analytics {TODAY}"], timeout=15)
        subprocess.run(["git", "-C", str(REPO), "push", "origin", "main"], timeout=30)
        print(f"Report saved + pushed: {report_path}")
    except Exception as e:
        print(f"Save error: {e}")

    # Save to Supabase
    sb_post("learnings", {
        "agent": "dashboard",
        "category": "analytics_report",
        "content": json.dumps(metrics, indent=2),
        "tags": ["analytics", "daily", "kpi"],
        "created_at": NOW.isoformat()
    })
    print("Analytics report complete.")

if __name__ == "__main__":
    main()
