import os, json, requests

def fix():
    token_path = 'c:/Users/jonny/Desktop/JonnyAI_JaiOS_4.0/execution/gcp_tokens.json'
    if not os.path.exists(token_path):
        print("Token missing")
        return
    
    with open(token_path) as f:
        token = json.load(f)['access_token']
        
    headers = {'Authorization': f'Bearer {token}'}
    org_id = '504480014851'
    user = 'user:info@jonnyai.co.uk'
    
    # 1. Grant roles at Org Level
    print("Updating Org IAM...")
    url = f"https://cloudresourcemanager.googleapis.com/v1/organizations/{org_id}:getIamPolicy"
    r = requests.post(url, headers=headers)
    policy = r.json()
    
    target_roles = [
        'roles/resourcemanager.organizationAdmin',
        'roles/resourcemanager.projectCreator',
        'roles/billing.admin',
        'roles/resourcemanager.folderAdmin',
        'roles/cloudkms.admin',
        'roles/owner'
    ]
    
    changed = False
    for role in target_roles:
        found = False
        for binding in policy.get('bindings', []):
            if binding['role'] == role:
                if user not in binding['members']:
                    binding['members'].append(user)
                    changed = True
                found = True
                break
        if not found:
            policy.setdefault('bindings', []).append({'role': role, 'members': [user]})
            changed = True
            
    if changed:
        url = f"https://cloudresourcemanager.googleapis.com/v1/organizations/{org_id}:setIamPolicy"
        r = requests.post(url, headers=headers, json={'policy': policy})
        print(f"Org Policy Update: {r.status_code}")
    else:
        print("Org Policy already up to date")

    # 2. Find all kms-proj projects and grant owner
    print("Fetching projects...")
    r = requests.get('https://cloudresourcemanager.googleapis.com/v1/projects', headers=headers)
    projects = r.json().get('projects', [])
    for p in projects:
        pid = p['projectId']
        if pid.startswith('kms-proj-'):
            print(f"Fixing IAM for {pid}...")
            url = f"https://cloudresourcemanager.googleapis.com/v1/projects/{pid}:getIamPolicy"
            r = requests.post(url, headers=headers)
            p_policy = r.json()
            
            p_changed = False
            for role in ['roles/owner', 'roles/cloudkms.admin']:
                found = False
                for binding in p_policy.get('bindings', []):
                    if binding['role'] == role:
                        if user not in binding['members']:
                            binding['members'].append(user)
                            p_changed = True
                        found = True
                        break
                if not found:
                    p_policy.setdefault('bindings', []).append({'role': role, 'members': [user]})
                    p_changed = True
            
            if p_changed:
                url = f"https://cloudresourcemanager.googleapis.com/v1/projects/{pid}:setIamPolicy"
                r = requests.post(url, headers=headers, json={'policy': p_policy})
                print(f"Project {pid} update: {r.status_code}")

if __name__ == '__main__':
    fix()
