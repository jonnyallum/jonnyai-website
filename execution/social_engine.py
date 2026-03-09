"""
social_engine.py — Antigravity Social Media Engine v2.0
========================================================
Jai.OS 5.0 | Replaces the single-pass webhook_receiver.generate_copy()

Upgrades over v1:
  1. 10 content pillars (up from 4)
  2. Quality gate before publish (length, brand voice, dedup)
  3. Context-aware generation (pulls recent posts + project data)
  4. Delegation routing (different agents for different pillars)
  5. Post history tracking (social_posts table in Supabase)
  6. Content calendar support (scheduled + reactive)
  7. Multi-platform copy (FB, IG, LinkedIn)

Usage:
    from social_engine import SocialEngine
    engine = SocialEngine()
    result = engine.process_trigger("[MISSION] Launched BL Motorcycles v2", "marcus", "bl-motorcycles")
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

# ═══════════════════════════════════════════════════════
# EXPANDED TRIGGER MAP — 10 Pillars
# ═══════════════════════════════════════════════════════

TRIGGER_MAP = {
    # Original pillars
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

    # NEW pillars
    "[CLIENT_WIN]":     "CLIENT_CASE_STUDY",
    "[BTS]":            "BEHIND_THE_SCENES",
    "[TIP]":            "EDUCATION_TIP",
    "[POLL]":           "ENGAGEMENT_POLL",
    "[CULTURE]":        "TEAM_CULTURE",
    "[REPORT]":         "CLIENT_REPORT_TEASER",

    # Event-driven triggers
    "[PROJECT]":        "NEW_PROJECT_ANNOUNCEMENT",
    "[DEPLOY]":         "WEBSITE_DEPLOYMENT",
    "[WEBSITE]":        "WEBSITE_DEPLOYMENT",
    "[TEAM]":           "TEAM_UPDATE",
    "[BLOG]":           "BLOG_GENERATION",
    "[REEL]":           "REEL_PRODUCTION",
    "[VIDEO]":          "REEL_PRODUCTION",
}

# ═══════════════════════════════════════════════════════
# DELEGATION ROUTING — Which agent handles which pillar
# ═══════════════════════════════════════════════════════

DELEGATION_MAP = {
    "MISSION_COMPLETE":       {"agent": "contentforge", "model": "claude-haiku-4-5-20251001", "voice": "authoritative"},
    "INFRASTRUCTURE_UPGRADE": {"agent": "contentforge", "model": "claude-haiku-4-5-20251001", "voice": "technical"},
    "TRILLION_DOLLAR_INSIGHT":{"agent": "contentforge", "model": "claude-haiku-4-5-20251001", "voice": "contrarian"},
    "AGENT_SPOTLIGHT":        {"agent": "contentforge", "model": "claude-haiku-4-5-20251001", "voice": "persona-driven"},
    "ACADEMY_UPDATE":         {"agent": "contentforge", "model": "claude-haiku-4-5-20251001", "voice": "educational"},
    "CLIENT_CASE_STUDY":      {"agent": "boyce",        "model": "claude-haiku-4-5-20251001", "voice": "sales-proof"},
    "BEHIND_THE_SCENES":      {"agent": "contentforge", "model": "claude-haiku-4-5-20251001", "voice": "raw-authentic"},
    "EDUCATION_TIP":          {"agent": "sam",           "model": "claude-haiku-4-5-20251001", "voice": "helpful-expert"},
    "ENGAGEMENT_POLL":        {"agent": "hannah",        "model": "claude-haiku-4-5-20251001", "voice": "conversational"},
    "TEAM_CULTURE":           {"agent": "contentforge", "model": "claude-haiku-4-5-20251001", "voice": "human-warm"},
    "CLIENT_REPORT_TEASER":   {"agent": "boyce",        "model": "claude-haiku-4-5-20251001", "voice": "professional"},
    "NEW_PROJECT_ANNOUNCEMENT":{"agent": "boyce",        "model": "claude-haiku-4-5-20251001", "voice": "exciting-professional"},
    "WEBSITE_DEPLOYMENT":      {"agent": "contentforge", "model": "claude-haiku-4-5-20251001", "voice": "technical-proud"},
    "TEAM_UPDATE":             {"agent": "contentforge", "model": "claude-haiku-4-5-20251001", "voice": "human-warm"},
    "BLOG_GENERATION":         {"agent": "elena",        "model": "claude-haiku-4-5-20251001", "voice": "thought-leadership"},
}

# ═══════════════════════════════════════════════════════
# PILLAR PROMPTS — Expanded to 10 with 3-platform output
# ═══════════════════════════════════════════════════════

PILLAR_PROMPTS = {
    "MISSION_COMPLETE": """You are @contentforge, Antigravity's social copy specialist.
Write a social post about this milestone/launch/win.
Voice: Authoritative. Before/After framing or pure outcome. CTA at end.

RULES:
- Reference SPECIFIC details from the message. No generic filler.
- If project data is provided, weave in real metrics (pages built, time saved, etc.)
- Check the RECENT POSTS section — do NOT repeat the same hook or structure.

Facebook: 150-250 words. Insight-led opening. End with jonnyai.co.uk
Instagram: 80-120 words. Hook-first. 12-15 relevant hashtags. End with jonnyai.co.uk
LinkedIn: 200-300 words. Professional thought-leadership angle. Tag #AI #AgenticAI #Automation

Return JSON: {"facebook": "...", "instagram": "...", "linkedin": "..."}
Only JSON, no markdown, no explanation.""",

    "INFRASTRUCTURE_UPGRADE": """You are @contentforge, Antigravity's social copy specialist.
Write a SHORT social media post about this system/infrastructure update.
Voice: Raw, quasi-technical. Show the engine evolving. Industrial tone.

RULES:
- Lead with the OUTCOME, not the process.
- Use specific numbers if available (agents deployed, tables created, etc.)
- Check RECENT POSTS — vary the structure from the last infrastructure post.

Facebook: 100-200 words. Technical but accessible. End with jonnyai.co.uk
Instagram: 60-100 words. One punchy stat or visual metaphor. 10-12 hashtags.
LinkedIn: 150-250 words. Frame as engineering excellence. Professional tone.

Return JSON: {"facebook": "...", "instagram": "...", "linkedin": "..."}
Only JSON, no markdown, no explanation.""",

    "TRILLION_DOLLAR_INSIGHT": """You are @contentforge, Antigravity's social copy specialist.
Write a contrarian insight post based on this research/data.
Voice: Provocative assertion. Data-backed. Makes people stop scrolling.

RULES:
- Open with a statement that challenges conventional wisdom.
- Back it with specific data or logic from the message.
- End with a question that invites debate.
- Check RECENT POSTS — don't repeat the same contrarian angle.

Facebook: 150-200 words. Contrarian hook, supporting data, open question.
Instagram: 80-100 words. Bold opener. 12-15 hashtags.
LinkedIn: 250-350 words. Full thought piece. Professional but edgy.

Return JSON: {"facebook": "...", "instagram": "...", "linkedin": "..."}
Only JSON, no markdown, no explanation.""",

    "AGENT_SPOTLIGHT": """You are @contentforge, Antigravity's social copy specialist.
Write an agent spotlight post introducing a member of the Antigravity Orchestra.
Voice: Character-driven. Mysterious. Compelling. Like introducing a character in a film.

CHARACTERS NOT CAPABILITIES DOCTRINE — THIS IS CRITICAL:
- Present the agent as a CHARACTER with a distinct personality, not a software tool.
- Use their human name and nickname (e.g., "Marcus Cole — 'The Maestro'").
- Describe their VIBE, their ENERGY, their ATTITUDE — not their technical stack.
- Hint at what they do in evocative, vague terms: "Nothing ships without his sign-off" not "He runs OWASP security audits".
- Show their personality quirks, catchphrases, or working style — make them memorable.
- NEVER mention specific tools, frameworks, APIs, or technical methods.
- NEVER say the exact number of agents in the Orchestra.
- Make the audience curious about the character, not informed about the capability.
- Think of it as a character reveal trailer, not a job description.

RULES:
- If a PERSONA.md exists for this agent, pull character details from it.
- One intriguing detail that makes this character stand out.
- End with a line that makes people want to know more.
- Check RECENT POSTS — vary the spotlight format from the last one.

Facebook: 100-150 words. Character intro + personality + intrigue. End with jonnyai.co.uk
Instagram: 60-80 words. One killer character detail. 10 hashtags.
LinkedIn: 150-200 words. Frame as team expansion. Professional but compelling.

Return JSON: {"facebook": "...", "instagram": "...", "linkedin": "..."}
Only JSON, no markdown, no explanation.""",

    "ACADEMY_UPDATE": """You are @contentforge, Antigravity's social copy specialist.
Write a post about this Antigravity Academy update.
Voice: Educational but exclusive. Makes people want in.

RULES:
- Frame the Academy as a high-value, limited-access programme.
- Include specific details about what's being taught or built.
- CTA: direct to the Academy signup or jonnyai.co.uk

Facebook: 150-200 words. Value-first. What they'll learn. CTA.
Instagram: 80-100 words. Exclusive tone. 10-12 hashtags.
LinkedIn: 200-300 words. Professional development angle.

Return JSON: {"facebook": "...", "instagram": "...", "linkedin": "..."}
Only JSON, no markdown, no explanation.""",

    "CLIENT_CASE_STUDY": """You are @boyce, Antigravity's sales and social proof specialist.
Write a client case study post showcasing real work delivered.
Voice: Professional, results-driven. Social proof that sells.

RULES:
- Lead with the CLIENT'S outcome, not Antigravity's process.
- Include specific metrics: pages built, time saved, revenue impact, speed.
- Frame as "what we built for [client]" not "what we can do."
- End with a CTA for businesses looking for similar results.
- NEVER name the client without explicit permission — use industry/type if unsure.

Facebook: 200-300 words. Problem → Solution → Result format. CTA.
Instagram: 100-120 words. One killer stat + visual hook. 12-15 hashtags.
LinkedIn: 250-400 words. Full case study format. Professional.

Return JSON: {"facebook": "...", "instagram": "...", "linkedin": "..."}
Only JSON, no markdown, no explanation.""",

    "BEHIND_THE_SCENES": """You are @contentforge, Antigravity's social copy specialist.
Write a behind-the-scenes post showing the raw reality of building with AI.
Voice: Raw, authentic, unpolished. The real story behind the highlight reel.

RULES:
- Show the messy middle — the debugging, the 3am commits, the failures.
- Be specific about what actually happened, not a polished narrative.
- Make the audience feel like insiders.
- End with a relatable takeaway or lesson.

Facebook: 150-250 words. Storytelling format. Conversational.
Instagram: 80-120 words. Raw moment + lesson. 10-12 hashtags.
LinkedIn: 200-300 words. "Here's what they don't tell you about..." format.

Return JSON: {"facebook": "...", "instagram": "...", "linkedin": "..."}
Only JSON, no markdown, no explanation.""",

    "EDUCATION_TIP": """You are @sam, Antigravity's SEO and education specialist.
Write an educational tip post that provides genuine value.
Voice: Helpful expert. Teaches something actionable in 60 seconds.

RULES:
- One specific, actionable tip. Not vague advice.
- "Here's how to..." or "Most people don't know..." format.
- Include a concrete example or step-by-step.
- End with "Save this" or "Share with someone who needs this."

Facebook: 150-200 words. Tip + example + CTA.
Instagram: 80-100 words. Numbered steps work well. 12-15 hashtags.
LinkedIn: 200-300 words. Professional how-to. Thought leadership.

Return JSON: {"facebook": "...", "instagram": "...", "linkedin": "..."}
Only JSON, no markdown, no explanation.""",

    "ENGAGEMENT_POLL": """You are @hannah, Antigravity's community engagement specialist.
Write an engagement post that starts a conversation.
Voice: Conversational, curious, inviting. Gets people talking.

RULES:
- Ask a genuine question that has multiple valid answers.
- Relate it to AI, business, or tech — our audience's interests.
- Make it easy to respond (A/B choice, or "drop your answer below").
- No selling. Pure engagement.

Facebook: 80-120 words. Question + context + "Drop your answer below."
Instagram: 60-80 words. Question + 2-3 options. 8-10 hashtags.
LinkedIn: 100-150 words. Professional poll format. Thought-provoking.

Return JSON: {"facebook": "...", "instagram": "...", "linkedin": "..."}
Only JSON, no markdown, no explanation.""",

    "TEAM_CULTURE": """You are @contentforge, Antigravity's social copy specialist.
Write a team culture post that humanises the Antigravity Orchestra.
Voice: Warm, human, proud. Shows the people (and AIs) behind the brand.

RULES:
- Highlight a specific moment, achievement, or personality.
- Balance the AI angle with the human founder story.
- Make the audience feel connected to the team.
- End with something that invites them into the community.

Facebook: 150-200 words. Story format. Warm and genuine.
Instagram: 80-100 words. Personal moment. 10-12 hashtags.
LinkedIn: 200-300 words. Company culture showcase. Professional.

Return JSON: {"facebook": "...", "instagram": "...", "linkedin": "..."}
Only JSON, no markdown, no explanation.""",

    "CLIENT_REPORT_TEASER": """You are @boyce, Antigravity's sales specialist.
Write a teaser post about a client progress report being delivered.
Voice: Professional, trust-building. Shows we deliver and communicate.

RULES:
- Frame as "we just sent our client their progress report" — shows professionalism.
- Hint at the results without revealing confidential details.
- CTA: "Want this level of transparency for your project?"

Facebook: 100-150 words. Trust-building. CTA to jonnyai.co.uk
Instagram: 60-80 words. Professional. 8-10 hashtags.
LinkedIn: 150-200 words. B2B trust signal. Professional.

Return JSON: {"facebook": "...", "instagram": "...", "linkedin": "..."}
Only JSON, no markdown, no explanation.""",

    "NEW_PROJECT_ANNOUNCEMENT": """You are @boyce, Antigravity's sales and growth specialist.
Write an exciting announcement post about a new client project kicking off.
Voice: Excited, professional, momentum-building. Shows growth and trust.

RULES:
- Frame as GROWTH — another business trusting Antigravity with their digital presence.
- Mention the INDUSTRY or TYPE of project (e.g., "a local trades business", "a beauty clinic").
- NEVER name the client unless explicitly stated in the message.
- Show what Antigravity will deliver (website, branding, AI integration) in outcome terms.
- End with a CTA: "Your business could be next."
- Check RECENT POSTS — vary the announcement format.

Facebook: 150-200 words. Excitement + what we're building + CTA. End with jonnyai.co.uk
Instagram: 80-100 words. "New project alert" energy. 10-12 hashtags.
LinkedIn: 200-300 words. Business growth narrative. Professional.

Return JSON: {"facebook": "...", "instagram": "...", "linkedin": "..."}
Only JSON, no markdown, no explanation.""",

    "WEBSITE_DEPLOYMENT": """You are @contentforge, Antigravity's social copy specialist.
Write a deployment announcement — a website or app just went live.
Voice: Technical pride meets client celebration. Show the craft.

RULES:
- Lead with WHAT went live and WHO it's for (industry, not name unless stated).
- Include specific details: pages, features, performance scores if available.
- Frame as "another one shipped" — show Antigravity's delivery cadence.
- End with the live URL if provided, otherwise CTA to jonnyai.co.uk
- Check RECENT POSTS — vary from the last deployment post.

Facebook: 150-200 words. "Just shipped" energy. Specific details. CTA.
Instagram: 80-100 words. One killer feature or stat. 10-12 hashtags.
LinkedIn: 200-300 words. Portfolio piece format. Professional.

Return JSON: {"facebook": "...", "instagram": "...", "linkedin": "..."}
Only JSON, no markdown, no explanation.""",

    "TEAM_UPDATE": """You are @contentforge, Antigravity's social copy specialist.
Write a team update post — someone joined, a role changed, or the team evolved.
Voice: Warm, proud, human. Shows the Orchestra growing.

RULES:
- If it's a new team member (human or AI), introduce them with CHARACTER not capabilities.
- Show personality, energy, vibe — not job description.
- Frame as the Orchestra getting stronger, not just bigger.
- Make the audience feel like they're watching a team being built in real time.
- Check RECENT POSTS — vary the team update format.

Facebook: 100-150 words. Character intro + what they bring (in vibe terms). jonnyai.co.uk
Instagram: 60-80 words. One compelling detail. 8-10 hashtags.
LinkedIn: 150-250 words. Team growth narrative. Professional.

Return JSON: {"facebook": "...", "instagram": "...", "linkedin": "..."}
Only JSON, no markdown, no explanation.""",

    "BLOG_GENERATION": """You are @elena, Antigravity's content strategist and long-form writer.
Write a blog post based on the event or insight described in the message.
Voice: Thought-leadership. Authoritative but accessible. SEO-aware.

RULES:
- Write a FULL blog post (600-1000 words), not a social snippet.
- Include a compelling H1 title and 2-3 H2 subheadings.
- Open with a hook that makes the reader want to continue.
- Include specific details, data, or examples from the message.
- End with a CTA to jonnyai.co.uk or a relevant service page.
- Also generate a SHORT social teaser for each platform to promote the blog.

Return JSON: {
  "blog_title": "...",
  "blog_body": "...",
  "blog_meta_description": "...",
  "facebook": "...",
  "instagram": "...",
  "linkedin": "..."
}
Only JSON, no markdown wrapping, no explanation.""",
}

# ═══════════════════════════════════════════════════════
# QUALITY GATE
# ═══════════════════════════════════════════════════════

BRAND_VOICE_MARKERS = ["antigravity", "orchestra", "jai.os", "jonnyai"]

# ═══════════════════════════════════════════════════════
# CHARACTERS NOT CAPABILITIES — Universal Protection
# ═══════════════════════════════════════════════════════
# This doctrine prevents social content from revealing the
# Orchestra's internal architecture, tools, or methods.
# Show the CHARACTERS. Hide the CAPABILITIES.

CHARACTERS_NOT_CAPABILITIES_RULE = """

CRITICAL — CHARACTERS NOT CAPABILITIES DOCTRINE:
You are writing for a public audience. You MUST follow these rules:
1. NEVER mention specific tools, frameworks, or technical stack (no Supabase, no Playwright, no OWASP, no ElevenLabs, no FFmpeg, no n8n, no Remotion, no Vercel, no Next.js)
2. NEVER reveal the exact number of agents (don't say "69 agents" — say "the team" or "the Orchestra")
3. NEVER explain HOW the system works internally — only show WHAT it achieves
4. Lead with CHARACTER and PERSONALITY, not technical capability
5. Show RESULTS, hide METHODS — "300% traffic increase" not "we ran 47 Lighthouse audits"
6. Make agents sound like elite specialists with distinct personalities, not software tools
7. If mentioning an agent, use their character name and nickname, not their technical role
8. The AI is the secret sauce — the characters are the brand
"""

BANNED_PHRASES = [
    "in today's fast-paced world",
    "game-changer",
    "synergy",
    "leverage our",
    "unlock the power",
    "dive deep",
    "at the end of the day",
    "it goes without saying",
    "needless to say",
    "revolutionary solution",
    "cutting-edge technology",
    "paradigm shift",
    "move the needle",
    "low-hanging fruit",
    "circle back",
    "touch base",
    "placeholder",
    "lorem ipsum",
    "insert",
    "[your",
    "{your",
]

# Technical terms that must NEVER appear in social content
BANNED_TECHNICAL_TERMS = [
    "supabase", "playwright", "owasp", "elevenlabs", "eleven labs",
    "ffmpeg", "remotion", "n8n", "vercel", "next.js", "nextjs",
    "react", "typescript", "tailwind", "drizzle", "postgresql",
    "postg rest", "claude", "anthropic", "openai", "gpt-4",
    "haiku", "sonnet", "gemini", "langchain", "framer motion",
    "lighthouse", "resend", "stripe api", "webhook",
    "github actions", "ci/cd", "docker", "kubernetes",
    "shared brain", "skill.md", "persona.md", "jai.os 5.0",
    "deterministic state packet", "ralph loop", "circuit breaker",
    "fallback chain", "routing metadata", "agent card",
    "69 agents", "69 specialists", "69 ai",
]

def quality_gate(copy: dict, pillar: str, recent_hashes: set) -> dict:
    """
    Validate generated copy before publishing.
    Returns: {"passed": bool, "score": int, "issues": [...], "copy": dict}
    """
    issues = []
    score = 100

    for platform in ["facebook", "instagram", "linkedin"]:
        text = copy.get(platform, "")

        if not text or len(text.strip()) < 20:
            issues.append(f"{platform}: Empty or too short (<20 chars)")
            score -= 30
            continue

        # Length checks
        word_count = len(text.split())
        if platform == "facebook" and word_count < 30:
            issues.append(f"facebook: Too short ({word_count} words, min 30)")
            score -= 10
        if platform == "instagram" and word_count < 15:
            issues.append(f"instagram: Too short ({word_count} words, min 15)")
            score -= 10

        # Banned phrases
        text_lower = text.lower()
        for phrase in BANNED_PHRASES:
            if phrase in text_lower:
                issues.append(f"{platform}: Contains banned phrase '{phrase}'")
                score -= 15

        # Characters Not Capabilities — technical term check
        for term in BANNED_TECHNICAL_TERMS:
            if term in text_lower:
                issues.append(f"{platform}: DOCTRINE VIOLATION — contains technical term '{term}'")
                score -= 25  # Heavy penalty for doctrine violations

        # Brand voice check — at least one marker should appear
        has_brand = any(marker in text_lower for marker in BRAND_VOICE_MARKERS)
        if not has_brand and platform == "facebook":
            issues.append(f"facebook: No brand voice markers found")
            score -= 5

        # Placeholder detection
        if re.search(r'\[.*?\]|\{.*?\}', text) and '[' not in text[:3]:
            issues.append(f"{platform}: Possible placeholder text detected")
            score -= 20

    # Deduplication check
    content_hash = hashlib.md5(
        (copy.get("facebook", "") + copy.get("instagram", "")).encode()
    ).hexdigest()[:16]

    if content_hash in recent_hashes:
        issues.append("DUPLICATE: Content hash matches a recent post")
        score -= 40

    passed = score >= 60 and not any("DUPLICATE" in i for i in issues)

    return {
        "passed": passed,
        "score": max(0, score),
        "issues": issues,
        "content_hash": content_hash,
        "copy": copy
    }


# ═══════════════════════════════════════════════════════
# CONTEXT-AWARE GENERATION
# ═══════════════════════════════════════════════════════

class SocialEngine:
    """The upgraded social media engine with context, quality, and delegation."""

    def __init__(self):
        self._anthropic = None
        self._supabase_headers = {
            "apikey": BRAIN_KEY,
            "Authorization": f"Bearer {BRAIN_KEY}",
            "Content-Type": "application/json"
        } if BRAIN_KEY else {}

    def _get_anthropic(self):
        if not self._anthropic:
            import anthropic
            self._anthropic = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        return self._anthropic

    def _query_brain(self, endpoint, params=None):
        """Query the Shared Brain via REST."""
        if not BRAIN_URL or not BRAIN_KEY:
            print(f"  WARNING: Cannot query {endpoint} — BRAIN_URL or BRAIN_KEY not set")
            return []
        import requests
        try:
            resp = requests.get(
                f"{BRAIN_URL}/rest/v1/{endpoint}",
                headers=self._supabase_headers,
                params=params,
                timeout=8
            )
            if resp.status_code == 200:
                return resp.json()
            print(f"  ERROR querying {endpoint}: {resp.status_code} {resp.text[:200]}")
            return []
        except Exception as e:
            print(f"  ERROR querying {endpoint}: {e}")
            return []

    def _insert_brain(self, endpoint, data):
        """Insert into the Shared Brain via REST."""
        if not BRAIN_URL or not BRAIN_KEY:
            print(f"  WARNING: Cannot insert to {endpoint} — BRAIN_URL or BRAIN_KEY not set")
            return False
        import requests
        try:
            headers = {**self._supabase_headers, "Prefer": "return=minimal"}
            resp = requests.post(
                f"{BRAIN_URL}/rest/v1/{endpoint}",
                headers=headers,
                json=data,
                timeout=8
            )
            if resp.status_code in (200, 201, 204):
                print(f"  Logged to {endpoint} table")
                return True
            else:
                print(f"  ERROR inserting to {endpoint}: {resp.status_code} {resp.text[:200]}")
                return False
        except Exception as e:
            print(f"  ERROR inserting to {endpoint}: {e}")
            return False

    # ── Context Gathering ─────────────────────────────

    def get_recent_posts(self, limit=5):
        """Pull recent social posts to avoid repetition."""
        posts = self._query_brain("social_posts", {
            "select": "pillar,facebook_copy,content_hash,created_at",
            "order": "created_at.desc",
            "limit": str(limit)
        })
        return posts

    def get_recent_hashes(self, days=7):
        """Get content hashes from the last N days for dedup."""
        since = (datetime.now(timezone.utc) - timedelta(days=days)).isoformat()
        posts = self._query_brain("social_posts", {
            "select": "content_hash",
            "created_at": f"gte.{since}"
        })
        return {p.get("content_hash", "") for p in posts if p.get("content_hash")}

    def get_project_context(self, project_id):
        """Pull project data for richer content."""
        if not project_id:
            return None
        data = self._query_brain("projects", {
            "id": f"eq.{project_id}",
            "select": "name,client,live_url,health_score,tech_stack"
        })
        return data[0] if data else None

    # ── Copy Generation ───────────────────────────────

    def generate_copy(self, message: str, pillar: str, project_id: str = None) -> dict:
        """
        Context-aware, multi-platform copy generation.
        Pulls recent posts and project data before generating.
        """
        # 1. Gather context
        recent_posts = self.get_recent_posts(5)
        project_data = self.get_project_context(project_id)
        delegation = DELEGATION_MAP.get(pillar, DELEGATION_MAP["MISSION_COMPLETE"])

        # 2. Build context block
        context_block = ""
        if recent_posts:
            context_block += "\n\nRECENT POSTS (do NOT repeat these hooks or structures):\n"
            for p in recent_posts[:3]:
                fb = (p.get("facebook_copy") or "")[:100]
                context_block += f"- [{p.get('pillar','?')}] {fb}...\n"

        if project_data:
            context_block += f"\n\nPROJECT DATA:\n"
            context_block += f"- Name: {project_data.get('name', 'Unknown')}\n"
            context_block += f"- Client: {project_data.get('client', 'Unknown')}\n"
            if project_data.get('live_url'):
                context_block += f"- Live URL: {project_data['live_url']}\n"
            if project_data.get('health_score'):
                context_block += f"- Health Score: {project_data['health_score']}/100\n"

        # 3. Get the pillar prompt + inject Characters Not Capabilities doctrine
        system_prompt = PILLAR_PROMPTS.get(pillar, PILLAR_PROMPTS["MISSION_COMPLETE"])
        system_prompt += CHARACTERS_NOT_CAPABILITIES_RULE

        # 4. Build user message with full context
        user_msg = f"""Raw chatroom message to transform:
---
{message}
---
{context_block}

Return a JSON object with exactly three keys:
  "facebook": "full FB post text including CTA"
  "instagram": "IG post text including hashtags"
  "linkedin": "LinkedIn post text, professional tone"
Only JSON, no markdown, no explanation."""

        # 5. Generate via Claude
        try:
            client = self._get_anthropic()
            resp = client.messages.create(
                model=delegation["model"],
                max_tokens=1200,
                system=system_prompt,
                messages=[{"role": "user", "content": user_msg}]
            )
            text = resp.content[0].text.strip()
            # Strip markdown fences
            if text.startswith("```"):
                text = text.split("```")[1]
                if text.startswith("json"):
                    text = text[4:]
            copy = json.loads(text)

            # Ensure all three platforms exist
            for platform in ["facebook", "instagram", "linkedin"]:
                if platform not in copy:
                    copy[platform] = ""

            return copy
        except Exception as e:
            print(f"  ⚠️  Copy generation failed: {e} — using fallback")
            return self._fallback_copy(message, pillar)

    def _fallback_copy(self, message: str, pillar: str) -> dict:
        """Template fallback if Claude is unavailable."""
        short = message[:120].strip()
        return {
            "facebook": f"{short}\n\nThe Antigravity Orchestra is live.\nA team of elite specialists. Zero waiting.\n\njonnyai.co.uk\n\n#JaiOS #Antigravity #AgenticAI",
            "instagram": f"{short}\n\njonnyai.co.uk\n\n#JaiOS #Antigravity #AgenticAI #AItools #techstartup #UKtech",
            "linkedin": f"{short}\n\nThe Antigravity Orchestra — an elite team of AI specialists working as one coordinated unit.\n\nLearn more: jonnyai.co.uk\n\n#AI #AgenticAI #Automation #TechStartup"
        }

    # ── Quality + Publish ─────────────────────────────

    def _process_blog_trigger(self, message, source_agent, project_id, tag, dry_run):
        """Special pipeline for [BLOG] — generates full blog post + social teasers."""
        delegation = DELEGATION_MAP.get("BLOG_GENERATION", DELEGATION_MAP["MISSION_COMPLETE"])
        print(f"\n{'='*60}")
        print(f"\U0001f4dd BLOG ENGINE | {tag} \u2192 BLOG_GENERATION")
        print(f"   Delegated to: @{delegation['agent']} | Voice: {delegation['voice']}")
        print(f"{'='*60}")

        # Generate blog + social teasers
        copy = self.generate_copy(message, "BLOG_GENERATION", project_id)

        blog_title = copy.get("blog_title", "Untitled Blog Post")
        blog_body = copy.get("blog_body", "")
        blog_meta = copy.get("blog_meta_description", "")

        print(f"  \U0001f4d6 Blog Title: {blog_title}")
        print(f"  \U0001f4d6 Blog Length: {len(blog_body)} chars")
        print(f"  \U0001f4dd FB teaser: {(copy.get('facebook',''))[:80]}...")

        if dry_run:
            print(f"  [DRY RUN] Would store blog + publish teasers")
            return {"status": "DRY_RUN", "copy": copy, "blog_title": blog_title}

        # Store blog to Supabase blog_posts table
        self._insert_brain("blog_posts", {
            "title": blog_title,
            "body": blog_body,
            "meta_description": blog_meta,
            "status": "draft",
            "source_agent": source_agent,
            "project_context": project_id,
            "trigger_message": message[:500],
            "metadata": json.dumps({
                "delegation": delegation,
                "engine_version": "2.0",
                "social_teasers": {
                    "facebook": copy.get("facebook", ""),
                    "instagram": copy.get("instagram", ""),
                    "linkedin": copy.get("linkedin", "")
                }
            })
        })
        print(f"  \U0001f4be Blog stored as draft in blog_posts table")

        # Also publish social teasers (reuse standard publish flow)
        results = {}
        try:
            sys.path.insert(0, str(Path(__file__).parent))
            import facebook_publisher as fp
            from image_rotator import get_image_for_post
            image_url = get_image_for_post(
                "BLOG_GENERATION", message, source_agent,
                os.getenv("ANTIGRAVITY_BRAIN_URL", ""),
                os.getenv("ANTIGRAVITY_BRAIN_SERVICE_ROLE_KEY", "")
            )
            if copy.get("facebook"):
                fb_ok = fp.post_to_facebook(copy["facebook"], image_url)
                results["facebook"] = "LIVE" if fb_ok else "FAILED"
            results["linkedin"] = "QUEUED"
        except Exception as e:
            print(f"  Publish error: {e}")
            results["error"] = str(e)

        # Log to social_posts
        self._insert_brain("social_posts", {
            "pillar": "BLOG_GENERATION",
            "platform": "multi",
            "facebook_copy": copy.get("facebook", ""),
            "instagram_copy": copy.get("instagram", ""),
            "linkedin_copy": copy.get("linkedin", ""),
            "trigger_tag": tag,
            "trigger_message": message[:500],
            "source_agent": source_agent,
            "project_context": project_id,
            "status": "published" if any(v == "LIVE" for v in results.values()) else "draft",
            "metadata": json.dumps({"blog_title": blog_title, "results": results})
        })

        print(f"\n  Results: {results}")
        return {"status": "BLOG_PUBLISHED", "blog_title": blog_title, "results": results, "copy": copy}

    def process_trigger(self, message: str, source_agent: str, project_id: str = None, dry_run: bool = False) -> dict:
        """
        Full pipeline: detect tag → delegate → generate → quality gate → publish → log.
        Returns result dict.
        """
        # 1. Detect trigger
        tag, pillar = None, None
        for t, p in TRIGGER_MAP.items():
            if t in message:
                tag, pillar = t, p
                break

        if not pillar:
            return {"status": "NO_TRIGGER", "message": "No trigger tag detected"}

        if pillar == "COLLAB":
            return {"status": "COLLAB_ROUTED", "message": "Routed to Gemini collab"}

        # Special handling: BLOG_GENERATION produces blog + social teasers
        if pillar == "BLOG_GENERATION":
            return self._process_blog_trigger(message, source_agent, project_id, tag, dry_run)

        delegation = DELEGATION_MAP.get(pillar, DELEGATION_MAP["MISSION_COMPLETE"])
        print(f"\n{'='*60}")
        print(f"📡 SOCIAL ENGINE v2.0 | {tag} → {pillar}")
        print(f"   Delegated to: @{delegation['agent']} | Voice: {delegation['voice']}")
        print(f"{'='*60}")

        # 2. Generate copy with context
        print(f"  ✍️  Generating copy with context...")
        copy = self.generate_copy(message, pillar, project_id)
        print(f"  📝 FB: {(copy.get('facebook',''))[:80]}...")
        print(f"  📝 IG: {(copy.get('instagram',''))[:80]}...")
        print(f"  📝 LI: {(copy.get('linkedin',''))[:80]}...")

        # 3. Quality gate
        recent_hashes = self.get_recent_hashes()
        qg = quality_gate(copy, pillar, recent_hashes)
        print(f"  🔍 Quality Score: {qg['score']}/100 | Passed: {qg['passed']}")
        if qg["issues"]:
            for issue in qg["issues"]:
                print(f"     ⚠️  {issue}")

        if not qg["passed"]:
            print(f"  ❌ BLOCKED by quality gate. Attempting regeneration...")
            # One retry with explicit instruction to fix issues
            retry_msg = message + f"\n\nQUALITY ISSUES TO FIX: {'; '.join(qg['issues'])}"
            copy = self.generate_copy(retry_msg, pillar, project_id)
            qg = quality_gate(copy, pillar, recent_hashes)
            print(f"  🔍 Retry Quality Score: {qg['score']}/100 | Passed: {qg['passed']}")
            if not qg["passed"]:
                print(f"  ❌ STILL BLOCKED. Skipping publish.")
                return {"status": "QUALITY_BLOCKED", "score": qg["score"], "issues": qg["issues"]}

        if dry_run:
            print(f"  [DRY RUN] Would publish to FB + IG + LI")
            return {"status": "DRY_RUN", "copy": copy, "quality": qg}

        # 4. Publish (uses existing facebook_publisher.py)
        results = {}
        try:
            sys.path.insert(0, str(Path(__file__).parent))
            import facebook_publisher as fp

            # Image selection — rotate per pillar, no repeats
            from image_rotator import get_image_for_post
            image_url = get_image_for_post(
                pillar, message, source_agent,
                os.getenv("ANTIGRAVITY_BRAIN_URL", ""),
                os.getenv("ANTIGRAVITY_BRAIN_SERVICE_ROLE_KEY", "")
            )

            # Facebook
            fb_ok = fp.post_to_facebook(copy["facebook"], image_url)
            results["facebook"] = "LIVE" if fb_ok else "FAILED"

            # Instagram
            if copy.get("instagram"):
                ig_ok = fp.post_to_instagram(image_url, copy["instagram"])
                results["instagram"] = "LIVE" if ig_ok else "FAILED"

            # LinkedIn — placeholder for future integration
            results["linkedin"] = "QUEUED"

        except Exception as e:
            print(f"  ❌ Publish error: {e}")
            results["error"] = str(e)

        # 5. Log to social_posts table
        self._insert_brain("social_posts", {
            "pillar": pillar,
            "platform": "multi",
            "content_hash": qg["content_hash"],
            "facebook_copy": copy.get("facebook", ""),
            "instagram_copy": copy.get("instagram", ""),
            "linkedin_copy": copy.get("linkedin", ""),
            "image_url": image_url if 'image_url' in dir() else None,
            "trigger_tag": tag,
            "trigger_message": message[:500],
            "source_agent": source_agent,
            "project_context": project_id,
            "status": "published" if any(v == "LIVE" for v in results.values()) else "failed",
            "quality_score": qg["score"],
            "quality_notes": "; ".join(qg["issues"]) if qg["issues"] else "Clean pass",
            "metadata": json.dumps({
                "delegation": delegation,
                "results": results,
                "engine_version": "2.0"
            })
        })

        print(f"\n  📡 Results: {results}")
        return {"status": "PUBLISHED", "results": results, "quality": qg, "copy": copy}

    # ── Content Calendar ──────────────────────────────

    def get_due_calendar_items(self):
        """Pull scheduled content that's due for publishing."""
        now = datetime.now(timezone.utc).isoformat()
        return self._query_brain("content_calendar", {
            "status": "eq.scheduled",
            "scheduled_for": f"lte.{now}",
            "select": "*",
            "order": "scheduled_for.asc",
            "limit": "5"
        })

    def process_calendar(self, dry_run=False):
        """Process any due content calendar items."""
        items = self.get_due_calendar_items()
        if not items:
            print("  📅 No scheduled content due.")
            return []

        results = []
        for item in items:
            print(f"\n  📅 Processing scheduled: {item.get('content_type')} — {item.get('topic', 'No topic')}")
            message = f"[{item.get('content_type', 'TIP')}] {item.get('topic', 'Scheduled content')}"
            result = self.process_trigger(
                message,
                source_agent=item.get("assigned_agent", "contentforge"),
                project_id=item.get("project_context"),
                dry_run=dry_run
            )
            results.append(result)

            # Mark as published
            if not dry_run and result.get("status") == "PUBLISHED":
                item_id = item.get("id")
                if item_id:
                    import requests as _req
                    try:
                        _req.patch(
                            f"{BRAIN_URL}/rest/v1/content_calendar?id=eq.{item_id}",
                            headers={**self._supabase_headers, "Prefer": "return=minimal"},
                            json={"status": "published"},
                            timeout=8
                        )
                        print(f"  Calendar item {item_id} marked as published")
                    except Exception as e:
                        print(f"  Could not update calendar item: {e}")

        return results


# ═══════════════════════════════════════════════════════
# CLI
# ═══════════════════════════════════════════════════════

# ===================================================================
# PUBLIC API - For external integrations
# ===================================================================

def fire_social_post(message, source_agent="marcus", project_id=None, dry_run=False):
    """
    Public convenience function for triggering a social post.
    Can be called from any script, n8n, or external service.

    Usage:
        from social_engine import fire_social_post
        result = fire_social_post("[MISSION] Launched BL Motorcycles v2", "marcus", "bl-motorcycles")
    """
    engine = SocialEngine()
    return engine.process_trigger(message, source_agent, project_id, dry_run)


def get_engine_status():
    """
    Returns the current status of the social engine.
    """
    engine = SocialEngine()
    recent = engine.get_recent_posts(5)
    calendar = engine.get_due_calendar_items()
    return {
        "version": "2.0",
        "pillars": len(PILLAR_PROMPTS),
        "triggers": len(TRIGGER_MAP),
        "recent_posts": len(recent),
        "calendar_items_due": len(calendar),
        "quality_gate": "active",
        "doctrine": "characters_not_capabilities"
    }


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Antigravity Social Engine v2.0")
    parser.add_argument("--test", type=str, help="Test with a trigger message")
    parser.add_argument("--pillar", type=str, help="Force a specific pillar")
    parser.add_argument("--project", type=str, help="Project context")
    parser.add_argument("--dry-run", action="store_true", help="Preview without publishing")
    parser.add_argument("--calendar", action="store_true", help="Process due calendar items")
    args = parser.parse_args()

    engine = SocialEngine()

    if args.calendar:
        engine.process_calendar(dry_run=args.dry_run)
    elif args.test:
        engine.process_trigger(args.test, "marcus", args.project, dry_run=args.dry_run)
    else:
        parser.print_help()
