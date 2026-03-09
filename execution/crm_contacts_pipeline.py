#!/usr/bin/env python3
"""
crm_contacts_pipeline.py
Adds key contacts and pipeline opportunities to Twenty CRM for all Antigravity clients.
"""
import json, time, urllib.request

API_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3ZTkxY2UyNC0xZjkyLTRiZmMtYTk3NC02MzY5NjNlYWFjYjAi"
    "LCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiN2U5MWNlMjQtMWY5Mi00YmZjLWE5NzQtNjM2OTYzZWFhY2IwIiwi"
    "aWF0IjoxNzczMDAyODc5LCJleHAiOjQ5MjY2MDI4NzcsImp0aSI6IjQwOGQxNzQ0LWMzMWItNGMxZi1hM2Q2LWE4ZmQxMzgz"
    "MTZmYiJ9.1uOtmlrrG--EetlapjYpewC8PqiZogvNpZQxvabJoYQ"
)
BASE = "http://localhost:3000/graphql"


def gql(q):
    d = json.dumps({"query": q}).encode()
    req = urllib.request.Request(
        BASE, data=d,
        headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.loads(r.read())


def get_companies():
    r = gql("{ companies(first: 20) { edges { node { id name } } } }")
    return {e["node"]["name"]: e["node"]["id"] for e in r["data"]["companies"]["edges"]}


def create_person(first, last, email, title, company_id):
    email_part = f'emails: {{ primaryEmail: {json.dumps(email)} }},' if email else ""
    q = f"""mutation {{
        createPerson(data: {{
            name: {{ firstName: {json.dumps(first)}, lastName: {json.dumps(last)} }},
            {email_part}
            jobTitle: {json.dumps(title)},
            company: {{ connect: {{ where: {{ id: {json.dumps(company_id)} }} }} }}
        }}) {{ id }}
    }}"""
    r = gql(q)
    if "errors" in r:
        print(f"  ! {first} {last}: {r['errors'][0]['message']}")
        return None
    return r["data"]["createPerson"]["id"]


def create_opportunity(name, stage, amount, company_id):
    q = f"""mutation {{
        createOpportunity(data: {{
            name: {json.dumps(name)},
            stage: {stage},
            amount: {{ amountMicros: {int(amount * 1_000_000)}, currencyCode: "GBP" }},
            company: {{ connect: {{ where: {{ id: {json.dumps(company_id)} }} }} }},
            closeDate: "2026-12-31"
        }}) {{ id name }}
    }}"""
    r = gql(q)
    if "errors" in r:
        print(f"  ! {name}: {r['errors'][0]['message']}")
        return None
    return r["data"]["createOpportunity"]["id"]


def main():
    print("=== CRM: CONTACTS + PIPELINE ===\n")
    companies = get_companies()
    print(f"Loaded {len(companies)} companies\n")

    # ── Key contacts ─────────────────────────────────────────────────
    CONTACTS = [
        # first, last, email, title, company
        ("Brett", "Lewis",   "blmotorcyclesltd@gmail.com", "Owner",   "BL Motorcycles Ltd"),
        ("Jonny", "Allum",   "jonnyallum@gmail.com",        "Founder", "JonnyAI"),
    ]

    print("[CONTACTS]")
    for first, last, email, title, company in CONTACTS:
        cid = companies.get(company)
        if not cid:
            print(f"  ! Company not found: {company}")
            continue
        pid = create_person(first, last, email, title, cid)
        if pid:
            print(f"  + {first} {last} @ {company}")
        time.sleep(0.2)

    # ── Pipeline opportunities ────────────────────────────────────────
    # (name, stage, monthly_gbp, company)
    OPPS = [
        ("AI Automation Retainer",     "CUSTOMER", 500, "BL Motorcycles Ltd"),
        ("Website & Lead Gen",          "CUSTOMER", 200, "Marzer Pro Roofing"),
        ("Website & Lead Gen",          "CUSTOMER", 200, "Sparta Coatings"),
        ("Website",                     "CUSTOMER", 150, "JSC Contractors"),
        ("Estimate Generator Tool",     "CUSTOMER", 150, "Construct FM"),
        ("Website & Booking System",    "CUSTOMER", 150, "La Aesthetician"),
        ("Website",                     "CUSTOMER", 100, "DJ Waste"),
        ("Website",                     "CUSTOMER", 100, "Village Bakery"),
    ]

    print("\n[PIPELINE]")
    total = 0
    for name, stage, amount, company in OPPS:
        cid = companies.get(company)
        if not cid:
            print(f"  ! Company not found: {company}")
            continue
        full_name = f"{company} — {name}"
        oid = create_opportunity(full_name, stage, amount, cid)
        if oid:
            print(f"  + {full_name}  £{amount}/mo")
            total += amount
        time.sleep(0.2)

    print(f"\n  Total MRR in CRM: £{total}/mo")
    print("\nDone. Add remaining contacts manually in the UI.")


if __name__ == "__main__":
    main()
