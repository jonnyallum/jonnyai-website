---
# Methodology Skill Card — Jai.OS 5.0
name: "feature-flag-governance"
version: "1.0.0"
type: methodology
description: "Rules and lifecycle management for feature flags to prevent technical debt and ensure safe, targeted rollouts."
category: operations
complexity: medium
domains: ["automation", "operations"]
updated: "2026-03-01"
---

# Feature Flag Governance

## Description

Rules and lifecycle management for feature flags to prevent technical debt and ensure safe, targeted rollouts.

## Implementation Instructions

1. Establish naming conventions and mandatory ownership for flags.
2. Set expiry dates for flags and implement automated cleanup reminders.
3. Audit active flags to ensure they aren't masking legacy code.
4. Implement blast-radius controls and targeted audience targeting.
5. Create roll-back plans in case a flagged feature causes a failure.

## Constraints

- **DO NOT** leave flags active for longer than 30 days without review.
- **ALWAYS** verify flag state and defaults before production releases.
- **DO NOT** use feature flags for permanent configuration logic.
