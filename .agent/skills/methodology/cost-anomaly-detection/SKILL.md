---
# Methodology Skill Card — Jai.OS 5.0
name: "cost-anomaly-detection"
version: "1.0.0"
type: methodology
description: "Detects unusual spend patterns across model tokens, tool calls, and infrastructure usage and triggers escalation work..."
category: performance
complexity: medium
domains: ["automation", "performance"]
updated: "2026-03-01"
---

# Cost Anomaly Detection

## Description

Detects unusual spend patterns across model tokens, tool calls, and infrastructure usage and triggers escalation workflows.

## Implementation Instructions

1. Establish baseline spend by service, agent, and workflow.
2. Set anomaly thresholds and seasonality-aware alerts.
3. Detect spikes and attribute cost to source actions.
4. Trigger containment actions (throttling, disable loops, approvals).
5. Publish weekly anomaly reports with remediation status.

## Constraints

- **DO NOT** rely on monthly billing to detect overspend.
- **ALWAYS** attribute anomalies to concrete workload drivers.
- **DO NOT** suppress alerts without documented justification.
