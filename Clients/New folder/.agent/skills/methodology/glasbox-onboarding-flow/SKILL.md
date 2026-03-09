---
# Methodology Skill Card — Jai.OS 5.0
name: "glasbox-onboarding-flow"
version: "1.0.0"
type: methodology
description: "Glass Box client onboarding protocol — project kickoff, portal setup, access provisioning, and handoff sequence."
category: education
complexity: medium
domains: ["analytics", "education"]
updated: "2026-03-01"
---

# Glass Box Onboarding Flow

## Description

Glass Box client onboarding protocol — project kickoff, portal setup, access provisioning, and handoff sequence.

## Implementation Instructions

1. Send welcome message within 24 hours of contract signing with project overview.
2. Create client project entry in Supabase projects table with all metadata.
3. Provision Glass Box portal: client login, project dashboard, and document access.
4. Schedule kickoff call: agenda includes goals, timeline, communication cadence, and escalation contacts.
5. Deliver onboarding pack: project brief, asset request list, and client portal guide.
6. Set 7-day check-in to confirm client has accessed the portal and understands the process.

## Constraints

- DO NOT begin project work before the kickoff call is complete.
- ALWAYS provision portal access within 48 hours of contract signing.
- DO NOT skip the 7-day check-in — early friction prevents later churn.
