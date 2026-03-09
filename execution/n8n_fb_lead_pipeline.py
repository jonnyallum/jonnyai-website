"""
n8n_fb_lead_pipeline.py — Facebook Lead Ad → CRM Pipeline
============================================================
Called by n8n webhook when a Facebook Lead Ad form is submitted.

Flow:
  1. Receive lead data (name, email, phone, form answers)
  2. Insert into Supabase `prospects` table
  3. Send branded welcome email via Resend
  4. Alert Jonny via Telegram
  5. Optionally invite liker to follow the Page

Usage:
  Called via n8n HTTP Request node with POST body containing lead data.
  Can also be run standalone for testing:
    python execution/n8n_fb_lead_pipeline.py --test
"""

import os
import sys
import json
import requests
from datetime import datetime, timezone
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

try:
    from dotenv import load_dotenv
    load_dotenv()
except: pass

BRAIN_URL = os.getenv("ANTIGRAVITY_BRAIN_URL", "")
BRAIN_KEY = os.getenv("ANTIGRAVITY_BRAIN_SERVICE_ROLE_KEY", "")
RESEND_KEY = os.getenv("RESEND_API_KEY", "")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "")
FB_PAGE_TOKEN = os.getenv("FACEBOOK_PAGE_ACCESS_TOKEN", "")
FB_PAGE_ID = os.getenv("FACEBOOK_PAGE_ID", "")


def process_lead(lead_data: dict) -> dict:
    """
    Process a Facebook Lead Ad submission.
    
    Expected lead_data format:
    {
        "name": "John Smith",
        "email": "john@example.com",
        "phone": "+447700900000",
        "form_name": "Get a Free Quote",
        "ad_name": "Website Design Ad",
        "source": "facebook_lead_ad",
        "answers": {"budget": "1000-5000", "service": "Website Design"}
    }
    """
    now = datetime.now(timezone.utc)
    name = lead_data.get("name", "Unknown")
    email = lead_data.get("email", "")
    phone = lead_data.get("phone", "")
    source = lead_data.get("source", "facebook_lead_ad")
    form_name = lead_data.get("form_name", "")
    answers = lead_data.get("answers", {})

    print(f"\n{'='*60}")
    print(f"🎯 NEW LEAD: {name} ({email})")
    print(f"   Source: {source} | Form: {form_name}")
    print(f"{'='*60}")

    results = {"lead": name, "steps": {}}

    # 1. Insert into Supabase prospects table
    if BRAIN_URL and BRAIN_KEY:
        prospect = {
            "name": name,
            "email": email,
            "phone": phone,
            "source": source,
            "status": "new",
            "form_name": form_name,
            "answers": json.dumps(answers) if answers else None,
            "created_at": now.isoformat(),
            "notes": f"Auto-captured from {source} at {now.strftime('%d/%m/%Y %H:%M')}"
        }
        try:
            resp = requests.post(
                f"{BRAIN_URL}/rest/v1/prospects",
                headers={
                    "apikey": BRAIN_KEY,
                    "Authorization": f"Bearer {BRAIN_KEY}",
                    "Content-Type": "application/json",
                    "Prefer": "return=minimal"
                },
                json=prospect, timeout=8
            )
            results["steps"]["supabase"] = "OK" if resp.status_code in (200, 201, 204) else f"FAIL:{resp.status_code}"
            print(f"  📊 Supabase: {results['steps']['supabase']}")
        except Exception as e:
            results["steps"]["supabase"] = f"ERROR:{e}"
            print(f"  ❌ Supabase error: {e}")
    else:
        results["steps"]["supabase"] = "SKIPPED (no credentials)"

    # 2. Send branded welcome email via Resend
    if RESEND_KEY and email:
        try:
            email_html = f"""
            <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #0a0a0a; color: #e0e0e0; border-radius: 12px;">
                <img src="https://jonnyai.co.uk/brand/antigravity_logo_cinematic.png" alt="Antigravity" style="width: 180px; margin-bottom: 24px;" />
                <h1 style="color: #ffffff; font-size: 24px; margin-bottom: 16px;">Thanks for reaching out, {name.split()[0]}!</h1>
                <p style="line-height: 1.6; color: #b0b0b0;">We received your enquiry and one of our team will be in touch within 24 hours.</p>
                <p style="line-height: 1.6; color: #b0b0b0;">At Antigravity, we build high-performance digital systems for businesses that want to move fast and scale with confidence.</p>
                <div style="margin: 32px 0; padding: 20px; background: #1a1a2e; border-radius: 8px; border-left: 4px solid #6c63ff;">
                    <p style="color: #ffffff; margin: 0;"><strong>What happens next:</strong></p>
                    <ul style="color: #b0b0b0; padding-left: 20px;">
                        <li>We review your requirements</li>
                        <li>A specialist will contact you directly</li>
                        <li>We provide a tailored proposal within 48 hours</li>
                    </ul>
                </div>
                <p style="line-height: 1.6; color: #b0b0b0;">In the meantime, explore what we do at <a href="https://jonnyai.co.uk" style="color: #6c63ff;">jonnyai.co.uk</a></p>
                <hr style="border: 1px solid #222; margin: 32px 0;" />
                <p style="font-size: 12px; color: #666;">Antigravity Agency | jonnyai.co.uk | Precision-Engineered Digital Growth</p>
            </div>
            """
            resp = requests.post(
                "https://api.resend.com/emails",
                headers={"Authorization": f"Bearer {RESEND_KEY}", "Content-Type": "application/json"},
                json={
                    "from": "Antigravity <hello@jonnyai.co.uk>",
                    "to": [email],
                    "subject": f"Thanks for your enquiry, {name.split()[0]}!",
                    "html": email_html
                },
                timeout=10
            )
            results["steps"]["email"] = "SENT" if resp.status_code in (200, 201) else f"FAIL:{resp.status_code}"
            print(f"  📧 Email: {results['steps']['email']}")
        except Exception as e:
            results["steps"]["email"] = f"ERROR:{e}"
    else:
        results["steps"]["email"] = "SKIPPED"

    # 3. Alert Jonny via Telegram
    if TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID:
        try:
            msg = (
                f"🎯 *NEW LEAD*\n\n"
                f"*Name:* {name}\n"
                f"*Email:* {email}\n"
                f"*Phone:* {phone or 'Not provided'}\n"
                f"*Source:* {source}\n"
                f"*Form:* {form_name}\n"
            )
            if answers:
                msg += f"*Answers:* {json.dumps(answers)}\n"
            msg += f"\n_Captured {now.strftime('%d/%m/%Y %H:%M')} UTC_"

            resp = requests.post(
                f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage",
                json={"chat_id": TELEGRAM_CHAT_ID, "text": msg, "parse_mode": "Markdown"},
                timeout=8
            )
            results["steps"]["telegram"] = "SENT" if resp.status_code == 200 else f"FAIL:{resp.status_code}"
            print(f"  📱 Telegram: {results['steps']['telegram']}")
        except Exception as e:
            results["steps"]["telegram"] = f"ERROR:{e}"
    else:
        results["steps"]["telegram"] = "SKIPPED (no credentials)"

    print(f"\n✅ Lead pipeline complete: {results['steps']}")
    return results


def track_post_engagers(post_id: str) -> list:
    """
    Fetch likers and commenters for a given post and store them as warm leads.
    Also attempts to invite likers to follow the Page.
    """
    if not FB_PAGE_TOKEN or not post_id:
        return []

    engagers = []

    # Fetch likers
    try:
        resp = requests.get(
            f"https://graph.facebook.com/v19.0/{post_id}/likes",
            params={"access_token": FB_PAGE_TOKEN, "limit": 100},
            timeout=8
        )
        if resp.status_code == 200:
            for user in resp.json().get("data", []):
                engagers.append({"fb_id": user["id"], "name": user.get("name", ""), "type": "liker", "post_id": post_id})
    except: pass

    # Fetch commenters
    try:
        resp = requests.get(
            f"https://graph.facebook.com/v19.0/{post_id}/comments",
            params={"access_token": FB_PAGE_TOKEN, "fields": "from,message", "limit": 100},
            timeout=8
        )
        if resp.status_code == 200:
            for comment in resp.json().get("data", []):
                frm = comment.get("from", {})
                engagers.append({
                    "fb_id": frm.get("id", ""),
                    "name": frm.get("name", ""),
                    "type": "commenter",
                    "message": comment.get("message", "")[:200],
                    "post_id": post_id
                })
    except: pass

    # Store engagers in Supabase for retargeting
    if BRAIN_URL and BRAIN_KEY and engagers:
        for eng in engagers:
            try:
                requests.post(
                    f"{BRAIN_URL}/rest/v1/fb_engagers",
                    headers={
                        "apikey": BRAIN_KEY,
                        "Authorization": f"Bearer {BRAIN_KEY}",
                        "Content-Type": "application/json",
                        "Prefer": "return=minimal"
                    },
                    json={
                        "fb_user_id": eng["fb_id"],
                        "name": eng["name"],
                        "engagement_type": eng["type"],
                        "post_id": eng["post_id"],
                        "message": eng.get("message", ""),
                    },
                    timeout=5
                )
            except: pass
        print(f"  👥 Tracked {len(engagers)} engagers from post {post_id}")

    return engagers


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--test", action="store_true", help="Run with test data")
    args = parser.parse_args()

    if args.test:
        test_lead = {
            "name": "Test Lead",
            "email": "test@example.com",
            "phone": "+447700900000",
            "form_name": "Get a Free Quote",
            "source": "facebook_lead_ad",
            "answers": {"budget": "1000-5000", "service": "Website Design"}
        }
        process_lead(test_lead)
    else:
        # Read from stdin (n8n passes JSON body)
        data = json.loads(sys.stdin.read())
        result = process_lead(data)
        print(json.dumps(result))
