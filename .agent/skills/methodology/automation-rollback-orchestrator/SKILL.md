---
# Methodology Skill Card — Jai.OS 5.0
name: "automation-rollback-orchestrator"
version: "1.0.0"
type: methodology
description: "Logic for sequencing and executing rollbacks across complex, multi-agent automated tasks to restore system stability."
category: devops
complexity: medium
domains: ["automation", "devops"]
updated: "2026-03-01"
---

# Automation Rollback Orchestrator

## Description

Logic for sequencing and executing rollbacks across complex, multi-agent automated tasks to restore system stability.

## Implementation Instructions

1. Map "reversible" vs. "permanent" actions for every automation.
2. Define failure-triggers that activate the rollback orchestrator.
3. Sequence rollback steps to ensure data integrity (e.g., delete record before closing file).
4. Implement "Half-Rollback" handling for partially failed restores.
5. Log rollback success/failure for root-cause analysis.

## Constraints

- **DO NOT** design automations without a clear rollback path.
- **ALWAYS** prioritize restoring state over deep investigation during an outage.
- **DO NOT** attempt auto-rollback on non-idempotent financial transactions.
