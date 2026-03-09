---
# Methodology Skill Card — Jai.OS 5.0
name: "postmortem-action-tracker"
version: "1.0.0"
type: methodology
description: "System for tracking, assigning, and ensuring completion of all remedial tasks identified during incident postmortems."
category: operations
complexity: medium
domains: ["operations"]
updated: "2026-03-01"
---

# Postmortem Action Tracker

## Description

System for tracking, assigning, and ensuring completion of all remedial tasks identified during incident postmortems.

## Implementation Instructions

1. Convert every "Prevention Item" in a postmortem into a tracked ticket.
2. Assign owners and due dates based on priority (p0=48h, p1=7d).
3. Conduct weekly "Action Triage" to check progress and unblock tasks.
4. Escalate overdue p0 actions to leadership agents.
5. Closing: Certify the task is "verified fixed" before closing the ticket.

## Constraints

- **DO NOT** lose actions in the noise of new tickets.
- **ALWAYS** include a "Verification Step" for every remediation.
- **DO NOT** close a postmortem without 100% of actions assigned and ownered.
