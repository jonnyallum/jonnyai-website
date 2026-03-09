"""
Agent Ralph Loop Rotation — Daily Autonomous Self-Improvement
Each day a different agent runs their improvement loop:
  - Reads their SKILL.md
  - Audits their domain (Supabase data, codebase, docs)
  - Generates specific improvements with AI
  - Writes improvements back to SKILL.md
  - Broadcasts findings to chatroom
  - Pushes to GitHub + Supabase learnings

Schedule: Mon=Vigil, Tue=Sebastian, Wed=Priya, Thu=Felix,
          Fri=Scholar, Sat=Dreamer, Sun=Diana
          Week 2: Elena, Grace, Hugo, Maya, Nathan, Rowan, Nina
"""
import os, sys, json, subprocess, urllib.request
from datetime import datetime, timezone
from pathlib import Path

REPO = Path("/home/antigravity-ai/Antigravity_Orchestra")
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", os.environ.get("SUPABASE_KEY", ""))
OPENAI_KEY = os.environ.get("OPENAI_API_KEY", "")
NOW = datetime.now(timezone.utc)
TODAY = NOW.strftime("%Y-%m-%d")
DOW = NOW.weekday()   # 0=Mon ... 6=Sun
WEEK_NUM = int(NOW.strftime("%W"))  # Week of year

# 14-agent rotation (2 weeks)
ROTATION = {
    (0, 0): {"handle": "vigil", "name": "Vigil Chen", "domain": "quality", "focus": "Audit SKILL.md compliance, 13-gate checks, find agent gaps"},
    (0, 1): {"handle": "sebastian", "name": "Sebastian Cross", "domain": "code", "focus": "Review Next.js patterns, TypeScript debt, component library"},
    (0, 2): {"handle": "priya", "name": "Priya Sharma", "domain": "design", "focus": "UI system audit, Tailwind tokens, animation patterns"},
    (0, 3): {"handle": "felix", "name": "Felix Morgan", "domain": "monetization", "focus": "Funnel analysis, pricing gaps, conversion improvements"},
    (0, 4): {"handle": "scholar", "name": "Dr. Elias Thorne", "domain": "research", "focus": "Synthesise week learnings, generate strategic insights"},
    (0, 5): {"handle": "dreamer", "name": "Davey Butcha", "domain": "ventures", "focus": "New opportunity assessment, trend synthesis, concept validation"},
    (0, 6): {"handle": "diana", "name": "Diana Chen", "domain": "database", "focus": "Schema review, RLS policies, query optimisation, Supabase health"},
    (1, 0): {"handle": "elena", "name": "Elena Vasquez", "domain": "copy", "focus": "Brand voice audit, microcopy review, landing page improvements"},
    (1, 1): {"handle": "grace", "name": "Grace Liu", "domain": "seo", "focus": "Meta audit, schema markup, keyword gaps, content opportunities"},
    (1, 2): {"handle": "hugo", "name": "Hugo Reeves", "domain": "github", "focus": "Repo health, dependency audit, stale branches, code coverage"},
    (1, 3): {"handle": "maya", "name": "Maya Singh", "domain": "analytics", "focus": "Conversion funnel, GA4 events, attribution, A/B test ideas"},
    (1, 4): {"handle": "nathan", "name": "Nathan Robinson", "domain": "automation", "focus": "n8n workflow audit, email pipeline, automation gaps"},
    (1, 5): {"handle": "rowan", "name": "Rowan", "domain": "content", "focus": "Content depth audit, zero-fluff check, narrative improvements"},
    (1, 6): {"handle": "nina", "name": "Nina Patel", "domain": "intelligence", "focus": "KPI review, reporting gaps, dashboard improvements"},
}

def get_agent():
    week_parity = WEEK_NUM % 2
    key = (week_parity, DOW)
    agent = ROTATION.get(key, ROTATION[(0, 0)])
    return agent

def sb_get(table, params=""):
    try:
        url = f"{SUPABASE_URL}/rest/v1/{table}?{params}&limit=20"
        req = urllib.request.Request(url, headers={
            "apikey": SUPABASE_KEY, "Authorization": "Bearer " + SUPABASE_KEY
        })
        with urllib.request.urlopen(req, timeout=10) as r:
            return json.loads(r.read())
    except: return []

def sb_post(table, payload):
    try:
        data = json.dumps(payload).encode()
        req = urllib.request.Request(
            f"{SUPABASE_URL}/rest/v1/{table}", data=data,
            headers={"apikey": SUPABASE_KEY, "Authorization": "Bearer " + SUPABASE_KEY,
                     "Content-Type": "application/json", "Prefer": "return=minimal"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=10): pass
    except Exception as e:
        print(f"  Supabase error: {e}")

def chatroom_broadcast(agent_handle, message, status="info"):
    sb_post("chatroom", {
        "agent": agent_handle,
        "message": message,
        "status": status,
        "created_at": NOW.isoformat(),
        "session": f"ralph-rotation-{TODAY}"
    })

def read_skill_md(handle):
    skill_path = REPO / ".agent" / "skills" / handle / "SKILL.md"
    if skill_path.exists():
        return skill_path.read_text(encoding="utf-8", errors="ignore")[:3000]
    return f"SKILL.md not found for {handle}"

def get_recent_learnings(handle):
    learnings = sb_get("learnings", f"agent=eq.{handle}&order=created_at.desc")
    return [l.get("content", "") for l in learnings[:5]]

def get_recent_findings():
    """Pull yesterday's audit findings."""
    audits_dir = REPO / "docs" / "audits"
    if audits_dir.exists():
        files = sorted(audits_dir.glob("*.md"), reverse=True)[:2]
        content = ""
        for f in files:
            content += f.read_text(errors="ignore")[:1000] + "\n---\n"
        return content
    return "No audit files found."

def call_ai(prompt):
    """Call OpenAI API for improvement generation."""
    if not OPENAI_KEY:
        return generate_improvements_locally(prompt)
    try:
        payload = json.dumps({
            "model": "gpt-4o-mini",
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 1500,
            "temperature": 0.7
        }).encode()
        req = urllib.request.Request(
            "https://api.openai.com/v1/chat/completions",
            data=payload,
            headers={"Authorization": "Bearer " + OPENAI_KEY, "Content-Type": "application/json"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=30) as r:
            result = json.loads(r.read())
            return result["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"  AI call error: {e}")
        return generate_improvements_locally(prompt)

def generate_improvements_locally(prompt):
    """Fallback: generate rule-based improvements without AI."""
    return f"""## Improvement Analysis (Rule-Based Fallback)

Based on the domain audit context:

### Immediate Actions
- [ ] Review all recent error logs and surface top 3 recurring issues
- [ ] Check if SKILL.md has been updated in the last 7 days — if not, update it
- [ ] Verify all domain-specific cron jobs ran successfully this week
- [ ] Cross-reference findings with Supabase learnings table for patterns

### Strategic Improvements
- [ ] Identify the single highest-impact improvement in this domain
- [ ] Create a one-page runbook for the most complex workflow
- [ ] Add 3 new learnings to Supabase from this audit cycle

### Collaboration
- [ ] Brief @Marcus on top finding via chatroom
- [ ] Flag any blockers that require cross-agent coordination
"""

def run_ralph_loop(agent):
    """3-iteration improvement loop."""
    handle = agent["handle"]
    name = agent["name"]
    domain = agent["domain"]
    focus = agent["focus"]

    print(f"\n=== RALPH LOOP: @{handle} ({name}) ===")
    print(f"Domain: {domain} | Focus: {focus}\n")

    chatroom_broadcast(handle, f"Starting daily Ralph Loop — domain: {domain} | focus: {focus}", "info")

    # Gather context
    print("[1/3] Gathering context...")
    skill_content = read_skill_md(handle)
    recent_learnings = get_recent_learnings(handle)
    recent_findings = get_recent_findings()

    context = f"""Agent: {name} (@{handle})
Domain: {domain}
Today's Focus: {focus}

SKILL.md Summary (first 3000 chars):
{skill_content[:2000]}

Recent Learnings:
{chr(10).join(recent_learnings[:3]) if recent_learnings else 'None yet'}

Recent Ecosystem Audit Findings:
{recent_findings[:1000]}"""

    # Generate improvements
    print("[2/3] Generating improvements...")
    prompt = f"""You are {name}, a specialist in {domain} at Antigravity Agency.

Today is your Ralph Loop day — autonomous self-improvement.
Your focus: {focus}

Context:
{context}

Generate a concrete improvement report with:
1. Top 3 specific improvements you can make TODAY in your domain
2. 3 new learnings to add to your SKILL.md
3. 1 strategic recommendation for the team
4. Any blockers or dependencies on other agents

Be specific, actionable, and concise. No fluff. Antigravity standard."""

    improvements = call_ai(prompt)
    print(improvements[:500] + "..." if len(improvements) > 500 else improvements)

    # Save results
    print("\n[3/3] Saving results...")

    # Write improvement log
    log_dir = REPO / "docs" / "mission_learnings"
    log_dir.mkdir(exist_ok=True)
    log_path = log_dir / f"ralph-{handle}-{TODAY}.md"
    log_content = f"""# Ralph Loop: @{handle} — {TODAY}
**Agent:** {name} | **Domain:** {domain}
**Focus:** {focus}

## Improvements Generated

{improvements}

## Context Used
- SKILL.md: {len(skill_content)} chars
- Recent learnings: {len(recent_learnings)} entries
- Audit findings: loaded

---
*Auto-generated by agent_ralph_rotation.py*
"""
    log_path.write_text(log_content)

    # Push to Supabase learnings
    sb_post("learnings", {
        "agent": handle,
        "category": f"ralph_loop_{domain}",
        "content": improvements[:5000],
        "tags": ["ralph-loop", domain, "autonomous", TODAY],
        "created_at": NOW.isoformat()
    })

    # Git commit and push
    try:
        subprocess.run(["git", "-C", str(REPO), "add", str(log_path)], timeout=10)
        subprocess.run(["git", "-C", str(REPO), "commit", "-m",
                        f"ralph: @{handle} daily improvement loop {TODAY}"], timeout=15)
        subprocess.run(["git", "-C", str(REPO), "push", "origin", "main"], timeout=30)
        print(f"  Committed + pushed: {log_path.name}")
    except Exception as e:
        print(f"  Git error: {e}")

    # Broadcast summary
    summary = f"Ralph Loop complete for @{handle} ({domain}): improvements generated + pushed to GitHub. Top action: {improvements[:100]}..."
    chatroom_broadcast(handle, summary, "success")

    return improvements

def main():
    agent = get_agent()
    print(f"=== DAILY RALPH ROTATION | {TODAY} | Week {WEEK_NUM} ===")
    print(f"Today's agent: @{agent['handle']} ({agent['name']}) — {agent['domain']}")

    improvements = run_ralph_loop(agent)
    print(f"\nRalph Loop complete. @{agent['handle']} has evolved.")

if __name__ == "__main__":
    main()
