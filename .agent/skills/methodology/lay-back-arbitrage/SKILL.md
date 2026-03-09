---
# Methodology Skill Card — Jai.OS 5.0
name: "lay-back-arbitrage"
version: "1.0.0"
type: methodology
description: "Lay-back strategy, betting exchange arbitrage, and market position management for guaranteed profit extraction."
category: betting
complexity: medium
domains: ["betting"]
updated: "2026-03-01"
---

# Lay-Back Arbitrage

## Description

Lay-back strategy, betting exchange arbitrage, and market position management for guaranteed profit extraction.

## Implementation Instructions

1. Identify an opening price gap between a bookmaker back price and exchange lay price.
2. Calculate arbitrage profit: (1/back_odds + 1/lay_odds) less than 1 confirms positive arb.
3. Size the lay stake to create equal profit across all outcomes.
4. Account for commission: apply exchange commission rate to lay liability calculation.
5. Execute back bet first, then place lay bet before market moves.
6. Record the position, expected profit, and commission cost in the arb log.

## Constraints

- DO NOT execute if the commission-adjusted arb margin is less than 0.5%.
- ALWAYS confirm liquidity on the lay side before placing the back bet.
- DO NOT place matched bets on restricted accounts without confirming limits.
