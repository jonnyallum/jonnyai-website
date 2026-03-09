---
# Methodology Skill Card — Jai.OS 5.0
name: "execution-risk-scoring"
version: "1.0.0"
type: methodology
description: "Runtime scoring framework for agent-planned actions to automatically trigger human-in-the-loop (HITL) escalations."
category: security
complexity: medium
domains: ["automation"]
updated: "2026-03-01"
---

# Execution Risk Scoring

## Description

Runtime scoring framework for agent-planned actions to automatically trigger human-in-the-loop (HITL) escalations.

## Implementation Instructions

1. Define risk categories (Financial, Brand, Security, Technical).
2. Assign weights to specific tool calls (e.g., `run_command`=high, `view_file`=low).
3. Calculate an aggregate "Risk Score" for every mission plan.
4. Thresholds: <10 (Auto-exec), 10-30 (Notify User), >30 (Block & Require Approval).
5. Log risk scores and outcomes for threshold calibration.

## Constraints

- **DO NOT** allow high-risk actions without explicit approval logging.
- **ALWAYS** recalculate scores if the plan changes mid-execution.
- **DO NOT** use static thresholds; allow for ecosystem-specific overrides.
