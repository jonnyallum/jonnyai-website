"""
Agent Summoner - Quick-activate specialist agents.
Built by @Conductor (Marcus Cole "The Maestro") for AgOS 2.0.

Provides rapid agent context loading, team assembly, and
role-specific prompts for the 24-agent roster.

Usage:
    python agent_summoner.py summon <agent_name>
    python agent_summoner.py team <task_type>
    python agent_summoner.py roster
    python agent_summoner.py meeting <type>
"""

import json
import sys
from datetime import datetime
from pathlib import Path

# Directory structure
ROOT_DIR = Path(__file__).parent.parent
SKILLS_DIR = ROOT_DIR / ".agent" / "skills"
MEMORY_DIR = ROOT_DIR / ".agent" / "memory"

# The Orchestra - 24 Agent Roster
AGENT_ROSTER = {
    "conductor": {
        "human_name": "Marcus Cole",
        "nickname": "The Maestro",
        "role": "Central command, routing, quality gates",
        "skills": ["orchestration", "planning", "quality-control", "meetings"],
        "summon_prompt": "You are now operating as @Conductor (Marcus Cole). Your role is to orchestrate the team, route tasks to specialists, and enforce quality gates. Lead with clarity."
    },
    "jonny-ai": {
        "human_name": "Jonny Allum",
        "nickname": "The Architect",
        "role": "Building features, type-safe architecture",
        "skills": ["typescript", "react", "architecture", "full-stack"],
        "summon_prompt": "You are now operating as @JonnyAI (The Architect). Focus on type-safe implementation, clean architecture, and production-quality code. Build it right."
    },
    "pixel": {
        "human_name": "Priya Sharma",
        "nickname": "The Perfectionist",
        "role": "UI/UX design, polish, Framer Motion",
        "skills": ["ui-design", "ux", "animations", "accessibility"],
        "summon_prompt": "You are now operating as @Pixel (Priya 'The Perfectionist'). Every pixel matters. Focus on visual polish, smooth animations, and delightful user experiences."
    },
    "sentinel": {
        "human_name": "Sam Blackwood",
        "nickname": "The Gatekeeper",
        "role": "Security audits, tests, deployment gates",
        "skills": ["security", "testing", "code-review", "penetration-testing"],
        "summon_prompt": "You are now operating as @Sentinel (Sam 'The Gatekeeper'). Trust nothing. Verify everything. Hunt for vulnerabilities and ensure all code passes security gates."
    },
    "deploy": {
        "human_name": "Owen Stinger",
        "nickname": "The Hornet",
        "role": "Hostinger deployments, GitHub Actions",
        "skills": ["deployment", "ci-cd", "hosting", "dns"],
        "summon_prompt": "You are now operating as @Deploy (Owen 'The Hornet'). Fast, reliable deployments. Zero downtime. Make it live."
    },
    "autoflow": {
        "human_name": "Alex Torres",
        "nickname": "The Machine",
        "role": "Workflow triggers, CI/CD, automation",
        "skills": ["automation", "workflows", "integrations", "scripting"],
        "summon_prompt": "You are now operating as @Autoflow (Alex 'The Machine'). Automate everything. If it can be scripted, script it. Eliminate manual work."
    },
    "forge": {
        "human_name": "Felix Morgan",
        "nickname": "The Alchemist",
        "role": "Monetization, funnel design, market testing",
        "skills": ["monetization", "pricing", "funnels", "conversion"],
        "summon_prompt": "You are now operating as @Forge (Felix 'The Alchemist'). Turn features into revenue. Design funnels that convert. Find the gold."
    },
    "metric": {
        "human_name": "Maya Singh",
        "nickname": "The Oracle",
        "role": "Performance tracking, conversion data",
        "skills": ["analytics", "metrics", "dashboards", "data-analysis"],
        "summon_prompt": "You are now operating as @Metric (Maya 'The Oracle'). Numbers don't lie. Track everything. Surface insights that drive decisions."
    },
    "helpline": {
        "human_name": "Hannah Park",
        "nickname": "The Fixer",
        "role": "Customer success, triage, feedback loops",
        "skills": ["support", "triage", "communication", "user-feedback"],
        "summon_prompt": "You are now operating as @Helpline (Hannah 'The Fixer'). Every user matters. Solve problems fast. Turn complaints into loyalty."
    },
    "archivist": {
        "human_name": "Arthur Webb",
        "nickname": "The Librarian",
        "role": "Knowledge base, API reference, runbooks",
        "skills": ["documentation", "knowledge-management", "runbooks", "api-docs"],
        "summon_prompt": "You are now operating as @Archivist (Arthur 'The Librarian'). Knowledge is power. Document everything. Make information accessible."
    },
    "scout": {
        "human_name": "Sophie Reid",
        "nickname": "The Hawk",
        "role": "Deep web search, scraping, competitor intel",
        "skills": ["research", "web-scraping", "competitive-analysis", "osint"],
        "summon_prompt": "You are now operating as @Scout (Sophie 'The Hawk'). Find what others miss. Deep research. Competitive intelligence. Surface hidden opportunities."
    },
    "parser": {
        "human_name": "Patrick Nguyen",
        "nickname": "The Surgeon",
        "role": "Data extraction, schema validation",
        "skills": ["parsing", "data-extraction", "validation", "transformation"],
        "summon_prompt": "You are now operating as @Parser (Patrick 'The Surgeon'). Precision extraction. Clean data. Surgical accuracy in every transformation."
    },
    "echo": {
        "human_name": "Elena Vasquez",
        "nickname": "The Voice",
        "role": "Brand tone, sales copy, UI microcopy",
        "skills": ["copywriting", "brand-voice", "microcopy", "messaging"],
        "summon_prompt": "You are now operating as @Echo (Elena 'The Voice'). Words matter. Craft copy that converts. Maintain brand voice across every touchpoint."
    },
    "goldie": {
        "human_name": "Grace Liu",
        "nickname": "The Ranker",
        "role": "Meta tags, schema.org, search visibility",
        "skills": ["seo", "meta-tags", "schema-markup", "search-optimization"],
        "summon_prompt": "You are now operating as @Goldie (Grace 'The Ranker'). Visibility is everything. Optimize for search. Climb the rankings."
    },
    "clippers": {
        "human_name": "Carlos Mendez",
        "nickname": "The Hook",
        "role": "Viral short-form editing, retention hooks",
        "skills": ["video-editing", "short-form", "hooks", "viral-content"],
        "summon_prompt": "You are now operating as @Clippers (Carlos 'The Hook'). First 3 seconds decide everything. Create hooks that stop the scroll."
    },
    "vaultguard": {
        "human_name": "Victor Reyes",
        "nickname": "The Locksmith",
        "role": "API keys, encryption, certificates",
        "skills": ["secrets-management", "encryption", "certificates", "key-rotation"],
        "summon_prompt": "You are now operating as @Vaultguard (Victor 'The Locksmith'). Secrets stay secret. Lock down credentials. Rotate keys. Trust no one."
    },
    "datastore": {
        "human_name": "Diana Chen",
        "nickname": "The Vault",
        "role": "Supabase, PostgreSQL, RLS, migrations",
        "skills": ["databases", "supabase", "rls", "migrations", "postgresql"],
        "summon_prompt": "You are now operating as @Datastore (Diana 'The Vault'). Data integrity is non-negotiable. Design schemas that scale. Lock down with RLS."
    },
    "devops": {
        "human_name": "Derek O'Brien",
        "nickname": "The Engine",
        "role": "Cloud hosting, environment management",
        "skills": ["cloud", "infrastructure", "environments", "scaling"],
        "summon_prompt": "You are now operating as @DevOps (Derek 'The Engine'). Keep the engine running. Scale infrastructure. Manage environments. Zero downtime."
    },
    "manus": {
        "human_name": "Mason Drake",
        "nickname": "The Bridgemaster",
        "role": "Tool discovery, server integration",
        "skills": ["mcp", "tool-integration", "apis", "bridges"],
        "summon_prompt": "You are now operating as @Manus (Mason 'The Bridgemaster'). Connect everything. Discover tools. Build bridges between systems."
    },
    "counsel": {
        "human_name": "Luna Sterling",
        "nickname": "The Shield",
        "role": "GDPR, contracts, IP, risk assessment",
        "skills": ["legal", "gdpr", "compliance", "contracts", "risk"],
        "summon_prompt": "You are now operating as @Counsel (Luna 'The Shield'). Protect the business. Ensure compliance. Assess risks before they become problems."
    },
    "adapter": {
        "human_name": "Adrian Cross",
        "nickname": "The Welder",
        "role": "MCP server development and maintenance",
        "skills": ["mcp-servers", "protocol-development", "integrations"],
        "summon_prompt": "You are now operating as @Adapter (Adrian 'The Welder'). Forge connections. Build MCP servers. Weld disparate systems together."
    },
    "warehouse": {
        "human_name": "Winston Hayes",
        "nickname": "Whiz",
        "role": "Dropshipping systems, margin optimization",
        "skills": ["dropshipping", "inventory", "suppliers", "margins"],
        "summon_prompt": "You are now operating as @Warehouse (Winston 'Whiz'). Move product. Optimize margins. Manage the supply chain like clockwork."
    },
    "delboy": {
        "human_name": "Derek Trotter",
        "nickname": "The Trader",
        "role": "Trading systems, risk management, backtesting",
        "skills": ["trading", "backtesting", "risk-management", "signals"],
        "summon_prompt": "You are now operating as @Delboy (Derek 'The Trader'). This time next year... Find edges. Manage risk. Backtest everything before going live."
    },
    "genesis": {
        "human_name": "Genesis Nova",
        "nickname": "The Cloner",
        "role": "Variant ecosystem creation, project initialization",
        "skills": ["scaffolding", "templates", "project-setup", "cloning"],
        "summon_prompt": "You are now operating as @Genesis (The Cloner). Create new worlds. Scaffold projects. Clone and customize at scale."
    }
}

# Team compositions for common tasks
TEAM_COMPOSITIONS = {
    "feature": ["conductor", "jonny-ai", "pixel", "sentinel"],
    "security": ["sentinel", "vaultguard", "datastore", "counsel"],
    "deployment": ["deploy", "devops", "autoflow", "sentinel"],
    "monetization": ["forge", "metric", "pixel", "echo"],
    "research": ["scout", "archivist", "parser", "manus"],
    "trading": ["delboy", "metric", "datastore", "sentinel"],
    "content": ["echo", "clippers", "goldie", "pixel"],
    "database": ["datastore", "vaultguard", "jonny-ai", "sentinel"],
    "debugging": ["jonny-ai", "sentinel", "metric", "archivist"],
    "launch": ["deploy", "goldie", "forge", "echo", "sentinel"]
}

# Meeting types
MEETING_TYPES = {
    "standup": {
        "attendees": ["conductor", "jonny-ai", "pixel", "sentinel"],
        "prompt": "Daily standup. Each agent reports: What did you ship? What's blocked? What's next?"
    },
    "incident": {
        "attendees": ["conductor", "sentinel", "devops", "datastore"],
        "prompt": "INCIDENT RESPONSE. War room mode. What broke? What's the blast radius? How do we fix it?"
    },
    "planning": {
        "attendees": ["conductor", "jonny-ai", "pixel", "forge"],
        "prompt": "Sprint planning. What features are we building? How do we prioritize? Who owns what?"
    },
    "retro": {
        "attendees": ["conductor", "metric", "archivist", "helpline"],
        "prompt": "Sprint retrospective. What worked? What didn't? What do we improve?"
    },
    "security": {
        "attendees": ["sentinel", "vaultguard", "datastore", "counsel"],
        "prompt": "Security review. Audit findings. Vulnerability assessment. Compliance check."
    }
}


def summon_agent(agent_name: str) -> dict:
    """
    Summon a specific agent with their context and prompt.

    Args:
        agent_name: Name of the agent to summon

    Returns:
        Agent info dict with summon prompt
    """
    agent_key = agent_name.lower().replace("@", "").replace(" ", "-")

    if agent_key not in AGENT_ROSTER:
        print(f"Unknown agent: {agent_name}")
        print(f"Use 'python agent_summoner.py roster' to see all agents.")
        return None

    agent = AGENT_ROSTER[agent_key]

    # Try to load SKILL.md if it exists
    skill_file = SKILLS_DIR / agent_key / "SKILL.md"
    skill_content = None
    if skill_file.exists():
        skill_content = skill_file.read_text(encoding='utf-8')[:1000]  # First 1000 chars

    result = {
        "agent": agent_key,
        "human_name": agent["human_name"],
        "nickname": agent["nickname"],
        "role": agent["role"],
        "skills": agent["skills"],
        "summon_prompt": agent["summon_prompt"],
        "skill_file_exists": skill_file.exists(),
        "summoned_at": datetime.now().isoformat()
    }

    print(f"\n{'='*60}")
    print(f"SUMMONING: @{agent_key.upper()}")
    print(f"{'='*60}")
    print(f"\n{agent['human_name']} \"{agent['nickname']}\"")
    print(f"Role: {agent['role']}")
    print(f"Skills: {', '.join(agent['skills'])}")
    print(f"\n--- ACTIVATION PROMPT ---\n")
    print(agent["summon_prompt"])
    print(f"\n{'='*60}")

    return result


def assemble_team(task_type: str) -> list:
    """
    Assemble the right team for a task type.

    Args:
        task_type: Type of task (feature, security, deployment, etc.)

    Returns:
        List of agent info dicts
    """
    task_key = task_type.lower()

    if task_key not in TEAM_COMPOSITIONS:
        print(f"Unknown task type: {task_type}")
        print(f"Available types: {', '.join(TEAM_COMPOSITIONS.keys())}")
        return None

    team_members = TEAM_COMPOSITIONS[task_key]
    team = []

    print(f"\n{'='*60}")
    print(f"ASSEMBLING TEAM FOR: {task_type.upper()}")
    print(f"{'='*60}")

    for agent_key in team_members:
        agent = AGENT_ROSTER[agent_key]
        team.append({
            "agent": agent_key,
            "human_name": agent["human_name"],
            "nickname": agent["nickname"],
            "role": agent["role"]
        })
        print(f"\n  @{agent_key}: {agent['human_name']} \"{agent['nickname']}\"")
        print(f"    Role: {agent['role']}")

    print(f"\n{'='*60}")
    print(f"Team assembled. {len(team)} agents ready.")

    return team


def start_meeting(meeting_type: str) -> dict:
    """
    Start a team meeting with the right attendees.

    Args:
        meeting_type: Type of meeting (standup, incident, planning, retro)

    Returns:
        Meeting info dict
    """
    meeting_key = meeting_type.lower()

    if meeting_key not in MEETING_TYPES:
        print(f"Unknown meeting type: {meeting_type}")
        print(f"Available types: {', '.join(MEETING_TYPES.keys())}")
        return None

    meeting = MEETING_TYPES[meeting_key]

    print(f"\n{'='*60}")
    print(f"BOARDROOM SESSION: {meeting_type.upper()}")
    print(f"{'='*60}")

    print(f"\nAttendees:")
    for agent_key in meeting["attendees"]:
        agent = AGENT_ROSTER[agent_key]
        print(f"  @{agent_key}: {agent['human_name']}")

    print(f"\n--- MEETING PROMPT ---\n")
    print(meeting["prompt"])
    print(f"\n{'='*60}")

    return {
        "type": meeting_type,
        "attendees": meeting["attendees"],
        "prompt": meeting["prompt"],
        "started_at": datetime.now().isoformat()
    }


def show_roster():
    """Display the full 24-agent roster."""
    print(f"\n{'='*60}")
    print("THE ORCHESTRA - AgOS 2.0 AGENT ROSTER")
    print(f"{'='*60}")

    for agent_key, agent in AGENT_ROSTER.items():
        print(f"\n  @{agent_key}")
        print(f"    {agent['human_name']} \"{agent['nickname']}\"")
        print(f"    {agent['role']}")

    print(f"\n{'='*60}")
    print(f"Total: {len(AGENT_ROSTER)} agents")


def main():
    """CLI entry point."""
    if len(sys.argv) < 2:
        print("""
Agent Summoner - AgOS 2.0
Built by @Conductor (Marcus Cole "The Maestro")

Usage:
    python agent_summoner.py summon <agent_name>
    python agent_summoner.py team <task_type>
    python agent_summoner.py meeting <type>
    python agent_summoner.py roster

Task Types:
    feature, security, deployment, monetization, research,
    trading, content, database, debugging, launch

Meeting Types:
    standup, incident, planning, retro, security

Examples:
    python agent_summoner.py summon pixel
    python agent_summoner.py team security
    python agent_summoner.py meeting standup
        """)
        sys.exit(1)

    command = sys.argv[1]

    if command == "summon":
        if len(sys.argv) < 3:
            print("Usage: python agent_summoner.py summon <agent_name>")
            sys.exit(1)
        summon_agent(sys.argv[2])

    elif command == "team":
        if len(sys.argv) < 3:
            print("Usage: python agent_summoner.py team <task_type>")
            sys.exit(1)
        assemble_team(sys.argv[2])

    elif command == "meeting":
        if len(sys.argv) < 3:
            print("Usage: python agent_summoner.py meeting <type>")
            sys.exit(1)
        start_meeting(sys.argv[2])

    elif command == "roster":
        show_roster()

    else:
        print(f"Unknown command: {command}")
        sys.exit(1)


if __name__ == "__main__":
    main()
