"""
GCP VM Setup - Antigravity Orchestra
Uses device code OAuth flow (no browser redirect needed)
"""
import os, requests, json, time, sys
from dotenv import load_dotenv

load_dotenv(override=True)

CLIENT_ID = os.environ.get('JONNYAI_GCP_OAUTH_CLIENT_ID')
CLIENT_SECRET = os.environ.get('JONNYAI_GCP_OAUTH_CLIENT_SECRET')
PROJECT = 'charged-magnet-489103-g9'
ZONE = 'europe-west2-c'
VM_NAME = 'antigravity-orchestra'
MACHINE_TYPE = 'n2-standard-4'
TOKEN_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'gcp_tokens.json')

SCOPES = ' '.join([
    'https://www.googleapis.com/auth/cloud-platform',
    'https://www.googleapis.com/auth/compute',
])

def load_saved_token():
    print(f"Checking for tokens at: {TOKEN_FILE}")
    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE) as f:
            data = json.load(f)
        print(f"Found tokens with scopes: {data.get('scope', 'NONE')[:50]}...")
        # Try refresh
        r = requests.post('https://oauth2.googleapis.com/token', data={
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
            'refresh_token': data['refresh_token'],
            'grant_type': 'refresh_token'
        })
        if r.status_code == 200:
            token_data = r.json()
            data['access_token'] = token_data['access_token']
            with open(TOKEN_FILE, 'w') as f:
                json.dump(data, f, indent=2)
            print("Token refreshed successfully")
            return data['access_token']
        else:
            print(f"Token refresh failed: {r.status_code} - {r.text}")
    else:
        print("Token file not found")
    return None

def device_code_auth():
    """OAuth device code flow - works without browser redirect"""
    print("\n=== GCP Authentication Required ===")
    r = requests.post('https://oauth2.googleapis.com/device/code', data={
        'client_id': CLIENT_ID,
        'scope': SCOPES
    })
    if r.status_code != 200:
        print(f"Error starting auth: {r.text}")
        return None
    
    data = r.json()
    print(f"\n  1. Go to: {data['verification_url']}")
    print(f"  2. Enter code: {data['user_code']}")
    print(f"\n  Waiting for you to authorize...")
    
    interval = data.get('interval', 5)
    while True:
        time.sleep(interval)
        r = requests.post('https://oauth2.googleapis.com/token', data={
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
            'device_code': data['device_code'],
            'grant_type': 'urn:ietf:params:oauth:grant-type:device_code'
        })
        resp = r.json()
        if 'access_token' in resp:
            with open(TOKEN_FILE, 'w') as f:
                json.dump(resp, f, indent=2)
            print("  Authenticated!")
            return resp['access_token']
        elif resp.get('error') == 'authorization_pending':
            continue
        elif resp.get('error') == 'slow_down':
            interval += 2
        else:
            print(f"  Auth error: {resp}")
            return None

def get_token():
    token = load_saved_token()
    if token:
        return token
    return device_code_auth()

def api(method, url, token, body=None):
    h = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
    if method == 'GET':
        return requests.get(url, headers=h)
    elif method == 'POST':
        return requests.post(url, headers=h, json=body)
    elif method == 'PATCH':
        return requests.patch(url, headers=h, json=body)

def fix_org_policies(token):
    """Allow external IPs on VMs"""
    print("Fixing org policies...")
    # Enable OrgPolicy API
    api('POST', f'https://serviceusage.googleapis.com/v1/projects/{PROJECT}/services/orgpolicy.googleapis.com:enable', token)
    time.sleep(3)
    
    # Allow external IPs
    url = f'https://orgpolicy.googleapis.com/v2/projects/{PROJECT}/policies'
    body = {
        'name': f'projects/{PROJECT}/policies/compute.vmExternalIpAccess',
        'spec': {'rules': [{'allowAll': True}]}
    }
    r = api('POST', url, token, body)
    if r.status_code == 200:
        print("  External IP policy: ALLOWED")
    elif r.status_code == 409:
        # Already exists, update it
        r = api('PATCH', f'{url}/compute.vmExternalIpAccess', token, body)
    # Allow disabling OS Login
    body_os = {
        'name': f'projects/{PROJECT}/policies/compute.requireOsLogin',
        'spec': {'rules': [{'enforce': False}]}
    }
    r = api('POST', url, token, body_os)
    if r.status_code == 200:
        print("  OS Login requirement: DISABLED")
    elif r.status_code == 409:
        r = api('PATCH', f'{url}/compute.requireOsLogin', token, body_os)
        print(f"  OS Login requirement update: {r.status_code}")
    else:
        print(f"  OS Login policy response: {r.status_code} - {r.text[:200]}")

def enable_default_network(token):
    """Check if default network exists, create if needed"""
    url = f'https://compute.googleapis.com/compute/v1/projects/{PROJECT}/global/networks/default'
    r = api('GET', url, token)
    if r.status_code == 200:
        print("  Default network: EXISTS")
        return True
    
    print("  Default network missing, creating...")
    url = f'https://compute.googleapis.com/compute/v1/projects/{PROJECT}/global/networks'
    body = {
        'name': 'default',
        'autoCreateSubnetworks': True
    }
    r = api('POST', url, token, body)
    print(f"  Network create: {r.status_code}")
    if r.status_code == 200:
        time.sleep(10)  # Wait for propagation
    return r.status_code == 200

def create_firewall_rules(token):
    """Ensure SSH, HTTP, HTTPS firewall rules exist"""
    rules = [
        {'name': 'default-allow-ssh', 'ports': ['22'], 'tags': []},
        {'name': 'default-allow-http', 'ports': ['80'], 'tags': ['http-server']},
        {'name': 'default-allow-https', 'ports': ['443'], 'tags': ['https-server']},
    ]
    for rule in rules:
        url = f'https://compute.googleapis.com/compute/v1/projects/{PROJECT}/global/firewalls/{rule["name"]}'
        r = api('GET', url, token)
        if r.status_code == 200:
            continue
        body = {
            'name': rule['name'],
            'network': f'projects/{PROJECT}/global/networks/default',
            'allowed': [{'IPProtocol': 'tcp', 'ports': rule['ports']}],
            'sourceRanges': ['0.0.0.0/0'],
            'direction': 'INGRESS'
        }
        if rule['tags']:
            body['targetTags'] = rule['tags']
        r = api('POST', f'https://compute.googleapis.com/compute/v1/projects/{PROJECT}/global/firewalls', token, body)
        print(f"  Firewall {rule['name']}: {r.status_code}")

def create_vm(token):
    url = f'https://compute.googleapis.com/compute/v1/projects/{PROJECT}/zones/{ZONE}/instances'
    body = {
        'name': VM_NAME,
        'machineType': f'zones/{ZONE}/machineTypes/{MACHINE_TYPE}',
        'disks': [{
            'boot': True,
            'autoDelete': True,
            'initializeParams': {
                'diskSizeGb': '100',
                'sourceImage': 'projects/ubuntu-os-cloud/global/images/family/ubuntu-2404-lts-amd64',
                'diskType': f'zones/{ZONE}/diskTypes/pd-ssd'
            }
        }],
        'networkInterfaces': [{
            'network': f'projects/{PROJECT}/global/networks/default',
            'accessConfigs': [{'name': 'External NAT', 'type': 'ONE_TO_ONE_NAT'}]
        }],
        'tags': {'items': ['http-server', 'https-server']},
        'metadata': {
            'items': [
                {
                    'key': 'startup-script',
                    'value': '#!/bin/bash\n'
                        'apt-get update && apt-get upgrade -y\n'
                        'apt-get install -y docker.io docker-compose-v2 nginx python3 python3-pip git ufw fail2ban curl\n'
                        'systemctl enable docker && systemctl start docker\n'
                        'ufw allow 22/tcp && ufw allow 80/tcp && ufw allow 443/tcp && ufw --force enable\n'
                        'curl -fsSL https://tailscale.com/install.sh | sh\n'
                        'echo "Antigravity Orchestra VM Ready $(date)" > /var/log/orchestra-init.log\n'
                },
                {
                    'key': 'ssh-keys',
                    'value': 'antigravity-ai:ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEVXRXnSNT7eS+bsM81yHz5GxdcHyF7rxjFqcd3QPuqB antigravity-ai'
                },
                {
                    'key': 'enable-oslogin',
                    'value': 'FALSE'
                }
            ]
        },
        'serviceAccounts': [{'email': 'default', 'scopes': ['https://www.googleapis.com/auth/cloud-platform']}],
        'labels': {'purpose': 'antigravity-orchestra', 'environment': 'production'}
    }
    r = api('POST', url, token, body)
    data = r.json()
    if r.status_code == 200:
        print(f"  VM creation started! Operation: {data.get('name', 'unknown')}")
        return True
    else:
        err = data.get('error', {}).get('message', str(data))
        print(f"  Error ({r.status_code}): {err}")
        return False

def get_vm_status(token):
    url = f'https://compute.googleapis.com/compute/v1/projects/{PROJECT}/zones/{ZONE}/instances/{VM_NAME}'
    r = api('GET', url, token)
    if r.status_code == 200:
        data = r.json()
        status = data.get('status', 'UNKNOWN')
        ip = None
        for ni in data.get('networkInterfaces', []):
            for ac in ni.get('accessConfigs', []):
                ip = ac.get('natIP')
        return status, ip, data.get('metadata', {}).get('fingerprint')
    return None, None, None

def set_metadata(token, fingerprint):
    """Push SSH keys and OS Login settings to the VM"""
    url = f'https://compute.googleapis.com/compute/v1/projects/{PROJECT}/zones/{ZONE}/instances/{VM_NAME}/setMetadata'
    body = {
        'fingerprint': fingerprint,
        'items': [
            {
                'key': 'ssh-keys',
                'value': 'antigravity-ai:ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEVXRXnSNT7eS+bsM81yHz5GxdcHyF7rxjFqcd3QPuqB antigravity-ai'
            }
        ]
    }
    r = api('POST', url, token, body)
    if r.status_code == 200:
        print("  Metadata updated successfully (SSH keys set)")
    else:
        print(f"  Error updating metadata ({r.status_code}): {r.text[:200]}")

def wait_for_vm(token, timeout=180):
    start = time.time()
    while time.time() - start < timeout:
        status, ip, fingerprint = get_vm_status(token)
        if status == 'RUNNING' and ip:
            return ip
        print(f"  Status: {status or 'PROVISIONING'}...")
        time.sleep(10)
    return None

if __name__ == '__main__':
    action = sys.argv[1] if len(sys.argv) > 1 else 'status'
    
    print(f"=== Antigravity Orchestra GCP VM ===")
    print(f"  Project: {PROJECT}")
    print(f"  Zone: {ZONE}")
    print(f"  Machine: {MACHINE_TYPE}")
    print()
    
    token = get_token()
    if not token:
        print("FAILED: Could not authenticate")
        sys.exit(1)
    
    if action == 'create':
        fix_org_policies(token)
        enable_default_network(token)
        create_firewall_rules(token)
        print(f"\nCreating VM: {VM_NAME}...")
        if create_vm(token):
            ip = wait_for_vm(token)
            if ip:
                print(f"\n{'='*50}")
                print(f"  VM LIVE!")
                print(f"  External IP: {ip}")
                print(f"  SSH: ssh {ip}")
                print(f"{'='*50}")
    
    elif action == 'metadata':
        fix_org_policies(token)
        status, ip, fingerprint = get_vm_status(token)
        if fingerprint:
            set_metadata(token, fingerprint)
        else:
            print("  VM not found, cannot set metadata")

    elif action == 'debug':
        status, ip, fingerprint = get_vm_status(token)
        print(f"Status: {status}, IP: {ip}, Fingerprint: {fingerprint}")
        # Get full info
        url = f'https://compute.googleapis.com/compute/v1/projects/{PROJECT}/zones/{ZONE}/instances/{VM_NAME}'
        r = api('GET', url, token)
        print(json.dumps(r.json(), indent=2))

    elif action == 'status':
        status, ip, fingerprint = get_vm_status(token)
        if status:
            print(f"  Status: {status}")
            if ip:
                print(f"  External IP: {ip}")
                print(f"  SSH: ssh {ip}")
        else:
            print("  VM not found")
    
    elif action == 'auth':
        print("Token acquired successfully")
