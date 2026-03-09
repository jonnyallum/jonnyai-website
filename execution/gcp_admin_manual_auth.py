import os, sys, json
import requests

# Using GOOGLE_WORKSPACE_CLIENT_ID from .env
CLIENT_ID = "628827376331-5m2olh0697e3lqe048vln1ndk4spoasf.apps.googleusercontent.com"
CLIENT_SECRET = "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"
REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob'
TOKEN_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'gcp_admin_tokens.json')

SCOPES = ' '.join([
    'https://www.googleapis.com/auth/admin.directory.user.alias',
    'https://www.googleapis.com/auth/admin.directory.user',
])

def manual_auth():
    auth_url = (
        'https://accounts.google.com/o/oauth2/v2/auth?'
        f'client_id={CLIENT_ID}&'
        f'redirect_uri={REDIRECT_URI}&'
        'response_type=code&'
        f'scope={SCOPES}&'
        'access_type=offline&'
        'prompt=consent'
    )
    
    print(f"\n{'='*60}")
    print(f"MANUAL AUTH REQUIRED: Google Workspace Admin")
    print(f"1. Open this URL in your browser:\n")
    print(f"{auth_url}")
    print(f"\n2. Copy the authorization code and paste it here.")
    print(f"{'='*60}")

    code = input("\nEnter Authorization Code: ").strip()
    
    if code:
        r = requests.post('https://oauth2.googleapis.com/token', data={
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
            'code': code,
            'redirect_uri': REDIRECT_URI,
            'grant_type': 'authorization_code'
        })
        
        if r.status_code == 200:
            tokens = r.json()
            with open(TOKEN_FILE, 'w') as f:
                json.dump(tokens, f, indent=2)
            print(f"\nSUCCESS: Tokens saved.")
            return True
        else:
            print(f"\nFAILED: Token exchange error: {r.status_code}")
            print(r.text)
    return False

if __name__ == '__main__':
    manual_auth()
