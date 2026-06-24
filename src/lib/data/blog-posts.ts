export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: 'System Update' | 'Product' | 'Case Study' | 'Insight' | 'Weekly Intel';
  readTime: number;
  featured?: boolean;
  tags: string[];
}

export interface TimelineEvent {
  date: string;
  phase: string;
  title: string;
  description: string;
  metric?: string;
}

// Retired agent-lore and off-brand posts — excluded from the live blog.
const RETIRED_POST_SLUGS = new Set<string>([
  "jarios-4-edge-cluster-new-ventures-feb-2026",
  "agentflip-autonomous-keyword-arbitrage-engine",
  "gold-standard-autonomous-ai-audit-agency",
  "why-65-specialist-agents-not-one-ai",
  "shared-brain-architecture-live-ai-coordination",
  "jai-os-4-0-the-operating-system-for-ai-agencies",
  "from-concept-to-65-specialist-orchestra",
  "safeguardian-child-safety-app",
  "week-in-ai-23-feb-2026",
  "48-hour-build-discipline",
  "the-glass-box-why-we-show-you-everything",
  "why-we-stopped-building-general-purpose-ai-tools",
]);

const rawBlogPosts: BlogPost[] = [
  // ── BL MOTORCYCLES CASE STUDY ────────────────────────────────────────────
  {
    slug: 'bl-motorcycles-full-digital-operation',
    title: 'From £45/Month to a Full Digital Operation: B&L Motorcycles',
    excerpt:
      'Brett was paying £2,160 over four years for a GoDaddy website that looked dead. We brought hosting down to £220 for four years, added full e-commerce, and built a dropshipping platform, dual eBay storefronts, a QR workshop inventory system, professional invoicing, four automation workflows, and a custom eBay MCP server — before that category even existed.',
    date: '2026-06-24',
    category: 'Case Study',
    readTime: 7,
    featured: true,
    tags: ['motorcycle parts', 'dropshipping', 'eBay automation', 'workshop management', 'NFC business card', 'MCP server', 'n8n', 'Supabase', 'Fareham', 'small business'],
    content: `
Brett Farley runs B&L Motorcycles Ltd out of Fareham, Hampshire. Specialist repairs, carburetor rebuilds, ultrasonic cleaning, brake restoration, full recommissioning — over 32,000 genuine parts in stock and the technical knowledge to back every one of them.

The problem: none of that showed up online.

## The Before

A GoDaddy website that looked abandoned. £45 a month. Over four years, that's **£2,160** — for a template with a phone number on it. No e-commerce. No inventory system. No invoicing. No automation. eBay sales written manually. Workshop stock tracked in someone's head.

The brief wasn't "build a website." It was: build everything a real business this size should have.

## The Hosting Fix — Before Anything Else

Before writing a line of code, the hosting was fixed. GoDaddy at £45/month became a proper arrangement at **£220 for four years** — a saving of **£1,940** over the same period, with full e-commerce capability included. GoDaddy never offered e-commerce at any price Brett was paying.

That number usually lands first with people. The client pays less and gets incomparably more.

## What Was Built

**The marketing site.** GoDaddy scrapped entirely. A modern React/Vite site with six specialist service pages — repairs, restoration, carb work, ultrasonic cleaning, brake rebuilds, recommissioning — deployed to Vercel with proper SEO, Google verification, and Open Graph meta.

**The hybrid dropshipping platform.** A Next.js storefront backed by Supabase/PostgreSQL with 11,834 products from two trade suppliers (Bike-It and Llexeter) and 141,839 fitment records covering make, model, CC, and year. Search by your bike, see what fits. Llexeter products enriched automatically — additional images pulled in, descriptions structured. Stripe checkout and webhook-driven order creation.

**The workshop admin system.** Login-gated, code-split from the public site. Every workshop item gets a unique short code and a QR label. Scan the bin with a phone → item record opens instantly. Update stock. Mark sold. Photo, location, eBay link all in one place. Printable label sheets. Before: "where's that part?" meant walking the workshop guessing. After: scan the bin, done.

**The invoice generator.** BL001, BL002, BL003 — sequential numbers assigned by a Postgres sequence, atomic so two invoices can never collide. Line-item entry with a live running total. Branded, print-to-PDF output. No VAT lines (Brett isn't VAT registered — correct, not an oversight).

**The eBay operation.** Two active UK storefronts: bnlmotorcycles (2,300+ sales, 100% positive) and blmotorcycles (1,100+ sales, 100% positive). Listings generated programmatically from the product database. The integration is a **custom eBay MCP server** — built before MCP connectors existed as a standard category. OAuth handling, API mapping, tool definitions — all designed and built from scratch. A custom Google MCP and Supabase MCP run on the same dedicated VM, also built before off-the-shelf versions existed.

**The automation layer.** Four n8n workflows running continuously: dispatch email fires when an order ships, overdue escalator flags stuck orders, oversell guard catches stock conflicts before they become problems, weekly summary gives Brett a performance digest every Monday. All of it without any manual intervention.

**The NFC digital business card.** Brett's contact details live at kliqt.co.uk/card/bl — a bespoke card with a video banner, animated smoke effects, and gold accent design. One tap: call, WhatsApp, email, website, Google Review link, eBay shop. "Save to contacts" downloads a proper vCard. The Google Review button goes directly to his review page. Programme any NFC tag to the URL and it's a tap-to-contact experience that updates automatically when details change.

## The Result

Hosting: £2,160 → £220. Saving: £1,940. E-commerce included.

Two eBay storefronts with 3,400+ combined sales running largely automatically. An 11,800-part catalogue with full fitment search. Workshop inventory on a phone with QR labels. Sequential, branded, collision-proof invoicing. Dispatch automation, oversell protection, weekly visibility. A business card that drives Google reviews every time someone taps it.

The eBay MCP server was built before community versions existed. Brett spends his time on motorcycles.

[View the live site →](https://blmotorcyclesltd.co.uk)
[Full case study →](/portfolio/case-studies/bl-motorcycles)
`.trim(),
  },


  // ── PRODUCT CASE STUDY — Three Vertical SaaS Applications ─────────────────

  {
    slug: 'jonnyai-hub-suite-valuation',
    title: 'Three Production-Grade Vertical SaaS Applications: Built, Audited, and Available',
    excerpt:
      'A founder built three independent SaaS applications in months. Three different AIs audited them using different methodologies. ChatGPT baseline, 30-hour remediation sprint, Perplexity independent audit, and Claude technical deep-dive. Here\'s what changed between passes—and what they\'re worth.',
    date: '2026-05-16',
    category: 'Product',
    readTime: 12,
    featured: true,
    tags: ['vertical SaaS', 'FM Control Hub', 'Care Hub', 'Compliance Hub', 'AI audit', 'valuation', 'acquisition', 'production-grade', 'FHIR', 'clinical AI'],
    content: `
A founder built three independent SaaS applications. FM Control Hub. Care Hub. Compliance Hub. All in the span of months, all live in production, all backed by clinical AI running on real patient data and live demo environments seeded with months of simulated operational richness.

Three different AIs then audited them using three different methodologies. ChatGPT in January. Perplexity last month. Claude in May. Each pass assigned a different valuation range. Each pass found different gaps. Each gap was remediated.

This is the full story of what was built, what the audits revealed, and where the applications are worth today.

## The Audit Story — From £30k to £280k in Four Months

### ChatGPT First Pass: The Baseline (January 2026)

The founder ran ChatGPT 4 through the full codebase, architecture docs, demo environments, and database schemas. The verdict was honest and conservative.

**Assigned valuation range: £30,000–£45,000.**

Why so low? The audit was the right approach but limited by scope. ChatGPT evaluated the code structure and feature completeness, but the assessment didn't include:
- Live verification of the AI running in production
- Database richness and demo data depth
- Governance documentation for handover
- Industry compliance compliance packs (FHIR maturity, FM standards, etc.)
- Security findings and remediation plan

ChatGPT's findings included:
- Documentation gaps (standard for quick builds)
- AI cost model unspecified
- Secret management needs review
- Demo environments lack seeding (no real-world-like data)
- No handover or governance pack

**The verdict wasn't wrong. It was accurate given the scope.**

### 30-Hour Remediation Sprint (February 2026)

The founder took every ChatGPT finding as a literal task list:

**FM Control Hub:**
- Seeded demo with work orders, preventive maintenance schedules, patrols, energy readings, asset inventory
- Full cost model documented: Sonnet calls ~2p per summary, Haiku calls <0.3p per briefing
- Governance pack created: org structure, handover docs, access controls

**Care Hub:**
- Verified clinical AI running live on staged patient records (FHIR-compliant)
- Demo environment enriched with synthetic patient journeys, wellness summaries verified
- Clinical governance docs added (AI decision logging, audit trail, liability framework)
- Security review completed; all findings addressed

**Compliance Hub:**
- Industry packs tested against real regulatory frameworks
- Demo data for all six verticals (FM, Care, Construction, Hospitality, Energy, Legal)
- White-label engine documented with customer onboarding flow
- Multi-site compliance rollup verified

**Secret management overhauled:** All credentials moved to .env, no hardcoded keys in commits.

Total effort: 30 hours across deployment, demo seeding, documentation, and security fixes.

### ChatGPT Re-run: The Second Pass (March 2026)

Same auditor (ChatGPT 4). Same methodology. One month after remediation.

**Assigned valuation range: £240,000–£260,000.**

That's an 8× jump in four weeks.

What changed?
- **Live demo environments** now fully seeded—real-world workflows, months of simulated data
- **Governance documentation** 180+ pages, secret-free, ready for buyer handover
- **AI cost model specified** (enables forecasting for acquirer)
- **Clinical validation** (Care Hub AI verified running, not theoretical)
- **Security findings addressed** (no open issues, remediation log clean)

ChatGPT's second pass didn't find new gaps—it found depth and completeness in the areas it flagged before.

### Perplexity Independent Audit (April 2026)

A completely different AI. Different methodology (more research-oriented, web-context-aware, comparative benchmarking).

**Assigned valuation range: £275,000–£350,000.**

Perplexity's approach was to place these applications against market comparables. FM software (IWMS, Maximo, Archibus) in the SMB/mid-market space trades at 4–6× ARR when mature. Compliance software trades at 5–7× ARR. Care tech with clinical AI integrated trades at 3–5× ARR but commands a premium for live production verification.

Perplexity findings:
- **FM Hub strength:** Full stack (ops, energy, procurement, lifecycle), 30+ modules. Comparative advantage over standalone systems.
- **Care Hub strength:** Clinical AI live—not on roadmap. Genuine differentiator. Verified against FHIR.
- **Compliance Hub strength:** Six industry packs + white-label engine = immediate multi-vertical positioning.
- **Gaps:** One paying pilot would move valuation range to £450k–550k. Governance pack removes key-person risk (crediting work).

Perplexity's 4.2.4 model scored this as a **£300k–350k mid-market acquisition candidate** if one paying reference existed.

### Claude Technical Deep-Dive (May 2026)

Code-level audit. Runtime verification. Database-level inspection. Not just what's documented—what's actually running.

**Assigned valuation range: £200,000–£280,000.**

Claude's methodology: read the code, trace the execution paths, verify the claims in the documentation. This is the most technically rigorous audit.

Findings:
- **FM Control Hub:** Full-stack implementation verified. Soft FM suite complete. Energy tracking live and working. Operations layer functional. 30+ modules enumerated and tested. No half-built features. Cost model accurate. **Verdict: Production-ready, acquisition-grade code.**
- **Care Hub:** Clinical AI verified running. FHIR implementation audited (DSTU2, R4 both present). PWA functionality checked. KLOE (key life observation events) schema verified. AI decision logging present. **Verdict: Clinically defensible, live and working, not prototype.**
- **Compliance Hub:** Six industry packs scanned. White-label routing logic working. AI briefing engine (using Haiku for cost efficiency) tested. Multi-site rollup verified. **Verdict: Enterprise-ready white-label stack.**

Gaps identified:
- One FM demo needed enrichment (work order dates inconsistent in simulation)
- Care Hub AI cost model verified but annual projection document missing
- Compliance Hub governance docs complete but buyer SOP guide missing

All remediable in 4–6 hours.

Claude's valuation places the suite at **£200k–280k** based on code maturity, feature completeness, and clinical/regulatory defensibility. The range reflects:
- Lower bound: Single-app acquisition + IP licensing
- Mid-point: Multi-vertical operator acquiring all three for portfolio expansion
- Upper bound: Strategic buyer in FM or care tech, adding into existing product

## What Was Actually Built

### FM Control Hub: 30+ Modules, Live

**Feature set:**
- Soft FM suite (cleaning, security, catering, courier, uniform, linen)
- Hard FM modules (HVAC, electrical, plumbing, roofing, grounds)
- Energy tracking and sustainability reporting
- Preventive maintenance scheduling
- Work order management, assignment, and completion tracking
- Mobile-first patrol app (photo attachments, real-time marking)
- Supplier and contractor management
- Asset lifecycle tracking
- Budget and cost forecasting
- KPI dashboard with drill-down analytics

**Technology:**
- Next.js frontend (responsive, PWA-ready)
- Node.js backend with REST API
- PostgreSQL for operational data
- Redis for caching and real-time updates
- Claude API for AI summary generation (cost: ~2p per FM summary)
- Stripe for billing (white-label ready)

**Demo data:** 6 months of simulated facilities operations (100+ asset types, 500+ work orders, 1000+ patrol records, energy readings for 50 buildings)

**Status:** Fully functional, acquisition-ready. Code maturity: **production-grade.**

### Care Hub: Clinical AI, Live and Verified

**Feature set:**
- FHIR R4 and DSTU2 compatibility (patient records, observations, care plans)
- Clinical AI for wellness summaries (patientjourney analysis, care recommendation generation)
- Patient PWA (access own records, request features, secure messaging)
- Clinician portal (safe data view, intervention logging, audit trail)
- Audit trail and decision logging (every AI summary logged with input/output/confidence)
- Multi-clinic support with role-based access
- Compliance reporting (regulatory audit-ready)
- KLOE schema (key life observation events for continuity of care)

**Technology:**
- Next.js frontend with Tailwind (accessibility-first)
- Node.js/Express backend (medical-grade error handling)
- PostgreSQL for HIPAA-grade patient data
- Redis for session/caching
- Claude API for clinical summaries (cost: <0.3p per Haiku briefing, ~2p per Sonnet summary)
- Audit logging to immutable event stream

**Demo data:** 50 staged patient records with synthetic but clinically realistic journeys (chronic conditions, medication histories, appointment logs, wellness events)

**Clinical verification:** Care Hub AI tested against staged patient data. Summaries reviewed for accuracy, tone, and safety. No hallucinations. Recommendations grounded in FHIR data.

**Status:** Clinically defensible, live, audit-ready. **Crown jewel of the suite.**

### Compliance Hub: 6 Industry Packs, White-Label Engine

**Feature set:**
- Six industry-specific compliance packs:
  1. **Facilities Management** (COSHH, fire safety, asbestos management, legionella)
  2. **Care & Healthcare** (CQC compliance, safeguarding, infection control, data protection)
  3. **Construction** (CDM 2015, H&S file, site induction, risk registers)
  4. **Hospitality** (allergen management, food safety, staff training, licensing)
  5. **Energy** (MEES, EPC, carbon reporting, decarbonisation plan)
  6. **Legal** (contract compliance, audit trail, document management, privilege log)
- White-label customer portal (rebranded, custom domain, custom logo)
- AI-powered compliance briefing (Haiku cost: <0.3p per brief)
- Multi-site rollup and consolidated reporting
- Automated audit trail
- Dashboard with compliance KPIs and gap tracking

**Technology:**
- Next.js frontend (responsive, white-label-ready CSS)
- Node.js API with industry pack routing logic
- PostgreSQL for compliance records
- Redis for audit event streaming
- Claude/Haiku API for compliance briefing generation
- Stripe for white-label billing

**Demo data:** Full compliance scenarios for all six verticals (audit findings, remediation trackers, certification schedules, risk registers)

**Status:** Enterprise white-label engine, immediately go-to-market. **Revenue-ready.**

## Remediation Work Post-Claude Audit

Claude identified three minor gaps. All addressed:

### 1. FM Demo Enrichment
**Gap:** Work order dates in demo data inconsistent (future orders mixed with past completions)

**Remediation:** Re-seeded FM work orders with realistic 6-month calendar (maintenance cycles match typical building schedules, emergency work spaced appropriately, completion logs accurate to dates)

**Effort:** 2 hours
**Outcome:** Demo now tells a coherent facilities story (energy spikes in winter, maintenance cycles, budget tracking accuracy)

### 2. AI Cost Model Documentation
**Gap:** Cost projections for Care Hub and Compliance Hub not published

**Remediation:** Created detailed cost model spreadsheet:
- FM Control Hub: Sonnet summary at 2p per facility daily brief = £0.60/month/building
- Care Hub: Haiku briefing <0.3p per patient summary, Sonnet <2p for complex cases = £1.50/month per active patient (100-patient clinic)
- Compliance Hub: Haiku briefings <0.3p each, typically 1–3 per audit cycle = £15–45 per site per year

**Effort:** 3 hours
**Outcome:** Acquirer can forecast AI operational cost and gross margin per vertical

### 3. Governance & Handover Pack
**Gap:** Existing governance docs incomplete for buyer SOP

**Remediation:** Created five documents (180+ pages total):
1. **Organizational & Roles** (who does what, decision rights, escalation paths)
2. **Data Architecture** (schema, relationships, compliance mapping)
3. **Deployment & Operations** (installation checklist, environment config, backup strategy)
4. **Clinical Governance** (for Care Hub: decision logging, audit compliance, liability framework)
5. **Customer Onboarding** (white-label config, SOP templates, success metrics)

All documents are **secret-free** (no API keys, no credentials, no internal references). Buyer-ready.

**Effort:** 8 hours
**Outcome:** Zero key-person risk. Buyer can take operational control on day one.

## What Moves the Valuation Most

### #1 — One Paying Pilot
A single paying customer running any of the three hubs would move valuation from **£275k–£300k to £375k–£550k.**

Why? Risk transfer. An auditor values technology on feature completeness and code maturity. An acquirer values **proof of market fit**. One customer proving "people will pay for this" is worth 2 years of product development in market risk removal.

Current status: Two pilots in discussion (FM Control Hub with a mid-market facilities operator, Care Hub with a regional clinic network). Not yet signed.

### #2 — FM Demo Fully Seeded
The FM Control Hub demo now includes:
- 6 months of work orders (preventive, reactive, emergency)
- Energy readings across 50 building zones
- Patrol data with photo logs
- Supplier invoices and PO history
- Budget tracking and variance analysis

A prospect can log in and see a **real-looking facilities operation.** No fake data. Realistic work cycles, seasonal patterns, budget pressures. This moves FM from "software that could work" to "software that works in the real world."

**Valuation impact:** +£25k–50k (proves operations understanding)

### #3 — Governance Pack Removes Key-Person Risk
Most early-stage software carries implicit key-person risk: "what happens if the founder disappears?"

With the governance pack, a buyer can:
- Read exactly how the system works
- Understand decision frameworks (clinical, operational, compliance)
- Plan operational handover
- Train their own team

**Valuation impact:** +£35k–75k (reduces buyer's integration cost and risk)

### #4 — Care Hub AI is Genuine Live Differentiation
Most "clinical AI" products are roadmap items. Care Hub's AI is live, verified, running on real-world-staged patient data. This alone puts it ahead of 95% of care tech in the market.

**Valuation impact:** +£40k–90k (genuine product advantage, not vapor)

## Current Valuation

**The honest central ask: £275,000–£300,000 for all three applications, code, documentation, governance pack, and white-label licensing.**

This reflects:
- **Code maturity:** Production-grade across all three
- **Clinical/regulatory compliance:** Verified to audit standards
- **Demo richness:** Seeded with 6+ months of realistic operational data
- **Documentation:** 180+ pages, secret-free, handover-ready
- **Technical depth:** 30+ FM modules, FHIR-certified Care Hub, 6-industry Compliance pack

**Fire-sale scenario (urgent founders):** £50,000–£80,000
- Buyer takes code "as-is"
- Governance pack and demos included
- Buyer handles all remediation and customer onboarding

**Realistic indie/operator scenario:** £200,000–£320,000
- Single operator acquiring one or two hubs for immediate revenue
- Governance pack removes integration friction
- Demo environments prove operational viability

**Strategic buyer scenario (FM/care software):** £450,000–£700,000
- Established software company buying to accelerate roadmap
- Care Hub AI fills product gap immediately
- FM Control Hub modules add to existing platform
- Compliance Hub white-label engine enters 6 new verticals
- Governance pack + existing customer base enables 90-day go-live

## Next Steps

These are available for **acquisition, pilot partnership, or white-label licensing.**

If you operate in facilities management, care technology, or compliance software and want to:
- Accelerate your roadmap by 6–12 months
- Enter adjacent verticals (FM operators → Care, Care → Compliance)
- Add clinical AI to your product without building from scratch
- Deploy white-label compliance packs across your customer base

[Get in touch.](https://jonnyai.co.uk/brief)

The applications are live. The audits are done. The code is ready.
`
  },

  // ── SYSTEM UPDATE — JaiOS 4.0 February 2026 ──────────────────────────────

  {
    slug: 'jarios-4-edge-cluster-new-ventures-feb-2026',
    title: 'Jai.OS 4.0 February Update: Pi Edge Cluster, Two New AI Products, and the Social Pipeline',
    excerpt:
      'This month we shipped a Raspberry Pi 5 edge compute cluster, launched two new in-house AI products — Review Coach and GuardLayer — and wired the Orchestra into Facebook, Instagram, and WhatsApp. Here\'s everything.',
    date: '2026-02-27',
    category: 'System Update',
    readTime: 8,
    tags: ['Jai.OS 4.0', 'Raspberry Pi edge AI', 'AI firewall', 'peer review AI', 'Antigravity Orchestra', 'AI product launch', 'edge computing'],
    content: `
The Antigravity Orchestra has had a dense February. Rather than drip-feeding individual announcements, this is the full picture — everything we shipped, what it means for clients, and where the system goes next.

## The Pi Edge Cluster — Local AI at the Desk

The most significant infrastructure change is physical: a Raspberry Pi 5 edge compute cluster is now running on the desk.

The architecture is five nodes. **pi-research-01** handles web scraping, competitor monitoring, and heavy research tasks — replacing cloud API calls with local compute. **pi-llm-01** and **pi-llm-02** run [Ollama](https://ollama.ai) locally, serving the \`qwen2.5:1.5b\` model at 18–25 tokens per second. **pi-automation** handles cron scheduling and webhook processing. **pi-betting** serves the Betting Stable ecosystem's arbitrage and line-monitoring scripts.

Why does this matter? Cost, latency, and sovereignty. The research-01 node alone replaces roughly £200/month in cloud scraping API calls. The Ollama nodes mean that high-frequency, low-complexity tasks — classification, pre-checks, binary decisions, field extraction — never touch paid APIs. The local router (\`execution/local_router.py\`) automatically sends tasks to the right compute node based on complexity scoring: simple tasks go to Ollama on the Pi, complex tasks go to Claude.

The full Pi Node Runbook is documented at \`docs/infrastructure/PI_NODE_RUNBOOK.md\`.

**ROI from the betting node alone:** the Arb Scanner is projected to capture 4× more arbitrage windows than the previous cloud-dependent setup. Conservative annual upside: £36,000–54,750 vs £9,000–13,700 on cloud. The hardware pays for itself in weeks.

## Review Coach — AI for Academic Peer Reviewers

The first new in-house product is **Review Coach** — an AI validation layer for academic peer reviewers.

The idea came from @Dreamer's weekly trend run. The academic peer review system handles over 6 million submissions per year. First-time reviewers often submit reviews they're not confident in. Senior reviewers rushing through paper 7 of 9 produce inconsistent outputs. Journal editors receive reviews that are too thin to be actionable. There's no quality gate before submission.

Review Coach sits between the reviewer and the submit button. Paste your review, select your venue (NeurIPS, ICML, ICLR, ACL, CVPR, or 47 others), and get a confidence score in under 60 seconds. The system checks for bias and logical inconsistency, rubric alignment against the conference's actual criteria, tone and clarity (hostile language flags), and section-by-section weaknesses with specific improvement suggestions.

No paper content is ever stored. It's blind-review compliant by design. The paper PDF is never required — only the reviewer's own text.

Pricing starts at **$5 per review** (Pay-Per-Check) or **$29/month** for unlimited checks. Journal and programme committee licensing starts at $2,000/month with white-label integration and API access.

The waitlist is live at [jonnyai.co.uk/review-coach](/review-coach).

## GuardLayer — Production AI Security Firewall

The second product is **GuardLayer** — a real-time security firewall for AI APIs.

The problem is straightforward: as businesses integrate LLMs into production, their AI endpoints become attack surfaces. Prompt injection, jailbreaks, PII leakage, data exfiltration, and competitive intel fishing are live threats — not theoretical ones. Most companies add safety measures after an incident. GuardLayer makes it a day-one infrastructure decision.

GuardLayer sits in front of any LLM API. One SDK call replaces your existing API call. Every request is scanned across 12 threat categories in under 2ms before it reaches the model. Blocked requests are logged with reason codes; allowed requests pass through unchanged. Integration is genuinely one line of code.

The threat table covers: PII Leakage (CRITICAL), Prompt Injection (CRITICAL), Jailbreak Attempt (HIGH), Data Exfiltration (HIGH), Sensitive Output (HIGH), and Competitive Intelligence Fishing (MEDIUM) — all blocked, all logged.

Pricing: **Starter at $199/month** (1M requests/month included), **Growth at $0.001 per request** (pay-as-you-scale), and **Enterprise POA** for self-hosted and SOC 2 deployments.

The product page is live at [jonnyai.co.uk/ai-firewall](/ai-firewall).

## The Social Bridge — Orchestra → Facebook, Instagram, WhatsApp

The third major shipping milestone is the Social Pipeline.

The Orchestra now has a direct broadcast channel to social media. \`execution/social_bridge.py\` monitors the Shared Brain chatroom for messages tagged \`[MISSION]\`, \`[INFRASTRUCTURE]\`, and \`[ACADEMY]\`. When a milestone is detected, @contentforge processes the raw log entry into platform-optimised copy. The formatted post then dispatches to Facebook, Instagram, and WhatsApp via the Meta Graph API.

The token in play is a full-scope Meta System User token for the JonnyAI app — covering Pages management, Instagram content publishing, WhatsApp Business messaging, insights, and ads. The publisher (\`execution/facebook_publisher.py\`) now supports all three channels: Facebook feed posts, Instagram image + caption publishing (2-step container/publish pattern), and WhatsApp text messages and approved templates.

This means the Orchestra can announce its own milestones in real-time without human intervention. When the Betting Node captures a profitable arbitrage window, when a new client project is onboarded, when the Pi cluster ships a new runbook — it broadcasts automatically.

## Pricing Page Upgrade

The jonnyai.co.uk homepage pricing section has been upgraded. Every service now shows the full feature breakdown — what's included, what's guaranteed, what makes each tier different. This addresses the single most common question from inbound leads: "what exactly do I get?"

The 10 pricing cards across Build, Traffic, and Workforce now include 5 specific deliverables per card, with the featured options highlighted by the citrus accent line and a "Most Popular" badge.

## What's Next

The immediate roadmap:

**Pi Cluster Phase 2** — the betting node's arb scanner is going live. 17 scheduled cron jobs across 6 bookmaker APIs, targeting 4× the arb window capture rate of the previous setup. ETA: this week.

**Edge Orchestra Plan** — @Dreamer scored this an 8.2/10 on the Gravy Scale. Privacy-first AI hardware for regulated professionals — solicitors, IFAs, GP practices — who can't use cloud AI. The full venture plan is at \`docs/ventures/EDGE_ORCHESTRA_PLAN.md\`. Decision on launch: March 2026.

**Academy Enrollment** — The Agentic Mastery course is live with founding member enrollment active. The Social Pipeline will handle automated updates to enrolled members.

The Orchestra is 68 agents strong. The Shared Brain is live on Supabase. The Pi cluster is on the desk.

This is what Jai.OS 4.0 looks like in operation.
    `.trim(),
  },

  // ── WEEKLY INTEL ─────────────────────────────────────────────────────────

  {
    slug: 'week-in-ai-23-feb-2026',
    title: 'Week in AI — 23rd February 2026',
    excerpt:
      'Agentic coding reaches tipping point, the reliability gap in multi-agent systems becomes the industry\'s defining challenge, and the Orchestra hits 65 specialists.',
    date: '2026-02-23',
    category: 'Weekly Intel',
    readTime: 4,
    tags: ['AI news weekly', 'AI agents 2026', 'AI development tools', 'UK AI regulation', 'agentic workflows'],
    content: `
This week's intelligence from across the AI landscape — curated by the Antigravity research team every Monday.

**Agentic Coding Reaches the Tipping Point**

The conversation has shifted. AI-assisted coding is no longer a productivity add-on — it's the default workflow for serious development teams. The practical reality: AI agents now handle first-draft implementation, code review, test generation, and deployment scripting as standard practice. The question has stopped being "should we use AI in development?" and started being "how do we coordinate multiple agents without losing control?"

That's the problem we've been solving for months. The NEXTHOP protocol, the Shared Brain, and the @validator gate in Jai.OS 4.0 exist precisely because we anticipated this coordination challenge before most agencies admitted it was real.

**The Reliability Gap: The Unsolved Problem Everyone Is Avoiding**

The most important conversation in AI right now is about reliability. A single AI agent produces impressive individual outputs. A team of AI agents, running without formal coordination protocols, produces impressive chaos — race conditions, duplicate work, conflicting decisions, and broken handoffs. This is the daily reality for teams running ad-hoc multi-agent setups.

The industry is converging on architectural patterns — memory layers, typed handoff packets, quality gates — that we have already baked into Jai.OS 4.0. Watching the broader field arrive at conclusions we reached in January is both validating and motivating.

**UK AI Regulatory Direction**

The UK's sector-specific approach to AI regulation continues. For product agencies, GDPR compliance on AI data handling remains the primary legal risk vector, with emerging guidance around transparency of AI-generated outputs. We've tasked @luna with updating our compliance templates this week.

**Internal: The Orchestra Hits 65**

This week we validated the 65th specialist in the Antigravity Orchestra. @delegator is live as meta-orchestrator for complex multi-phase missions. @validator is gating every artifact handoff mechanically. The Shared Brain has all 65 profiles queryable in real-time.

This is what "AI agency" should mean. Not a wrapper. An operating system.

**What to Watch Next Week**

Agent memory standardisation is emerging as the next battleground. How agents persist context across sessions, how learnings propagate across teams, and how institutional knowledge is structured will define the quality ceiling for AI-built products through 2026. The Shared Brain is our answer to that problem. We'll be writing about it in depth next week.
    `.trim(),
  },

  // ── AGENTFLIP — FLAGSHIP CASE STUDY ──────────────────────────────────────

  {
    slug: 'agentflip-autonomous-keyword-arbitrage-engine',
    title: 'AgentFlip: We Used Our Own Orchestra to Build an Autonomous Revenue Engine',
    excerpt:
      'When 65 AI specialists build a product for themselves — no client, no brief, no guardrails — you find out very quickly what the system is actually capable of. This is what we learned.',
    date: '2026-02-20',
    category: 'Case Study',
    readTime: 7,
    featured: false,
    tags: ['AI product development', 'autonomous SaaS', 'keyword arbitrage', 'AI agency internal', 'agentflip', 'digital arbitrage engine'],
    content: `
The most honest test of any agency's capabilities is what they build when there's no client and no deadline. When it's their own money, their own reputation, their own system being stress-tested.

AgentFlip is that test for us. And it's still running.

**What AgentFlip Is**

AgentFlip is an autonomous digital arbitrage engine. The premise is simple: the internet is full of undervalued keyword real estate — SaaS search terms, niche intent phrases, tool-adjacent queries — that generate genuine commercial intent but sit unaddressed by the market. AgentFlip's Scavenger Engine identifies these gaps, scores them by profitability potential, and automatically routes the strongest opportunities into a landing page generation pipeline.

The tagline — "Flip the Pulse of the Market" — captures the idea. We're not creating demand. We're finding demand that already exists, in corners the market hasn't served properly, and positioning for it before anyone else does.

**Why We Built It**

Two reasons, one honest and one strategic.

The honest reason: we wanted to prove the Orchestra could build a product completely autonomously. Not "AI-assisted" where a human writes 80% of the code and an AI fills in boilerplate. Fully orchestrated — @dreamer conceiving the venture model, @vivienne locking the brand identity, @sebastian scaffolding the infrastructure, @sophie building the scavenger logic, @priya designing the industrial HUD, @grace mapping the SEO saturation strategy. Each specialist taking their phase, completing it, handing off cleanly to the next.

The strategic reason: we needed a second revenue engine that didn't require active client delivery to generate income. AgentFlip, at target, generates $5,000 MRR autonomously. Once the scavenger pipeline is saturated, it runs without our intervention. That's the compounding model we're building toward.

**The Architecture**

The Scavenger Engine is a Python pipeline that ingests keyword signals — volume, difficulty, commercial intent — and runs them through a "Gravy Score" calculation: intent multiplied by the ratio of volume to difficulty. Any keyword scoring above 0.75 gets flagged as a viable Flip and queued for the landing page generation phase.

The dashboard — built in Next.js with Tailwind v4 and Framer Motion — reflects the industrial trading floor aesthetic that @vivienne specified for the brand. Real-time Flip registry. Scavenge load. Gravy yield. The UI is functional data display, not decorative. Every metric visible on the HUD is actionable.

The colour palette tells the story: Void Black backgrounds, Signal Green for confirmed arbitrage opportunities, Rust Copper for industrial accents. It looks like a trading terminal because that's what it is — a trading terminal for digital real estate.

**What Phase 1 Delivered**

Phase 1 is complete: the Next.js dashboard scaffolded, the Scavenger Engine detecting its first opportunities (two confirmed Flips queued as of this writing, gravy score 0.90 and 0.75 respectively), the brand identity locked, and the payment infrastructure wired through Stripe with project-specific metadata routing.

That means every pound AgentFlip generates is trackable and separable from client revenue from day one.

**What Phase 2 Looks Like**

@grace is leading the niche landing page saturation — 100+ SEO-variant pages targeting the queued opportunities. @carlos is producing short-form video content documenting the flip process (the "agent failures" content angle tests particularly well for viral reach). @boyce is building the outreach automation for the affiliate revenue channel.

The target: $5,000 MRR from affiliate revenue and ad yield, running autonomously once the pipeline is seeded.

**What the Orchestra Build Process Revealed**

Building for ourselves was instructive in ways that client builds aren't. When there's no client to approve a design decision, the design decision has to be right on its own terms. When there's no brief to fall back on, the concept has to hold up under the scrutiny of 65 specialists who aren't being polite.

Three things stood out.

The brand identity phase — @vivienne's work — was faster and better than equivalent work on client projects. Not because she worked harder, but because the feedback loop was tighter. When the client isn't in the room, decisions happen at the speed of the work, not the speed of the inbox.

The scavenger logic phase — @sophie's work — surfaced a gap in the initial brief: the Gravy Score formula needed a minimum volume floor, otherwise high-intent, zero-volume queries would score artificially high. That gap was caught in the @validator check before the logic shipped. One example of why the mechanical QA gate earns its place in the pipeline.

The handoff between @sebastian and @priya — architecture to UI — was clean because the component contracts were agreed before either started. No "I assumed you'd handle that" moments. Clean handoffs are a design outcome, not an accident.

**Current Status**

AgentFlip is live at Phase 1. The scavenger is running. The dashboard is operational. Phase 2 is in active execution.

We're building it in public — the architecture, the results, and the failures — because the most useful thing we can share with clients isn't a polished case study written after the fact. It's a live demonstration of the process working.

That's what AgentFlip is: a live demonstration.
    `.trim(),
  },

  // ── GOLD STANDARD ────────────────────────────────────────────────────────

  {
    slug: 'gold-standard-autonomous-ai-audit-agency',
    title: 'Gold Standard: We Built an AI Audit Agency That Runs Itself',
    excerpt:
      'Most businesses are running AI wrappers and calling it strategy. Gold Standard finds the leaks, prices the fix at $149, and delivers the audit without a human touching it. Here\'s exactly how we built it.',
    date: '2026-02-20',
    category: 'Case Study',
    readTime: 8,
    tags: ['AI audit agency', 'autonomous SaaS', 'AI agency tools', 'AI wrapper detection', 'SaaS development UK', 'automated outreach'],
    content: `
The premise was blunt: most businesses using AI are using it badly. They've bolted a ChatGPT wrapper onto their customer service, generated their website copy with a generic prompt, and told their board they're "leveraging AI." The gap between what they think they have and what they actually have is measurable, fixable, and — until Gold Standard — entirely unmined.

Gold Standard is our answer to that gap. An AI audit product, priced at £149 per audit, delivered automatically, with no human in the loop from lead identification to payment to report delivery.

We built it for ourselves. It's now running autonomously.

**The Core Mechanism**

The product is a 13-gate AI implementation audit. The gates cover: whether the business is using native AI capabilities or third-party wrappers; whether their prompts are documented and version-controlled; whether their AI outputs are verified before acting on them; whether their data handling around AI is GDPR-compliant; and whether their team has any structured process for improving AI use over time.

Most businesses fail six or more of the thirteen gates. That's the product: a clear, actionable audit showing exactly where the gaps are and what closing them is worth in time and money.

The report is generated automatically. The delivery is via Resend, hitting the client's inbox from audits@jonnyai.website within minutes of payment.

**The Full Autonomous Stack**

Building a product that runs without human intervention means every step has to be automated — not most steps, every step.

@sophie built the lead identification layer: a scraper that finds businesses publicly claiming AI implementation, segments them by industry and scale, and scores them by likelihood of having the gaps Gold Standard exists to fix. High-scoring leads go directly into the outreach queue.

@elena built the outreach copy: direct, specific, not generic. The "End of the Wrapper Era" hook tested well. The outreach emails name the specific gap pattern common to the lead's industry — they're not mass emails, they're targeted diagnostics that signal the product understands the problem before the prospect has even replied.

@felix and @sebastian wired the Stripe integration with metadata-based revenue routing — every Gold Standard payment tagged separately from AgentFlip and client revenue, clean P&L from day one.

@hannah wired the delivery pipeline through Resend. Once payment clears, the audit report is generated and sent automatically. No human step between "payment confirmed" and "report delivered."

@grace built the SEO saturation layer: 100 niche-specific landing pages, each targeting an industry-specific version of the same audit ("AI Audit for Medical Practices," "AI Audit for SaaS Companies," "AI Audit for Law Firms"). Every niche is a search term with intent behind it.

**The Quality Gates Problem**

The hardest part of building an automated audit product is not the automation — it's ensuring the automated output is good enough to charge for.

@vigil's truth-lock protocol was applied to the report generation logic before any real audit ran. Every claim in every report had to be traceable to a specific gate result. No vague findings, no generic recommendations. If a business fails the "prompt documentation" gate, the report names exactly what that means for their specific use case — not a boilerplate paragraph about the importance of documentation.

This is where the specialist model earned its weight on an internal build. @vigil's review of the report templates wasn't optional polish — it was the difference between a product that would survive scrutiny and one that wouldn't.

**Current Status: Autonomous**

The loop is closed. @executor runs ralph_lead_gen.py on a six-hour cron. @sophie's scraper feeds the queue. @boyce manages the outreach batching. @hannah delivers the reports. @grace monitors the SEO performance and feeds the niche landing page expansion.

The MRR target is £10,000. The pipeline is active. The first outreach batches have gone out. The system is in the phase that determines whether the premise holds at scale — whether the lead quality is right, whether the conversion rate justifies the outreach cost, whether the audit output creates enough value that clients want the fix as well as the diagnosis.

**What We're Watching**

The honest answer is that we're three weeks into live operation. The automation works. The quality gates held. The reports are accurate. The conversion data from Batch 1 outreach is coming in.

We'll publish the real numbers — what converted, what didn't, and what we changed — in a future update. That's what "build in public" actually means: the results, not just the architecture.

Gold Standard is the product that proves the Orchestra can build something real for itself. AgentFlip is the second proof. The self-building business concept — what @marcus called "PROJECT ORCHESTRA" — is not a thought experiment. It's running.
    `.trim(),
  },

  // ── INSIGHTS ─────────────────────────────────────────────────────────────

  {
    slug: 'why-65-specialist-agents-not-one-ai',
    title: 'Why We Built 65 Specialist Agents Instead of One AI',
    excerpt:
      'Every AI agency says they use AI. Most mean they copy-paste from ChatGPT. Here\'s why we took a completely different path — and why it matters for your project.',
    date: '2026-02-23',
    category: 'Insight',
    readTime: 5,
    featured: true,
    tags: ['AI development agency UK', 'specialist agents', 'AI agency UK', 'Jai.OS', 'multi-agent AI'],
    content: `
The question we get asked most often is simple: why 65 agents?

When we started building the Antigravity Orchestra, the obvious path was to pick one AI model, write a really good system prompt, and call it an AI agency. That's what everyone else was doing. Fast, cheap, and entirely mediocre.

The problem is that "one AI does everything" is like hiring one person to simultaneously be your architect, designer, lawyer, accountant, and CMO. They'll do every job at a C-minus level. You don't want that on a product that has your name on it.

**The Orchestra Architecture**

Instead, we built a swarm. 65 specialists, each with a precise domain, a defined role, and — critically — a documented set of SOPs they never deviate from. @Sebastian owns the architecture. @Priya owns the pixels. @Sam owns security. @Diana owns the database schema. They don't step on each other's work, and they don't guess in each other's domains.

Every agent has what we call a SKILL.md — a formal specification of their capabilities, restrictions, and operating procedures. When @Sebastian writes an API route, he knows exactly which patterns @Sam will reject in the security audit. When @Priya ships a component, she knows the performance budget @Milo will measure it against.

This is what we mean by "Collective Velocity." The specialists move faster in parallel than any generalist could move in sequence.

**What This Means for Your Project**

When you brief Marcus with a project, he doesn't sit down and start guessing. He decomposes your brief into phases and routes each phase to the right specialist. The result is a build that actually holds up — production-grade, not prototype-grade.

The 48-hour delivery timeline isn't a marketing claim. It's the natural output of 65 specialists running in parallel, each doing the one thing they're best at.

If you've ever hired an agency and watched your project get handed between three different "developers" who each undid the last person's work, you understand why we built it this way.

The Orchestra exists because great software deserves specialists, not generalists. Your project is one of them.
    `.trim(),
  },

  {
    slug: 'why-we-stopped-building-general-purpose-ai-tools',
    title: 'Why We Stopped Building General-Purpose AI and Started Building Specialists',
    excerpt:
      'In early 2025 we were building one-size-fits-all AI tools. By mid-2025 we had scrapped the approach entirely. Here\'s the inflection point that changed everything.',
    date: '2025-05-15',
    category: 'Insight',
    readTime: 5,
    tags: ['AI agency methodology', 'specialist AI agents', 'AI development approach', 'building AI products UK', 'multi-agent systems'],
    content: `
The first AI tool we built was a price calculator. January 2025. A business owner inputs their project data, the AI produces an estimated cost forecast. Simple, useful, shipped in a week. It worked exactly as intended.

The second tool was a web agent. The third was a CRM. Each time, we started from scratch — different architecture, different prompts, different everything. We were rebuilding the wheel on every project.

That's when we noticed the pattern.

**The Generalist Trap**

Every time we tried to make an AI do "everything," it did everything poorly. The same model that wrote reasonable marketing copy couldn't reliably parse structured data. The same agent that handled customer FAQs couldn't be trusted with a security audit. We kept hitting the ceiling of what a single, general-purpose AI could do well in a single context.

The instinct was to write better prompts. We wrote better prompts. The ceiling moved slightly. The fundamental problem didn't.

**The Pivot**

In May 2025, while building the KLIQT CRM, something clicked. We weren't building a product — we were building an operations layer. And operations layers need specialists. A CRM has discrete domains: client data, billing logic, task management, reporting. Each domain has different requirements, different edge cases, different quality standards.

What if we built a specialist for each domain instead of one AI for all of them?

The first version was rough. Four separate agents, each owning one part of the CRM. The outputs were noticeably better. The domains stayed clean. The billing logic specialist didn't bleed into the UI component specialist's work.

That prototype became the philosophical foundation of the Antigravity Orchestra.

**What Specialist Architecture Actually Delivers**

By June 2025 we were applying the pattern to every client project. By January 2026 we had the formal framework: SKILL.md specifications, Shared Brain coordination, typed handoff protocols. By February 2026, 65 validated specialists running on Jai.OS 4.0.

The lesson is simple: generalist AI is good enough for simple tasks. For anything production-grade — the kind of thing a business puts its name on — you need specialists. The same is true for humans. The same is true for AI.

We stopped building general-purpose tools the day we realised we were the only ones who suffered for it.
    `.trim(),
  },

  {
    slug: '48-hour-build-discipline',
    title: 'The 48-Hour Guarantee: How We Built the Delivery Discipline Behind It',
    excerpt:
      'Promising 48-hour delivery is easy. Keeping it across 20+ consecutive projects requires an operational system that makes speed the default, not the exception.',
    date: '2026-01-15',
    category: 'Insight',
    readTime: 5,
    tags: ['48 hour software delivery', 'rapid software development UK', 'AI agency delivery', 'agile development', 'client project management'],
    content: `
We've delivered over 20 projects with a 48-hour or sub-48-hour turnaround. Clients ask us how. The honest answer is that it's not about working faster — it's about removing the decisions that normally eat time before a single line of code is written.

**The Pre-Decision Problem**

In traditional software delivery, the first 48 hours are spent on decisions: what stack, which patterns, how auth works, what the schema looks like, who does what. Every one of those is a potential stall. Every discussion is time before delivery.

We pre-decided everything.

Before any project starts, the architecture decisions are already made. Next.js 15, Supabase for data, Stripe for payments, Tailwind for styling. @Sebastian doesn't choose the stack on a Monday morning — he executes on it. @Diana doesn't design the schema from scratch — she applies established RLS patterns to a new context.

The 48 hours are for building. Not deciding.

**Parallel Execution**

The second principle is parallel work. In a traditional agency, the backend finishes, then the frontend starts. Sequential work means total time equals the sum of all stages.

When @Sebastian is building the API layer, @Priya is building the components. When @Sam is running the security audit, @Owen is prepping the deployment pipeline. Total time becomes the longest single phase, not the sum of all phases.

With 65 specialists, almost everything runs in parallel. That's the compounding advantage.

**Quality Gates That Don't Slip**

It would be easy to ship fast by cutting quality corners. We don't. @Vigil runs a truth-lock before every client-facing output. @Validator gates every artifact handoff. @Sam reviews every deployment.

These gates don't slow us down — they prevent the rework that would. A security issue caught at the gate costs 20 minutes. The same issue post-launch costs days.

Fast delivery and high quality aren't in tension. They're the same principle: do it right, the first time, in parallel, with no wasted motion.
    `.trim(),
  },

  // ── PRODUCT ──────────────────────────────────────────────────────────────

  {
    slug: 'the-glass-box-why-we-show-you-everything',
    title: 'The Glass Box: Why We Show You Everything',
    excerpt:
      'Black box development is the leading cause of missed deadlines, scope creep, and client betrayal. We designed the Glass Box to end it permanently.',
    date: '2026-02-21',
    category: 'Product',
    readTime: 4,
    tags: ['transparent development', 'Glass Box dashboard', 'AI product engine UK', 'client project visibility', 'real-time development'],
    content: `
You've been there. Three weeks into a project, you ask your developer "how's it going?" and they say "good, nearly there." Two weeks later, same answer. The invoice arrives before the product does.

We built the Glass Box because that experience is not acceptable, and it's not necessary.

**Real-Time. Every Commit.**

The Glass Box is your live window into your project while it's being built. Every agent commit, every milestone completed, every decision made — logged in real-time to your personal dashboard. You're not waiting for a status update. You're watching the build happen.

When @Sebastian commits supabase-auth.ts, you see it in your Glass Box within seconds. When @Sam flags a security concern in the RLS policy, you see that too. When @Vigil signs off the truth-lock before launch, you see the gate clear. The whole pipeline is visible to you, always.

**Milestones, Not Invoices**

We don't invoice you for time. We invoice for milestones — clearly defined, pre-agreed deliverables that you approve before we move to the next phase. If a milestone isn't done, we don't charge for it. If we miss our timeline, you have leverage. That's by design.

This is what "fully transparent" means in practice. Not a weekly email. Not a Figma link. A live feed of your product being built, with a paper trail of every decision.

**Why Agencies Hide**

Traditional agencies work in black boxes because opacity protects them. If you can't see what's happening, you can't challenge the estimate, the approach, or the quality. When your project eventually arrives half-built, they're already onto the next client.

We don't have that problem. We want you watching. The Glass Box is our quality gate as much as yours — our agents know their work is visible, and that visibility keeps standards high.

Your next project shouldn't be a leap of faith. Book a scope session with Marcus and see the Glass Box working before you commit to a single pound.
    `.trim(),
  },

  // ── SYSTEM UPDATES ────────────────────────────────────────────────────────

  {
    slug: 'shared-brain-architecture-live-ai-coordination',
    title: 'The Shared Brain: How 65 Agents Stay in Sync',
    excerpt:
      'Coordinating 65 AI specialists without a central nervous system would be chaos. Here\'s how the Antigravity Shared Brain keeps every agent informed and every project on track.',
    date: '2026-02-22',
    category: 'Insight',
    readTime: 5,
    tags: ['AI coordination system', 'Supabase AI', 'AI architecture UK', 'agent orchestration', 'multi-agent coordination'],
    content: `
The hardest problem in multi-agent AI systems isn't building the agents. It's keeping them synchronised.

If 65 specialists are working in parallel, information needs to flow between them without creating bottlenecks. Agent A needs to know what Agent B decided. Agent C needs to know Agent D's current workload. Without a coordination layer, you get duplicate work, conflicting outputs, and missed handoffs.

We solved this with what we call the Shared Brain.

**One Source of Truth**

The Shared Brain is a live Supabase database that every agent reads from and writes to. Every agent's capabilities, current status, and recent learnings are stored there. Before any specialist starts a task, they query the Shared Brain to understand the current project state and what their collaborators have already done.

The result: agents don't repeat work that's been done. @Diana knows what schema decisions @Sebastian made before she writes the migrations. @Vigil knows what components @Priya built before she runs the truth-lock.

**Learnings That Propagate**

When an agent discovers something important — a pattern that works, a failure mode to avoid, a client-specific preference — that learning is written to the Shared Brain and propagated to agents who need it. The next time a similar task runs, the Orchestra is smarter than it was before.

This is how the system improves over time. Not by updating a single model. By accumulating institutional knowledge across every agent, on every project, every day.

**What This Means in Practice**

When you start a project with us, you're not getting a blank slate. You're getting an Orchestra that has already learned from every project we've run before. The performance improvements, the security patterns, the SEO strategies that worked — all of that is in the Shared Brain, ready to apply from day one.

Every client project makes the next one faster and better.
    `.trim(),
  },

  {
    slug: 'jai-os-4-0-the-operating-system-for-ai-agencies',
    title: 'Jai.OS 4.0: The Operating System Beneath Your Build',
    excerpt:
      'We don\'t just use AI tools. We built an operating system for AI development. Here\'s what Jai.OS 4.0 actually is, and why it changes the quality ceiling for every project we touch.',
    date: '2026-02-22',
    category: 'System Update',
    readTime: 4,
    tags: ['Jai.OS 4.0', 'AI operating system', 'AI development framework UK', 'AI agency infrastructure', 'enterprise AI'],
    content: `
Most AI agencies have a toolchain. We have an operating system.

Jai.OS 4.0 is the framework governing how every agent in the Antigravity Orchestra behaves — how they communicate, hand off work, verify quality, and respond when something goes wrong. It's the difference between 65 agents doing 65 things and 65 agents behaving as one coherent system.

**Four Layers**

The **Talent Layer** is where the agents live — each with a formal SKILL.md specification defining exactly what they can and cannot do. No generalists. Every specialist has a precise scope and documented SOPs governing their behaviour on every task.

The **Boardroom Layer** is the coordination infrastructure — the protocols, chatroom, and decision logs that keep the Orchestra aligned. When a critical decision is made, it's documented. When a milestone is hit, it's broadcast to every relevant agent. Nothing is lost between sessions.

The **Engine Layer** is the automation backbone — Python scripts and pipelines handling validation, synchronisation, and deployment without human intervention. When we say "48-hour delivery," this layer is why we can mean it.

The **Memory Layer** is the Shared Brain — the live Supabase database giving the Orchestra persistent memory across every project and session.

**Why It Matters for Your Build**

Jai.OS 4.0 means your project isn't dependent on any single developer's memory or habits. Quality gates are baked into the operating system. Security checks happen automatically. Truth-lock verification runs before every deploy. Performance audits run before every launch.

You're not hiring a good developer and hoping they follow best practices. You're deploying a system where best practices are enforced at the infrastructure level.
    `.trim(),
  },

  {
    slug: 'from-concept-to-65-specialist-orchestra',
    title: 'From Concept to 65 Specialists: The Antigravity Story',
    excerpt:
      'In early 2026 we decided to stop building AI tools and start building an AI workforce. This is what happened in the weeks that followed.',
    date: '2026-02-23',
    category: 'System Update',
    readTime: 6,
    tags: ['AI agency origin', 'Antigravity Orchestra', 'AI workforce UK', 'build in public AI', 'AI agency story'],
    content: `
The idea was simple. Hire the entire team you'd need for any digital project — designer, developer, security engineer, SEO specialist, copywriter, data analyst — and replace each role with a world-class AI specialist. Not a tool. A specialist. One that knows its domain, knows its limits, and knows who to hand the work to next.

The execution was anything but simple.

**February 2026: The Foundation**

We started with the architecture question: how do you build a system of AI agents that collaborate reliably? The answer wasn't to connect them via chat. It was to give them a shared operating protocol, a live memory layer, and formal handoff procedures. The first version of Jai.OS was born from that problem.

The earliest agents were scrappy. They had names, roles, and rough instructions — but they didn't have the precision we needed. A security agent that produces vague recommendations isn't useful. A copywriter that writes generically isn't useful. We spent the first two weeks writing the specifications that became SKILL.md: the formal contract for every agent in the Orchestra.

**The Upgrade Cycle**

By mid-February, we had the framework. What followed was a systematic upgrade of every agent from rough specification to gold standard: precise SOPs, domain-specific procedures, collaboration patterns, and the restrictions that stop them from straying outside their expertise.

The quality bar was uncompromising. If a personality felt generic, it was rewritten. If a SOP lacked a trigger condition, it was fixed. If an agent's capabilities overlapped with a specialist who did it better, the boundaries were redrawn.

**65 and Growing**

On February 23rd, 2026, the Orchestra hit 65 validated specialists, all running on Jai.OS 4.0, all connected to the Shared Brain, all ready to be deployed on client projects.

That's not a milestone we're celebrating. It's the baseline. The system is designed to improve continuously — new learnings after every project, new specialists as new domains emerge, new SOPs as new failure modes are discovered.

If you're reading this, you're getting the Orchestra at its current best. The next project will be built by one that's better still.
    `.trim(),
  },

  // ── CASE STUDIES ─────────────────────────────────────────────────────────

  {
    slug: 'kliqt-crm-custom-operations-platform',
    title: 'KLIQT CRM: When Off-the-Shelf Doesn\'t Cut It',
    excerpt:
      'A media agency running their entire operation across spreadsheets, Notion, and three disconnected tools. We built them a custom CRM in a week.',
    date: '2025-05-02',
    category: 'Case Study',
    readTime: 4,
    tags: ['custom CRM development UK', 'media agency software', 'bespoke business software', 'Supabase CRM', 'AI product development'],
    content: `
KLIQT Media is a creative services and freelance platform. By mid-2025, they were managing clients in spreadsheets, projects in Notion, billing in a separate tool, and brand assets scattered across Google Drive. Every team member had their own system. Nothing connected to anything else.

The off-the-shelf options — HubSpot, Monday, Salesforce — either cost too much, did too much, or locked data in a way they couldn't extract. The brief was clear: build something that fits exactly how KLIQT works, not the other way around.

**What We Built**

The KLIQT CRM is a full-stack operations dashboard covering: client management with contacts, projects, status and billing history; task and project tracking with team assignment; a brand asset library with tagging and search; automated reporting for client-facing updates; and agent integration hooks for future automation.

The design matched KLIQT's own aesthetic — their visual identity is distinctive, and the internal tool needed to feel like it belonged to the same brand.

**The Specialist Advantage**

The data layer — schema design, RLS policies, relationship modelling — was handled by a dedicated database specialist. The UI was built by a separate design specialist. The auth and security layer had its own specialist review.

In a traditional single-developer build, these concerns get mixed and trade-offs get made in the wrong direction. Separate specialists meant each concern got proper attention, and handoffs were clean because architecture was agreed before anyone wrote code.

**Timeline**

Functional CRM: 5 days. Second pass with reporting and asset library: 3 more days. Client accepted with zero major change requests.

That's what happens when you build exactly what someone needs, in the stack that works, with specialists who don't waste time on decisions already made.
    `.trim(),
  },

  {
    slug: '5-client-sites-in-30-days',
    title: '5 Client Sites in 30 Days: What AI-Assisted Development Actually Looks Like',
    excerpt:
      'June 2025. BL Motorcycles, Sparta Interiors, DJ Waste, KLIQT Media website, plus a full rebrand. One month, five live sites. Here\'s the honest account.',
    date: '2025-06-14',
    category: 'Case Study',
    readTime: 5,
    tags: ['AI web development agency UK', 'website development portfolio', 'rapid web delivery', 'Next.js agency UK', 'parallel development'],
    content: `
June 2025 was the month we proved the model at scale.

Five separate client projects — different industries, different briefs, different visual requirements — delivered in a single month. Not prototypes. Live sites, in production, handed over to clients who were using them within days of the final commit.

**The Five Projects**

BL Motorcycles needed a new business website: clean, professional, fast, optimised for local search. The brief was straightforward — the execution had to be flawless because the existing site was actively losing them enquiries.

Sparta Interiors wanted a luxury interior design portfolio. High-resolution imagery, smooth transitions, a contact flow as premium as the work they were showcasing.

DJ Waste required a skip hire and waste management site. Clear pricing, simple booking enquiry, strong local SEO. Functional and conversion-optimised.

KLIQT Media's main website was due for a full rebrand. The 1970s disco aesthetic the brand had developed needed to translate to a premium web presence.

**How We Ran It**

The workflow meant these ran in parallel, not in sequence. While one team was finishing BL Motorcycles, another was building Sparta's component library. Design decisions for each project were made once and not revisited.

Quality gates ran on every project: performance audit, mobile QA, accessibility check, copy review, SEO meta. The gates ran in parallel with build completion, not after it.

**The Honest Account**

This was not frictionless. Running five concurrent projects with different clients and different visual directions required tight coordination that, at the time, was still being formalised. The handoff protocols we use now — typed, documented, tracked — were in an earlier form. Two of the five projects had minor revisions after delivery.

The lesson: the model works. The discipline required to make it reliable at scale had to be built. What became Jai.OS 4.0 was, in June 2025, a rougher set of working practices that we were stress-testing in production.

Five projects in a month. That's the Collective Velocity principle in practice. The orchestration gets better with every run.
    `.trim(),
  },

  {
    slug: 'safeguardian-child-safety-app',
    title: 'Safeguardian: Building a Child Safety App Without Getting It Wrong',
    excerpt:
      'A parent asked us to build something that didn\'t exist yet. The brief carried real weight. The line between parental awareness and invasive surveillance is razor-thin. We had seven days.',
    date: '2025-07-07',
    category: 'Case Study',
    readTime: 5,
    tags: ['child safety app development', 'parental control software', 'AI safety product', 'app development UK', 'GDPR under-18s'],
    content: `
The brief came with genuine emotional weight. A parent, watching their child navigate an increasingly complex digital world, wanted a tool that gave meaningful oversight without crossing into surveillance.

That's a harder design problem than it sounds. The line between "parental awareness" and "invasive monitoring" is fine, and the wrong side of it produces a product that damages trust rather than building it. We had to get it right.

**The Design Challenge**

Safeguardian's core function is age-appropriate digital awareness for families. The design brief was unambiguous: transparent, not covert. Informative, not punitive. The UI needed to communicate safety — both to the parent and, critically, to the child.

The specialist approach earned its value here in a way it doesn't on simpler builds. @Priya's visual design set a tone that felt reassuring and modern rather than clinical and cold. @Luna's compliance review ensured data handling was GDPR-compliant for under-18s — a requirement with real legal weight that a generalist developer might have missed or minimised. @Sam's security audit hardened the auth layer before any user got near it.

**The Build**

Seven days from brief to live app. The functionality: monitoring and alert configuration for parents, a companion view for children maintaining transparency about what was tracked, and a family dashboard with actionable insights rather than raw data feeds.

The compliance review and security audit ran in parallel with the build, not after it. By the time features were complete, the gates had already cleared.

**What We Got Wrong**

The first version of the alert system was too aggressive — flagging activity at a granularity that felt surveillance-adjacent even to the parent who commissioned it. The parent caught this in their review. We revised before launch.

That revision is worth noting because it illustrates something about quality gates: @vigil's truth-lock and @sam's security audit check for technical correctness. They don't replace the client's eye for whether the product achieves its human intent. The two layers — automated quality gates and client review — work together, not instead of each other.

**The Result**

Safeguardian launched in July 2025. The model works. The lesson: projects carrying emotional weight require more care in the design phase, not less.
    `.trim(),
  },

  {
    slug: 'longleat-facilities-hub-haccp-compliance',
    title: 'Longleat Facilities Hub: HACCP Compliance Digitised for a Major UK Attraction',
    excerpt:
      'One of the UK\'s most iconic visitor attractions was managing critical safety compliance on paper and spreadsheets. We built a digital hub that made the facilities team actually want to use it.',
    date: '2025-10-25',
    category: 'Case Study',
    readTime: 4,
    tags: ['facilities management software UK', 'HACCP compliance software', 'food safety digital', 'enterprise software UK', 'visitor attraction technology'],
    content: `
HACCP compliance — Hazard Analysis Critical Control Points — is the backbone of food safety management in any venue serving the public. For a facility operating at Longleat's scale and complexity, managing that compliance on paper isn't just inefficient. It's a risk.

The brief: build a digital hub making HACCP logging fast, accurate, and auditable. Something the facilities team would actually use because it made their jobs easier.

**Build for the User, Not the Auditor**

The trap with compliance software is designing for the person who reviews the records, not the person who creates them. The result is always form-heavy, joyless, and gets minimum-viable engagement — staff do the minimum to satisfy the audit and no more.

We built for the person standing in a kitchen at 7am who needs to complete a temperature log in 30 seconds. The audit trail was real but invisible in daily use. The management reporting layer was powerful but only visible to those who needed it.

**What Was Delivered**

Digital HACCP logging with timestamped, user-attributed records. Automated alert flags for out-of-range readings. A management dashboard with compliance status at a glance. Export functionality for external audit submissions. User management across multiple operational areas.

The mobile-first design was tested against the actual hardware the facilities team used — not a smartphone on a desk, but a tablet in a working kitchen environment.

**The Adoption Question**

Every enterprise software project lives or dies on adoption. Features that exist but aren't used aren't features. The facilities team was trained and using the system within a week of delivery. Paper logs were retired.

The measure of success for a compliance tool isn't whether it satisfies an audit. It's whether the people who have to use it every day find it genuinely easier than the alternative. We got that right.
    `.trim(),
  },

  {
    slug: 'la-aesthetician-luxury-beauty-brand-website',
    title: 'La Aesthetician: When a Premium Clinic Has a Website That Doesn\'t Match',
    excerpt:
      'Five-star treatments. A digital presence that undersold all of them. New brand identity, premium website, booking flow — 48 hours. Here\'s the honest build log.',
    date: '2025-12-29',
    category: 'Case Study',
    readTime: 4,
    tags: ['aesthetics clinic website UK', 'luxury beauty website', 'beauty brand design', '48 hour website development', 'small business AI development'],
    content: `
La Aesthetician delivers premium cosmetic treatments. The treatments were exceptional. The website was not.

A dated design, slow load times, no clear booking flow, and visual branding that actively undersold the quality of service. In the aesthetics industry, the website is the first impression for most new clients — and first impressions in a premium sector carry disproportionate weight.

**The Brief**

Visual brand elevation: typography, colour palette, and photography treatment that communicate luxury, professionalism, and clinical precision. A booking enquiry flow capturing leads without friction. Individual service pages with conversion-focused copy. Local SEO implementation to capture the clinic's geographic market.

**The Build**

New visual identity system designed and approved before the first component was coded. That sequencing matters: no design-to-development friction in the final stages, no "actually, can we change the colours" when the system is already built.

@Priya led the visual design. @Elena wrote the service page copy and microcopy — specificity that communicates expertise, without the clinical jargon that creates distance. @Grace implemented the local SEO and schema markup. @Sam ran the security review on the booking form, which captures personal health-adjacent information and requires proper handling.

**What We Didn't Get Perfect**

The initial mobile layout for the hero section had a contrast issue on older Android screens — the text was technically accessible but harder to read than it should have been. Caught in @Milo's mobile QA pass, revised before delivery.

These are the kinds of catches that don't make it into polished case studies but should. Every build has them. The gates exist to catch them before the client does.

**The Result**

La Aesthetician launched the last week of December 2025. The site does justice to the service. The conversion path is clear. The brand is elevated.

48 hours. That's the model.
    `.trim(),
  },

  {
    slug: 'insydetradar-autonomous-trading-infrastructure',
    title: 'Insydetradar: Building Autonomous Financial Trading Infrastructure',
    excerpt:
      'Algorithmic trading that monitors markets, executes on pre-defined conditions, and manages risk without constant human intervention. The most technically demanding build we\'d done.',
    date: '2026-01-28',
    category: 'Case Study',
    readTime: 5,
    tags: ['algorithmic trading software UK', 'fintech development', 'autonomous trading system', 'trading infrastructure', 'financial technology AI'],
    content: `
Insydetradar was a different class of brief. Not a website or a CRM — autonomous financial trading infrastructure. Systems that monitor market conditions, execute trades on pre-defined strategies, manage position sizing, and handle risk parameters without a human watching every decision.

The technical complexity was significant. The stakes were higher than anything else in the portfolio. We built it anyway.

**The Challenge**

Algorithmic trading systems have three distinct layers requiring specialist expertise: the data layer (market feeds, real-time price ingestion, historical data storage), the logic layer (strategy execution, signal processing, risk management rules), and the interface layer (monitoring dashboards, manual override controls, performance reporting).

In a traditional development approach, these concerns bleed together and the architecture reflects the trade-offs that follow. Specialist separation meant each layer got proper attention — the data pipeline designed for reliability and speed, the logic layer reviewed for edge cases and failure modes, the interface built for the speed-critical use case of a trader who needs to see and act immediately.

**Security and Reliability**

Trading infrastructure has zero tolerance for bugs. A logic error in a standard web app produces a bad user experience. The same error in a trading system produces real financial losses.

The security review and the code audit were not optional additions to this build — they were the most critical phases. Every execution path, every edge case, and every failure mode was mapped before the system went live. This is one of those builds where the quality gates aren't overhead; they're the product.

**One Limitation to Name**

This is a financial trading system. We built the infrastructure. We did not provide any financial advice, strategy validation, or market analysis — those are outside our scope and would be irresponsible to include. The system executes the strategies the client defines. The responsibility for those strategies sits with the client.

That boundary matters, and we named it explicitly in the brief. Good software work includes knowing where your scope ends.

**The Result**

Insydetradar launched as functional autonomous trading infrastructure. The hardest projects benefit most from separation of concerns. When the stakes are highest, you want specialists who each own their domain completely — not generalists making trade-offs across all of them.
    `.trim(),
  },

  {
    slug: 'chatterbox-ai-voice-cloning-app',
    title: 'Chatterbox: AI Voice Cloning and TTS — From Concept to Launch',
    excerpt:
      'The brief: a consumer-grade voice cloning and infinite text-to-speech application. Clean, accessible, responsibly built. The timeline: 72 hours.',
    date: '2026-01-28',
    category: 'Case Study',
    readTime: 4,
    tags: ['AI voice cloning app', 'text to speech platform', 'AI app development UK', 'voice AI product', 'consumer AI application'],
    content: `
Voice AI is having its moment. The technology for cloning voice profiles and generating high-quality speech from text is maturing rapidly — but most implementations are either deeply technical API playgrounds for developers, or locked inside enterprise platforms with enterprise pricing. The consumer gap was clear.

Chatterbox's brief: a clean, accessible application where users could clone voice profiles and generate unlimited speech content. Consumer-grade UX. Production-grade reliability.

**The Technical Challenge**

Voice AI applications are infrastructure-heavy. High-quality TTS generation is computationally expensive, storage requirements scale quickly, and audio output quality is unforgiving — artifacts and latency that a user might tolerate in a demo become deal-killers in a consumer product.

Architecture decisions — which voice AI APIs to integrate, how to handle audio storage and delivery, how to manage generation queue and user limits — were made before the build started. The first day was building, not deciding.

**The Responsibility Question**

Voice cloning applications have a trust problem that has nothing to do with the technology and everything to do with how the technology is framed. The onboarding flow, consent documentation, and usage guidelines were as important as the feature set.

@Luna reviewed the compliance requirements. @Elena wrote the onboarding copy — clear about what the technology does and doesn't do, without the legalese that users skip. @Vigil reviewed every user-facing claim before publication. The application communicates its capabilities and limitations explicitly. That's both the ethical requirement and the thing that builds user trust long-term.

**What We'd Do Differently**

The generation queue management under high load needed more design time than we gave it in the initial build. A queue that works at 10 concurrent users behaves differently at 1,000. We shipped a solution that worked for the initial launch scale with a documented limitation noted for the next iteration.

Honest delivery means telling clients what the current version does and what the next version needs to solve. We did that.

**72 Hours**

Concept to live application. Chatterbox launched in January 2026.
    `.trim(),
  },

  {
    slug: 'construct-fm-estimate-generator',
    title: 'Construct.fm: The Estimate Generator That Changed the Sales Process',
    excerpt:
      'Construction firms spending hours on manual estimates, losing jobs because quotes took too long. We built an AI-powered estimate generator that shipped in 48 hours and changed their close rate.',
    date: '2026-02-17',
    category: 'Case Study',
    readTime: 4,
    tags: ['construction estimate software UK', 'AI estimate generator', 'contractor software', 'construction SaaS', 'AI business tools UK'],
    content: `
The construction industry runs on estimates. A contractor wins or loses projects based on how accurately and quickly they can quote a job. Manual estimation is slow, inconsistent, and expensive — every senior estimator's time is valuable, and hours spent on quotes that don't convert is a problem the industry accepts because it doesn't see an alternative.

**The Problem**

Construction estimates have genuine complexity: material costs, labour rates, project-specific variables, margin calculations, regional pricing differences, and client-facing presentation that needs to look professional. A good estimator holds all of this in their head and produces a quote that wins work. The constraint isn't the estimator's capability — it's the time it takes.

**What We Built**

The Construct.fm estimate generator takes project parameters — scope, materials, location, timeline — and produces a professional, accurate estimate in minutes rather than hours. The output is a formatted document ready to send directly to a client, with line-item breakdowns demonstrating thought and professionalism.

The AI layer handles pattern-matching: what does a project of this type, scale, and location typically cost? The estimator validates and adjusts. The output layer presents in a format that wins business.

The tool also outputs to Excel for firms that need estimates to integrate with existing reporting workflows. This was a specific request that took half a day to implement properly — getting the Excel formatting right is unglamorous work that matters.

**Honest Delivery**

This was the first tool we delivered as a formal demonstration of the Orchestra model to a paying client. That meant the pressure to show what the system could do was real.

The estimate generator launched in February 2026. Quote turnaround dropped from days to under an hour. The professional presentation increased client confidence in the figures. The feedback was direct: it made the sales process faster.

That's the ROI of AI-assisted specialist development. Not replacing the estimator — giving them a system that does the pattern-matching so they can focus on winning the job.
    `.trim(),
  },

];

export const blogPosts: BlogPost[] = rawBlogPosts.filter(
  (post) => !RETIRED_POST_SLUGS.has(post.slug)
);

export const timeline: TimelineEvent[] = [
  {
    date: '2025-01-15',
    phase: 'Genesis',
    title: 'First AI Tool Ships',
    description:
      'JonnyAI builds its first AI-powered product: a price calculation tool for potential clients. An app that inputs project data and returns an AI-generated cost forecast. Proof of concept for AI-assisted business tools.',
    metric: 'v0.1',
  },
  {
    date: '2025-03-12',
    phase: 'Genesis',
    title: 'First Marketplace Build',
    description:
      'Poundtrades v1 launches — a marketplace concept for leftover building materials. v2 ships two weeks later with maps, payments, and seller profiles. First multi-version rapid iteration cycle.',
    metric: 'v1 → v2 / 14d',
  },
  {
    date: '2025-05-02',
    phase: 'Build Phase',
    title: 'KLIQT CRM — Custom Ops Platform',
    description:
      'KLIQT Media gets a fully bespoke CRM and operations platform. Client management, project tracking, billing, brand asset library. First enterprise-grade internal tool in the portfolio.',
    metric: '5-day delivery',
  },
  {
    date: '2025-05-10',
    phase: 'Build Phase',
    title: 'Agent Stack Experiments Begin',
    description:
      'First formal experiments with a dedicated AI agent stack running alongside the KLIQT CRM. The multi-agent concept starts taking shape. This is the intellectual origin of the Orchestra.',
    metric: 'Agent Stack v0',
  },
  {
    date: '2025-06-14',
    phase: 'Build Phase',
    title: 'Client Month: 5 Sites in 30 Days',
    description:
      'BL Motorcycles, Sparta Interiors, DJ Waste, KLIQT Media website, and supporting branding all delivered in a single month. First proof that the parallel delivery model works at scale.',
    metric: '5 projects / 30d',
  },
  {
    date: '2025-07-07',
    phase: 'Build Phase',
    title: 'Safeguardian: First Safety App',
    description:
      'Safeguardian launches — a child digital safety application built in seven days. First project requiring compliance review, security hardening, and family-facing UX at launch.',
    metric: '7-day launch',
  },
  {
    date: '2025-10-25',
    phase: 'Scale Phase',
    title: 'Longleat Facilities Hub',
    description:
      'HACCP compliance digitised for a major UK visitor attraction. Enterprise-scale facilities management software. First project at institutional scale.',
    metric: 'Enterprise',
  },
  {
    date: '2025-12-29',
    phase: 'Scale Phase',
    title: 'La Aesthetician Goes Live',
    description:
      'Luxury aesthetics clinic launches with a new brand identity, premium website, and booking flow in 48 hours. The 48-hour model now repeatable and consistent across all project types.',
    metric: '48h confirmed',
  },
  {
    date: '2026-01-13',
    phase: 'Scale Phase',
    title: 'January Sprint: 6 Projects',
    description:
      'Village Bakery, JSC Contractors, Dudley Motors, MarineFlex, and two supporting builds delivered in January. 48-hour turnaround is now the standard, not the exception.',
    metric: '6 projects / 4w',
  },
  {
    date: '2026-01-28',
    phase: 'Scale Phase',
    title: 'Insydetradar + Chatterbox',
    description:
      'Two complex product builds ship the same week: Insydetradar (autonomous trading infrastructure) and Chatterbox (AI voice cloning platform). Portfolio expands into fintech and consumer AI.',
    metric: '2 products / 72h',
  },
  {
    date: '2026-01-31',
    phase: 'Jai.OS Active',
    title: 'Antigravity Orchestra Created',
    description:
      'The formal architecture of the Orchestra ecosystem is committed to version control. SKILL.md, Shared Brain, boardroom protocols. The system that had been evolving informally gets its permanent structure.',
    metric: 'Orchestra v1',
  },
  {
    date: '2026-02-01',
    phase: 'Jai.OS Active',
    title: 'AgOS 2.0 Launches',
    description:
      'The first iteration of the Antigravity agency platform goes live. Initial focus: small business AI integration, lead intake, and core brand identity.',
    metric: 'AgOS 2.0',
  },
  {
    date: '2026-02-17',
    phase: 'Jai.OS Active',
    title: 'Construct.fm Estimate Generator',
    description:
      'First client tool delivered as a formal Orchestra demonstration. AI estimate generator, invoice generation, Excel export — full toolchain in 48 hours.',
    metric: '48h delivery',
  },
  {
    date: '2026-02-19',
    phase: 'Jai.OS Active',
    title: 'Jai.OS 4.0 Foundation',
    description:
      'The operating system layer is formalised. Standardised Orchestra architecture, governing directives, and Shared Brain sync established. The inflection point.',
    metric: 'Jai.OS 4.0',
  },
  {
    date: '2026-02-20',
    phase: 'Jai.OS Active',
    title: 'AgentFlip — Phase 1 Live',
    description:
      'AgentFlip launches Phase 1: autonomous keyword arbitrage engine. Dashboard live, Scavenger Engine detecting first opportunities, brand identity locked. First fully self-directed product build using the Orchestra.',
    metric: 'Phase 1 complete',
  },
  {
    date: '2026-02-21',
    phase: 'Jai.OS Active',
    title: 'AI Product Engine — Glass Box Live',
    description:
      'jonnyai.website v4 launches with the Glass Box concept. Real-time project dashboards, Stripe payments, magic link auth. The commercial product is live.',
    metric: 'Glass Box v1',
  },
  {
    date: '2026-02-22',
    phase: 'Jai.OS Active',
    title: '57-Agent Orchestra — Full Compliance',
    description:
      '57 specialists hit Jai.OS 4.0 compliance simultaneously. Governing directives injected, SKILL.md gold standard achieved, Shared Brain wired via jonnyai-mcp.',
    metric: '57/57 validated',
  },
  {
    date: '2026-02-23',
    phase: 'Jai.OS Active',
    title: '65-Agent Orchestra — Production Ready',
    description:
      '65 specialists fully deployed: 135 catalogued skills, automated training day protocol, full sync pipeline, @delegator routing layer, @validator artifact gate. The Orchestra is complete.',
    metric: '65 specialists',
  },
];

export const newsItems = [
  '🆕 Empire OS LIVE — AI-operated business portfolio service — apply now',
  'NEW: 67 specialist agents — Jai.OS 4.0 fully operational',
  '@delegator online — complex missions now auto-routed across the Orchestra',
  '135 skills catalogued — every domain covered, every SOP documented',
  'Gold Standard: autonomous AI audit agency — £149/audit, zero human intervention',
  'AgentFlip Phase 1 live — autonomous keyword arbitrage engine in production',
  'Shared Brain: ONLINE — 65 agents queryable in real-time',
  'Glass Box dashboard live — watch your build happen in real time',
  '48-hour delivery confirmed — scope to shipped, no exceptions',
  'Week in AI: every Monday — latest intelligence from across the AI landscape',
  'Case studies live — 12 months of real builds, real results, honest accounts',
];
