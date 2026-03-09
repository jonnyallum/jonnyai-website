---
# Methodology Skill Card — Jai.OS 5.0
name: "prompt-version-control"
version: "1.0.0"
type: methodology
description: "Manages prompt lifecycle with semantic versioning, diff tracking, test gates, and safe rollback."
category: ai
complexity: medium
domains: ["ai"]
updated: "2026-03-01"
---

# Prompt Version Control

## Description

Manages prompt lifecycle with semantic versioning, diff tracking, test gates, and safe rollback.

## Implementation Instructions

1. Store prompts in source control with ownership metadata.
2. Version prompts semantically for behavior-impacting changes.
3. Run evaluation harness before and after each prompt revision.
4. Annotate changes with intent and expected outcome.
5. Maintain rollback-ready last-known-good prompt versions.

## Constraints

- **DO NOT** hot-edit production prompts outside version control.
- **ALWAYS** pair prompt updates with regression tests.
- **DO NOT** merge prompts missing clear change rationale.
