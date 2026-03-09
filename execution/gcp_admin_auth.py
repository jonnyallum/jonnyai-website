import os, sys, json
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import requests

# Using GOOGLE_WORKSPACE_CLIENT_ID from .env
CLIENT_ID = "628827376331-5m2olh0697e3lqe048vln1ndk4spoasf.apps.googleusercontent.com"
CLIENT_SECRET = "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"
REDIRECT_PORT = 3099
REDIRECT_PATH = '/oauth/callback'
REDIRECT_URI = f'http://localhost:{REDIRECT_PORT}{REDIRECT_PATH}'
TOKEN_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'gcp_admin_tokens.json')

SCOPES = ' '.join([
    'https://www.googleapis.com/auth/admin.directory.user.alias',
    'https://www.googleapis.com/auth/admin.directory.user',
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
    
    print(f"\n{'='*60}")
    print(f"ACTION REQUIRED: Please authorize Google Workspace Admin Access")
    print(f"1. Open this URL in your browser:\n")
    print(f"{auth_url}")
    print(f"\n2. After authorizing, the tokens will be saved to {TOKEN_FILE}")
    print(f"{'='*60}")

    server = HTTPServer(('localhost', REDIRECT_PORT), CallbackHandler)
    server.timeout = 300
    
    while auth_code is None:
        try:
            server.handle_request()
        except KeyboardInterrupt:
            break
    
    server.server_close()
    
    if auth_code:
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
            print(f"\nSUCCESS: Tokens saved.")
            return True
        else:
            print(f"\nFAILED: Token exchange error: {r.status_code}")
            print(r.text)
    return False

if __name__ == '__main__':
    authenticate()
