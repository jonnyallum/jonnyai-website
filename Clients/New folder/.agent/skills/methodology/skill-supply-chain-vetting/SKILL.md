---
# Methodology Skill Card — Jai.OS 5.0
name: "skill-supply-chain-vetting"
version: "1.0.0"
type: methodology
description: "Validates third-party skills, templates, and automations before adoption to reduce tampering and malicious logic risk."
category: project
complexity: medium
domains: ["automation", "project"]
updated: "2026-03-01"
---

# Skill Supply Chain Vetting

## Description

Validates third-party skills, templates, and automations before adoption to reduce tampering and malicious logic risk.

## Implementation Instructions

1. Verify source origin, maintainer identity, and integrity hashes.
2. Scan imported artifacts for risky actions and secret exfiltration.
3. Evaluate permissions requested versus required functionality.
4. Approve skills through staged rollout (sandbox → limited → production).
5. Maintain signed inventory of approved skill artifacts.

## Constraints

- **DO NOT** auto-install unreviewed external skills.
- **ALWAYS** keep provenance and review logs.
- **DO NOT** grant production permissions during initial vetting.
