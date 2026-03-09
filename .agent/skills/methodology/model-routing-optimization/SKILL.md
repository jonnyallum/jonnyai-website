---
# Methodology Skill Card — Jai.OS 5.0
name: "model-routing-optimization"
version: "1.0.0"
type: methodology
description: "Optimizes model selection dynamically using policy rules for cost, latency, capability fit, and reliability."
category: ai
complexity: medium
domains: ["ai"]
updated: "2026-03-01"
---

# Model Routing Optimization

## Description

Optimizes model selection dynamically using policy rules for cost, latency, capability fit, and reliability.

## Implementation Instructions

1. Define routing profiles by task type and quality requirement.
2. Benchmark candidate models on latency, cost, and outcome quality.
3. Implement fallback chains for outage or policy violation.
4. Monitor route outcomes and retrain routing rules.
5. Report savings and quality deltas to stakeholders.

## Constraints

- **DO NOT** route solely by lowest cost.
- **ALWAYS** preserve minimum quality thresholds.
- **DO NOT** deploy routing changes without A/B validation.
