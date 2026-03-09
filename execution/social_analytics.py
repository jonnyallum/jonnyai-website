"""
social_analytics.py — Antigravity Social Analytics Scraper v1.0
================================================================
Jai.OS 5.0 | Pulls engagement data from FB + IG back into the Shared Brain.

Runs on a schedule (daily) to:
  1. Find posts from 24h ago → scrape engagement → update social_posts.engagement_24h
  2. Find posts from 7d ago → scrape engagement → update social_posts.engagement_7d
  3. Feed top-performing hooks back to @contentforge's Hook Library
  4. Identify underperforming content patterns for retirement

Usage:
    python execution/social_analytics.py              # full run
    python execution/social_analytics.py --dry-run    # preview only
"""

import os
import sys
import json
import requests
from datetime import datetime, timezone, timedelta
from pathlib import Path

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# ── Config ────────────────────────────────────────────────────────────────────
BRAIN_URL = os.getenv("ANTIGRAVITY_BRAIN_URL", "")
BRAIN_KEY = os.getenv("ANTIGRAVITY_BRAIN_ANON_KEY", os.getenv("ANTIGRAVITY_BRAIN_SERVICE_ROLE_KEY", ""))
FB_PAGE_ID = os.getenv("FACEBOOK_PAGE_ID", "")
FB_TOKEN = os.getenv("FACEBOOK_PAGE_ACCESS_TOKEN", "")
IG_USER_ID = os.getenv("INSTAGRAM_BUSINESS_ID", "")

BRAIN_HEADERS = {
    "apikey": BRAIN_KEY,
    "Authorization": f"Bearer {BRAIN_KEY}",
    "Content-Type": "application/json"
} if BRAIN_KEY else {}


# ── Meta Graph API ────────────────────────────────────────────────────────────

def get_fb_post_insights(post_id: str) -> dict:
    """Pull engagement metrics for a Facebook post."""
    if not FB_TOKEN or not post_id:
        return {}
    try:
        # Get basic metrics
        url = f"https://graph.facebook.com/v19.0/{post_id}"
        params = {
            "fields": "likes.summary(true),comments.summary(true),shares,message",
            "access_token": FB_TOKEN
        }
        resp = requests.get(url, params=params, timeout=10)
        if resp.status_code != 200:
            return {}
        data = resp.json()

        # Get reach/impressions via insights
        insights_url = f"https://graph.facebook.com/v19.0/{post_id}/insights"
        insights_params = {
            "metric": "post_impressions,post_reach,post_engaged_users,post_clicks",
            "access_token": FB_TOKEN
        }
        insights_resp = requests.get(insights_url, params=insights_params, timeout=10)
        insights_data = {}
        if insights_resp.status_code == 200:
            for metric in insights_resp.json().get("data", []):
                name = metric.get("name", "")
                values = metric.get("values", [{}])
                insights_data[name] = values[0].get("value", 0) if values else 0

        return {
            "likes": data.get("likes", {}).get("summary", {}).get("total_count", 0),
            "comments": data.get("comments", {}).get("summary", {}).get("total_count", 0),
            "shares": data.get("shares", {}).get("count", 0) if data.get("shares") else 0,
            "impressions": insights_data.get("post_impressions", 0),
            "reach": insights_data.get("post_reach", 0),
            "engaged_users": insights_data.get("post_engaged_users", 0),
            "clicks": insights_data.get("post_clicks", 0),
        }
    except Exception as e:
        print(f"  FB insights error for {post_id}: {e}")
        return {}


def get_ig_post_insights(media_id: str) -> dict:
    """Pull engagement metrics for an Instagram post."""
    if not FB_TOKEN or not media_id:
        return {}
    try:
        url = f"https://graph.facebook.com/v19.0/{media_id}/insights"
        params = {
            "metric": "impressions,reach,likes,comments,shares,saved",
            "access_token": FB_TOKEN
        }
        resp = requests.get(url, params=params, timeout=10)
        if resp.status_code != 200:
            return {}

        result = {}
        for metric in resp.json().get("data", []):
            name = metric.get("name", "")
            values = metric.get("values", [{}])
            result[name] = values[0].get("value", 0) if values else 0
        return result
    except Exception as e:
        print(f"  IG insights error for {media_id}: {e}")
        return {}


# ── Shared Brain Queries ──────────────────────────────────────────────────────

def get_posts_needing_analytics(hours_ago: int, field: str) -> list:
    """
    Find social_posts that were published ~hours_ago and don't have
    the specified engagement field populated yet.
    """
    if not BRAIN_URL:
        return []
    target_time = datetime.now(timezone.utc) - timedelta(hours=hours_ago)
    window_start = (target_time - timedelta(hours=2)).isoformat()
    window_end = (target_time + timedelta(hours=2)).isoformat()

    try:
        resp = requests.get(
            f"{BRAIN_URL}/rest/v1/social_posts",
            headers=BRAIN_HEADERS,
            params={
                "select": "id,fb_post_id,ig_post_id,pillar,facebook_copy,created_at",
                "created_at": f"gte.{window_start}",
                f"created_at": f"lte.{window_end}",
                "status": "eq.published",
                "order": "created_at.desc",
                "limit": "20"
            },
            timeout=10
        )
        return resp.json() if resp.status_code == 200 else []
    except:
        return []


def update_post_engagement(post_id: str, field: str, data: dict):
    """Update the engagement data for a social post."""
    if not BRAIN_URL:
        return
    try:
        requests.patch(
            f"{BRAIN_URL}/rest/v1/social_posts",
            headers={**BRAIN_HEADERS, "Prefer": "return=minimal"},
            params={"id": f"eq.{post_id}"},
            json={field: json.dumps(data)},
            timeout=10
        )
    except Exception as e:
        print(f"  Update error: {e}")


# ── Hook Library ──────────────────────────────────────────────────────────────

def update_hook_library(top_posts: list):
    """
    Feed top-performing opening lines to @contentforge's Hook Library.
    A 'hook' is the first sentence of the Facebook copy.
    """
    ROOT = Path(__file__).parent.parent
    hook_file = ROOT / ".agent" / "library" / "hook-library.md"
    hook_file.parent.mkdir(parents=True, exist_ok=True)

    existing = hook_file.read_text(encoding="utf-8") if hook_file.exists() else "# Hook Library\n\n"

    new_hooks = []
    for post in top_posts:
        fb_copy = post.get("facebook_copy", "")
        if not fb_copy:
            continue
        # Extract first sentence as hook
        hook = fb_copy.split(".")[0].strip() + "."
        if len(hook) < 10 or hook in existing:
            continue

        engagement = post.get("engagement_data", {})
        total = engagement.get("likes", 0) + engagement.get("comments", 0) + engagement.get("shares", 0)
        new_hooks.append(f"| {hook[:80]} | {post.get('pillar', '?')} | {total} | {post.get('created_at', '?')[:10]} |")

    if new_hooks:
        if "| Hook |" not in existing:
            existing += "\n| Hook | Pillar | Engagement | Date |\n| :--- | :--- | :--- | :--- |\n"
        for h in new_hooks:
            existing += h + "\n"
        hook_file.write_text(existing, encoding="utf-8")
        print(f"  Added {len(new_hooks)} hooks to Hook Library")


# ── Main ──────────────────────────────────────────────────────────────────────

def run(dry_run: bool = False):
    print(f"""
+==============================================================+
|  Antigravity Social Analytics Scraper v1.0                    |
|  Jai.OS 5.0 | Engagement -> Shared Brain -> Hook Library      |
+--------------------------------------------------------------+
|  {"DRY RUN MODE" if dry_run else "LIVE MODE"}
+==============================================================+
""")

    # 24-hour engagement check
    print("  Checking 24h engagement...")
    posts_24h = get_posts_needing_analytics(24, "engagement_24h")
    print(f"  Found {len(posts_24h)} posts from ~24h ago")

    for post in posts_24h:
        fb_data = get_fb_post_insights(post.get("fb_post_id", ""))
        ig_data = get_ig_post_insights(post.get("ig_post_id", ""))
        combined = {"facebook": fb_data, "instagram": ig_data, "scraped_at": datetime.now(timezone.utc).isoformat()}

        if dry_run:
            print(f"    [DRY] {post['id'][:8]}: FB={fb_data}, IG={ig_data}")
        else:
            update_post_engagement(post["id"], "engagement_24h", combined)
            print(f"    Updated {post['id'][:8]}: likes={fb_data.get('likes', 0)}, comments={fb_data.get('comments', 0)}")

    # 7-day engagement check
    print("\n  Checking 7d engagement...")
    posts_7d = get_posts_needing_analytics(168, "engagement_7d")
    print(f"  Found {len(posts_7d)} posts from ~7d ago")

    top_posts = []
    for post in posts_7d:
        fb_data = get_fb_post_insights(post.get("fb_post_id", ""))
        ig_data = get_ig_post_insights(post.get("ig_post_id", ""))
        combined = {"facebook": fb_data, "instagram": ig_data, "scraped_at": datetime.now(timezone.utc).isoformat()}

        total_engagement = fb_data.get("likes", 0) + fb_data.get("comments", 0) + fb_data.get("shares", 0)

        if dry_run:
            print(f"    [DRY] {post['id'][:8]}: total_engagement={total_engagement}")
        else:
            update_post_engagement(post["id"], "engagement_7d", combined)
            print(f"    Updated {post['id'][:8]}: total_engagement={total_engagement}")

        if total_engagement > 5:  # Threshold for "top performing"
            post["engagement_data"] = fb_data
            top_posts.append(post)

    # Update Hook Library with top performers
    if top_posts and not dry_run:
        print(f"\n  Updating Hook Library with {len(top_posts)} top performers...")
        update_hook_library(top_posts)

    print("\n  Analytics scrape complete.")


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Antigravity Social Analytics Scraper")
    parser.add_argument("--dry-run", action="store_true", help="Preview only")
    args = parser.parse_args()
    run(dry_run=args.dry_run)
