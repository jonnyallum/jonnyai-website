# INCIDENT RESPONSE: [Incident Title]
**Severity:** SEV1 / SEV2 / SEV3
**Status:** ACTIVE / MITIGATED / RESOLVED
**Started:** YYYY-MM-DD HH:MM
**Resolved:** YYYY-MM-DD HH:MM (or ONGOING)

---

## War Room

| Role | Agent | Status |
|:-----|:------|:-------|
| Incident Commander | @Conductor | Active |
| Technical Lead | @[Specialist] | Active |
| Communications | @Echo | Standby |
| Documentation | @Archivist | Active |

---

## Timeline

| Time | Event | Action Taken |
|:-----|:------|:-------------|
| HH:MM | [Event 1] | [Response] |
| HH:MM | [Event 2] | [Response] |
| HH:MM | [Event 3] | [Response] |

---

## Impact Assessment

### Affected Systems
- [ ] Production website
- [ ] API endpoints
- [ ] Database
- [ ] User authentication
- [ ] Payment processing
- [ ] Other: [Specify]

### User Impact
- **Users affected:** [Number/Percentage]
- **Functionality lost:** [Description]
- **Data at risk:** Yes / No
- **Revenue impact:** [Estimate]

---

## Root Cause

**What happened:**
[Technical explanation of the failure]

**Why it happened:**
[Contributing factors]

**Why it wasn't prevented:**
[Gap in monitoring/testing/process]

---

## Resolution

### Immediate Fix
[What was done to stop the bleeding]

### Permanent Fix
[What will prevent recurrence]

### Verification
- [ ] Functionality restored
- [ ] Monitoring confirms stability
- [ ] No data loss confirmed
- [ ] Users notified (if applicable)

---

## Post-Incident Actions

### Within 24 Hours
- [ ] @Archivist: Complete incident report
- [ ] @Sentinel: Add regression test
- [ ] @[Owner]: Implement permanent fix

### Within 1 Week
- [ ] @Conductor: Schedule post-mortem review
- [ ] @[Agent]: Update runbook
- [ ] @[Agent]: Update SKILL.md with learnings

### Process Improvements
| Improvement | Owner | Due Date |
|:------------|:------|:---------|
| [Improvement 1] | @Agent | YYYY-MM-DD |
| [Improvement 2] | @Agent | YYYY-MM-DD |

---

## Learnings

**What we'll do differently:**
1. [Change 1]
2. [Change 2]

**SKILL.md updates:**
- @Sentinel: Add [monitoring pattern]
- @DevOps: Add [infrastructure check]
- @[Agent]: Add [specific guidance]

---

## Communication Log

| Time | Channel | Message | Sender |
|:-----|:--------|:--------|:-------|
| HH:MM | [Channel] | [Summary] | @Agent |

---
*Incident archived to: `.agent/memory/incidents/YYYY-MM-DD-[id].md`*
