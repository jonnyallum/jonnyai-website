---
# Methodology Skill Card — Jai.OS 5.0
name: "motogp-race-analysis"
version: "1.0.0"
type: methodology
description: "MotoGP telemetry interpretation, race pace analysis, and betting line evaluation for race and championship markets."
category: betting
complexity: medium
domains: ["betting"]
updated: "2026-03-01"
---

# MotoGP Race Analysis

## Description

MotoGP telemetry interpretation, race pace analysis, and betting line evaluation for race and championship markets.

## Implementation Instructions

1. Review FP1-FP3 telemetry summaries: top speed, sector times, and tyre compounds.
2. Assess bike reliability history for the circuit and team setup history.
3. Model grid-to-finish probability factoring track position value and overtaking data.
4. Review championship standings for motivational factors.
5. Compare qualifying position to race simulation — identify over/underpriced runners.
6. Flag value in top-3 finish markets where implied probability diverges from model.

## Constraints

- DO NOT finalise bets before qualifying results confirm grid positions.
- ALWAYS consider weather: MotoGP bikes are highly weather-sensitive.
- DO NOT ignore tyre allocation constraints.
