---
# Methodology Skill Card — Jai.OS 5.0
name: "rollback-readiness-check"
version: "1.0.0"
type: methodology
description: "Pre-release verification of rollback readiness, ensuring all dependencies and data states allow for a safe restore."
category: devops
complexity: medium
domains: ["backend", "devops"]
updated: "2026-03-01"
---

# Rollback Readiness Check

## Description

Pre-release verification of rollback readiness, ensuring all dependencies and data states allow for a safe restore.

## Implementation Instructions

1. Verify rollback scripts exist and are updated for the new version.
2. Check that database migrations are "reversible" or have a restore plan.
3. Confirm that secrets and environment variables can be reverted.
4. Simulate a single-click rollback in high-fidelity staging.
5. "Rollback Certify" the release candidate before production push.

## Constraints

- **DO NOT** deploy if a safe rollback path is not verified.
- **ALWAYS** account for "Permanent state" actions (e.g., external API calls).
- **DO NOT** rely on "reloading the old build" if the database schema changed.
