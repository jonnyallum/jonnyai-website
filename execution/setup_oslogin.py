import os, json, requests
from dotenv import load_dotenv

load_dotenv()

TOKEN_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'gcp_tokens.json')
EMAIL = 'info@jonnyai.co.uk'
PUB_KEY = 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEVXRXnSNT7eS+bsM81yHz5GxdcHyF7rxjFqcd3QPuqB antigravity-ai'

def setup():
    if not os.path.exists(TOKEN_PATH):
        print("Token file missing")
        return

    with open(TOKEN_PATH) as f:
        data = json.load(f)
    token = data['access_token']

    headers = {'Authorization': f'Bearer {token}'}

    # 1. Get Login Profile
    print(f"Fetching OS Login profile for {EMAIL}...")
    r = requests.get(f'https://oslogin.googleapis.com/v1/users/{EMAIL}/loginProfile', headers=headers)
    profile = r.json()
    print(json.dumps(profile, indent=2))

    # 2. Add SSH Key
    print(f"Adding SSH key to OS Login...")
    r = requests.post(f'https://oslogin.googleapis.com/v1/users/{EMAIL}/sshPublicKeys', headers=headers, json={'key': PUB_KEY})
    print(f"Response ({r.status_code}): {r.text}")

    if r.status_code == 200:
        login_name = profile.get('posixAccounts', [{}])[0].get('username', 'UNKNOWN')
        print(f"\nSUCCESS! You should be able to login as: {login_name}")
        print(f"Command: ssh -i execution/vps_key {login_name}@34.105.146.38")

if __name__ == '__main__':
    setup()
