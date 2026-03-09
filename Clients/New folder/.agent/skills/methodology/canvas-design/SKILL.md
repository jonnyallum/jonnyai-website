---
# Methodology Skill Card — Jai.OS 5.0
name: "canvas-design"
version: "1.0.0"
type: methodology
description: "Figma/canvas-based design system workflows — component creation, frame organisation, and handoff-ready design file ma..."
category: design
complexity: medium
domains: ["automation", "design"]
updated: "2026-03-01"
---

# Canvas Design

## Description

Figma/canvas-based design system workflows — component creation, frame organisation, and handoff-ready design file management.

## Implementation Instructions

1. Open or create a Figma file aligned to the active design system.
2. Use the master component library — never create ad-hoc components on canvas.
3. Apply design tokens (color, spacing, typography) from the token library, not raw values.
4. Organise frames in logical page hierarchy: Atoms → Molecules → Organisms → Pages.
5. Annotate interactive states and edge cases before handoff.
6. Export assets to the agreed spec format and update the component changelog.

## Constraints

- DO NOT use raw hex values — reference design tokens only.
- ALWAYS detach components from the library before modifying shared instances.
- DO NOT export without accessibility annotations (alt text, ARIA labels) defined.
