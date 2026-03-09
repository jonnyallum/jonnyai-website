---
# Methodology Skill Card — Jai.OS 5.0
name: "chaos-testing-orchestration"
version: "1.0.0"
type: methodology
description: "Controlled, scheduled failure-injection exercises to validate system resilience and agent recovery logic."
category: testing
complexity: medium
domains: ["analytics", "testing"]
updated: "2026-03-01"
---

# Chaos Testing Orchestration

## Description

Controlled, scheduled failure-injection exercises to validate system resilience and agent recovery logic.

## Implementation Instructions

1. Define the experiment: Which service/tool will fail? (e.g., DB latency).
2. Establish steady-state metrics (normal behavior).
3. Inject the failure in a controlled, sandbox/staging environment.
4. Monitor agent detection, alerting, and auto-recovery flow.
5. Document findings and fix resilience gaps discovered.

## Constraints

- **DO NOT** run chaos experiments in production without mature experience.
- **ALWAYS** have a "Stop & Rollback" button ready mid-test.
- **DO NOT** run multiple experiments simultaneously if results could overlap.
