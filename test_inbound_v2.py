import json
import urllib.request

url = "https://api.resend.com/emails"
api_key = "re_ikc6Lxw5_Nas1LoakZvaGN1oybWkAQQAg"

payload = {
    "from": "System Auditor <support@jonnyai.co.uk>",
    "to": ["marcus@jonnyai.co.uk"],
    "subject": "SYSTEM TEST: Full Capability Audit",
    "html": "<p>Marcus, this is an automated system test to verify the full inbound-to-chatroom pipeline.</p><p>If you receive this, the infrastructure lockdown is successful.</p>"
}

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers)

print("🚀 Sending test email via API...")
try:
    with urllib.request.urlopen(req) as response:
        res = response.read().decode('utf-8')
        print(f"✅ Success: {res}")
except Exception as e:
    print(f"❌ Error: {e}")
