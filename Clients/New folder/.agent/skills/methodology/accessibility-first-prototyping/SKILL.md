---
# Methodology Skill Card — Jai.OS 5.0
name: "accessibility-first-prototyping"
version: "1.0.0"
type: methodology
description: "Method for building prototypes with accessibility constraints (keyboard, screen reader, contrast) as structural requi..."
category: testing
complexity: medium
domains: ["web"]
updated: "2026-03-01"
---

# Accessibility-First Prototyping

## Description

Method for building prototypes with accessibility constraints (keyboard, screen reader, contrast) as structural requirements from day one.

## Implementation Instructions

1. Define the prototype's core interactive flow.
2. Build with semantic HTML and ARIA labels as the base architecture.
3. Test with keyboard-only navigation before adding visual styling.
4. Audit contrast ratios and font readability in early wireframes.
5. Certify accessibility-readiness before handing off for visual polish.

## Constraints

- **DO NOT** treat accessibility as a "final layer" to be added later.
- **ALWAYS** use structural headings and landmark roles.
- **DO NOT** use color as the only way to convey meaning.
