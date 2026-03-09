# Blog Content Strategy
_Last updated: 2026-02-23 | Owner: @elena | QA: @rowan + @vigil | SEO: @grace_

---

## Overview

The JonnyAI blog is the primary content surface for the agency. Every post must do three things:

1. **Earn trust** — real numbers, real problems, honest admissions
2. **Rank** — SEO-first structure, long-tail keyword ownership
3. **Convert** — every post ends with a CTA to `/brief`

No fluff. No corporate speak. No AI-sounding text.

---

## Content Infrastructure

### Where Content Lives

| Layer | Location | Purpose |
|:------|:---------|:--------|
| **Source of truth** | `jonnyai.website/src/lib/data/blog-posts.ts` | Static TypeScript data (always in sync) |
| **Live database** | Supabase `lkwydqtfbdjhxaarelaz` → `blog_posts` table | Dynamic content, enables live publishing |
| **Projects registry** | Supabase `lkwydqtfbdjhxaarelaz` → `projects_registry` table | All client and internal projects documented |

### How Publishing Works

1. Write post content and add to `blog-posts.ts` (agent workflow below)
2. Run `POST /api/seed-blog` (with `SEED_SECRET` header) to sync to Supabase
3. Blog pages revalidate every 30 minutes via ISR — post is live within 30 min

For emergency live publish (bypassing static build):
- Insert directly into Supabase `blog_posts` table with `status = 'published'`
- The page will serve it within 30 min via ISR

---

## BlogPost Schema

```typescript
interface BlogPost {
  slug: string;           // kebab-case, e.g. "gold-standard-case-study-2026"
  title: string;          // 60 chars max for SEO
  excerpt: string;        // 150–160 chars for meta description
  content: string;        // Full markdown-like body (see formatting rules below)
  date: string;           // ISO date: "2026-02-23"
  category: 'System Update' | 'Product' | 'Case Study' | 'Insight' | 'Weekly Intel';
  readTime: number;       // Honest estimate in minutes
  featured?: boolean;     // Only one post should be featured at a time
  tags: string[];         // 4–8 tags, lowercase, SEO-targeted
}
```

### Supabase `blog_posts` Table (additional fields)

| Field | Type | Notes |
|:------|:-----|:------|
| `status` | enum | `draft` / `published` / `archived` |
| `project_ref` | text | FK to `projects_registry.project_ref` |
| `client_name` | text | Human-readable client name |
| `author_agent` | text | e.g. `@elena` |
| `reviewed_by` | text | e.g. `@rowan, @vigil` |
| `seo_title` | text | Override title tag if different from post title |
| `seo_description` | text | Override meta description |

---

## Content Categories

### System Update
**What:** Internal architecture changes, Jai.OS updates, agent roster news
**Tone:** Technical, direct, proud without boasting
**SEO targets:** AI agency architecture, AI development system, multi-agent workflows

### Product
**What:** JonnyAI product launches (Glass Box, pricing updates, new services)
**Tone:** Clear benefit-led, no hype
**SEO targets:** AI development agency UK, AI product engine, rapid MVP development

### Case Study
**What:** Client project outcomes with real numbers
**Tone:** Build-in-public. Honest about what worked AND what didn't.
**Required elements:**
- Problem statement (client's words if possible)
- What we built (specific tech, agents used)
- Timeline (be specific)
- Results (real numbers only — no "significant improvement")
- One honest admission (what was harder than expected, what we'd do differently)
**SEO targets:** AI development case study, [niche] software development UK, [project type] AI automation

### Insight
**What:** Opinions and analysis about AI, development, the industry
**Tone:** Confident takes, backed by experience, willing to disagree with consensus
**SEO targets:** AI development insights, AI product strategy, UK AI agency

### Weekly Intel
**What:** Monday AI news round-up, curated by the research team
**Tone:** Briefing-style. Sharp. Include one internal development per post.
**SEO targets:** weekly AI news, AI industry roundup 2026, latest AI updates UK
**Publishing cadence:** Every Monday by 11:00 UTC (see WEEKLY-AI-INTEL-001 mission)

---

## Content Formatting Rules

The blog uses a lightweight markdown parser in `renderContent()`. Rules:

```
**Standalone line in bold**          → renders as <h2> heading
**inline bold** within a paragraph   → renders as <strong>
Paragraphs are separated by \n\n     → each becomes a <p> tag
```

**Do:**
- Use `**Heading**` on its own paragraph for section breaks
- Write in short paragraphs (3–5 sentences max)
- Include specific numbers, dates, and named technologies
- Reference actual agents by handle (`@sebastian`, `@elena`, etc.)

**Don't:**
- Start bullet lists (not rendered — use short paragraphs instead)
- Use markdown links `[text](url)` — not rendered in the current parser
- Use `#` headings — use `**Bold standalone**` instead
- Write in AI-speak: avoid "delve", "pivotal", "transformative", "key takeaway"

---

## SEO Checklist (per post)

Run by @grace before every publish:

- [ ] Title is 50–60 characters, contains primary keyword
- [ ] Excerpt is 150–160 characters, natural language, contains keyword
- [ ] Tags include: 1 primary keyword, 2–3 long-tail, 1–2 brand terms
- [ ] At least one `**heading**` contains a keyword
- [ ] Post body is 600–1500 words (sweet spot for agency insights)
- [ ] Date is set correctly (affects freshness signals)
- [ ] Slug is lowercase kebab-case, keyword-rich, max 60 chars

---

## Quality Gates (per @rowan + @vigil)

Every post must pass before publish:

**@rowan — Depth Gate:**
- Does the post contain at least one specific claim that only someone with real experience could make?
- Is there an honest admission (something that was harder than expected, failed, or remains unsolved)?
- Would the author be comfortable putting their name on this?

**@vigil — Truth Gate:**
- Are all numbers verifiable or sourced from internal records?
- Does the post avoid speculative future claims presented as fact?
- Is every client name and project reference accurate?

**Rejection criteria:**
- Generic advice that could appear on any AI agency blog
- Numbers without context ("300% improvement" with no baseline)
- Poundtrades or any project not delivered to the customer
- Client names or outcomes not cleared for public disclosure

---

## Agent Publishing Workflow

### For Case Studies

1. **@rowan** — depth audit (ensures honesty, specific detail, no fluff)
2. **@sophie** — pull any public evidence (GitHub, App Store, live URL, press)
3. **@elena** — write or enrich the post using the content rules above
4. **@grace** — SEO pass (title, excerpt, tags, internal links)
5. **@vigil** — truth-lock (verify all claims against records)
6. **@sebastian** — add to `blog-posts.ts`, push, trigger seed route

### For Weekly Intel (WEEKLY-AI-INTEL-001 — every Monday)

1. **@intelhub + @sophie** — raw intelligence gathering (Mon 06:00–07:00 UTC)
2. **@scholar** — synthesise 3–5 key developments with context (Mon 07:00–08:00)
3. **@elena** — draft post using Weekly Intel template (Mon 08:00–09:00)
4. **@grace** — SEO pass (Mon 09:00–09:30)
5. **@rowan + @vigil** — truth-lock (Mon 09:30–10:00)
6. **@sebastian** — publish (Mon 10:00–10:30)

### Weekly Intel Template

```
Slug: week-in-ai-DD-mon-YYYY
Title: Week in AI — [Date]
Category: Weekly Intel
ReadTime: 4–5

Opening line: This week's intelligence from across the AI landscape — curated by the Antigravity research team every Monday.

Section 1: **[Major external AI development]**
Section 2: **[Second major development]**
Section 3: **[UK/regulatory angle]**
Section 4: **Internal: [One internal milestone this week]**
Closing: **What to Watch Next Week** — 3 bullet-style sentences, each starting on new paragraph
```

---

## Projects Registry

Every project — client or internal — must be documented in `projects_registry`.

### Documented Projects (as of 2026-02-23)

| Project Ref | Client | Type | Status | Case Study |
|:------------|:-------|:-----|:-------|:-----------|
| `gold-standard` | Internal | Internal Tool | Live | Published |
| `agentflip` | Internal | Internal Tool | Live | Published |
| `construct-fm` | Construct.fm | SaaS | Live | Published |
| `kliqt-crm` | KLIQT Media | Internal Tool | Delivered | Published |
| `safeguardian` | Safeguardian | SaaS | Live | Published |
| `longleat` | Longleat | Marketing | Delivered | Published |
| `la-aesthetician` | La Aesthetician | E-Commerce | Live | Published |
| `insydetradar` | InsydeTradar | SaaS | Live | Published |
| `chatterbox` | Chatterbox | SaaS | Live | Published |
| `bl-motorcycles` | BL Motorcycles | E-Commerce | Live | None |
| `sparta-interiors` | Sparta Interiors | Portfolio | Live | None |
| `dj-waste` | DJ Waste | Portfolio | Live | None |
| `village-bakery` | Village Bakery | E-Commerce | Live | None |
| `jsc-contractors` | JSC Contractors | Portfolio | Live | None |

### Adding a New Project

1. Add entry to `projects_registry` table in Supabase (or add to seed script)
2. Create blog post when case study is ready
3. Link `case_study_slug` in registry once published
4. Update this table

**Note:** Only add projects once delivered to the customer. Do not document Poundtrades or any project still in pre-delivery.

---

## Content Backlog

### Priority Queue (for CASE-STUDY-ENRICH-001)

These case studies exist but need enrichment — more depth, specific metrics, honest admissions:

- [ ] Construct.fm — add specific subscriber numbers, timeline, what the automation replaced
- [ ] KLIQT CRM — add user adoption stats, time saved per week
- [ ] Safeguardian — add specifics on compliance coverage
- [ ] Longleat — add event attendance/engagement data if available
- [ ] La Aesthetician — add revenue uplift or booking increase
- [ ] InsydeTradar — add data coverage scope, accuracy baseline
- [ ] Chatterbox — add user count, message volume

### New Posts Needed

- [ ] "The Gravy Score: How We Rank Keyword Opportunities" (AgentFlip deep-dive)
- [ ] "13 Gates: The Audit Pipeline Behind Gold Standard"
- [ ] "Why Fixed-Price Is the Only Honest Way to Sell AI Development"
- [ ] "48 Hours: A Minute-by-Minute Look at a JonnyAI Build"

---

_Maintained by @elena. SEO reviews by @grace. All posts truth-locked by @rowan + @vigil before publish._
_This file is the editorial bible. When in doubt, read it first._
