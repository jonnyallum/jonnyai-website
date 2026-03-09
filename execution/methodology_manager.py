"""
methodology_manager.py — PR2 Fix: Methodology File Maintenance Tool
====================================================================
Jai.OS 5.0 | Antigravity Orchestra

Provides ongoing maintenance capabilities for the 135+ methodology files:
  - validate: Check all files for v5.0 compliance
  - audit: Deep audit checking content quality, missing sections, etc.
  - search: Find methodology skills by keyword, category, or domain
  - link: Show which agents reference which methodology skills
  - create: Scaffold a new methodology skill from a template
  - stats: Show statistics about the methodology library

Usage:
  python execution/methodology_manager.py validate
  python execution/methodology_manager.py audit
  python execution/methodology_manager.py search --query "testing"
  python execution/methodology_manager.py search --category betting
  python execution/methodology_manager.py link --agent neo
  python execution/methodology_manager.py create --name "new-skill-name" --category testing
  python execution/methodology_manager.py stats
"""

import os
import re
import sys
import json
import yaml
import argparse
from pathlib import Path
from datetime import datetime

METHODOLOGY_DIR = Path(".agent/skills/methodology")
AGENTS_DIR = Path(".agent/skills")


def load_skill(skill_dir):
    """Load a methodology skill file and parse its frontmatter."""
    skill_file = skill_dir / "SKILL.md"
    if not skill_file.exists():
        return None

    content = skill_file.read_text()
    metadata = {}
    body = content

    # Parse YAML frontmatter
    if content.strip().startswith("---"):
        parts = content.split("---", 2)
        if len(parts) >= 3:
            try:
                metadata = yaml.safe_load(parts[1]) or {}
            except yaml.YAMLError:
                metadata = {"_parse_error": True}
            body = parts[2]

    return {
        "name": skill_dir.name,
        "metadata": metadata,
        "body": body,
        "path": str(skill_file),
        "has_frontmatter": bool(metadata and "_parse_error" not in metadata),
    }


def cmd_validate(args):
    """Validate all methodology files for v5.0 compliance."""
    print(f"\n{'='*60}")
    print(f"METHODOLOGY VALIDATION — Jai.OS 5.0 Compliance Check")
    print(f"{'='*60}\n")

    issues = []
    compliant = 0
    total = 0

    for skill_dir in sorted(METHODOLOGY_DIR.iterdir()):
        if not skill_dir.is_dir():
            continue
        total += 1
        skill = load_skill(skill_dir)

        if not skill:
            issues.append(f"  ❌ {skill_dir.name}: No SKILL.md file")
            continue

        skill_issues = []

        # Check frontmatter
        if not skill["has_frontmatter"]:
            skill_issues.append("Missing YAML frontmatter")

        # Check required frontmatter fields
        required_fields = ["name", "version", "type", "description", "category"]
        for field in required_fields:
            if field not in skill["metadata"]:
                skill_issues.append(f"Missing frontmatter field: {field}")

        # Check body sections
        body = skill["body"]
        if "## Description" not in body and "# " not in body:
            skill_issues.append("Missing Description section")
        if "## Implementation" not in body and "## Instructions" not in body:
            skill_issues.append("Missing Implementation section")
        if "## Constraints" not in body:
            skill_issues.append("Missing Constraints section")

        # Check content quality
        word_count = len(body.split())
        if word_count < 30:
            skill_issues.append(f"Content too thin ({word_count} words)")

        if skill_issues:
            issues.append(f"  ⚠️  {skill_dir.name}:")
            for issue in skill_issues:
                issues.append(f"      - {issue}")
        else:
            compliant += 1

    # Report
    if issues:
        print("Issues found:")
        for issue in issues:
            print(issue)
    print(f"\n{'='*60}")
    print(f"  Total: {total} | Compliant: {compliant} | Issues: {total - compliant}")
    print(f"  Compliance rate: {compliant * 100 // max(total, 1)}%")
    print(f"{'='*60}")


def cmd_audit(args):
    """Deep audit of methodology file quality."""
    print(f"\n{'='*60}")
    print(f"METHODOLOGY DEEP AUDIT")
    print(f"{'='*60}\n")

    thin_content = []
    no_constraints = []
    no_steps = []
    categories = {}
    complexities = {"low": 0, "medium": 0, "high": 0}
    total_words = 0

    for skill_dir in sorted(METHODOLOGY_DIR.iterdir()):
        if not skill_dir.is_dir():
            continue
        skill = load_skill(skill_dir)
        if not skill:
            continue

        body = skill["body"]
        words = len(body.split())
        total_words += words

        cat = skill["metadata"].get("category", "unknown")
        categories[cat] = categories.get(cat, 0) + 1

        comp = skill["metadata"].get("complexity", "unknown")
        if comp in complexities:
            complexities[comp] += 1

        if words < 50:
            thin_content.append(f"  {skill['name']} ({words} words)")
        if "## Constraints" not in body:
            no_constraints.append(f"  {skill['name']}")
        if not re.search(r'^\d+\.', body, re.MULTILINE):
            no_steps.append(f"  {skill['name']}")

    print(f"📊 Library Statistics:")
    print(f"  Total skills: {sum(categories.values())}")
    print(f"  Total words: {total_words:,}")
    print(f"  Avg words/skill: {total_words // max(sum(categories.values()), 1)}")
    print(f"\n📂 Categories:")
    for cat, count in sorted(categories.items(), key=lambda x: -x[1]):
        print(f"  {cat}: {count}")
    print(f"\n📏 Complexity Distribution:")
    for comp, count in complexities.items():
        print(f"  {comp}: {count}")

    if thin_content:
        print(f"\n⚠️  Thin Content (<50 words): {len(thin_content)}")
        for item in thin_content[:10]:
            print(item)
    if no_constraints:
        print(f"\n⚠️  Missing Constraints Section: {len(no_constraints)}")
        for item in no_constraints[:10]:
            print(item)
    if no_steps:
        print(f"\n⚠️  Missing Numbered Steps: {len(no_steps)}")
        for item in no_steps[:10]:
            print(item)


def cmd_search(args):
    """Search methodology skills by keyword, category, or domain."""
    query = (args.query or "").lower()
    category = (args.category or "").lower()
    domain = (args.domain or "").lower()

    if not query and not category and not domain:
        print("ERROR: Provide --query, --category, or --domain")
        return

    results = []
    for skill_dir in sorted(METHODOLOGY_DIR.iterdir()):
        if not skill_dir.is_dir():
            continue
        skill = load_skill(skill_dir)
        if not skill:
            continue

        match = False
        if query:
            if query in skill["name"].lower() or query in skill["body"].lower():
                match = True
            if query in str(skill["metadata"].get("description", "")).lower():
                match = True
        if category:
            if skill["metadata"].get("category", "").lower() == category:
                match = True
        if domain:
            domains = skill["metadata"].get("domains", [])
            if domain in [d.lower() for d in domains]:
                match = True

        if match:
            results.append(skill)

    print(f"\n🔍 Search Results: {len(results)} match(es)\n")
    for skill in results:
        meta = skill["metadata"]
        desc = meta.get("description", "No description")[:80]
        cat = meta.get("category", "?")
        comp = meta.get("complexity", "?")
        print(f"  📄 {skill['name']}")
        print(f"     Category: {cat} | Complexity: {comp}")
        print(f"     {desc}")
        print()


def cmd_link(args):
    """Show which agents reference which methodology skills."""
    agent_name = args.agent

    if agent_name:
        # Show skills linked to a specific agent
        agent_file = AGENTS_DIR / agent_name / "SKILL.md"
        if not agent_file.exists():
            print(f"ERROR: Agent {agent_name} not found")
            return

        content = agent_file.read_text()
        # Find composable_skills references
        skills_found = []
        for skill_dir in sorted(METHODOLOGY_DIR.iterdir()):
            if not skill_dir.is_dir():
                continue
            if skill_dir.name in content:
                skills_found.append(skill_dir.name)

        print(f"\n🔗 Methodology skills referenced by @{agent_name}: {len(skills_found)}")
        for s in skills_found:
            print(f"  - {s}")
    else:
        # Show all agent-skill links
        print(f"\n🔗 Agent → Methodology Skill Links\n")
        for agent_dir in sorted(AGENTS_DIR.iterdir()):
            if not agent_dir.is_dir() or agent_dir.name == "methodology":
                continue
            agent_file = agent_dir / "SKILL.md"
            if not agent_file.exists():
                continue
            content = agent_file.read_text()
            linked = []
            for skill_dir in sorted(METHODOLOGY_DIR.iterdir()):
                if not skill_dir.is_dir():
                    continue
                if skill_dir.name in content:
                    linked.append(skill_dir.name)
            if linked:
                print(f"  @{agent_dir.name}: {', '.join(linked)}")


def cmd_create(args):
    """Create a new methodology skill from template."""
    name = args.name
    category = args.category or "general"
    description = args.description or f"Methodology skill for {name.replace('-', ' ')}"

    skill_dir = METHODOLOGY_DIR / name
    if skill_dir.exists():
        print(f"ERROR: Skill {name} already exists at {skill_dir}")
        return

    skill_dir.mkdir(parents=True)
    skill_file = skill_dir / "SKILL.md"

    template = f"""---
# Methodology Skill Card — Jai.OS 5.0
name: "{name}"
version: "1.0.0"
type: methodology
description: "{description}"
category: {category}
complexity: medium
domains: ["{category}"]
updated: "{datetime.utcnow().strftime('%Y-%m-%d')}"
---

# {name.replace('-', ' ').title()}

## Description

{description}

## Goal

[Define the specific outcome this methodology achieves]

## Implementation Instructions

1. **Step 1:** [First action]
2. **Step 2:** [Second action]
3. **Step 3:** [Third action]
4. **Step 4:** [Fourth action]

## Constraints

- **DO NOT** [constraint 1]
- **ALWAYS** [constraint 2]
- **DO NOT** [constraint 3]
"""

    skill_file.write_text(template)
    print(f"✅ Created new methodology skill: {name}")
    print(f"   Path: {skill_file}")
    print(f"   Category: {category}")
    print(f"   Edit the file to add implementation details.")


def cmd_stats(args):
    """Show statistics about the methodology library."""
    print(f"\n{'='*60}")
    print(f"METHODOLOGY LIBRARY STATISTICS")
    print(f"{'='*60}\n")

    total = 0
    categories = {}
    complexities = {}
    domains_all = {}
    total_words = 0
    has_frontmatter = 0

    for skill_dir in sorted(METHODOLOGY_DIR.iterdir()):
        if not skill_dir.is_dir():
            continue
        total += 1
        skill = load_skill(skill_dir)
        if not skill:
            continue

        if skill["has_frontmatter"]:
            has_frontmatter += 1

        meta = skill["metadata"]
        cat = meta.get("category", "unknown")
        categories[cat] = categories.get(cat, 0) + 1

        comp = meta.get("complexity", "unknown")
        complexities[comp] = complexities.get(comp, 0) + 1

        for d in meta.get("domains", []):
            domains_all[d] = domains_all.get(d, 0) + 1

        total_words += len(skill["body"].split())

    print(f"  Total skills:        {total}")
    print(f"  v5.0 compliant:      {has_frontmatter} ({has_frontmatter * 100 // max(total, 1)}%)")
    print(f"  Total words:         {total_words:,}")
    print(f"  Avg words/skill:     {total_words // max(total, 1)}")

    print(f"\n  Categories ({len(categories)}):")
    for cat, count in sorted(categories.items(), key=lambda x: -x[1]):
        bar = "█" * count
        print(f"    {cat:20s} {count:3d} {bar}")

    print(f"\n  Complexity:")
    for comp, count in sorted(complexities.items(), key=lambda x: -x[1]):
        print(f"    {comp:10s} {count}")

    print(f"\n  Top Domains:")
    for dom, count in sorted(domains_all.items(), key=lambda x: -x[1])[:10]:
        print(f"    {dom:20s} {count}")

    print(f"\n{'='*60}")


def main():
    parser = argparse.ArgumentParser(description="Methodology File Maintenance Tool")
    subparsers = parser.add_subparsers(dest="command")

    subparsers.add_parser("validate", help="Validate all files for v5.0 compliance")
    subparsers.add_parser("audit", help="Deep audit of content quality")

    search_p = subparsers.add_parser("search", help="Search methodology skills")
    search_p.add_argument("--query", type=str, help="Keyword to search for")
    search_p.add_argument("--category", type=str, help="Filter by category")
    search_p.add_argument("--domain", type=str, help="Filter by domain")

    link_p = subparsers.add_parser("link", help="Show agent-skill links")
    link_p.add_argument("--agent", type=str, help="Specific agent to check")

    create_p = subparsers.add_parser("create", help="Create a new methodology skill")
    create_p.add_argument("--name", required=True, help="Skill name (kebab-case)")
    create_p.add_argument("--category", type=str, help="Category")
    create_p.add_argument("--description", type=str, help="Description")

    subparsers.add_parser("stats", help="Show library statistics")

    args = parser.parse_args()

    commands = {
        "validate": cmd_validate,
        "audit": cmd_audit,
        "search": cmd_search,
        "link": cmd_link,
        "create": cmd_create,
        "stats": cmd_stats,
    }

    if args.command in commands:
        commands[args.command](args)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
