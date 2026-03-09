---
# Methodology Skill Card — Jai.OS 5.0
name: "nps-collection-automation"
version: "1.0.0"
type: methodology
description: "NPS survey automation — collection, response routing, detractor escalation, and promoter activation workflows."
category: marketing
complexity: medium
domains: ["automation", "marketing"]
updated: "2026-03-01"
---

# NPS Collection Automation

## Description

NPS survey automation — collection, response routing, detractor escalation, and promoter activation workflows.

## Implementation Instructions

1. Trigger NPS survey at defined checkpoints: project midpoint, delivery, and 30 days post-launch.
2. Send via email with a single question: how likely are you to recommend us (0-10).
3. Route responses: Detractor (0-6) to immediate escalation to @hannah; Passive (7-8) to follow-up nurture; Promoter (9-10) to testimonial request.
4. Log all responses to Supabase with timestamp, score, and verbatim comment.
5. Generate monthly NPS trend report for @marcus.
6. Activate referral request for Promoters within 48 hours of response.

## Constraints

- DO NOT collect NPS without a clear escalation path for Detractors.
- ALWAYS respond to Detractor feedback within 24 hours.
- DO NOT chase testimonials from Passives — Promoters only.
