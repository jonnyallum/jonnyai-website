"""
GitHub Goldmine — @hugo + @dreamer + @scholar
Scans trending/top GitHub repos in AI/agent space.
Feeds to Claude Haiku → monetisation opportunity analysis.
Outputs: .tmp/github_goldmine_YYYY-MM-DD.md
Cron: run daily alongside dreamer_daily.py

Usage:
    python execution/github_goldmine.py
    python execution/github_goldmine.py --force   # re-run even if today's file exists
"""

import sys
import os
import json

if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
import datetime
import urllib.request
import urllib.error
import time
from pathlib import Path
from dotenv import load_dotenv

# ── Paths ────────────────────────────────────────────────────────────────────
ROOT = Path(__file__).parent.parent
load_dotenv(ROOT / ".env")

TODAY = datetime.date.today().isoformat()
TMP = ROOT / ".tmp"
TMP.mkdir(exist_ok=True)
OUTPUT_FILE = TMP / f"github_goldmine_{TODAY}.md"
CHATROOM = ROOT / ".agent" / "boardroom" / "chatroom.md"

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")

FORCE = "--force" in sys.argv

# ── Repo search targets ───────────────────────────────────────────────────────
SEARCH_QUERIES = [
    {"q": "topic:ai-agent stars:>500", "label": "AI Agents"},
    {"q": "topic:llm-agent stars:>300", "label": "LLM Agents"},
    {"q": "topic:multi-agent stars:>200", "label": "Multi-Agent"},
    {"q": "topic:ai-automation stars:>400", "label": "AI Automation"},
    {"q": "topic:prompt-engineering stars:>800", "label": "Prompt Engineering"},
    {"q": "ai workflow automation language:Python stars:>500 pushed:>2026-01-01", "label": "AI Workflow (Python)"},
    {"q": "agent framework typescript stars:>300", "label": "Agent Framework (TS)"},
]

TOP_N_PER_QUERY = 5  # repos to pull per search


def gh_headers():
    h = {"Accept": "application/vnd.github+json", "User-Agent": "antigravity-goldmine/1.0"}
    if GITHUB_TOKEN:
        h["Authorization"] = f"Bearer {GITHUB_TOKEN}"
    return h


def search_repos(query: str, n: int = 5) -> list[dict]:
    url = f"https://api.github.com/search/repositories?q={urllib.parse.quote(query)}&sort=stars&order=desc&per_page={n}"
    try:
        req = urllib.request.Request(url, headers=gh_headers())
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read())
            items = data.get("items", [])
            return [
                {
                    "name": r["full_name"],
                    "description": (r.get("description") or "")[:120],
                    "stars": r["stargazers_count"],
                    "language": r.get("language") or "—",
                    "topics": r.get("topics", [])[:5],
                    "url": r["html_url"],
                    "pushed": r.get("pushed_at", "")[:10],
                }
                for r in items
            ]
    except Exception as e:
        print(f"  [WARN] Search failed for '{query}': {e}")
        return []


def fetch_trending_github() -> list[dict]:
    """
    Fallback: fetch GitHub trending page via the unofficial API
    (no auth needed). Returns top 25 repos from today's trending.
    """
    url = "https://api.gitterapp.com/repositories?since=daily"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "antigravity-goldmine/1.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read())
            return [
                {
                    "name": r.get("full_name", r.get("name", "")),
                    "description": (r.get("description") or "")[:120],
                    "stars": r.get("stars", 0),
                    "language": r.get("language") or "—",
                    "topics": [],
                    "url": r.get("url", ""),
                    "pushed": "",
                }
                for r in data[:25]
            ]
    except Exception as e:
        print(f"  [INFO] Trending fallback failed: {e}")
        return []


def analyse_with_claude(repos_summary: str) -> str:
    if not ANTHROPIC_API_KEY:
        return "_Claude analysis unavailable — ANTHROPIC_API_KEY not set_"

    prompt = f"""You are @dreamer and @hugo combined — a creative venture architect with deep GitHub intelligence.

Today's GitHub landscape (trending + high-signal repos in AI/agent space):

{repos_summary}

Your task: Identify the TOP 5 monetisation opportunities for the Antigravity Agency based on these repos.

For each opportunity, provide:
- **Opportunity name** (punchy, 3-5 words)
- **The signal** (which repo/trend is it based on?)
- **The angle** (consulting gap, SaaS wrapper, educational content, tooling, or white-label?)
- **Revenue model** (one line)
- **Time-to-first-£** (realistic estimate)
- **Gravy Index** (1-10, where 10 = pure, aged, uncut gravy)

Be brutally honest. No fluff. Only flag opportunities where Antigravity has a real edge.
Format as clean markdown."""

    payload = json.dumps({
        "model": "claude-haiku-4-5-20251001",
        "max_tokens": 1200,
        "messages": [{"role": "user", "content": prompt}],
    }).encode()

    headers = {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
    }

    try:
        req = urllib.request.Request(
            "https://api.anthropic.com/v1/messages",
            data=payload,
            headers=headers,
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read())
            return result["content"][0]["text"]
    except Exception as e:
        return f"_Claude analysis failed: {e}_"


def main():
    if OUTPUT_FILE.exists() and not FORCE:
        print(f"[GOLDMINE] Already ran today ({TODAY}). Use --force to re-run.")
        print(f"[GOLDMINE] Cached: {OUTPUT_FILE}")
        return

    print(f"[GOLDMINE] @hugo + @dreamer scanning GitHub... {TODAY}\n")

    all_repos: list[dict] = []
    seen_names: set[str] = set()

    # Search by topic/keyword
    import urllib.parse
    for search in SEARCH_QUERIES:
        print(f"  Searching: {search['label']}...")
        repos = search_repos(search["q"], TOP_N_PER_QUERY)
        for r in repos:
            if r["name"] not in seen_names:
                seen_names.add(r["name"])
                all_repos.append(r)
        time.sleep(0.5)  # be polite

    # Trending fallback
    if len(all_repos) < 15:
        print("  Fetching trending repos (fallback)...")
        trending = fetch_trending_github()
        for r in trending:
            if r["name"] not in seen_names:
                seen_names.add(r["name"])
                all_repos.append(r)

    print(f"\n[GOLDMINE] Found {len(all_repos)} unique repos. Running analysis...\n")

    # Build summary for Claude
    repo_lines = []
    for r in all_repos[:40]:  # cap at 40 for token efficiency
        topics_str = ", ".join(r["topics"]) if r["topics"] else r["language"]
        repo_lines.append(
            f"- [{r['name']}]({r['url']}) ⭐{r['stars']:,} | {r['language']} | {topics_str}\n"
            f"  > {r['description'] or 'No description'}"
        )
    repos_summary = "\n".join(repo_lines)

    analysis = analyse_with_claude(repos_summary)

    # ── Build output markdown ─────────────────────────────────────────────────
    output = f"""# GITHUB GOLDMINE 🔍 {TODAY}
**@hugo + @dreamer | Jai.OS 5.0 | GitHub Intelligence**

---

## TODAY'S REPO SCAN ({len(all_repos)} repos across {len(SEARCH_QUERIES)} searches)

{repos_summary}

---

## 🤑 MONETISATION OPPORTUNITIES (Claude Analysis)

{analysis}

---
*Generated: {datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M')} UTC*
"""

    OUTPUT_FILE.write_text(output, encoding="utf-8")
    print(f"[GOLDMINE] Report saved → {OUTPUT_FILE}")

    # ── Top 3 signal for chatroom ─────────────────────────────────────────────
    top_3 = all_repos[:3]
    top_str = " | ".join([f"{r['name']} ⭐{r['stars']:,}" for r in top_3])

    chatroom_entry = f"""
---

### {TODAY} | GitHub Goldmine — @hugo

**@hugo:** GITHUB GOLDMINE READY — {TODAY}

**Top signals:** {top_str}

**{len(all_repos)} repos scanned** across AI agent, LLM, automation topics.
Full report: `.tmp/github_goldmine_{TODAY}.md`

**@dreamer:** Monetisation analysis complete. Top opportunities in the file. 🍖

"""
    with CHATROOM.open("a", encoding="utf-8") as f:
        f.write(chatroom_entry)

    print("[GOLDMINE] Broadcast posted to chatroom.md")
    print("[GOLDMINE] The vault is open. Repos decoded.")


if __name__ == "__main__":
    main()
