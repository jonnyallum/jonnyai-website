---
# Methodology Skill Card — Jai.OS 5.0
name: "f1-strategy-analysis"
version: "1.0.0"
type: methodology
description: "Formula 1 race strategy analysis — pitstop windows, tyre degradation, and driver performance intel for pre-race and l..."
category: betting
complexity: medium
domains: ["betting"]
updated: "2026-03-01"
---

# F1 Strategy Analysis

## Description

Formula 1 race strategy analysis — pitstop windows, tyre degradation, and driver performance intel for pre-race and live betting.

## Implementation Instructions

1. Review qualifying grid, tyre compound choices, and weather forecast.
2. Model undercut/overcut pitstop windows for top 5 runners.
3. Assess track position value for the specific circuit.
4. Identify safety car probability based on circuit history and field spread.
5. Map betting market probabilities to model race simulation outputs.
6. Flag value positions pre-race; update live if safety car or early retirements occur.

## Constraints

- DO NOT finalise race winner bets without reviewing the grid penalty list.
- ALWAYS factor in wet-weather tyre allocation if forecast shows more than 30% rain probability.
- DO NOT ignore DNF risk for teams with known reliability issues.
