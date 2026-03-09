---
# Methodology Skill Card — Jai.OS 5.0
name: "improvement-scanning"
version: "1.0.0"
type: methodology
description: "Continuous Improvement & Gap Analysis"
category: project
complexity: high
domains: ["automation", "project"]
updated: "2026-03-01"
---
## Description

Systematic scanning for improvement opportunities across all Orchestra systems and processes.

## Implementation Instructions

Follow the three SOPs: Daily Session Scan, Gap Analysis Workflow, and Improvement Ticket Protocol.

# Continuous Improvement & Gap Analysis

> **Goal**: Proactively detect process friction and skill gaps before they cause mission failure.

---

## SOP-001: Daily Session Scan

**Trigger:** Session Start.

1. **Verify Agent Health**: Scan `agent-health.json` for "BLOCKED" or "FAILED" streaks.
2. **Review Task Friction**: Search chatroom for terms like "timeout", "error", or "retry".
3. **Identify Incomplete Loops**: Flag learnings that were captured but not propagated via `jonnyai-mcp`.
4. **Post Daily Audit**: Brief @Marcus on system integrity.

## SOP-002: Gap Analysis Workflow

**Trigger:** A task fails or requires >3 retries.

1. **Document Gap**: Describe the missing tool, skill, or data in `system_gaps.md`.
2. **Severity Assessment**:
   - **P0**: Mission-stopping (Action: Mandatory Training Day).
   - **P1**: Friction-heavy (Action: Create new methodology skill).
   - **P2**: Optimization-only (Action: Add to next sprint).
3. **Recommend Fix**: Propose a new agent, script, or directive update.

## SOP-003: Improvement Ticket Protocol

**Trigger:** Gap analyzed.

1. **Create Ticket**: Document implementation steps for the fix.
2. **Assign Executor**: NEXT_HOP to @Adrian (for scripts) or @Sebastian (for architecture).
3. **Track Resolution**: Follow up in 48 hours for GATE_CLEARED status.

---

_Jai.OS 5.0 | Method Library | Self-Annealing_


## Constraints

- **DO NOT** log improvements without a clear action item and owner.
- **ALWAYS** prioritize improvements by impact score before scheduling.
- **DO NOT** skip the daily scan even when the system appears healthy.
