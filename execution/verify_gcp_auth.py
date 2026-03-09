import os, json
from google.oauth2.credentials import Credentials
from googleapiclient import discovery

TOKEN_PATH = r'c:\Users\jonny\Desktop\JonnyAI_JaiOS_4.0\execution\mcp-google\tokens.json'
CLIENT_ID = r'619376892953-baso4q45trisvjebtjisvh7gr4dgp1le.apps.googleusercontent.com'
CLIENT_SECRET = r'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'

def verify_token():
    try:
        if not os.path.exists(TOKEN_PATH):
            print("Token file not found.")
            return

        with open(TOKEN_PATH) as f:
            tokens = json.load(f)
        
        creds = Credentials(
            token=tokens.get('access_token'),
            refresh_token=tokens.get('refresh_token'),
            token_uri='https://oauth2.googleapis.com/token',
            client_id=CLIENT_ID,
            client_secret=CLIENT_SECRET
        )
        
        service = discovery.build('cloudresourcemanager', 'v1', credentials=creds)
        
        # Test auth by getting project list or details
        print("Fetching projects...")
        projects = service.projects().list().execute()
        print(f"Projects found: {len(projects.get('projects', []))}")
        for p in projects.get('projects', []):
            print(f" - {p['name']} ({p['projectId']})")
        
        # Also try to get organization info
        service_v3 = discovery.build('cloudresourcemanager', 'v3', credentials=creds)
        print("\nFetching organizations...")
        orgs = service_v3.organizations().search().execute()
        for org in orgs.get('organizations', []):
            print(f" - {org['displayName']} (ID: {org['name'].split('/')[-1]})")

    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == '__main__':
    verify_token()
