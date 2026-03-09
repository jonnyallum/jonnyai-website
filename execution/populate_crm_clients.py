import requests
import json

api_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3ZTkxY2UyNC0xZjkyLTRiZmMtYTk3NC02MzY5NjNlYWFjYjAiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiN2U5MWNlMjQtMWY5Mi00YmZjLWE5NzQtNjM2OTYzZWFhY2IwIiwiaWF0IjoxNzczMDAyODc5LCJleHAiOjQ5MjY2MDI4NzcsImp0aSI6IjQwOGQxNzQ0LWMzMWItNGMxZi1hM2Q2LWE4ZmQxMzgzMTZmYiJ9.1uOtmlrrG--EetlapjYpewC8PqiZogvNpZQxvabJoYQ"
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}
base_url = "https://crm.jonnyai.co.uk/rest"

# Data to keep
KEEP_COMPANIES = ["BL Motorcycles", "Antigravity Agency"]
KEEP_PEOPLE = ["Brett", "Jonny"]

CLIENTS = [
    {"company": "LA Aesthetics", "person": {"first": "Libby", "last": "Archer"}},
    {"company": "Sparta Interiors", "person": {"first": "Luke", "last": "Tiltman"}},
    {"company": "Sparta Coatings", "person": None, "note": "Lives under Sparta Interiors, separate project"},
    {"company": "DJ Waste", "person": {"first": "Daryl", "last": "Jennings"}},
    {"company": "CD Waste", "person": {"first": "Dave", "last": "Powell"}},
    {"company": "Marzer-Pro", "person": {"first": "Jason", "last": "Budd"}},
    {"company": "Village Bakery", "person": {"first": "Aaron", "last": "Price"}},
    {"company": "Poundtrades", "person": {"first": "Roger", "last": "Holman"}},
    {"company": "JSC Contractors", "person": {"first": "James", "last": "Shield"}},
    {"company": "Construct-Fm", "person": {"first": "Trevor", "last": "Horrel"}},
]

def get_all(endpoint):
    res = requests.get(f"{base_url}/{endpoint}", headers=headers)
    if res.status_code == 200:
        return res.json().get('data', {}).get(endpoint, [])
    return []

def delete_record(endpoint, record_id):
    res = requests.delete(f"{base_url}/{endpoint}/{record_id}", headers=headers)
    return res.status_code

def create_company(name):
    res = requests.post(f"{base_url}/companies", headers=headers, json={"name": name})
    if res.status_code == 200:
        return res.json().get('data', {}).get('createCompany', {})
    return None

def create_person(first, last, company_id=None):
    payload = {"name": {"firstName": first, "lastName": last}}
    if company_id:
        payload["companyId"] = company_id
    res = requests.post(f"{base_url}/people", headers=headers, json=payload)
    if res.status_code == 200:
        return res.json().get('data', {}).get('createPerson', {})
    return None

def create_note(company_id, text):
    blocknote_content = [{"type": "paragraph", "children": [{"text": text}]}]
    payload = {
        "title": "Project Relationship Context",
        "bodyV2": {"blocknote": json.dumps(blocknote_content)}
    }
    res = requests.post(f"{base_url}/notes", headers=headers, json=payload)
    if res.status_code == 200:
        note_id = res.json().get('data', {}).get('createNote', {}).get('id')
        requests.post(f"{base_url}/noteTargets", headers=headers, json={"noteId": note_id, "companyId": company_id})

def main():
    print("Fetching existing data...")
    companies = get_all('companies')
    people = get_all('people')
    
    deleted_c = 0
    deleted_p = 0
    
    # Check people
    for p in people:
        name = p.get('name', {})
        full_name = f"{name.get('firstName', '')} {name.get('lastName', '')}".strip()
        if not any(keep.lower() in full_name.lower() for keep in KEEP_PEOPLE):
            delete_record('people', p['id'])
            deleted_p += 1
            
    # Check companies
    for c in companies:
        name = c.get('name', '')
        if not any(keep.lower() in name.lower() for keep in KEEP_COMPANIES):
            delete_record('companies', c['id'])
            deleted_c += 1
            
    print(f"Cleanup complete. Deleted {deleted_p} people, {deleted_c} companies.")
    
    # Store parent companies
    company_map = {}
    
    for client in CLIENTS:
        c_name = client['company']
        print(f"Creating Company: {c_name}")
        c_res = create_company(c_name)
        if c_res:
            c_id = c_res['id']
            company_map[c_name] = c_id
            
            p_data = client['person']
            if p_data:
                print(f"  -> Creating Person: {p_data['first']} {p_data['last']}")
                create_person(p_data['first'], p_data['last'], c_id)
            
            if 'note' in client:
                print(f"  -> Adding Note Context")
                create_note(c_id, client['note'])
                if c_name == 'Sparta Coatings' and 'Sparta Interiors' in company_map:
                    create_note(company_map['Sparta Interiors'], "Related Sub-Project: Sparta Coatings")

if __name__ == '__main__':
    main()
