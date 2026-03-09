---
# Methodology Skill Card — Jai.OS 5.0
name: "client-status-report-generation"
version: "1.0.0"
type: methodology
description: "Automated client status report generation — weekly progress summaries, milestone tracking, and delivery audit trails."
category: security
complexity: medium
domains: ["automation"]
updated: "2026-03-01"
---

# Client Status Report Generation

## Description

Automated client status report generation — weekly progress summaries, milestone tracking, and delivery audit trails.

## Implementation Instructions

1. Pull progress data from Supabase projects and tasks tables for the report period.
2. Generate milestone status: on-track (green), at-risk (amber), blocked (red).
3. Summarise completed deliverables with links to the Glass Box portal assets.
4. Flag open actions: items awaiting client sign-off or input.
5. Calculate velocity delta: compare completed tasks this week vs last week.
6. Deliver via automated email every Friday with the Glass Box portal link.

## Constraints

- DO NOT send a status report without verifying milestone data is current.
- ALWAYS include at least one open action for the client — status reports are a two-way accountability tool.
- DO NOT omit blocked items — red flags must be visible, not hidden.
