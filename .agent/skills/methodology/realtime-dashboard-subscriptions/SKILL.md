---
# Methodology Skill Card — Jai.OS 5.0
name: "realtime-dashboard-subscriptions"
version: "1.0.0"
type: methodology
description: "Supabase Realtime subscription design for live dashboards — event-driven updates, connection management, and performa..."
category: design
complexity: medium
domains: ["analytics", "backend", "design"]
updated: "2026-03-01"
---

# Realtime Dashboard Subscriptions

## Description

Supabase Realtime subscription design for live dashboards — event-driven updates, connection management, and performance.

## Implementation Instructions

1. Identify which KPIs require live updates vs scheduled refresh.
2. Enable Supabase Realtime on the relevant tables via the Supabase dashboard.
3. Design subscription scope: subscribe only to rows and columns needed for the KPI.
4. Implement connection management: reconnect on disconnect, debounce rapid updates.
5. Test subscription performance under load: confirm under 500ms update propagation.
6. Document subscription schema in DASHBOARD_DATA_MODEL.md alongside batch query definitions.

## Constraints

- DO NOT subscribe to full table changes when a filtered subscription can be used.
- ALWAYS implement reconnection logic — assume connections will drop.
- DO NOT use Realtime for KPIs that update less than once per minute.
