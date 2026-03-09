---
# Methodology Skill Card — Jai.OS 5.0
name: "motion-system-rationalization"
version: "1.0.0"
type: methodology
description: "Motion pattern standardisation — auditing, simplifying, and governing animation and transition systems for clarity, p..."
category: design
complexity: medium
domains: ["design", "web"]
updated: "2026-03-01"
---

# Motion System Rationalization

## Description

Motion pattern standardisation — auditing, simplifying, and governing animation and transition systems for clarity, performance, and UX consistency.

## Implementation Instructions

1. Audit all existing animation and transition definitions across the codebase.
2. Map motion patterns to purpose categories: feedback, navigation, emphasis, decoration.
3. Flag and remove purely decorative motion that adds no UX signal.
4. Standardise durations, easing curves, and reduced-motion alternatives.
5. Define motion tokens: duration scale, easing library, delay patterns.
6. Validate performance: all animations must run at 60fps — replace JS animations with CSS where possible.
7. Brief @priya and @sebastian on the rationalised motion system before implementation.

## Constraints

- DO NOT add motion without a declared purpose (feedback, navigation, or emphasis).
- ALWAYS provide a prefers-reduced-motion alternative for every animation.
- DO NOT use JS-driven animations where CSS transitions can achieve the same result.
