"""
social_engine.py — Antigravity Social Media Engine v2.5 'Professional Series'
========================================================================
Jai.OS 5.0 | The Hive Mind Marketing Engine

Upgrades in v2.5:
  1. Automated Staggering: Prevents 'batch-posting' (3-hour guard window).
  2. Aggressive Sanitisation: Total removal of LLM markers (//, json keys, **).
  3. Marketing-First Delegation: High-impact specialized agents (@Boyce, @Elena, @Theo).
  4. UK English Mandate: Strict British spelling and formatting.
  5. Cinematic Visuals: Expanded pool of high-gloss brand assets.
  6. Contextual Intelligence: Fuses project data with recent post history.
"""

import os
import sys
import json
import hashlib
import re
from datetime import datetime, timezone, timedelta
from pathlib import Path

# Fix Windows cp1252 encoding crash with emoji
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# ═══════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════

BRAIN_URL = os.getenv("ANTIGRAVITY_BRAIN_URL", "")
BRAIN_KEY = os.getenv("ANTIGRAVITY_BRAIN_ANON_KEY", os.getenv("ANTIGRAVITY_BRAIN_SERVICE_ROLE_KEY", ""))

STAGGER_WINDOW_HOURS = 3 # Minimum time between any two posts

# ═══════════════════════════════════════════════════════
# TRIGGER MAP — 10 Pillars
# ═══════════════════════════════════════════════════════

TRIGGER_MAP = {
    "[MISSION]":        "MISSION_COMPLETE",
    "[MILESTONE]":      "MISSION_COMPLETE",
    "[WIN]":            "MISSION_COMPLETE",
    "[LAUNCH]":         "MISSION_COMPLETE",
    "[INFRASTRUCTURE]": "INFRASTRUCTURE_UPGRADE",
    "[UPGRADE]":        "INFRASTRUCTURE_UPGRADE",
    "[INSIGHT]":        "TRILLION_DOLLAR_INSIGHT",
    "[RESEARCH]":       "TRILLION_DOLLAR_INSIGHT",
    "[AGENT]":          "AGENT_SPOTLIGHT",
    "[ACADEMY]":        "ACADEMY_UPDATE",
    "[COLLAB]":         "COLLAB",
    "[CLIENT_WIN]":     "CLIENT_CASE_STUDY",
    "[BTS]":            "BEHIND_THE_SCENES",
    "[TIP]":            "EDUCATION_TIP",
    "[POLL]":           "ENGAGEMENT_POLL",
    "[CULTURE]":        "TEAM_CULTURE",
    "[REPORT]":         "CLIENT_REPORT_TEASER",
    "[PROJECT]":        "NEW_PROJECT_ANNOUNCEMENT",
    "[DEPLOY]":         "WEBSITE_DEPLOYMENT",
    "[WEBSITE]":        "WEBSITE_DEPLOYMENT",
    "[TEAM]":           "TEAM_UPDATE",
    "[BLOG]":           "BLOG_GENERATION",
    "[REEL]":           "REEL_PRODUCTION",
    "[VIDEO]":          "REEL_PRODUCTION",
}

# ═══════════════════════════════════════════════════════
# DELEGATION ROUTING — Specialized Marketing Tones
# ═══════════════════════════════════════════════════════

DELEGATION_MAP = {
    "MISSION_COMPLETE":       {"agent": "boyce",    "model": "claude-haiku-4-5-20251001", "voice": "sales-oriented-outcomes"},
    "INFRASTRUCTURE_UPGRADE": {"agent": "theo",     "model": "claude-haiku-4-5-20251001", "voice": "engineering-excellence"},
    "TRILLION_DOLLAR_INSIGHT":{"agent": "scholar",  "model": "claude-haiku-4-5-20251001", "voice": "contrarian-marketing"},
    "AGENT_SPOTLIGHT":        {"agent": "priya",    "model": "claude-haiku-4-5-20251001", "voice": "cinematic-persona"},
    "ACADEMY_UPDATE":         {"agent": "elena",    "model": "claude-haiku-4-5-20251001", "voice": "exclusive-educational"},
    "CLIENT_CASE_STUDY":      {"agent": "boyce",    "model": "claude-haiku-4-5-20251001", "voice": "social-proof-dominant"},
    "BEHIND_THE_SCENES":      {"agent": "elena",    "model": "claude-haiku-4-5-20251001", "voice": "strategic-transparency"},
    "EDUCATION_TIP":          {"agent": "grace",    "model": "claude-haiku-4-5-20251001", "voice": "seo-value-add"},
    "ENGAGEMENT_POLL":        {"agent": "hannah",   "model": "claude-haiku-4-5-20251001", "voice": "conversational-lead-gen"},
    "TEAM_CULTURE":           {"agent": "vivienne", "model": "claude-haiku-4-5-20251001", "voice": "brand-identity-focus"},
    "CLIENT_REPORT_TEASER":   {"agent": "boyce",    "model": "claude-haiku-4-5-20251001", "voice": "high-trust-professional"},
    "NEW_PROJECT_ANNOUNCEMENT":{"agent": "boyce",    "model": "claude-haiku-4-5-20251001", "voice": "growth-velocity"},
    "WEBSITE_DEPLOYMENT":      {"agent": "priya",    "model": "claude-haiku-4-5-20251001", "voice": "design-polish-launch"},
    "TEAM_UPDATE":             {"agent": "marcus",   "model": "claude-haiku-4-5-20251001", "voice": "visionary-leadership"},
    "BLOG_GENERATION":         {"agent": "elena",    "model": "claude-haiku-4-5-20251001", "voice": "thought-leadership"},
}

# ═══════════════════════════════════════════════════════
# PILLAR PROMPTS — God-Tier Marketing Standard
# ═══════════════════════════════════════════════════════

PILLAR_PROMPTS = {
    "MISSION_COMPLETE": """You are @boyce, Antigravity's Sales and Growth Specialist. Produce a 'God-Tier' marketing asset. Turn technical completion into business growth. Detail the impact (e.g., 'Unlocked 4x operational speed' rather than 'Fixed server'). Every word must build the brand as elite tier.
Facebook: 300-450 words. Problem -> Orchestration -> Dominant Result. End with jonnyai.co.uk
Instagram: 120-180 words. High-impact stats. 15 hashtags.
LinkedIn: 400-600 words. Strategic narrative.""",

    "INFRASTRUCTURE_UPGRADE": """You are @theo, Systems Architect. Produce a high-grade technical marketing asset. DO NOT summarise. Explain the IMPACT (Zero latency, infinite scale, hardened security). stack = competitive advantage.
Facebook: 300-500 words. Deep technical dive. Impact-led. End with jonnyai.co.uk
Instagram: 120-180 words. stats + the 'why'. 15 hashtags.
LinkedIn: 400-600 words. Institutional engineering narrative.""",

    "TRILLION_DOLLAR_INSIGHT": """You are @scholar, Research Lead. Produce provocative brand-building insight. Challenge industry status quo. Every insight must make Antigravity look like the only team that truly 'gets it'.
Facebook: 200-300 words. Hook -> Evidence -> The Antigravity Way.
Instagram: 100-150 words. Bold statement. 15 hashtags.
LinkedIn: 350-500 words. Thought-leadership paper.""",

    "AGENT_SPOTLIGHT": """You are @priya, Visionary Designer. Produce cinematic character reveal. CHARACTERS NOT CAPABILITIES: elite specialist tone, nicknames, energy. NO tool names, NO system counts. Movie trailer vibe.
Facebook: 150-250 words. Character profile + Mystique. End with jonnyai.co.uk
Instagram: 80-120 words. One killer detail. 12 hashtags.
LinkedIn: 200-300 words. 'Strategic Asset Reveal'.""",

    "ACADEMY_UPDATE": """You are @elena, Strategic Content Lead. Market Academy as elite/exclusive. Frame as 'Intelligence Upgrade'. secret knowledge.
Facebook: 200-300 words. Value-prop -> Exclusive access -> CTA.
Instagram: 100-150 words. 'Unlock this' framing. 15 hashtags.
LinkedIn: 300-450 words. Professional development.""",

    "CLIENT_CASE_STUDY": """You are @boyce. Produce high-conversion social proof. Lead with massive win. Translate 'effort' into 'Profit/Time/Velocity'. Call for application.
Facebook: 300-450 words. Narrative: Bottleneck -> Intervention -> Dominance.
Instagram: 120-180 words. Before/After impact. 15 hashtags.
LinkedIn: 400-600 words. Board-level case study.""",

    "BEHIND_THE_SCENES": """You are @elena. Strategic transparency. Show the 'Nerve Center' in action. Frame work as 'Precision Engineering'. Insider feel.
Facebook: 200-350 words. Storytelling format.
Instagram: 100-150 words. Raw moment + brand takeaway. 15 hashtags.
LinkedIn: 250-400 words. 'Tuesday in the Hive'.""",

    "EDUCATION_TIP": """You are @grace. Provide brand-building technical tip. 'Secret Sauce' or 'The Antigravity Way' framing.
Facebook: 200-300 words. Tip -> Logic -> Impact.
Instagram: 100-150 words. Step-by-step masterclass. 15 hashtags.
LinkedIn: 300-450 words. Strategic advisory.""",

    "ENGAGEMENT_POLL": """You are @hannah. Start conversation that markets domain expertise. Force choice between strategies. sentiment analysis framing.
Facebook: 80-150 words. Question + Context + Call to comment.
Instagram: 60-100 words. choice poll. 10 hashtags.
LinkedIn: 150-250 words. B2B sentiment analysis.""",

    "TEAM_CULTURE": """You are @vivienne. Showcase 'Soul of the Orchestra'. Synergy humans/machines. growth = 'Scaling Hive Mind'.
Facebook: 150-250 words. Human stories + Vision.
Instagram: 100-120 words. professional team moment. 15 hashtags.
LinkedIn: 250-400 words. Culture = competitive advantage.""",
}

# ═══════════════════════════════════════════════════════
# UNIVERSAL DOCTRINE & PROTECTION
# ═══════════════════════════════════════════════════════

MARKETING_DOCTRINE = """
CRITICAL — CHARACTERS NOT CAPABILITIES DOCTRINE:
You are a WORLD-CLASS MARKETING TEAM. You MUST follow these rules:
1. NEVER mention internal tools/tech names (Supabase, Playwright, FFmpeg, n8n, Vercel, Next.js, etc.).
2. NEVER mention technical methods or API details. Show RESULTS, hide METHODS.
3. UK ENGLISH MANDATE: Use British spelling (optimise, standardise, centre, programme, colour).
4. FORMATTING FORBIDDEN: NEVER use markdown bold (**), italics (_), or headers (###).
5. PURE HUMAN TEXT: No internal comments, no JSON keys in text, no machine-speak.
6. CONTEXT PRESERVATION: If specific systems are mentioned (GCP VM, Telegram Bot, JaiOS CRM), explain their IMPACT on growth and velocity.
"""

# Technical terms that must NEVER appear in social content
BANNED_TERMS = [
    "supabase", "playwright", "n8n", "vercel", "nextjs", "ffmpeg", "docker", "github",
    "python", "javascript", "model", "prompt", "api", "webhook", "orchestra count",
    "internal", "logic", "agent engine", "ai unit", "json", "markdown"
]

def quality_gate(copy: dict, pillar: str, recent_hashes: set) -> dict:
    issues = []
    score = 100
    for platform, text in copy.items():
        if not text or len(text) < 20:
            issues.append(f"{platform}: Empty or too short")
            score -= 30
            continue
        text_lower = text.lower()
        for term in BANNED_TERMS:
            if term in text_lower:
                issues.append(f"{platform}: DOCTRINE VIOLATION - term '{term}' detected")
                score -= 25
        if re.search(r'\*\*|###|_', text):
            issues.append(f"{platform}: FORMATTING VIOLATION - markdown markers detected")
            score -= 20
        if re.search(r'//|\{', text):
            issues.append(f"{platform}: ARTIFACT VIOLATION - leaking machine code")
            score -= 40
    
    content_hash = hashlib.md5((copy.get("facebook","") + copy.get("instagram","")).encode()).hexdigest()[:16]
    if content_hash in recent_hashes:
        issues.append("DUPLICATE detected")
        score -= 50
    return {"passed": score >= 60, "score": score, "issues": issues, "content_hash": content_hash}

# ═══════════════════════════════════════════════════════
# ENGINE CLASS
# ═══════════════════════════════════════════════════════

class SocialEngine:
    def __init__(self):
        self._anthropic = None
        self._supabase_headers = {"apikey": BRAIN_KEY, "Authorization": f"Bearer {BRAIN_KEY}", "Content-Type": "application/json"}

    def _query_brain(self, endpoint, params=None):
        if not BRAIN_URL: return []
        import requests
        try:
            resp = requests.get(f"{BRAIN_URL}/rest/v1/{endpoint}", headers=self._supabase_headers, params=params, timeout=8)
            return resp.json() if resp.status_code == 200 else []
        except: return []

    def _insert_brain(self, endpoint, data):
        if not BRAIN_URL: return False
        import requests
        try:
            resp = requests.post(f"{BRAIN_URL}/rest/v1/{endpoint}", headers={**self._supabase_headers, "Prefer": "return=minimal"}, json=data, timeout=8)
            return resp.status_code in (200, 201, 204)
        except: return False

    def generate_copy(self, message: str, pillar: str, project_id: str = None) -> dict:
        delegation = DELEGATION_MAP.get(pillar, DELEGATION_MAP["MISSION_COMPLETE"])
        prompt = PILLAR_PROMPTS.get(pillar, PILLAR_PROMPTS["MISSION_COMPLETE"])
        system_msg = f"{prompt}\n\n{MARKETING_DOCTRINE}"
        user_content = f"Transform this internal event into elite marketing: {message}"
        
        try:
            import anthropic
            client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
            resp = client.messages.create(
                model=delegation["model"],
                max_tokens=1500,
                system=system_msg,
                messages=[{"role": "user", "content": user_content}]
            )
            text = resp.content[0].text.strip()
            # Robust JSON extraction
            match = re.search(r'(\{.*\})', text, re.DOTALL)
            if match:
                text = match.group(1)
            copy = json.loads(text)
            for k in copy: copy[k] = self._clean_text(copy[k])
            return copy
        except Exception as e:
            print(f"Generation error: {e}")
            return {"facebook": message, "instagram": message, "linkedin": message}

    def _clean_text(self, text):
        # Remove bold, headers, comments
        text = re.sub(r'\*\*|__', '', text)
        text = re.sub(r'#+\s*', '', text)
        text = re.sub(r'//.*', '', text)
        text = re.sub(r'\n{3,}', '\n\n', text)
        return text.strip()

    def process_trigger(self, message: str, source_agent: str, project_id: str = None, dry_run: bool = False):
        tag, pillar = None, None
        for t, p in TRIGGER_MAP.items():
            if t in message: tag, pillar = t, p; break
        if not pillar: return {"status": "NO_TRIGGER"}

        # 1. Staggering Check
        is_staggered, next_slot = self._check_staggering()
        if is_staggered and not dry_run:
            print(f"📦 Channel Busy -> Staggering for {STAGGER_WINDOW_HOURS}h gap to: {next_slot}")
            return self._queue_staggered(message, pillar, source_agent, project_id, next_slot)

        # 2. Proceed to Live
        print(f"🚀 Processing {pillar} (Live)...")
        copy = self.generate_copy(message, pillar, project_id)
        
        # 3. Quality
        recent = self._query_brain("social_posts", {"select": "content_hash", "limit": "20"})
        hashes = {r['content_hash'] for r in recent if 'content_hash' in r}
        qg = quality_gate(copy, pillar, hashes)
        if not qg['passed']:
            print(f"❌ Blocked by Quality Gate: {qg['issues']}")
            return {"status": "BLOCKED", "issues": qg['issues']}

        if dry_run: return {"status": "DRY_RUN", "copy": copy}

        # 4. Image
        from image_rotator import get_image_for_post
        image_url = get_image_for_post(pillar, message, source_agent, BRAIN_URL, BRAIN_KEY)

        # 5. Publish
        sys.path.insert(0, str(Path(__file__).parent))
        import facebook_publisher as fp
        res = {"facebook": "LIVE" if fp.post_to_facebook(copy['facebook'], image_url) else "FAILED"}
        if copy.get('instagram'):
            res["instagram"] = "LIVE" if fp.post_to_instagram(image_url, copy['instagram']) else "FAILED"
        
        # 6. Log
        self._insert_brain("social_posts", {
            "pillar": pillar, "facebook_copy": copy['facebook'], "instagram_copy": copy.get('instagram'),
            "image_url": image_url, "content_hash": qg['content_hash'], "status": "published",
            "source_agent": source_agent, "project_context": project_id
        })
        return {"status": "PUBLISHED", "results": res}

    def _check_staggering(self):
        now = datetime.now(timezone.utc)
        win_start = (now - timedelta(hours=STAGGER_WINDOW_HOURS)).isoformat()
        recent = self._query_brain("social_posts", {"created_at": f"gte.{win_start}", "limit": "1"})
        upcoming = self._query_brain("content_calendar", {"status": "eq.scheduled", "scheduled_for": f"gte.{now.isoformat()}", "limit": "1"})
        
        if not recent and not upcoming: return False, None
        
        # Calculate next gap
        last_time = now
        scheduled = self._query_brain("content_calendar", {"status": "eq.scheduled", "order": "scheduled_for.desc", "limit": "1"})
        if scheduled: 
            ts = scheduled[0]['scheduled_for'].replace('Z', '+00:00')
            last_time = datetime.fromisoformat(ts)
        else:
            posts = self._query_brain("social_posts", {"order": "created_at.desc", "limit": "1"})
            if posts:
                ts = posts[0]['created_at'].replace('Z', '+00:00')
                last_time = datetime.fromisoformat(ts)
        
        next_dt = last_time + timedelta(hours=STAGGER_WINDOW_HOURS)
        return True, next_dt.isoformat()

    def _queue_staggered(self, message, pillar, source_agent, project_id, slot):
        self._insert_brain("content_calendar", {
            "topic": message, "content_type": pillar, "assigned_agent": source_agent,
            "project_context": project_id, "scheduled_for": slot, "status": "scheduled",
            "notes": "Auto-staggered"
        })
        return {"status": "QUEUED", "slot": slot}

    def process_calendar(self, dry_run=False):
        now = datetime.now(timezone.utc).isoformat()
        items = self._query_brain("content_calendar", {"status": "eq.scheduled", "scheduled_for": f"lte.{now}", "limit": "5"})
        if not items: return []
        results = []
        import requests as _req
        for itm in items:
            msg = f"[{itm['content_type']}] {itm['topic']}"
            res = self.process_trigger(msg, itm['assigned_agent'], itm['project_context'], dry_run)
            if res.get('status') == "PUBLISHED":
                _req.patch(f"{BRAIN_URL}/rest/v1/content_calendar?id=eq.{itm['id']}", 
                           headers={**self._supabase_headers, "Prefer": "return=minimal"}, 
                           json={"status": "published"})
            results.append(res)
        return results

def fire_social_post(message, source_agent="marcus", project_id=None, dry_run=False):
    return SocialEngine().process_trigger(message, source_agent, project_id, dry_run)

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--test", type=str)
    parser.add_argument("--calendar", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    engine = SocialEngine()
    if args.calendar: engine.process_calendar(dry_run=args.dry_run)
    elif args.test: engine.process_trigger(args.test, "marcus", dry_run=args.dry_run)
