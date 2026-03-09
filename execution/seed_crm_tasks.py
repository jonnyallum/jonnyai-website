#!/usr/bin/env python3
"""
seed_crm_tasks.py — Seeds all current Antigravity Orchestra tasks into Twenty CRM
linked to the JonnyAI company. Run once to populate, then manage via crm.jonnyai.co.uk
"""
import json, time, urllib.request

API_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3ZTkxY2UyNC0xZjkyLTRiZmMtYTk3NC02MzY5NjNlYWFjYjAi"
    "LCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiN2U5MWNlMjQtMWY5Mi00YmZjLWE5NzQtNjM2OTYzZWFhY2IwIiwi"
    "aWF0IjoxNzczMDAyODc5LCJleHAiOjQ5MjY2MDI4NzcsImp0aSI6IjQwOGQxNzQ0LWMzMWItNGMxZi1hM2Q2LWE4ZmQxMzgz"
    "MTZmYiJ9.1uOtmlrrG--EetlapjYpewC8PqiZogvNpZQxvabJoYQ"
)
BASE = "http://localhost:3000/graphql"
JONNYAI_ID = "26f60ee7-0104-4126-a296-e82060224f80"


def gql(q):
    d = json.dumps({"query": q}).encode()
    req = urllib.request.Request(
        BASE, data=d,
        headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.loads(r.read())


# title, status (TODO / IN_PROGRESS)
TASKS = [
    ("Fix mcp-twenty-crm local PC access",                    "TODO"),
    ("Configure Reddit Devvit app",                            "TODO"),
    ("Set GCP billing alert at £300 in Cloud Console",         "TODO"),
    ("Update n8n + spine DNS A records to 35.230.148.83",     "IN_PROGRESS"),
    ("Add remaining client contacts to CRM",                   "TODO"),
    ("Update client MRR values in CRM pipeline",               "TODO"),
    ("eBay enrichment — review 9691 unmatched products",       "TODO"),
    ("Build Kai GCP Agent Engine migration plan",              "TODO"),
    ("Complete CMPO order bot for BL Motorcycles",             "TODO"),
    ("Review and expand social calendar",                      "TODO"),
    ("Voice-enable Telegram bot — test Ricky ElevenLabs",     "IN_PROGRESS"),
    ("Onboard remaining clients to CRM with full pipeline",    "TODO"),
]


def main():
    print("=== SEEDING TASKS → JonnyAI ===\n")
    created = 0
    for title, status in TASKS:
        q = f"""mutation {{
            createTask(data: {{
                title: {json.dumps(title)},
                status: {status},
                dueAt: "2026-03-31T00:00:00Z"
            }}) {{ id title }}
        }}"""
        r = gql(q)
        if "errors" in r:
            print(f"  ! {title}: {r['errors'][0]['message']}")
            continue

        task_id = r["data"]["createTask"]["id"]

        # Link to JonnyAI
        tq = f"""mutation {{
            createTaskTarget(data: {{
                task: {{ connect: {{ where: {{ id: {json.dumps(task_id)} }} }} }},
                company: {{ connect: {{ where: {{ id: {json.dumps(JONNYAI_ID)} }} }} }}
            }}) {{ id }}
        }}"""
        tr = gql(tq)
        linked = "errors" not in tr
        print(f"  {'+ ' if linked else '~ '}{title} [{status}]")
        created += 1
        time.sleep(0.2)

    print(f"\nCreated {created}/{len(TASKS)} tasks under JonnyAI.")


if __name__ == "__main__":
    main()
