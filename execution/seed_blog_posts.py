"""
seed_blog_posts.py
------------------
Seeds the Supabase blog_posts and projects_registry tables from the
canonical data in jonnyai.website/src/lib/data/blog-posts.ts.

Strategy: calls the /api/seed-blog route on the running Next.js site,
which reads blog-posts.ts directly and upserts to Supabase — single
source of truth, no data duplication.

Usage:
    python execution/seed_blog_posts.py              # live site
    python execution/seed_blog_posts.py --local       # localhost:3000
    python execution/seed_blog_posts.py --dry-run     # show what would run
"""

import sys
import os
import argparse
import json
import re
from pathlib import Path
from datetime import datetime, date

try:
    from supabase import create_client, Client
except ImportError:
    print("[ERROR] supabase-py not installed. Run: pip install supabase")
    sys.exit(1)

# ── Config ────────────────────────────────────────────────────────────────────
ROOT = Path(__file__).parent.parent
DOTENV = ROOT / ".env"

def load_env():
    """Load .env variables without requiring python-dotenv."""
    if not DOTENV.exists():
        return
    for line in DOTENV.read_text(encoding='utf-8', errors='ignore').splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        value = value.strip().strip('"').strip("'")
        if key.strip() not in os.environ:
            os.environ[key.strip()] = value

load_env()

SUPABASE_URL  = (
    os.environ.get("ANTIGRAVITY_BRAIN_URL") or
    os.environ.get("NEXT_PUBLIC_SHARED_BRAIN_URL", "")
)
SUPABASE_KEY  = (
    os.environ.get("ANTIGRAVITY_BRAIN_SERVICE_ROLE_KEY") or
    os.environ.get("SHARED_BRAIN_SERVICE_ROLE_KEY") or
    os.environ.get("ANTIGRAVITY_BRAIN_ANON_KEY") or
    os.environ.get("NEXT_PUBLIC_SHARED_BRAIN_ANON_KEY", "")
)

# ── Projects Registry ─────────────────────────────────────────────────────────
# All known projects. Add new entries here whenever a project is onboarded.
PROJECTS = [
    {
        "project_ref":       "gold-standard",
        "client_name":       "Antigravity Agency",
        "project_name":      "Gold Standard — AI Audit Agency",
        "description":       "Autonomous AI implementation audit product. 13-gate audit delivered automatically at £149/audit via Stripe + Resend. No human in the loop.",
        "project_type":      "internal_product",
        "industry":          "AI consulting",
        "tech_stack":        ["Next.js", "Supabase", "Stripe", "Resend", "Python"],
        "started_at":        "2026-02-10",
        "delivered_at":      "2026-02-20",
        "is_live":           True,
        "has_case_study":    True,
        "case_study_slug":   "gold-standard-autonomous-ai-audit-agency",
        "case_study_status": "published",
        "is_public":         True,
    },
    {
        "project_ref":       "agentflip",
        "client_name":       "Antigravity Agency",
        "project_name":      "AgentFlip — Autonomous Keyword Arbitrage Engine",
        "description":       "Autonomous digital arbitrage engine. Scavenger Engine identifies undervalued keywords, routes to landing page generation, monetises via affiliate/ad yield. Target: $5k MRR.",
        "project_type":      "internal_product",
        "industry":          "Digital marketing",
        "tech_stack":        ["Next.js", "Supabase", "Python", "Stripe"],
        "started_at":        "2026-02-15",
        "delivered_at":      "2026-02-20",
        "is_live":           True,
        "has_case_study":    True,
        "case_study_slug":   "agentflip-autonomous-keyword-arbitrage-engine",
        "case_study_status": "published",
        "is_public":         True,
    },
    {
        "project_ref":       "construct-fm",
        "client_name":       "Construct.fm",
        "project_name":      "Construct.fm Estimate Generator",
        "description":       "AI-powered construction estimate generator. Takes project parameters, outputs professional estimate PDF and Excel export. Delivered in 48 hours.",
        "project_type":      "client_product",
        "industry":          "Construction",
        "tech_stack":        ["Next.js", "Supabase", "Python", "Excel export"],
        "started_at":        "2026-02-16",
        "delivered_at":      "2026-02-17",
        "is_live":           True,
        "has_case_study":    True,
        "case_study_slug":   "construct-fm-estimate-generator",
        "case_study_status": "published",
        "is_public":         True,
    },
    {
        "project_ref":       "kliqt-crm",
        "client_name":       "KLIQT Media",
        "project_name":      "KLIQT CRM — Custom Operations Platform",
        "description":       "Bespoke CRM and ops platform for a creative agency. Client management, billing, project tracking, brand asset library. Delivered in 8 days.",
        "project_type":      "client_product",
        "industry":          "Creative agency",
        "tech_stack":        ["Next.js", "Supabase", "TypeScript"],
        "started_at":        "2025-05-02",
        "delivered_at":      "2025-05-10",
        "is_live":           True,
        "has_case_study":    True,
        "case_study_slug":   "kliqt-crm-custom-operations-platform",
        "case_study_status": "published",
        "is_public":         True,
    },
    {
        "project_ref":       "safeguardian",
        "client_name":       "Safeguardian",
        "project_name":      "Safeguardian — Child Digital Safety App",
        "description":       "Family-facing digital safety app. Transparent monitoring for parents, companion view for children. GDPR-compliant for under-18s. 7-day delivery.",
        "project_type":      "client_product",
        "industry":          "Family safety / EdTech",
        "tech_stack":        ["React Native", "Supabase", "TypeScript"],
        "started_at":        "2025-07-01",
        "delivered_at":      "2025-07-07",
        "is_live":           True,
        "has_case_study":    True,
        "case_study_slug":   "safeguardian-child-safety-app",
        "case_study_status": "published",
        "is_public":         True,
    },
    {
        "project_ref":       "longleat-facilities",
        "client_name":       "Longleat",
        "project_name":      "Longleat Facilities Hub — HACCP Compliance",
        "description":       "Digital HACCP compliance and facilities management system for a major UK visitor attraction. Mobile-first, audit-ready, team-adopted.",
        "project_type":      "client_product",
        "industry":          "Hospitality / Visitor attractions",
        "tech_stack":        ["Next.js", "Supabase", "TypeScript"],
        "started_at":        "2025-10-20",
        "delivered_at":      "2025-10-25",
        "is_live":           True,
        "has_case_study":    True,
        "case_study_slug":   "longleat-facilities-hub-haccp-compliance",
        "case_study_status": "published",
        "is_public":         True,
    },
    {
        "project_ref":       "la-aesthetician",
        "client_name":       "La Aesthetician",
        "project_name":      "La Aesthetician — Luxury Beauty Website",
        "description":       "Full brand identity and premium website for a luxury aesthetics clinic. New visual identity, service pages, booking enquiry flow, local SEO. 48-hour delivery.",
        "project_type":      "client_site",
        "industry":          "Aesthetics / Beauty",
        "tech_stack":        ["Next.js", "Tailwind", "TypeScript"],
        "started_at":        "2025-12-28",
        "delivered_at":      "2025-12-29",
        "is_live":           True,
        "has_case_study":    True,
        "case_study_slug":   "la-aesthetician-luxury-beauty-brand-website",
        "case_study_status": "published",
        "is_public":         True,
    },
    {
        "project_ref":       "insydetradar",
        "client_name":       "Insydetradar",
        "project_name":      "Insydetradar — Autonomous Trading Infrastructure",
        "description":       "Full-stack autonomous financial trading infrastructure. Market feed ingestion, strategy execution engine, risk management, monitoring dashboard.",
        "project_type":      "client_product",
        "industry":          "Fintech / Trading",
        "tech_stack":        ["Python", "Next.js", "Supabase", "TypeScript"],
        "started_at":        "2026-01-20",
        "delivered_at":      "2026-01-28",
        "is_live":           True,
        "has_case_study":    True,
        "case_study_slug":   "insydetradar-autonomous-trading-infrastructure",
        "case_study_status": "published",
        "is_public":         True,
    },
    {
        "project_ref":       "chatterbox",
        "client_name":       "Chatterbox",
        "project_name":      "Chatterbox — AI Voice Cloning & TTS App",
        "description":       "Consumer-grade AI voice cloning and infinite text-to-speech application. GDPR-compliant onboarding, generation queue management, Stripe billing.",
        "project_type":      "client_product",
        "industry":          "AI / Consumer apps",
        "tech_stack":        ["Next.js", "Supabase", "Stripe", "TypeScript"],
        "started_at":        "2026-01-26",
        "delivered_at":      "2026-01-28",
        "is_live":           True,
        "has_case_study":    True,
        "case_study_slug":   "chatterbox-ai-voice-cloning-app",
        "case_study_status": "published",
        "is_public":         True,
    },
    {
        "project_ref":       "bl-motorcycles",
        "client_name":       "BL Motorcycles Ltd",
        "project_name":      "BL Motorcycles — Business Website",
        "description":       "Clean, fast, mobile-first business website for a UK motorcycles firm. Local SEO optimised.",
        "project_type":      "client_site",
        "industry":          "Automotive",
        "tech_stack":        ["Next.js", "Tailwind"],
        "started_at":        "2025-06-10",
        "delivered_at":      "2025-07-10",
        "is_live":           True,
        "has_case_study":    False,
        "case_study_status": "none",
        "is_public":         True,
    },
    {
        "project_ref":       "sparta-interiors",
        "client_name":       "Sparta Interiors",
        "project_name":      "Sparta Interiors — Portfolio Website",
        "description":       "Luxury interior design portfolio website. High-resolution imagery, premium transitions, conversion-focused contact flow.",
        "project_type":      "client_site",
        "industry":          "Interior design",
        "tech_stack":        ["Next.js", "Framer Motion", "Tailwind"],
        "started_at":        "2025-06-13",
        "delivered_at":      "2025-06-14",
        "is_live":           True,
        "has_case_study":    False,
        "case_study_status": "none",
        "is_public":         True,
    },
    {
        "project_ref":       "dj-waste",
        "client_name":       "DJ Waste",
        "project_name":      "DJ Waste — Skip Hire Website",
        "description":       "Skip hire and waste management website. Pricing, booking enquiry, local SEO.",
        "project_type":      "client_site",
        "industry":          "Waste management",
        "tech_stack":        ["Next.js", "Tailwind"],
        "started_at":        "2025-06-14",
        "delivered_at":      "2025-06-14",
        "is_live":           True,
        "has_case_study":    False,
        "case_study_status": "none",
        "is_public":         True,
    },
    {
        "project_ref":       "village-bakery",
        "client_name":       "Village Bakery and Café",
        "project_name":      "Village Bakery — Website",
        "description":       "Website for a local bakery and café. Menu display, location, contact.",
        "project_type":      "client_site",
        "industry":          "Hospitality / Food",
        "tech_stack":        ["Next.js", "Tailwind"],
        "started_at":        "2026-01-03",
        "delivered_at":      "2026-01-05",
        "is_live":           True,
        "has_case_study":    False,
        "case_study_status": "none",
        "is_public":         True,
    },
    {
        "project_ref":       "jsc-contractors",
        "client_name":       "JSC Contractors",
        "project_name":      "JSC Contractors — Premium Website",
        "description":       "Premium contractor company website. Services, portfolio, quote request flow.",
        "project_type":      "client_site",
        "industry":          "Construction / Contracting",
        "tech_stack":        ["Next.js", "Tailwind"],
        "started_at":        "2026-01-13",
        "delivered_at":      "2026-01-13",
        "is_live":           True,
        "has_case_study":    False,
        "case_study_status": "none",
        "is_public":         True,
    },
]

# ── Helpers ───────────────────────────────────────────────────────────────────

def header(text: str) -> None:
    print(f"\n{'-'*60}")
    print(f"  {text}")
    print(f"{'-'*60}")

def ok(msg: str) -> None:
    print(f"  [OK] {msg}")

def warn(msg: str) -> None:
    print(f"  [WARN] {msg}")

def err(msg: str) -> None:
    print(f"  [ERR] {msg}")


# ── Main ──────────────────────────────────────────────────────────────────────

def run(dry_run: bool = False) -> None:
    if not SUPABASE_URL or not SUPABASE_KEY:
        err("Missing SUPABASE_URL or SUPABASE_KEY — check .env")
        sys.exit(1)

    print(f"\n  Supabase URL : {SUPABASE_URL[:40]}...")
    print(f"  Dry run      : {dry_run}")

    if dry_run:
        header("DRY RUN — Projects registry")
        for p in PROJECTS:
            print(f"  Would upsert: {p['project_ref']} ({p['client_name']})")
        header("DRY RUN — Blog posts")
        print("  Blog posts are seeded via /api/seed-blog on the Next.js site.")
        print("  Run without --dry-run to execute.")
        return

    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

    # ── 1. Upsert projects registry ───────────────────────────
    # Note: case_study_slug is stripped on first pass to avoid FK constraint
    # violation (blog_posts may not be seeded yet). A second-pass update
    # is done in Step 3 after blog posts exist.
    header("STEP 1 - Upsert projects_registry (without case_study_slug)")
    case_study_links: list[dict] = []
    for project in PROJECTS:
        row = {k: v for k, v in project.items() if k != "case_study_slug"}
        result = supabase.table("projects_registry").upsert(
            row, on_conflict="project_ref"
        ).execute()
        if hasattr(result, "error") and result.error:
            err(f"{project['project_ref']}: {result.error}")
        else:
            ok(f"Upserted: {project['project_ref']}")
            if project.get("case_study_slug"):
                case_study_links.append({
                    "project_ref": project["project_ref"],
                    "case_study_slug": project["case_study_slug"],
                })

    # ── 2. Seed blog posts ────────────────────────────────────
    header("STEP 2 — Seed blog posts from blog-posts.ts")
    print("  NOTE: Blog post content lives in jonnyai.website/src/lib/data/blog-posts.ts")
    print("  To seed Supabase from that file, use the /api/seed-blog endpoint:")
    print("  POST https://jonnyai.co.uk/api/seed-blog  (requires BLOG_SEED_SECRET)")
    print("  Or run: python execution/seed_blog_posts.py --via-api")

    # ── 3. Link case_study_slug (only if blog posts exist) ────
    if case_study_links:
        header("STEP 3 - Link case_study_slug in projects_registry")
        for link in case_study_links:
            # Check the blog post exists first
            check = supabase.table("blog_posts").select("slug").eq("slug", link["case_study_slug"]).execute()
            if check.data:
                supabase.table("projects_registry").update(
                    {"case_study_slug": link["case_study_slug"]}
                ).eq("project_ref", link["project_ref"]).execute()
                ok(f"Linked {link['project_ref']} -> {link['case_study_slug']}")
            else:
                warn(f"Blog post not found yet: {link['case_study_slug']} (run --via-api then re-run)")

    header("DONE")
    print("  projects_registry: seeded")
    print("  blog_posts: use /api/seed-blog to push content from blog-posts.ts")
    print("  To link case_study_slugs: seed blog posts first, then re-run this script")
    print()


def run_via_api(site_url: str, secret: str, dry_run: bool = False) -> None:
    """Call the Next.js /api/seed-blog endpoint to seed blog posts."""
    try:
        import urllib.request
        import json as jsonlib
    except ImportError:
        err("urllib not available")
        return

    url = f"{site_url.rstrip('/')}/api/seed-blog"
    print(f"\n  POST {url}")

    if dry_run:
        print("  [DRY RUN] Would POST to seed-blog endpoint")
        return

    payload = jsonlib.dumps({"secret": secret}).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            body = jsonlib.loads(resp.read().decode())
            ok(f"Seeded {body.get('count', '?')} posts")
    except Exception as e:
        err(f"API seed failed: {e}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed Supabase blog tables")
    parser.add_argument("--dry-run", action="store_true", help="Show what would run without executing")
    parser.add_argument("--via-api", action="store_true", help="Seed blog posts via Next.js API route")
    parser.add_argument("--site-url", default="https://jonnyai.co.uk", help="Site URL for --via-api")
    args = parser.parse_args()

    run(dry_run=args.dry_run)

    if args.via_api:
        secret = os.environ.get("BLOG_SEED_SECRET", "")
        if not secret:
            warn("BLOG_SEED_SECRET not set in .env — /api/seed-blog will reject")
        run_via_api(args.site_url, secret, dry_run=args.dry_run)
