---
# Methodology Skill Card — Jai.OS 5.0
name: "roulette-probability-engine"
version: "1.0.0"
type: methodology
description: "Roulette probability modelling, edge calculation, and betting system evaluation."
category: betting
complexity: medium
domains: ["betting"]
updated: "2026-03-01"
---

# Roulette Probability Engine

## Description

Roulette probability modelling, edge calculation, and betting system evaluation.

## Implementation Instructions

1. Determine wheel type (European/American/French) and calculate base house edge.
2. Model the probability distribution for the target bet type (single, split, outside).
3. Run session simulation at target stake size and session length — calculate expected loss.
4. Evaluate any proposed betting system (Martingale, D'Alembert, Fibonacci) against true EV.
5. Document the system ruin probability at given bankroll depth.
6. Recommend only systems that preserve bankroll within acceptable risk parameters.

## Constraints

- DO NOT present any betting system as capable of overcoming house edge.
- ALWAYS disclose session expected loss alongside any system recommendation.
- DO NOT model progressive systems without including ruin probability.
