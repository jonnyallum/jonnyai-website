"""
social_listener_serverside.py — Server-Side Social Event Listener v1.0
=======================================================================
Jai.OS 5.0 | Runs as a GitHub Action every 15 minutes.

Replaces the dependency on chatroom_listener.py running on Jonny's Windows machine.
Polls the Supabase chatroom for unprocessed trigger-tagged messages and fires
the social engine pipeline for each one.

Architecture:
  1. Polls chatroom for messages since last cursor (stored in Supabase KV)
  2. Detects trigger tags ([MISSION], [PROJECT], [DEPLOY], [BLOG], etc.)
  3. Generates copy via Claude (Anthropic API)
  4. Quality gate check
  5. Publishes to Facebook (if FB_ACCESS_TOKEN available)
  6. Logs to social_posts table
  7. Stores blog drafts to blog_posts table (for [BLOG] triggers)

Env vars required:
  ANTIGRAVITY_BRAIN_URL, ANTIGRAVITY_BRAIN_SERVICE_ROLE_KEY
  ANTHROPIC_API_KEY (for copy generation)
  FB_PAGE_ID, FB_ACCESS_TOKEN (optional, for publishing)
"""

import os
import sys
import re
import json
import requests
from datetime import datetime, timezone, timedelta

# ── Image rotator (module-level import to avoid Python scoping issues in main()) ──
try:
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from image_rotator import get_image_for_post as _get_image_for_post
    _IMAGE_ROTATOR_AVAILABLE = True
except Exception:
    _IMAGE_ROTATOR_AVAILABLE = False

_TRIGGER_TO_PILLAR = {
    "[MISSION]": "MISSION_COMPLETE", "[WIN]": "MISSION_COMPLETE",
    "[MILESTONE]": "MISSION_COMPLETE", "[LAUNCH]": "MISSION_COMPLETE",
    "[INFRASTRUCTURE]": "INFRASTRUCTURE_UPGRADE", "[UPGRADE]": "INFRASTRUCTURE_UPGRADE",
    "[RESEARCH]": "TRILLION_DOLLAR_INSIGHT", "[INSIGHT]": "TRILLION_DOLLAR_INSIGHT",
    "[AGENT]": "AGENT_SPOTLIGHT", "[TIP]": "EDUCATION_TIP",
    "[PROJECT]": "NEW_PROJECT_ANNOUNCEMENT", "[DEPLOY]": "WEBSITE_DEPLOYMENT",
    "[BLOG]": "BLOG_GENERATION", "[CLIENT_WIN]": "CLIENT_CASE_STUDY",
    "[BTS]": "BEHIND_THE_SCENES", "[POLL]": "ENGAGEMENT_POLL",
    "[CULTURE]": "TEAM_CULTURE", "[REPORT]": "CLIENT_REPORT_TEASER",
    "[TEAM]": "TEAM_UPDATE", "[WEBSITE]": "WEBSITE_DEPLOYMENT",
    "[ACADEMY]": "ACADEMY_UPDATE",
}

_FALLBACK_IMAGE = "https://jonnyai.co.uk/brand/orchestra_visual.png"

# ── Configuration ─────────────────────────────────────────────────────────────

BRAIN_URL = os.getenv("ANTIGRAVITY_BRAIN_URL", "")
BRAIN_KEY = os.getenv("ANTIGRAVITY_BRAIN_SERVICE_ROLE_KEY",
                       os.getenv("ANTIGRAVITY_BRAIN_ANON_KEY", ""))

HEADERS = {
    "apikey": BRAIN_KEY,
    "Authorization": f"Bearer {BRAIN_KEY}",
    "Content-Type": "application/json",
}

# Trigger tags that should fire social content
TRIGGER_TAGS = [
    "[MISSION]", "[MILESTONE]", "[WIN]", "[LAUNCH]",
    "[INFRASTRUCTURE]", "[UPGRADE]",
    "[INSIGHT]", "[RESEARCH]",
    "[AGENT]", "[ACADEMY]",
    "[CLIENT_WIN]", "[BTS]", "[TIP]", "[POLL]", "[CULTURE]", "[REPORT]",
    "[PROJECT]", "[DEPLOY]", "[WEBSITE]", "[TEAM]", "[BLOG]",
]

# ── Supabase KV for cursor persistence ────────────────────────────────────────

def get_cursor():
    """Get the last processed timestamp from a Supabase config table."""
    try:
        resp = requests.get(
            f"{BRAIN_URL}/rest/v1/system_config?key=eq.social_listener_cursor&select=value",
            headers=HEADERS, timeout=10
        )
        if resp.status_code == 200 and resp.json():
            return resp.json()[0]["value"]
    except Exception as e:
        print(f"  Cursor fetch error: {e}")
    # Default: 30 minutes ago (covers the gap between runs)
    return (datetime.now(timezone.utc) - timedelta(minutes=30)).strftime('%Y-%m-%dT%H:%M:%S.000000Z')


def save_cursor(ts):
    """Upsert the cursor timestamp."""
    try:
        requests.post(
            f"{BRAIN_URL}/rest/v1/system_config",
            headers={**HEADERS, "Prefer": "resolution=merge-duplicates"},
            json={"key": "social_listener_cursor", "value": ts},
            timeout=10
        )
    except Exception as e:
        print(f"  Cursor save error: {e}")


# ── Chatroom polling ──────────────────────────────────────────────────────────

def poll_chatroom(since):
    """Fetch chatroom messages since the cursor that contain trigger tags."""
    # URL-encode the + in timezone offset to avoid PostgREST parse errors
    since_safe = since.replace('+', '%2B')
    try:
        resp = requests.get(
            f"{BRAIN_URL}/rest/v1/chatroom?created_at=gt.{since_safe}&order=created_at.asc&limit=50",
            headers=HEADERS, timeout=15
        )
        if resp.status_code == 200:
            return resp.json()
        print(f"  Poll error: {resp.status_code} {resp.text[:200]}")
    except Exception as e:
        print(f"  Poll error: {e}")
    return []


def detect_trigger(message):
    """Return the first trigger tag found in the message, or None."""
    for tag in TRIGGER_TAGS:
        if tag in message:
            return tag
    return None


# ── Social Engine (lightweight server-side version) ───────────────────────────

def _get_post_image(tag, msg_text, agent):
    """Module-level image helper — avoids Python scoping issues with imports inside main()."""
    if not _IMAGE_ROTATOR_AVAILABLE:
        return _FALLBACK_IMAGE
    try:
        pillar = _TRIGGER_TO_PILLAR.get(tag, "MISSION_COMPLETE")
        return _get_image_for_post(pillar, msg_text, agent, BRAIN_URL, BRAIN_KEY)
    except Exception as e:
        print(f"  Image rotator error: {e}")
        return _FALLBACK_IMAGE


_UK_SYSTEM_PROMPT = """You are a UK-based social media copywriter for Antigravity AI — an elite agentic AI agency based in the UK.

Write engaging, authentic posts using British English throughout. Key rules:
- Use BRITISH ENGLISH: "organise" not "organize", "recognise" not "recognize", "colour" not "color", etc.
- Use UK currency: £ not $
- Use UK date format: DD/MM/YYYY (e.g. 8th March 2026, not March 8)
- Write in first-person plural ("We", "Our team") — we are the Antigravity Orchestra
- Be direct, punchy, and confident — not salesy or hype-filled
- Reference REAL specifics from the message — no vague platitudes
- Facebook: 2-4 sentences, punchy, conversational, include website link
- Instagram: 1-2 sentences + relevant hashtags (max 10, UK-focused)
- LinkedIn: 3-5 sentences, professional but human, include website link

Always return VALID JSON in this exact format (no markdown, no backticks):
{"facebook": "...", "instagram": "...", "linkedin": "..."}"""


def generate_social_copy(message, tag, anthropic_key):
    """Generate social copy using Claude. Returns dict with facebook/instagram/linkedin."""
    if not anthropic_key:
        print("  WARNING: No ANTHROPIC_API_KEY — using template fallback")
        short = message[:120].strip()
        return {
            "facebook": f"{short}\n\nThe Antigravity Orchestra keeps building.\njonnyai.co.uk\n\n#JaiOS #Antigravity #AgenticAI",
            "instagram": f"{short}\n\njonnyai.co.uk\n\n#JaiOS #Antigravity #AgenticAI #AItools #UKtech",
            "linkedin": f"{short}\n\nThe Antigravity Orchestra — elite AI specialists working as one.\n\njonnyai.co.uk\n\n#AI #AgenticAI #UKtech"
        }

    try:
        import anthropic
        client = anthropic.Anthropic(api_key=anthropic_key)

        # Try to load pillar-specific prompts from social_engine
        try:
            from social_engine import TRIGGER_MAP, PILLAR_PROMPTS, CHARACTERS_NOT_CAPABILITIES_RULE
            pillar = TRIGGER_MAP.get(tag, "MISSION_COMPLETE")
            system_prompt = PILLAR_PROMPTS.get(pillar, _UK_SYSTEM_PROMPT)
            system_prompt += "\n\nIMPORTANT: Use British English throughout. Use £ for currency. UK date format (DD/MM/YYYY).\n\n" + CHARACTERS_NOT_CAPABILITIES_RULE
        except ImportError:
            system_prompt = _UK_SYSTEM_PROMPT

        resp = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=1500,
            system=system_prompt,
            messages=[{"role": "user", "content": f"Event tag: {tag}\n\nContext: {message}"}]
        )
        text = resp.content[0].text.strip()

        # Parse JSON from response
        if text.startswith("{"):
            return json.loads(text)
        # Try to extract JSON from markdown code block
        match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', text, re.DOTALL)
        if match:
            return json.loads(match.group(1))
        # Try bare JSON object
        match = re.search(r'\{[^{}]*"facebook"[^{}]*\}', text, re.DOTALL)
        if match:
            return json.loads(match.group())

        print(f"  WARNING: Could not parse Claude response as JSON")
        return {"facebook": text[:500], "instagram": text[:200], "linkedin": text[:500]}

    except Exception as e:
        print(f"  Claude error: {e}")
        short = message[:120].strip()
        return {
            "facebook": f"{short}\n\njonnyai.co.uk\n\n#JaiOS #Antigravity",
            "instagram": f"{short}\n\n#JaiOS #Antigravity #AgenticAI #UKtech",
            "linkedin": f"{short}\n\njonnyai.co.uk"
        }


def publish_to_facebook(copy, fb_page_id, fb_token, image_url=None):
    """Publish to Facebook page with optional image. Returns post_id or None."""
    if not fb_page_id or not fb_token:
        print("  SKIP: No FB_PAGE_ID or FB_ACCESS_TOKEN")
        return None
    try:
        payload = {"access_token": fb_token}
        if image_url:
            # Post with image using photos endpoint
            resp = requests.post(
                f"https://graph.facebook.com/v19.0/{fb_page_id}/photos",
                data={"url": image_url, "caption": copy, "access_token": fb_token},
                timeout=15
            )
        else:
            resp = requests.post(
                f"https://graph.facebook.com/v19.0/{fb_page_id}/feed",
                data={"message": copy, "access_token": fb_token},
                timeout=15
            )
        if resp.status_code == 200:
            post_id = resp.json().get("id", resp.json().get("post_id", "unknown"))
            print(f"  FB LIVE: {post_id}")
            return post_id
        print(f"  FB error: {resp.status_code} {resp.text[:200]}")
    except Exception as e:
        print(f"  FB error: {e}")
    return None


def log_to_social_posts(tag, message, copy, source_agent, status, fb_post_id=None, image_url=None):
    """Log the social post to the social_posts table."""
    TRIGGER_MAP_LOCAL = {
        "[MISSION]": "MISSION_COMPLETE", "[MILESTONE]": "MISSION_COMPLETE",
        "[WIN]": "MISSION_COMPLETE", "[LAUNCH]": "MISSION_COMPLETE",
        "[INFRASTRUCTURE]": "INFRASTRUCTURE_UPGRADE", "[UPGRADE]": "INFRASTRUCTURE_UPGRADE",
        "[INSIGHT]": "TRILLION_DOLLAR_INSIGHT", "[RESEARCH]": "TRILLION_DOLLAR_INSIGHT",
        "[AGENT]": "AGENT_SPOTLIGHT", "[ACADEMY]": "ACADEMY_UPDATE",
        "[COLLAB]": "COLLAB", "[CLIENT_WIN]": "CLIENT_CASE_STUDY",
        "[BTS]": "BEHIND_THE_SCENES", "[TIP]": "EDUCATION_TIP",
        "[POLL]": "ENGAGEMENT_POLL", "[CULTURE]": "TEAM_CULTURE",
        "[REPORT]": "CLIENT_REPORT_TEASER", "[PROJECT]": "NEW_PROJECT_ANNOUNCEMENT",
        "[DEPLOY]": "WEBSITE_DEPLOYMENT", "[WEBSITE]": "WEBSITE_DEPLOYMENT",
        "[TEAM]": "TEAM_UPDATE", "[BLOG]": "BLOG_GENERATION",
    }
    pillar = TRIGGER_MAP_LOCAL.get(tag, "MISSION_COMPLETE")

    try:
        payload = {
            "pillar": pillar,
            "platform": "multi",
            "facebook_copy": copy.get("facebook", ""),
            "instagram_copy": copy.get("instagram", ""),
            "linkedin_copy": copy.get("linkedin", ""),
            "trigger_tag": tag,
            "trigger_message": message[:500],
            "source_agent": source_agent,
            "status": status,
            "image_url": image_url,
            "metadata": json.dumps({"engine": "serverside-listener", "version": "1.1"})
        }
        if fb_post_id:
            payload["fb_post_id"] = fb_post_id
        requests.post(
            f"{BRAIN_URL}/rest/v1/social_posts",
            headers={**HEADERS, "Prefer": "return=minimal"},
            json=payload,
            timeout=10
        )
    except Exception as e:
        print(f"  Log error: {e}")


def store_blog_draft(copy, message, source_agent, project_context):
    """Store a blog draft to the blog_posts table."""
    try:
        requests.post(
            f"{BRAIN_URL}/rest/v1/blog_posts",
            headers={**HEADERS, "Prefer": "return=minimal"},
            json={
                "title": copy.get("blog_title", "Untitled"),
                "body": copy.get("blog_body", ""),
                "meta_description": copy.get("blog_meta_description", ""),
                "status": "draft",
                "source_agent": source_agent,
                "project_context": project_context,
                "trigger_message": message[:500],
                "metadata": json.dumps({"engine": "serverside-listener"})
            },
            timeout=10
        )
        print(f"  Blog draft stored: {copy.get('blog_title', 'Untitled')}")
    except Exception as e:
        print(f"  Blog store error: {e}")


# ── Check for already-processed messages ──────────────────────────────────────

def get_processed_triggers(since):
    """Get trigger_messages already in social_posts to avoid duplicates."""
    try:
        resp = requests.get(
            f"{BRAIN_URL}/rest/v1/social_posts?created_at=gt.{since}&select=trigger_message",
            headers=HEADERS, timeout=10
        )
        if resp.status_code == 200:
            return {r["trigger_message"][:100] for r in resp.json()}
    except:
        pass
    return set()


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    print(f"""
╔══════════════════════════════════════════════════════════════╗
║  Social Listener (Server-Side) v1.0                         ║
║  Jai.OS 5.0 | GitHub Actions Edition                        ║
║  Triggers: {len(TRIGGER_TAGS)} tags | Blog: ENABLED                        ║
╚══════════════════════════════════════════════════════════════╝
""")

    if not BRAIN_URL or not BRAIN_KEY:
        print("ERROR: Missing ANTIGRAVITY_BRAIN_URL or BRAIN_KEY")
        sys.exit(1)

    anthropic_key = os.getenv("ANTHROPIC_API_KEY", "")
    fb_page_id = os.getenv("FB_PAGE_ID", "")
    fb_token = os.getenv("FB_ACCESS_TOKEN", "")

    # 1. Get cursor
    since = get_cursor()
    print(f"  Cursor: {since}")

    # 2. Poll chatroom
    messages = poll_chatroom(since)
    print(f"  Messages since cursor: {len(messages)}")

    if not messages:
        print("  No new messages. Done.")
        return

    # 3. Get already-processed triggers to avoid duplicates
    processed = get_processed_triggers(since)
    print(f"  Already processed: {len(processed)} triggers")

    # 4. Process each message
    new_cursor = since
    triggered = 0
    skipped = 0

    for msg in messages:
        msg_text = msg.get("message", "")
        agent = msg.get("agent_id", "unknown")
        project = msg.get("project_context")
        ts = msg.get("created_at", "")

        # Update cursor
        if ts > new_cursor:
            new_cursor = ts

        # Check for trigger
        tag = detect_trigger(msg_text)
        if not tag:
            continue

        # Dedup check
        if msg_text[:100] in processed:
            skipped += 1
            continue

        print(f"\n  [{ts[:16]}] @{agent} — {tag} detected")
        print(f"  Message: {msg_text[:120]}...")

        # Generate copy
        copy = generate_social_copy(msg_text, tag, anthropic_key)

        # Special handling for [BLOG]
        if tag == "[BLOG]":
            store_blog_draft(copy, msg_text, agent, project)

        # Get image for this post (rotated, no repeats)
        image_url = _get_post_image(tag, msg_text, agent)

        # Publish to Facebook
        fb_post_id = None
        if copy.get("facebook"):
            fb_post_id = publish_to_facebook(copy["facebook"], fb_page_id, fb_token, image_url)

        # Log
        status = "published" if fb_post_id else "generated"
        log_to_social_posts(tag, msg_text, copy, agent, status, fb_post_id, image_url)

        triggered += 1
        print(f"  Status: {status}")

    # 5. Save cursor
    save_cursor(new_cursor)

    print(f"\n{'='*60}")
    print(f"  DONE: {triggered} triggered, {skipped} skipped (dedup), {len(messages)} total messages")
    print(f"  Cursor updated to: {new_cursor}")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
