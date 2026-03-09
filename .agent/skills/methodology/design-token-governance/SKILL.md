---
# Methodology Skill Card — Jai.OS 5.0
name: "design-token-governance"
version: "1.0.0"
type: methodology
description: "Token lifecycle management — review cadences, adoption compliance tracking, and deprecation workflows for design toke..."
category: design
complexity: medium
domains: ["automation", "design", "operations"]
updated: "2026-03-01"
---

# Design Token Governance

## Description

Token lifecycle management — review cadences, adoption compliance tracking, and deprecation workflows for design token libraries.

## Implementation Instructions

1. Audit the active token library for unused, duplicate, or undocumented tokens.
2. Classify each token: active, deprecated, or candidate-for-removal.
3. Review naming conventions against the taxonomy standard — flag violations.
4. Run cross-system compliance check: confirm all consuming apps reference current token names.
5. Execute deprecation cycle: add deprecation notice, publish migration guide, remove after N sprints.
6. Publish token changelog and notify @priya and @sebastian of any breaking changes.

## Constraints

- DO NOT remove a token without a deprecation notice period of at least 2 sprints.
- ALWAYS publish a migration guide when renaming or removing tokens.
- DO NOT approve new token additions without checking for existing semantic equivalents.
