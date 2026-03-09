"""
deploy_n8n_social_workflows.py — Push all 3 FB automations to n8n VPS
======================================================================
Creates and activates:
  1. Social Auto-Scheduler (10am, 2pm, 6pm UK daily)
  2. FB Lead Ad → CRM Pipeline (webhook-triggered)
  3. Weekly Performance Report (Monday 9am UK)
"""

import requests, sys, json, os
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

N8N_BASE = "https://35.230.148.83"
EMAIL = "info@jonnyai.co.uk"
PASSWORD = "Aprilia100!69."
verify_ssl = False

WORKFLOWS = [
    (".tmp/n8n_workflow_social_scheduler.json", "Antigravity Social Auto-Scheduler"),
    (".tmp/n8n_workflow_fb_lead_pipeline.json", "FB Lead Ad → CRM Pipeline"),
    (".tmp/n8n_workflow_performance_tracker.json", "Weekly Social Performance Report"),
]


def main():
    session = requests.Session()
    session.headers.update({"Host": "n8n.jonnyai.co.uk"})
    
    # Login
    print("🔐 Logging into n8n...")
    r = session.post(f"{N8N_BASE}/rest/login",
        json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD},
        headers={"Content-Type": "application/json"},
        verify=verify_ssl)
    
    if r.status_code != 200:
        print(f"❌ Login failed: {r.status_code}")
        sys.exit(1)
    print("✅ Logged in.\n")

    results = []
    for filepath, expected_name in WORKFLOWS:
        full_path = Path(__file__).parent.parent / filepath
        if not full_path.exists():
            print(f"⚠️ Missing: {filepath}")
            continue
        
        with open(full_path) as f:
            workflow_data = json.load(f)
        
        name = workflow_data.get("name", expected_name)
        print(f"📤 Creating workflow: {name}...")
        
        # Create new workflow
        r = session.post(
            f"{N8N_BASE}/rest/workflows",
            json=workflow_data,
            headers={"Content-Type": "application/json"},
            verify=verify_ssl
        )
        
        if r.status_code in (200, 201):
            wf_id = r.json().get("data", {}).get("id") or r.json().get("id", "?")
            print(f"   ✅ Created: ID={wf_id}")
            
            # Activate
            r2 = session.post(
                f"{N8N_BASE}/rest/workflows/{wf_id}/activate",
                verify=verify_ssl
            )
            status = "ACTIVE" if r2.status_code == 200 else f"INACTIVE ({r2.status_code})"
            print(f"   🔌 Status: {status}")
            results.append({"name": name, "id": wf_id, "status": status})
        else:
            print(f"   ❌ Failed: {r.status_code} - {r.text[:200]}")
            results.append({"name": name, "status": f"FAILED:{r.status_code}"})
    
    print(f"\n{'='*60}")
    print(f"📊 DEPLOYMENT SUMMARY")
    print(f"{'='*60}")
    for r in results:
        emoji = "✅" if "ACTIVE" in r.get("status", "") else "❌"
        print(f"  {emoji} {r['name']} → {r.get('id', 'N/A')} [{r['status']}]")
    
    return results


if __name__ == "__main__":
    main()
