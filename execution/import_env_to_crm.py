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
    # Find Antigravity Agency
    res = requests.get(f"{base_url}/companies", headers=headers)
    companies = res.json().get('data', {}).get('companies', [])
    for c in companies:
        if c.get('name') == 'Antigravity Agency':
            return c.get('id')
    
    # Create if not exists
    create_body = {
        "name": "Antigravity Agency"
    }
    res = requests.post(f"{base_url}/companies", headers=headers, json=create_body)
    return res.json().get('data', {}).get('createCompany', {}).get('id')

def parse_env_file():
    env_vars = {}
    with open('c:/Users/jonny/Desktop/JonnyAI_JaiOS_4.0/.env', 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            
            # Match KEY=VALUE, handling potential '=' in value
            match = re.match(r'^([^=]+)=(.*)$', line)
            if match:
                key, val = match.groups()
                key = key.strip()
                val = val.strip()
                
                # Check if it was enclosed in quotes and strip them
                if (val.startswith('"') and val.endswith('"')) or (val.startswith("'") and val.endswith("'")):
                    val = val[1:-1]
                    
                env_vars[key] = val
    return env_vars

def create_note_for_company(company_id, key, value):
    # Truncate value if it's crazy long, or just format as markdown
    body = f"**{key}**\n\n`{value}`\n"
    
    payload = {
        "body": body,
        "companyId": company_id
    }
    
    res = requests.post(f"{base_url}/notes", headers=headers, json=payload)
    if res.status_code == 200:
         print(f"Added note for {key}")
    else:
         print(f"Error adding note for {key}: {res.text}")

def main():
    company_id = get_company_id()
    if not company_id:
        print("Could not find or create company.")
        return
        
    print(f"Targeting company ID: {company_id}")
    env_vars = parse_env_file()
    print(f"Parsed {len(env_vars)} environment variables.")
    
    # Bundle them into logical groups to not create 100 separate notes
    # Let's group them by prefixes or just one giant note
    
    print("Creating one grouped note...")
    all_content = "# Antigravity Agency Environment Credentials\n\n"
    
    for k, v in env_vars.items():
        all_content += f"- **{k}**: `{v}`\n"
        
    payload = {
        "body": all_content,
        "companyId": company_id,
        "title": "Master Environment Credentials",
        "position": "absolute"
    }
    
    # Trying notes structure according to twenty docs standard
    res = requests.post(f"{base_url}/notes", headers=headers, json={
        "body": all_content,
        "companyId": company_id,
    })
    
    print(f"Status: {res.status_code}")
    print(f"Response: {res.text}")
        
if __name__ == '__main__':
    main()
