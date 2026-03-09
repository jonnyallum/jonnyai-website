---
# Methodology Skill Card — Jai.OS 5.0
name: "churn-risk-detection"
version: "1.0.0"
type: methodology
description: "Client churn risk scoring — early warning signal identification, risk tier classification, and intervention playbook ..."
category: marketing
complexity: medium
domains: ["general"]
updated: "2026-03-01"
---

# Churn Risk Detection

## Description

Client churn risk scoring — early warning signal identification, risk tier classification, and intervention playbook activation.

## Implementation Instructions

1. Monitor weekly engagement signals: portal logins, message response time, payment status.
2. Apply churn risk scoring: 3 or more signals in the risk matrix equals high-risk classification.
3. Risk matrix signals: missed payment, under 1 login per week, unresponsive over 48h, NPS under 6.
4. Trigger intervention playbook based on risk tier: low (check-in message), medium (account review call), high (escalation to @marcus).
5. Document the intervention and outcome in the client record.
6. Post-intervention: re-score after 2 weeks to confirm risk reduction.

## Constraints

- DO NOT wait for a client to self-report a problem — proactive detection is the standard.
- ALWAYS escalate high-risk clients to @marcus within 24 hours of classification.
- DO NOT close a high-risk case without written confirmation of resolution.
