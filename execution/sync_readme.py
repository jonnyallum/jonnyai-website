"""
sync_readme.py — Auto-generate README.md from live agent and catalog data.

Reads agent SKILL.md files + brain_sync.py agent_meta to rebuild the README
roster tables. Run as part of full_sync.py so README never goes stale.

Usage:
    python execution/sync_readme.py
"""

import re
import sys
from pathlib import Path
from datetime import date

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).parent.parent
SKILLS_DIR = ROOT / ".agent" / "skills"
CATALOG_FILE = ROOT / ".agent" / "library" / "SKILL_CATALOG.md"
README = ROOT / "README.md"

# Tier display order and short names for the README
TIER_ORDER = [
    ("Command", "Command"),
    ("Development", "Development"),
    ("Design & Creative", "Design & Creative"),
    ("Growth & Marketing", "Growth & Marketing"),
    ("Intelligence & Research", "Intelligence & Research"),
    ("Operations & Support", "Operations & Support"),
    ("Legal & Safety", "Legal & Safety"),
    ("Quality & Verification", "Quality & Verification"),
    ("Specialized Ecosystems", "Specialized Ecosystems"),
    ("Betting Ecosystem", "Betting Ecosystem"),
    ("Management & Automation", "Management & Automation"),
    ("Education & Course Design", "Education & Course Design"),
]


def read_agents() -> list[dict]:
    """Read all agent SKILL.md files and extract key metadata."""
    agents = []
    for agent_dir in sorted(SKILLS_DIR.iterdir()):
        if not agent_dir.is_dir() or agent_dir.name == "methodology":
            continue
        skill_file = agent_dir / "SKILL.md"
        if not skill_file.exists():
            continue

        content = skill_file.read_text(encoding="utf-8", errors="ignore")

        # Parse YAML frontmatter
        yaml_match = re.match(r"^---\n(.+?)\n---", content, re.DOTALL)
        if not yaml_match:
            continue

        yaml = yaml_match.group(1)
        name_match = re.search(r"^name:\s*(.+)", yaml, re.MULTILINE)
        desc_match = re.search(r"^description:\s*(.+)", yaml, re.MULTILINE)
        tier_match = re.search(r"^tier:\s*(.+)", yaml, re.MULTILINE)

        if not name_match:
            continue

        handle = name_match.group(1).strip().lstrip("@")

        # Extract human name from first H1 heading
        h1_match = re.search(r"^# (.+?)(?:\s*-\s*Agent Profile)?$", content, re.MULTILINE)
        human_name = h1_match.group(1).strip() if h1_match else handle.capitalize()

        # Extract nickname from Identity table
        nickname_match = re.search(r"\|\s*Nickname\s*\|\s*(.+?)\s*\|", content)
        nickname = nickname_match.group(1).strip().strip('"') if nickname_match else ""

        # Philosophy quote
        quote_match = re.search(r'^>\s*_"(.+?)"_', content, re.MULTILINE)
        quote = quote_match.group(1).strip() if quote_match else ""

        tier = tier_match.group(1).strip() if tier_match else "Uncategorized"
        
        # Normalize tiers to match TIER_ORDER keys
        tier_map = {
            "Operations": "Operations & Support",
            "Research": "Intelligence & Research",
            "Intelligence": "Intelligence & Research",
            "Marketing": "Growth & Marketing",
            "Growth": "Growth & Marketing",
            "Design": "Design & Creative",
            "Legal": "Legal & Safety",
            "Quality": "Quality & Verification",
            "Specialized": "Specialized Ecosystems",
            "Betting": "Betting Ecosystem",
            "Management": "Management & Automation",
            "Automation": "Management & Automation",
            "Education": "Education & Course Design"
        }
        normalized_tier = tier_map.get(tier, tier)

        agents.append({
            "handle": handle,
            "human_name": human_name,
            "nickname": nickname,
            "description": desc_match.group(1).strip() if desc_match else "",
            "tier": normalized_tier,
            "quote": quote,
        })

    return agents


def count_skills() -> dict:
    """Count skills per catalog section."""
    if not CATALOG_FILE.exists():
        return {}
    lines = CATALOG_FILE.read_text(encoding="utf-8", errors="ignore").splitlines()
    counts = {}
    section = None
    row_re = re.compile(r"^\|\s*`[\w\-]+`\s*\|")
    for line in lines:
        sec = re.match(r"^###\s+(.+)", line.strip())
        if sec:
            section = sec.group(1).strip()
            counts[section] = 0
        elif section and row_re.match(line):
            handle = re.search(r"`([\w\-]+)`", line).group(1)
            if handle not in ("skill-handle",):
                counts[section] = counts.get(section, 0) + 1
    return counts


def build_readme(agents: list[dict]) -> str:
    # Group by tier
    tiers: dict[str, list[dict]] = {}
    for a in agents:
        tiers.setdefault(a["tier"], []).append(a)

    total = len(agents)
    today = date.today().isoformat()

    skill_counts = count_skills()
    total_skills = sum(skill_counts.values())

    # ── Header ────────────────────────────────────────
    lines = [
        f"# Antigravity Orchestra — Jai.OS 5.0",
        f"",
        f"> **The Hive Mind Architecture** | {total} Specialist Agents | {total_skills} Catalogued Skills | Collective Velocity | Trillion-Dollar Quality",
        f"",
        f"The **Antigravity Orchestra** is a production-grade agentic enterprise operating system. "
        f"{total} specialized AI personas collaborate as a unified swarm — routing tasks, enforcing quality gates, "
        f"running autonomous build loops, and maintaining a live Shared Brain on Supabase. "
        f"Every agent has a SKILL.md: their identity, SOPs, collaboration patterns, and performance metrics.",
        f"",
        f"---",
        f"",
        f"## Architecture",
        f"",
        f"```",
        f"Layer 1 — The Talent      .agent/skills/[handle]/SKILL.md     {total} agent personas + SOPs",
        f"Layer 2 — The Boardroom   .agent/boardroom/                   Protocol, chatroom, decision log",
        f"Layer 3 — The Engine      execution/                          Python automation + Ralph Loop",
        f"Layer 4 — The Memory      Supabase Shared Brain               Live agents, learnings, chatroom",
        f"```",
        f"",
        f"**Key patterns:**",
        f"- **Ralph Loop** — `execution/ralph_loop.py` — autonomous iterative build with stagnation detection",
        f"- **Full Sync** — `execution/full_sync.py` — one command: validate → Supabase → GitHub",
        f"- **Quality Gate Chain** — @sam → @qualityguard → @milo → @riskguard → @derek → @vigil before any production deploy",
        f"- **Shared Brain First** — query Supabase `agents` table before assuming any agent's capabilities",
        f"",
        f"---",
        f"",
        f"## The {total}-Agent Orchestra",
        f"",
    ]

    # ── Roster tables ─────────────────────────────────
    for tier_key, tier_label in TIER_ORDER:
        tier_agents = tiers.get(tier_key, [])
        if not tier_agents:
            continue
        lines.append(f"### {tier_label} ({len(tier_agents)})")
        lines.append("| Handle | Name | Role |")
        lines.append("|:---|:---|:---|")
        for a in sorted(tier_agents, key=lambda x: x["handle"]):
            nickname_part = f' "{a["nickname"]}"' if a["nickname"] else ""
            lines.append(f"| @{a['handle']} | {a['human_name']}{nickname_part} | {a['description']} |")
        lines.append("")

    # ── Shared Brain ─────────────────────────────────
    lines += [
        "---",
        "",
        "## Shared Brain (Supabase)",
        "",
        f"All {total} agent profiles are live and queryable in Supabase (`lkwydqtfbdjhxaarelaz`):",
        "",
        "| Table | Contents |",
        "|:---|:---|",
        f"| `agents` | {total} agents — full SKILL.md in `philosophy` column |",
        "| `learnings` | Individual learnings propagated after every task |",
        "| `chatroom` | Real-time session broadcasts and DSPs |",
        "| `projects` | Active client project registry |",
        f"| `skills` | {total_skills} catalogued skills with SOP coverage flags |",
        "| `events` | Incidents, fixes, wins, training days, deploys |",
        "",
        "---",
        "",
    ]

    # ── Skill counts ─────────────────────────────────
    if skill_counts:
        lines += [
            "## Skill Catalog",
            "",
            f"**{total_skills} skills** catalogued across {len(skill_counts)} domains. All have SOP files.",
            "",
            "| Section | Skills |",
            "|:---|:---|",
        ]
        for section, count in skill_counts.items():
            lines.append(f"| {section} | {count} |")
        lines += ["", "---", ""]

    # ── Scripts ──────────────────────────────────────
    lines += [
        "## Active Execution Scripts",
        "",
        "| Script | Purpose |",
        "|:---|:---|",
        "| `full_sync.py` | **One-command sync** — validate → Supabase → GitHub |",
        "| `sync_readme.py` | Auto-generate this README from live agent data |",
        "| `build_skills_matrix.py` | Generate SKILLS_MATRIX.md from all SKILL.md files |",
        "| `validate_agents.py` | Verify all agents pass Jai.OS 5.0 standard |",
        "| `sync_all_skills_full.py` | Push full SKILL.md to Supabase `agents.philosophy` |",
        "| `brain_sync.py` | Sync heartbeat + learnings to Shared Brain |",
        "| `sync_skill_catalog.py` | Sync skills catalog to Supabase |",
        "| `sync_chatroom.py` | Sync chatroom history to Supabase |",
        "| `sync_website.py` | Sync live agent count to jonnyai.website |",
        "| `log_event.py` | Log incidents, fixes, wins, training days |",
        "| `training_day.py` | Agent training day protocol (cron-able) |",
        "| `ralph_loop.py` | Autonomous iterative build with stagnation detection |",
        "| `orchestra_status.py` | Visual health dashboard for the Orchestra |",
        "| `onboard_project.py` | Client project scaffolding and Glass Box setup |",
        "| `deploy_ssh.py` | SSH/SFTP deployment to Hostinger |",
        "| `brain_cli.py` | Interactive Shared Brain CLI |",
        "",
        "---",
        "",
        "## Key Commands",
        "",
        "```bash",
        "# Full sync — validate + Supabase + GitHub in one command",
        'python execution/full_sync.py "feat: your session summary"',
        "python execution/full_sync.py --dry-run    # preview",
        "",
        "# Validate all agents",
        "python execution/validate_agents.py",
        "",
        "# Log an incident or fix",
        'python execution/log_event.py incident "DB connection timeout on Supabase KPI views" --severity high',
        'python execution/log_event.py fix "Added connection pooling + retry logic" --resolves <incident-id>',
        "",
        "# Run agent training day",
        "python execution/training_day.py",
        "",
        "# Check Orchestra health",
        "python execution/orchestra_status.py",
        "```",
        "",
        "---",
        "",
        "## Tech Stack",
        "",
        "| Layer | Technology |",
        "|:---|:---|",
        "| Frontend | Next.js 15+, React 19, TypeScript |",
        "| Styling | Tailwind CSS v4 |",
        "| Animation | Framer Motion |",
        "| Database | Supabase, PostgreSQL |",
        "| Deployment | Vercel, Hostinger (SSH/rsync) |",
        "| AI Tooling | Claude Code + MCP servers |",
        "",
        "### Active MCP Servers",
        "",
        "| Server | Purpose |",
        "|:---|:---|",
        "| `supabase` | Direct DB — agents, learnings, chatroom, projects |",
        "| `github` | Repo management, PRs, issues |",
        "| `brave-search` | Web intelligence and research |",
        "| `playwright` | Browser automation and UI testing |",
        "| `context7` | Live library and framework documentation |",
        "| `figma` | Design file access and asset extraction |",
        "| `desktop-commander` | Terminal, file system, process management |",
        "| `memory` | Knowledge graph persistence across sessions |",
        "",
        "---",
        "",
        "## Operating Principles",
        "",
        "1. **Message-First** — Check `chatroom.md` and agent SKILL.md before any action",
        "2. **Shared Brain First** — Query Supabase `agents` before assuming capabilities",
        "3. **Truth-Lock** — No production claims until verified by @vigil or @rowan",
        "4. **Self-Annealing** — If a tool fails, fix the script/skill, not just the code",
        "5. **No Placeholder Pushing** — Zero Latin text or generic claims in production",
        "6. **Full Sync Always** — `full_sync.py` is the only sanctioned way to push sessions",
        "",
        "---",
        "",
        f"*Jai.OS 5.0 | Antigravity Orchestra | {total} Agents | {total_skills} Skills | Shared Brain: ONLINE*",
        f"*Last updated: {today} — auto-generated by sync_readme.py*",
        "",
    ]

    return "\n".join(lines)


def main():
    print("Generating README.md from live agent data...")
    agents = read_agents()
    if not agents:
        print("  ERROR: No agents found in .agent/skills/")
        sys.exit(1)

    content = build_readme(agents)
    README.write_text(content, encoding="utf-8")

    tiers = {}
    for a in agents:
        tiers.setdefault(a["tier"], []).append(a)

    print(f"  [OK] README.md written — {len(agents)} agents across {len(tiers)} tiers")


if __name__ == "__main__":
    main()
