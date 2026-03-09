---
# Methodology Skill Card — Jai.OS 5.0
name: "football-value-betting"
version: "1.0.0"
type: methodology
description: "Tactical analysis, team form assessment, and value identification for football betting markets."
category: betting
complexity: medium
domains: ["betting"]
updated: "2026-03-01"
---

# Football Value Betting

## Description

Tactical analysis, team form assessment, and value identification for football betting markets.

## Implementation Instructions

1. Pull current league table, last 5 results, and head-to-head record for both teams.
2. Assess tactical matchup: formation vs formation, pressing intensity, set-piece threats.
3. Review key player availability — suspensions, injuries, and rotation risk.
4. Identify implied probability from bookmaker odds and compare to fair model price.
5. Flag value if model price exceeds implied odds by at least the predefined edge threshold.
6. Record stake recommendation using Kelly Criterion at capped bankroll fraction.

## Constraints

- DO NOT bet on markets where the edge is less than 3% after juice.
- ALWAYS verify team news within 1 hour of kick-off before finalising.
- DO NOT exceed bankroll stake cap regardless of edge size.
