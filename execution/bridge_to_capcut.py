import requests
import json
import os
import shutil
from pathlib import Path

# Config
BASE_URL = "http://localhost:9001"
DRAFT_FOLDER = Path("c:/Users/jonny/Desktop/JonnyAI_JaiOS_4.0/execution/CapCutDrafts")
DRAFT_FOLDER.mkdir(exist_ok=True)

def make_request(endpoint, data):
    url = f"{BASE_URL}/{endpoint}"
    r = requests.post(url, json=data, timeout=60)
    r.raise_for_status()
    return r.json()

def create_carlos_draft():
    print("🚀 Initializing CapCut Draft via VectCutAPI...")
    
    # 1. Create Draft
    draft_res = make_request("create_draft", {"width": 1080, "height": 1920})
    draft_id = draft_res['output']['draft_id']
    print(f"✅ Draft Created: {draft_id}")

    # 2. Add Visual (Marcus Prime)
    # Note: VectCutAPI usually expects URLs, but it might handle local paths if the server is local.
    # From README: "take full control of your AI-generated assets, including images..."
    # Looking at create_draft.py, it handles both.
    
    marcus_img = "c:/Users/jonny/Desktop/JonnyAI_JaiOS_4.0/library/visuals/agents/marcus_prime_v1.png"
    
    # Convert to URL-like or just path? The server downloader.py handles local files too.
    add_res = make_request("add_image", {
        "draft_id": draft_id,
        "image_url": marcus_img,
        "start": 0,
        "end": 5,
        "scale_x": 1.1,
        "scale_y": 1.1,
        "track_name": "Main Visual"
    })
    print("✅ Marcus added to timeline.")

    # 3. Add Text
    text_res = make_request("add_text", {
        "draft_id": draft_id,
        "text": "ANTIGRAVITY ORCHESTRA",
        "start": 1,
        "end": 4,
        "font_size": 40,
        "font_color": "#FFD700", # Gold
        "track_name": "Title"
    })
    print("✅ Dynamic text added.")

    # 4. Save Draft
    save_res = make_request("save_draft", {"draft_id": draft_id})
    print(f"✅ Draft Saved Successfully.")
    
    # The draft is usually in a folder in the VectCutAPI directory
    draft_src = Path(f"c:/Users/jonny/Desktop/JonnyAI_JaiOS_4.0/execution/VectCutAPI/{draft_id}")
    if draft_src.exists():
        # Move it to a more visible place for the user
        dest = DRAFT_FOLDER / draft_id
        if dest.exists(): shutil.rmtree(dest)
        shutil.copytree(draft_src, dest)
        print(f"📁 PROJECT FOLDER READY: {dest}")
        print("\n💡 To edit this, copy this folder to your CapCut 'User Data/Projects/com.lveditor.draft' directory.")
    else:
        print(f"⚠️ Draft folder not found at {draft_src}. Check VectCutAPI logs.")

if __name__ == "__main__":
    try:
        create_carlos_draft()
    except Exception as e:
        print(f"❌ Error: {e}")
