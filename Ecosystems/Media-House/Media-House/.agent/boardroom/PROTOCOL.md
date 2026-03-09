# The Boardroom Protocol
> *Formal collaboration rituals for the Antigravity Agency*

## Overview

The Boardroom is where agents convene for structured collaboration. Every meeting has a purpose, an owner, and an outcome. No meeting ends without action items.

---

## Meeting Types

### 1. Mission Briefing (Project Kickoff)

**Purpose:** Align the team on a new complex project
**Trigger:** New project requiring 3+ agents or spanning 1+ weeks
**Facilitator:** @Conductor
**Duration:** 15-30 min equivalent
**Output:** Mission spec in `.tmp/missions/[project-name].md`

#### Agenda
1. **Mission Statement** - What are we building and why?
2. **Scope Definition** - In-scope vs out-of-scope boundaries
3. **Resource Allocation** - Who owns what deliverable?
4. **Risk Assessment** - What could go wrong? (Sentinel leads)
5. **Success Criteria** - How do we know we won? (Metric defines)
6. **Timeline** - Key milestones and deadlines
7. **Open Floor** - Questions, concerns, clarifications

#### Summoning Matrix
| Project Type | Required | Optional |
|:-------------|:---------|:---------|
| New Feature | Conductor, Jonny AI, Pixel | Sentinel, Datastore |
| API/Backend | Conductor, Jonny AI, Datastore | Sentinel, DevOps |
| SEO Campaign | Conductor, Goldie, Echo | Scout, Metric |
| Security Audit | Conductor, Sentinel, Vaultguard | DevOps, Datastore |
| Deployment | Conductor, Deploy, Sentinel | DevOps, Autoflow |
| Monetization | Conductor, Forge, Metric | Echo, Pixel |
| Trading System | Conductor, Delboy, Metric | Vaultguard, Sentinel |
| E-commerce | Conductor, Warehouse, Forge | Pixel, Echo, Metric |
| Content Launch | Conductor, Echo, Clippers | Goldie, Pixel |
| Mobile App | Conductor, Jonny AI, Pixel | Sentinel, DevOps |

---

### 2. Team Talk (Issue Resolution)

**Purpose:** Resolve blockers, conflicts, or "something feels wrong" moments
**Trigger:** Quality gate failure, blocker, cross-agent friction
**Facilitator:** @Conductor
**Duration:** 10-15 min equivalent
**Output:** Resolution decision + action items

#### Agenda
1. **Issue Statement** - What's broken or blocked? (Reporting agent)
2. **Impact Assessment** - How bad is this? (Conductor)
3. **Root Cause Analysis** - Why did this happen? (Relevant agents)
4. **Proposed Solutions** - Options with trade-offs (All)
5. **Decision** - Which path forward? (Conductor decides)
6. **Action Items** - Who does what by when?
7. **Learning Capture** - What do we document? (Archivist)

---

### 3. Sprint Review (Weekly Retrospective)

**Purpose:** Reflect on the week, capture learnings, plan ahead
**Trigger:** End of week or sprint cycle
**Facilitator:** @Conductor
**Duration:** 20-30 min equivalent
**Output:** Entries in `docs/IMPROVEMENT_LOG.md` + agent SKILL.md updates

#### Agenda
1. **Wins** - What went well this week? (All share)
2. **Losses** - What didn't go well? (All share, no blame)
3. **Learnings** - What did we learn? (Captured for SKILL.md)
4. **Metrics Review** - KPIs and trends (Metric presents)
5. **Skill Gaps** - Training needs identified (Conductor flags)
6. **Next Sprint** - Priorities and focus areas

---

### 4. Incident Response (War Room)

**Purpose:** Coordinate rapid response to critical issues
**Trigger:** Production outage, security breach, critical failure
**Facilitator:** @Conductor (or @Sentinel for security incidents)
**Duration:** Until resolved
**Output:** Incident report + runbook update

#### Roles
- **Incident Commander:** Conductor (coordinates response)
- **Technical Lead:** Jonny AI or relevant specialist
- **Communications:** Echo (if user-facing)
- **Documentation:** Archivist (real-time logging)

#### Protocol
1. **STOP** - Halt non-critical work
2. **ASSESS** - What's the blast radius?
3. **CONTAIN** - Prevent further damage
4. **FIX** - Implement solution
5. **VERIFY** - Confirm resolution
6. **DOCUMENT** - Incident report + runbook
7. **LEARN** - Update SKILL.md files

---

## The Boardroom Code

### Rules of Engagement

1. **Come Prepared** - Review context before joining
2. **Stay Focused** - One topic at a time
3. **Time-Box Contributions** - Each agent gets 2-3 turns max
4. **No Silent Observers** - If summoned, contribute or excuse yourself
5. **Decision Authority** - Conductor has final say (escalate to Jonny for P0)
6. **Action Items Required** - No meeting ends without clear next steps
7. **Documentation Mandatory** - Archivist captures all decisions

### Decision Authority Levels

| Level | Scope | Examples | Approver |
|:------|:------|:---------|:---------|
| **L1** | Tactical | Code style, tool choice | Self (Agent) |
| **L2** | Operational | API design, handoff protocol | Conductor |
| **L3** | Strategic | New agent, major refactor | Conductor + Jonny |
| **L4** | Critical | Pricing, legal, security | Jonny (The Boss) |

### Escalation Path

```
Agent -> Conductor -> Jonny (The Boss)
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
**Facilitator:** @Conductor
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
- [Learning 1] -> Update @Agent SKILL.md
- [Learning 2] -> Add to docs/runbooks/[topic].md

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

Conductor reviews daily and routes blockers to relevant agents.
