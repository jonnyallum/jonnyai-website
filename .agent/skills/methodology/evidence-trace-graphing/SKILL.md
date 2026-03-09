---
# Methodology Skill Card — Jai.OS 5.0
name: "evidence-trace-graphing"
version: "1.0.0"
type: methodology
description: "Mapping of claims to their original evidence sources in a trace graph to accelerate verification, auditing, and updates."
category: security
complexity: medium
domains: ["backend"]
updated: "2026-03-01"
---

# Evidence Trace Graphing

## Description

Mapping of claims to their original evidence sources in a trace graph to accelerate verification, auditing, and updates.

## Implementation Instructions

1. Extract atomic claims from finalized research or copy.
2. Link each claim to its direct source (URL, document, timestamp).
3. Visualize the "evidence-density" of output segments.
4. Update the graph dynamically as new evidence or corrections emerge.
5. Use the trace graph for rapid spot-audits and truth-verification cycles.

## Constraints

- **DO NOT** leave any factual claim without a trace back to evidence.
- **ALWAYS** include source confidence scores in the trace graph.
- **DO NOT** allow orphan claims (claims with no source) in production output.
