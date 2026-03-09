import requests
import json
import re

api_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3ZTkxY2UyNC0xZjkyLTRiZmMtYTk3NC02MzY5NjNlYWFjYjAiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiN2U5MWNlMjQtMWY5Mi00YmZjLWE5NzQtNjM2OTYzZWFhY2IwIiwiaWF0IjoxNzczMDAyODc5LCJleHAiOjQ5MjY2MDI4NzcsImp0aSI6IjQwOGQxNzQ0LWMzMWItNGMxZi1hM2Q2LWE4ZmQxMzgzMTZmYiJ9.1uOtmlrrG--EetlapjYpewC8PqiZogvNpZQxvabJoYQ"
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}
base_url = "https://crm.jonnyai.co.uk/rest"

def get_company_id():
    res = requests.get(f"{base_url}/companies", headers=headers)
    companies = res.json().get('data', {}).get('companies', [])
    for c in companies:
        if c.get('name') == 'Antigravity Agency':
            return c.get('id')
    return None

def parse_env_file():
    env_vars = {}
    with open('c:/Users/jonny/Desktop/JonnyAI_JaiOS_4.0/.env', 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            match = re.match(r'^([^=]+)=(.*)$', line)
            if match:
                key, val = match.groups()
                key = key.strip()
                val = val.strip()
                if (val.startswith('"') and val.endswith('"')) or (val.startswith("'") and val.endswith("'")):
                    val = val[1:-1]
                env_vars[key] = val
    return env_vars

def main():
    company_id = get_company_id()
    if not company_id:
        print("Company not found.")
        return
        
    env_vars = parse_env_file()
    
    # We will just write a standard object!
    # Let's create a custom field on Company perhaps, or just dump it as markdown in the blocknote.
    all_content = "# Antigravity Agency Environment Credentials\n\n"
    for k, v in env_vars.items():
        all_content += f"**{k}**: {v}\n\n"
        
    blocknote_content = [
        {
            "type": "paragraph",
            "children": [
                {
                    "text": all_content
                }
            ]
        }
    ]
    
    payload = {
        "title": "Master Environment Credentials",
        "bodyV2": {
            "blocknote": json.dumps(blocknote_content)
        }
    }
    
    res = requests.post(f"{base_url}/notes", headers=headers, json=payload)
    
    if res.status_code == 200:
        note_id = res.json().get('data', {}).get('createNote', {}).get('id')
        print(f"Note Created: {note_id}")
        
        # Now attach it to the company
        target_res = requests.post(f"{base_url}/noteTargets", headers=headers, json={
            "noteId": note_id,
            "companyId": company_id
        })
        print(f"Target Link: {target_res.status_code}")
        
    else:
        print(f"Error: {res.text}")

if __name__ == '__main__':
    main()
