---
# Methodology Skill Card — Jai.OS 5.0
name: "agent-memory-architecture"
version: "1.0.0"
type: methodology
description: "Design and implementation of short-term (context) and long-term (vector/relational) memory systems, including retriev..."
category: ai
complexity: medium
domains: ["ai"]
updated: "2026-03-01"
---

# Agent Memory Architecture

## Description

Design and implementation of short-term (context) and long-term (vector/relational) memory systems, including retrieval strategies, decay policies, and summarization.

## Implementation Instructions

1. Define memory tiers: ephemeral (session), working (scratchpad), and long-term (vector/DB).
2. Implement retrieval strategy (top-k, MM-retrieval, or recency-weighted).
3. Establish decay and pruning policies to prevent context window saturation.
4. Build summarization triggers for long sessions to preserve key outcomes.
5. Create memory-audit tools to verify retrieval relevance and accuracy.

## Constraints

- **DO NOT** store sensitive PII in unencrypted long-term memory.
- **ALWAYS** validate retrieval relevance before injecting into context.
- **DO NOT** allow memory growth to degrade system latency.
