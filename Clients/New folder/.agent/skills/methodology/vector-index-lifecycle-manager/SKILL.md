---
# Methodology Skill Card — Jai.OS 5.0
name: "vector-index-lifecycle-manager"
version: "1.0.0"
type: methodology
description: "Governance of vector index builds, refreshes, quality checks, and archival to ensure retrieval accuracy and performance."
category: data
complexity: medium
domains: ["analytics", "data"]
updated: "2026-03-01"
---

# Vector Index Lifecycle Manager

## Description

Governance of vector index builds, refreshes, quality checks, and archival to ensure retrieval accuracy and performance.

## Implementation Instructions

1. Define index refresh schedules based on data volatility.
2. Implement retrieval precision/recall benchmarks for every major index update.
3. Manage index versioning and rollback capability for poor quality updates.
4. Audit for stale or irrelevant entries and implement archival logic.
5. Monitor index size and performance latency metrics.

## Constraints

- **DO NOT** push unvalidated index updates to production.
- **ALWAYS** maintain index provenance (which source created which vector).
- **DO NOT** allow retrieval latency to exceed 500ms for system tasks.
