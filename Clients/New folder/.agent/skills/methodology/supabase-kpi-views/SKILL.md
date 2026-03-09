---
# Methodology Skill Card — Jai.OS 5.0
name: "supabase-kpi-views"
version: "1.0.0"
type: methodology
description: "Supabase materialized view design and query optimisation for BI KPI panels — sub-2-second performance targets."
category: project
complexity: medium
domains: ["analytics", "project"]
updated: "2026-03-01"
---

# Supabase KPI Views

## Description

Supabase materialized view design and query optimisation for BI KPI panels — sub-2-second performance targets.

## Implementation Instructions

1. Review the KPI spec from DASHBOARD_SPEC.md for each metric.
2. Write a Supabase view or materialized query: one view per metric, named kpi_[metric_name].
3. Optimise with indexes, CTEs, or materialisation until cold-load time is under 2 seconds.
4. Add appropriate RLS policies per the access model defined in the spec.
5. Set up Supabase Realtime subscription for any operational metrics requiring live updates.
6. Document the query in DASHBOARD_DATA_MODEL.md with source tables, logic, and refresh schedule.

## Constraints

- DO NOT ship a query with cold-load time over 2 seconds — optimise or materialise first.
- ALWAYS name KPI views with the kpi_ prefix for discoverability.
- DO NOT implement RLS without handoff to @diana for review.
