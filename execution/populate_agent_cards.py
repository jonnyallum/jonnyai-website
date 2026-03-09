"""
Populate Agent Cards — Upgrade all agent YAML frontmatter to Jai.OS 5.0 standard.

Reads each agent's existing SKILL.md, infers routing metadata, composable skills,
fallback chains, and circuit breakers from their capabilities and domain, then
writes the upgraded YAML frontmatter back to the file.

Usage:
  # Dry run
  python execution/populate_agent_cards.py --dry-run

  # Execute
  python execution/populate_agent_cards.py
"""

import argparse
import re
import json
from pathlib import Path
from datetime import datetime

ROOT_DIR = Path(__file__).parent.parent
SKILLS_DIR = ROOT_DIR / ".agent" / "skills"
MEMORY_DIR = ROOT_DIR / ".agent" / "memory"
RALPH_HISTORY = MEMORY_DIR / "ralph-history.json"

# Domain-to-routing mapping: infer routing metadata from tier and capabilities
TIER_ROUTING = {
    "Command": {
        "input_types": ["text", "data"],
        "output_types": ["text", "report"],
        "cost_tier": "high",
        "latency_tier": "fast",
    },
    "Development": {
        "input_types": ["text", "code", "data"],
        "output_types": ["code", "file", "text"],
        "cost_tier": "medium",
        "latency_tier": "medium",
    },
    "Design & Creative": {
        "input_types": ["text", "image", "url"],
        "output_types": ["file", "code", "text"],
        "cost_tier": "medium",
        "latency_tier": "medium",
    },
    "Growth & Marketing": {
        "input_types": ["text", "data", "url"],
        "output_types": ["text", "report", "data"],
        "cost_tier": "medium",
        "latency_tier": "medium",
    },
    "Intelligence & Research": {
        "input_types": ["text", "url", "data"],
        "output_types": ["report", "data", "text"],
        "cost_tier": "medium",
        "latency_tier": "slow",
    },
    "Operations & Support": {
        "input_types": ["text", "data"],
        "output_types": ["text", "data", "report"],
        "cost_tier": "low",
        "latency_tier": "fast",
    },
    "Legal & Compliance": {
        "input_types": ["text", "data"],
        "output_types": ["report", "text"],
        "cost_tier": "medium",
        "latency_tier": "slow",
    },
    "Specialized Ecosystems": {
        "input_types": ["text", "data"],
        "output_types": ["file", "text", "report"],
        "cost_tier": "medium",
        "latency_tier": "medium",
    },
    "Quality & Verification": {
        "input_types": ["text", "code", "data"],
        "output_types": ["report", "text"],
        "cost_tier": "low",
        "latency_tier": "fast",
    },
    "Betting Ecosystem": {
        "input_types": ["text", "data", "url"],
        "output_types": ["data", "report", "text"],
        "cost_tier": "medium",
        "latency_tier": "medium",
    },
    "Education & Course Design": {
        "input_types": ["text", "data"],
        "output_types": ["file", "text", "report"],
        "cost_tier": "medium",
        "latency_tier": "slow",
    },
    # Non-standard tier aliases
    "Legal & Safety": {
        "input_types": ["text", "data"],
        "output_types": ["report", "text"],
        "cost_tier": "medium",
        "latency_tier": "slow",
    },
    "Management": {
        "input_types": ["text", "data"],
        "output_types": ["text", "report", "data"],
        "cost_tier": "medium",
        "latency_tier": "fast",
    },
    "Management & Automation": {
        "input_types": ["text", "data"],
        "output_types": ["text", "report", "data"],
        "cost_tier": "medium",
        "latency_tier": "fast",
    },
    "Operations": {
        "input_types": ["text", "data"],
        "output_types": ["text", "data", "report"],
        "cost_tier": "low",
        "latency_tier": "fast",
    },
    "str):": {
        "input_types": ["text", "data"],
        "output_types": ["text", "report", "file"],
        "cost_tier": "medium",
        "latency_tier": "medium",
    },
}

# Fallback chains by tier
TIER_FALLBACKS = {
    "Command": ["@sebastian"],
    "Development": ["@steve", "@marcus"],
    "Design & Creative": ["@luna", "@marcus"],
    "Growth & Marketing": ["@hannah", "@marcus"],
    "Intelligence & Research": ["@sophie", "@marcus"],
    "Operations & Support": ["@quartermaster", "@marcus"],
    "Legal & Compliance": ["@rowan", "@marcus"],
    "Specialized Ecosystems": ["@genesis", "@marcus"],
    "Quality & Verification": ["@vigil", "@marcus"],
    "Betting Ecosystem": ["@trotter", "@marcus"],
    "Education & Course Design": ["@coursewright", "@marcus"],
    "Legal & Safety": ["@rowan", "@marcus"],
    "Management": ["@marcus", "@delegator"],
    "Management & Automation": ["@marcus", "@delegator"],
    "Operations": ["@quartermaster", "@marcus"],
    "str):": ["@marcus"],
}

# Agent-specific overrides for fallback chains (avoid self-reference)
AGENT_FALLBACK_OVERRIDES = {
    "marcus": ["@sebastian", "@genesis"],
    "sebastian": ["@marcus", "@adrian"],
    "steve": ["@adrian", "@marcus"],
    "luna": ["@maya", "@marcus"],
    "hannah": ["@nina", "@marcus"],
    "sophie": ["@intelhub", "@marcus"],
    "quartermaster": ["@finops", "@marcus"],
    "rowan": ["@vigil", "@marcus"],
    "genesis": ["@neo", "@marcus"],
    "vigil": ["@qualityguard", "@marcus"],
    "trotter": ["@redeye", "@marcus"],
    "coursewright": ["@scholar", "@marcus"],
}


def extract_domains_and_triggers(name, description, content):
    """Extract domain tags and trigger keywords from agent description and content."""
    desc_lower = description.lower()
    domains = []
    triggers = []

    # Extract key domain words from description
    domain_keywords = {
        "frontend": ["frontend", "react", "css", "html", "ui", "ux"],
        "backend": ["backend", "api", "server", "node", "database"],
        "devops": ["devops", "ci/cd", "pipeline", "deploy", "docker"],
        "design": ["design", "figma", "ui", "ux", "visual", "brand"],
        "marketing": ["marketing", "seo", "content", "social", "growth"],
        "research": ["research", "intelligence", "analysis", "competitive"],
        "testing": ["test", "qa", "quality", "audit", "verification"],
        "security": ["security", "compliance", "legal", "risk", "audit"],
        "data": ["data", "analytics", "metrics", "reporting"],
        "ai": ["ai", "machine learning", "model", "inference"],
        "mobile": ["mobile", "expo", "react native", "app"],
        "performance": ["performance", "lighthouse", "optimization", "speed"],
        "documentation": ["documentation", "docs", "knowledge", "wiki"],
        "orchestration": ["orchestration", "coordination", "workflow", "routing"],
        "betting": ["betting", "odds", "horse", "racing", "tipster"],
        "education": ["education", "course", "learning", "training"],
        "finance": ["finance", "billing", "payment", "stripe", "cost"],
        "infrastructure": ["infrastructure", "server", "hosting", "cloud"],
        "content": ["content", "copywriting", "writing", "editorial"],
        "database": ["database", "supabase", "sql", "schema", "migration"],
    }

    for domain, keywords in domain_keywords.items():
        for kw in keywords:
            if kw in desc_lower:
                if domain not in domains:
                    domains.append(domain)
                if kw not in triggers and len(kw) > 2:
                    triggers.append(kw)

    # Add the agent name as a trigger
    triggers.insert(0, name)

    # Limit to reasonable sizes
    domains = domains[:5] if domains else ["general"]
    triggers = triggers[:6] if triggers else [name]

    return domains, triggers


def parse_yaml_frontmatter(content):
    """Extract YAML frontmatter from SKILL.md content."""
    match = re.match(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
    if not match:
        return None, content
    yaml_text = match.group(1)
    rest = content[match.end():]
    return yaml_text, rest


def has_routing_metadata(yaml_text):
    """Check if the YAML already has routing metadata."""
    return "routing:" in yaml_text


def build_upgraded_yaml(yaml_text, agent_name, description, tier, content):
    """Build the upgraded YAML frontmatter with routing metadata."""
    # Get routing defaults for this tier
    routing = TIER_ROUTING.get(tier, TIER_ROUTING["Development"]).copy()

    # Get domains and triggers
    domains, triggers = extract_domains_and_triggers(agent_name, description, content)
    routing["domains"] = domains
    routing["triggers"] = triggers

    # Get fallback chain
    if agent_name in AGENT_FALLBACK_OVERRIDES:
        fallbacks = AGENT_FALLBACK_OVERRIDES[agent_name]
    else:
        fallbacks = TIER_FALLBACKS.get(tier, ["@marcus"])
        # Remove self-reference
        fallbacks = [f for f in fallbacks if f != f"@{agent_name}"]
        if not fallbacks:
            fallbacks = ["@marcus"]

    # Build the new YAML lines
    new_lines = []

    # Parse existing YAML lines
    existing_lines = yaml_text.strip().split('\n')
    for line in existing_lines:
        # Skip any existing routing/fallback/circuit_breaker lines
        stripped = line.strip()
        if any(stripped.startswith(prefix) for prefix in [
            "routing:", "input_types:", "output_types:", "cost_tier:", "latency_tier:",
            "domains:", "triggers:", "composable_skills:", "- id:", "when:",
            "fallback_chain:", "circuit_breaker:", "max_consecutive_failures:",
            "cooldown_minutes:", "escalate_to:", "version:"
        ]):
            continue
        new_lines.append(line)

    # Add version if not present
    has_version = any("version:" in line for line in new_lines)
    if not has_version:
        # Insert after description line
        insert_idx = None
        for i, line in enumerate(new_lines):
            if line.strip().startswith("description:"):
                insert_idx = i + 1
                break
        if insert_idx:
            new_lines.insert(insert_idx, "version: 1.0.0")

    # Add routing block
    new_lines.append("")
    new_lines.append("# Routing Metadata — used by @marcus and orchestrator for auto-dispatch")
    new_lines.append("routing:")
    new_lines.append(f'  input_types: {json.dumps(routing["input_types"])}')
    new_lines.append(f'  output_types: {json.dumps(routing["output_types"])}')
    new_lines.append(f'  cost_tier: {routing["cost_tier"]}')
    new_lines.append(f'  latency_tier: {routing["latency_tier"]}')
    new_lines.append(f'  domains: {json.dumps(routing["domains"])}')
    new_lines.append(f'  triggers: {json.dumps(routing["triggers"])}')

    # Add fallback chain
    new_lines.append("")
    new_lines.append(f'fallback_chain: {json.dumps(fallbacks)}')
    new_lines.append("circuit_breaker:")
    new_lines.append("  max_consecutive_failures: 3")
    new_lines.append("  cooldown_minutes: 30")
    new_lines.append('  escalate_to: "@marcus"')

    return '\n'.join(new_lines)


def process_agent(agent_dir, dry_run=False):
    """Process a single agent's SKILL.md to add Agent Card routing metadata."""
    skill_file = agent_dir / "SKILL.md"
    content = skill_file.read_text(encoding='utf-8')
    agent_name = agent_dir.name

    yaml_text, rest = parse_yaml_frontmatter(content)
    if yaml_text is None:
        return False, f"@{agent_name}: No YAML frontmatter found — skipping"

    # Check if already upgraded
    if has_routing_metadata(yaml_text):
        return False, f"@{agent_name}: Already has routing metadata — skipping"

    # Extract key fields from existing YAML
    name_match = re.search(r'name:\s*@?(\S+)', yaml_text)
    desc_match = re.search(r'description:\s*(.+)', yaml_text)
    tier_match = re.search(r'tier:\s*(.+)', yaml_text)

    name = name_match.group(1) if name_match else agent_name
    description = desc_match.group(1).strip() if desc_match else ""
    tier = tier_match.group(1).strip() if tier_match else "Development"

    # Build upgraded YAML
    new_yaml = build_upgraded_yaml(yaml_text, name, description, tier, content)

    # Reconstruct the file
    new_content = f"---\n{new_yaml}\n---{rest}"

    if dry_run:
        return True, f"@{agent_name}: WOULD ADD routing metadata (tier: {tier})"
    else:
        skill_file.write_text(new_content, encoding='utf-8')
        return True, f"@{agent_name}: ADDED routing metadata (tier: {tier})"


def log_to_ralph_history(agents_changed, total):
    """Log to ralph-history.json."""
    entry = {
        "timestamp": datetime.now().isoformat(),
        "type": "agent_card_population",
        "agents_changed": agents_changed,
        "total_agents": total,
    }
    history = []
    if RALPH_HISTORY.exists():
        with open(RALPH_HISTORY, 'r', encoding='utf-8') as f:
            history = json.load(f)
    history.append(entry)
    with open(RALPH_HISTORY, 'w', encoding='utf-8') as f:
        json.dump(history, f, indent=2)


def main():
    parser = argparse.ArgumentParser(description="Populate Agent Cards for all agents")
    parser.add_argument("--dry-run", action="store_true", help="Show what would change")
    args = parser.parse_args()

    agent_dirs = sorted([
        d for d in SKILLS_DIR.iterdir()
        if d.is_dir() and d.name != "methodology" and (d / "SKILL.md").exists()
    ])

    total = len(agent_dirs)
    print(f"{'[DRY RUN] ' if args.dry_run else ''}Populating Agent Cards for {total} agents...\n")

    changed = 0
    for agent_dir in agent_dirs:
        was_changed, message = process_agent(agent_dir, args.dry_run)
        if was_changed:
            changed += 1
            print(f"  ✅ {message}")
        else:
            print(f"  ⏭️  {message}")

    print(f"\n{'[DRY RUN] ' if args.dry_run else ''}Result: {changed}/{total} agents {'would be ' if args.dry_run else ''}modified.")

    log_to_ralph_history(changed, total)
    if not args.dry_run and changed > 0:
        print("Logged to ralph-history.json.")


if __name__ == "__main__":
    main()
