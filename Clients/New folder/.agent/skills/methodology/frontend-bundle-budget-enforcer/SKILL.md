---
# Methodology Skill Card — Jai.OS 5.0
name: "frontend-bundle-budget-enforcer"
version: "1.0.0"
type: methodology
description: "Enforces JS/CSS bundle size budgets with CI guardrails to maintain performance and avoid payload creep."
category: performance
complexity: medium
domains: ["performance", "web"]
updated: "2026-03-01"
---

# Frontend Bundle Budget Enforcer

## Description

Enforces JS/CSS bundle size budgets with CI guardrails to maintain performance and avoid payload creep.

## Implementation Instructions

1. Set maximum bundle size limits for critical and secondary assets.
2. Integrate size-reporting in every PR build cycle.
3. Fail CI runs if bundle sizes exceed the defined budget.
4. Audit third-party libraries for disproportionate impact on bundle size.
5. Recommend code-splitting and compression optimizations for failing budgets.

## Constraints

- **DO NOT** bypass bundle size limits without architectural justification.
- **ALWAYS** include a breakdown of the bundle in CI reports.
- **DO NOT** ship unminified or uncompressed assets to production.
