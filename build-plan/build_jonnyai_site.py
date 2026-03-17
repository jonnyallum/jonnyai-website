"""
jonnyai.co.uk — Agent-Orchestrated Website Rebuild
====================================================
Fires briefs at jAIlbreakO.S (port 8766) in 6 phases.
All outputs saved to build-plan/outputs/ and compiled into
MASTER_CONTEXT.md for Claude Code to implement.

Usage:
    python build-plan/build_jonnyai_site.py
    python build-plan/build_jonnyai_site.py --phase 3   # run one phase only
    python build-plan/build_jonnyai_site.py --dry-run   # print briefs only

Requirements: requests, python 3.10+
"""

import sys
import io
# Force UTF-8 stdout on Windows to handle box-drawing chars
if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

import requests
import json
import os
import time
import textwrap
import argparse
from datetime import datetime
from pathlib import Path

# ── CONFIG ──────────────────────────────────────────────────────────────────

BASE_URL   = "http://100.115.197.34:8766"   # Pi jailbreak service (Tailscale)
API_KEY    = "jaios6_KBMPXwfdiHyAz-VQQHV6d7v_AC0qWnD5EZ88uwBxxR8"
HEADERS    = {"X-API-Key": API_KEY, "Content-Type": "application/json"}
TIMEOUT    = 150                             # seconds per brief
OUTPUT_DIR = Path(__file__).parent / "outputs"
MASTER_CTX = OUTPUT_DIR / "MASTER_CONTEXT.md"

# ── COLOUR HELPERS ──────────────────────────────────────────────────────────

def c(text, code): return f"\033[{code}m{text}\033[0m"
def green(t):   return c(t, "92")
def yellow(t):  return c(t, "93")
def red(t):     return c(t, "91")
def cyan(t):    return c(t, "96")
def bold(t):    return c(t, "1")
def dim(t):     return c(t, "2")

# ── AGENT CALLER ────────────────────────────────────────────────────────────

def fire(agent_label: str, brief: str, dry_run: bool = False) -> dict:
    """Fire a brief at jAIlbreakO.S (async), poll until done, return result."""
    print(f"  {cyan('→')} [{agent_label}] Firing...")
    if dry_run:
        print(f"    {dim('DRY RUN — brief preview:')}")
        print(textwrap.indent(textwrap.shorten(brief, 300, placeholder="..."), "      "))
        return {"output": "DRY RUN", "agent": agent_label, "elapsed": 0, "error": None}

    t0 = time.time()
    try:
        # 1. Submit job
        r = requests.post(
            f"{BASE_URL}/run",
            json={"brief": brief},
            headers=HEADERS,
            timeout=30
        )
        r.raise_for_status()
        data   = r.json()
        job_id = data.get("job_id")
        if not job_id:
            raise ValueError(f"No job_id in response: {data}")

        print(f"    {dim('→ job')} {job_id[:8]}... polling", end="", flush=True)

        # 2. Poll until complete or timeout
        deadline = t0 + TIMEOUT
        while time.time() < deadline:
            time.sleep(4)
            poll = requests.get(f"{BASE_URL}/job/{job_id}", headers=HEADERS, timeout=15)
            poll.raise_for_status()
            pdata  = poll.json()
            status = pdata.get("status", "")
            print(".", end="", flush=True)

            if status in ("complete", "completed", "done", "success"):
                print()  # newline after dots
                out_data = pdata.get("output", {})
                result   = out_data.get("result", "") or pdata.get("result", "")
                agent    = out_data.get("agent", pdata.get("agent", agent_label))
                elapsed  = round(time.time() - t0, 1)
                chars    = len(result)
                if chars < 100:
                    print(f"  {yellow('!')} [{agent_label}] Short output ({chars} chars)")
                else:
                    print(f"  {green('✓')} [{agent_label}] Agent={agent} | {chars} chars | {elapsed}s")
                return {"output": result, "agent": agent, "elapsed": elapsed, "error": None}

            if status in ("failed", "error"):
                print()
                err = pdata.get("error", "unknown error")
                print(f"  {red('✗')} [{agent_label}] Job failed: {err}")
                return {"output": "", "agent": agent_label, "elapsed": round(time.time()-t0,1), "error": err}

        print()
        print(f"  {red('✗')} [{agent_label}] TIMEOUT after {TIMEOUT}s")
        return {"output": "", "agent": agent_label, "elapsed": TIMEOUT, "error": "timeout"}

    except Exception as e:
        print()
        print(f"  {red('✗')} [{agent_label}] ERROR: {e}")
        return {"output": "", "agent": agent_label, "elapsed": 0, "error": str(e)}


def save(filename: str, label: str, content: str):
    """Save agent output to outputs/ directory."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    path = OUTPUT_DIR / filename
    path.write_text(f"# {label}\n_Generated: {datetime.now().isoformat()}_\n\n{content}", encoding="utf-8")
    print(f"    {dim('→ Saved:')} {path.name}")
    return content


def append_master(section: str, content: str):
    """Append a section to MASTER_CONTEXT.md."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    with open(MASTER_CTX, "a", encoding="utf-8") as f:
        f.write(f"\n\n---\n\n## {section}\n\n{content}")


# ── PHASE DEFINITIONS ────────────────────────────────────────────────────────

def phase_1_intelligence(dry_run: bool) -> dict:
    """Market research + competitor analysis."""
    print(bold("\n╔══════════════════════════════════════════════════════╗"))
    print(bold("║  PHASE 1 — INTELLIGENCE                              ║"))
    print(bold("╚══════════════════════════════════════════════════════╝\n"))

    outputs = {}

    # 1a. Market research
    brief_research = """
    You are a senior market research analyst. Conduct thorough research on the following:

    TASK: Research the market for AI services targeting small businesses in the UK (2025-2026).
    Focus specifically on:
    1. What AI services are UK SMBs actually buying right now? (not what they're being sold)
    2. Top 5 competitor positioning — who is doing this well and why?
    3. What pain points are most emotionally resonant for SMB owners around AI adoption?
    4. What pricing models are working? (one-time vs retainer vs usage-based)
    5. What objections do SMBs have to buying AI services?
    6. What does "private AI install for a small business" mean in practice — use cases, benefits?
    7. Which verticals (trades, retail, hospitality, professional services) are most AI-ready?
    8. What does a winning landing page for an AI service product look like right now?

    Deliver: A structured research brief with 10 key insights and specific recommendations
    for positioning jonnyai.co.uk as the go-to place for SMB AI installation and automation.
    Be specific, data-informed, and actionable. No fluff.
    """

    r1 = fire("research_analyst", brief_research.strip(), dry_run)
    outputs["research"] = r1["output"]
    save("phase-1a-research.md", "Phase 1A — Market Research", r1["output"])

    # 1b. Competitor analysis
    brief_competitor = """
    TASK: Competitive intelligence on AI agency / AI automation service websites.

    Analyse and compare the positioning, copy, and offers of these types of businesses:
    - AI automation agencies targeting SMBs
    - "AI for small business" consultancies
    - No-code automation services (Zapier agencies, n8n shops)
    - Private AI deployment services

    For each competitor archetype, identify:
    1. Their hero message (what do they lead with?)
    2. Their pricing model
    3. Their strongest selling point
    4. Their biggest weakness / gap
    5. What they DON'T offer that a smart competitor should

    Then give me: A competitive positioning matrix and 5 specific angles jonnyai.co.uk
    should own that no competitor is currently owning well.

    Bonus: What should jonnyai.co.uk NEVER say? (what clichés to avoid?)
    """

    r2 = fire("competitor_monitor", brief_competitor.strip(), dry_run)
    outputs["competitor"] = r2["output"]
    save("phase-1b-competitor.md", "Phase 1B — Competitor Analysis", r2["output"])

    combined = f"### Market Research\n{outputs['research']}\n\n### Competitor Analysis\n{outputs['competitor']}"
    append_master("PHASE 1: INTELLIGENCE", combined)

    return outputs


def phase_2_strategy(intel: dict, dry_run: bool) -> dict:
    """Site architecture + conversion strategy."""
    print(bold("\n╔══════════════════════════════════════════════════════╗"))
    print(bold("║  PHASE 2 — STRATEGY                                  ║"))
    print(bold("╚══════════════════════════════════════════════════════╝\n"))

    context_snippet = (intel.get("research", "")[:800] + "\n\n" + intel.get("competitor", "")[:800])

    brief_strategy = f"""
    You are a senior product strategist. Design the full conversion strategy for jonnyai.co.uk.

    CONTEXT FROM RESEARCH:
    {context_snippet}

    THE BUSINESS: jonnyai.co.uk — AI services for UK small businesses, run by Jonny Allum.

    NEW OFFERING SUITE:
    - Private AI Install: £997–£1,997 one-time + £149–299/mo support retainer (HERO PRODUCT)
    - Website/App Build: £497–£4,997 one-time
    - Automation Packs (n8n): £297–497 one-time
    - YouTube Automation: £500/mo
    - AI Workforce (SDR/Support agent): £1,000/mo each
    - Social Autopilot: £299/mo
    - SEO Engine: £249/mo
    - Empire OS: £1,997–£19,997/mo (high-ticket anchor)

    SITE PAGES: /, /install, /build, /automate, /youtube, /workforce, /empire, /brief

    TASK: Design the full site strategy:
    1. Hero message for homepage (headline + sub-headline + CTA)
    2. Site-wide narrative arc — what story does the site tell from first visit to booking?
    3. Conversion funnel design — how does a visitor move from homepage to /brief?
    4. Which offering leads? Which is upsold? Which is the door-opener?
    5. Pricing page strategy — show all prices or gate some behind /brief?
    6. Social proof strategy — what case studies / proof points are most powerful?
    7. CTA hierarchy — primary CTA, secondary CTA, exit CTA for each page type
    8. FAQ strategy — what 5 questions appear on every page?
    9. Trust signals — what do we put in the header/footer to build immediate credibility?
    10. The "why us" argument — 3 sentences that explain why jonnyai.co.uk vs anyone else

    Be specific. This becomes the brief for the copywriters. Give actual headlines, not just advice.
    """

    r = fire("product_strategist", brief_strategy.strip(), dry_run)
    save("phase-2-strategy.md", "Phase 2 — Site Strategy", r["output"])
    append_master("PHASE 2: STRATEGY", r["output"])

    return {"strategy": r["output"]}


def phase_3_copy(strategy: dict, dry_run: bool) -> dict:
    """Copy generation for all pages + SEO."""
    print(bold("\n╔══════════════════════════════════════════════════════╗"))
    print(bold("║  PHASE 3 — COPY                                      ║"))
    print(bold("╚══════════════════════════════════════════════════════╝\n"))

    strat_snippet = strategy.get("strategy", "")[:1000]
    outputs = {}

    pages = [
        {
            "slug": "homepage",
            "label": "Homepage (/)",
            "offer": "All services — Private AI Install is the hero",
            "audience": "SMB owners discovering jonnyai.co.uk for the first time",
            "tone": "Confident, plain-English. Like the smartest person in the room who still explains things simply.",
        },
        {
            "slug": "install",
            "label": "Private AI Install (/install)",
            "offer": "Private AI Install — £997–£1,997 setup + £149–299/mo support",
            "audience": "SMB owners who want AI working in their business but don't want a SaaS subscription",
            "tone": "Grounded, practical, reassuring. It's not magic, it's a system we install for you.",
        },
        {
            "slug": "build",
            "label": "Build (/build)",
            "offer": "Website & App builds — £497 Facelift to £4,997 MVP",
            "audience": "Businesses that need a site or app built fast and properly",
            "tone": "Direct. No fluff. They've been burned by agencies before — speak to that.",
        },
        {
            "slug": "automate",
            "label": "Automate (/automate)",
            "offer": "Packaged n8n automations — £297–497 each",
            "audience": "Business owners who still do repetitive tasks manually and know it",
            "tone": "Specific about time saved. Name the exact tasks we automate.",
        },
        {
            "slug": "youtube",
            "label": "YouTube Automation (/youtube)",
            "offer": "Automated YouTube channels — £500/mo (20 videos)",
            "audience": "Business owners / entrepreneurs who want passive YouTube revenue without lifting a finger",
            "tone": "Exciting but credible. Show the economics. This isn't a magic trick, it's a system.",
        },
        {
            "slug": "workforce",
            "label": "AI Workforce (/workforce)",
            "offer": "AI SDR + AI Support Rep — £1,000/mo each",
            "audience": "Growing businesses spending money on sales reps or support staff",
            "tone": "ROI-first. Compare to cost of a human hire. Make the maths obvious.",
        },
    ]

    for page in pages:
        brief_copy = f"""
        You are an expert conversion copywriter. Write full page copy for jonnyai.co.uk.

        STRATEGY CONTEXT:
        {strat_snippet}

        PAGE: {page['label']}
        OFFER: {page['offer']}
        AUDIENCE: {page['audience']}
        TONE: {page['tone']}

        IMPORTANT RULES:
        - NO mention of "Marcus", "Orchestra", "Antigravity", "Jai.OS", "agents" as selling points
        - NO sci-fi jargon — plain English that an SMB owner understands immediately
        - DO include specific prices
        - DO include specific outcomes / results (be concrete, not vague)
        - DO write to one person (use "you")
        - NO corporate speak, no "leverage", no "synergy"

        DELIVER the following sections. Use markdown headers:
        ## HERO HEADLINE
        (punchy, benefit-led, under 10 words)

        ## HERO SUB-HEADLINE
        (1-2 sentences expanding the hero, plain English)

        ## PRIMARY CTA
        (button text — action-oriented, specific)

        ## THE PROBLEM
        (3-4 bullet points naming the exact pain this solves)

        ## HOW IT WORKS
        (3 steps — simple, numbered, concrete)

        ## WHAT YOU GET
        (5-6 specific deliverables or features — not vague promises)

        ## PRICING
        (exact tiers with what's included at each price point)

        ## PROOF
        (1 short case study or testimonial — use a real-sounding example from the business)

        ## FAQ
        (3 questions + answers the audience would actually ask)

        ## PAGE CTA
        (closing headline + button text)
        """

        r = fire(f"content_scaler:{page['slug']}", brief_copy.strip(), dry_run)
        outputs[page["slug"]] = r["output"]
        save(f"phase-3-copy-{page['slug']}.md", f"Phase 3 — Copy: {page['label']}", r["output"])
        append_master(f"COPY: {page['label']}", r["output"])

        if not dry_run:
            time.sleep(5)  # rate limit

    # SEO pass
    pages_summary = "\n".join([f"- {p['slug']}: {p['offer']}" for p in pages])
    brief_seo = f"""
    You are a technical SEO specialist. Generate all on-page SEO elements for jonnyai.co.uk.

    PAGES:
    {pages_summary}
    Also: /empire (AI-operated business portfolio, £1,997–£19,997/mo)
    And: /brief (booking/intake form)

    BUSINESS: jonnyai.co.uk — AI installation, automation, and web builds for UK small businesses.
    PRIMARY KEYWORD: "AI for small business UK"
    SECONDARY KEYWORDS: "private AI install", "business automation UK", "AI agency UK",
    "n8n automation", "automated YouTube channel", "AI workforce"

    FOR EACH PAGE DELIVER:
    - <title> tag (under 60 chars)
    - <meta description> (under 160 chars)
    - H1 (matches hero headline, keyword-optimised)
    - 3 semantic H2s for the page
    - Schema markup type (LocalBusiness, Service, Product, FAQPage — which applies?)
    - Internal linking suggestions (what should this page link to?)

    ALSO DELIVER:
    - robots.txt recommendations
    - sitemap.xml page list with priority scores
    - Core Web Vitals checklist for a Next.js 15 site
    """

    r_seo = fire("seo_specialist", brief_seo.strip(), dry_run)
    outputs["seo"] = r_seo["output"]
    save("phase-3-seo.md", "Phase 3 — SEO", r_seo["output"])
    append_master("SEO: All Pages", r_seo["output"])

    return outputs


def phase_4_legal(dry_run: bool) -> dict:
    """Legal pages — Privacy Policy + ToS."""
    print(bold("\n╔══════════════════════════════════════════════════════╗"))
    print(bold("║  PHASE 4 — LEGAL                                     ║"))
    print(bold("╚══════════════════════════════════════════════════════╝\n"))

    brief_legal = """
    You are a UK-qualified legal advisor specialising in digital business and data protection.

    TASK: Draft the legal pages for jonnyai.co.uk

    COMPANY: Jonny Allum Innovations Ltd, United Kingdom
    SERVICES: AI installation, web development, automation, YouTube content automation,
    AI workforce agents, digital marketing retainers
    DATA PROCESSED: Contact details, brief/project requirements, payment info (via Stripe)

    DELIVER:

    ## PRIVACY POLICY
    - UK GDPR compliant
    - What data is collected, how it's used, retention periods
    - Third-party processors (Stripe, Vercel, Supabase, Resend, ElevenLabs)
    - Data subject rights (access, erasure, portability)
    - Cookie policy (analytics + functional only)
    - Contact for data queries: hello@jonnyai.co.uk

    ## TERMS OF SERVICE
    - Scope of services
    - Payment terms (milestone-based, Stripe)
    - Intellectual property (client owns output, Jonny retains methodology)
    - Refund policy (no refunds after build commences, Month 2 free if KPIs missed on retainers)
    - Limitation of liability
    - Governing law: England and Wales

    ## COOKIE CONSENT BANNER COPY
    - Minimal, GDPR-compliant, not annoying
    - Accept / Manage options

    Write in plain English where possible. No legalese unless strictly necessary.
    """

    r = fire("legal_advisor", brief_legal.strip(), dry_run)
    save("phase-4-legal.md", "Phase 4 — Legal", r["output"])
    append_master("LEGAL: Privacy + ToS", r["output"])

    return {"legal": r["output"]}


def phase_5_launch(all_outputs: dict, dry_run: bool) -> dict:
    """Launch sequence + announcement content."""
    print(bold("\n╔══════════════════════════════════════════════════════╗"))
    print(bold("║  PHASE 5 — LAUNCH                                    ║"))
    print(bold("╚══════════════════════════════════════════════════════╝\n"))

    brief_launch = """
    You are a launch orchestrator. Plan and write the full go-to-market launch for the
    rebuilt jonnyai.co.uk — a complete relaunch with new positioning around Private AI Install
    for UK small businesses.

    THE NEW SITE OFFERS:
    - Private AI Install (hero): £997–£1,997 + monthly support
    - Automation packs, website builds, YouTube automation, AI workforce, Empire OS

    DELIVER:

    ## PRE-LAUNCH CHECKLIST (48 hours before)
    - Technical checklist (Vercel deploy, DNS, Lighthouse, forms working)
    - Content checklist (all pages live, no placeholders)
    - Comms checklist (social posts scheduled, email ready)

    ## LAUNCH ANNOUNCEMENT — INSTAGRAM + FACEBOOK
    (3 posts — Hook, Story, CTA. Each under 300 words. Authentic, not hype.)

    ## LAUNCH ANNOUNCEMENT — LINKEDIN
    (1 professional post — personal story angle, why the rebrand, what's new)

    ## LAUNCH EMAIL — EXISTING CLIENTS / CONTACTS
    (Subject line + email body — warm, personal, value-led. Mention Private AI Install
    specifically as something they might want for their business or to refer.)

    ## LAUNCH BLOG POST OUTLINE
    Title: "Why I burned down my AI agency website and started again"
    - 800-word outline with section headers and key points per section
    - Should be honest, specific, and SEO-useful

    ## 30-DAY POST-LAUNCH CONTENT CALENDAR
    - Week 1: Awareness (what is Private AI Install?)
    - Week 2: Proof (case studies, results)
    - Week 3: Education (how automations work)
    - Week 4: Conversion (offer, deadline, testimonial)
    List 2 posts per week with platform, format, and hook.
    """

    r = fire("launch_orchestrator", brief_launch.strip(), dry_run)
    save("phase-5-launch.md", "Phase 5 — Launch Plan", r["output"])
    append_master("LAUNCH PLAN", r["output"])

    return {"launch": r["output"]}


def phase_6_design(dry_run: bool) -> dict:
    """Design direction — component specs, OrbitalCanvas, animation system."""
    print(bold("\n╔══════════════════════════════════════════════════════╗"))
    print(bold("║  PHASE 6 — DESIGN                                    ║"))
    print(bold("╚══════════════════════════════════════════════════════╝\n"))

    brief_design = """
    You are a world-class UI/UX designer specialising in dark, premium web experiences.
    You are designing jonnyai.co.uk — a site that must look magnificent.

    BRAND CONSTRAINTS (LOCKED — do not change):
    - Background: #070708 (void black)
    - Primary accent: #D97757 (citrus — warm orange)
    - Success: #22C55E (signal green)
    - Glass cards: rgba(255,255,255,0.025) with border rgba(255,255,255,0.07)
    - Font: Outfit (headings, 700-800), system-mono (labels, uppercase)

    LOGO DIRECTIVE:
    The JonnyAI logo is the star of the show. Every design decision either serves it or
    gets out of its way. In the hero: large, centred, ~120px tall desktop, with citrus
    glow halo. Animates in: scale 0.85→1.0, opacity 0→1, 0.8s ease-out.

    ANIMATED BACKGROUND DIRECTIVE:
    The current site uses a neural node canvas. We want something better:
    An "Orbital Gravity Field" — particles orbit the logo like a solar system.
    The logo is the gravitational centre. ~150 particles in elliptical orbits at
    varying radii, speeds, opacities. Mouse movement creates localised deflection.
    The system breathes (radius ±5% on 8s sine cycle). No particles cross the logo zone.

    TASK: Produce full design specifications for:

    ## ORBITAL CANVAS COMPONENT SPEC
    - Full TypeScript interface for particle system
    - Exact orbital calculation formula
    - Mouse interaction logic
    - Breathing animation formula
    - Performance optimisations (devicePixelRatio, visibility API pause)
    - Fade-out gradient at canvas edges so particles don't clip hard

    ## GLASS NAVBAR SPEC
    - New navigation links: Install | Build | Automate | YouTube | Workforce | Empire | Brief
    - Logo treatment in navbar (small, left-aligned on scroll)
    - Mobile hamburger menu design
    - "Book a call" CTA button (citrus) — always visible on desktop
    - Scroll behaviour: transparent → glass blur on scroll past 80px

    ## HOMEPAGE HERO LAYOUT SPEC
    - Exact layout structure (logo → badge → h1 → sub → CTAs → stats bar)
    - Logo positioning and sizing (desktop / tablet / mobile)
    - Glow halo implementation (CSS radial gradient behind logo)
    - Stats bar: which 3 stats, exact copy, divider style

    ## GLASS CARD COMPONENT SPEC
    - Base styles, hover state, active state
    - Highlighted variant (citrus border top line)
    - Icon treatment within cards
    - Shadow and depth layering

    ## PRICING CARD SPEC
    - 2-column (lower pages) and 3-column (empire) layouts
    - "Most Popular" badge treatment
    - Price display: currency symbol, amount, period hierarchy
    - Feature list checkmark style
    - CTA button placement within card

    ## /INSTALL PAGE HERO SPEC
    - Hero concept: "Before / After" split — left side (chaos, manual tasks) / right side (clean, automated)
    - 3-step install process visual (icons connected by animated dotted line)
    - What hardware imagery/icon represents "Private AI" without being generic

    ## COLOUR USAGE MAP
    - When to use citrus (sparingly — maximum impact)
    - When to use signal green (live states, success, checkmarks)
    - When NOT to use either (most of the time — let the void breathe)

    ## MOTION SYSTEM
    - Page load sequence (what animates first, second, third)
    - Scroll-triggered animations (fade-up: distance, duration, stagger)
    - Hover micro-interactions (cards, buttons, links)
    - CTA button hover state (exact transition)

    Be specific enough that a developer can implement this without a Figma file.
    Include CSS/Tailwind class suggestions where helpful.
    """

    r = fire("product_strategist", brief_design.strip(), dry_run)
    save("phase-6-design.md", "Phase 6 — Design Specifications", r["output"])
    append_master("DESIGN SPECIFICATIONS", r["output"])

    return {"design": r["output"]}


def phase_7_eval(dry_run: bool) -> dict:
    """Quality gate — eval_judge scores all copy."""
    print(bold("\n╔══════════════════════════════════════════════════════╗"))
    print(bold("║  PHASE 6 — QUALITY GATE                              ║"))
    print(bold("╚══════════════════════════════════════════════════════╝\n"))

    # Read all phase outputs for evaluation
    summaries = []
    for f in sorted(OUTPUT_DIR.glob("phase-3-copy-*.md")):
        text = f.read_text(encoding="utf-8")[:500]
        summaries.append(f"### {f.stem}\n{text}\n")

    brief_eval = f"""
    EVAL JUDGE TASK: Grade the copy outputs for a website rebuild project.

    RUBRIC (score each 1-10):
    1. Clarity — would an SMB owner understand this immediately?
    2. Conversion potential — does it make them want to book?
    3. Specificity — concrete outcomes, not vague promises?
    4. Authenticity — sounds like a real person, not corporate AI?
    5. CTA strength — is the next action obvious and compelling?

    COPY SAMPLES TO EVALUATE:
    {''.join(summaries[:3])}

    DELIVER:
    - Score for each page (1-10 per rubric category)
    - Overall average
    - Top 3 strengths across the copy
    - Top 3 things to improve before going live
    - PASS / FAIL verdict (pass = avg 7+)
    - Specific rewrites for any headline scoring below 7
    """

    r = fire("eval_judge", brief_eval.strip(), dry_run)
    save("phase-7-eval.md", "Phase 7 — Quality Gate", r["output"])
    append_master("QUALITY GATE", r["output"])

    return {"eval": r["output"]}


# ── MAIN ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="jonnyai.co.uk Agent Build Orchestrator")
    parser.add_argument("--dry-run", action="store_true", help="Print briefs without firing")
    parser.add_argument("--phase", type=int, choices=[1,2,3,4,5,6,7], help="Run a single phase only")
    args = parser.parse_args()

    print(bold(cyan("""
╔═══════════════════════════════════════════════════════════════╗
║          jonnyai.co.uk — AGENT BUILD ORCHESTRATOR             ║
║          jAIlbreakO.S × Claude Code × LangGraph               ║
╚═══════════════════════════════════════════════════════════════╝
""")))
    print(f"  Target:   {BASE_URL}")
    print(f"  Output:   {OUTPUT_DIR}")
    print(f"  Phases:   {'ALL' if not args.phase else args.phase}")
    print(f"  Mode:     {'DRY RUN' if args.dry_run else 'LIVE'}\n")

    if not args.dry_run:
        # Init master context
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        MASTER_CTX.write_text(
            f"# MASTER CONTEXT — jonnyai.co.uk Rebuild\n"
            f"_Generated: {datetime.now().isoformat()}_\n"
            f"_Source: jAIlbreakO.S agent orchestration_\n",
            encoding="utf-8"
        )

    t_start = time.time()
    intel, strategy, copy, legal, launch, design, evaluation = {}, {}, {}, {}, {}, {}, {}

    run_all = args.phase is None

    if run_all or args.phase == 1:
        intel = phase_1_intelligence(args.dry_run)

    if run_all or args.phase == 2:
        strategy = phase_2_strategy(intel, args.dry_run)

    if run_all or args.phase == 3:
        copy = phase_3_copy(strategy, args.dry_run)

    if run_all or args.phase == 4:
        legal = phase_4_legal(args.dry_run)

    if run_all or args.phase == 5:
        all_out = {**intel, **strategy, **copy, **legal}
        launch = phase_5_launch(all_out, args.dry_run)

    if run_all or args.phase == 6:
        design = phase_6_design(args.dry_run)

    if run_all or args.phase == 7:
        evaluation = phase_7_eval(args.dry_run)

    elapsed = round(time.time() - t_start, 1)

    print(bold(green(f"""
╔═══════════════════════════════════════════════════════════════╗
║  BUILD COMPLETE                                               ║
╚═══════════════════════════════════════════════════════════════╝
""")))
    print(f"  Total time:     {elapsed}s")
    print(f"  Output dir:     {OUTPUT_DIR}")
    print(f"  Master context: {MASTER_CTX}")
    print(f"""
  NEXT STEPS:
  1. Review outputs in build-plan/outputs/
  2. Check phase-6-eval.md — fix any FAIL items
  3. Run Claude Code with MASTER_CONTEXT.md to implement
     → Claude reads all agent outputs and writes the Next.js pages
  4. Test locally: npm run dev
  5. Deploy: vercel --prod
""")


if __name__ == "__main__":
    main()
