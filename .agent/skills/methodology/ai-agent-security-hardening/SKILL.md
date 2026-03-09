---
# Methodology Skill Card — Jai.OS 5.0
name: "ai-agent-security-hardening"
version: "1.0.0"
type: methodology
description: "Defines security baseline for agents: secrets management, permission scoping, tool isolation, and abuse prevention."
category: security
complexity: medium
domains: ["ai", "security"]
updated: "2026-03-01"
---

# AI Agent Security Hardening

## Description

Defines security baseline for agents: secrets management, permission scoping, tool isolation, and abuse prevention.

## Implementation Instructions

1. Inventory all agent/tool permissions and remove excess access.
2. Enforce secret vault usage and key rotation schedules.
3. Implement outbound allowlists and sensitive-action controls.
4. Add prompt-injection and tool-abuse detection safeguards.
5. Run recurring security audits and remediation cycles.

## Constraints

- **DO NOT** store secrets in plain text configs.
- **ALWAYS** apply least privilege to every integration.
- **DO NOT** expose dangerous tools without policy checks.
