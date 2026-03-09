---
# Methodology Skill Card — Jai.OS 5.0
name: "change-impact-analysis"
version: "1.0.0"
type: methodology
description: "Method for performing dependency-aware assessments to predict the impact of planned code or infrastructure changes."
category: devops
complexity: medium
domains: ["general"]
updated: "2026-03-01"
---

# Change Impact Analysis

## Description

Method for performing dependency-aware assessments to predict the impact of planned code or infrastructure changes.

## Implementation Instructions

1. Map the dependencies of the target component/service.
2. Analyze the change for breaking contract shifts or side effects.
3. Score the "Blast Radius" of the change.
4. Recommend testing strategies based on the impact score (unit vs integration vs e2e).
5. Require explicit sign-off for high-impact changes.

## Constraints

- **DO NOT** push "minor" changes without a quick impact scan.
- **ALWAYS** check for hidden dependencies (e.g., shared DB tables).
- **DO NOT** deploy if the blast-radius risk is unmitigated.
