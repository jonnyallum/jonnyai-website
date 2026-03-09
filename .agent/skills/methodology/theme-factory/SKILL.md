---
# Methodology Skill Card — Jai.OS 5.0
name: "theme-factory"
version: "1.0.0"
type: methodology
description: "Design token generation and theme system creation — building scalable, maintainable token libraries and multi-theme s..."
category: design
complexity: medium
domains: ["design", "web"]
updated: "2026-03-01"
---

# Theme Factory

## Description

Design token generation and theme system creation — building scalable, maintainable token libraries and multi-theme switching architectures.

## Implementation Instructions

1. Audit existing color, spacing, and typography values for extraction into tokens.
2. Define token taxonomy: primitive (raw values) → semantic (role-based) → component (scoped).
3. Generate base theme file in agreed format (CSS custom properties, JSON, Tailwind config).
4. Create theme variants (dark, high-contrast, brand-alternate) via semantic token override.
5. Validate token coverage: every hard-coded value must resolve to a token.
6. Export theme to consuming systems and document token inventory.

## Constraints

- DO NOT name tokens after visual attributes (e.g., blue) — name by semantic role (e.g., color-brand-primary).
- ALWAYS maintain backwards-compatibility when modifying existing token names.
- DO NOT create component-scoped tokens without a corresponding semantic token parent.
