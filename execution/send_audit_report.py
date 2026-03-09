import os
import sys
import json
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# Configuration
RESEND_API_KEY = os.getenv("RESEND_API_KEY")
FROM_EMAIL = "audits@jonnyai.co.uk" # Using established .co.uk domain

def send_audit_report(to_email, agent_name, checksum_id, report_data):
    """
    Sends the sanitized audit report to the client via Resend API.
    """
    if not RESEND_API_KEY:
        print("❌ ERROR: RESEND_API_KEY missing. Mission Blocked.")
        return False
    
    print(f"📧 @hannah: Delivering Gold Standard report to {to_email}...")
    
    url = "https://api.resend.com/emails"
    headers = {
        "Authorization": f"Bearer {RESEND_API_KEY}",
        "Content-Type": "application/json"
    }
    
    # Logic Scrambler (IP Protection) - abstracting metrics
    status = "VERIFIED_SECURE" if report_data.get("gates_passed", 0) == 13 else "RISK_DETECTED"
    
    payload = {
        "from": FROM_EMAIL,
        "to": to_email,
        "subject": f"Jai.OS Audit COMPLETE: {agent_name} (CID: {checksum_id})",
        "html": f"""
            <div style="font-family: sans-serif; background: #0c0c0c; color: #fff; padding: 40px; border-radius: 12px;">
                <h1 style="color: #ffd700; font-style: italic;">Antigravity Gold Standard</h1>
                <p>The 13-gate verification for <strong>{agent_name}</strong> is complete.</p>
                <div style="border: 1px solid #333; padding: 20px; margin: 20px 0;">
                    <p><strong>Checksum ID:</strong> {checksum_id}</p>
                    <p><strong>Status:</strong> {status}</p>
                </div>
                <p>Your "Antigravity Checksum" badge is now active on our global registry.</p>
                <p style="color: #666; font-size: 12px;">Powered by Jai.OS 5.0 | Mission: Gold Standard</p>
            </div>
        """
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        if response.status_code == 200 or response.status_code == 201:
            print(f"✅ Success: Report delivered to {to_email}. Resend ID: {response.json().get('id')}")
            return True
        else:
            print(f"❌ Resend API Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Connection Error: {e}")
        return False

if __name__ == "__main__":
    # Test session trigger
    send_audit_report("jonny@jonnyai.website", "Test Agent V1", "GS-B821", {"gates_passed": 13})
