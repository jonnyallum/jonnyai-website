import os, requests, json

def cleanup():
    env_path = 'c:/Users/jonny/Desktop/JonnyAI_JaiOS_4.0/execution/.tmp_env'
    if not os.path.exists(env_path):
        print("Env file missing")
        return

    url = None
    key = None
    with open(env_path) as f:
        for line in f:
            if line.startswith('ANTIGRAVITY_BRAIN_URL='):
                url = line.split('=')[1].strip().strip('"')
            if line.startswith('SUPABASE_SERVICE_ROLE_KEY='):
                key = line.split('=')[1].strip().strip('"')

    if not url or not key:
        print(f"Credentials missing. URL: {bool(url)}, Key: {bool(key)}")
        return

    print(f"Cleaning up agent 'dashboard_builder' at {url}...")
    headers = {
        "Authorization": f"Bearer {key}",
        "apikey": key,
        "Content-Type": "application/json"
    }
    r = requests.delete(f"{url}/rest/v1/agents?id=eq.dashboard_builder", headers=headers)
    print(f"Status: {r.status_code}")
    print(r.text)

if __name__ == '__main__':
    cleanup()
