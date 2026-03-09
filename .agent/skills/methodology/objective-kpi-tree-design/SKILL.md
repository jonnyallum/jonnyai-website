---
# Methodology Skill Card — Jai.OS 5.0
name: "objective-kpi-tree-design"
version: "1.0.0"
type: methodology
description: "Architecture of KPI trees linking high-level business goals to granular signals and specific agent interventions."
category: design
complexity: medium
domains: ["analytics", "design", "project"]
updated: "2026-03-01"
---

# Objective & KPI Tree Design

## Description

Architecture of KPI trees linking high-level business goals to granular signals and specific agent interventions.

## Implementation Instructions

1. Start with the "North Star" goal.
2. Break it down into Leveraged Objectives (e.g., Revenue -> Conversion \* Traffic).
3. Mapping: Link each objective to a measurable KPI (signal).
4. Intervention: Assign specific agents/tasks to move each lever.
5. Periodic Tree Audit: Check for broken links or outdated signals.

## Constraints

- **DO NOT** design trees without measurable exit nodes (KPIs).
- **ALWAYS** ensure objectives are mutually exclusive and collectively exhaustive (MECE).
- **DO NOT** optimize a leaf-node that doesn't roll up to the North Star.
