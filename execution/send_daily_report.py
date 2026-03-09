import os
import sys
import json
import argparse
import requests
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

# Fix Windows cp1252 encoding crash with emoji
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

load_dotenv()

# Configuration
RESEND_API_KEY = os.getenv("RESEND_API_KEY")
FROM_EMAIL = "Antigravity Orchestra <reports@jonnyai.co.uk>"
REPORT_EMAIL = "jonnyallum@gmail.com"
ROOT_DIR = Path(__file__).parent.parent
ARTIFACTS_DIR = Path(r"C:\Users\jonny\.gemini\antigravity\brain\35cee80f-4c60-40b0-9ae9-8f1114ba9105")

def send_daily_report(report_date=None):
    if not report_date:
        report_date = datetime.now().strftime("%Y_%m_%d")
    
    report_file = ARTIFACTS_DIR / f"daily_report_{report_date}.md"
    
    if not report_file.exists():
        # Fallback to general today
        report_file = ARTIFACTS_DIR / f"daily_report_{datetime.now().strftime('%Y_%m_%d')}.md"
    
    if not report_file.exists():
        print(f"  ❌ Report file not found: {report_file}")
        return False

    content = report_file.read_text(encoding="utf-8")
    
    # Convert simple markdown to basic HTML for email
    html_content = f"""
    <div style="font-family: 'Inter', sans-serif; max-width: 800px; margin: auto; padding: 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #d97757; font-family: 'Outfit', sans-serif; text-transform: uppercase; letter-spacing: 2px;">Daily Agency Standup</h1>
            <p style="color: #666; font-size: 14px;">{datetime.now().strftime('%B %d, %Y')}</p>
        </div>
        <div style="background: #f8f9fa; border-radius: 12px; padding: 30px; line-height: 1.6; border: 1px solid #eee;">
            {content.replace('\n', '<br>')}
        </div>
        <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #999;">
            Powered by Jonny AI | Antigravity Orchestra Jai.OS 5.0
        </div>
    </div>
    """

    payload = {
        "from": FROM_EMAIL,
        "to": REPORT_EMAIL,
        "subject": f"Daily Agency Standup - {datetime.now().strftime('%Y-%m-%d')}",
        "html": html_content
    }

    headers = {
        "Authorization": f"Bearer {RESEND_API_KEY}",
        "Content-Type": "application/json"
    }

    try:
        resp = requests.post("https://api.resend.com/emails", headers=headers, json=payload, timeout=15)
        if resp.status_code in (200, 201):
            print(f"  ✅ Daily report sent to {REPORT_EMAIL}")
            return True
        else:
            print(f"  ❌ Resend error: {resp.text}")
            return False
    except Exception as e:
        print(f"  ❌ Connection error: {e}")
        return False

if __name__ == "__main__":
    send_daily_report()
