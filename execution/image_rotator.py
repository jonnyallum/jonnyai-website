"""
image_rotator.py — Antigravity Orchestra Image Rotation Engine v1.0
====================================================================
Ensures every social post gets a different, contextually relevant image.
No more hero_background.png on every post.

Strategy:
  1. Each pillar maps to a PRIMARY agent portrait (contextually relevant)
  2. Each pillar also has a POOL of fallback portraits (variety)
  3. A dedup window of 10 posts prevents repeats
  4. Image URLs point to jonnyai.co.uk/agents/portraits/ (live CDN)

Author: Manus | Jai.OS 5.0
"""

import os
import hashlib
import random
import requests

# ─────────────────────────────────────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────────────────────────────────────
BASE_URL = "https://jonnyai.co.uk/agents/portraits"
BRAND_URL = "https://jonnyai.co.uk/brand"
DEDUP_WINDOW = 10  # Don't repeat an image within last N posts

# ─────────────────────────────────────────────────────────────────────────────
# PILLAR → IMAGE POOL MAPPING
# Each pillar has a primary portrait + a pool for rotation
# ─────────────────────────────────────────────────────────────────────────────
PILLAR_IMAGE_MAP = {
    "MISSION_COMPLETE": {
        "primary": "marcus_cole.png",
        "pool": ["marcus_cole.png", "orchestra_visual.png", "neo.png", "julian_west.png", "hugo_reeves.png"]
    },
    "INFRASTRUCTURE_UPGRADE": {
        "primary": "sebastian_cross.png",
        "pool": ["sebastian_cross.png", "devops_derek.png", "deploy_owen.png", "felix_morgan.png", "milo_chen.png"]
    },
    "TRILLION_DOLLAR_INSIGHT": {
        "primary": "scholar.png",
        "pool": ["scholar.png", "grace_liu.png", "elias_thorne.png", "jasper_cole.png", "diana_chen.png"]
    },
    "AGENT_SPOTLIGHT": {
        "primary": None,  # Dynamic — use the mentioned agent's portrait
        "pool": [
            "marcus_cole.png", "priya_sharma.png", "elena_vasquez.png", "winston_hayes.png",
            "sam_blackwood.png", "grace_liu.png", "sebastian_cross.png", "felix_morgan.png",
            "maya_singh.png", "luna_sterling.png", "hannah_park.png", "hugo_reeves.png",
            "jasper_cole.png", "diana_chen.png", "vivienne_frost.png", "rowan.png",
            "theo_martinez.png", "victor_reyes.png", "nina_patel.png", "sterling_brooks.png"
        ]
    },
    "ACADEMY_UPDATE": {
        "primary": "scholar.png",
        "pool": ["scholar.png", "grace_liu.png", "elias_thorne.png", "diana_chen.png", "jasper_cole.png"]
    },
    "CLIENT_CASE_STUDY": {
        "primary": "sterling_brooks.png",
        "pool": ["sterling_brooks.png", "vivienne_frost.png", "hugo_reeves.png", "boyce.png", "monty_carlo.png"]
    },
    "BEHIND_THE_SCENES": {
        "primary": "orchestra_visual.png",
        "pool": ["orchestra_visual.png", "marcus_cole.png", "priya_sharma.png", "sebastian_cross.png", "elena_vasquez.png"]
    },
    "EDUCATION_TIP": {
        "primary": "sam_blackwood.png",
        "pool": ["sam_blackwood.png", "grace_liu.png", "scholar.png", "elias_thorne.png", "diana_chen.png"]
    },
    "ENGAGEMENT_POLL": {
        "primary": "hannah_park.png",
        "pool": ["hannah_park.png", "luna_sterling.png", "nina_patel.png", "maya_singh.png", "vivienne_frost.png"]
    },
    "TEAM_CULTURE": {
        "primary": "orchestra_visual.png",
        "pool": ["orchestra_visual.png", "marcus_cole.png", "priya_sharma.png", "elena_vasquez.png", "luna_sterling.png"]
    },
    "CLIENT_REPORT_TEASER": {
        "primary": "sterling_brooks.png",
        "pool": ["sterling_brooks.png", "hugo_reeves.png", "vivienne_frost.png", "monty_carlo.png", "boyce.png"]
    },
    "NEW_PROJECT_ANNOUNCEMENT": {
        "primary": "marcus_cole.png",
        "pool": ["marcus_cole.png", "sterling_brooks.png", "priya_sharma.png", "sebastian_cross.png", "hugo_reeves.png"]
    },
    "WEBSITE_DEPLOYMENT": {
        "primary": "priya_sharma.png",
        "pool": ["priya_sharma.png", "sebastian_cross.png", "felix_morgan.png", "deploy_owen.png", "milo_chen.png"]
    },
    "TEAM_UPDATE": {
        "primary": "orchestra_visual.png",
        "pool": ["orchestra_visual.png", "marcus_cole.png", "luna_sterling.png", "hannah_park.png", "hugo_reeves.png"]
    },
    "BLOG_GENERATION": {
        "primary": "elena_vasquez.png",
        "pool": ["elena_vasquez.png", "elena_vasquez_alt.png", "scholar.png", "grace_liu.png", "jasper_cole.png"]
    },
    "COLLAB": {
        "primary": "marcus_cole.png",
        "pool": ["marcus_cole.png", "sterling_brooks.png", "vivienne_frost.png", "hugo_reeves.png", "luna_sterling.png"]
    },
}

# Agent name → portrait filename mapping (for dynamic AGENT_SPOTLIGHT)
AGENT_PORTRAIT_MAP = {
    "marcus":       "marcus_cole.png",
    "priya":        "priya_sharma.png",
    "elena":        "elena_vasquez.png",
    "winston":      "winston_hayes.png",
    "sam":          "sam_blackwood.png",
    "grace":        "grace_liu.png",
    "sebastian":    "sebastian_cross.png",
    "felix":        "felix_morgan.png",
    "maya":         "maya_singh.png",
    "luna":         "luna_sterling.png",
    "hannah":       "hannah_park.png",
    "hugo":         "hugo_reeves.png",
    "jasper":       "jasper_cole.png",
    "diana":        "diana_chen.png",
    "vivienne":     "vivienne_frost.png",
    "rowan":        "rowan.png",
    "theo":         "theo_martinez.png",
    "victor":       "victor_reyes.png",
    "nina":         "nina_patel.png",
    "sterling":     "sterling_brooks.png",
    "scholar":      "scholar.png",
    "neo":          "neo.png",
    "julian":       "julian_west.png",
    "boyce":        "sterling_brooks.png",
    "contentforge": "orchestra_visual.png",
    "milo":         "milo_chen.png",
    "derek":        "devops_derek.png",
    "owen":         "deploy_owen.png",
    "blaise":       "blaise_moreau.png",
    "carlos":       "carlos_mendez.png",
    "quinn":        "quinn_harper.png",
    "patrick":      "patrick_nguyen.png",
    "terry":        "terry_taylor.png",
    "gareth":       "gareth_williams.png",
    "harry":        "harry_holt.png",
    "monty":        "monty_carlo.png",
    "mason":        "mason_drake.png",
    "sophie":       "sophie_reid.png",
    "alex":         "alex_torres.png",
    "daniel":       "daniel_rossi.png",
    "steve":        "steve_rivers.png",
    "arthur":       "arthur_webb.png",
    "elias":        "elias_thorne.png",
    "pietro":       "pietro_rossi.png",
    "redeye":       "redeye.png",
}

# Brand images (non-portrait, used for variety)
BRAND_IMAGES = [
    "orchestra_visual.png",
    "hero_background.png",
]


def _get_recent_images(brain_url: str, brain_key: str, limit: int = DEDUP_WINDOW) -> list:
    """Fetch the last N image_urls from social_posts to avoid repeats."""
    if not brain_url or not brain_key:
        return []
    try:
        resp = requests.get(
            f"{brain_url}/rest/v1/social_posts?select=image_url&order=created_at.desc&limit={limit}",
            headers={"apikey": brain_key, "Authorization": f"Bearer {brain_key}"},
            timeout=5
        )
        if resp.status_code == 200:
            return [r["image_url"] for r in resp.json() if r.get("image_url")]
    except Exception:
        pass
    return []


def _resolve_url(filename: str) -> str:
    """Convert a filename to a full CDN URL."""
    if filename in BRAND_IMAGES:
        return f"{BRAND_URL}/{filename}"
    return f"{BASE_URL}/{filename}"


def get_image_for_post(
    pillar: str,
    message_text: str = "",
    agent_id: str = "",
    brain_url: str = "",
    brain_key: str = ""
) -> str:
    """
    Select the best image for a social post, avoiding recent repeats.

    Args:
        pillar: The content pillar (e.g. "EDUCATION_TIP")
        message_text: The trigger message text (used to detect agent names for AGENT_SPOTLIGHT)
        agent_id: The agent posting (used as fallback for portrait)
        brain_url: Supabase URL for dedup check
        brain_key: Supabase key for dedup check

    Returns:
        Full image URL string
    """
    # Get recently used images for dedup
    recent = _get_recent_images(brain_url, brain_key)

    # Get the pool for this pillar
    config = PILLAR_IMAGE_MAP.get(pillar, PILLAR_IMAGE_MAP["MISSION_COMPLETE"])
    pool = config.get("pool", [])
    primary = config.get("primary")

    # For AGENT_SPOTLIGHT: try to detect the agent from the message
    if pillar == "AGENT_SPOTLIGHT":
        for agent_name, portrait in AGENT_PORTRAIT_MAP.items():
            if f"@{agent_name}" in message_text.lower() or f" {agent_name}" in message_text.lower():
                primary = portrait
                break
        # If no agent detected, use the posting agent's portrait
        if not primary and agent_id:
            primary = AGENT_PORTRAIT_MAP.get(agent_id.lower())

    # Try primary first (if not recently used)
    if primary:
        primary_url = _resolve_url(primary)
        if primary_url not in recent:
            return primary_url

    # Try pool in random order, skipping recently used
    shuffled_pool = pool.copy()
    random.shuffle(shuffled_pool)
    for filename in shuffled_pool:
        url = _resolve_url(filename)
        if url not in recent:
            return url

    # All pool images were recently used — pick the least recently used from pool
    for filename in reversed(pool):
        url = _resolve_url(filename)
        if url in recent:
            # Return the one that was used longest ago
            pass
    # Absolute fallback: primary or first in pool
    fallback = primary or (pool[0] if pool else "orchestra_visual.png")
    return _resolve_url(fallback)


def get_image_for_agent(agent_id: str) -> str:
    """Get the portrait URL for a specific agent."""
    filename = AGENT_PORTRAIT_MAP.get(agent_id.lower(), "orchestra_visual.png")
    return _resolve_url(filename)


if __name__ == "__main__":
    # Quick test
    test_cases = [
        ("EDUCATION_TIP", "SEO tip for small businesses", "sam"),
        ("AGENT_SPOTLIGHT", "Introducing @priya our design specialist", "marcus"),
        ("AGENT_SPOTLIGHT", "Meet @elena our copywriter", "marcus"),
        ("WEBSITE_DEPLOYMENT", "New site just went live", "contentforge"),
        ("TRILLION_DOLLAR_INSIGHT", "Research on AI trends", "scholar"),
        ("MISSION_COMPLETE", "Big win today", "marcus"),
        ("ENGAGEMENT_POLL", "What do you think?", "hannah"),
    ]
    print("Image Rotator Test:")
    for pillar, msg, agent in test_cases:
        url = get_image_for_post(pillar, msg, agent)
        print(f"  {pillar:30s} → {url.split('/')[-1]}")
