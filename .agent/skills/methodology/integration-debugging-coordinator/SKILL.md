---
# Methodology Skill Card — Jai.OS 5.0
name: "integration-debugging-coordinator"
version: "1.0.0"
type: methodology
description: "Orchestrates debugging across multiple services and agents using cross-service trace analysis and sequential hypothes..."
category: testing
complexity: medium
domains: ["backend", "testing", "web"]
updated: "2026-03-01"
---

# Integration Debugging Coordinator

## Description
Orchestrates debugging across multiple services and agents using cross-service trace analysis and sequential hypothesis testing.

## Implementation Instructions
1.  **Trace:** Follow the request from Frontend -> API -> Database.
2.  **Isolate:** Determine which agent-owned module is failing.
3.  **Hypothesize:** Propose the most likely point of failure.
4.  **Verify:** Use logs and telemetry to confirm the hypothesis.
5.  **Repair:** Coordinate with the specific agent (e.g. Jonny or Datastore) to fix.

## Constraints
- **DO NOT** point fingers; focus on system-wide resolution.
- **ALWAYS** document the root cause in the Archivist knowledge base.
