"""
GCP OAuth - Quick auth for JonnyAI Google Cloud
Opens browser, catches callback, saves tokens
"""
import os, sys, json, time, threading, webbrowser
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import requests
from dotenv import load_dotenv

load_dotenv(override=True)

CLIENT_ID = os.environ.get('JONNYAI_GCP_OAUTH_CLIENT_ID')
CLIENT_SECRET = os.environ.get('JONNYAI_GCP_OAUTH_CLIENT_SECRET')
REDIRECT_PORT = 3009
REDIRECT_PATH = '/callback'
REDIRECT_URI = f'http://localhost:{REDIRECT_PORT}{REDIRECT_PATH}'
TOKEN_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'gcp_tokens.json')

SCOPES = ' '.join([
    'https://www.googleapis.com/auth/cloud-platform',
    'https://www.googleapis.com/auth/compute',
])

auth_code = None

class CallbackHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        global auth_code
        parsed = urlparse(self.path)
        if parsed.path == REDIRECT_PATH:
            params = parse_qs(parsed.query)
            if 'code' in params:
                auth_code = params['code'][0]
                self.send_response(200)
                self.send_header('Content-type', 'text/html')
                self.end_headers()
                self.wfile.write(b'<h1>Authenticated! You can close this tab.</h1>')
            else:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b'No code received')
        else:
            self.send_response(404)
            self.end_headers()
    
    def log_message(self, format, *args):
        pass  # Suppress logs

def authenticate():
    global auth_code
    
    auth_url = (
        'https://accounts.google.com/o/oauth2/v2/auth?'
        f'client_id={CLIENT_ID}&'
        f'redirect_uri={REDIRECT_URI}&'
        'response_type=code&'
        f'scope={SCOPES}&'
        'access_type=offline&'
        'prompt=consent'
    )
    
    server = HTTPServer(('localhost', REDIRECT_PORT), CallbackHandler)
    server.timeout = 120
    
    print(f"\nOpening browser for Google Cloud auth...")
    print(f"If browser doesn't open, go to:\n{auth_url}\n")
    webbrowser.open(auth_url)
    
    # Wait for callback
    while auth_code is None:
        server.handle_request()
    
    server.server_close()
    
    # Exchange code for tokens
    r = requests.post('https://oauth2.googleapis.com/token', data={
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'code': auth_code,
        'redirect_uri': REDIRECT_URI,
        'grant_type': 'authorization_code'
    })
    
    if r.status_code == 200:
        tokens = r.json()
        with open(TOKEN_FILE, 'w') as f:
            json.dump(tokens, f, indent=2)
        print(f"Tokens saved to {TOKEN_FILE}")
        print(f"Access token: {tokens['access_token'][:20]}...")
        if 'refresh_token' in tokens:
            print(f"Refresh token: YES")
        return True
    else:
        print(f"Token exchange failed: {r.status_code}")
        print(r.text)
        return False

if __name__ == '__main__':
    print("=== JonnyAI GCP OAuth ===")
    print(f"Client ID: {CLIENT_ID[:30]}...")
    print(f"Redirect: {REDIRECT_URI}")
    authenticate()
