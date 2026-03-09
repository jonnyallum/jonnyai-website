import os, json, time, requests
from google.oauth2.credentials import Credentials
from googleapiclient import discovery
from dotenv import load_dotenv

load_dotenv()

TOKEN_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'gcp_tokens.json')
PROJECT_ID = 'charged-magnet-489103-g9'
CLIENT_ID = os.environ.get('JONNYAI_GCP_OAUTH_CLIENT_ID')
CLIENT_SECRET = os.environ.get('JONNYAI_GCP_OAUTH_CLIENT_SECRET')

def enable_apis():
    try:
        if not os.path.exists(TOKEN_PATH):
            print(f"Token file missing at {TOKEN_PATH}")
            return

        with open(TOKEN_PATH) as f:
            data = json.load(f)
        
        credentials = Credentials(
            token=data['access_token'],
            refresh_token=data['refresh_token'],
            client_id=CLIENT_ID,
            client_secret=CLIENT_SECRET,
            token_uri='https://oauth2.googleapis.com/token'
        )

        service = discovery.build('serviceusage', 'v1', credentials=credentials)
        
        apis = [
            'compute.googleapis.com',
            'cloudresourcemanager.googleapis.com',
            'iam.googleapis.com',
            'orgpolicy.googleapis.com',
            'cloudkms.googleapis.com',
            'storage.googleapis.com',
            'cloudidentity.googleapis.com'
        ]
        
        for api in apis:
            print(f"Enabling {api} in {PROJECT_ID}...")
            # Check if already enabled
            try:
                request = service.services().get(name=f'projects/{PROJECT_ID}/services/{api}')
                res = request.execute()
                if res.get('state') == 'ENABLED':
                    print(f"  Already enabled.")
                    continue
            except:
                pass

            request = service.services().enable(name=f'projects/{PROJECT_ID}/services/{api}')
            response = request.execute()
            print(f"  Response: {response.get('name')}")

    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == '__main__':
    enable_apis()
