import os, json, requests

def generate_imports():
    token_path = 'c:/Users/jonny/Desktop/JonnyAI_JaiOS_4.0/execution/gcp_tokens.json'
    if not os.path.exists(token_path):
        return
    with open(token_path) as f:
        token = json.load(f)['access_token']
        
    headers = {'Authorization': f'Bearer {token}'}
    org_id = '504480014851'
    
    url = f"https://cloudresourcemanager.googleapis.com/v2/folders?parent=organizations/{org_id}"
    r = requests.get(url, headers=headers)
    folders = r.json().get('folders', [])
    
    import_cmds = []
    
    for f in folders:
        display_name = f['displayName']
        fid = f['name'].split('/')[-1]
        
        if display_name == 'Common':
            import_cmds.append(f"terraform import 'module.cs-common.google_folder.folders[\"Common\"]' folders/{fid}")
        
        if display_name in ['Department 1', 'Department 2', 'Department 3']:
            import_cmds.append(f"terraform import 'module.cs-folders-level-0[\"{display_name}\"].google_folder.folders[\"{display_name}\"]' folders/{fid}")
            
            url_sub = f"https://cloudresourcemanager.googleapis.com/v2/folders?parent=folders/{fid}"
            r_sub = requests.get(url_sub, headers=headers)
            for sf in r_sub.json().get('folders', []):
                sfid = sf['name'].split('/')[-1]
                s_display_name = sf['displayName']
                path_l1 = f"{display_name}/{s_display_name}"
                import_cmds.append(f"terraform import 'module.cs-folders-level-1[\"{path_l1}\"].google_folder.folders[\"{s_display_name}\"]' folders/{sfid}")
                
                url_sub2 = f"https://cloudresourcemanager.googleapis.com/v2/folders?parent=folders/{sfid}"
                r_sub2 = requests.get(url_sub2, headers=headers)
                for ssf in r_sub2.json().get('folders', []):
                    ssfid = ssf['name'].split('/')[-1]
                    ss_display_name = ssf['displayName']
                    path_l2 = f"{path_l1}/{ss_display_name}"
                    import_cmds.append(f"terraform import 'module.cs-folders-level-2[\"{path_l2}\"].google_folder.folders[\"{ss_display_name}\"]' folders/{ssfid}")

    with open('import_folders.ps1', 'w') as f_out:
        f_out.write('$env:GOOGLE_OAUTH_ACCESS_TOKEN = (Get-Content c:/Users/jonny/Desktop/JonnyAI_JaiOS_4.0/execution/gcp_tokens.json | ConvertFrom-Json).access_token\n')
        # Add a small delay between imports
        f_out.write('\n'.join([c + ' ; Start-Sleep -Milliseconds 100' for c in import_cmds]))
    print("Generated import_folders.ps1")

if __name__ == '__main__':
    generate_imports()
