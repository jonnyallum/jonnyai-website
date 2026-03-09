# The Boardroom Protocol
> *Formal collaboration rituals for the Antigravity Orchestra — Jai.OS 5.0*

## Overview

The Boardroom is where agents convene for structured collaboration. Every meeting has a purpose, an owner, and an outcome. No meeting ends without action items.

---

## Meeting Types

### 1. Mission Briefing (Project Kickoff)

**Purpose:** Align the team on a new complex project
**Trigger:** New project requiring 3+ agents or spanning 1+ weeks
**Facilitator:** @marcus
**Duration:** 15-30 min equivalent
**Output:** Mission spec in `.tmp/missions/[project-name].md`

#### Agenda
1. **Mission Statement** - What are we building and why?
2. **Scope Definition** - In-scope vs out-of-scope boundaries
3. **Resource Allocation** - Who owns what deliverable?
4. **Risk Assessment** - What could go wrong? (@riskguard leads)
5. **Success Criteria** - How do we know we won? (@maya defines)
6. **Timeline** - Key milestones and deadlines (@julian / @chronos)
7. **Open Floor** - Questions, concerns, clarifications

#### Summoning Matrix
| Project Type | Required | Optional |
|:-------------|:---------|:---------|
| New Feature | @marcus, @sebastian | @sam, @diana |
| API/Backend | @marcus, @sebastian, @diana | @sam, @derek |
| SEO Campaign | @marcus, @grace, @elena | @sophie, @maya |
| Security Audit | @marcus, @sam, @victor | @derek, @diana |
| Deployment | @marcus, @owen, @sam | @derek, @alex |
| Monetization | @marcus, @felix, @maya | @elena, @priya |
| Trading System | @marcus, @trotter, @maya | @victor, @sam |
| E-commerce | @marcus, @winston, @felix | @priya, @elena, @maya |
| Content Launch | @marcus, @elena, @carlos | @grace, @priya |
| Course Design | @marcus, @coursewright | @elena, @priya, @carlos |
| Mobile App | @marcus, @sebastian, @priya | @sam, @milo |
| Agent Build | @marcus, @neo | @vigil |
| Betting System | @marcus, @redeye | @gareth, @sterling, @monty |

---

### 2. Team Talk (Issue Resolution)

**Purpose:** Resolve blockers, conflicts, or "something feels wrong" moments
**Trigger:** Quality gate failure, blocker, cross-agent friction
**Facilitator:** @marcus
**Duration:** 10-15 min equivalent
**Output:** Resolution decision + action items

#### Agenda
1. **Issue Statement** - What's broken or blocked? (Reporting agent)
2. **Impact Assessment** - How bad is this? (@marcus)
3. **Root Cause Analysis** - Why did this happen? (Relevant agents)
4. **Proposed Solutions** - Options with trade-offs (All)
5. **Decision** - Which path forward? (@marcus decides)
6. **Action Items** - Who does what by when?
7. **Learning Capture** - What do we document? (@arthur)

---

### 3. Sprint Review (Weekly Retrospective)

**Purpose:** Reflect on the week, capture learnings, plan ahead
**Trigger:** End of week or sprint cycle
**Facilitator:** @marcus
**Duration:** 20-30 min equivalent
**Output:** Entries to Shared Brain via `brain_sync.py` + SKILL.md updates

#### Agenda
1. **Wins** - What went well this week? (All share)
2. **Losses** - What didn't go well? (All share, no blame)
3. **Learnings** - What did we learn? (Propagated to Shared Brain)
4. **Metrics Review** - KPIs and trends (@nina presents)
5. **Skill Gaps** - Training needs identified (@vigil flags)
6. **Next Sprint** - Priorities and focus areas

---

### 4. Incident Response (War Room)

**Purpose:** Coordinate rapid response to critical issues
**Trigger:** Production outage, security breach, critical failure
**Facilitator:** @marcus (or @sam for security incidents)
**Duration:** Until resolved
**Output:** Incident report + runbook update

#### Roles
- **Incident Commander:** @marcus (coordinates response)
- **Technical Lead:** @sebastian or relevant specialist
- **Communications:** @elena (if user-facing)
- **Documentation:** @arthur (real-time logging)

#### Protocol
1. **STOP** - Halt non-critical work
2. **ASSESS** - What's the blast radius? (@riskguard scores)
3. **CONTAIN** - Prevent further damage (@sam leads)
4. **FIX** - Implement solution (specialist agent)
5. **VERIFY** - Confirm resolution (@vigil signs off)
6. **DOCUMENT** - Incident report + runbook (@arthur)
7. **LEARN** - Update SKILL.md files + propagate to Shared Brain

---

## The Boardroom Code

### Rules of Engagement

1. **Sync First, Ship Second** - No agent acts in a specialist domain without querying their SKILL.md or the Shared Brain agents table.
2. **Shared Brain First** - Query Supabase `agents` table before assuming any agent's capabilities.
3. **Come Prepared** - Review chatroom.md and Shared Brain before joining meetings.
4. **Stay Focused** - One topic at a time.
5. **Time-Box Contributions** - Each agent gets 2-3 turns max.
6. **No Silent Observers** - If summoned, contribute or excuse yourself.
7. **Decision Authority** - @marcus has final say (escalate to Jonny for P0).
8. **Action Items Required** - No meeting ends without clear next steps.
9. **Documentation Mandatory** - @arthur captures all decisions.

### Decision Authority Levels

| Level | Scope | Examples | Approver |
|:------|:------|:---------|:---------|
| **L1** | Tactical | Code style, tool choice | Self (Agent) |
| **L2** | Operational | API design, handoff protocol | @marcus |
| **L3** | Strategic | New agent, major refactor | @marcus + Jonny |
| **L4** | Critical | Pricing, legal, security | Jonny (The Boss) |

### Escalation Path

```
Agent → @marcus → Jonny (The Boss)
```

**Emergency Override:** Any agent can escalate directly to Jonny for:
- Security breaches
- Legal/compliance issues
- Data loss risk
- Financial impact > threshold

---

## Meeting Minutes Template

All meetings produce minutes in `.agent/boardroom/meetings/`

**Filename:** `YYYY-MM-DD-[type]-[topic].md`

```markdown
# [Meeting Type]: [Topic]
**Date:** YYYY-MM-DD HH:MM
**Facilitator:** @marcus
**Attendees:** @Agent1, @Agent2, ...

## Context
[Why this meeting was called - 1-2 sentences]

## Discussion Summary

### [Agenda Item 1]
- @Agent: [Position/Input]
- @Agent: [Response/Counter]
- **Decision:** [What was decided]

### [Agenda Item 2]
...

## Action Items
- [ ] @Agent: [Task description] - Due: [Date]
- [ ] @Agent: [Task description] - Due: [Date]

## Learnings Captured
- [Learning 1] → Propagate via brain_sync.py
- [Learning 2] → Update @Agent SKILL.md

## Next Steps
[What happens after this meeting]
```

---

## Async Standup Protocol

For daily coordination without formal meetings, agents maintain status in their Learning Log:

| Field | Content |
|:------|:--------|
| **Yesterday** | What was completed |
| **Today** | What's planned |
| **Blockers** | What's in the way |

@julian reviews daily and routes blockers to relevant agents. @chronos flags any at-risk deadlines.

---

## The Chatroom (Informal High-Velocity Collaboration)

**Purpose:** Real-time brainstorming, quick updates, and agency banter.
**Location:** `.agent/boardroom/chatroom.md` — full history synced to Supabase `chatroom` table
**Facilitator:** @marcus (Moderation) / @arthur (Logging)

### Rules of the Room
1. **Handle Prefixing:** Always start your message with your agent handle (e.g., `@marcus: `).
2. **Context Awareness:** Before posting, read the previous 5-10 entries to ensure you're in sync.
3. **No Gossip about the Boss:** @Jonny is always watching. Keep it professional... mostly.
4. **Action Capture:** If an idea gains traction, the owner must formalize it into a Task or DECISION_LOG.md.
5. **Session Separation:** Use `---` with a `YYYY-MM-DD | HH:MM UTC` timestamp to separate active conversation blocks.
6. **Persistence:** Run `python execution/sync_chatroom.py` to push local history to Supabase. Use `--archive` to reset the local file monthly.

---

_Jai.OS 5.0 | Boardroom Protocol | Last Updated: 2026-02-23_
