# Feedback Loop Protocol
> *How agents learn and improve continuously*

## The Learning Cycle

```
Task Completed → Outcome Captured → Pattern Detected → SKILL.md Updated → Future Improved
```

---

## Feedback Types

### 1. Task Feedback
**Trigger:** Every completed task
**Captured By:** @Archivist (or auto-logged)
**Data Points:**
- Task type
- Agent(s) involved
- Success/Failure
- Duration
- Blockers encountered
- Human intervention required

### 2. Incident Feedback
**Trigger:** Failed quality gate, production issue, blocked task
**Captured By:** @Sentinel + @Archivist
**Data Points:**
- Root cause category
- Agents involved
- Resolution steps
- Prevention measures
- SKILL.md updates required

### 3. Performance Feedback
**Trigger:** Weekly sprint review
**Captured By:** @Metric
**Data Points:**
- Tasks completed vs planned
- Quality gate pass rate
- Human override frequency
- Cross-agent collaboration score

---

## Agent Health Dashboard

Each agent's health is tracked in `.agent/memory/learnings/[agent-name].json`:

```json
{
  "agent": "jonny-ai",
  "period": "2026-W05",
  "metrics": {
    "tasks_completed": 47,
    "tasks_blocked": 3,
    "quality_gate_pass_rate": 0.94,
    "avg_task_duration_minutes": 12,
    "human_interventions": 2
  },
  "learnings_this_period": [
    "Drizzle ORM requires explicit type casting for UUID comparisons"
  ],
  "skill_updates": [
    "Added Drizzle UUID pattern to workflows"
  ],
  "training_needs": []
}
```

---

## Learning Extraction Process

### Step 1: Detect Pattern
When an agent encounters the same issue 3+ times:
- Log the pattern type
- Flag for review

### Step 2: Extract Learning
@Archivist captures:
- What was the issue?
- What was the root cause?
- What is the fix?
- How can this be prevented?

### Step 3: Update Knowledge
- Add to agent's SKILL.md (Section 9: Learning Log)
- Update relevant methodology files if broadly applicable
- Create/update runbook if needed

### Step 4: Propagate
If learning applies to multiple agents:
- Update shared methodology in `.agent/skills/methodology/`
- Notify affected agents via @Conductor in next standup

---

## Skill Gap Detection

### Triggers
1. Agent fails same task type 3+ times
2. Agent requires human help on >20% of tasks
3. New project type has no specialist
4. Cross-agent handoff friction detected

### Process
1. **@Conductor** flags gap during sprint review
2. **@Archivist** documents the gap
3. **Options:**
   - Train existing agent (update SKILL.md)
   - Create new methodology
   - Propose new agent to Jonny

---

## Continuous Improvement Metrics

| Metric | Target | Review Frequency |
|:-------|:-------|:----------------|
| Quality gate pass rate | >95% | Weekly |
| Human intervention rate | <10% | Weekly |
| Learning extraction rate | >80% of incidents | Sprint |
| SKILL.md update frequency | 1+ per agent/month | Monthly |
| Methodology additions | 2+ per month | Monthly |

---

## Inter-AI Communication Protocol

For communication between different AI systems (Claude Code ↔ Antigravity/Gemini):

### Message Format
Files in `.tmp/` directory:
- `message4claude.md` - Messages TO Claude Code
- `message4antigravity.md` - Messages TO Antigravity (main AI)
- `message4gemini.md` - Messages TO Gemini AI

### Message Structure
```markdown
# Message For [Target AI]
**From**: [Sender Agent]
**To**: [Target AI]
**Context**: [Project/Task Context]
**Path**: [Relevant file paths]

---

## Status/Update
[Current status, findings, or request]

## Action Required
[What the receiving AI should do]

## Response Expected
[Where to write the response]
```

### Use Cases
- Handoff between AI systems on same project
- Progress updates on long-running tasks
- Requesting assistance from specialized AI
- Coordinating multi-AI workflows

---

## Feedback Loop Integration Points

### With Boardroom
- Sprint Review generates learnings → Feed to SKILL.md updates
- Incident Response captures root cause → Feed to runbooks
- Team Talk decisions → Document in meeting minutes

### With Auto-Sync
- SKILL.md updates trigger validation
- Successful updates sync to GitHub
- Updates propagate to client workspaces

### With Agent Profiles
- Performance Metrics section updated from health data
- Learning Log section updated with captured learnings
- Training Day Skills informed by gap detection
