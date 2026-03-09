---
# Methodology Skill Card — Jai.OS 5.0
name: "agent-observability-telemetry"
version: "1.0.0"
type: methodology
description: "Implements tracing and metrics for agent orchestration, tool usage, failures, and latency to improve reliability and ..."
category: ai
complexity: medium
domains: ["ai", "analytics"]
updated: "2026-03-01"
---

y# Agent Observability Telemetry

## Description

Implements tracing and metrics for agent orchestration, tool usage, failures, and latency to improve reliability and debugging speed.

## Implementation Instructions

1. Instrument agent flows with trace IDs and step-level spans.
2. Capture key metrics: tool success rate, p95 latency, retries, and error classes.
3. Build dashboards for orchestration health and bottleneck detection.
4. Configure alerts for SLA/SLO breaches.
5. Publish incident-ready telemetry summaries for responders.

## Constraints

- **DO NOT** collect telemetry without retention and access controls.
- **ALWAYS** correlate logs, metrics, and traces by request ID.
- **DO NOT** leave critical paths uninstrumented.
