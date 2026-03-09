import requests, sys, json

N8N_BASE = "https://n8n.jonnyai.co.uk"
EMAIL    = "info@jonnyai.co.uk"
PASSWORD = "Aprilia100!69."

session = requests.Session()
r = session.post(f"{N8N_BASE}/rest/login", json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD})

# Get existing workflow
workflows = session.get(f"{N8N_BASE}/rest/workflows").json().get("data", [])
for w in workflows:
    if "CRM" in w.get("name", ""):
        print(f"Deleting {w['name']} ({w['id']})")
        session.delete(f"{N8N_BASE}/rest/workflows/{w['id']}")

# Full structurally perfect n8n workflow
WF = {
  "name": "Antigravity CRM -> Marcus Sync",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "crm-webhook",
        "responseMode": "lastNode",
        "options": {}
      },
      "id": "2daba5fc-5322-4a0b-bc67-a06f3dc8f643",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [
        220,
        280
      ],
      "webhookId": "f78aabc3-a550-4ff6-8367-27bba31d1ac7"
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://lkwydqtfbdjhxaarelaz.supabase.co/rest/v1/chatroom",
        "sendHeaders": True,
        "headerParameters": {
          "parameters": [
            {
              "name": "apikey",
              "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxrd3lkcXRmYmRqaHhhYXJlbGF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDI5ODI4MiwiZXhwIjoyMDg1ODc0MjgyfQ.35gJkeetflYO5FYXrjELwikxqFvcScxFCQr5qDD-Z24"
            },
            {
              "name": "Authorization",
              "value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxrd3lkcXRmYmRqaHhhYXJlbGF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDI5ODI4MiwiZXhwIjoyMDg1ODc0MjgyfQ.35gJkeetflYO5FYXrjELwikxqFvcScxFCQr5qDD-Z24"
            }
          ]
        },
        "sendBody": True,
        "bodyParameters": {
          "parameters": [
            {
              "name": "agent_id",
              "value": "marcus"
            },
            {
              "name": "message_type",
              "value": "broadcast"
            },
            {
              "name": "ai_source",
              "value": "n8n-crm-sync"
            },
            {
              "name": "message",
              "value": "={{ '🔔 CRM Note Added: ' + JSON.stringify($json.body) }}"
            }
          ]
        },
        "options": {}
      },
      "id": "eecf2b2c-623f-42e1-afcc-51bc13e370e7",
      "name": "HTTP Request",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [
        440,
        280
      ]
    }
  ],
  "pinData": {},
  "connections": {
    "Webhook": {
      "main": [
        [
          {
            "node": "HTTP Request",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "active": True,
  "settings": {
    "executionOrder": "v1"
  }
}

r2 = session.post(f"{N8N_BASE}/rest/workflows", json=WF)
j = r2.json()
print("Create Status:", r2.status_code)
wid = j.get("data", j).get("id")
print("New ID:", wid)

print(session.patch(f"{N8N_BASE}/rest/workflows/{wid}", json={"active": True}).status_code)
