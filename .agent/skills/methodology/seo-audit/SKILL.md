---
name: seo-audit
version: "1.0"
description: >
  Complete SEO diagnostic framework with crawlability, indexation, Core Web Vitals,
  on-page optimization, E-E-A-T assessment, and a quantitative SEO Health Index
  (0-100 scoring with severity deductions and confidence modifiers).
domain: growth
owner: grace
triggers:
  - auditing website SEO
  - diagnosing organic visibility issues
  - crawlability and indexation review
  - Core Web Vitals assessment
  - pre-launch SEO review
  - SEO health scoring
  - content quality E-E-A-T assessment
source: sickn33/antigravity-awesome-skills (adapted for Jai.OS 5.0)
---

# SEO Audit

> **Owner:** @Grace (SEO & Schema Specialist)
> **Consumers:** @Felix, @Maya, @Elena, @Carlos
> **Related:** `seo-meta-tag-optimizer`, `analytics-tracking`, `conversion-funnel-diagnostics`
> **Supersedes:** `seo-meta-tag-optimizer` (which covers meta tags only — this is the full audit framework)

## Overview

Diagnose, score, and prioritize SEO issues that affect organic visibility. Output is **evidence-based, scoped, and actionable**. This skill identifies problems — it does not implement fixes unless explicitly asked.

---

## Scope Gate (Ask First if Missing)

Before performing a full audit, clarify:

### 1. Business Context

- Site type (SaaS, e-commerce, blog, local, marketplace)
- Primary SEO goal (traffic, conversions, leads, brand visibility)
- Target markets and languages

### 2. SEO Focus

- Full site audit or specific sections/pages?
- Technical SEO, on-page, content, or all?
- Desktop, mobile, or both?

### 3. Data Access

- Google Search Console access?
- Analytics access?
- Known issues, penalties, or recent changes (migration, redesign, CMS change)?

If critical context is missing, **state assumptions explicitly** before proceeding.

---

## Audit Framework (Priority Order)

1. **Crawlability & Indexation** — Can search engines access and index the site?
2. **Technical Foundations** — Is the site fast, stable, and accessible?
3. **On-Page Optimization** — Is each page clearly optimized for its intent?
4. **Content Quality & E-E-A-T** — Does the content deserve to rank?
5. **Authority & Trust Signals** — Does the site demonstrate trust and relevance?

---

## Technical SEO Audit

### Crawlability

**Robots.txt:** Accidental blocking? Sitemap reference? Environment-specific rules?

**XML Sitemaps:** Accessible, valid, canonical URLs only, reasonable size, submitted successfully?

**Site Architecture:** Key pages within ~3 clicks, logical hierarchy, internal linking coverage, no orphaned URLs.

**Crawl Efficiency (Large Sites):** Parameter handling, faceted navigation, crawlable pagination, no session IDs.

### Indexation

**Coverage Analysis:** Indexed vs expected pages, excluded URLs (intentional vs accidental).

**Common Issues:** Incorrect `noindex`, canonical conflicts, redirect chains/loops, soft 404s, duplicate content.

**Canonicalization:** Self-referencing canonicals, HTTPS consistency, hostname consistency (www/non-www), trailing slash rules.

### Performance & Core Web Vitals

- LCP < 2.5s
- INP < 200ms
- CLS < 0.1

**Contributing Factors:** Server response time, image handling, JavaScript execution cost, CSS delivery, caching, CDN, font loading.

### Mobile-Friendliness

Responsive layout, proper viewport, tap target sizing, no horizontal scrolling, content parity, mobile-first indexing readiness.

### Security & Accessibility

HTTPS everywhere, valid certificates, no mixed content, HTTP→HTTPS redirects, accessibility issues impacting UX/crawling.

---

## On-Page SEO Audit

**Title Tags:** Unique per page, keyword-aligned, appropriate length, clear intent.

**Meta Descriptions:** Unique, descriptive, supports click-through, not auto-generated.

**Heading Structure:** One H1, logical hierarchy, headings reflect content.

**Content Optimization:** Satisfies search intent, topical depth, natural keywords, no cannibalization.

**Images:** Descriptive filenames, accurate alt text, proper compression/formats, lazy loading.

**Internal Linking:** Important pages reinforced, descriptive anchor text, no broken links, balanced distribution.

---

## Content Quality & E-E-A-T

**Experience & Expertise:** First-hand knowledge, original insights/data, clear author attribution.

**Authoritativeness:** Citations, consistent topical focus.

**Trustworthiness:** Accurate/updated content, transparent business info, policies, secure site.

---

## SEO Health Index (Scoring Layer)

### Total Score: 0–100 (Weighted Composite)

| Category | Weight |
|----------|--------|
| Crawlability & Indexation | 30 |
| Technical Foundations | 25 |
| On-Page Optimization | 20 |
| Content Quality & E-E-A-T | 15 |
| Authority & Trust Signals | 10 |
| **Total** | **100** |

> If a category is **out of scope**, redistribute its weight proportionally and state explicitly.

### Per-Category Scoring

Start at **100**, subtract based on issues found.

| Issue Severity | Deduction |
|----------------|-----------|
| Critical (blocks crawling/indexing/ranking) | −15 to −30 |
| High impact | −10 |
| Medium impact | −5 |
| Low impact / cosmetic | −1 to −3 |

**Confidence Modifier:** Medium confidence = 50% deduction. Low confidence = 25% deduction.

### Health Bands

| Score | Status | Interpretation |
|-------|--------|----------------|
| 90–100 | Excellent | Strong foundation, minor optimizations only |
| 75–89 | Good | Solid with clear improvement areas |
| 60–74 | Fair | Meaningful issues limiting growth |
| 40–59 | Poor | Serious SEO constraints |
| <40 | Critical | SEO is fundamentally broken |

---

## Findings Classification (Required)

For **every identified issue**, provide:

- **Issue:** One-sentence description of what is wrong
- **Category:** Which of the 5 audit categories
- **Evidence:** Objective proof (URLs, reports, metrics)
- **Severity:** Critical / High / Medium / Low
- **Confidence:** High / Medium / Low
- **Why It Matters:** SEO impact in plain language
- **Score Impact:** Point deduction applied (with confidence modifier)
- **Recommendation:** What to do (no implementation steps unless requested)

---

## Prioritized Action Plan

Derived from findings and scores:

1. **Critical Blockers** — Critical severity, highest score impact
2. **High-Impact Improvements** — High/Medium severity with large cumulative deductions
3. **Quick Wins** — Low/Medium severity, easy to fix with measurable improvement
4. **Longer-Term Opportunities** — Structural/content improvements for resilience

For each group: reference findings, state expected score recovery range.

---

## Output Format

### Executive Summary

- SEO Health Index: XX / 100
- Health Status: [Excellent / Good / Fair / Poor / Critical]

### Category Breakdown Table

| Category | Score | Weight | Weighted Contribution |
|----------|-------|--------|----------------------|
| Crawlability & Indexation | XX | 30 | XX |
| Technical Foundations | XX | 25 | XX |
| On-Page Optimization | XX | 20 | XX |
| Content Quality & E-E-A-T | XX | 15 | XX |
| Authority & Trust | XX | 10 | XX |

### Detailed Findings (per category)

### Prioritized Action Plan

---

## Interpretation Rules (Mandatory)

- Score **does not replace** detailed findings
- Improvements traceable to **specific issues**
- High score with unresolved Critical issues = **invalid** → flag
- Always explain **what limits the score**

---

## Explicit Limitations (Always State)

- Score = SEO readiness, not guaranteed rankings
- External factors (competition, algorithm) not scored
- Authority score is directional, not exhaustive

---

## Learning Log

| Date | Learning | Source |
|:--|:--|:--|
| 2026-03-09 | Integrated from `sickn33/antigravity-awesome-skills` — replaces narrow `seo-meta-tag-optimizer` | Awesome Skills Evaluation Phase 2 |
