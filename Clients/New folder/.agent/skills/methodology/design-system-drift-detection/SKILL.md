---
# Methodology Skill Card — Jai.OS 5.0
name: "design-system-drift-detection"
version: "1.0.0"
type: methodology
description: "System for detecting divergence from approved brand/design system patterns across multiple products and ecosystems."
category: design
complexity: medium
domains: ["automation", "design", "web"]
updated: "2026-03-01"
---

# Design System Drift Detection

## Description

System for detecting divergence from approved brand/design system patterns across multiple products and ecosystems.

## Implementation Instructions

1. Establish a "Source of Truth" in Figma or code (e.g., CSS tokens).
2. Automate audits of live product pages (CSS selectors, color codes, components).
3. Flag divergence from approved tokens (e.g., a "rogue" hex code).
4. Identify non-standard component implementations.
5. Report "Drift Score" and generate remediation tasks for design/engineering.

## Constraints

- **DO NOT** allow rogue CSS to accumulate in core product files.
- **ALWAYS** prioritize drift detection on high-visibility global components.
- **DO NOT** auto-fix drift without a visual regression check.
