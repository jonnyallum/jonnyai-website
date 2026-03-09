---
# Methodology Skill Card — Jai.OS 5.0
name: "test-suite-prioritization"
version: "1.0.0"
type: methodology
description: "Risk-based selection and prioritization of test cases to optimize CI duration while maintaining high confidence in re..."
category: testing
complexity: medium
domains: ["testing"]
updated: "2026-03-01"
---

# Test Suite Prioritization

## Description

Risk-based selection and prioritization of test cases to optimize CI duration while maintaining high confidence in release quality.

## Implementation Instructions

1. Categorize tests by risk (p0: critical path, p1: core logic, p2: edge case).
2. Map tests to code artifacts for targeted execution on changes.
3. Prioritize flaky/recent-failure tests in the execution queue.
4. Implement "fail-fast" logic for critical p0 tests.
5. Continuously update priorities based on production failure patterns.

## Constraints

- **DO NOT** skip p0 (critical) tests regardless of CI duration.
- **ALWAYS** run the full suite for major version releases.
- **DO NOT** allow prioritization to result in "dead zones" where tests are never run.
