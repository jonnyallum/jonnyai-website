---
# Methodology Skill Card — Jai.OS 5.0
name: "ci-pipeline-flakiness-hunter"
version: "1.0.0"
type: methodology
description: "Detects, logs, and remediates flaky tests and unstable CI steps to maintain deployment velocity and trust."
category: devops
complexity: medium
domains: ["automation", "data", "devops", "testing"]
updated: "2026-03-01"
---

# CI Pipeline Flakiness Hunter

## Description

Detects, logs, and remediates flaky tests and unstable CI steps to maintain deployment velocity and trust.

## Implementation Instructions

1. Instrument CI steps for pass/fail history and duration.
2. Identify "flaky" patterns (test that fails then passes on retry).
3. Quarantine flaky tests and assign for immediate remediation.
4. Implement retry limits and stability reporting.
5. Audit environment dependencies as common sources of instability.

## Constraints

- **DO NOT** ignore flaky tests as "random noise."
- **ALWAYS** remove flaky tests from the critical path until fixed.
- **DO NOT** allow unstable CI steps to block reliable PRs.
