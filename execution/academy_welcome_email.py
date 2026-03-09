import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

RESEND_API_KEY = os.getenv("RESEND_API_KEY")
RESEND_URL = "https://api.resend.com/emails"

def send_academy_welcome(email, name):
    """Send a God-Tier welcome email to a new Academy Founding Member."""
    if not RESEND_API_KEY:
        print("❌ ERROR: RESEND_API_KEY missing.")
        return False

    # Gold Standard Aesthetic: Charcoal, Safety Orange (#FF5722), White
    html_content = f"""
    <div style="font-family: 'Inter', sans-serif; background-color: #0c0c0c; color: #ffffff; padding: 40px; border: 1px solid #333; max-width: 600px; margin: auto;">
        <div style="border-left: 4px solid #FF5722; padding-left: 20px; margin-bottom: 30px;">
            <h1 style="text-transform: uppercase; letter-spacing: 2px; margin: 0; color: #FF5722;">Antigravity Academy</h1>
            <p style="text-transform: uppercase; font-size: 12px; margin: 5px 0 0 0; opacity: 0.6;">Mission Notification | Founding Member Intake</p>
        </div>
        
        <p style="font-size: 18px; line-height: 1.6;">Welcome to the Orchestra, <strong>{name}</strong>.</p>
        
        <p style="font-size: 16px; line-height: 1.6; opacity: 0.9;">
            You have successfully secured your position as a <strong>Founding Member</strong> of the Antigravity Academy. 
            This is not just a course; it is an induction into the Jai.OS 5.0 Hive Mind.
        </p>

        <div style="background: #1a1a1a; padding: 20px; border: 1px solid #FF5722; margin: 30px 0;">
            <h3 style="margin-top: 0; color: #FF5722; text-transform: uppercase; font-size: 14px;">Cohort 01 Schedule</h3>
            <ul style="list-style: none; padding: 0; margin: 0; font-size: 15px;">
                <li style="margin-bottom: 10px;">📅 <strong>Activation Date:</strong> March 10th, 2026</li>
                <li style="margin-bottom: 10px;">🎯 <strong>Objective:</strong> Agentic Mastery & Full-Stack Orchestration</li>
                <li style="margin-bottom: 0;">🛠️ <strong>Status:</strong> Scaffolding in progress...</li>
            </ul>
        </div>

        <p style="font-size: 15px; line-height: 1.6; opacity: 0.8;">
            In the coming days, you will receive your unique access credentials to the Academy Portal. 
            Prepare for high-velocity builds.
        </p>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #333; font-size: 12px; opacity: 0.5; text-align: center;">
            <p>Jai.OS 5.0 | Antigravity Orchestra | The Future of Work is Orchestrated.</p>
            <p>Sent via @nathan (Automation & Email Architect)</p>
        </div>
    </div>
    """

    payload = {
        "from": "Antigravity Academy <academy@jonnyai.co.uk>",
        "to": email,
        "subject": "WELCOME TO THE ORCHESTRA | Antigravity Academy Founding Member",
        "html": html_content
    }

    headers = {
        "Authorization": f"Bearer {RESEND_API_KEY}",
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(RESEND_URL, headers=headers, json=payload)
        if response.status_code == 200 or response.status_code == 201:
            print(f"[OK] Welcome email sent to {email}")
            return True
        else:
            print(f"[FAIL] Resend error: {response.text}")
            return False
    except Exception as e:
        print(f"[FAIL] Request error: {e}")
        return False

if __name__ == "__main__":
    # Test send
    test_email = "jonnyallum@gmail.com" # Using your email for the test
    send_academy_welcome(test_email, "Jonny")
