---
# Methodology Skill Card — Jai.OS 5.0
name: "dashboard-visual-hierarchy"
version: "1.0.0"
type: methodology
description: "Five-second layout design — establishing visual hierarchy, chart type selection, and panel priority for dashboard views."
category: design
complexity: medium
domains: ["analytics", "design"]
updated: "2026-03-01"
---

# Dashboard Visual Hierarchy

## Description

Five-second layout design — establishing visual hierarchy, chart type selection, and panel priority for dashboard views.

## Implementation Instructions

1. Sort KPIs by decision urgency: most critical metric is primary panel (top-left, largest).
2. Assign chart types: number cards for point-in-time values, sparklines for trends, bars for comparisons.
3. Apply 7-visualisation cap: if more than 7 panels are needed, split into views.
4. Validate with the 5-second rule: what does the user know in 5 seconds — if unclear, redesign.
5. Define color system: signal color for primary KPI, traffic-light thresholds (green/amber/red), colorblind-safe palette.
6. Produce a wireframe layout blueprint for handoff to @sebastian and @priya.

## Constraints

- DO NOT use pie charts, 3D effects, or dual-axis line charts in any panel.
- NEVER exceed 7 visualisations per dashboard view.
- ALWAYS validate the 5-second rule before signing off the layout.
