import os, sys, json, time, threading, webbrowser
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import requests
from dotenv import load_dotenv

# Use the info@jonnyai.co.uk credentials
CLIENT_ID = "619376892953-baso4q45trisvjebtjisvh7gr4dgp1le.apps.googleusercontent.com"
CLIENT_SECRET = "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"
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
        pass

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
    server.timeout = 180
    
    print(f"\n{'='*60}", flush=True)
    print(f"ACTION REQUIRED: Please authorize Google Cloud Access", flush=True)
    print(f"1. Open this URL in your browser:\n", flush=True)
    print(f"{auth_url}", flush=True)
    print(f"\n2. After authorizing, this script will save tokens automatically.", flush=True)
    print(f"{'='*60}", flush=True)

    
    # Wait for callback
    while auth_code is None:
        try:
            server.handle_request()
        except KeyboardInterrupt:
            break
    
    server.server_close()
    
    if auth_code:
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
            print(f"\nSUCCESS: Tokens saved to {TOKEN_FILE}")
            return True
        else:
            print(f"\nFAILED: Token exchange error: {r.status_code}")
            print(r.text)
    return False

if __name__ == '__main__':
    authenticate()
