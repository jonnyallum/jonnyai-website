---
name: analytics-tracking
version: "1.0"
description: >
  Design, audit, and improve analytics tracking systems that produce reliable,
  decision-ready data. Includes Measurement Readiness Index, event taxonomy,
  naming conventions, GA4/GTM guidance, and validation checklists.
domain: growth
owner: maya
triggers:
  - designing analytics for new project
  - auditing existing tracking
  - setting up conversion tracking
  - GA4 or GTM implementation
  - measurement strategy
  - event naming standards
source: sickn33/antigravity-awesome-skills (adapted for Jai.OS 5.0)
---

# Analytics Tracking & Measurement Strategy

> **Owner:** @Maya (Analytics & Conversion)
> **Consumers:** @Grace, @Felix, @Carlos, @Nina
> **Related:** `conversion-funnel-diagnostics`, `kpi-engineering-intake`, `supabase-kpi-views`

## Overview

Expert analytics implementation and measurement design. Ensures tracking produces **trustworthy signals that directly support decisions** across marketing, product, and growth.

**Rules:**

- Do **not** track everything
- Do **not** optimize dashboards without fixing instrumentation
- Do **not** treat GA4 numbers as truth unless validated

---

## Phase 0: Measurement Readiness Index (Score First)

Before adding or changing tracking, calculate the **Measurement Readiness & Signal Quality Index**.

### Scoring Categories (Total: 0-100)

| Category | Weight |
|----------|--------|
| Decision Alignment | 25 |
| Event Model Clarity | 20 |
| Data Accuracy & Integrity | 20 |
| Conversion Definition Quality | 15 |
| Attribution & Context | 10 |
| Governance & Maintenance | 10 |

### Readiness Bands

| Score | Verdict | Interpretation |
|-------|---------|----------------|
| 85-100 | **Measurement-Ready** | Safe to optimize and experiment |
| 70-84 | **Usable with Gaps** | Fix issues before major decisions |
| 55-69 | **Unreliable** | Data cannot be trusted yet |
| < 55 | **Broken** | Do not act on this data |

If verdict is **Broken**, stop and recommend remediation first.

---

## Core Principles (Non-Negotiable)

### 1. Track for Decisions, Not Curiosity

If no decision depends on it, **don't track it**.

### 2. Start with Questions, Work Backwards

Define what you need to know → what action you'll take → what signal proves it. Then design events.

### 3. Events Represent Meaningful State Changes

**Avoid:** cosmetic clicks, redundant events, UI noise
**Prefer:** intent, completion, commitment

### 4. Data Quality Beats Volume

Fewer accurate events > many unreliable ones.

---

## Event Model Design

### Event Taxonomy

**Navigation / Exposure:** `page_view`, `content_viewed`, `pricing_viewed`
**Intent Signals:** `cta_clicked`, `form_started`, `demo_requested`
**Completion Signals:** `signup_completed`, `purchase_completed`, `subscription_changed`
**System / State Changes:** `onboarding_completed`, `feature_activated`, `error_occurred`

### Event Naming Conventions

Pattern: `object_action[_context]`

Examples: `signup_completed`, `pricing_viewed`, `cta_hero_clicked`, `onboarding_step_completed`

Rules: lowercase, underscores, no spaces, no ambiguity.

### Event Properties (Context, Not Noise)

**Include:** where (page, section), who (user_type, plan), how (method, variant)
**Avoid:** PII, free-text fields, duplicated auto-properties

---

## Conversion Strategy

### What Qualifies as a Conversion

Must represent: real value, completed intent, irreversible progress.

**Yes:** `signup_completed`, `purchase_completed`, `demo_booked`
**No:** page views, button clicks, form starts

### Counting Rules

- Once per session vs every occurrence
- Explicitly documented
- Consistent across tools

---

## GA4 & GTM Guidance

- Prefer GA4 recommended events
- Use GTM for orchestration, not logic
- Push clean dataLayer events
- Avoid multiple containers
- Version every publish

---

## UTM & Attribution Discipline

### UTM Rules

- Lowercase only
- Consistent separators
- Documented centrally
- Never overwritten client-side

UTMs exist to **explain performance**, not inflate numbers.

---

## Validation & Debugging

### Required Validation

- Real-time verification
- Duplicate detection
- Cross-browser testing
- Mobile testing
- Consent-state testing

### Common Failure Modes

- Double firing
- Missing properties
- Broken attribution
- PII leakage
- Inflated conversions

---

## Output Format

### Measurement Strategy Summary

- Measurement Readiness Index score + verdict
- Key risks and gaps
- Recommended remediation order

### Tracking Plan

| Event | Description | Properties | Trigger | Decision Supported |
|-------|-------------|------------|---------|-------------------|
| | | | | |

### Conversions

| Conversion | Event | Counting | Used By |
|------------|-------|----------|---------|
| | | | |

---

## Learning Log

| Date | Learning | Source |
|:--|:--|:--|
| 2026-03-09 | Integrated from `sickn33/antigravity-awesome-skills` | Awesome Skills Evaluation Phase 1 |
