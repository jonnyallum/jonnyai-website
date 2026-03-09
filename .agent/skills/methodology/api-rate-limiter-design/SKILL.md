---
# Methodology Skill Card — Jai.OS 5.0
name: "api-rate-limiter-design"
version: "1.0.0"
type: methodology
description: "Designs and implements rate limiting strategies for APIs to prevent abuse and ensure fair usage."
category: api
complexity: medium
domains: ["analytics", "api", "backend", "design"]
updated: "2026-03-01"
---

# API Rate Limiter Design

## Description
Designs and implements rate limiting strategies for APIs to prevent abuse and ensure fair usage.

## Implementation Instructions
1.  **Identify Tier:** Define limits for Free vs. Paid vs. Internal users.
2.  **Store:** Use Redis (Upstash) for distributed rate limiting.
3.  **Algorithm:** Implement Token Bucket or Sliding Window.
4.  **Feedback:** Return `429 Too Many Requests` with `Retry-After` headers.
5.  **Monitor:** Track rate-limit hits in Metric.

## Constraints
- **DO NOT** rate-limit internal orchestration traffic without priority overrides.
- **ALWAYS** whitelist health-check and critical monitoring endpoints.
