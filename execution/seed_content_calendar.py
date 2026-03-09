"""
seed_content_calendar.py — Antigravity Content Calendar Seeder v1.0
====================================================================
Jai.OS 5.0 | Seeds a weekly content calendar into the Shared Brain.

Strategy: Proactive, not just reactive. Ensures consistent posting even
on quiet days when no trigger tags fire.

Weekly Schedule:
  Monday    — BEHIND_THE_SCENES (raw, authentic, build-in-public)
  Tuesday   — EDUCATION_TIP (actionable value, establishes expertise)
  Wednesday — CLIENT_CASE_STUDY (social proof, real results)
  Thursday  — TRILLION_DOLLAR_INSIGHT (contrarian thought leadership)
  Friday    — ENGAGEMENT_POLL (community building, algorithm boost)
  Saturday  — TEAM_CULTURE (humanise the brand, weekend casual)
  Sunday    — REST (no scheduled post — reactive only)

Note: Reactive posts from chatroom triggers still fire on top of these.
The calendar provides a baseline rhythm; triggers add the spikes.

Usage:
    python execution/seed_content_calendar.py                    # seed next 7 days
    python execution/seed_content_calendar.py --weeks 4          # seed next 4 weeks
    python execution/seed_content_calendar.py --dry-run          # preview only
"""

import os
import sys
import json
import requests
from datetime import datetime, timezone, timedelta

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# ── Config ────────────────────────────────────────────────────────────────────
BRAIN_URL = os.getenv("ANTIGRAVITY_BRAIN_URL", "")
BRAIN_KEY = os.getenv("ANTIGRAVITY_BRAIN_ANON_KEY", os.getenv("ANTIGRAVITY_BRAIN_SERVICE_ROLE_KEY", ""))

BRAIN_HEADERS = {
    "apikey": BRAIN_KEY,
    "Authorization": f"Bearer {BRAIN_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
} if BRAIN_KEY else {}

# ── Weekly Schedule ───────────────────────────────────────────────────────────
# day_of_week: 0=Monday, 6=Sunday
WEEKLY_SCHEDULE = {
    0: {  # Monday
        "pillar": "BEHIND_THE_SCENES",
        "content_type": "BTS",
        "assigned_agent": "contentforge",
        "topic_pool": [
            "What does a typical day look like when 69 AI agents are building websites simultaneously?",
            "The debugging session that taught us the most this week.",
            "A look inside the Shared Brain — how our agents remember and learn.",
            "The moment we realised our AI orchestra could self-improve.",
            "What happens when an agent fails? Our recovery protocol in action.",
            "From idea to live website in under 24 hours — the real timeline.",
            "The infrastructure nobody sees — servers, databases, and the glue that holds it together.",
            "How we onboard a new AI agent — from concept to first task.",
        ]
    },
    1: {  # Tuesday
        "pillar": "EDUCATION_TIP",
        "content_type": "TIP",
        "assigned_agent": "sam",
        "topic_pool": [
            "3 things most businesses get wrong about their website SEO (and how to fix them in 10 minutes).",
            "Why your website loads slowly and the one change that fixes 80% of speed issues.",
            "The difference between a website that looks good and one that actually converts.",
            "How to write a homepage headline that makes visitors stay (not bounce).",
            "The SEO checklist every small business should run monthly.",
            "Why most AI-generated content fails — and how to make it work for your brand.",
            "The 5-minute accessibility check that could save your business from a lawsuit.",
            "How to structure your Google Business Profile for maximum local visibility.",
        ]
    },
    2: {  # Wednesday
        "pillar": "CLIENT_CASE_STUDY",
        "content_type": "CLIENT_WIN",
        "assigned_agent": "boyce",
        "topic_pool": [
            "How we built a full e-commerce website with 47 product pages and automated stock sync.",
            "From zero online presence to a fully SEO-optimised website — a waste management case study.",
            "Building a bakery website that actually drives footfall — not just looks pretty.",
            "The client who needed a complete rebrand and website in 2 weeks. Here's what we delivered.",
            "How automated client reporting changed the way we work with businesses.",
            "A motorcycle dealership's journey from spreadsheets to a live e-commerce platform.",
            "Why this client chose an AI agency over a traditional web studio — and what happened next.",
            "The website that paid for itself in the first month through organic traffic.",
        ]
    },
    3: {  # Thursday
        "pillar": "TRILLION_DOLLAR_INSIGHT",
        "content_type": "INSIGHT",
        "assigned_agent": "contentforge",
        "topic_pool": [
            "Most AI agencies are just one person with ChatGPT. Here's why that model is already dead.",
            "The real cost of a cheap website isn't the price — it's the revenue you never earn.",
            "Why 90% of businesses will be using AI agents within 3 years, whether they know it or not.",
            "The web development industry is about to split into two tiers. Which side are you on?",
            "Everyone's talking about AI replacing jobs. Nobody's talking about AI creating entirely new ones.",
            "The biggest lie in tech: 'You can build it yourself with no-code tools.'",
            "Why the best AI isn't the smartest — it's the most coordinated.",
            "The future of business isn't automation. It's orchestration.",
        ]
    },
    4: {  # Friday
        "pillar": "ENGAGEMENT_POLL",
        "content_type": "POLL",
        "assigned_agent": "hannah",
        "topic_pool": [
            "What matters more for your business website: speed or design? Drop your answer below.",
            "If you could automate ONE thing in your business tomorrow, what would it be?",
            "Hot take: AI-built websites will be indistinguishable from human-built ones by 2027. Agree or disagree?",
            "Quick poll: Do you check a company's website before doing business with them? Always / Sometimes / Never.",
            "What's the biggest frustration with your current website? Speed / Design / Content / SEO / All of the above.",
            "Would you trust an AI to write your business emails? Yes / No / Already do.",
            "What's more important for a small business: social media presence or a great website?",
            "Friday debate: Is it better to launch a basic website fast, or wait for a perfect one?",
        ]
    },
    5: {  # Saturday
        "pillar": "TEAM_CULTURE",
        "content_type": "CULTURE",
        "assigned_agent": "contentforge",
        "topic_pool": [
            "Weekend vibes at Antigravity — even our AI agents take a breather (sort of).",
            "Meet the founder: why Jonny built an orchestra of 69 AI specialists instead of hiring a team.",
            "The story behind the name 'Antigravity Orchestra' — and why it matters.",
            "What we learned this week — the good, the bad, and the debugging.",
            "Our favourite agent interaction this week (yes, they surprise us too).",
            "The playlist that powers the Orchestra — what we listen to while building the future.",
            "A founder's honest take: what's working, what's not, and what's next.",
            "Why we build in public — the real reason, not the marketing reason.",
        ]
    },
    # Sunday = rest day, no scheduled content
}

# Post time: 10:00 AM UTC (adjustable)
POST_HOUR = 10
POST_MINUTE = 0


# ── Seeder ────────────────────────────────────────────────────────────────────

def seed_calendar(weeks: int = 1, dry_run: bool = False):
    """Seed the content calendar for the next N weeks."""
    print(f"\n  Seeding content calendar for {weeks} week(s)...")

    today = datetime.now(timezone.utc).replace(hour=POST_HOUR, minute=POST_MINUTE, second=0, microsecond=0)
    items_created = 0
    topic_index = {}  # Track which topic to use per day-of-week

    for week in range(weeks):
        for day_offset in range(7):
            target_date = today + timedelta(days=(week * 7) + day_offset)
            dow = target_date.weekday()  # 0=Monday

            if dow not in WEEKLY_SCHEDULE:
                continue  # Sunday = rest

            schedule = WEEKLY_SCHEDULE[dow]
            # Rotate through topic pool
            idx = topic_index.get(dow, 0)
            topic = schedule["topic_pool"][idx % len(schedule["topic_pool"])]
            topic_index[dow] = idx + 1

            item = {
                "scheduled_for": target_date.isoformat(),
                "pillar": schedule["pillar"],
                "content_type": schedule["content_type"],
                "topic": topic,
                "assigned_agent": schedule["assigned_agent"],
                "status": "scheduled",
                "notes": f"Auto-seeded week {week + 1}, {target_date.strftime('%A')}"
            }

            if dry_run:
                print(f"    [DRY] {target_date.strftime('%a %d %b %H:%M')} | {schedule['pillar']} | @{schedule['assigned_agent']}")
                print(f"           Topic: {topic[:70]}...")
            else:
                try:
                    resp = requests.post(
                        f"{BRAIN_URL}/rest/v1/content_calendar",
                        headers=BRAIN_HEADERS,
                        json=item,
                        timeout=10
                    )
                    if resp.status_code in (200, 201, 204):
                        items_created += 1
                        print(f"    {target_date.strftime('%a %d %b')} | {schedule['pillar']} | @{schedule['assigned_agent']}")
                    else:
                        print(f"    FAILED: {resp.status_code} — {resp.text[:100]}")
                except Exception as e:
                    print(f"    ERROR: {e}")

    print(f"\n  Calendar seeded: {items_created} items created.")
    return items_created


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Antigravity Content Calendar Seeder")
    parser.add_argument("--weeks", type=int, default=1, help="Number of weeks to seed (default: 1)")
    parser.add_argument("--dry-run", action="store_true", help="Preview only")
    args = parser.parse_args()
    seed_calendar(weeks=args.weeks, dry_run=args.dry_run)
