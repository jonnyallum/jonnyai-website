---
# Methodology Skill Card — Jai.OS 5.0
name: "expected-value-calculator"
version: "1.0.0"
type: methodology
description: "EV calculation, Kelly Criterion stake sizing, and edge quantification for sports and casino betting decisions."
category: betting
complexity: medium
domains: ["general"]
updated: "2026-03-01"
---

# Expected Value Calculator

## Description

EV calculation, Kelly Criterion stake sizing, and edge quantification for sports and casino betting decisions.

## Implementation Instructions

1. Define the event outcome probability using the agreed model (form, stats, or simulation).
2. Calculate implied probability from bookmaker odds: 1 divided by decimal odds.
3. Compute EV: (model_probability x net_win) minus ((1 minus model_probability) x stake).
4. Confirm positive EV before proceeding: EV must exceed minimum edge threshold.
5. Apply Kelly Criterion: stake = (bp minus q) / b, where b = odds minus 1, p = model prob, q = 1 minus p.
6. Cap Kelly output at the defined maximum stake fraction (typically 3-5% of bankroll).

## Constraints

- DO NOT bet on negative EV positions regardless of gut feel.
- ALWAYS apply fractional Kelly (0.25x) unless operating a high-confidence system.
- DO NOT proceed if model probability confidence interval spans the break-even point.
