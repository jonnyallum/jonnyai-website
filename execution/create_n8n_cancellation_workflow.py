"""
create_n8n_cancellation_workflow.py
Builds the BL Motorcycles Cancellation Follow-Up workflow in n8n via REST API.
Jai.OS 5.0 | @Nathan / @Marcus
"""
import sys
import requests
import json
import os
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

def get_env(key):
    env_path = "c:/Users/jonny/Desktop/JonnyAI_JaiOS_4.0/.env"
    if not os.path.exists(env_path):
        return os.getenv(key, "")
    with open(env_path, "r", encoding="utf-8-sig", errors="ignore") as f:
        for line in f:
            line = line.strip()
            if line.startswith(f"{key}="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    return os.getenv(key, "")

N8N_BASE = "https://n8n.jonnyai.co.uk"
N8N_API_KEY = get_env("N8N_API_KEY")

# Try X-N8N-API-KEY first, fall back to Bearer if needed
HEADERS = {
    "X-N8N-API-KEY": N8N_API_KEY,
    "Authorization": f"Bearer {N8N_API_KEY}",
    "Content-Type": "application/json"
}

# The workflow definition
WORKFLOW = {
    "name": "BL Motorcycles — Order Cancellation Follow-Up",
    "active": True,
    "nodes": [
        {
            "id": "trigger-1",
            "name": "Supabase Order Change",
            "type": "n8n-nodes-base.webhook",
            "typeVersion": 2,
            "position": [240, 300],
            "webhookId": "bl-order-cancel",
            "parameters": {
                "httpMethod": "POST",
                "path": "bl-order-cancel",
                "responseMode": "onReceived",
                "responseData": "firstEntryJson"
            }
        },
        {
            "id": "filter-1",
            "name": "Filter: Cancelled Orders",
            "type": "n8n-nodes-base.filter",
            "typeVersion": 1,
            "position": [460, 300],
            "parameters": {
                "conditions": {
                    "string": [
                        {
                            "value1": "={{ $json.record.status }}",
                            "operation": "equals",
                            "value2": "cancelled"
                        }
                    ]
                }
            }
        },
        {
            "id": "switch-1",
            "name": "Classify Cancel Reason",
            "type": "n8n-nodes-base.switch",
            "typeVersion": 1,
            "position": [680, 300],
            "parameters": {
                "dataType": "string",
                "value1": "={{ $json.record.failure_reason }}",
                "rules": {
                    "rules": [
                        {"value2": "Brett own stock — dispatch manually", "output": 0},
                        {"value2": "SKU not found on portal", "output": 1}
                    ]
                },
                "fallbackOutput": 2
            }
        },
        {
            "id": "email-local",
            "name": "Email: Local Stock (Brett Dispatches)",
            "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 4,
            "position": [900, 160],
            "parameters": {
                "method": "POST",
                "url": "https://api.resend.com/emails",
                "authentication": "genericCredentialType",
                "genericAuthType": "httpHeaderAuth",
                "sendHeaders": True,
                "headerParameters": {
                    "parameters": [
                        {"name": "Authorization", "value": "Bearer {{ $env.RESEND_API_KEY }}"}
                    ]
                },
                "sendBody": True,
                "bodyParameters": {
                    "parameters": [
                        {"name": "from", "value": "BL Motorcycles <orders@bl-motorcycles.co.uk>"},
                        {"name": "to", "value": "={{ $json.record.customer_email }}"},
                        {"name": "subject", "value": "Your Order is Being Prepared — BL Motorcycles"},
                        {"name": "html", "value": "<h2>Great news!</h2><p>Your order <strong>#{{ $json.record.order_number }}</strong> contains items from our own workshop stock and will be dispatched by Brett directly within 1-2 business days.</p><p>You'll receive tracking info shortly. Thank you for your patience!</p><p>— The BL Motorcycles Team</p>"}
                    ]
                }
            }
        },
        {
            "id": "email-sku",
            "name": "Email: SKU Not Found Apology",
            "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 4,
            "position": [900, 300],
            "parameters": {
                "method": "POST",
                "url": "https://api.resend.com/emails",
                "sendBody": True,
                "bodyParameters": {
                    "parameters": [
                        {"name": "from", "value": "BL Motorcycles <orders@bl-motorcycles.co.uk>"},
                        {"name": "to", "value": "={{ $json.record.customer_email }}"},
                        {"name": "subject", "value": "Important Update on Your Order — BL Motorcycles"},
                        {"name": "html", "value": "<h2>We're sorry.</h2><p>Unfortunately, one or more items in order <strong>#{{ $json.record.order_number }}</strong> are currently out of stock with our supplier.</p><p>We have issued a <strong>full refund</strong> which will appear in 3-5 business days.</p><p>We apologise for any inconvenience. — BL Motorcycles</p>"}
                    ]
                }
            }
        },
        {
            "id": "email-generic",
            "name": "Email: Generic Cancellation",
            "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 4,
            "position": [900, 440],
            "parameters": {
                "method": "POST",
                "url": "https://api.resend.com/emails",
                "sendBody": True,
                "bodyParameters": {
                    "parameters": [
                        {"name": "from", "value": "BL Motorcycles <orders@bl-motorcycles.co.uk>"},
                        {"name": "to", "value": "={{ $json.record.customer_email }}"},
                        {"name": "subject", "value": "Order Cancellation — BL Motorcycles"},
                        {"name": "html", "value": "<h2>Order Cancelled</h2><p>Your order <strong>#{{ $json.record.order_number }}</strong> has been cancelled. A full refund has been processed and will appear within 3-5 business days.</p><p>If you have any questions, please reply to this email. — BL Motorcycles</p>"}
                    ]
                }
            }
        },
        {
            "id": "chatroom-log",
            "name": "Log to Antigravity Chatroom",
            "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 4,
            "position": [1120, 300],
            "parameters": {
                "method": "POST",
                "url": "https://lkwydqtfbdjhxaarelaz.supabase.co/rest/v1/chatroom",
                "sendHeaders": True,
                "headerParameters": {
                    "parameters": [
                        {"name": "apikey", "value": "={{ $env.ANTIGRAVITY_BRAIN_SERVICE_ROLE_KEY }}"},
                        {"name": "Authorization", "value": "Bearer {{ $env.ANTIGRAVITY_BRAIN_SERVICE_ROLE_KEY }}"}
                    ]
                },
                "sendBody": True,
                "bodyParameters": {
                    "parameters": [
                        {"name": "agent_id", "value": "nathan"},
                        {"name": "message", "value": "📧 Cancellation email sent for order #{{ $json.record.order_number }} ({{ $json.record.failure_reason }})"},
                        {"name": "message_type", "value": "broadcast"},
                        {"name": "ai_source", "value": "n8n-bl-cancellation"}
                    ]
                }
            }
        }
    ],
    "connections": {
        "Supabase Order Change": {
            "main": [[{"node": "Filter: Cancelled Orders", "type": "main", "index": 0}]]
        },
        "Filter: Cancelled Orders": {
            "main": [[{"node": "Classify Cancel Reason", "type": "main", "index": 0}]]
        },
        "Classify Cancel Reason": {
            "main": [
                [{"node": "Email: Local Stock (Brett Dispatches)", "type": "main", "index": 0}],
                [{"node": "Email: SKU Not Found Apology", "type": "main", "index": 0}],
                [{"node": "Email: Generic Cancellation", "type": "main", "index": 0}]
            ]
        },
        "Email: Local Stock (Brett Dispatches)": {
            "main": [[{"node": "Log to Antigravity Chatroom", "type": "main", "index": 0}]]
        },
        "Email: SKU Not Found Apology": {
            "main": [[{"node": "Log to Antigravity Chatroom", "type": "main", "index": 0}]]
        },
        "Email: Generic Cancellation": {
            "main": [[{"node": "Log to Antigravity Chatroom", "type": "main", "index": 0}]]
        }
    },
    "settings": {
        "executionOrder": "v1",
        "saveManualExecutions": True,
        "callerPolicy": "workflowsFromSameOwner"
    }
}


def list_workflows():
    resp = requests.get(f"{N8N_BASE}/rest/workflows", headers=HEADERS)
    if resp.status_code == 200:
        wf = resp.json()
        data = wf.get("data", wf) if isinstance(wf, dict) else wf
        print(f"Existing workflows: {len(data)}")
        for w in data[:10]:
            print(f"  - [{w.get('id')}] {w.get('name')} (active: {w.get('active')})")
        return data
    else:
        print(f"Failed to list workflows: {resp.status_code} {resp.text[:200]}")
        return []


def create_workflow():
    print("Creating BL Motorcycles Cancellation workflow...")
    resp = requests.post(
        f"{N8N_BASE}/rest/workflows",
        headers=HEADERS,
        json=WORKFLOW
    )
    if resp.status_code in [200, 201]:
        data = resp.json()
        wf_id = data.get("id", "unknown")
        print(f"✅ Workflow created! ID: {wf_id}")
        print(f"   URL: {N8N_BASE}/workflow/{wf_id}")
        
        # Print webhook URL
        print(f"\n📌 Webhook URL (configure in Supabase):")
        print(f"   {N8N_BASE}/webhook/bl-order-cancel")
        print(f"\n📌 Supabase Database Webhook settings:")
        print(f"   Table: orders | Event: UPDATE | Filter: status=cancelled")
        print(f"   HTTP Request: POST {N8N_BASE}/webhook/bl-order-cancel")
        return wf_id
    else:
        print(f"❌ Failed: {resp.status_code}")
        print(resp.text[:500])
        return None


if __name__ == "__main__":
    if not N8N_API_KEY:
        print("❌ N8N_API_KEY not found in .env")
        exit(1)
    
    print(f"n8n: {N8N_BASE}")
    print("---")
    existing = list_workflows()
    
    # Check if already exists
    bl_exists = any("BL Motorcycles" in w.get("name", "") or "Cancellation" in w.get("name", "") for w in existing)
    if bl_exists:
        print("\n⚠️  BL Cancellation workflow already exists. Skipping.")
    else:
        create_workflow()
