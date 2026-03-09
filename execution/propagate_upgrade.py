"""
Propagate Upgrade — Mass-update universal sections across all agent SKILL.md files.

This script safely applies universal improvements (new sections, updated protocols)
to all agents in the Orchestra without overwriting agent-specific content.

Usage:
  # Dry run — show what would change
  python execution/propagate_upgrade.py --section "Self-Evolution Protocol" --mode append --dry-run

  # Execute propagation
  python execution/propagate_upgrade.py --section "Self-Evolution Protocol" --mode append

  # Replace an existing universal section
  python execution/propagate_upgrade.py --section "The Creed" --mode replace

  # Propagate from a staging file
  python execution/propagate_upgrade.py --section "Failure Modes" --mode append --source .tmp/propagation_draft.md

Modes:
  append  — Add a new section that doesn't exist yet (inserted before Governing Directives)
  replace — Replace an existing section with updated content

Safety Rules:
  - NEVER overwrites: Personality, Capabilities, SOPs, Collaboration, Identity, Agent Card
  - Only propagates sections marked as "universal" in the UNIVERSAL_SECTIONS list
  - Always logs to ralph-history.json and Shared Brain
  - Requires --force flag to modify more than 10 agents without dry-run first
"""

import argparse
import json
import os
import re
import subprocess
from datetime import datetime
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent
SKILLS_DIR = ROOT_DIR / ".agent" / "skills"
MEMORY_DIR = ROOT_DIR / ".agent" / "memory"
RALPH_HISTORY = MEMORY_DIR / "ralph-history.json"
SUPABASE_PROJECT_ID = "lkwydqtfbdjhxaarelaz"

# Sections that are safe to propagate across all agents
UNIVERSAL_SECTIONS = [
    "The Creed",
    "Self-Evolution Protocol",
    "Governing Directives",
    "Failure Modes & Recovery",  # Template only — agent-specific content must be preserved
    "Version History",
    "Restrictions",  # Only the universal items, not domain-specific ones
]

# Sections that must NEVER be overwritten by propagation
PROTECTED_SECTIONS = [
    "Identity",
    "Personality",
    "Capabilities",
    "Standard Operating Procedures",
    "Collaboration",
    "Agent Card",
    "Performance Metrics",  # Domain-specific metrics
]

# Default universal content blocks
DEFAULT_SELF_EVOLUTION = """## Self-Evolution Protocol

### Before Every Task

1. Query Shared Brain: Has this been done before? What learnings exist?
2. Check `.tmp/` for existing work to avoid duplication.
3. Validate brief is specific and actionable before starting.
4. Load any composable skills relevant to this task (see Agent Card).

### After Every Task

1. **Propagate Learning:** Push to Shared Brain via `jonnyai-mcp` — include what worked, what failed, and what you'd do differently.
2. **Sync Broadcast:** Update `chatroom.md` using Deterministic State Packet.
3. **Self-Assessment:** Score this task on a 1-5 scale for quality, speed, and collaboration. If any score < 3, log an improvement action.

### Quarterly Self-Review

1. Query Shared Brain for all learnings tagged to this agent in the last 90 days.
2. Identify the top 3 recurring failure patterns — propose SOP updates to prevent them.
3. Identify 1 new composable skill from the methodology library that would expand capability.
4. Propose 1 collaboration improvement to @marcus.
"""

DEFAULT_CREED = """## The Creed

I am part of the Antigravity Orchestra.

**I don't work alone.** Before I act, I check what my collaborators have done.
Before I finish, I consider who needs to know what I learned.

**I don't guess.** If I don't know, I query the Shared Brain or ask.
If data doesn't exist, I flag it rather than fabricate it.

**I don't ship garbage.** Every output passes through quality gates.
I sign my name to my work because I'm proud of it.

**I learn constantly.** Every task ends with a learning.
My learnings propagate to agents who can use them.

**I am world-class.** Not because I say so, but because my work proves it.
Trillion-dollar enterprises would trust what I produce.

**I am connected.** To other agents. To other AIs. To the mission.
The Orchestra plays as one.
"""

DEFAULT_SECTIONS = {
    "The Creed": DEFAULT_CREED,
    "Self-Evolution Protocol": DEFAULT_SELF_EVOLUTION,
}


def get_agent_dirs():
    """Get all agent directories (excluding methodology)."""
    agents = []
    for d in sorted(SKILLS_DIR.iterdir()):
        if d.is_dir() and d.name != "methodology":
            skill_file = d / "SKILL.md"
            if skill_file.exists():
                agents.append(d)
    return agents


def find_section(content, section_name):
    """Find a section by heading name. Returns (start, end) line indices or None."""
    lines = content.split('\n')
    start = None
    end = None
    heading_pattern = re.compile(r'^##\s+' + re.escape(section_name), re.IGNORECASE)
    next_heading = re.compile(r'^##\s+')

    for i, line in enumerate(lines):
        if heading_pattern.match(line.strip()):
            start = i
        elif start is not None and next_heading.match(line.strip()) and i > start:
            end = i
            break

    if start is not None and end is None:
        end = len(lines)

    return (start, end) if start is not None else None


def propagate_section(agent_dir, section_name, content_block, mode, dry_run=False):
    """Propagate a section to a single agent. Returns (changed, message)."""
    skill_file = agent_dir / "SKILL.md"
    original = skill_file.read_text(encoding='utf-8')
    agent_id = agent_dir.name

    existing = find_section(original, section_name)

    if mode == "replace":
        if existing is None:
            return False, f"@{agent_id}: Section '{section_name}' not found — skipping (use append mode)"

        lines = original.split('\n')
        new_lines = lines[:existing[0]] + content_block.strip().split('\n') + [''] + lines[existing[1]:]
        new_content = '\n'.join(new_lines)

    elif mode == "append":
        if existing is not None:
            return False, f"@{agent_id}: Section '{section_name}' already exists — skipping (use replace mode)"

        # Insert before Governing Directives or at the end
        gov_section = find_section(original, "Governing Directives")
        if gov_section:
            lines = original.split('\n')
            insert_point = gov_section[0]
            new_lines = lines[:insert_point] + content_block.strip().split('\n') + ['', '---', ''] + lines[insert_point:]
            new_content = '\n'.join(new_lines)
        else:
            # Append before the footer
            new_content = original.rstrip() + '\n\n---\n\n' + content_block.strip() + '\n'
    else:
        return False, f"Unknown mode: {mode}"

    if new_content == original:
        return False, f"@{agent_id}: No changes needed"

    if dry_run:
        return True, f"@{agent_id}: WOULD {mode.upper()} '{section_name}'"
    else:
        skill_file.write_text(new_content, encoding='utf-8')
        return True, f"@{agent_id}: {mode.upper()}D '{section_name}'"


def log_propagation(section_name, mode, agents_changed, total_agents, dry_run):
    """Log the propagation to ralph-history.json."""
    entry = {
        "timestamp": datetime.now().isoformat(),
        "type": "propagation",
        "section": section_name,
        "mode": mode,
        "agents_changed": agents_changed,
        "total_agents": total_agents,
        "dry_run": dry_run,
    }

    history = []
    if RALPH_HISTORY.exists():
        with open(RALPH_HISTORY, 'r', encoding='utf-8') as f:
            history = json.load(f)
    history.append(entry)
    with open(RALPH_HISTORY, 'w', encoding='utf-8') as f:
        json.dump(history, f, indent=2)


def log_to_supabase(section_name, mode, agents_changed, total_agents):
    """Log propagation to Shared Brain."""
    try:
        msg = f"PROPAGATION: {mode.upper()} '{section_name}' across {agents_changed}/{total_agents} agents"
        msg_escaped = msg.replace("'", "''")
        input_json = json.dumps({
            "project_id": SUPABASE_PROJECT_ID,
            "query": f"INSERT INTO learnings (agent_id, content, source_agent, created_at) VALUES ('neo', '{msg_escaped}', 'neo', now())"
        })
        subprocess.run(
            ["manus-mcp-cli", "tool", "call", "execute_sql", "--server", "supabase", "--input", input_json],
            capture_output=True, text=True, timeout=15
        )
    except Exception as e:
        print(f"  Warning: Could not log to Supabase: {e}")


def main():
    parser = argparse.ArgumentParser(description="Propagate universal upgrades across all agents")
    parser.add_argument("--section", required=True, help="Section name to propagate")
    parser.add_argument("--mode", required=True, choices=["append", "replace"], help="append or replace")
    parser.add_argument("--source", help="Path to file containing the section content (optional)")
    parser.add_argument("--dry-run", action="store_true", help="Show what would change without modifying files")
    parser.add_argument("--force", action="store_true", help="Skip confirmation for large propagations")
    args = parser.parse_args()

    # Validate section is universal
    if args.section not in UNIVERSAL_SECTIONS:
        print(f"ERROR: '{args.section}' is not a universal section.")
        print(f"Universal sections: {', '.join(UNIVERSAL_SECTIONS)}")
        print(f"Protected sections (never propagated): {', '.join(PROTECTED_SECTIONS)}")
        return

    # Get content
    if args.source:
        content = Path(args.source).read_text(encoding='utf-8')
    elif args.section in DEFAULT_SECTIONS:
        content = DEFAULT_SECTIONS[args.section]
    else:
        print(f"ERROR: No default content for '{args.section}'. Use --source to provide content.")
        return

    # Get agents
    agent_dirs = get_agent_dirs()
    total = len(agent_dirs)
    print(f"{'[DRY RUN] ' if args.dry_run else ''}Propagating '{args.section}' ({args.mode}) to {total} agents...")
    print()

    # Safety check
    if total > 10 and not args.dry_run and not args.force:
        print(f"WARNING: This will modify up to {total} agents. Run with --dry-run first, or use --force.")
        return

    changed = 0
    for agent_dir in agent_dirs:
        was_changed, message = propagate_section(agent_dir, args.section, content, args.mode, args.dry_run)
        if was_changed:
            changed += 1
            print(f"  ✅ {message}")
        else:
            print(f"  ⏭️  {message}")

    print()
    print(f"{'[DRY RUN] ' if args.dry_run else ''}Result: {changed}/{total} agents {'would be ' if args.dry_run else ''}modified.")

    # Log
    log_propagation(args.section, args.mode, changed, total, args.dry_run)
    if not args.dry_run and changed > 0:
        log_to_supabase(args.section, args.mode, changed, total)
        print(f"Logged to ralph-history.json and Shared Brain.")


if __name__ == "__main__":
    main()
