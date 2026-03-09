---
# Methodology Skill Card — Jai.OS 5.0
name: "synthetic-test-data-generator"
version: "1.0.0"
type: methodology
description: "Creates realistic synthetic datasets for robust testing of APIs, workflows, and agent behavior across edge conditions."
category: testing
complexity: medium
domains: ["automation", "backend", "data", "testing"]
updated: "2026-03-01"
---

# Synthetic Test Data Generator

## Description

Creates realistic synthetic datasets for robust testing of APIs, workflows, and agent behavior across edge conditions.

## Implementation Instructions

1. Define schema and scenario coverage requirements.
2. Generate baseline and edge-case synthetic records.
3. Include malformed, adversarial, and boundary-value examples.
4. Validate generated data against expected constraints.
5. Version datasets and attach usage notes to test suites.

## Constraints

- **DO NOT** leak production PII into test datasets.
- **ALWAYS** include edge-case coverage, not just happy paths.
- **DO NOT** use unvalidated synthetic data in acceptance tests.
