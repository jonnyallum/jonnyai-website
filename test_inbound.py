import os
from resend import Resend

resend = Resend("re_ikc6Lxw5_Nas1LoakZvaGN1oybWkAQQAg")

params = {
    "from": "Testing Agent <support@jonnyai.co.uk>",
    "to": ["marcus@jonnyai.co.uk"],
    "subject": "SYSTEM TEST: Full Capability Audit",
    "html": "<p>Marcus, this is an automated system test to verify the full inbound-to-chatroom pipeline.</p><p>If you receive this, the infrastructure lockdown is successful.</p>"
}

print("🚀 Sending test email to marcus@jonnyai.co.uk...")
try:
    r = resend.emails.send(params)
    print(f"✅ Email sent! ID: {r['id']}")
except Exception as e:
    print(f"❌ Failed to send: {e}")
