---
# Methodology Skill Card — Jai.OS 5.0
name: "retrieval-quality-audit"
version: "1.0.0"
type: methodology
description: "Audits RAG retrieval quality via precision/recall checks, chunk diagnostics, and relevance scoring."
category: security
complexity: medium
domains: ["analytics", "security"]
updated: "2026-03-01"
---

# Retrieval Quality Audit

## Description

Audits RAG retrieval quality via precision/recall checks, chunk diagnostics, and relevance scoring.

## Implementation Instructions

1. Build query benchmark set with expected relevant chunks.
2. Measure retrieval precision@k, recall@k, and MRR.
3. Diagnose chunking strategy (size, overlap, metadata quality).
4. Tune embedding/index parameters and rerun benchmarks.
5. Document improvements and unresolved failure clusters.

## Constraints

- **DO NOT** evaluate generation quality without retrieval metrics.
- **ALWAYS** test both exact-match and semantic-match queries.
- **DO NOT** ship RAG changes without before/after retrieval stats.
