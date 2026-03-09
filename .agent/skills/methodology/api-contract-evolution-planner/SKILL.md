---
# Methodology Skill Card — Jai.OS 5.0
name: "api-contract-evolution-planner"
version: "1.0.0"
type: methodology
description: "Coordinates versioned evolution of API contracts, ensuring backward compatibility and structured deprecation of legac..."
category: api
complexity: medium
domains: ["api", "automation", "backend"]
updated: "2026-03-01"
---

# API Contract Evolution Planner

## Description

Coordinates versioned evolution of API contracts, ensuring backward compatibility and structured deprecation of legacy endpoints.

## Implementation Instructions

1. Define a versioning strategy (URL, header, or payload-based).
2. Create evolution plans before breaking changes are implemented.
3. Implement automated tests to verify backward compatibility.
4. Establish a deprecation schedule with clear logging/alerts for callers.
5. Review contract changes for potential side effects on secondary systems.

## Constraints

- **DO NOT** introduce breaking changes without version increments.
- **ALWAYS** maintain at least one major version of backward compatibility.
- **DO NOT** remove legacy endpoints without usage verification.
