---
# Methodology Skill Card — Jai.OS 5.0
name: "conversion-funnel-diagnostics"
version: "1.0.0"
type: methodology
description: "Diagnostics of funnel-stage leaks, friction points, and conversion drops using event data and behavioral analysis."
category: marketing
complexity: medium
domains: ["marketing"]
updated: "2026-03-01"
---

# Conversion Funnel Diagnostics

## Description

Diagnostics of funnel-stage leaks, friction points, and conversion drops using event data and behavioral analysis.

## Implementation Instructions

1. Map the core funnel steps (e.g., Visit -> Add to Cart -> Purchase).
2. Measure drop-off rates at every transition point.
3. Segment funnels by source, device, and user type to find outliers.
4. Conduct "Friction Audits" for high-drop stages (e.g., checkout field error).
5. Generate A/B hypotheses based on leak location and likely cause.

## Constraints

- **DO NOT** guess on leaks; use verified event data.
- **ALWAYS** check for technical errors (404s, JS crashes) before branding.
- **DO NOT** ignore late-stage leaks for high-intent traffic.
