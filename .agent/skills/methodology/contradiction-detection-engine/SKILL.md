---
# Methodology Skill Card — Jai.OS 5.0
name: "contradiction-detection-engine"
version: "1.0.0"
type: methodology
description: "Automated logic for detecting cross-source contradictions and internal inconsistencies in agent-generated summaries o..."
category: devops
complexity: medium
domains: ["automation"]
updated: "2026-03-01"
---

# Contradiction Detection Engine

## Description

Automated logic for detecting cross-source contradictions and internal inconsistencies in agent-generated summaries or reports.

## Implementation Instructions

1. Compare claims from multiple sources on the same topic.
2. Flag contradictory facts, figures, or dates.
3. Check for internal logical consistency within generated deliverables.
4. Route contradictions for manual triage or secondary retrieval.
5. Monitor for "hallucinated consensus" where agents merge contradictory data.

## Constraints

- **DO NOT** publish summaries containing unresolved contradictions.
- **ALWAYS** flag the specific sources that are in conflict.
- **DO NOT** prioritize one source over another without confidence scoring.
