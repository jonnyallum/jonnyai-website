"""
process_content_calendar.py — Server-Side Content Calendar Processor
=====================================================================
Jai.OS 5.0 | Runs via GitHub Actions cron (09:55, 13:00, 17:00 UTC daily)

This is the SERVER-SIDE version of the calendar processor. It does NOT
depend on chatroom_listener.py running on Jonny's Windows machine.

Flow:
  1. Query Supabase content_calendar for items where scheduled_for <= NOW() and status = 'scheduled'
  2. For each due item, generate copy via Anthropic (using the assigned agent's voice)
  3. Publish to Facebook via Graph API
  4. Log to social_posts table
  5. Mark calendar item as 'published'

Usage:
    python execution/process_content_calendar.py
    python execution/process_content_calendar.py --dry-run
"""
import os
import sys
import json
import argparse
import hashlib
import requests
from datetime import datetime, timezone

# ── Config ────────────────────────────────────────────────────────────────────
BRAIN_URL = os.getenv("ANTIGRAVITY_BRAIN_URL", "")
BRAIN_KEY = os.getenv("ANTIGRAVITY_BRAIN_SERVICE_ROLE_KEY",
                      os.getenv("ANTIGRAVITY_BRAIN_ANON_KEY", ""))
ANTHROPIC_KEY = os.getenv("ANTHROPIC_API_KEY", "")
FB_PAGE_ID = os.getenv("FACEBOOK_PAGE_ID", "")
FB_TOKEN = os.getenv("FACEBOOK_PAGE_ACCESS_TOKEN", "")

HEADERS = {
    "apikey": BRAIN_KEY,
    "Authorization": f"Bearer {BRAIN_KEY}",
    "Content-Type": "application/json",
}

# ── Voice profiles per pillar ─────────────────────────────────────────────────
VOICE_MAP = {
    "BEHIND_THE_SCENES":      {"agent": "contentforge", "tone": "raw, authentic, build-in-public. Show the messy reality."},
    "EDUCATION_TIP":          {"agent": "sam",           "tone": "actionable, clear, expert. No fluff — give them something they can use in 5 minutes."},
    "CLIENT_CASE_STUDY":      {"agent": "boyce",         "tone": "proof-driven, specific numbers, transformation story. Before → After."},
    "TRILLION_DOLLAR_INSIGHT": {"agent": "contentforge", "tone": "contrarian, bold, thought-leadership. Challenge the status quo."},
    "ENGAGEMENT_POLL":        {"agent": "hannah",        "tone": "conversational, inclusive, curiosity-driven. Make people WANT to answer."},
    "TEAM_CULTURE":           {"agent": "contentforge", "tone": "warm, human, weekend-casual. Show the people behind the AI."},
    "MISSION_COMPLETE":       {"agent": "contentforge", "tone": "authoritative, celebratory, milestone energy."},
    "INFRASTRUCTURE_UPGRADE": {"agent": "contentforge", "tone": "technical but accessible, progress-focused."},
    "AGENT_SPOTLIGHT":        {"agent": "contentforge", "tone": "persona-driven, character introduction, fun."},
    "ACADEMY_UPDATE":         {"agent": "contentforge", "tone": "educational, value-first, community-building."},
}


def supabase_get(endpoint, params=None):
    """GET from Supabase REST API."""
    if not BRAIN_URL or not BRAIN_KEY:
        print("  ERROR: BRAIN_URL or BRAIN_KEY not set")
        return []
    try:
        resp = requests.get(
            f"{BRAIN_URL}/rest/v1/{endpoint}",
            headers=HEADERS,
            params=params,
            timeout=10
        )
        if resp.status_code == 200:
            return resp.json()
        print(f"  ERROR: GET {endpoint} returned {resp.status_code}: {resp.text[:200]}")
        return []
    except Exception as e:
        print(f"  ERROR: GET {endpoint} failed: {e}")
        return []


def supabase_post(endpoint, data):
    """POST to Supabase REST API."""
    if not BRAIN_URL or not BRAIN_KEY:
        return False
    try:
        resp = requests.post(
            f"{BRAIN_URL}/rest/v1/{endpoint}",
            headers={**HEADERS, "Prefer": "return=minimal"},
            json=data,
            timeout=10
        )
        return resp.status_code in (200, 201, 204)
    except Exception as e:
        print(f"  ERROR: POST {endpoint} failed: {e}")
        return False


def supabase_patch(endpoint, filter_str, data):
    """PATCH Supabase REST API with filter."""
    if not BRAIN_URL or not BRAIN_KEY:
        return False
    try:
        resp = requests.patch(
            f"{BRAIN_URL}/rest/v1/{endpoint}?{filter_str}",
            headers={**HEADERS, "Prefer": "return=minimal"},
            json=data,
            timeout=10
        )
        return resp.status_code in (200, 204)
    except Exception as e:
        print(f"  ERROR: PATCH {endpoint} failed: {e}")
        return False


def get_due_items():
    """Get content calendar items that are due for publishing."""
    now = datetime.now(timezone.utc).isoformat()
    return supabase_get("content_calendar", {
        "status": "eq.scheduled",
        "scheduled_for": f"lte.{now}",
        "select": "*",
        "order": "scheduled_for.asc",
        "limit": "10"
    })


def generate_copy(pillar, topic, project_context=None):
    """Generate social media copy using Anthropic."""
    if not ANTHROPIC_KEY:
        print("  WARNING: No ANTHROPIC_API_KEY — using topic as raw copy")
        return {"facebook": topic, "instagram": topic, "linkedin": topic}

    voice = VOICE_MAP.get(pillar, {"tone": "professional, engaging"})

    prompt = f"""You are a social media copywriter for Antigravity — a premium AI agency that builds
websites, apps, and AI systems for businesses. Your brand voice is confident, human, and never corporate.

Write a Facebook post for this content:
- **Pillar**: {pillar}
- **Topic**: {topic}
- **Tone**: {voice['tone']}
{f'- **Project context**: {project_context}' if project_context else ''}

Rules:
- 150-280 characters for the main hook (first line must stop the scroll)
- Total post: 400-800 characters
- Include 1-2 relevant emojis (not excessive)
- End with a clear CTA or question
- NO hashtags in the main copy (add 3-5 hashtags on a separate final line)
- Write as "we" (Antigravity team), never "I"
- Sound human, not like AI wrote it

Return ONLY the post text, nothing else."""

    try:
        resp = requests.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": ANTHROPIC_KEY,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json"
            },
            json={
                "model": "claude-haiku-4-5-20251001",
                "max_tokens": 600,
                "messages": [{"role": "user", "content": prompt}]
            },
            timeout=30
        )
        data = resp.json()
        copy = data["content"][0]["text"].strip()
        print(f"  Generated {len(copy)} chars of copy")
        return {"facebook": copy, "instagram": copy, "linkedin": copy}
    except Exception as e:
        print(f"  ERROR generating copy: {e}")
        return {"facebook": topic, "instagram": topic, "linkedin": topic}


def publish_to_facebook(message):
    """Publish a text post to Facebook Page."""
    if not FB_PAGE_ID or not FB_TOKEN:
        print("  WARNING: Facebook credentials not set — skipping publish")
        return None

    try:
        resp = requests.post(
            f"https://graph.facebook.com/v19.0/{FB_PAGE_ID}/feed",
            data={
                "message": message,
                "access_token": FB_TOKEN
            },
            timeout=15
        )
        data = resp.json()
        if "id" in data:
            print(f"  PUBLISHED to Facebook: {data['id']}")
            return data["id"]
        else:
            print(f"  Facebook publish failed: {data}")
            return None
    except Exception as e:
        print(f"  ERROR publishing to Facebook: {e}")
        return None


def log_social_post(pillar, copy, fb_post_id, calendar_item):
    """Log the published post to social_posts table."""
    content_hash = hashlib.md5(copy["facebook"].encode()).hexdigest()[:16]
    return supabase_post("social_posts", {
        "pillar": pillar,
        "platform": "facebook",
        "content_hash": content_hash,
        "facebook_copy": copy["facebook"],
        "instagram_copy": copy.get("instagram", ""),
        "linkedin_copy": copy.get("linkedin", ""),
        "trigger_tag": calendar_item.get("content_type", ""),
        "trigger_message": calendar_item.get("topic", "")[:500],
        "source_agent": calendar_item.get("assigned_agent", "contentforge"),
        "project_context": calendar_item.get("project_context"),
        "status": "published" if fb_post_id else "generated",
        "fb_post_id": fb_post_id,
        "quality_score": 80,
        "quality_notes": "Auto-generated from content calendar",
        "metadata": json.dumps({
            "source": "content_calendar",
            "calendar_id": calendar_item.get("id"),
            "engine_version": "2.0-serverside"
        })
    })


def process(dry_run=False):
    """Main processing loop."""
    print(f"{'DRY RUN — ' if dry_run else ''}Content Calendar Processor")
    print(f"Time: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}")
    print("=" * 60)

    items = get_due_items()
    if not items:
        print("\nNo scheduled content due. Nothing to do.")
        return

    print(f"\nFound {len(items)} due item(s):\n")

    published = 0
    failed = 0

    for item in items:
        pillar = item.get("pillar", "EDUCATION_TIP")
        topic = item.get("topic", "Scheduled content")
        item_id = item.get("id")
        print(f"  [{pillar}] {topic[:80]}")

        # Generate copy
        copy = generate_copy(pillar, topic, item.get("project_context"))

        if dry_run:
            print(f"  DRY RUN — would publish: {copy['facebook'][:100]}...")
            print()
            continue

        # Publish to Facebook
        fb_post_id = publish_to_facebook(copy["facebook"])

        # Log to social_posts
        logged = log_social_post(pillar, copy, fb_post_id, item)
        if logged:
            print(f"  Logged to social_posts table")
        else:
            print(f"  WARNING: Failed to log to social_posts")

        # Mark calendar item as published
        if fb_post_id:
            supabase_patch("content_calendar", f"id=eq.{item_id}", {
                "status": "published",
                "generated_copy": copy["facebook"]
            })
            published += 1
            print(f"  Calendar item marked as published")
        else:
            # Still mark as attempted so we don't retry endlessly
            supabase_patch("content_calendar", f"id=eq.{item_id}", {
                "status": "failed",
                "generated_copy": copy["facebook"],
            })
            failed += 1
            print(f"  Calendar item marked as failed")

        print()

    print("=" * 60)
    print(f"Done. Published: {published}, Failed: {failed}, Skipped: {len(items) - published - failed}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Generate but don't publish")
    args = parser.parse_args()
    process(dry_run=args.dry_run)
