import requests, sys, json

N8N_BASE = "https://n8n.jonnyai.co.uk"
EMAIL    = "info@jonnyai.co.uk"
PASSWORD = "Aprilia100!69."

session = requests.Session()
r = session.post(f"{N8N_BASE}/rest/login", json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD})

workflow_id = "IXnG6uZu3LSiPctj"
r = session.get(f"{N8N_BASE}/rest/workflows/{workflow_id}")
wf = r.json()
data = wf.get("data", {})

# Enforce the connection
data['connections'] = {
    "Webhook: CRM Event": {
        "main": [
            [
                {
                    "node": "Log to Chatroom (@Marcus)",
                    "type": "main",
                    "index": 0
                }
            ]
        ]
    }
}
data['active'] = True

r2 = session.put(f"{N8N_BASE}/rest/workflows/{workflow_id}", json=data)
print(f"Put status: {r2.status_code}")
