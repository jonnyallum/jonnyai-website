---
name: pricing-strategy
version: "1.0"
description: >
  Design pricing, packaging, and monetization strategies based on value,
  customer willingness to pay, and growth objectives. Covers Van Westendorp,
  value metrics, tier design, freemium decisions, and enterprise pricing.
domain: growth
owner: felix
triggers:
  - designing pricing for new product
  - evaluating price increase
  - packaging and tier design
  - freemium vs trial decisions
  - competitive pricing analysis
  - monetization strategy
source: sickn33/antigravity-awesome-skills (adapted for Jai.OS 5.0)
---

# Pricing Strategy

> **Owner:** @Felix (Monetization)
> **Consumers:** @Boyce, @Jasper, @Quinn, @Nina
> **Related:** `pricing-experiment-orchestration`, `offer-positioning-lab`, `conversion-funnel-diagnostics`

## Overview

Design pricing that captures value, supports growth, and aligns with customer willingness to pay — without harming conversion, trust, or long-term retention.

---

## Required Context (Gather Before Starting)

### 1. Business Model

- Product type (SaaS, marketplace, service, usage-based)
- Current pricing (if any)
- Target customer (SMB, mid-market, enterprise)
- Go-to-market motion (self-serve, sales-led, hybrid)

### 2. Market & Competition

- Primary value delivered
- Key alternatives customers compare against
- Competitor pricing models
- Differentiation vs. alternatives

### 3. Current Performance (If Existing)

- Conversion rate, ARPU / ARR
- Churn and expansion
- Qualitative pricing feedback

### 4. Objectives

- Growth vs. revenue vs. profitability
- Move upmarket or downmarket
- Planned pricing changes

---

## The Three Pricing Decisions

Every pricing strategy must explicitly answer:

1. **Packaging** — What is included in each tier?
2. **Value Metric** — What customers pay for (users, usage, outcomes)?
3. **Price Level** — How much each tier costs

Failure in any one weakens the system.

---

## Value-Based Pricing Framework

Price anchored to customer-perceived value, not internal cost.

```
Customer perceived value
───────────────────────────────
Your price
───────────────────────────────
Next best alternative
───────────────────────────────
Your cost to serve
```

**Rules:**

- Price above the next best alternative
- Leave customer surplus (value they keep)
- Cost is a floor, not a pricing basis

---

## Research Methods

### Van Westendorp (Price Sensitivity Meter)

Used to identify acceptable price ranges.

**Questions:** Too expensive? Too cheap? Expensive but acceptable? Cheap/good value?

**Outputs:** PMC (too cheap), PME (too expensive), OPP (optimal price), IDP (indifference price)

### Feature Value Research (MaxDiff / Conjoint)

For packaging decisions.

**Insights:** Table-stakes features, differentiators, premium-only features, low-value candidates to remove.

### Willingness-to-Pay Testing

| Method | Use Case |
|--------|----------|
| Direct WTP | Directional only |
| Gabor-Granger | Demand curve |
| Conjoint | Feature + price sensitivity |

---

## Value Metrics

The value metric is **what scales price with customer value**.

### Good Value Metrics

- Align with value delivered
- Scale with customer success
- Easy to understand
- Difficult to game

### Common Patterns

| Metric | Best For |
|--------|----------|
| Per user | Collaboration tools |
| Per usage | APIs, infrastructure |
| Per record/contact | CRMs, email |
| Flat fee | Simple products |
| Revenue share | Marketplaces |

**Validation Test:** As customers get more value, do they naturally pay more? If not → metric is misaligned.

---

## Tier Design

### Good / Better / Best

**Good** — Entry point, limited usage, removes friction
**Better (Anchor)** — Where most customers should land. Full core value. Best value-per-dollar.
**Best** — Power users/enterprise. Advanced controls, scale, support.

### Differentiation Levers

- Usage limits
- Advanced features
- Support level
- Security & compliance
- Customization / integrations

---

## Freemium vs. Free Trial

### Freemium Works When

- Large market, viral/network effects
- Clear upgrade trigger, low marginal cost

### Free Trial Works When

- Value requires setup, higher price points
- B2B evaluation cycles, sticky post-activation

### Hybrid

- Reverse trials
- Feature-limited free + premium trial

---

## Price Increases

### Signals It's Time

- Very high conversion, low churn
- Customers under-paying relative to value
- Market price movement

### Strategies

1. New customers only
2. Delayed increase for existing
3. Value-tied increase
4. Full plan restructure

---

## Enterprise Pricing

### When to Introduce

- Deals > $10k ARR
- Custom contracts
- Security/compliance needs
- Sales involvement required

### Common Structures

- Volume-discounted per seat
- Platform fee + usage
- Outcome-based pricing

---

## Validation Checklist

- [ ] Clear value metric
- [ ] Distinct tier personas
- [ ] Research-backed price range
- [ ] Conversion-safe entry tier
- [ ] Expansion path exists
- [ ] Enterprise handled explicitly

---

## Learning Log

| Date | Learning | Source |
|:--|:--|:--|
| 2026-03-09 | Integrated from `sickn33/antigravity-awesome-skills` | Awesome Skills Evaluation Phase 1 |
