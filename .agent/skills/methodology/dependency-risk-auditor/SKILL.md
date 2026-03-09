---
# Methodology Skill Card — Jai.OS 5.0
name: "dependency-risk-auditor"
version: "1.0.0"
type: methodology
description: "Evaluates security vulnerabilities, licensing risks, and maintenance status of all third-party dependencies."
category: security
complexity: medium
domains: ["automation", "security"]
updated: "2026-03-01"
---

# Dependency Risk Auditor

## Description

Evaluates security vulnerabilities, licensing risks, and maintenance status of all third-party dependencies.

## Implementation Instructions

1. Automate vulnerability scans for all imported packages (e.g., npm audit, Snyk).
2. Audit licenses to ensure compliance with project policies.
3. Monitor maintenance velocity and "bus factor" for critical dependencies.
4. Maintain a "vetted" package registry and block unapproved installs.
5. Schedule recurring dependency version upgrades and risk re-evaluations.

## Constraints

- **DO NOT** use unvetted third-party packages in core logic.
- **ALWAYS** fix or mitigate high-severity vulnerabilities within 48 hours.
- **DO NOT** ignore license conflicts during package intake.
