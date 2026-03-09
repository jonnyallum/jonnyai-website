---
# Methodology Skill Card — Jai.OS 5.0
name: "horse-racing-form-analysis"
version: "1.0.0"
type: methodology
description: "Form, going, handicap, trainer/jockey intelligence for race selection and value identification."
category: betting
complexity: medium
domains: ["betting", "devops"]
updated: "2026-03-01"
---

# Horse Racing Form Analysis

## Description

Form, going, handicap, trainer/jockey intelligence for race selection and value identification.

## Implementation Instructions

1. Pull race card: distance, going, class, and prize money.
2. Review each runner: last 3 runs, going preferences, weight, and trainer form.
3. Assess jockey booking significance — stable jockey vs conditional or booking change.
4. Apply handicap rating analysis: identify horses running off a mark below their peak.
5. Compare model probability to market odds — identify runners with positive EV.
6. Confirm stable confidence signals before committing.

## Constraints

- DO NOT select on going preference without at least 2 confirmed runs on the surface.
- ALWAYS check late scratchings and going updates before placement.
- DO NOT bet in races with more than 14 runners without a strong form-based reason.
