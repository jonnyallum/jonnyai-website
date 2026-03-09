---
# Methodology Skill Card — Jai.OS 5.0
name: "runbook-quality-audit"
version: "1.0.0"
type: methodology
description: "Systematic auditing and testing of runbook clarity, completeness, and effectiveness for operational tasks."
category: security
complexity: medium
domains: ["operations", "security"]
updated: "2026-03-01"
---

# Runbook Quality Audit

## Description

Systematic auditing and testing of runbook clarity, completeness, and effectiveness for operational tasks.

## Implementation Instructions

1. Selection: Pick a runbook for audit.
2. Blind Test: Have a "clean" agent/human execute the runbook with no prior context.
3. Measurement: Track completion time, error rate, and missing dependencies.
4. Refinement: Rewrite ambiguous steps and update asset links.
5. Recertify: Mark runbook as "Verified [Date]" after successful execution.

## Constraints

- **DO NOT** certify runbooks without a full end-to-end execution test.
- **ALWAYS** verify links to secrets or assets work for the executor.
- **DO NOT** allow runbooks to age more than 90 days without re-audit.
