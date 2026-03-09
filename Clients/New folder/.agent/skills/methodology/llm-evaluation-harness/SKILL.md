---
# Methodology Skill Card — Jai.OS 5.0
name: "llm-evaluation-harness"
version: "1.0.0"
type: methodology
description: "Defines repeatable evaluation pipelines for prompts, agent behaviors, and LLM outputs using golden datasets, score th..."
category: ai
complexity: medium
domains: ["ai", "analytics", "automation"]
updated: "2026-03-01"
---

# LLM Evaluation Harness

## Description

Defines repeatable evaluation pipelines for prompts, agent behaviors, and LLM outputs using golden datasets, score thresholds, and release gates.

## Implementation Instructions

1. Define task-specific evaluation sets (golden examples + adversarial edge cases).
2. Establish metrics: factuality, instruction-following, latency, cost, and safety compliance.
3. Build automated eval runner for every prompt/model/config change.
4. Set pass/fail thresholds and block release on regression.
5. Log trend reports and route failures to owning agent.

## Constraints

- **DO NOT** ship prompt/model changes without eval comparisons.
- **ALWAYS** include at least one hallucination-focused test set.
- **DO NOT** use subjective scoring without rubric definitions.
