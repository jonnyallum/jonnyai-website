# -*- coding: utf-8 -*-
"""
send_brett_detailed_report.py — Dynamic daily report for Brett (BL Motorcycles).
Pulls live orders, inventory, and stock data from BL Supabase.
Cron: 30 7 * * * (7:30am UTC daily)
"""
import os, sys, json, urllib.request, requests
from datetime import datetime, timezone, timedelta
from pathlib import Path
from dotenv import load_dotenv

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
BL_URL         = os.getenv("SUPABASE_URL", "")
BL_KEY         = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

NOW          = datetime.now(timezone.utc)
TODAY        = NOW.strftime("%Y-%m-%d")
YESTERDAY    = (NOW - timedelta(days=1)).strftime("%Y-%m-%d")
WEEK_AGO     = (NOW - timedelta(days=7)).strftime("%Y-%m-%d")
DATE_DISPLAY = NOW.strftime("%A %d %B %Y")


# ── Supabase helpers ──────────────────────────────────────────────────────────

def sb_get(table, params=""):
    if not BL_URL or not BL_KEY:
        return []
    try:
        req = urllib.request.Request(
            f"{BL_URL}/rest/v1/{table}?{params}",
            headers={"apikey": BL_KEY, "Authorization": f"Bearer {BL_KEY}"}
        )
        with urllib.request.urlopen(req, timeout=10) as r:
            return json.loads(r.read())
    except Exception as e:
        print(f"  [WARN] {table}: {e}")
        return []


def sb_count(table, params=""):
    if not BL_URL or not BL_KEY:
        return 0
    try:
        req = urllib.request.Request(
            f"{BL_URL}/rest/v1/{table}?{params}&select=id",
            headers={
                "apikey": BL_KEY, "Authorization": f"Bearer {BL_KEY}",
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

def get_orders_24h():
    rows    = sb_get("orders",
                     f"created_at=gte.{YESTERDAY}T07:00:00Z&order=created_at.desc&limit=20")
    revenue = sum(float(r.get("total_price", 0) or 0) for r in rows)
    return {"count": len(rows), "revenue": round(revenue, 2), "rows": rows}


def get_orders_7d():
    count   = sb_count("orders", f"created_at=gte.{WEEK_AGO}T00:00:00Z")
    rows    = sb_get("orders", f"created_at=gte.{WEEK_AGO}T00:00:00Z")
    revenue = sum(float(r.get("total_price", 0) or 0) for r in rows)
    return {"count": count, "revenue": round(revenue, 2)}


def get_inventory():
    total     = sb_count("products")
    active    = sb_count("products", "status=eq.active")
    low_stock = sb_count("products", "stock_quantity=lt.3")
    out_stock = sb_count("products", "stock_quantity=eq.0")
    return {"total": total, "active": active, "low_stock": low_stock, "out_stock": out_stock}


def get_pending_orders():
    return sb_get("orders", "status=eq.pending&order=created_at.asc&limit=10")


# ── HTML builder ──────────────────────────────────────────────────────────────

def stat_block(label, value, sub="", color="#2563eb"):
    sub_html = f'<div style="font-size:11px;color:#555;margin-top:3px">{sub}</div>' if sub else ""
    return f"""<div style="background:#f8faff;border:1px solid #e2e8f0;border-left:3px solid {color};
                padding:16px 20px;border-radius:4px;flex:1;min-width:130px">
        <div style="font-size:24px;font-weight:800;color:{color}">{value}</div>
        <div style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;margin-top:4px">{label}</div>
        {sub_html}
    </div>"""


def build_html(orders_24h, orders_7d, inventory, pending):

    order_rows = ""
    for o in orders_24h["rows"][:8]:
        sku    = (o.get("sku") or o.get("item_sku") or "—")[:20]
        buyer  = (o.get("buyer_name") or o.get("shipping_name") or "—")[:30].replace("<", "&lt;")
        val    = f"&pound;{float(o.get('total_price', 0) or 0):.2f}"
        status = o.get("status") or o.get("fulfillment_status") or "new"
        created = (o.get("created_at") or "")[:10]
        s_color = "#16a34a" if status == "fulfilled" else ("#d97706" if status == "pending" else "#3b82f6")
        order_rows += (f"<tr>"
                       f"<td style='padding:9px 12px;border-bottom:1px solid #f1f5f9;color:#374151'>{sku}</td>"
                       f"<td style='padding:9px 12px;border-bottom:1px solid #f1f5f9;color:#374151'>{buyer}</td>"
                       f"<td style='padding:9px 12px;border-bottom:1px solid #f1f5f9;font-weight:600;color:#1d4ed8'>{val}</td>"
                       f"<td style='padding:9px 12px;border-bottom:1px solid #f1f5f9;font-size:11px'>"
                       f"<span style='background:{s_color}20;color:{s_color};padding:2px 8px;border-radius:10px'>{status}</span></td>"
                       f"<td style='padding:9px 12px;border-bottom:1px solid #f1f5f9;color:#9ca3af;font-size:11px'>{created}</td>"
                       f"</tr>")

    orders_table = (
        f"""<table style="width:100%;border-collapse:collapse;margin-bottom:28px">
          <tr style="background:#f8faff">
            <th style="padding:9px 12px;text-align:left;color:#9ca3af;font-size:11px;text-transform:uppercase">SKU</th>
            <th style="padding:9px 12px;text-align:left;color:#9ca3af;font-size:11px;text-transform:uppercase">Buyer</th>
            <th style="padding:9px 12px;text-align:left;color:#9ca3af;font-size:11px;text-transform:uppercase">Value</th>
            <th style="padding:9px 12px;text-align:left;color:#9ca3af;font-size:11px;text-transform:uppercase">Status</th>
            <th style="padding:9px 12px;text-align:left;color:#9ca3af;font-size:11px;text-transform:uppercase">Date</th>
          </tr>{order_rows}</table>"""
        if order_rows else
        '<p style="color:#9ca3af;margin-bottom:28px;font-size:14px">No orders in the last 24 hours.</p>'
    )

    # Pending orders alert
    pending_html = ""
    if pending:
        pending_rows = ""
        for o in pending[:5]:
            sku   = (o.get("sku") or o.get("item_sku") or "—")[:20]
            buyer = (o.get("buyer_name") or "—")[:25].replace("<", "&lt;")
            age   = ""
            if o.get("created_at"):
                try:
                    created = datetime.fromisoformat(o["created_at"].replace("Z", "+00:00"))
                    age = f"{(NOW - created).days}d ago"
                except Exception:
                    pass
            pending_rows += (f"<tr>"
                             f"<td style='padding:8px 12px;border-bottom:1px solid #fef3c7;color:#374151'>{sku}</td>"
                             f"<td style='padding:8px 12px;border-bottom:1px solid #fef3c7;color:#374151'>{buyer}</td>"
                             f"<td style='padding:8px 12px;border-bottom:1px solid #fef3c7;color:#92400e;font-size:12px'>{age}</td>"
                             f"</tr>")
        pending_html = f"""
        <div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:4px;padding:16px 20px;margin-bottom:28px">
          <div style="font-size:13px;font-weight:700;color:#92400e;margin-bottom:10px">
            Action Required: {len(pending)} Pending Order(s)
          </div>
          <table style="width:100%;border-collapse:collapse">
            <tr><th style="text-align:left;font-size:11px;color:#b45309;padding:0 12px 6px 0">SKU</th>
                <th style="text-align:left;font-size:11px;color:#b45309;padding:0 12px 6px 0">Buyer</th>
                <th style="text-align:left;font-size:11px;color:#b45309;padding:0 0 6px">Age</th></tr>
            {pending_rows}
          </table>
        </div>"""

    low_stock_alert = ""
    if inventory["low_stock"] > 5:
        low_stock_alert = f"""
        <div style="background:#fef2f2;border:1px solid #fca5a5;border-radius:4px;padding:12px 16px;margin-bottom:16px;font-size:13px;color:#991b1b">
          Warning: {inventory['low_stock']} SKUs have fewer than 3 units in stock. Check your Bike It feed.
        </div>"""

    return f"""
<div style="font-family:'Inter',Arial,sans-serif;background:#ffffff;color:#111;
            max-width:720px;margin:auto;border:1px solid #e2e8f0;">
  <div style="background:#1e3a8a;padding:32px 40px;border-bottom:3px solid #2563eb;">
    <h1 style="margin:0;font-size:22px;color:#ffffff;letter-spacing:2px;
               text-transform:uppercase;font-weight:800;">BL Motorcycles — Daily Report</h1>
    <p style="margin:8px 0 0;font-size:12px;color:#93c5fd;letter-spacing:1px;">
      {DATE_DISPLAY} &bull; Prepared by Antigravity Orchestra
    </p>
  </div>
  <div style="padding:32px 40px">
    {pending_html}
    {low_stock_alert}
    <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:28px">
      {stat_block("Orders (24h)", orders_24h['count'], f"&pound;{orders_24h['revenue']:.2f} revenue")}
      {stat_block("Orders (7 days)", orders_7d['count'], f"&pound;{orders_7d['revenue']:.2f} revenue", "#7c3aed")}
      {stat_block("Active Listings", inventory['active'], f"{inventory['total']:,} total products", "#059669")}
      {stat_block("Low / Out of Stock", f"{inventory['low_stock']} / {inventory['out_stock']}", "requires attention", "#dc2626")}
    </div>
    <h2 style="font-size:13px;color:#374151;letter-spacing:2px;text-transform:uppercase;
               border-left:3px solid #2563eb;padding-left:12px;margin:0 0 12px">
      Orders in Last 24 Hours
    </h2>
    {orders_table}
    <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:4px;padding:16px 20px;font-size:13px;color:#0c4a6e">
      <strong>Need help?</strong> Reply to this email or contact Jonny at
      <a href="mailto:jonny@jonnyai.co.uk" style="color:#2563eb">jonny@jonnyai.co.uk</a>
    </div>
  </div>
  <div style="padding:16px 40px;border-top:1px solid #e2e8f0;font-size:11px;color:#9ca3af;text-align:center">
    BL Motorcycles Ltd &bull; Powered by Antigravity Orchestra &bull; {NOW.strftime("%Y-%m-%d %H:%M")} UTC
  </div>
</div>"""


# ── Main ──────────────────────────────────────────────────────────────────────

def send_brett_report():
    print(f"[{NOW.strftime('%H:%M')}] Building Brett daily report...")

    if not RESEND_API_KEY:
        print("  ERROR: RESEND_API_KEY not set")
        return False

    orders_24h = get_orders_24h()
    orders_7d  = get_orders_7d()
    inventory  = get_inventory()
    pending    = get_pending_orders()

    html = build_html(orders_24h, orders_7d, inventory, pending)

    resp = requests.post(
        "https://api.resend.com/emails",
        headers={"Authorization": f"Bearer {RESEND_API_KEY}", "Content-Type": "application/json"},
        json={
            "from": "Antigravity Orchestra <reports@jonnyai.co.uk>",
            "to": "blmotorcyclesltd@gmail.com",
            "reply_to": "jonny@jonnyai.co.uk",
            "subject": (
                f"BL Motorcycles Daily | {DATE_DISPLAY} | "
                f"{orders_24h['count']} orders"
                + (f" | {len(pending)} PENDING" if pending else "")
            ),
            "html": html
        },
        timeout=20
    )

    if resp.status_code in (200, 201):
        print(f"  Sent to Brett. Orders={orders_24h['count']} Revenue=£{orders_24h['revenue']:.2f} "
              f"Pending={len(pending)}")
        return True
    else:
        print(f"  ERROR {resp.status_code}: {resp.text[:200]}")
        return False


if __name__ == "__main__":
    send_brett_report()
