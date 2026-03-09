"""
dreamer_daily_serverside.py — @dreamer Daily Cron (Server-Side)
================================================================
Jai.OS 5.0 | Runs via GitHub Actions at 07:00 UTC daily.

This is the SERVER-SIDE version. It does NOT depend on Jonny's Windows machine.
Instead of writing to local files and chatroom.md, it posts directly to the
Supabase chatroom table.

Flow:
  1. Fetch signals from 5 sources (HN, PH, Reddit, DEV.to, IndieHackers)
  2. Generate 5 business ideas via Anthropic Claude
  3. Post summary to Supabase chatroom as @dreamer
  4. Post full feed to Supabase chatroom as @dreamer

Usage:
    python execution/dreamer_daily_serverside.py
"""
import os
import sys
import json
import requests
from datetime import datetime, timezone

# ── Config ────────────────────────────────────────────────────────────────────
ANTHROPIC_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
BRAIN_URL = os.getenv("ANTIGRAVITY_BRAIN_URL", "")
BRAIN_KEY = os.getenv("ANTIGRAVITY_BRAIN_SERVICE_ROLE_KEY",
                      os.getenv("ANTIGRAVITY_BRAIN_ANON_KEY", ""))

HEADERS = {
    "apikey": BRAIN_KEY,
    "Authorization": f"Bearer {BRAIN_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
} if BRAIN_KEY else {}

TODAY = datetime.now(timezone.utc).strftime("%Y-%m-%d")


def post_to_chatroom(agent_id, message):
    """Post a message to the Supabase chatroom table."""
    if not BRAIN_URL or not BRAIN_KEY:
        print(f"  [SKIP] No Supabase credentials — cannot post to chatroom")
        return False
    try:
        resp = requests.post(
            f"{BRAIN_URL}/rest/v1/chatroom",
            headers=HEADERS,
            json={
                "ai_source": "github-actions",
                "agent_id": agent_id,
                "message": message,
                "message_type": "chat"
            },
            timeout=10
        )
        if resp.status_code in (200, 201, 204):
            print(f"  Posted to chatroom as @{agent_id}")
            return True
        print(f"  ERROR posting to chatroom: {resp.status_code} {resp.text[:200]}")
        return False
    except Exception as e:
        print(f"  ERROR posting to chatroom: {e}")
        return False


# ── Signal Sources ────────────────────────────────────────────────────────────

def fetch_hn_top():
    """Fetch top Hacker News stories."""
    try:
        ids = requests.get("https://hacker-news.firebaseio.com/v0/topstories.json", timeout=10).json()[:30]
        stories = []
        for sid in ids[:20]:
            s = requests.get(f"https://hacker-news.firebaseio.com/v0/item/{sid}.json", timeout=5).json()
            if s and s.get("type") == "story":
                stories.append({
                    "title": s.get("title", ""),
                    "score": s.get("score", 0),
                    "url": s.get("url", ""),
                    "comments": s.get("descendants", 0)
                })
        return sorted(stories, key=lambda x: x["score"], reverse=True)[:10]
    except Exception as e:
        print(f"  [DREAMER] HN fetch error: {e}")
        return []


def fetch_product_hunt():
    """Fetch Product Hunt launches via RSS."""
    try:
        import xml.etree.ElementTree as ET
        r = requests.get("https://www.producthunt.com/feed", timeout=10)
        root = ET.fromstring(r.content)
        items = []
        for item in root.findall(".//item")[:10]:
            title = item.find("title")
            link = item.find("link")
            if title is not None:
                items.append({
                    "title": title.text or "",
                    "url": link.text if link is not None else ""
                })
        return items
    except Exception as e:
        print(f"  [DREAMER] PH fetch error: {e}")
        return []


def fetch_reddit():
    """Fetch hot posts from key subreddits."""
    subreddits = ["SideProject", "MachineLearning", "entrepreneur"]
    all_posts = []
    for sub in subreddits:
        try:
            r = requests.get(
                f"https://www.reddit.com/r/{sub}/hot.json?limit=5",
                headers={"User-Agent": "AntigravityDreamer/1.0"},
                timeout=10
            )
            data = r.json()
            for post in data.get("data", {}).get("children", []):
                d = post["data"]
                if not d.get("stickied"):
                    all_posts.append({
                        "title": d.get("title", ""),
                        "score": d.get("score", 0),
                        "subreddit": sub,
                        "url": f"https://reddit.com{d.get('permalink', '')}"
                    })
        except Exception as e:
            print(f"  [DREAMER] Reddit r/{sub} error: {e}")
    return sorted(all_posts, key=lambda x: x["score"], reverse=True)[:10]


def fetch_devto():
    """Fetch trending DEV.to articles."""
    try:
        r = requests.get("https://dev.to/api/articles?top=1&per_page=10", timeout=10)
        articles = []
        for a in r.json():
            articles.append({
                "title": a.get("title", ""),
                "reactions": a.get("positive_reactions_count", 0),
                "tags": a.get("tag_list", []),
                "url": a.get("url", "")
            })
        return articles
    except Exception as e:
        print(f"  [DREAMER] DEV.to error: {e}")
        return []


def fetch_indiehackers():
    """Fetch IndieHackers milestones (best-effort, may fail)."""
    try:
        r = requests.get("https://www.indiehackers.com/feed.xml", timeout=10)
        import xml.etree.ElementTree as ET
        root = ET.fromstring(r.content)
        items = []
        for item in root.findall(".//{http://www.w3.org/2005/Atom}entry")[:8]:
            title = item.find("{http://www.w3.org/2005/Atom}title")
            if title is not None:
                items.append({"title": title.text or ""})
        return items
    except:
        return []


def generate_ideas(hn, ph, reddit, devto, ih):
    """Generate 5 business ideas using Anthropic Claude."""
    if not ANTHROPIC_KEY:
        return "_AI analysis unavailable — no ANTHROPIC_API_KEY_"

    hn_titles = "\n".join([f"- [{s['score']} pts] {s['title']}" for s in hn])
    ph_titles = "\n".join([f"- {p['title']}" for p in ph[:8]])
    reddit_titles = "\n".join([f"- [r/{r['subreddit']} | {r['score']}pts] {r['title']}" for r in reddit])
    devto_titles = "\n".join([f"- [{a['reactions']}reactions] {a['title']}" for a in devto])
    ih_titles = "\n".join([f"- {i['title']}" for i in ih])

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
                "max_tokens": 1800,
                "messages": [{
                    "role": "user",
                    "content": f"""You are @dreamer (Davey "The Gravy" Butcha), Creative Venture Architect for Antigravity Agency.
Today's intelligence across 5 signal sources:

**HN Top Stories:**
{hn_titles or "_(unavailable)_"}

**Product Hunt Launches:**
{ph_titles or "_(unavailable)_"}

**Reddit Hot (SideProject / MachineLearning / entrepreneur):**
{reddit_titles or "_(unavailable)_"}

**DEV.to Trending:**
{devto_titles or "_(unavailable)_"}

**IndieHackers Milestones:**
{ih_titles or "_(unavailable)_"}

Generate exactly 5 high-intent business ideas based on ALL these signals combined. For each idea:
- **Name**: punchy 3-5 word title
- **Concept**: one crisp sentence
- **Monetization**: specific price and model
- **Gravy Index**: score 1-10 with one-line reason
- **Signal**: which source(s) triggered this idea and why NOW

Format as markdown. Be ruthless — only asymmetric opportunities Antigravity can build and monetise within 30 days.
End with "DAILY EMPIRE FEED COMPLETE — @dreamer" """
                }]
            },
            timeout=30
        ).json()
        return resp["content"][0]["text"]
    except Exception as e:
        print(f"  [DREAMER] Anthropic API error: {e}")
        return "_AI analysis failed — see logs_"


def main():
    print(f"[DREAMER] Starting daily empire scan — {TODAY}")
    print("=" * 60)

    # Fetch all signals
    print("  Fetching Hacker News...")
    hn = fetch_hn_top()
    print(f"  Got {len(hn)} HN stories")

    print("  Fetching Product Hunt...")
    ph = fetch_product_hunt()
    print(f"  Got {len(ph)} PH launches")

    print("  Fetching Reddit...")
    reddit = fetch_reddit()
    print(f"  Got {len(reddit)} Reddit posts")

    print("  Fetching DEV.to...")
    devto = fetch_devto()
    print(f"  Got {len(devto)} DEV.to articles")

    print("  Fetching IndieHackers...")
    ih = fetch_indiehackers()
    print(f"  Got {len(ih)} IH milestones")

    # Generate ideas
    print("\n  Generating business ideas via Claude...")
    ideas = generate_ideas(hn, ph, reddit, devto, ih)

    # Build summary for chatroom
    top_hn = hn[0]["title"] if hn else "N/A"
    top_hn_score = hn[0]["score"] if hn else 0
    top_ph = ph[0]["title"] if ph else "N/A"

    summary = (
        f"DAILY EMPIRE FEED READY — {TODAY} "
        f"**HN Top Signal:** {top_hn} ({top_hn_score} pts) "
        f"**PH Top Launch:** {top_ph} "
        f"**Sources scanned:** HN({len(hn)}) PH({len(ph)}) Reddit({len(reddit)}) "
        f"DEV.to({len(devto)}) IH({len(ih)})"
    )

    # Post summary to chatroom
    print("\n  Posting to chatroom...")
    post_to_chatroom("dreamer", summary)

    # Build full feed
    hn_block = "\n".join([f"- [{s['score']} pts] {s['title']}" for s in hn]) or "_(unavailable)_"
    full_feed = f"""DREAMER DAILY FEED — {TODAY}

**HN TOP SIGNALS:**
{hn_block}

**IDEAS:**
{ideas}
"""
    # Post full feed (truncated if needed for chatroom)
    if len(full_feed) > 4000:
        full_feed = full_feed[:3950] + "\n\n_(truncated — full feed in GitHub Actions logs)_"

    # Also post the ideas as a separate message for visibility
    if ideas and "_AI analysis" not in ideas:
        ideas_summary = ideas[:2000] if len(ideas) > 2000 else ideas
        post_to_chatroom("dreamer", f"Monetisation analysis complete. Top opportunities:\n\n{ideas_summary}")

    print("\n[DREAMER] Redbull is in the system. Gravy incoming.")
    print("=" * 60)


if __name__ == "__main__":
    main()
