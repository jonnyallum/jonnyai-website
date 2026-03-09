import os
import requests
import json
from dotenv import load_dotenv
import sys

# Force UTF-8 for Windows console
if sys.stdout.encoding != 'utf-8':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

load_dotenv()

# Configuration — all driven by system user token in .env
PAGE_ID = os.getenv("FACEBOOK_PAGE_ID")
PAGE_ACCESS_TOKEN = os.getenv("FACEBOOK_PAGE_ACCESS_TOKEN")
IG_USER_ID = os.getenv("INSTAGRAM_BUSINESS_ID")
WHATSAPP_PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
WA_BUSINESS_ACCOUNT_ID = os.getenv("WHATSAPP_BUSINESS_ACCOUNT_ID")

def post_to_facebook(message, image_url=None):
    """
    Posts a text message or an image + caption to the Facebook Page feed.
    """
    if not PAGE_ID or not PAGE_ACCESS_TOKEN:
        print("❌ ERROR: Facebook Credentials missing in .env.")
        return False

    if image_url:
        print(f"📡 @nathan: Deploying visual broadcast to Facebook Page {PAGE_ID}...")
        url = f"https://graph.facebook.com/v19.0/{PAGE_ID}/photos"
        payload = {
            "url": image_url,
            "message": message,
            "access_token": PAGE_ACCESS_TOKEN
        }
    else:
        print(f"📡 @nathan: Deploying text broadcast to Facebook Page {PAGE_ID}...")
        url = f"https://graph.facebook.com/v19.0/{PAGE_ID}/feed"
        payload = {
            "message": message,
            "access_token": PAGE_ACCESS_TOKEN
        }
    
    try:
        response = requests.post(url, data=payload)
        res_data = response.json()
        if response.status_code == 200:
            print(f"✅ FACEBOOK LIVE: Post ID {res_data.get('id')}")
            return True
        else:
            print(f"❌ FACEBOOK FAIL: {res_data.get('error', {}).get('message')}")
            return False
    except Exception as e:
        print(f"❌ CONNECTION ERROR: {e}")
        return False

def post_to_instagram(image_url, caption, max_retries=3, retry_delay=8):
    """
    Posts an image + caption to Instagram Business account.
    """
    return _post_ig_media(image_url, caption, "IMAGE", max_retries, retry_delay)

def post_to_instagram_reel(video_url, caption, max_retries=5, retry_delay=15):
    """
    Posts a video as a Reel to Instagram Business account.
    Reels require longer processing time, hence more retries/delay.
    """
    return _post_ig_media(video_url, caption, "REELS", max_retries, retry_delay)

def _post_ig_media(media_url, caption, media_type="IMAGE", max_retries=3, retry_delay=8):
    import time as _time

    if not IG_USER_ID or not PAGE_ACCESS_TOKEN:
        print("❌ ERROR: Instagram/Meta Credentials missing in .env.")
        return False

    print(f"🎬 @nathan: Orchestrating Instagram {media_type}...")

    for attempt in range(1, max_retries + 1):
        try:
            # Step 1: Create Container
            payload = {
                "caption": caption,
                "access_token": PAGE_ACCESS_TOKEN
            }
            if media_type == "REELS":
                payload["video_url"] = media_url
                payload["media_type"] = "REELS"
            else:
                payload["image_url"] = media_url

            container_res = requests.post(
                f"https://graph.facebook.com/v19.0/{IG_USER_ID}/media",
                data=payload
            )
            container_data = container_res.json()
            container_id = container_data.get("id")

            if not container_id:
                err = container_data.get("error", {}).get("message", "Unknown error")
                print(f"  ❌ IG container fail: {err}")
                return False

            # Step 2: Wait for it to be ready (Reels take time)
            if media_type == "REELS":
                print(f"  ⏳ Processing Reel (ID: {container_id})...")
                _time.sleep(20) # Initial wait
                
            # Step 3: Publish Container
            publish_res = requests.post(
                f"https://graph.facebook.com/v19.0/{IG_USER_ID}/media_publish",
                data={"creation_id": container_id, "access_token": PAGE_ACCESS_TOKEN}
            )
            
            if publish_res.status_code == 200:
                print(f"✅ INSTAGRAM {media_type} LIVE: Media ID {publish_res.json().get('id')}")
                return True
            else:
                err_data = publish_res.json()
                err_msg = err_data.get("error", {}).get("message", "Unknown")
                
                # If still processing, retry after delay
                if "Wait for the media to be ready" in err_msg or "is not ready" in err_msg:
                    if attempt < max_retries:
                        print(f"  ⏳ Media not ready (attempt {attempt}/{max_retries}), waiting {retry_delay}s...")
                        _time.sleep(retry_delay)
                        continue
                
                print(f"❌ IG PUBLISH FAIL: {err_msg}")
                return False

        except Exception as e:
            if attempt < max_retries:
                print(f"  ⚠️  IG error (attempt {attempt}/{max_retries}): {e} — retrying in {retry_delay}s")
                _time.sleep(retry_delay)
            else:
                print(f"❌ IG CONNECTION ERROR: {e}")
                return False

    return False

def send_whatsapp_message(to_number: str, message: str) -> bool:
    """
    Send a WhatsApp text message via the Cloud API.
    to_number: E.164 format e.g. '447700900000' (no + prefix)
    """
    if not WHATSAPP_PHONE_NUMBER_ID or not PAGE_ACCESS_TOKEN:
        print("❌ ERROR: WhatsApp credentials missing in .env (WHATSAPP_PHONE_NUMBER_ID, FACEBOOK_PAGE_ACCESS_TOKEN).")
        return False

    print(f"💬 @nathan: Dispatching WhatsApp message to {to_number}...")

    url = f"https://graph.facebook.com/v20.0/{WHATSAPP_PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization": f"Bearer {PAGE_ACCESS_TOKEN}",
        "Content-Type": "application/json",
    }
    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": to_number,
        "type": "text",
        "text": {"preview_url": False, "body": message},
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        res_data = response.json()
        if response.status_code == 200:
            msg_id = res_data.get("messages", [{}])[0].get("id", "")
            print(f"✅ WHATSAPP SENT: Message ID {msg_id}")
            return True
        else:
            print(f"❌ WHATSAPP FAIL: {res_data.get('error', {}).get('message')}")
            return False
    except Exception as e:
        print(f"❌ CONNECTION ERROR: {e}")
        return False


def send_whatsapp_template(to_number: str, template_name: str, language_code: str = "en_US") -> bool:
    """
    Send a WhatsApp approved template message (required for first outreach outside 24hr window).
    """
    if not WHATSAPP_PHONE_NUMBER_ID or not PAGE_ACCESS_TOKEN:
        print("❌ ERROR: WhatsApp credentials missing in .env.")
        return False

    url = f"https://graph.facebook.com/v20.0/{WHATSAPP_PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization": f"Bearer {PAGE_ACCESS_TOKEN}",
        "Content-Type": "application/json",
    }
    payload = {
        "messaging_product": "whatsapp",
        "to": to_number,
        "type": "template",
        "template": {"name": template_name, "language": {"code": language_code}},
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        res_data = response.json()
        if response.status_code == 200:
            print(f"✅ WHATSAPP TEMPLATE SENT: {template_name}")
            return True
        else:
            print(f"❌ WHATSAPP TEMPLATE FAIL: {res_data.get('error', {}).get('message')}")
            return False
    except Exception as e:
        print(f"❌ CONNECTION ERROR: {e}")
        return False


def post_to_facebook_reel(video_path, caption):
    """
    Posts a video as a Reel to Facebook Page using the 3-step upload process.
    video_path: Local path to the .mp4 file.
    """
    if not PAGE_ID or not PAGE_ACCESS_TOKEN:
        print("❌ ERROR: Facebook Credentials missing in .env.")
        return False

    print(f"🎬 @nathan: Initiating Facebook Reel upload for {os.path.basename(video_path)}...")

    try:
        # Step 1: Start
        url = f"https://graph.facebook.com/v19.0/{PAGE_ID}/video_reels"
        payload = {
            "upload_phase": "start",
            "access_token": PAGE_ACCESS_TOKEN
        }
        res = requests.post(url, data=payload).json()
        video_id = res.get("video_id")
        upload_url = res.get("upload_url")

        if not video_id:
            print(f"❌ FB REEL START FAIL: {res.get('error', {}).get('message')}")
            return False

        # Step 2: Upload
        print(f"  📤 Uploading file data to Meta...")
        with open(video_path, "rb") as f:
            headers = {
                "Authorization": f"OAuth {PAGE_ACCESS_TOKEN}",
                "offset": "0",
                "file_size": str(os.path.getsize(video_path))
            }
            # Meta uses a specific binary upload format for this
            up_res = requests.post(upload_url, data=f, headers=headers).json()
            if not up_res.get("success"):
                print(f"❌ FB REEL UPLOAD FAIL: {up_res}")
                return False

        # Step 3: Finish
        print(f"  🏁 Finishing Reel publish...")
        finish_payload = {
            "upload_phase": "finish",
            "video_id": video_id,
            "description": caption,
            "video_state": "PUBLISHED",
            "access_token": PAGE_ACCESS_TOKEN
        }
        f_res = requests.post(url, data=finish_payload).json()
        
        if f_res.get("success"):
            print(f"✅ FACEBOOK REEL LIVE: Video ID {video_id}")
            return True
        else:
            print(f"❌ FB REEL FINISH FAIL: {f_res.get('error', {}).get('message')}")
            return False

    except Exception as e:
        print(f"❌ FB REEL CONNECTION ERROR: {e}")
        return False

if __name__ == "__main__":
    print("🛠️ Testing Meta API Bridge...")
    print(f"  FB Page ID: {PAGE_ID or 'NOT SET — add FACEBOOK_PAGE_ID to .env'}")
    print(f"  IG User ID: {IG_USER_ID or 'NOT SET — add INSTAGRAM_BUSINESS_ID to .env'}")
    print(f"  WA Phone #: {WHATSAPP_PHONE_NUMBER_ID or 'NOT SET — add WHATSAPP_PHONE_NUMBER_ID to .env'}")
    print(f"  Token:      {'✅ SET' if PAGE_ACCESS_TOKEN else '❌ MISSING'}")
    if PAGE_ID and PAGE_ACCESS_TOKEN:
        test_msg = "Jai.OS 5.0 Test Broadcast: The Orchestra is finding its voice. 🎼"
        post_to_facebook(test_msg)
