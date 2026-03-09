"""
upgrade_methodology_files.py — PR1 Fix: Make Methodology Files v5.0 Compliant
===============================================================================
Jai.OS 5.0 | Antigravity Orchestra

Adds YAML frontmatter (skill card) and standardized structure to all 135
methodology files in .agent/skills/methodology/*/SKILL.md.

Methodology files are composable skills — they are NOT full agents.
They get a lightweight YAML frontmatter with:
  - name (skill ID)
  - version
  - description (extracted from existing content)
  - category (auto-detected from skill name)
  - complexity (low/medium/high based on content length)
  - domains (auto-tagged from content keywords)
  - compatible_agents (agents that reference this skill)

Usage:
  python execution/upgrade_methodology_files.py                 # Upgrade all
  python execution/upgrade_methodology_files.py --dry-run       # Preview only
  python execution/upgrade_methodology_files.py --skill darts-checkout-calculator  # Single skill
  python execution/upgrade_methodology_files.py --report        # Generate compliance report

"""

import os
import re
import sys
import json
import argparse
from pathlib import Path
from datetime import datetime

METHODOLOGY_DIR = Path(".agent/skills/methodology")

# Category detection keywords
CATEGORY_MAP = {
    "testing": ["test", "qa", "debug", "flak", "regression", "synthetic"],
    "security": ["security", "credential", "compliance", "hardening", "audit"],
    "devops": ["ci", "pipeline", "docker", "deploy", "rollback", "migration", "environment"],
    "design": ["design", "css", "ux", "motion", "theme", "canvas", "visual", "dashboard"],
    "data": ["data", "database", "schema", "vector", "pipeline", "backfill"],
    "ai": ["llm", "model", "prompt", "inference", "hallucination", "agent", "mcp", "context-window"],
    "marketing": ["seo", "content", "audience", "conversion", "funnel", "social", "brand", "nps", "offer"],
    "betting": ["darts", "football", "horse", "f1", "motogp", "roulette", "odds", "lay", "arbitrage", "bet"],
    "operations": ["incident", "runbook", "sla", "postmortem", "escalation", "handoff", "governance"],
    "education": ["course", "curriculum", "assessment", "module", "onboarding"],
    "performance": ["performance", "bundle", "edge", "memory-leak", "cost-anomaly", "capacity"],
    "api": ["api", "rate-limit", "contract", "documentation"],
    "research": ["competitive", "benchmark", "sentiment", "signal", "forecast", "scenario"],
    "project": ["project", "deadline", "resource", "kpi", "improvement", "team", "skill-supply"],
}


def detect_category(skill_name, content):
    """Auto-detect the category from skill name and content."""
    name_lower = skill_name.lower()
    content_lower = content.lower()

    scores = {}
    for cat, keywords in CATEGORY_MAP.items():
        score = 0
        for kw in keywords:
            if kw in name_lower:
                score += 3
            if kw in content_lower:
                score += 1
        if score > 0:
            scores[cat] = score

    if scores:
        return max(scores, key=scores.get)
    return "general"


def detect_complexity(content):
    """Estimate complexity from content length and structure."""
    lines = content.strip().split("\n")
    steps = len([l for l in lines if re.match(r'^\d+\.', l.strip())])
    words = len(content.split())

    if words > 300 or steps > 8:
        return "high"
    elif words > 150 or steps > 4:
        return "medium"
    return "low"


def extract_description(content):
    """Extract the description from the existing content."""
    # Look for ## Description section
    match = re.search(r'## Description\s*\n(.+?)(?=\n##|\Z)', content, re.DOTALL)
    if match:
        desc = match.group(1).strip()
        # Take first sentence or first 120 chars
        first_sentence = desc.split(". ")[0].strip()
        if len(first_sentence) > 120:
            first_sentence = first_sentence[:117] + "..."
        return first_sentence + ("." if not first_sentence.endswith(".") else "")
    # Fallback: use the title
    match = re.search(r'^# (.+)', content)
    if match:
        return match.group(1).strip()
    return "Methodology skill"


def extract_domains(skill_name, content):
    """Extract domain tags from skill name and content."""
    domains = set()
    name_lower = skill_name.lower()
    content_lower = content.lower()

    # From category detection
    for cat, keywords in CATEGORY_MAP.items():
        for kw in keywords:
            if kw in name_lower:
                domains.add(cat)
                break

    # Add specific domain tags from content
    domain_keywords = {
        "web": ["html", "css", "react", "vue", "frontend", "web"],
        "backend": ["api", "server", "database", "sql"],
        "analytics": ["metric", "kpi", "dashboard", "analytics"],
        "automation": ["automat", "pipeline", "workflow", "cron"],
    }
    for domain, kws in domain_keywords.items():
        for kw in kws:
            if kw in content_lower:
                domains.add(domain)
                break

    return sorted(list(domains))[:5] if domains else ["general"]


def build_yaml_frontmatter(skill_name, description, category, complexity, domains):
    """Build the YAML frontmatter for a methodology file."""
    domains_str = ", ".join([f'"{d}"' for d in domains])
    return f"""---
# Methodology Skill Card — Jai.OS 5.0
name: "{skill_name}"
version: "1.0.0"
type: methodology
description: "{description}"
category: {category}
complexity: {complexity}
domains: [{domains_str}]
updated: "{datetime.utcnow().strftime('%Y-%m-%d')}"
---
"""


def upgrade_file(skill_dir, dry_run=False):
    """Upgrade a single methodology SKILL.md to v5.0 format."""
    skill_name = skill_dir.name
    skill_file = skill_dir / "SKILL.md"

    if not skill_file.exists():
        return {"skill": skill_name, "status": "missing", "message": "No SKILL.md found"}

    content = skill_file.read_text()

    # Already has YAML frontmatter?
    if content.strip().startswith("---"):
        return {"skill": skill_name, "status": "already_compliant", "message": "Already has YAML frontmatter"}

    # Extract metadata
    description = extract_description(content)
    category = detect_category(skill_name, content)
    complexity = detect_complexity(content)
    domains = extract_domains(skill_name, content)

    # Build new content
    frontmatter = build_yaml_frontmatter(skill_name, description, category, complexity, domains)
    new_content = frontmatter + "\n" + content

    if dry_run:
        return {
            "skill": skill_name,
            "status": "would_upgrade",
            "category": category,
            "complexity": complexity,
            "domains": domains,
            "description": description[:80]
        }

    # Write upgraded file
    skill_file.write_text(new_content)
    return {
        "skill": skill_name,
        "status": "upgraded",
        "category": category,
        "complexity": complexity,
        "domains": domains
    }


def generate_report():
    """Generate a compliance report for all methodology files."""
    compliant = 0
    non_compliant = 0
    missing = 0
    categories = {}

    for skill_dir in sorted(METHODOLOGY_DIR.iterdir()):
        if not skill_dir.is_dir():
            continue
        skill_file = skill_dir / "SKILL.md"
        if not skill_file.exists():
            missing += 1
            continue

        content = skill_file.read_text()
        if content.strip().startswith("---"):
            compliant += 1
            # Extract category from frontmatter
            cat_match = re.search(r'category:\s*(\w+)', content)
            cat = cat_match.group(1) if cat_match else "unknown"
            categories[cat] = categories.get(cat, 0) + 1
        else:
            non_compliant += 1

    total = compliant + non_compliant + missing
    print(f"\n{'='*50}")
    print(f"METHODOLOGY FILE COMPLIANCE REPORT")
    print(f"{'='*50}")
    print(f"  Total files:     {total}")
    print(f"  v5.0 Compliant:  {compliant} ({compliant*100//max(total,1)}%)")
    print(f"  Non-compliant:   {non_compliant}")
    print(f"  Missing:         {missing}")
    print(f"\n  Categories:")
    for cat, count in sorted(categories.items(), key=lambda x: -x[1]):
        print(f"    {cat}: {count}")
    print(f"{'='*50}")


def main():
    parser = argparse.ArgumentParser(description="Upgrade methodology files to Jai.OS 5.0")
    parser.add_argument("--dry-run", action="store_true", help="Preview changes without writing")
    parser.add_argument("--skill", type=str, help="Upgrade a single skill by name")
    parser.add_argument("--report", action="store_true", help="Generate compliance report")
    args = parser.parse_args()

    if args.report:
        generate_report()
        return

    if args.skill:
        skill_dir = METHODOLOGY_DIR / args.skill
        if not skill_dir.exists():
            print(f"ERROR: Skill directory not found: {skill_dir}")
            sys.exit(1)
        result = upgrade_file(skill_dir, dry_run=args.dry_run)
        print(f"  {result['status']}: {result['skill']}")
        if 'description' in result:
            print(f"    Description: {result['description']}")
        if 'category' in result:
            print(f"    Category: {result['category']}")
        if 'domains' in result:
            print(f"    Domains: {result['domains']}")
        return

    # Upgrade all
    print(f"{'='*50}")
    print(f"METHODOLOGY FILE v5.0 UPGRADE {'(DRY RUN)' if args.dry_run else ''}")
    print(f"{'='*50}")

    upgraded = 0
    skipped = 0
    errors = 0
    categories = {}

    for skill_dir in sorted(METHODOLOGY_DIR.iterdir()):
        if not skill_dir.is_dir():
            continue

        try:
            result = upgrade_file(skill_dir, dry_run=args.dry_run)
            status = result['status']

            if status in ('upgraded', 'would_upgrade'):
                upgraded += 1
                cat = result.get('category', 'unknown')
                categories[cat] = categories.get(cat, 0) + 1
                print(f"  ✅ {result['skill']} → {cat} ({result.get('complexity', '?')})")
            elif status == 'already_compliant':
                skipped += 1
                print(f"  ⏭️  {result['skill']} (already compliant)")
            else:
                errors += 1
                print(f"  ❌ {result['skill']}: {result.get('message', 'unknown error')}")
        except Exception as e:
            errors += 1
            print(f"  ❌ {skill_dir.name}: {e}")

    print(f"\n{'='*50}")
    print(f"SUMMARY")
    print(f"  {'Would upgrade' if args.dry_run else 'Upgraded'}: {upgraded}")
    print(f"  Skipped (already compliant): {skipped}")
    print(f"  Errors: {errors}")
    print(f"\n  Categories:")
    for cat, count in sorted(categories.items(), key=lambda x: -x[1]):
        print(f"    {cat}: {count}")
    print(f"{'='*50}")


if __name__ == "__main__":
    main()
