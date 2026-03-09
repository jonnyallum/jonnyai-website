"""Instagram aggressive cleanup. Delete ALL chaos/69 posts."""
import requests, os, sys
from dotenv import load_dotenv
load_dotenv()

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

FB_TOKEN = os.getenv("FACEBOOK_PAGE_ACCESS_TOKEN")
IG_USER_ID = os.getenv("INSTAGRAM_BUSINESS_ID")

if not FB_TOKEN or not IG_USER_ID:
    print("❌ ERROR: Instagram Credentials missing in .env.")
    sys.exit(1)

print("=== INSTAGRAM AGGRESSIVE CLEANUP PASS ===")
print(f"Targeting IG User ID: {IG_USER_ID}")
print("Fetching ALL media (paginated)...\n")

all_media = []
url = f"https://graph.facebook.com/v19.0/{IG_USER_ID}/media"
params = {"access_token": FB_TOKEN, "fields": "id,caption,media_type,timestamp", "limit": "100"}

# Page through ALL media
while url:
    r = requests.get(url, params=params)
    data = r.json()
    if 'error' in data:
        print(f"❌ API ERROR: {data['error'].get('message')}")
        break
    items = data.get("data", [])
    all_media.extend(items)
    
    # Next page
    paging = data.get("paging", {})
    url = paging.get("next")
    params = {}  # URL already contains params
    
    if not items:
        break

print(f"Total media items fetched: {len(all_media)}")

# Find ALL spam items
spam_patterns = ["chaos", "beautiful chaos", "69 ai", "69 agents", "69 specialist"]
to_delete = []

for m in all_media:
    caption = (m.get("caption") or "").lower()
    if any(pat in caption for pat in spam_patterns):
        to_delete.append(m)
        print(f"  SPAM: {m['id']} | {m.get('timestamp','')[:19]} | {caption[:60]}...")

print(f"\nTotal spam media items found: {len(to_delete)}")

if len(to_delete) == 0:
    print("Zero spam items found. Clean!")
else:
    # Keep the FIRST one (most recent), delete the rest
    print(f"\nKeeping 1, deleting {len(to_delete)-1}...")
    for m in to_delete[1:]:
        mid = m['id']
        try:
            # Instagram Graph API doesn't support DELETE via Graph API for media in the same way as FB posts
            # Actually, DELETE /{ig-media-id} IS supported if it was created by the API.
            r = requests.delete(
                f"https://graph.facebook.com/v19.0/{mid}",
                params={"access_token": FB_TOKEN}
            )
            if r.status_code == 200:
                print(f"  DELETED: {mid}")
            else:
                print(f"  FAIL: {mid} — {r.status_code} {r.text[:100]}")
        except Exception as e:
            print(f"  ERROR: {e}")

print("\nDONE.")
