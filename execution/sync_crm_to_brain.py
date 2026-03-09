#!/usr/bin/env python3
"""
sync_crm_to_brain.py
Pulls CRM pipeline + client data from Twenty CRM and syncs to Antigravity Shared Brain.
- Upserts each client company as a project in the `projects` table
- Posts a pipeline summary to `learnings` so agents stay informed
Cron: 0 6 * * * (runs before daily reports)
"""
import os, sys, json, urllib.request
from datetime import datetime, timezone
from pathlib import Path
from dotenv import load_dotenv

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

_repo = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=_repo / ".env")

BRAIN_URL = os.getenv("ANTIGRAVITY_BRAIN_URL", "https://lkwydqtfbdjhxaarelaz.supabase.co")
BRAIN_KEY = os.getenv("ANTIGRAVITY_BRAIN_SERVICE_ROLE_KEY", "")
CRM_KEY   = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3ZTkxY2UyNC0xZjkyLTRiZmMtYTk3NC02MzY5NjNlYWFjYjAi"
    "LCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiN2U5MWNlMjQtMWY5Mi00YmZjLWE5NzQtNjM2OTYzZWFhY2IwIiwi"
    "aWF0IjoxNzczMDAyODc5LCJleHAiOjQ5MjY2MDI4NzcsImp0aSI6IjQwOGQxNzQ0LWMzMWItNGMxZi1hM2Q2LWE4ZmQxMzgz"
    "MTZmYiJ9.1uOtmlrrG--EetlapjYpewC8PqiZogvNpZQxvabJoYQ"
)
CRM_URL   = "http://localhost:3000/graphql"
NOW       = datetime.now(timezone.utc)


def crm_query(q):
    d = json.dumps({"query": q}).encode()
    req = urllib.request.Request(CRM_URL, data=d, headers={
        "Authorization": f"Bearer {CRM_KEY}",
        "Content-Type": "application/json"
    })
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.loads(r.read()).get("data", {})


def brain_post(table, payload):
    if not BRAIN_URL or not BRAIN_KEY:
        return
    d = json.dumps(payload).encode()
    req = urllib.request.Request(
        f"{BRAIN_URL}/rest/v1/{table}",
        data=d,
        headers={
            "apikey": BRAIN_KEY,
            "Authorization": f"Bearer {BRAIN_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
        }, method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return r.status
    except Exception as e:
        print(f"  Brain POST error: {e}")


def brain_upsert(table, payload, on_conflict):
    if not BRAIN_URL or not BRAIN_KEY:
        return
    d = json.dumps(payload).encode()
    req = urllib.request.Request(
        f"{BRAIN_URL}/rest/v1/{table}?on_conflict={on_conflict}",
        data=d,
        headers={
            "apikey": BRAIN_KEY,
            "Authorization": f"Bearer {BRAIN_KEY}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates,return=minimal"
        }, method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return r.status
    except Exception as e:
        print(f"  Brain UPSERT error: {e}")


def get_crm_data():
    data = crm_query("""
    {
        companies(first: 30) {
            edges { node {
                id name employees
                domainName { primaryLinkUrl }
                opportunities {
                    edges { node {
                        id name stage
                        amount { amountMicros currencyCode }
                    }}
                }
                people { edges { node { id name { firstName lastName } jobTitle } } }
            }}
        }
    }
    """)
    return data.get("companies", {}).get("edges", [])


def main():
    print(f"\n=== CRM → SHARED BRAIN SYNC | {NOW.strftime('%Y-%m-%d %H:%M')} UTC ===\n")

    companies = get_crm_data()
    print(f"[CRM] Found {len(companies)} companies")

    total_mrr = 0
    pipeline_lines = []
    synced = 0

    for edge in companies:
        c = edge["node"]
        name = c["name"]
        domain = (c.get("domainName") or {}).get("primaryLinkUrl", "")

        opps = c.get("opportunities", {}).get("edges", [])
        mrr = 0
        stages = []
        for o in opps:
            node = o["node"]
            amt_micros = (node.get("amount") or {}).get("amountMicros", 0) or 0
            mrr += amt_micros / 1_000_000
            stages.append(node.get("stage", "UNKNOWN"))

        total_mrr += mrr
        stage_str = stages[0] if stages else "NO_OPPORTUNITY"
        status = "active" if stage_str == "CUSTOMER" else "in-progress"

        pipeline_lines.append(f"{name}: £{mrr:.0f}/mo [{stage_str}]")

        # Upsert to projects table
        slug = name.lower().replace(" ", "-").replace(".", "").replace("'", "")
        live_url = domain if domain.startswith("http") else f"https://{domain}"
        brain_upsert("projects", {
            "id": slug,
            "name": name,
            "client": name,
            "client_name": name,
            "status": status,
            "live_url": live_url,
            "updated_at": NOW.isoformat()
        }, "id")

        synced += 1
        print(f"  ✓ {name} — £{mrr:.0f}/mo [{stage_str}]")

    # Post pipeline summary learning to Shared Brain
    summary = (
        f"CRM Pipeline Snapshot ({NOW.strftime('%Y-%m-%d')}): "
        f"{len(companies)} active clients | Total MRR: £{total_mrr:.0f}/mo\n"
        + "\n".join(f"  - {l}" for l in pipeline_lines)
    )
    brain_post("learnings", {
        "source_agent": "dashboard",
        "source_ai": "dashboard",
        "category": "crm_sync",
        "learning": summary,
        "tags": ["crm", "pipeline", "mrr"],
        "created_at": NOW.isoformat()
    })

    print(f"\n[BRAIN] Synced {synced} projects + posted pipeline learning")
    print(f"[SUMMARY] Total MRR: £{total_mrr:.0f}/mo across {len(companies)} clients")


if __name__ == "__main__":
    main()
