---
# Methodology Skill Card — Jai.OS 5.0
name: "hallucination-detection-pipeline"
version: "1.0.0"
type: methodology
description: "Detects and classifies hallucinations through claim extraction, evidence retrieval, and confidence scoring."
category: devops
complexity: medium
domains: ["ai", "automation", "data", "devops"]
updated: "2026-03-01"
---

# Hallucination Detection Pipeline

## Description

Detects and classifies hallucinations through claim extraction, evidence retrieval, and confidence scoring.

## Implementation Instructions

1. Extract atomic claims from generated outputs.
2. Retrieve independent sources for each claim.
3. Score claims as Confirmed / Likely / Unverified / False.
4. Aggregate hallucination rate and failure patterns.
5. Feed corrective actions into prompts, retrieval, and policies.

## Constraints

- **DO NOT** label unsupported claims as factual.
- **ALWAYS** separate model confidence from evidence confidence.
- **DO NOT** skip citation storage for verification trails.
