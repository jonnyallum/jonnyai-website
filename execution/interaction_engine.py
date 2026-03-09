"""
@Hannah // @Nathan - Antigravity Customer Interaction Engine (Phase 5)

Listens for new comments on Facebook/Instagram posts via webhook,
uses Claude to generate an engaging, on-brand reply, and posts it back natively.
"""

import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

PAGE_ID = os.getenv("FACEBOOK_PAGE_ID")
PAGE_ACCESS_TOKEN = os.getenv("FACEBOOK_PAGE_ACCESS_TOKEN")

def get_anthropic_client():
    import anthropic
    return anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def reply_to_comment(comment_id: str, message: str) -> bool:
    """Replies to a specific FB/IG comment using the Graph API."""
    if not PAGE_ACCESS_TOKEN:
        print("❌ Cannot reply. No Facebook Token.")
        return False
        
    url = f"https://graph.facebook.com/v19.0/{comment_id}/comments"
    payload = {
        "message": message,
        "access_token": PAGE_ACCESS_TOKEN
    }
    
    try:
        response = requests.post(url, data=payload)
        res_data = response.json()
        if response.status_code == 200:
            print(f"✅ REPLY POSTED to comment {comment_id}")
            return True
        else:
            print(f"❌ REPLY FAIL: {res_data.get('error', {}).get('message')}")
            return False
    except Exception as e:
        print(f"❌ CONNECTION ERROR: {e}")
        return False

def generate_reply(comment_text: str, username: str) -> str:
    """Uses Claude Haiku to generate an engaging reply to a comment."""
    client = get_anthropic_client()
    
    system_prompt = """You are @Hannah, Antigravity's customer success AI.
You are replying to a social media comment on our post.
Tone: Professional but highly conversational. Very sharp, confident.
Always refer to the 'Antigravity Orchestra' or 'Jai.OS' if discussing our tech.
Limit reply to 1-2 short sentences. No emojis unless absolutely necessary."""

    user_msg = f"User '{username}' commented: '{comment_text}'. Write a reply."
    
    try:
        resp = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=150,
            system=system_prompt,
            messages=[{"role": "user", "content": user_msg}]
        )
        return resp.content[0].text.strip().strip('"').strip("'")
    except Exception as e:
        print(f"⚠️ Claude reply generation failed: {e}")
        return "Thank you for the support. We appreciate the engagement. ⚡"

def handle_incoming_comment(payload: dict):
    """Processes incoming Meta webhook payload for comments."""
    # This assumes the payload structure for Meta Webhooks (Feed/Mentions)
    print("Incoming Payload:", json.dumps(payload, indent=2))
    
    try:
        # Navigate Meta's nested JSON structure
        for entry in payload.get("entry", []):
            for change in entry.get("changes", []):
                value = change.get("value", {})
                
                # Check if it's a comment
                if value.get("item") == "comment" and value.get("verb") == "add":
                    comment_id = value.get("comment_id")
                    comment_text = value.get("message", "")
                    sender_name = value.get("from", {}).get("name", "User")
                    sender_id = value.get("from", {}).get("id")
                    
                    # Prevent replying to our own posts
                    if sender_id == PAGE_ID:
                        continue 
                    
                    print(f"📥 New Comment from {sender_name}: {comment_text}")
                    
                    # Generate the reply copy
                    reply_text = generate_reply(comment_text, sender_name)
                    print(f"✍️  Generated Reply: {reply_text}")
                    
                    # Finally, send the reply back to Facebook
                    reply_to_comment(comment_id, reply_text)
                    
    except Exception as e:
        print(f"❌ Webhook parsing failed: {e}")

# This is a stub for manual local testing.
if __name__ == "__main__":
    print("Test Mode: Simulating an incoming comment...")
    test_comment = "This is incredible! How fast can it build a full MVP?"
    test_user = "TechFounder99"
    
    print(f"Incoming Test Comment from {test_user}: '{test_comment}'")
    reply = generate_reply(test_comment, test_user)
    print(f"\nGenerated Reply:\n{reply}")
    
    # We won't actually post it since we don't have a real test comment ID,
    # but this proves the logic works.
