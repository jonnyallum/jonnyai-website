---
# Methodology Skill Card — Jai.OS 5.0
name: "realtime-streaming-architecture"
version: "1.0.0"
type: methodology
description: "Design and implementation of resilient, low-latency event/data streaming systems (e.g., WebSockets, Server-Sent Events)."
category: data
complexity: medium
domains: ["automation", "backend", "web"]
updated: "2026-03-01"
---

# Realtime Streaming Architecture

## Description

Design and implementation of resilient, low-latency event/data streaming systems (e.g., WebSockets, Server-Sent Events).

## Implementation Instructions

1. Define event schemas and delivery guarantees (at-least-once, exactly-once).
2. Implement connection management and automatic reconnection logic.
3. Design for backpressure and buffer overflows.
4. Apply state-synchronization protocols to handle offline/online transitions.
5. Monitor stream latency and error rates in real-time.

## Constraints

- **DO NOT** allow event bursts to crash downstream consumers.
- **ALWAYS** implement authentication/authorization for streaming channels.
- **DO NOT** use streaming for data where order and consistency are critical without specific guards.
