---
# Methodology Skill Card — Jai.OS 5.0
name: "schema-drift-monitor"
version: "1.0.0"
type: methodology
description: "Automated detection and reporting of database or contract schema drift across dev, staging, and production environments."
category: data
complexity: medium
domains: ["automation", "backend", "data"]
updated: "2026-03-01"
---

# Schema Drift Monitor

## Description

Automated detection and reporting of database or contract schema drift across dev, staging, and production environments.

## Implementation Instructions

1. Establish a "source of truth" schema definition (e.g., migration files).
2. Run scheduled drift checks comparing live schemas to the source of truth.
3. Report any unauthorized schema changes, mission-critical missing fields, or type mismatches.
4. Implement alerts for drift detection in production.
5. Verify schema alignment before every new deployment.

## Constraints

- **DO NOT** allow production-to-dev drift to exceed 24 hours.
- **ALWAYS** fail builds if schema drift is detected and unresolved.
- **DO NOT** attempt auto-remediation without manual approval on critical tables.
