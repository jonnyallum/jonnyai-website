#!/usr/bin/env python3
"""
crm_clean_and_seed.py
Wipes all Gmail-noise companies, people, and fake opportunities from Twenty CRM.
Then seeds real Antigravity clients as proper companies with pipeline stages.
Run from repo root or execution/ folder.
"""
import json, sys, time
import urllib.request, urllib.error
from pathlib import Path
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

API_KEY = os.getenv("TWENTY_CRM_API_KEY", "")
BASE_URL = "http://localhost:3000/graphql"

if not API_KEY:
    # fallback to hardcoded key (from .mcp.json)
    API_KEY = (
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
        ".eyJzdWIiOiI3ZTkxY2UyNC0xZjkyLTRiZmMtYTk3NC02MzY5NjNlYWFjYjAi"
        "LCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiN2U5MWNlMjQtMWY5Mi"
        "00YmZjLWE5NzQtNjM2OTYzZWFhY2IwIiwiaWF0IjoxNzczMDAyODc5LCJleHAi"
        "OjQ5MjY2MDI4NzcsImp0aSI6IjQwOGQxNzQ0LWMzMWItNGMxZi1hM2Q2LWE4Zm"
        "QxMzgzMTZmYiJ9.1uOtmlrrG--EetlapjYpewC8PqiZogvNpZQxvabJoYQ"
    )


def gql(query, variables=None):
    payload = {"query": query}
    if variables:
        payload["variables"] = variables
    data = json.dumps(payload).encode()
    req = urllib.request.Request(
        BASE_URL,
        data=data,
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            result = json.loads(r.read())
            if "errors" in result:
                print(f"  GQL error: {result['errors']}")
                return None
            return result.get("data")
    except Exception as e:
        print(f"  Request error: {e}")
        return None


def get_all_ids(entity, page_size=60):
    """Fetch all IDs for an entity type."""
    ids = []
    cursor = None
    while True:
        after_clause = f', after: "{cursor}"' if cursor else ""
        q = f"""{{ {entity}(first: {page_size}{after_clause}) {{
            edges {{ node {{ id }} }}
            pageInfo {{ hasNextPage endCursor }}
        }} }}"""
        data = gql(q)
        if not data:
            break
        block = data.get(entity, {})
        edges = block.get("edges", [])
        ids.extend(e["node"]["id"] for e in edges)
        page_info = block.get("pageInfo", {})
        if not page_info.get("hasNextPage"):
            break
        cursor = page_info.get("endCursor")
        time.sleep(0.1)
    return ids


def delete_all(entity, mutation_name, id_arg="ids"):
    """Fetch all IDs and delete in batches."""
    print(f"\n[DELETE] Fetching all {entity}...")
    ids = get_all_ids(entity)
    print(f"  Found {len(ids)} records to delete")
    if not ids:
        return

    # Delete in batches of 20
    batch_size = 20
    deleted = 0
    for i in range(0, len(ids), batch_size):
        batch = ids[i : i + batch_size]
        ids_str = json.dumps(batch)
        mutation = f"""mutation {{
            {mutation_name}({id_arg}: {ids_str}) {{
                deletedIds
            }}
        }}"""
        result = gql(mutation)
        if result:
            count = len(result.get(mutation_name, {}).get("deletedIds", []))
            deleted += count
        time.sleep(0.15)
        sys.stdout.write(f"\r  Deleted {deleted}/{len(ids)}...")
        sys.stdout.flush()

    print(f"\n  Done — {deleted} {entity} deleted")


# ─── Real clients to seed ────────────────────────────────────────────────────

CLIENTS = [
    {
        "name": "BL Motorcycles Ltd",
        "domainName": "blmotorcyclesltd.co.uk",
        "industry": "RETAIL",
        "employees": 5,
        "annualRecurringRevenue": {"amountMicros": 0, "currencyCode": "GBP"},
        "stage": "ACTIVE_CUSTOMER",
        "notes": "eBay seller. Full AI automation — order processing, stock sync, daily reports. Contact: Brett.",
    },
    {
        "name": "Marzer Pro Roofing",
        "domainName": "marzerpro.co.uk",
        "industry": "CONSTRUCTION",
        "employees": 10,
        "annualRecurringRevenue": {"amountMicros": 0, "currencyCode": "GBP"},
        "stage": "ACTIVE_CUSTOMER",
        "notes": "Roofing contractor. Website + lead gen. Contact: Marcus.",
    },
    {
        "name": "Sparta Coatings",
        "domainName": "spartacoatings.co.uk",
        "industry": "CONSTRUCTION",
        "employees": 5,
        "annualRecurringRevenue": {"amountMicros": 0, "currencyCode": "GBP"},
        "stage": "ACTIVE_CUSTOMER",
        "notes": "Industrial coatings. Website + lead gen.",
    },
    {
        "name": "JSC Contractors",
        "domainName": "jsccontractors.co.uk",
        "industry": "CONSTRUCTION",
        "employees": 10,
        "annualRecurringRevenue": {"amountMicros": 0, "currencyCode": "GBP"},
        "stage": "ACTIVE_CUSTOMER",
        "notes": "General contractors. Website project.",
    },
    {
        "name": "Construct FM",
        "domainName": "construct-fm.co.uk",
        "industry": "CONSTRUCTION",
        "employees": 5,
        "annualRecurringRevenue": {"amountMicros": 0, "currencyCode": "GBP"},
        "stage": "ACTIVE_CUSTOMER",
        "notes": "Facilities management. Estimate generator tool.",
    },
    {
        "name": "La Aesthetician",
        "domainName": "laaesthetician.co.uk",
        "industry": "HEALTH",
        "employees": 3,
        "annualRecurringRevenue": {"amountMicros": 0, "currencyCode": "GBP"},
        "stage": "ACTIVE_CUSTOMER",
        "notes": "Beauty clinic. Website + booking.",
    },
    {
        "name": "DJ Waste",
        "domainName": "djwaste.co.uk",
        "industry": "OTHER",
        "employees": 5,
        "annualRecurringRevenue": {"amountMicros": 0, "currencyCode": "GBP"},
        "stage": "ACTIVE_CUSTOMER",
        "notes": "Waste management. Website project.",
    },
    {
        "name": "JonnyAI",
        "domainName": "jonnyai.co.uk",
        "industry": "TECHNOLOGY",
        "employees": 1,
        "annualRecurringRevenue": {"amountMicros": 0, "currencyCode": "GBP"},
        "stage": "ACTIVE_CUSTOMER",
        "notes": "The agency itself. Jonny Allum — Antigravity Orchestra platform.",
    },
]


def create_company(client):
    """Create a single company via Twenty CRM GraphQL."""
    name = client["name"]
    domain = client.get("domainName", "")
    industry = client.get("industry", "OTHER")
    employees = client.get("employees", 0)
    notes = client.get("notes", "")

    mutation = f"""mutation {{
        createCompany(data: {{
            name: {json.dumps(name)},
            domainName: {{ primaryLinkUrl: {json.dumps("https://" + domain)}, primaryLinkLabel: {json.dumps(domain)} }},
            employees: {employees},
            idealCustomerProfile: true,
            position: 0
        }}) {{
            id
            name
        }}
    }}"""
    result = gql(mutation)
    if result and "createCompany" in result:
        company_id = result["createCompany"]["id"]
        print(f"  + Created: {name} ({company_id})")
        return company_id
    else:
        print(f"  ! Failed to create: {name}")
        return None


def main():
    print("=== CRM CLEAN + SEED ===\n")

    # Step 1: Delete all opportunities first (FK dependencies)
    delete_all("opportunities", "deleteOpportunities")

    # Step 2: Delete all people
    delete_all("people", "deletePeople")

    # Step 3: Delete all companies
    delete_all("companies", "deleteCompanies")

    # Step 4: Seed real clients
    print(f"\n[SEED] Creating {len(CLIENTS)} real clients...")
    created = 0
    for client in CLIENTS:
        cid = create_company(client)
        if cid:
            created += 1
        time.sleep(0.2)

    print(f"\n{'='*40}")
    print(f"CRM cleaned and seeded.")
    print(f"Companies created: {created}/{len(CLIENTS)}")
    print("Next: Add contacts, opportunities, and pipeline stages manually in the UI.")
    print("URL: https://crm.jonnyai.co.uk")


if __name__ == "__main__":
    main()
