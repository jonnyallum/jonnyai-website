# -*- coding: utf-8 -*-
"""
send_jonny_daily_report.py — Dynamic daily operations briefing for Jonny.
Pulls live data from Antigravity Brain + BL Motorcycles Supabase.
Cron: 0 7 * * * (7am UTC daily)
"""
import os, sys, json, urllib.request, requests
from datetime import datetime, timezone, timedelta
from pathlib import Path
from dotenv import load_dotenv

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
BRAIN_URL      = os.getenv("ANTIGRAVITY_BRAIN_URL", "https://lkwydqtfbdjhxaarelaz.supabase.co")
BRAIN_KEY      = os.getenv("ANTIGRAVITY_BRAIN_SERVICE_ROLE_KEY", "")
BL_URL         = os.getenv("SUPABASE_URL", "")
BL_KEY         = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

NOW          = datetime.now(timezone.utc)
TODAY        = NOW.strftime("%Y-%m-%d")
YESTERDAY    = (NOW - timedelta(days=1)).strftime("%Y-%m-%d")
DATE_DISPLAY = NOW.strftime("%A %d %B %Y")


# ── Supabase helpers ──────────────────────────────────────────────────────────

def sb_get(base_url, key, table, params=""):
    if not base_url or not key:
        return []
    try:
        req = urllib.request.Request(
            f"{base_url}/rest/v1/{table}?{params}",
            headers={"apikey": key, "Authorization": f"Bearer {key}"}
        )
        with urllib.request.urlopen(req, timeout=10) as r:
            return json.loads(r.read())
    except Exception as e:
        print(f"  [WARN] {table}: {e}")
        return []


def sb_count(base_url, key, table, params=""):
    if not base_url or not key:
        return 0
    try:
        req = urllib.request.Request(
            f"{base_url}/rest/v1/{table}?{params}&select=id",
            headers={
                "apikey": key, "Authorization": f"Bearer {key}",
                "Prefer": "count=exact", "Range": "0-0"
            }
        )
        with urllib.request.urlopen(req, timeout=10) as r:
            cr = r.headers.get("Content-Range", "0/0")
            total = cr.split("/")[-1]
            return int(total) if total.isdigit() else 0
    except Exception as e:
        print(f"  [WARN] count {table}: {e}")
        return 0


# ── Data fetchers ─────────────────────────────────────────────────────────────

def get_agent_activity():
    msgs  = sb_get(BRAIN_URL, BRAIN_KEY, "chatroom",
                   f"created_at=gte.{TODAY}T00:00:00Z&order=created_at.desc&limit=5")
    count = sb_count(BRAIN_URL, BRAIN_KEY, "chatroom",
                     f"created_at=gte.{TODAY}T00:00:00Z")
    latest = []
    for m in msgs[:3]:
        agent = m.get("agent_id", "?")
        msg   = (m.get("message") or "")[:120].replace("<", "&lt;")
        latest.append(f"<li><strong>@{agent}:</strong> {msg}</li>")
    return {"count": count, "latest": latest}


def get_learnings_today():
    items = sb_get(BRAIN_URL, BRAIN_KEY, "learnings",
                   f"created_at=gte.{TODAY}T00:00:00Z&order=created_at.desc&limit=5")
    lines = []
    for l in items[:3]:
        content = (l.get("content") or l.get("learning") or "")[:100].replace("<", "&lt;")
        agent   = l.get("agent_id", "")
        lines.append(f"<li>{content}{' <em>— @' + agent + '</em>' if agent else ''}</li>")
    return {"count": len(items), "lines": lines}


def get_social_posts_today():
    return sb_count(BRAIN_URL, BRAIN_KEY, "social_posts",
                    f"created_at=gte.{TODAY}T00:00:00Z")


def get_calendar_pending():
    return sb_count(BRAIN_URL, BRAIN_KEY, "content_calendar", "status=eq.scheduled")


def get_bl_orders():
    if not BL_URL or not BL_KEY:
        return {"count": 0, "revenue": 0.0, "rows": []}
    rows    = sb_get(BL_URL, BL_KEY, "orders",
                     f"created_at=gte.{YESTERDAY}T07:00:00Z&order=created_at.desc&limit=10")
    revenue = sum(float(r.get("total_price", 0) or 0) for r in rows)
    return {"count": len(rows), "revenue": round(revenue, 2), "rows": rows}


def get_bl_inventory():
    if not BL_URL or not BL_KEY:
        return {"total": 0, "low_stock": 0}
    return {
        "total":     sb_count(BL_URL, BL_KEY, "products"),
        "low_stock": sb_count(BL_URL, BL_KEY, "products", "stock_quantity=lt.3")
    }


def get_active_projects():
    return len(sb_get(BRAIN_URL, BRAIN_KEY, "projects", "status=eq.active"))


def get_crm_pipeline():
    """Pull CRM pipeline from Twenty CRM GraphQL (VM localhost only — falls back gracefully)."""
    try:
        import urllib.parse
        crm_key = (
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3ZTkxY2UyNC0xZjkyLTRiZmMtYTk3NC02MzY5NjNlYWFjYjAi"
            "LCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiN2U5MWNlMjQtMWY5Mi00YmZjLWE5NzQtNjM2OTYzZWFhY2IwIiwi"
            "aWF0IjoxNzczMDAyODc5LCJleHAiOjQ5MjY2MDI4NzcsImp0aSI6IjQwOGQxNzQ0LWMzMWItNGMxZi1hM2Q2LWE4ZmQxMzgz"
            "MTZmYiJ9.1uOtmlrrG--EetlapjYpewC8PqiZogvNpZQxvabJoYQ"
        )
        q = """{ opportunities(first: 20) { edges { node {
            name stage amount { amountMicros currencyCode }
            company { name }
        } } } }"""
        data = json.dumps({"query": q}).encode()
        req = urllib.request.Request(
            "http://localhost:3000/graphql", data=data,
            headers={"Authorization": f"Bearer {crm_key}", "Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req, timeout=5) as r:
            result = json.loads(r.read())
        opps = result.get("data", {}).get("opportunities", {}).get("edges", [])
        total_mrr = sum(
            (o["node"].get("amount") or {}).get("amountMicros", 0) / 1_000_000
            for o in opps
        )
        rows = []
        for o in opps[:6]:
            n = o["node"]
            company = (n.get("company") or {}).get("name", "?")
            amt = (n.get("amount") or {}).get("amountMicros", 0) / 1_000_000
            rows.append({"company": company, "amount": amt, "stage": n.get("stage", "?")})
        return {"total_mrr": round(total_mrr), "rows": rows, "count": len(opps)}
    except Exception:
        return {"total_mrr": 0, "rows": [], "count": 0}


# ── HTML builder ──────────────────────────────────────────────────────────────

def stat_block(label, value, sub="", color="#d97757"):
    sub_html = f'<div style="font-size:11px;color:#555;margin-top:3px">{sub}</div>' if sub else ""
    return f"""<div style="background:#0d0d18;border:1px solid #1a1a2e;border-left:3px solid {color};
                padding:18px 22px;border-radius:4px;flex:1;min-width:130px">
        <div style="font-size:26px;font-weight:800;color:{color}">{value}</div>
        <div style="font-size:11px;color:#666;text-transform:uppercase;letter-spacing:1px;margin-top:4px">{label}</div>
        {sub_html}
    </div>"""


def section_head(title, color="#d97757"):
    return (f'<h2 style="font-size:13px;color:#fff;letter-spacing:2px;text-transform:uppercase;'
            f'border-left:3px solid {color};padding-left:12px;margin:0 0 12px">{title}</h2>')


def build_html(activity, learnings, social_count, calendar_pending,
               bl_orders, bl_inv, active_projects, crm_pipeline):

    order_rows = ""
    for o in bl_orders["rows"][:5]:
        sku    = (o.get("sku") or o.get("item_sku") or "—")[:20]
        buyer  = (o.get("buyer_name") or o.get("shipping_name") or "—")[:25].replace("<", "&lt;")
        val    = f"&pound;{float(o.get('total_price', 0) or 0):.2f}"
        status = o.get("status") or o.get("fulfillment_status") or "new"
        order_rows += (f"<tr><td style='padding:8px 12px;border-bottom:1px solid #111;color:#ccc'>{sku}</td>"
                       f"<td style='padding:8px 12px;border-bottom:1px solid #111;color:#ccc'>{buyer}</td>"
                       f"<td style='padding:8px 12px;border-bottom:1px solid #111;color:#d97757;font-weight:600'>{val}</td>"
                       f"<td style='padding:8px 12px;border-bottom:1px solid #111;color:#555;font-size:11px'>{status}</td></tr>")

    orders_section = (
        f"""<table style="width:100%;border-collapse:collapse;background:#0d0d18;margin-bottom:28px">
          <tr style="background:#111">
            <th style="padding:8px 12px;text-align:left;color:#444;font-size:11px">SKU</th>
            <th style="padding:8px 12px;text-align:left;color:#444;font-size:11px">BUYER</th>
            <th style="padding:8px 12px;text-align:left;color:#444;font-size:11px">VALUE</th>
            <th style="padding:8px 12px;text-align:left;color:#444;font-size:11px">STATUS</th>
          </tr>{order_rows}</table>"""
        if order_rows else
        '<p style="color:#555;margin-bottom:28px;font-size:13px">No orders in the last 24h.</p>'
    )

    low_color      = "#ef4444" if bl_inv["low_stock"] > 10 else "#4ade80"
    activity_html  = "".join(activity["latest"])  or "<li style='color:#555'>No messages today</li>"
    learnings_html = "".join(learnings["lines"])   or "<li style='color:#555'>No learnings logged today</li>"

    return f"""
<div style="font-family:'Inter',Arial,sans-serif;background:#0a0a0f;color:#fff;
            max-width:720px;margin:auto;border:1px solid #1a1a2e;">
  <div style="background:linear-gradient(135deg,#0a0a1a,#1a0a2e);padding:36px 40px;
              border-bottom:2px solid #d97757;">
    <h1 style="margin:0;font-size:24px;color:#d97757;letter-spacing:3px;
               text-transform:uppercase;font-weight:800;">Daily Operations Brief</h1>
    <p style="margin:8px 0 0;font-size:12px;color:#444;letter-spacing:1px;">
      ANTIGRAVITY ORCHESTRA &bull; {DATE_DISPLAY} &bull; 07:00 UTC
    </p>
  </div>
  <div style="padding:32px 40px">
    <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:32px">
      {stat_block("BL Orders (24h)", bl_orders['count'], f"&pound;{bl_orders['revenue']:.2f} revenue")}
      {stat_block("Agency MRR", f"&pound;{crm_pipeline['total_mrr']:,}", f"{crm_pipeline['count']} active deals", "#f59e0b")}
      {stat_block("Agent Messages", activity['count'], "today in chatroom", "#60a5fa")}
      {stat_block("Active Projects", active_projects, f"{social_count} social posts", "#a78bfa")}
    </div>
    {section_head("BL Motorcycles — Recent Orders")}
    {orders_section}
    <div style="background:#0d0d18;border:1px solid #1a1a2e;padding:16px 20px;
                border-radius:4px;margin-bottom:28px;display:flex;gap:32px">
      <div>
        <div style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:1px">Total Products</div>
        <div style="font-size:22px;font-weight:700;color:#fff;margin-top:4px">{bl_inv['total']:,}</div>
      </div>
      <div>
        <div style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:1px">Low Stock (&lt;3 units)</div>
        <div style="font-size:22px;font-weight:700;color:{low_color};margin-top:4px">{bl_inv['low_stock']}</div>
      </div>
    </div>
    {section_head("Agency Pipeline", "#f59e0b")}
    <div style="background:#0d0d18;border:1px solid #1a1a2e;border-radius:4px;padding:16px 20px;margin-bottom:28px">
      <div style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">
        {crm_pipeline['count']} active deals &bull; Total MRR: <span style="color:#f59e0b;font-weight:700">&pound;{crm_pipeline['total_mrr']:,}/mo</span>
      </div>
      {''.join(
        f'<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #111;font-size:12px">'
        f'<span style="color:#ccc">{r["company"]}</span>'
        f'<span style="color:#f59e0b">&pound;{r["amount"]:.0f}/mo</span>'
        f'</div>'
        for r in crm_pipeline['rows']
      ) if crm_pipeline['rows'] else '<div style="color:#555;font-size:13px">No pipeline data available</div>'}
    </div>
    {section_head("Orchestra Activity", "#60a5fa")}
    <ul style="font-size:13px;line-height:1.9;color:#aaa;padding-left:20px;margin-bottom:28px">
      {activity_html}
    </ul>
    {section_head(f"Learnings Logged Today ({learnings['count']})", "#a78bfa")}
    <ul style="font-size:13px;line-height:1.9;color:#aaa;padding-left:20px;margin-bottom:16px">
      {learnings_html}
    </ul>
  </div>
  <div style="padding:18px 40px;border-top:1px solid #111;font-size:11px;color:#333;text-align:center">
    Antigravity Orchestra &bull; {NOW.strftime("%Y-%m-%d %H:%M")} UTC
    &bull; <a href="https://jonnyai.co.uk" style="color:#444">jonnyai.co.uk</a>
  </div>
</div>"""


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    print(f"[{NOW.strftime('%H:%M')}] Building Jonny daily report...")

    if not RESEND_API_KEY:
        print("  ERROR: RESEND_API_KEY not set")
        return False

    activity         = get_agent_activity()
    learnings        = get_learnings_today()
    social_count     = get_social_posts_today()
    calendar_pending = get_calendar_pending()
    bl_orders        = get_bl_orders()
    bl_inv           = get_bl_inventory()
    active_projects  = get_active_projects()
    crm_pipeline     = get_crm_pipeline()

    html = build_html(activity, learnings, social_count, calendar_pending,
                      bl_orders, bl_inv, active_projects, crm_pipeline)

    resp = requests.post(
        "https://api.resend.com/emails",
        headers={"Authorization": f"Bearer {RESEND_API_KEY}", "Content-Type": "application/json"},
        json={
            "from": "Antigravity Orchestra <reports@jonnyai.co.uk>",
            "to": "jonnyallum@gmail.com",
            "subject": (
                f"Daily Brief | {DATE_DISPLAY} | "
                f"{bl_orders['count']} orders | {activity['count']} msgs"
            ),
            "html": html
        },
        timeout=20
    )

    if resp.status_code in (200, 201):
        print(f"  Sent. Orders={bl_orders['count']} Revenue=£{bl_orders['revenue']:.2f} "
              f"Social={social_count} Learnings={learnings['count']}")
        return True
    else:
        print(f"  ERROR {resp.status_code}: {resp.text[:200]}")
        return False


if __name__ == "__main__":
    main()
