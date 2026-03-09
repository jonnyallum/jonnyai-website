---
# Methodology Skill Card — Jai.OS 5.0
name: "five-second-clarity-test"
version: "1.0.0"
type: methodology
description: "Dashboard clarity validation — testing whether the primary decision is legible to a user within five seconds of viewing."
category: testing
complexity: medium
domains: ["analytics", "testing"]
updated: "2026-03-01"
---

# Five-Second Clarity Test

## Description

Dashboard clarity validation — testing whether the primary decision is legible to a user within five seconds of viewing.

## Implementation Instructions

1. Present the dashboard layout to an uninitiated reviewer for exactly 5 seconds.
2. Ask: what is the primary action or insight this dashboard is telling you.
3. If the reviewer cannot state the primary insight correctly, the layout has failed.
4. Identify the hierarchy failure: is the primary KPI visually dominant, is the trend clear.
5. Redesign the offending element and repeat the test.
6. Log pass/fail results in the DASHBOARD_SPEC.md under the quality gate section.

## Constraints

- DO NOT pass a dashboard that fails the 5-second test — redesign first.
- ALWAYS run the test with someone unfamiliar with the data domain.
- DO NOT skip the test for small dashboards — all views require clarity validation.
