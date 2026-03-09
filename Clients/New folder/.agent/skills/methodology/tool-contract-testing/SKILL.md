---
# Methodology Skill Card — Jai.OS 5.0
name: "tool-contract-testing"
version: "1.0.0"
type: methodology
description: "Automated testing of tool/MCP schemas to ensure inputs, outputs, and error states adhere to defined contracts and don..."
category: testing
complexity: medium
domains: ["api", "automation", "testing"]
updated: "2026-03-01"
---

# Tool Contract Testing

## Description

Automated testing of tool/MCP schemas to ensure inputs, outputs, and error states adhere to defined contracts and don't break downstream agents.

## Implementation Instructions

1. Define JSON schemas for all tool inputs and outputs.
2. Implement contract tests that verify tool behavior against valid and invalid inputs.
3. Validate error handling and error message consistency across tools.
4. Run contract tests in CI/CD before any tool/MCP deployment.
5. Monitor for schema drift between registered tools and actual execution.

## Constraints

- **DO NOT** deploy tools without passing schema-contract tests.
- **ALWAYS** include edge cases (nulls, empty strings, large payloads) in testing.
- **DO NOT** change tool output structure without versioning or fallback support.
