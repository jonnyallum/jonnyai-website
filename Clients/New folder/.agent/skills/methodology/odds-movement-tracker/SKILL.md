---
# Methodology Skill Card — Jai.OS 5.0
name: "odds-movement-tracker"
version: "1.0.0"
type: methodology
description: "Real-time odds movement detection, line value identification, and optimal timing for bet placement."
category: betting
complexity: medium
domains: ["betting"]
updated: "2026-03-01"
---

# Odds Movement Tracker

## Description

Real-time odds movement detection, line value identification, and optimal timing for bet placement.

## Implementation Instructions

1. Set opening line baseline for target markets at odds publication.
2. Monitor price movement at 24h, 6h, 2h, and 1h before event.
3. Classify movement: steam (sharp money), drift (public fade), or manipulation.
4. Cross-reference movement with team news, weather updates, and sharp-action signals.
5. Identify value windows: back when price drifts above model fair value; lay when it steams below.
6. Log all movements with timestamp, reason, and action taken for post-event review.

## Constraints

- DO NOT chase a drifting price without understanding the reason for the drift.
- ALWAYS set a minimum time threshold (e.g., 30 min before event) before acting on late movement.
- DO NOT treat line movement as a signal in isolation — confirm with form/news context.
