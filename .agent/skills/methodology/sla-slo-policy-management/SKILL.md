---
# Methodology Skill Card — Jai.OS 5.0
name: "sla-slo-policy-management"
version: "1.0.0"
type: methodology
description: "Standardized management of Service Level Agreements (SLAs) and Service Level Objectives (SLOs) across agent services ..."
category: operations
complexity: medium
domains: ["analytics", "automation", "operations"]
updated: "2026-03-01"
---

# SLA/SLO Policy Management

## Description

Standardized management of Service Level Agreements (SLAs) and Service Level Objectives (SLOs) across agent services and vendor integrations.

## Implementation Instructions

1. Define target SLOs for key metrics (latency, success rate, availability).
2. Establish "Error Budgets" for each service.
3. Monitor real-time performance against SLO targets.
4. Trigger automated alerts when error budgets are near exhaustion.
5. Review SLA compliance for all third-party vendor integrations monthly.

## Constraints

- **DO NOT** set "100%" targets; allow for realistic error budgets.
- **ALWAYS** define "success" from the perspective of the user/caller.
- **DO NOT** ignore sustained SLO violations.
