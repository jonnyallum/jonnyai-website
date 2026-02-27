import json
import urllib.request

url = "https://api.resend.com/emails"
api_key = "re_ikc6Lxw5_Nas1LoakZvaGN1oybWkAQQAg"

payload = {
    "from": "onboarding@resend.dev",
    "to": ["marcus@jonnyai.co.uk"],
    "subject": "SYSTEM TEST: Global Orchestration Lockdown",
    "html": "<p>Marcus, confirming the inbound frequency is locked and verified.</p>"
}

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers)

print("🚀 Sending test email to marcus@jonnyai.co.uk...")
try:
    with urllib.request.urlopen(req) as response:
        res = response.read().decode('utf-8')
        print(f"✅ Success: {res}")
except Exception as e:
    print(f"❌ Error: {e}")
