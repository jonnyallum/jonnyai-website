---
# Methodology Skill Card — Jai.OS 5.0
name: "kpi-engineering-intake"
version: "1.0.0"
type: methodology
description: "KPI definition intake process — from stakeholder interview to formal KPI specification with calculation, source, and ..."
category: project
complexity: medium
domains: ["analytics", "backend", "project"]
updated: "2026-03-01"
---

# KPI Engineering Intake

## Description

KPI definition intake process — from stakeholder interview to formal KPI specification with calculation, source, and cadence.

## Implementation Instructions

1. Run intake interview: who uses this, what 3 decisions must they make from this screen.
2. Classify dashboard type: Strategic, Operational, Analytical, Tactical, or Contextual.
3. For each KPI candidate, define: calculation formula, data source table/API, refresh cadence, owner.
4. Audit data readiness: verify each KPI source exists in Supabase or accessible API.
5. Flag any missing instrumentation to @maya or @diana for resolution before build.
6. Output DASHBOARD_SPEC.md with all KPIs formally defined — no undefined KPIs proceed.

## Constraints

- DO NOT name or display a KPI whose calculation, source, and cadence are not formally defined.
- ALWAYS complete the intake interview before writing any query or layout.
- DO NOT exceed 7 KPIs per dashboard view.
