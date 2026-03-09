"""
send_client_report.py — Standardised Client Progress Report System
===================================================================
Jai.OS 5.0 | Antigravity Orchestra

Sends branded progress reports to clients via Resend API.
Pulls live data from the Shared Brain (Supabase) to generate
real-time project status, recent activity, and next steps.

Usage:
    python send_client_report.py --project bl-motorcycles
    python send_client_report.py --project bl-motorcycles --dry-run
    python send_client_report.py --all-active

Requires:
    RESEND_API_KEY in .env
    ANTIGRAVITY_BRAIN_URL + ANTIGRAVITY_BRAIN_KEY in .env (or defaults to lkwydqtfbdjhxaarelaz)
"""

import os
import sys
import json
import argparse
import requests
from datetime import datetime, timedelta
from pathlib import Path

# Load .env if available
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# ═══════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════

RESEND_API_KEY = os.getenv("RESEND_API_KEY")
RESEND_URL = "https://api.resend.com/emails"

SUPABASE_URL = os.getenv("ANTIGRAVITY_BRAIN_URL", "https://lkwydqtfbdjhxaarelaz.supabase.co")
SUPABASE_KEY = os.getenv("ANTIGRAVITY_BRAIN_KEY", "")

FROM_EMAIL = "Antigravity Orchestra <reports@jonnyai.co.uk>"

# Client contact registry — maps project_id to client details
# This is the fallback if client_email is not set in the projects table
CLIENT_REGISTRY = {
    "bl-motorcycles": {
        "name": "Brett",
        "email": "brett@blmotorcycles.co.uk",
        "company": "BL Motorcycles"
    },
    "dj-waste": {
        "name": "DJ",
        "email": "",
        "company": "DJ Waste Management"
    },
    "village-bakery": {
        "name": "Client",
        "email": "",
        "company": "Village Bakery & Cafe"
    },
    "jsc-contractors": {
        "name": "Client",
        "email": "",
        "company": "JSC Contractors"
    },
    "la-aesthetician": {
        "name": "Client",
        "email": "",
        "company": "La Aesthetician"
    },
    "sparta-interiors": {
        "name": "Client",
        "email": "",
        "company": "Sparta Interiors"
    },
    "construct-fm": {
        "name": "Client",
        "email": "",
        "company": "Construct FM"
    },
    "longleat-facilities": {
        "name": "Client",
        "email": "",
        "company": "Longleat Facilities"
    },
    "cd-waste": {
        "name": "Client",
        "email": "",
        "company": "CD Waste"
    },
}


# ═══════════════════════════════════════════════════════
# SUPABASE QUERIES
# ═══════════════════════════════════════════════════════

def query_supabase(endpoint, params=None):
    """Query the Shared Brain via Supabase REST API."""
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }
    url = f"{SUPABASE_URL}/rest/v1/{endpoint}"
    try:
        resp = requests.get(url, headers=headers, params=params, timeout=10)
        if resp.status_code == 200:
            return resp.json()
        else:
            print(f"  ⚠️  Supabase query failed: {resp.status_code} {resp.text[:200]}")
            return []
    except Exception as e:
        print(f"  ⚠️  Supabase connection error: {e}")
        return []


def get_project_data(project_id):
    """Pull project metadata from the Shared Brain."""
    data = query_supabase("projects", {"id": f"eq.{project_id}", "select": "*"})
    return data[0] if data else None


def get_recent_tasks(project_id, days=14):
    """Pull recent completed tasks for this project."""
    since = (datetime.utcnow() - timedelta(days=days)).isoformat()
    return query_supabase("tasks", {
        "project_context": f"eq.{project_id}",
        "status": "eq.completed",
        "updated_at": f"gte.{since}",
        "select": "title,assigned_to,status,updated_at",
        "order": "updated_at.desc",
        "limit": "10"
    })


def get_recent_chatroom(project_id, days=14):
    """Pull recent chatroom messages for this project."""
    since = (datetime.utcnow() - timedelta(days=days)).isoformat()
    return query_supabase("chatroom", {
        "project_context": f"eq.{project_id}",
        "created_at": f"gte.{since}",
        "select": "agent_id,message,created_at",
        "order": "created_at.desc",
        "limit": "10"
    })


def get_recent_learnings(project_id, days=14):
    """Pull recent learnings tagged to this project."""
    since = (datetime.utcnow() - timedelta(days=days)).isoformat()
    return query_supabase("learnings", {
        "project": f"eq.{project_id}",
        "created_at": f"gte.{since}",
        "select": "agent_id,learning,created_at",
        "order": "created_at.desc",
        "limit": "5"
    })


# ═══════════════════════════════════════════════════════
# REPORT GENERATION
# ═══════════════════════════════════════════════════════

def generate_report_html(project_id, client_name, company, project_data, tasks, messages, learnings):
    """Generate a branded HTML progress report."""
    
    # Project status
    live_url = project_data.get("live_url", "N/A") if project_data else "N/A"
    health = project_data.get("health_score", "—") if project_data else "—"
    last_deploy = project_data.get("last_deploy", "—") if project_data else "—"
    if last_deploy and last_deploy != "—":
        try:
            last_deploy = datetime.fromisoformat(last_deploy.replace("Z", "+00:00")).strftime("%d %b %Y, %H:%M")
        except:
            pass
    
    # Build tasks section
    tasks_html = ""
    if tasks:
        for t in tasks[:8]:
            agent = t.get("assigned_to", "—")
            title = t.get("title", "Untitled")
            tasks_html += f'<tr><td style="padding:8px;border-bottom:1px solid #222;">@{agent}</td><td style="padding:8px;border-bottom:1px solid #222;">{title}</td><td style="padding:8px;border-bottom:1px solid #222;color:#4CAF50;">✅ Done</td></tr>'
    else:
        tasks_html = '<tr><td colspan="3" style="padding:12px;color:#666;">No completed tasks in the last 14 days.</td></tr>'
    
    # Build activity feed
    activity_html = ""
    if messages:
        for m in messages[:5]:
            agent = m.get("agent_id", "system")
            msg = m.get("message", "")[:120]
            ts = m.get("created_at", "")[:10]
            activity_html += f'<div style="padding:8px 0;border-bottom:1px solid #222;"><span style="color:#ffd700;">@{agent}</span> <span style="color:#666;font-size:12px;">{ts}</span><br/><span style="color:#ccc;">{msg}</span></div>'
    else:
        activity_html = '<p style="color:#666;">No recent activity logged.</p>'
    
    # Build learnings section
    learnings_html = ""
    if learnings:
        for l in learnings[:3]:
            agent = l.get("agent_id", "system")
            learning = l.get("learning", "")[:150]
            learnings_html += f'<div style="padding:6px 0;"><span style="color:#ffd700;">@{agent}:</span> <span style="color:#ccc;">{learning}</span></div>'
    
    report_date = datetime.utcnow().strftime("%d %B %Y")
    
    html = f"""
    <div style="font-family:'Inter',Arial,sans-serif;background-color:#0a0a0a;color:#ffffff;max-width:650px;margin:auto;padding:0;">
        
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#0a0a0a,#1a1a1a);padding:30px 40px;border-bottom:2px solid #ffd700;">
            <div style="display:flex;align-items:center;justify-content:space-between;">
                <div>
                    <h1 style="margin:0;font-size:22px;color:#ffd700;letter-spacing:1px;">PROGRESS REPORT</h1>
                    <p style="margin:5px 0 0;font-size:13px;color:#888;text-transform:uppercase;">{company} | {report_date}</p>
                </div>
                <div style="text-align:right;">
                    <p style="margin:0;font-size:11px;color:#666;">Powered by</p>
                    <p style="margin:0;font-size:14px;color:#ffd700;font-weight:bold;">Antigravity Orchestra</p>
                </div>
            </div>
        </div>
        
        <!-- Greeting -->
        <div style="padding:30px 40px 20px;">
            <p style="font-size:16px;line-height:1.6;margin:0;">Hi {client_name},</p>
            <p style="font-size:15px;line-height:1.6;color:#ccc;margin:10px 0 0;">
                Here's your latest progress update from the team working on <strong style="color:#fff;">{company}</strong>. 
                Below you'll find completed work, recent activity, and what's coming next.
            </p>
        </div>
        
        <!-- Project Status Card -->
        <div style="margin:0 40px 20px;background:#111;border:1px solid #222;border-radius:8px;padding:20px;">
            <h3 style="margin:0 0 15px;color:#ffd700;font-size:14px;text-transform:uppercase;letter-spacing:1px;">Project Status</h3>
            <table style="width:100%;font-size:14px;">
                <tr>
                    <td style="padding:6px 0;color:#888;">Live URL</td>
                    <td style="padding:6px 0;color:#4CAF50;"><a href="https://{live_url}" style="color:#4CAF50;text-decoration:none;">{live_url}</a></td>
                </tr>
                <tr>
                    <td style="padding:6px 0;color:#888;">Health Score</td>
                    <td style="padding:6px 0;color:#fff;">{health}/100</td>
                </tr>
                <tr>
                    <td style="padding:6px 0;color:#888;">Last Deploy</td>
                    <td style="padding:6px 0;color:#fff;">{last_deploy}</td>
                </tr>
            </table>
        </div>
        
        <!-- Completed Tasks -->
        <div style="margin:0 40px 20px;background:#111;border:1px solid #222;border-radius:8px;padding:20px;">
            <h3 style="margin:0 0 15px;color:#ffd700;font-size:14px;text-transform:uppercase;letter-spacing:1px;">Completed Work (Last 14 Days)</h3>
            <table style="width:100%;font-size:13px;border-collapse:collapse;">
                <tr style="color:#888;text-transform:uppercase;font-size:11px;">
                    <td style="padding:8px;border-bottom:1px solid #333;">Agent</td>
                    <td style="padding:8px;border-bottom:1px solid #333;">Task</td>
                    <td style="padding:8px;border-bottom:1px solid #333;">Status</td>
                </tr>
                {tasks_html}
            </table>
        </div>
        
        <!-- Activity Feed -->
        <div style="margin:0 40px 20px;background:#111;border:1px solid #222;border-radius:8px;padding:20px;">
            <h3 style="margin:0 0 15px;color:#ffd700;font-size:14px;text-transform:uppercase;letter-spacing:1px;">Recent Activity</h3>
            {activity_html}
        </div>
        
        {"" if not learnings_html else f'''
        <!-- Key Learnings -->
        <div style="margin:0 40px 20px;background:#111;border:1px solid #222;border-radius:8px;padding:20px;">
            <h3 style="margin:0 0 15px;color:#ffd700;font-size:14px;text-transform:uppercase;letter-spacing:1px;">Key Learnings</h3>
            {learnings_html}
        </div>
        '''}
        
        <!-- Footer -->
        <div style="padding:25px 40px;border-top:1px solid #222;text-align:center;">
            <p style="font-size:12px;color:#666;margin:0;">
                Jai.OS 5.0 | Antigravity Orchestra | Sent by @marcus
            </p>
            <p style="font-size:11px;color:#444;margin:5px 0 0;">
                This is an automated progress report. Reply to this email to reach the team directly.
            </p>
        </div>
    </div>
    """
    return html


# ═══════════════════════════════════════════════════════
# EMAIL DELIVERY
# ═══════════════════════════════════════════════════════

def send_report(to_email, client_name, company, html_content, dry_run=False):
    """Send the report via Resend API."""
    if dry_run:
        print(f"  📧 [DRY RUN] Would send to: {to_email}")
        print(f"  📧 Subject: Progress Report — {company} | {datetime.utcnow().strftime('%d %b %Y')}")
        print(f"  📧 HTML length: {len(html_content)} chars")
        return True
    
    if not RESEND_API_KEY:
        print("  ❌ RESEND_API_KEY not found in environment. Cannot send.")
        return False
    
    payload = {
        "from": FROM_EMAIL,
        "to": to_email,
        "subject": f"Progress Report — {company} | {datetime.utcnow().strftime('%d %b %Y')}",
        "html": html_content,
        "reply_to": "jonny@jonnyai.co.uk"
    }
    headers = {
        "Authorization": f"Bearer {RESEND_API_KEY}",
        "Content-Type": "application/json"
    }
    
    try:
        resp = requests.post(RESEND_URL, headers=headers, json=payload, timeout=15)
        if resp.status_code in (200, 201):
            resend_id = resp.json().get("id", "unknown")
            print(f"  ✅ Report sent to {to_email} — Resend ID: {resend_id}")
            return True
        else:
            print(f"  ❌ Resend error ({resp.status_code}): {resp.text[:200]}")
            return False
    except Exception as e:
        print(f"  ❌ Connection error: {e}")
        return False


# ═══════════════════════════════════════════════════════
# CHATROOM LOGGING
# ═══════════════════════════════════════════════════════

def log_to_chatroom(project_id, client_name, success):
    """Post a chatroom message logging the report delivery."""
    if not SUPABASE_KEY:
        return
    
    status = "delivered" if success else "FAILED"
    message = f"[REPORT] Client progress report {status} for {project_id} → {client_name}"
    
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    payload = {
        "agent_id": "marcus",
        "ai_source": "python-script",
        "machine_id": "antigravity-local",
        "message": message,
        "message_type": "broadcast",
        "project_context": project_id,
        "mentions": ["@marcus", f"@{project_id}"],
        "metadata": json.dumps({"content_type": "CLIENT_REPORT", "status": status})
    }
    
    try:
        resp = requests.post(
            f"{SUPABASE_URL}/rest/v1/chatroom",
            headers=headers,
            json=payload,
            timeout=10
        )
        if resp.status_code in (200, 201, 204):
            print(f"  📝 Logged to chatroom: {message}")
    except:
        pass


# ═══════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════

def process_project(project_id, dry_run=False):
    """Generate and send a report for a single project."""
    print(f"\n{'='*50}")
    print(f"📊 Generating report for: {project_id}")
    print(f"{'='*50}")
    
    # Get client info
    client_info = CLIENT_REGISTRY.get(project_id, {})
    client_name = client_info.get("name", "Client")
    client_email = client_info.get("email", "")
    company = client_info.get("company", project_id)
    
    if not client_email:
        print(f"  ⚠️  No client email configured for {project_id}. Skipping.")
        return False
    
    # Pull live data
    print(f"  📡 Querying Shared Brain...")
    project_data = get_project_data(project_id)
    tasks = get_recent_tasks(project_id)
    messages = get_recent_chatroom(project_id)
    learnings = get_recent_learnings(project_id)
    
    print(f"  📊 Data: project={'found' if project_data else 'missing'}, tasks={len(tasks)}, messages={len(messages)}, learnings={len(learnings)}")
    
    # Generate HTML
    html = generate_report_html(project_id, client_name, company, project_data, tasks, messages, learnings)
    
    # Send
    success = send_report(client_email, client_name, company, html, dry_run=dry_run)
    
    # Log to chatroom
    if not dry_run:
        log_to_chatroom(project_id, client_name, success)
    
    return success


def main():
    parser = argparse.ArgumentParser(description="Send client progress reports via Resend")
    parser.add_argument("--project", type=str, help="Project ID to send report for")
    parser.add_argument("--all-active", action="store_true", help="Send reports for all active projects with client emails")
    parser.add_argument("--dry-run", action="store_true", help="Preview without sending")
    args = parser.parse_args()
    
    if not args.project and not args.all_active:
        parser.print_help()
        sys.exit(1)
    
    if args.project:
        process_project(args.project, dry_run=args.dry_run)
    elif args.all_active:
        print("📧 Sending reports for all active projects with client emails...")
        sent = 0
        skipped = 0
        for pid, info in CLIENT_REGISTRY.items():
            if info.get("email"):
                process_project(pid, dry_run=args.dry_run)
                sent += 1
            else:
                skipped += 1
        print(f"\n{'='*50}")
        print(f"📊 Summary: {sent} sent, {skipped} skipped (no email)")


if __name__ == "__main__":
    main()
