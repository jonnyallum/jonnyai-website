---
# Methodology Skill Card — Jai.OS 5.0
name: "context-window-optimization"
version: "1.0.0"
type: methodology
description: "Optimizes the use of limited context windows through compression, prioritization, and intelligent retrieval packing."
category: ai
complexity: medium
domains: ["ai"]
updated: "2026-03-01"
---

# Context Window Optimization

## Description

Optimizes the use of limited context windows through compression, prioritization, and intelligent retrieval packing.

## Implementation Instructions

1. Implement token counters for all context-injected data.
2. Define priority tiers for information (Essential, Supporting, Optional).
3. Apply compression techniques (summarization, structured pruning).
4. Use dynamic retrieval packing to fit maximum relevance into the window.
5. Monitor for "lost in the middle" effects and adjust priority logic.

## Constraints

- **DO NOT** exceed 80% of the model's max context window to avoid performance hits.
- **ALWAYS** prioritize system instructions and current task scope.
- **DO NOT** discard critical evidence without a summary fallback.
