---
# Methodology Skill Card — Jai.OS 5.0
name: "mcp-builder"
version: "1.0.0"
type: methodology
description: "Custom MCP server scaffolding — building, registering, and validating MCP tool servers for the Antigravity Orchestra."
category: ai
complexity: medium
domains: ["ai", "backend"]
updated: "2026-03-01"
---

# MCP Builder

## Description

Custom MCP server scaffolding — building, registering, and validating MCP tool servers for the Antigravity Orchestra.

## Implementation Instructions

1. Define the tool manifest: name, description, input schema (JSON Schema), and output contract.
2. Scaffold server structure: handler function, error schema, authentication layer.
3. Implement tool logic with strict input validation — reject malformed inputs at the boundary.
4. Write contract tests: valid input produces expected output; invalid input returns schema error.
5. Register in claude_desktop_config.json or .claude/settings.json tool block.
6. Validate registration with a live test call and confirm tool appears in Claude tool list.
7. Document the server in .agent/library/ and add to the MCP registry.

## Constraints

- DO NOT expose secrets or API keys in tool responses.
- ALWAYS define a typed error response schema alongside the success schema.
- DO NOT register a tool without contract tests passing.
