"""Total cleanup. Nuke ALL chaos/69 posts from FB and IG."""
import requests, os, sys, time
from dotenv import load_dotenv
load_dotenv()

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

FB_TOKEN = os.getenv("FACEBOOK_PAGE_ACCESS_TOKEN")
FB_PAGE = os.getenv("FACEBOOK_PAGE_ID")
IG_USER_ID = os.getenv("INSTAGRAM_BUSINESS_ID")

SPAM_PATTERNS = ["chaos", "beautiful chaos", "69 ai", "69 agents", "69 specialist"]

def cleanup_fb():
    print("\n--- FB CLEANUP ---")
    url = f"https://graph.facebook.com/v19.0/{FB_PAGE}/posts"
    params = {"access_token": FB_TOKEN, "fields": "id,message", "limit": "100"}
    
    deleted = 0
    total_checked = 0
    
    while url:
        r = requests.get(url, params=params)
        data = r.json()
        posts = data.get("data", [])
        if not posts: break
        
        for p in posts:
            total_checked += 1
            msg = (p.get("message") or "").lower()
            if any(pat in msg for pat in SPAM_PATTERNS):
                dr = requests.delete(f"https://graph.facebook.com/v19.0/{p['id']}", params={"access_token": FB_TOKEN})
                if dr.status_code == 200:
                    deleted += 1
                    print(f"  DELETED FB: {p['id']} - {msg[:40]}")
                else:
                    print(f"  FAIL FB: {p['id']} - {dr.status_code}")
        
        url = data.get("paging", {}).get("next")
        params = {}
        if deleted > 500: break # Safety braker
        
    print(f"FB Done. Deleted {deleted}. Checked {total_checked}.")

def cleanup_ig():
    print("\n--- IG CLEANUP ---")
    if not IG_USER_ID: return
    url = f"https://graph.facebook.com/v19.0/{IG_USER_ID}/media"
    params = {"access_token": FB_TOKEN, "fields": "id,caption", "limit": "100"}
    
    deleted = 0
    total_checked = 0
    
    while url:
        r = requests.get(url, params=params)
        data = r.json()
        items = data.get("data", [])
        if not items: break
        
        for m in items:
            total_checked += 1
            cap = (m.get("caption") or "").lower()
            if any(pat in cap for pat in SPAM_PATTERNS):
                # Try delete
                dr = requests.delete(f"https://graph.facebook.com/v19.0/{m['id']}", params={"access_token": FB_TOKEN})
                if dr.status_code == 200:
                    deleted += 1
                    print(f"  DELETED IG: {m['id']} - {cap[:40]}")
                else:
                    # IG deletion often restricted. If fail, skip
                    print(f"  FAIL IG: {m['id']} - {dr.status_code}")
        
        url = data.get("paging", {}).get("next")
        params = {}
        if deleted > 200: break
        
    print(f"IG Done. Deleted {deleted}. Checked {total_checked}.")

if __name__ == "__main__":
    cleanup_fb()
    cleanup_ig()
    print("\n Cleanup Finished.")
