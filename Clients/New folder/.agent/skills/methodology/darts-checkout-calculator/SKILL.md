---
# Methodology Skill Card — Jai.OS 5.0
name: "darts-checkout-calculator"
version: "1.0.0"
type: methodology
description: "Darts averages, checkout route probability, and tournament form analysis for match betting."
category: betting
complexity: medium
domains: ["betting"]
updated: "2026-03-01"
---

# Darts Checkout Calculator

## Description

Darts averages, checkout route probability, and tournament form analysis for match betting.

## Implementation Instructions

1. Pull player three-dart averages (last 10 legs), checkout percentage, and 180 rate.
2. Compare head-to-head record and surface (TV stage vs floor).
3. Model win probability using average differential and checkout conversion rates.
4. Identify optimal checkout routes for key scores (170, 121, 110) and assess risk profiles.
5. Compare model probability to bookmaker markets — flag value above edge threshold.
6. Assess fatigue and tournament stage: players in later rounds may show average drift.

## Constraints

- DO NOT use averages older than 3 months without recency weighting.
- ALWAYS verify match format (best of sets vs best of legs) before modelling.
- DO NOT bet first leg winner markets without reviewing starter statistics separately.
