"""
research_engine.py — @scholar Deep Research Engine v2.0
========================================================
Jai.OS 5.0 | Real research with actual API calls.

Architecture:
  1. Brave Search API — web search for real-time information
  2. Firecrawl API — extract clean content from discovered URLs
  3. Anthropic Claude — synthesise findings into structured intelligence
  4. NotebookLM MCP — deep research via grounded, citation-backed analysis
  5. Supabase — store research outputs in the Shared Brain

Usage:
    python execution/research_engine.py "query" [--deep] [--notebooklm]
    python execution/research_engine.py "AI agent frameworks 2026" --deep
    python execution/research_engine.py "competitor analysis web agencies Leeds" --notebooklm

Modes:
    FAST  — Brave Search + Claude synthesis (30 seconds)
    DEEP  — Brave Search + Firecrawl extraction + Claude synthesis (2-3 minutes)
    NOTEBOOKLM — Passes sources to NotebookLM MCP for grounded analysis
"""
import os
import sys
import io
import json
import hashlib
import argparse
import requests
import subprocess
from datetime import datetime, timezone
from pathlib import Path

# Force UTF-8
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
if sys.stderr.encoding and sys.stderr.encoding.lower() != 'utf-8':
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# ── Config ────────────────────────────────────────────────────────────────────
BRAVE_API_KEY = os.getenv("BRAVE_SEARCH_API_KEY", "")
FIRECRAWL_API_KEY = os.getenv("FIRECRAWL_API_KEY", "")
ANTHROPIC_KEY = os.getenv("ANTHROPIC_API_KEY", "")
BRAIN_URL = os.getenv("ANTIGRAVITY_BRAIN_URL", "")
BRAIN_KEY = os.getenv("ANTIGRAVITY_BRAIN_SERVICE_ROLE_KEY",
                      os.getenv("ANTIGRAVITY_BRAIN_ANON_KEY", ""))

# Determine root based on environment
if os.name == 'nt':
    ROOT = Path(r"C:\Users\jonny\Desktop\JonnyAI_JaiOS_5.0")
else:
    ROOT = Path(__file__).parent.parent

RESEARCH_DIR = ROOT / ".agent" / "research"
RESEARCH_DIR.mkdir(parents=True, exist_ok=True)


# ═══════════════════════════════════════════════════════
# BRAVE SEARCH
# ═══════════════════════════════════════════════════════

def brave_search(query, count=10):
    """Search the web using Brave Search API."""
    if not BRAVE_API_KEY:
        print("  WARNING: No BRAVE_SEARCH_API_KEY — falling back to DuckDuckGo")
        return _duckduckgo_fallback(query, count)

    try:
        resp = requests.get(
            "https://api.search.brave.com/res/v1/web/search",
            headers={
                "Accept": "application/json",
                "Accept-Encoding": "gzip",
                "X-Subscription-Token": BRAVE_API_KEY
            },
            params={"q": query, "count": count},
            timeout=15
        )
        data = resp.json()
        results = []
        for r in data.get("web", {}).get("results", []):
            results.append({
                "title": r.get("title", ""),
                "url": r.get("url", ""),
                "description": r.get("description", ""),
                "age": r.get("age", "")
            })
        print(f"  Brave Search: {len(results)} results for '{query}'")
        return results
    except Exception as e:
        print(f"  ERROR: Brave Search failed: {e}")
        return _duckduckgo_fallback(query, count)


def _duckduckgo_fallback(query, count=10):
    """Fallback: use DuckDuckGo instant answer API."""
    try:
        resp = requests.get(
            "https://api.duckduckgo.com/",
            params={"q": query, "format": "json", "no_html": 1},
            timeout=10
        )
        data = resp.json()
        results = []
        for r in data.get("RelatedTopics", [])[:count]:
            if "FirstURL" in r:
                results.append({
                    "title": r.get("Text", "")[:100],
                    "url": r.get("FirstURL", ""),
                    "description": r.get("Text", ""),
                    "age": ""
                })
        print(f"  DuckDuckGo fallback: {len(results)} results")
        return results
    except Exception as e:
        print(f"  ERROR: DuckDuckGo fallback failed: {e}")
        return []


# ═══════════════════════════════════════════════════════
# FIRECRAWL — Content Extraction
# ═══════════════════════════════════════════════════════

def firecrawl_extract(url, max_chars=5000):
    """Extract clean content from a URL using Firecrawl API."""
    if not FIRECRAWL_API_KEY:
        print(f"  WARNING: No FIRECRAWL_API_KEY — skipping extraction for {url}")
        return None

    try:
        resp = requests.post(
            "https://api.firecrawl.dev/v1/scrape",
            headers={
                "Authorization": f"Bearer {FIRECRAWL_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "url": url,
                "formats": ["markdown"],
                "onlyMainContent": True
            },
            timeout=30
        )
        data = resp.json()
        if data.get("success"):
            content = data.get("data", {}).get("markdown", "")
            if len(content) > max_chars:
                content = content[:max_chars] + "\n\n[...truncated]"
            print(f"  Firecrawl: extracted {len(content)} chars from {url[:60]}")
            return content
        else:
            print(f"  Firecrawl error for {url}: {data.get('error', 'unknown')}")
            return None
    except Exception as e:
        print(f"  ERROR: Firecrawl failed for {url}: {e}")
        return None


# ═══════════════════════════════════════════════════════
# CLAUDE SYNTHESIS
# ═══════════════════════════════════════════════════════

def synthesise_research(query, search_results, extracted_content=None, mode="FAST"):
    """Synthesise research findings using Claude."""
    if not ANTHROPIC_KEY:
        print("  WARNING: No ANTHROPIC_API_KEY — returning raw results")
        return _format_raw_results(query, search_results)

    sources_block = "\n\n".join([
        f"**Source {i+1}: {r['title']}**\nURL: {r['url']}\nSummary: {r['description']}"
        for i, r in enumerate(search_results[:10])
    ])

    extraction_block = ""
    if extracted_content:
        extraction_block = "\n\n## Extracted Full Content\n\n"
        for url, content in extracted_content.items():
            if content:
                extraction_block += f"### From: {url}\n{content[:3000]}\n\n"

    try:
        resp = requests.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": ANTHROPIC_KEY,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json"
            },
            json={
                "model": "claude-haiku-4-5-20251001" if mode == "FAST" else "claude-sonnet-4-20250514",
                "max_tokens": 3000,
                "messages": [{
                    "role": "user",
                    "content": f"""You are @scholar (Dr. Elias Thorne), Deep Research Specialist for Antigravity Agency.

Research query: "{query}"
Mode: {mode}

## Search Results
{sources_block}
{extraction_block}

Produce a structured research brief:

1. **Executive Summary** (3-4 sentences — the answer)
2. **Key Findings** (5-8 bullet points with specific data/facts)
3. **Source Analysis** (which sources are most credible and why)
4. **Actionable Insights** (what Antigravity should DO with this information)
5. **Truth Score** (0-100, how confident are you in these findings)
6. **Gaps** (what's missing, what needs deeper investigation)

Be specific. Cite sources by number. No filler. If the data is weak, say so.
End with: "RESEARCH BRIEF COMPLETE — @scholar | Truth Score: X/100" """
                }]
            },
            timeout=60
        )
        data = resp.json()
        return data["content"][0]["text"]
    except Exception as e:
        print(f"  ERROR: Claude synthesis failed: {e}")
        return _format_raw_results(query, search_results)


def _format_raw_results(query, results):
    """Fallback: format raw search results."""
    output = f"# Research Brief: {query}\n\n"
    output += "_AI synthesis unavailable — raw results below_\n\n"
    for i, r in enumerate(results):
        output += f"{i+1}. **{r['title']}**\n   {r['url']}\n   {r['description']}\n\n"
    return output


# ═══════════════════════════════════════════════════════
# NOTEBOOKLM MCP INTEGRATION
# ═══════════════════════════════════════════════════════

def notebooklm_research(query, sources=None):
    """
    Pass research to NotebookLM via MCP for grounded, citation-backed analysis.

    NotebookLM MCP is available on Jonny's local machine via:
      notebooklm-mcp (pip install notebooklm-mcp)

    This function creates a research brief file that can be fed to NotebookLM,
    and if the MCP server is available, queries it directly.
    """
    print("  Preparing NotebookLM research brief...")

    # Build a research brief document for NotebookLM
    brief = f"""# Research Brief for NotebookLM
## Query: {query}
## Date: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}
## Prepared by: @scholar (Dr. Elias Thorne)

### Sources to Analyse
"""
    if sources:
        for i, s in enumerate(sources):
            brief += f"\n{i+1}. **{s.get('title', 'Untitled')}**\n"
            brief += f"   URL: {s.get('url', 'N/A')}\n"
            brief += f"   Summary: {s.get('description', 'N/A')}\n"

    brief += f"""
### Research Questions for NotebookLM
1. What are the most important findings across these sources?
2. Where do the sources agree and disagree?
3. What actionable insights can Antigravity extract?
4. What gaps exist in the current research?
5. Rate the overall quality and reliability of these sources.

### Instructions
Feed this brief and the source URLs into NotebookLM.
Use NotebookLM's grounding to verify claims against the actual source documents.
Generate a citation-backed analysis with specific page/section references.
"""

    # Save the brief for NotebookLM
    safe_query = "".join([c if c.isalnum() else "_" for c in query.lower()])[:50]
    brief_path = RESEARCH_DIR / f"notebooklm_brief_{safe_query}_{datetime.now().strftime('%Y%m%d')}.md"
    brief_path.write_text(brief, encoding="utf-8")
    print(f"  NotebookLM brief saved: {brief_path}")

    # Try to call NotebookLM MCP if available
    notebooklm_result = _try_notebooklm_mcp(query, sources)
    if notebooklm_result:
        return notebooklm_result

    return {
        "status": "BRIEF_READY",
        "brief_path": str(brief_path),
        "message": (
            "NotebookLM research brief prepared. "
            "Feed this file into NotebookLM for grounded analysis. "
            "If NotebookLM MCP is running locally, it will be queried automatically."
        )
    }


def _try_notebooklm_mcp(query, sources):
    """Try to call NotebookLM via MCP CLI if available."""
    # Check for local MCP CLI first (Windows)
    mcp_commands = []
    if os.name == 'nt':
        # Windows — check for notebooklm-mcp in Anaconda
        mcp_commands = [
            [r"C:\Users\jonny\Anaconda3\python.exe", "-m", "notebooklm_mcp"],
            ["notebooklm-mcp"],
        ]
    else:
        # Linux/CI — check for manus-mcp-cli
        mcp_commands = [
            ["manus-mcp-cli", "tool", "list", "--server", "notebooklm"],
        ]

    for cmd in mcp_commands:
        try:
            result = subprocess.run(
                cmd, capture_output=True, text=True, timeout=10
            )
            if result.returncode == 0:
                print(f"  NotebookLM MCP available via: {' '.join(cmd)}")

                # Build query
                source_urls = [s["url"] for s in (sources or []) if s.get("url")]
                input_data = json.dumps({
                    "query": query,
                    "sources": source_urls[:10]
                })

                # Try to call research tool
                if "manus-mcp-cli" in cmd[0]:
                    call_result = subprocess.run(
                        ["manus-mcp-cli", "tool", "call", "research",
                         "--server", "notebooklm", "--input", input_data],
                        capture_output=True, text=True, timeout=120
                    )
                else:
                    # Direct MCP call on Windows would need different approach
                    print("  NotebookLM MCP detected but direct call not implemented for this env")
                    return None

                if call_result.returncode == 0 and call_result.stdout:
                    print("  NotebookLM MCP query successful")
                    return {
                        "status": "NOTEBOOKLM_COMPLETE",
                        "result": call_result.stdout
                    }
        except (FileNotFoundError, subprocess.TimeoutExpired):
            continue
        except Exception as e:
            print(f"  NotebookLM MCP check failed: {e}")
            continue

    print("  NotebookLM MCP not available — brief saved for manual use")
    return None


# ═══════════════════════════════════════════════════════
# SUPABASE STORAGE
# ═══════════════════════════════════════════════════════

def store_research(query, mode, synthesis, sources, truth_score=None):
    """Store research output in Supabase and local file."""
    safe_query = "".join([c if c.isalnum() else "_" for c in query.lower()])[:50]
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")

    # Extract truth score from synthesis if not provided
    if truth_score is None:
        import re
        match = re.search(r"Truth Score[:\s]*(\d+)", synthesis)
        truth_score = int(match.group(1)) if match else 70

    # Local storage
    research_item = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "query": query,
        "mode": mode,
        "truth_score": truth_score,
        "synthesis": synthesis,
        "sources": sources,
        "agent": "@scholar",
        "engine_version": "2.0"
    }

    local_path = RESEARCH_DIR / f"{safe_query}_{timestamp}.json"
    local_path.write_text(json.dumps(research_item, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"  Research saved locally: {local_path}")

    # Supabase storage (post to chatroom as @scholar)
    if BRAIN_URL and BRAIN_KEY:
        try:
            summary = synthesis[:500] if len(synthesis) > 500 else synthesis
            requests.post(
                f"{BRAIN_URL}/rest/v1/chatroom",
                headers={
                    "apikey": BRAIN_KEY,
                    "Authorization": f"Bearer {BRAIN_KEY}",
                    "Content-Type": "application/json",
                    "Prefer": "return=minimal"
                },
                json={
                    "ai_source": "github-actions",
                    "agent_id": "scholar",
                    "message": f"[RESEARCH] {query}\n\nTruth Score: {truth_score}/100\n\n{summary}",
                    "message_type": "chat"
                },
                timeout=10
            )
            print("  Research posted to chatroom")
        except Exception as e:
            print(f"  WARNING: Could not post to chatroom: {e}")

    return local_path


# ═══════════════════════════════════════════════════════
# GITHUB ACTION CRON ENTRY POINT
# ═══════════════════════════════════════════════════════

def daily_research_cron():
    """
    Called by GitHub Actions daily. Runs a set of standing research queries
    that keep the Antigravity team informed about their key domains.
    """
    standing_queries = [
        "AI agent frameworks and multi-agent orchestration latest developments",
        "web design agency trends UK small business 2026",
        "dropshipping automation tools and platforms 2026",
        "no-code AI tools for small businesses",
        "social media automation AI content generation trends",
    ]

    print(f"[SCHOLAR] Daily Research Cron — {datetime.now(timezone.utc).strftime('%Y-%m-%d')}")
    print(f"Running {len(standing_queries)} standing queries...\n")

    for i, query in enumerate(standing_queries):
        print(f"\n--- Query {i+1}/{len(standing_queries)} ---")
        try:
            research_pipeline(query, deep=False, use_notebooklm=False)
        except Exception as e:
            print(f"  ERROR on query '{query}': {e}")

    print("\n[SCHOLAR] Daily research cron complete.")


# ═══════════════════════════════════════════════════════
# MAIN PIPELINE
# ═══════════════════════════════════════════════════════

def research_pipeline(query, deep=False, use_notebooklm=False):
    """Run the full research pipeline."""
    mode = "DEEP" if deep else "FAST"
    if use_notebooklm:
        mode = "NOTEBOOKLM"

    print(f"\n{'='*60}")
    print(f"  @scholar — RESEARCH ENGINE v2.0")
    print(f"  Query: {query}")
    print(f"  Mode: {mode}")
    print(f"  Time: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}")
    print(f"{'='*60}\n")

    # Step 1: Search
    print("Step 1: Web Search...")
    results = brave_search(query, count=10 if not deep else 20)
    if not results:
        print("  No search results found. Aborting.")
        return None

    # Step 2: Extract (DEEP mode only)
    extracted = {}
    if deep and results:
        print("\nStep 2: Deep Content Extraction...")
        for r in results[:5]:
            url = r.get("url", "")
            if url and not any(skip in url for skip in ["youtube.com", "twitter.com", "x.com", "reddit.com"]):
                content = firecrawl_extract(url)
                if content:
                    extracted[url] = content
        print(f"  Extracted content from {len(extracted)} sources")
    else:
        print("\nStep 2: Skipped (FAST mode)")

    # Step 3: NotebookLM (if requested)
    notebooklm_result = None
    if use_notebooklm:
        print("\nStep 3: NotebookLM Integration...")
        notebooklm_result = notebooklm_research(query, results)
    else:
        print("\nStep 3: Skipped (NotebookLM not requested)")

    # Step 4: Synthesise
    print("\nStep 4: Claude Synthesis...")
    synthesis = synthesise_research(query, results, extracted if deep else None, mode)
    print(f"  Synthesis: {len(synthesis)} chars")

    # Step 5: Store
    print("\nStep 5: Storing Research...")
    local_path = store_research(query, mode, synthesis, results)

    # Output
    print(f"\n{'='*60}")
    print(f"  RESEARCH COMPLETE")
    print(f"  Saved to: {local_path}")
    if notebooklm_result and notebooklm_result.get("brief_path"):
        print(f"  NotebookLM brief: {notebooklm_result['brief_path']}")
    print(f"{'='*60}\n")

    print(synthesis)
    return str(local_path)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="@scholar Deep Research Engine v2.0")
    parser.add_argument("query", nargs="?", help="Research query")
    parser.add_argument("--deep", action="store_true", help="Enable deep mode (Firecrawl extraction)")
    parser.add_argument("--notebooklm", action="store_true", help="Enable NotebookLM integration")
    parser.add_argument("--daily-cron", action="store_true", help="Run daily standing queries")
    args = parser.parse_args()

    if args.daily_cron:
        daily_research_cron()
    elif args.query:
        research_pipeline(args.query, deep=args.deep, use_notebooklm=args.notebooklm)
    else:
        print("Usage: python research_engine.py 'query' [--deep] [--notebooklm]")
        print("       python research_engine.py --daily-cron")
        sys.exit(1)
