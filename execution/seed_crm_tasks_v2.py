#!/usr/bin/env python3
"""
seed_crm_tasks_v2.py — Extended CRM task seeding from full workspace audit.
Adds ~35 agent-executable tasks across JonnyAI + BL Motorcycles companies.
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


def get_company_id(name):
    r = gql('{ companies(first: 30) { edges { node { id name } } } }')
    for e in r["data"]["companies"]["edges"]:
        if e["node"]["name"] == name:
            return e["node"]["id"]
    return None


def create_task(title, status, company_id, due="2026-06-30T00:00:00Z"):
    q = f"""mutation {{
        createTask(data: {{
            title: {json.dumps(title)},
            status: {status},
            dueAt: "{due}"
        }}) {{ id title }}
    }}"""
    r = gql(q)
    if "errors" in r:
        print(f"  ! {title[:60]}: {r['errors'][0]['message']}")
        return None
    task_id = r["data"]["createTask"]["id"]

    # Link to company
    tq = f"""mutation {{
        createTaskTarget(data: {{
            task: {{ connect: {{ where: {{ id: {json.dumps(task_id)} }} }} }},
            company: {{ connect: {{ where: {{ id: {json.dumps(company_id)} }} }} }}
        }}) {{ id }}
    }}"""
    tr = gql(tq)
    linked = "errors" not in tr
    symbol = "+ " if linked else "~ "
    print(f"  {symbol}{title[:70]} [{status}]")
    time.sleep(0.15)
    return task_id


def main():
    print("=== SEEDING EXPANDED TASK LIST ===\n")

    jonnyai_id = JONNYAI_ID
    bl_id = get_company_id("BL Motorcycles Ltd")

    print(f"JonnyAI ID: {jonnyai_id}")
    print(f"BL Motorcycles ID: {bl_id}\n")

    # ── INFRASTRUCTURE & DEVOPS ──────────────────────────────────────
    print("[ INFRASTRUCTURE & DEVOPS ]")
    infra_tasks = [
        ("Regenerate n8n API key — current key returns 401",                              "TODO"),
        ("Update n8n + spine DNS A records to 35.230.148.83 in Hostinger",               "IN_PROGRESS"),
        ("Verify SSL cert renewal — n8n.jonnyai.co.uk + spine.jonnyai.co.uk failing",    "TODO"),
        ("Set GCP billing alert at £300 in Cloud Console",                                "TODO"),
        ("Enable GCP budget alert email to jonnyallum@gmail.com",                         "TODO"),
        ("Document VM static IP change (34.105 → 35.230) in ops runbook",               "TODO"),
        ("Audit all crontabs — confirm all 6 daily scripts fire correctly on new VM",     "TODO"),
        ("Set up VM log rotation for Python script stdout logs",                           "TODO"),
    ]
    for title, status in infra_tasks:
        create_task(title, status, jonnyai_id)

    # ── JONNYAI.WEBSITE ──────────────────────────────────────────────
    print("\n[ JONNYAI.WEBSITE ]")
    website_tasks = [
        ("Fix jonnyai.website build — JSON BOM corruption in agent_activity.json",        "TODO"),
        ("Fix Google OAuth broken on jonnyai.website dashboard",                           "TODO"),
        ("Audit + fix all broken API routes on jonnyai.website",                          "TODO"),
        ("Deploy jonnyai.website to Vercel after build fix",                               "TODO"),
        ("Add CRM pipeline widget to jonnyai.website dashboard",                          "TODO"),
    ]
    for title, status in website_tasks:
        create_task(title, status, jonnyai_id)

    # ── AGENT ORCHESTRA ──────────────────────────────────────────────
    print("\n[ AGENT ORCHESTRA ]")
    agent_tasks = [
        ("Populate 59 missing SKILL.md files — priority: @Nathan @Alex @Mason @Quinn",   "TODO"),
        ("Run sync_all_skills_full.py after SKILL.md batch is complete",                  "TODO"),
        ("Run validate_agents.py — bring all 70 agents to passing status",               "TODO"),
        ("Expand social calendar — generate posts through 2026-06-30",                   "TODO"),
        ("Audit execution/ folder — archive/delete stale and duplicate scripts",          "TODO"),
        ("Build @Kai GCP Agent Engine migration plan (Vertex AI ADK)",                   "TODO"),
        ("Configure Reddit Devvit app — API credentials + app scaffold",                  "TODO"),
        ("Wire up @Dreamer daily script to post top idea to Telegram via Marcus bot",    "TODO"),
        ("Enable Marcus bot /report command — on-demand daily report via Telegram",      "TODO"),
        ("Build @Finops cashflow monitor — flag if monthly GCP spend > £200",            "TODO"),
        ("Build @Pipeline-guardian silent failure detection for all cron scripts",        "TODO"),
        ("Extend morning report — add eBay order count + unmatched products summary",    "TODO"),
    ]
    for title, status in agent_tasks:
        create_task(title, status, jonnyai_id)

    # ── SUPABASE / BRAIN ─────────────────────────────────────────────
    print("\n[ SUPABASE / BRAIN ]")
    brain_tasks = [
        ("Add `owner_agent` column to projects table — assign lead agent per client",    "TODO"),
        ("Add `health_score` column to projects table — 0-100 client health metric",     "TODO"),
        ("Backfill projects table with all 9 client domains + MRR from CRM sync",        "TODO"),
        ("Build Supabase RLS policies for chatroom — only authenticated agents write",   "TODO"),
        ("Audit learnings table — tag and deduplicate 65+ entries",                      "TODO"),
    ]
    for title, status in brain_tasks:
        create_task(title, status, jonnyai_id)

    # ── SALES & GROWTH ───────────────────────────────────────────────
    print("\n[ SALES & GROWTH ]")
    sales_tasks = [
        ("Add remaining 7 client contacts to CRM (Marzer, Sparta, JSC, etc.)",           "TODO"),
        ("Update all client MRR values in CRM pipeline opportunities",                   "TODO"),
        ("Build @Boyce outbound pipeline — 10 warm leads per week target",               "TODO"),
        ("Create JonnyAI services page + pricing on jonnyai.website",                    "TODO"),
        ("Build client onboarding email sequence via n8n + Resend",                      "TODO"),
    ]
    for title, status in sales_tasks:
        create_task(title, status, jonnyai_id)

    # ── BL MOTORCYCLES ───────────────────────────────────────────────
    if bl_id:
        print("\n[ BL MOTORCYCLES LTD ]")
        bl_tasks = [
            ("Complete CMPO order automation bot — eBay → CRM order flow",                "TODO"),
            ("Resolve 9691 unmatched eBay products — bulk fitment enrichment pass",       "TODO"),
            ("Build n8n workflow: new eBay order → Telegram alert to Brett",              "TODO"),
            ("Automate weekly eBay inventory health report to Brett via email",           "TODO"),
            ("Build price-drop alert: flag BL parts with < 10% margin",                  "TODO"),
        ]
        for title, status in bl_tasks:
            create_task(title, status, bl_id)
    else:
        print("\n  ! BL Motorcycles Ltd not found — skipping BL tasks")

    print("\n=== DONE ===")


if __name__ == "__main__":
    main()
