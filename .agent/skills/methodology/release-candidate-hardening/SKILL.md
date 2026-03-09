---
# Methodology Skill Card — Jai.OS 5.0
name: "release-candidate-hardening"
version: "1.0.0"
type: methodology
description: "Final-stage hardening checks and smoke tests performed on a release candidate before production deployment."
category: security
complexity: medium
domains: ["security"]
updated: "2026-03-01"
---

# Release Candidate Hardening

## Description

Final-stage hardening checks and smoke tests performed on a release candidate before production deployment.

## Implementation Instructions

1. Execute a comprehensive suite of high-level smoke tests in a production-identical environment.
2. Perform security scans and sensitive-data leak checks.
3. Validate configuration, certificates, and environment variables.
4. Verify roll-back readiness and data-migration safety.
5. Final approval required from owning agent/human after all hardening gates pass.

## Constraints

- **DO NOT** skip hardening gates for "hotfixes" without explicit override.
- **ALWAYS** document any identified issues during the hardening phase.
- **DO NOT** deploy if any p0 hardening test fails.
