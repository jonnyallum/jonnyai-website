"""
Agent Router v2.0 — Auto-dispatch tasks to the best agent(s) based on routing metadata.

Reads all agent YAML frontmatter, scores each agent against a task description,
and returns a ranked list of recommended agents.

Fixes applied (Jai.OS 5.0 test gaps R1-R5):
  - R1: Added video/media/voice/audio triggers for @carlos, @eleven, etc.
  - R2: Added blog/content triggers for @contentforge
  - R3: Low-confidence warning when top score < 10
  - R4: Malformed tier cleanup during parsing
  - R5: Comprehensive stopword filter for description matching

Usage:
  python execution/agent_router.py "Build a React component for the dashboard"
  python execution/agent_router.py "Create a social media video" --top 3
  python execution/agent_router.py "Write SEO-optimized blog content" --json
  python execution/agent_router.py "Fix the betting odds scraper" --domain betting
"""

import argparse
import json
import re
import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
from pathlib import Path
from collections import defaultdict

ROOT_DIR = Path(__file__).parent.parent
SKILLS_DIR = ROOT_DIR / ".agent" / "skills"

# R5: Comprehensive stopword filter — common English words that create noise in matching
STOPWORDS = {
    "the", "a", "an", "and", "or", "for", "to", "in", "of", "is", "it", "on",
    "at", "by", "as", "be", "do", "if", "no", "so", "up", "we", "he", "she",
    "my", "me", "am", "are", "was", "has", "had", "not", "but", "all", "can",
    "her", "his", "its", "our", "out", "own", "who", "how", "did", "get", "got",
    "may", "new", "now", "old", "see", "way", "day", "too", "use", "any", "few",
    "let", "put", "say", "set", "try", "why", "big", "end", "far", "run", "top",
    "with", "from", "this", "that", "they", "them", "then", "than", "what", "when",
    "will", "been", "have", "each", "make", "like", "long", "look", "many", "most",
    "over", "such", "take", "come", "made", "find", "here", "know", "last", "more",
    "much", "must", "name", "only", "part", "some", "time", "very", "your", "also",
    "back", "been", "call", "down", "even", "give", "good", "high", "just", "keep",
    "into", "work", "year", "well", "about", "after", "could", "every", "first",
    "great", "never", "other", "right", "shall", "since", "still", "their", "there",
    "these", "thing", "those", "under", "where", "which", "while", "world", "would",
    "should", "through", "before", "between", "because", "through",
    "&", "—", "-", "–", "|", "/", "\\", "+", "=", "@", "#", "$", "%",
    "specialist", "expert", "architect", "lead", "engineer", "manager", "agent",
    "system", "systems", "based", "using", "across", "ensures", "including",
    "focused", "driven", "level", "class", "world", "full", "stack",
}

# R1: Supplementary trigger keywords for agents whose YAML triggers are incomplete
# These are injected during scoring to ensure correct routing
SUPPLEMENTARY_TRIGGERS = {
    "carlos": ["video", "videos", "short-form", "reels", "tiktok", "youtube", "shorts",
               "motion", "animation", "edit", "editing", "footage", "clip", "clips",
               "viral", "retention", "hook", "thumbnail"],
    "eleven": ["voice", "voiceover", "voice-over", "narration", "narrate", "narrator",
               "audio", "speech", "tts", "text-to-speech", "elevenlabs", "voice clone",
               "voice cloning", "podcast", "sound", "spoken", "wav", "mp3"],
    "contentforge": ["blog", "blogs", "blogging", "article", "articles", "copy",
                     "copywriting", "content", "social media", "social post", "caption",
                     "newsletter", "email copy", "headline", "tagline", "slogan",
                     "content strategy", "editorial", "writing"],
    "vivienne": ["design", "ui", "ux", "ui/ux", "wireframe", "mockup", "prototype",
                 "figma", "layout", "visual", "branding", "logo", "graphic", "graphics",
                 "landing page", "homepage"],
    "priya": ["animation", "motion graphics", "lottie", "svg animation", "micro-interaction",
              "animated", "transition", "parallax"],
    "maya": ["image", "images", "photo", "photography", "illustration", "midjourney",
             "dall-e", "stable diffusion", "ai image", "generate image", "visual asset"],
    "sam": ["security", "audit", "penetration test", "pentest", "vulnerability",
            "owasp", "security scan", "hardening", "firewall", "ssl", "tls"],
    "diana": ["database", "migration", "schema", "sql", "postgres", "supabase",
              "query", "index", "table", "rls", "row level security"],
    "nathan": ["seo", "search engine", "keywords", "ranking", "serp", "backlinks",
               "meta tags", "sitemap", "google search", "organic traffic"],
    "hannah": ["analytics", "tracking", "metrics", "dashboard", "kpi", "conversion",
               "funnel", "google analytics", "ga4", "data analysis", "report"],
    "boyce": ["client", "customer", "onboarding", "relationship", "account",
              "stakeholder", "proposal", "pitch", "presentation"],
}

# R3: Low confidence threshold
LOW_CONFIDENCE_THRESHOLD = 10


def clean_tier(tier_str):
    """R4: Clean malformed tier values from YAML parsing."""
    if not tier_str:
        return "unknown"
    # Remove common parsing artifacts
    cleaned = re.sub(r'[^a-zA-Z0-9\s\-_]', '', tier_str).strip()
    # Remove trailing artifacts like "str)" or "type)"
    cleaned = re.sub(r'\s*(str|type|int|float)\)?\s*$', '', cleaned, flags=re.IGNORECASE).strip()
    return cleaned if cleaned else "unknown"


def load_all_agents():
    """Load all agent routing metadata from YAML frontmatter."""
    agents = []
    for d in sorted(SKILLS_DIR.iterdir()):
        if not d.is_dir() or d.name == "methodology":
            continue
        skill_file = d / "SKILL.md"
        if not skill_file.exists():
            continue

        content = skill_file.read_text(encoding='utf-8')
        match = re.match(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
        if not match:
            continue

        yaml_text = match.group(1)

        # Parse key fields
        agent = {
            "id": d.name,
            "name": "",
            "description": "",
            "tier": "",
            "version": "1.0.0",
            "routing": {
                "input_types": [],
                "output_types": [],
                "cost_tier": "medium",
                "latency_tier": "medium",
                "domains": [],
                "triggers": [],
            },
            "fallback_chain": [],
        }

        # Extract simple fields
        for field in ["name", "description", "tier", "version"]:
            m = re.search(rf'{field}:\s*(.+)', yaml_text)
            if m:
                val = m.group(1).strip()
                if field == "tier":
                    val = clean_tier(val)  # R4: Clean malformed tiers
                agent[field] = val

        # Extract routing block
        routing_match = re.search(r'routing:\s*\n((?:\s+.+\n)*)', yaml_text)
        if routing_match:
            routing_block = routing_match.group(1)
            for rfield in ["input_types", "output_types", "domains", "triggers"]:
                rm = re.search(rf'{rfield}:\s*(\[.+?\])', routing_block)
                if rm:
                    try:
                        agent["routing"][rfield] = json.loads(rm.group(1))
                    except json.JSONDecodeError:
                        pass
            for rfield in ["cost_tier", "latency_tier"]:
                rm = re.search(rf'{rfield}:\s*(\S+)', routing_block)
                if rm:
                    agent["routing"][rfield] = rm.group(1)

        # R1: Inject supplementary triggers for agents with incomplete YAML triggers
        if agent["id"] in SUPPLEMENTARY_TRIGGERS:
            existing = set(t.lower() for t in agent["routing"].get("triggers", []))
            for trigger in SUPPLEMENTARY_TRIGGERS[agent["id"]]:
                if trigger.lower() not in existing:
                    agent["routing"]["triggers"].append(trigger)

        # Extract fallback chain
        fb_match = re.search(r'fallback_chain:\s*(\[.+?\])', yaml_text)
        if fb_match:
            try:
                agent["fallback_chain"] = json.loads(fb_match.group(1))
            except json.JSONDecodeError:
                pass

        # Extract human name from content
        name_match = re.search(r'#\s+(.+?)\s*-\s*Agent Profile', content)
        if name_match:
            agent["human_name"] = name_match.group(1).strip()
        else:
            agent["human_name"] = agent["name"]

        agents.append(agent)

    return agents


def score_agent(agent, task_text, domain_filter=None):
    """Score an agent's relevance to a task. Returns (score, reasons)."""
    score = 0
    reasons = []
    task_lower = task_text.lower()
    routing = agent["routing"]

    # Domain filter (hard constraint)
    if domain_filter:
        if domain_filter.lower() not in [d.lower() for d in routing.get("domains", [])]:
            return -1, ["Domain filter mismatch"]

    # Trigger keyword matching (highest weight)
    # Support multi-word triggers by checking substring match
    for trigger in routing.get("triggers", []):
        trigger_lower = trigger.lower()
        if trigger_lower in task_lower:
            score += 10
            reasons.append(f"Trigger match: '{trigger}'")

    # Domain matching
    for domain in routing.get("domains", []):
        domain_lower = domain.lower()
        if domain_lower in task_lower:
            score += 7
            reasons.append(f"Domain match: '{domain}'")

    # Description keyword matching with R5 stopword filter
    desc_words = set(agent.get("description", "").lower().split())
    task_words = set(task_lower.split())
    meaningful_overlap = (desc_words & task_words) - STOPWORDS
    if meaningful_overlap:
        score += len(meaningful_overlap) * 3
        reasons.append(f"Description overlap: {', '.join(sorted(meaningful_overlap))}")

    # Cost/latency preference (slight bonus for efficient agents)
    if routing.get("cost_tier") == "low":
        score += 1
    if routing.get("latency_tier") == "fast":
        score += 1

    return score, reasons


def route_task(task_text, top_n=5, domain_filter=None, output_json=False):
    """Route a task to the best agent(s)."""
    agents = load_all_agents()

    if not agents:
        print("ERROR: No agents found.")
        return

    # Score all agents
    scored = []
    for agent in agents:
        score, reasons = score_agent(agent, task_text, domain_filter)
        if score >= 0:
            scored.append((score, agent, reasons))

    # Sort by score descending
    scored.sort(key=lambda x: x[0], reverse=True)

    # Take top N
    top = scored[:top_n]

    # R3: Determine confidence level
    top_score = top[0][0] if top else 0
    low_confidence = top_score < LOW_CONFIDENCE_THRESHOLD

    if output_json:
        result = {
            "task": task_text,
            "confidence": "low" if low_confidence else "high",
            "top_score": top_score,
            "recommendations": [],
        }
        for score, agent, reasons in top:
            result["recommendations"].append({
                "agent": agent["name"],
                "id": agent["id"],
                "human_name": agent.get("human_name", ""),
                "score": score,
                "tier": agent["tier"],
                "description": agent["description"],
                "domains": agent["routing"].get("domains", []),
                "cost_tier": agent["routing"].get("cost_tier", ""),
                "latency_tier": agent["routing"].get("latency_tier", ""),
                "fallback_chain": agent.get("fallback_chain", []),
                "reasons": reasons,
            })
        if low_confidence:
            result["warning"] = (
                f"LOW CONFIDENCE: Top score is {top_score} (threshold: {LOW_CONFIDENCE_THRESHOLD}). "
                "Consider refining the task description or manually assigning an agent."
            )
        print(json.dumps(result, indent=2))
    else:
        print(f"\n🎯 Task: \"{task_text}\"")
        if domain_filter:
            print(f"📁 Domain filter: {domain_filter}")

        # R3: Low confidence warning
        if low_confidence:
            print(f"\n⚠️  LOW CONFIDENCE (top score: {top_score}, threshold: {LOW_CONFIDENCE_THRESHOLD})")
            print("   The task description may be too vague or no agent has matching triggers.")
            print("   Consider refining the task or manually assigning an agent.\n")

        print(f"{'='*60}\n")

        for i, (score, agent, reasons) in enumerate(top):
            rank = i + 1
            marker = "🥇" if rank == 1 else "🥈" if rank == 2 else "🥉" if rank == 3 else f"#{rank}"
            print(f"  {marker} {agent['name']} ({agent.get('human_name', '')})")
            print(f"     Score: {score} | Tier: {agent['tier']} | Cost: {agent['routing'].get('cost_tier', '?')} | Speed: {agent['routing'].get('latency_tier', '?')}")
            print(f"     Domains: {', '.join(agent['routing'].get('domains', ['?']))}")
            if reasons:
                print(f"     Why: {'; '.join(reasons[:5])}")
            if agent.get("fallback_chain"):
                print(f"     Fallback: {' → '.join(agent['fallback_chain'])}")
            print()

        # Summary
        if top and top[0][0] > 0:
            best = top[0][1]
            print(f"{'='*60}")
            confidence_label = "⚠️ LOW CONFIDENCE" if low_confidence else "✅ HIGH CONFIDENCE"
            print(f"{confidence_label} — RECOMMENDED: Route to {best['name']} ({best.get('human_name', '')})")
            if best.get("fallback_chain"):
                print(f"   Fallback chain: {' → '.join(best['fallback_chain'])}")
        elif top:
            print(f"{'='*60}")
            print("❌ NO MATCH — No agent scored above 0. Manual assignment required.")


def main():
    parser = argparse.ArgumentParser(description="Route a task to the best agent(s)")
    parser.add_argument("task", help="Task description to route")
    parser.add_argument("--top", type=int, default=5, help="Number of top agents to show")
    parser.add_argument("--domain", help="Filter to a specific domain")
    parser.add_argument("--json", action="store_true", help="Output as JSON")
    args = parser.parse_args()

    route_task(args.task, args.top, args.domain, args.json)


if __name__ == "__main__":
    main()
