import os
import smtplib
from email.message import EmailMessage
import glob
from pathlib import Path

# Run dreamer to ensure we have a fresh one
os.system("python execution/dreamer_daily.py")

# Find the latest dreamer daily report
tmp_dir = Path(".tmp")
reports = sorted(tmp_dir.glob("dreamer_daily_*.md"))

if not reports:
    print("No dreamer reports found.")
    sys.exit(1)

latest_report = reports[-1]
content = latest_report.read_text(encoding="utf-8")

# Email it to info@jonnyai.co.uk using the RESEND API
import requests
from dotenv import load_dotenv

load_dotenv()
resend_key = os.getenv("RESEND_API_KEY")

if not resend_key:
    print("No RESEND_API_KEY found.")
else:
    print("Sending via Resend API...")
    url = "https://api.resend.com/emails"
    headers = {
        "Authorization": f"Bearer {resend_key}",
        "Content-Type": "application/json"
    }
    
    html_content = content.replace('\n', '<br>')
    
    payload = {
        "from": "marcus@jonnyai.co.uk",
        "to": "info@jonnyai.co.uk",
        "subject": f"🔥 Dreamer Daily Ideas Report - {latest_report.name}",
        "html": f"<h2>Your missing Dreamer Ideas report!</h2><br>{html_content}"
    }

    response = requests.post(url, json=payload, headers=headers)
    print("Resend status:", response.status_code)
    print("Resend response:", response.text)
