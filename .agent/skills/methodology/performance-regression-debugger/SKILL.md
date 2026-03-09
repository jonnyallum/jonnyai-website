---
# Methodology Skill Card — Jai.OS 5.0
name: "performance-regression-debugger"
version: "1.0.0"
type: methodology
description: "Identifies performance regressions through systematic profiling, benchmarking, and iterative testing."
category: testing
complexity: medium
domains: ["analytics", "performance", "testing"]
updated: "2026-03-01"
---

# Performance Regression Debugger

## Description
Identifies performance regressions through systematic profiling, benchmarking, and iterative testing.

## Implementation Instructions
1.  **Baseline:** Maintain a record of p95 response times for critical paths.
2.  **Alert:** Trigger on any >10% regression.
3.  **Profile:** Run flame graphs to find the hot code path.
4.  **Optimize:** Refactor the specific bottleneck.
5.  **Verify:** Confirm metrics return to baseline or better.

## Constraints
- **DO NOT** ignore regressions "under the hardware limit."
- **ALWAYS** test performance on the slowest supported device/network.
