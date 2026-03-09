---
# Methodology Skill Card — Jai.OS 5.0
name: "project-health-scoring"
version: "1.0.0"
type: methodology
description: "Real-time project health scoring — composite health index from timeline, budget, quality, and communication signals."
category: project
complexity: medium
domains: ["project"]
updated: "2026-03-01"
---

# Project Health Scoring

## Description

Real-time project health scoring — composite health index from timeline, budget, quality, and communication signals.

## Implementation Instructions

1. Define health dimensions: Timeline (30%), Budget (25%), Quality (25%), Communication (20%).
2. Score each dimension weekly: on-track (10), minor drift (6), critical drift (2).
3. Calculate composite health score: weighted sum of dimension scores.
4. Classify project health: 8-10 (Green), 5-7 (Amber), under 5 (Red).
5. Post health score to the client Glass Box portal and internal project record.
6. Trigger intervention SOP if score drops to Red: @marcus review within 24 hours.

## Constraints

- DO NOT self-report a health score without verifiable data for each dimension.
- ALWAYS surface health scores to the client — transparency is non-negotiable.
- DO NOT allow a project to remain Red for over 48 hours without an escalation action logged.
