---
# Methodology Skill Card — Jai.OS 5.0
name: "agent-runbook-incident-response"
version: "1.0.0"
type: methodology
description: "Provides structured incident triage, containment, rollback, and recovery procedures for agent system failures."
category: operations
complexity: medium
domains: ["ai", "devops", "operations"]
updated: "2026-03-01"
---

# Agent Runbook Incident Response

## Description

Provides structured incident triage, containment, rollback, and recovery procedures for agent system failures.

## Implementation Instructions

1. Classify incident severity and assign an owner.
2. Stabilize system by isolating failing tools/flows.
3. Execute rollback or failover playbooks.
4. Verify recovery with smoke tests and telemetry checks.
5. Publish postmortem with root cause and prevention actions.

## Constraints

- **DO NOT** troubleshoot blindly without timeline capture.
- **ALWAYS** prioritize containment before deep diagnosis.
- **DO NOT** close incidents without prevention tasks assigned.
