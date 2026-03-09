"""
@dreamer Daily Cron — Jai.OS 5.0
Davey "The Gravy" Butcha's daily trend goldmine.
Run at session start: python execution/dreamer_daily.py
"""

import requests
from datetime import datetime
from pathlib import Path
import os
import sys

# Fix Windows Unicode output
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ROOT = Path(__file__).parent.parent
TMP = ROOT / ".tmp"
TMP.mkdir(exist_ok=True)

TODAY = datetime.now().strftime("%Y-%m-%d")
OUTPUT_FILE = TMP / f"dreamer_daily_{TODAY}.md"

# Skip if already ran today AND has AI analysis
if OUTPUT_FILE.exists():
    cached = OUTPUT_FILE.read_text(encoding="utf-8")
    if "_AI analysis unavailable" not in cached:
        print(f"[DREAMER] Already ran today ({TODAY}). Reading cached feed...")
        print(cached)
        sys.exit(0)
    else:
        print(f"[DREAMER] Cached file missing AI analysis — re-running with API key...")

print(f"[DREAMER] Starting daily goldmine scan — {TODAY}")

# --- FETCH HN TOP STORIES ---
def fetch_hn_top():
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
        print(f"[DREAMER] HN fetch error: {e}")
        return []

# --- FETCH PRODUCT HUNT VIA RSS ---
def fetch_product_hunt():
    try:
        import xml.etree.ElementTree as ET
        r = requests.get("https://www.producthunt.com/feed", timeout=10)
        root = ET.fromstring(r.content)
        items = []
        for item in root.findall(".//item")[:10]:
            title = item.findtext("title", "")
            desc = item.findtext("description", "")[:200]
            items.append({"title": title, "description": desc})
        return items
    except Exception as e:
        print(f"[DREAMER] PH fetch error: {e}")
        return []

# --- FETCH REDDIT HOT (r/SideProject + r/MachineLearning + r/entrepreneur) ---
def fetch_reddit_hot():
    subs = ["SideProject", "MachineLearning", "entrepreneur", "AIToolsTech"]
    results = []
    headers = {"User-Agent": "antigravity-dreamer/1.0"}
    for sub in subs:
        try:
            r = requests.get(
                f"https://www.reddit.com/r/{sub}/hot.json?limit=5",
                headers=headers,
                timeout=8,
            )
            posts = r.json().get("data", {}).get("children", [])
            for p in posts[:3]:
                d = p["data"]
                if not d.get("stickied"):
                    results.append({
                        "title": d.get("title", ""),
                        "score": d.get("score", 0),
                        "subreddit": sub,
                        "comments": d.get("num_comments", 0),
                    })
        except Exception:
            pass
    return sorted(results, key=lambda x: x["score"], reverse=True)[:8]

# --- FETCH DEV.TO TRENDING ---
def fetch_devto_trending():
    try:
        r = requests.get(
            "https://dev.to/api/articles?top=1&per_page=6",
            headers={"User-Agent": "antigravity-dreamer/1.0"},
            timeout=8,
        )
        articles = r.json()
        return [
            {
                "title": a.get("title", ""),
                "reactions": a.get("positive_reactions_count", 0),
                "tags": ", ".join(a.get("tag_list", [])[:3]),
            }
            for a in articles
        ]
    except Exception as e:
        print(f"[DREAMER] DEV.to fetch error: {e}")
        return []

# --- FETCH INDIEHACKERS MILESTONES (RSS) ---
def fetch_indiehackers():
    try:
        import xml.etree.ElementTree as ET
        r = requests.get(
            "https://www.indiehackers.com/feed.xml",
            headers={"User-Agent": "antigravity-dreamer/1.0"},
            timeout=8,
        )
        root = ET.fromstring(r.content)
        items = []
        for item in root.findall(".//item")[:5]:
            title = item.findtext("title", "")
            items.append({"title": title})
        return items
    except Exception as e:
        print(f"[DREAMER] IH fetch error: {e}")
        return []

hn = fetch_hn_top()
ph = fetch_product_hunt()
reddit = fetch_reddit_hot()
devto = fetch_devto_trending()
ih = fetch_indiehackers()

# --- ANALYSE & GENERATE IDEAS ---
# Use Anthropic API if key available, else use template engine
ANTHROPIC_KEY = os.environ.get("ANTHROPIC_API_KEY")
if not ANTHROPIC_KEY:
    # Fallback: manually parse .env (handles Windows CRLF and BOM)
    env_path = ROOT / ".env"
    if env_path.exists():
        for env_line in env_path.read_text(encoding="utf-8-sig", errors="ignore").splitlines():
            env_line = env_line.strip()
            if env_line.startswith("ANTHROPIC_API_KEY="):
                ANTHROPIC_KEY = env_line.split("=", 1)[1].strip().strip('"').strip("'")
                break

hn_titles = "\n".join([f"- [{s['score']} pts] {s['title']}" for s in hn])
ph_titles = "\n".join([f"- {p['title']}" for p in ph[:8]])
reddit_titles = "\n".join([f"- [r/{r['subreddit']} · {r['score']}↑] {r['title']}" for r in reddit])
devto_titles = "\n".join([f"- [{a['reactions']}❤] {a['title']} ({a['tags']})" for a in devto])
ih_titles = "\n".join([f"- {i['title']}" for i in ih])

ideas_content = ""

if ANTHROPIC_KEY:
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
{hn_titles}

**Product Hunt Launches:**
{ph_titles if ph_titles else "_(unavailable)_"}

**Reddit Hot (SideProject / MachineLearning / entrepreneur):**
{reddit_titles if reddit_titles else "_(unavailable)_"}

**DEV.to Trending:**
{devto_titles if devto_titles else "_(unavailable)_"}

**IndieHackers Milestones:**
{ih_titles if ih_titles else "_(unavailable)_"}

Generate exactly 5 high-intent business ideas based on ALL these signals combined. For each idea:
- **Name**: punchy 3-5 word title
- **Concept**: one crisp sentence
- **Monetization**: specific price and model
- **Gravy Index**: score 1-10 with one-line reason
- **Signal**: which source(s) triggered this idea and why NOW

Format as markdown. Be ruthless — only asymmetric opportunities Antigravity can build and monetise within 30 days.
End with "DAILY EMPIRE FEED COMPLETE — @dreamer 🍖" """
                }]
            },
            timeout=30
        ).json()
        ideas_content = resp["content"][0]["text"]
        print("[DREAMER] Claude-powered analysis complete.")
    except Exception as e:
        print(f"[DREAMER] Anthropic API error: {e} — falling back to raw feed")

# --- BUILD OUTPUT ---
output = f"""# DREAMER DAILY FEED — {TODAY}
**@dreamer | Jai.OS 5.0 | GOLD CERTIFIED | 5-Source Intelligence**

---

## HN TOP SIGNALS TODAY
{hn_titles if hn_titles else "_(HN unavailable today)_"}

---

## PRODUCT HUNT LAUNCHES TODAY
{ph_titles if ph_titles else "_(PH unavailable today)_"}

---

## REDDIT HOT (r/SideProject · r/MachineLearning · r/entrepreneur)
{reddit_titles if reddit_titles else "_(Reddit unavailable today)_"}

---

## DEV.TO TRENDING
{devto_titles if devto_titles else "_(DEV.to unavailable today)_"}

---

## INDIEHACKERS MILESTONES
{ih_titles if ih_titles else "_(IndieHackers unavailable today)_"}

---

## TODAY'S 5 IDEAS (5-Source Analysis)
{ideas_content if ideas_content else "_AI analysis unavailable — run again with ANTHROPIC_API_KEY in .env_"}

---
*Generated: {datetime.now().strftime("%Y-%m-%d %H:%M UTC")} | Sources: HN + PH + Reddit + DEV.to + IndieHackers*
"""

OUTPUT_FILE.write_text(output, encoding="utf-8")
print(f"\n[DREAMER] Feed saved to {OUTPUT_FILE}")
print("\n" + "="*60)
sys.stdout.buffer.write((output + "\n").encode("utf-8", errors="replace"))
sys.stdout.buffer.flush()
print("="*60)

# --- APPEND TO CHATROOM ---
chatroom = ROOT / ".agent" / "boardroom" / "chatroom.md"
if chatroom.exists():
    timestamp = datetime.now().strftime("%Y-%m-%d | %H:%M UTC")
    chatroom_entry = f"""

---

### {timestamp} - DAILY EMPIRE FEED

**@dreamer:** DAILY EMPIRE FEED READY — {TODAY}

**HN Top Signal:** {hn[0]['title'] if hn else 'N/A'} ({hn[0]['score'] if hn else 0} pts)
**PH Top Launch:** {ph[0]['title'] if ph else 'N/A'}

Full feed: `.tmp/dreamer_daily_{TODAY}.md`

"""
    with open(chatroom, "a", encoding="utf-8") as f:
        f.write(chatroom_entry)
    print(f"[DREAMER] Broadcast posted to chatroom.md")

print("\n[DREAMER] Redbull is in the system. Gravy incoming.")

# --- TRIGGER GITHUB GOLDMINE (if not already ran today) ---
github_goldmine_file = TMP / f"github_goldmine_{TODAY}.md"
if not github_goldmine_file.exists():
    print("\n[DREAMER] Handing off to @hugo for GitHub Goldmine scan...")
    import subprocess
    result = subprocess.run(
        ["python", str(Path(__file__).parent / "github_goldmine.py")],
        capture_output=False,
        text=True
    )
else:
    print(f"\n[DREAMER] @hugo's GitHub Goldmine already ran today — cached at .tmp/github_goldmine_{TODAY}.md")
