// Portfolio Case Studies — Structured Data
// Used by /portfolio pages

export interface CaseStudy {
  slug: string;
  title: string;
  subtitle?: string;
  client: string;
  category: string;
  hook: string;
  heroImage: string;
  featured: boolean;
  metrics: { label: string; value: string }[];
  techStack: string[];
  sections: {
    id: string;
    title: string;
    content: string;
  }[];
  screenshots: string[];
}

export const caseStudies: CaseStudy[] = [
  // ═══════════════════════════════════════════════════════════════
  // 0. Little Joe's Tree Services — Flagship Studio Build
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "little-joes-tree-services",
    title: "Little Joe's Tree Services",
    subtitle: "A full studio build for a Hampshire tree surgeon — rebrand, website, on-site content day, and a comprehensive Google Ads campaign, end to end.",
    client: "Little Joe's Tree Services — Hampshire",
    category: "Branding · Web · Content · Local Business",
    hook: "A skilled, NPTC-qualified tree team that was brilliant on the tools but invisible online — living off word-of-mouth and review-site leads. We gave them the works: a new logo and brand identity, a fast lead-generation website covering 25+ Hampshire towns, and a content day on site filming the crew in the trees, cut into vertical reels and published to the site and socials, and a comprehensive Google Ads campaign hitting the hottest postcodes in Hampshire. This is the whole studio offering in one job.",
    heroImage: "/portfolio/littlejoes/site-home.jpg",
    featured: true,
    metrics: [
      { label: "Areas Covered", value: "25+" },
      { label: "Reviews Surfaced", value: "100+" },
      { label: "Emergency Cover", value: "24/7" },
      { label: "Scope", value: "Brand · Web · Film · Ads" },
      { label: "Paid Search", value: "25+ towns" },
    ],
    techStack: ["Brand Identity", "Logo Design", "Next.js", "Local SEO", "Google Ads / PPC", "Conversion Tracking", "Reels / Video", "On-site Filming", "Social Publishing"],
    sections: [
      {
        id: "the-brief",
        title: "The Brief — Great at the Work, Invisible Online",
        content: `Little Joe's Tree Services is a Hampshire tree surgery and garden clearance team. NPTC and City & Guilds qualified, fully insured, and genuinely good at the work — pruning, reductions, removals, stump grinding, hedge cutting, site & garden clearance, fencing, and 24/7 emergency call-outs across Portsmouth, Havant, Fareham, Southampton, Winchester and 20+ more towns.

The problem wasn't the work. It was that nobody could find them. Their presence was a patchwork of word-of-mouth, a Facebook page and review-site listings (Bark, Google). No real brand. No website doing any selling. No content showing what they actually do. For a trade where homeowners and landlords judge you in the first five seconds, that's money walking out the door.

The brief was simple: make Little Joe's look like the most serious, trustworthy tree team in Hampshire — and build the machine that turns local searches into booked jobs.`,
      },
      {
        id: "the-rebrand",
        title: "The Rebrand — A Proper Identity",
        content: `We started with the brand, because everything else hangs off it.

**Logo & mark.** Out went the plain, generic wordmark. In came a clean, confident identity — a stylised tree mark paired with a strong, modern wordmark that reads instantly on a van, a hard hat, an invoice or a phone screen.

**Brand system.** A woodland-led palette (deep greens, natural tones), a bold display typeface for headlines and a clear, legible body face — all documented so it stays consistent everywhere it lands: website, social, quotes, signage, workwear.

**The point of it.** A homeowner deciding who to let up a 40-foot oak in their garden is buying trust. A coherent, professional brand signals "these people are organised and safe" before a single word is read. That's the job the rebrand does.`,
      },
      {
        id: "the-website",
        title: "The Website — Built to Turn Searches Into Calls",
        content: `Next, a fast, modern website engineered specifically for local lead generation — not a digital brochure.

**Structure that ranks and converts:**
- **Services** — pruning & reductions, removals, stump grinding, hedge cutting, site & garden clearance, fencing, and 24/7 emergency work, each clearly explained.
- **Areas** — dedicated coverage for 25+ Hampshire towns, so the site shows up for "tree surgeon near me" across the whole patch.
- **Reviews** — 100+ customer reviews surfaced front and centre to build instant trust.
- **About, FAQ & Credentials** — NPTC / City & Guilds qualifications and full insurance made obvious, answering the questions that win the job.
- **Contact & free quote** — friction-free quote requests and a tap-to-call 24/7 emergency line on every page.

**Engineered properly.** Built on Next.js for speed, with local SEO and schema baked in, mobile-first (most tree-work searches happen on a phone, often urgently), and tuned so the path from Google to "Get a free quote" is as short as possible.`,
      },
      {
        id: "content-and-reels",
        title: "Content & Reels — We Came On Site and Filmed It",
        content: `This is the part most agencies simply don't do — and it's the difference between a website that sits there and a brand that grows.

We booked a content day and went out with the crew. We filmed the real thing: climbers up in the canopy, controlled rigging and dismantles, the chipper running, big tidy-ups, the satisfying before-and-afters. Then we came back and cut it into punchy vertical reels designed for how people actually scroll.

Those reels went onto the website and out across social (Facebook / YouTube), giving Little Joe's a steady stream of genuine, high-trust content that shows competence and safety in a way no stock photo ever could. Real work, real team, real proof.

We don't just build the shop window — we make the content that fills it and keeps people coming back.`,
      },
      {
        id: "google-ads",
        title: "Google Ads — A Comprehensive Campaign Across Every Hot Postcode",
        content: `A great website only pays off if the right people see it at the right moment. So we built Little Joe's a full Google Ads campaign engineered to catch homeowners and landlords at the exact second they search for a tree surgeon — and to own the busiest, highest-value postcodes in the patch.

**The goal.** Be top of the page for "tree surgeon near me" across all 25+ towns, turn that click into a phone call or quote request, and make every pound of budget traceable to a real lead.

**The hottest locations we target.** We don't spray budget thinly across the whole county. We concentrate it where the demand and the property values are highest:
- **Portsmouth, Southsea & Havant** — dense housing, constant demand, the core patch.
- **Fareham, Gosport & Portchester** — strong residential mix, high search volume.
- **Winchester, Bishop's Waltham & the villages** — premium properties, big mature trees, higher job values.
- **Southampton, Eastleigh & Hedge End** — high population, steady stream of removals and reductions.
- **Petersfield, Waterlooville & Horndean** — leafy commuter towns where gardens (and oaks) are big.

**How the campaign is built.** It's structured so the right ad shows for the right job, every time:
- **Search campaigns by service** — separate ad groups for tree removal, crown reduction & pruning, stump grinding, hedge cutting, and site clearance, so the ad and landing page always match what was typed.
- **A dedicated 24/7 emergency campaign** — call-only ads that trigger for "emergency tree removal" and storm-damage searches and ring the mobile straight away, with bids pushed hard when the weather turns.
- **Location bid adjustments** — more budget weighted to the premium postcodes above, where a single job is worth far more.
- **Tight negative keywords** — filtering out "tree surgeon jobs", "courses", "free" and DIY searches so budget only goes on people who'll actually pay.
- **Ad extensions that win the click** — call buttons, location, 100+ reviews, service links and "free quote" callouts, so Little Joe's takes up more of the page than any competitor.

**Wired to the website and tracked properly.** Every ad points to the matching service or area page on the new site, and every call and quote form is tracked as a conversion in Google Ads and GA4. That means we can see which towns, which services and which keywords actually produce booked work — and shift budget toward the winners every week.

**The point of it.** Branding makes them trusted, the website makes them findable, the reels make them credible — and Google Ads puts them in front of the customer at the precise moment of need. It turns "we exist" into "the phone rings."`,
      },
      {
        id: "the-result",
        title: "The Result — One Brand, One Machine",
        content: `Little Joe's went from a scattered, word-of-mouth operation to a single, coherent brand with a proper engine behind it:

- A distinctive logo and identity applied consistently across every touchpoint.
- A fast, local-SEO-tuned website covering 25+ Hampshire towns, built to convert searches into quote requests and 24/7 emergency calls.
- A library of real on-site reels powering the site and social channels.
- A comprehensive Google Ads campaign targeting the hottest postcodes, with every call and quote tracked back to the keyword that produced it.

It's the clearest example of what the studio does: **we brand it, build it, film it and automate it** — the whole job, one team, no hand-offs.

Performance numbers — rankings, calls and bookings — are reported back monthly, so budget keeps shifting toward whatever's winning.`,
      },
      {
        id: "want-the-same",
        title: "Want the Same for Your Business?",
        content: `If you run a real-world business — a trade, a service, a local operation — and you're great at the work but losing jobs to better-looking competitors, this is exactly what we do.

Brand, website, content and automation, done end to end by one studio. Tell us what you do and we'll come back with a clear, fixed-price plan.

Contact: hello@jonnyai.co.uk`,
      },
    ],
    screenshots: [
      "/portfolio/littlejoes/site-home.jpg",
      "/portfolio/littlejoes/logo-new.png",
      "/portfolio/littlejoes/tree-surgery.jpg",
      "/portfolio/littlejoes/stump-removal.jpg",
      "/portfolio/littlejoes/hedge-cutting.jpg",
      "/portfolio/littlejoes/reel-thumb.jpg",
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 1. Compliance Hub — Statutory FM operating system
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "compliance-hub",
    title: "Compliance Hub",
    subtitle: "Statutory compliance operating system for UK facilities management",
    client: "JonnyAI · SaaS Product",
    category: "Multi-Tenant SaaS Platform",
    hook: "Most \"compliance\" tools are rebranded to-do lists. This one is built around the actual obligations a UK facilities manager has under HSWA 1974 and its descendants — RAG as first-class data, delegation as a workflow, audit as automatic.",
    heroImage: "/portfolio/compliance-hub-hero.png",
    featured: true,
    metrics: [
      { label: "Compliance regimes", value: "11" },
      { label: "Tables", value: "19" },
      { label: "Security advisor lints", value: "0" },
      { label: "Doc kinds", value: "14" },
      { label: "Stack", value: "Next 15 + Supabase" },
    ],
    techStack: ["Next.js 15", "React 19", "TypeScript 5.7 strict", "Supabase Postgres 17", "Row-Level Security", "Server Actions", "Zod", "Tailwind 3.4", "pg_cron", "Edge Functions", "Resend", "PM2", "nginx", "GCP VM"],
    sections: [
      {
        id: "the-problem",
        title: "The Problem",
        content: `UK facilities managers carry a stack of statutory obligations — LOLER, PUWER, RIDDOR, RAMS, Fire Safety, Legionella L8, CDM 2015, EICR, Gas Safety, H&S, Asbestos — and most of them get tracked in a spreadsheet that's missing the actor, the timestamp, the before/after, and the evidence chain. When the HSE walks in and asks "show me that the LOLER thorough examination was scheduled, completed by a competent person, defects were closed, and the equipment wasn't operated in the meantime" — a spreadsheet is a guess. The brief was to replace the spreadsheet with a defensible system of record.`,
      },
      {
        id: "architecture",
        title: "The Architecture — RLS-First, Workflow-Native",
        content: `Next.js 15 App Router with React 19 Server Components, all mutations through Zod-validated Server Actions. Supabase Postgres 17 with row-level security on every exposed table. Six architectural principles drive the codebase:

1. RLS is non-negotiable. Default-deny everywhere. Every policy is org+site scoped. Contractors are explicitly walled off to records assigned to them.
2. RAG is first-class data, not a UI badge. Every operational row stores rag_status, rag_auto_status (BEFORE-trigger computed), rag_override_status, rag_override_reason — with a DB CHECK that makes a manual override illegal without a reason.
3. Delegation is a workflow, not a field. Owner, assignee, delegated-by, delegated-to, escalation-user, acceptance, accepted-at, declined-at, decline-reason, escalation-due-at, escalated-at, completed-at, closed-by — real columns, real workflows on both actions and inspections.
4. Audit is automatic. A SECURITY DEFINER trigger writes every insert/update/delete on every operational table into activity_log, stamped with auth.uid() and both previous and new values.
5. Storage is private-first. Three private buckets with path-scoped RLS. Documents accessed via signed URLs only.
6. One time-tracking primitive. A single time_logs table covers clock-on/off against actions and inspections via XOR check constraint.`,
      },
      {
        id: "schema",
        title: "The Data Model",
        content: `19 tables across five domains:

Identity & structure — organizations · profiles · sites · site_memberships · dutyholder_assignments

Operational — assets · compliance_registers · inspections · inspection_findings · actions · incidents · contractors · contractor_site_links · contractor_documents · documents (polymorphic)

Time tracking — time_logs with XOR check (action_id XOR inspection_id) + active_time_logs view

Collaboration & audit — comments (threaded, with mentions uuid[]) · notifications (per-user inbox) · activity_log (every operational write with previous_values + new_values JSONB)

Every operational table carries: organization_id, site_id, title, status, rag_status, rag_auto_status, rag_override_status, rag_override_reason, due_date, owner_user_id, assigned_to_user_id, created_by, created_at, updated_at, archived_at.`,
      },
      {
        id: "outcome",
        title: "The Outcome",
        content: `Live at compliance-hub.co.uk on a GCP VM (PM2 + nginx + Let's Encrypt). 11 statutory compliance regimes covered. 19 tables. 14 document kinds. Photo evidence on incidents and comments. @mentions with notifications. Calendar with cadence projections forecasting up to 24 occurrences forward. Mobile-first responsive design with off-canvas drawer, native camera input for photo capture, swipe-scrollable tables. PDF export of inspection records for handing to HSE. PWA install. Dark mode.

Now productised as a SaaS: £99/mo Starter, £299/mo Pro, £999/mo + £1,500 setup white-label.`,
      },
    ],
    screenshots: ["/portfolio/compliance-hub.png"],
  },

  // ═══════════════════════════════════════════════════════════════
  // 2. Care Hub — Resident-centred care home OS
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "care-hub",
    title: "Care Hub",
    subtitle: "A resident-centred operating system for UK CQC-regulated care homes",
    client: "JonnyAI · SaaS Product (Manor House live)",
    category: "Multi-Tenant SaaS Platform",
    hook: "Care home compliance isn't 11 frameworks — it's 21 entities, 17 migrations, eMAR with dual-sign controlled drugs, NEWS2 auto-escalation, CQC KLOE evidence on every action, and HACCP/Legionella/COSHH/Fire on top. Built to the same RLS-first standard as Compliance Hub, tailored for CQC.",
    heroImage: "/portfolio/care-hub-hero.png",
    featured: true,
    metrics: [
      { label: "Tables", value: "62" },
      { label: "Migrations", value: "17" },
      { label: "Demo seed rows", value: "5,000+" },
      { label: "Roles", value: "8" },
      { label: "Security advisor lints", value: "0" },
    ],
    techStack: ["Next.js 15", "React 19", "TypeScript 5.7 strict", "Supabase Postgres 17", "Row-Level Security", "Server Actions", "Zod", "Tailwind 3", "BEFORE triggers (RAG)", "Storage policies", "PM2", "nginx", "GCP VM"],
    sections: [
      {
        id: "the-brief",
        title: "The Brief",
        content: `A UK CQC-regulated residential and nursing home running on paper MAR charts, paper handover, paper everything — needing to digitise care plans, medications, incidents, safeguarding, training, audits, meals & nutrition, activities, rota, and CQC KLOE evidence into one system. Built to the same architecture standard as Compliance Hub, with the same RLS-first, RAG-as-data, audit-by-default principles, but tailored for the regulatory regime that actually matters to a care home: CQC Key Lines of Enquiry across Safe, Effective, Caring, Responsive, and Well-led.`,
      },
      {
        id: "emar",
        title: "eMAR with Controlled Drugs",
        content: `mar_entries is the digital Medication Administration Record. Each entry stores resident_id, medication_id, administered_at, administered_by, dose, route, witness_id (NULL for non-CD), reason_not_given. RAG triggers compute the medication's status per resident — green if administered on time, amber if approaching window close, red if missed.

For controlled drugs, the dual-signature requirement is enforced at the database level:

CHECK (witness_id IS NOT NULL AND witness_id <> signed_by)

You cannot insert a controlled_drugs_register entry where the witness is the same as the signer, and you cannot insert one without a witness at all. Application logic can be wrong; the database constraint cannot.`,
      },
      {
        id: "news2",
        title: "NEWS2 Vitals With Auto-Escalation",
        content: `news2_observations stores RR, SpO2, scale, temp, BP, HR, consciousness. A SQL function computes the NEWS2 aggregate score per row. RAG status is derived: 0-4 = green, 5-6 (or any single param = 3) = amber, ≥7 = red. The dashboard surfaces every red NEWS2 observation in the last 24h as "residents needing attention" — the floor manager sees the deterioration before they walk into the room.`,
      },
      {
        id: "demo-data",
        title: "Real Demo Data — Manor House",
        content: `27 residents · 4,295 temperature logs · 155 supplier deliveries · 206 cleaning schedule rows · 246 menu plans · 60 medications · 142 MAR entries · 60 daily logs · 40 NEWS2 observations · 5 staff · 25 shifts · 3 controlled drug entries · 5 KLOE evidence tags · plus advance care plans, best-interests decisions, ABC charts, COSHH assessments, water outlet temp checks, fire drill records, supervision logs, appraisals.

A prospective buyer logs in and sees a working care home, not a clean slate.`,
      },
      {
        id: "outcome",
        title: "The Outcome",
        content: `Live at care-hub.app on a GCP VM. Demo: demo@jonnyai.co.uk / Demo2026!! Strict CI: tsc --noEmit, next lint, next build — all hard gates. 22 application pages from /residents through /coshh to /reports/kloe. Mobile responsive. Sage primary #4A7C59 · warm gold #D4A574 · cream surface #FAF8F4 · forest text #2C3E2D — calm clinical palette, dark mode supported.

Sold as a SaaS: £99/mo Starter (1 home, up to 5 staff users), £299/mo Pro (up to 5 homes, 25 users), £999/mo + £1,500 setup white-label for groups that need their own brand.`,
      },
    ],
    screenshots: ["/portfolio/care-hub.png"],
  },

  // ═══════════════════════════════════════════════════════════════
  // 3. FM Control Hub — Tailored estate compliance OS
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "fm-control-hub",
    title: "FM Control Hub",
    subtitle: "Tailored facilities management OS for complex multi-territory estates",
    client: "Modelled on Longleat-class estates",
    category: "Multi-Tenant SaaS Platform",
    hook: "Compliance Hub's engine, productised for the kind of estate that owns a stately home, a safari park, a workshop fleet and a heritage attraction in the same postcode — with a contractor portal bolted on so the supply chain works inside the audit trail, not around it.",
    heroImage: "/portfolio/fm-control-hub-hero.png",
    featured: true,
    metrics: [
      { label: "Compliance regimes", value: "11" },
      { label: "Contractor portal", value: "Yes" },
      { label: "Sites supported", value: "Multi-territory" },
      { label: "Auto-recurring inspections", value: "Yes" },
      { label: "Stack", value: "Next 15 + Supabase" },
    ],
    techStack: ["Next.js 15", "React 19", "TypeScript 5.7 strict", "Supabase Postgres 17", "Row-Level Security", "Server Actions", "Zod", "Tailwind 3.4", "pg_cron", "Edge Functions", "Resend", "Vercel", "GCP VM (mirror)"],
    sections: [
      {
        id: "the-brief",
        title: "The Brief",
        content: `A multi-territory estate where one operations team manages a stately home, a safari park, workshops, and heritage attractions — each with its own statutory regime, its own contractors, its own escalation paths. Compliance Hub solved the core problem. FM Control Hub is the tailored fork: same engine, plus a Contractor Portal so external supply-chain partners (lift engineers, water hygienists, electricians) work inside the audit trail rather than emailing certificates that never get filed.`,
      },
      {
        id: "contractor-portal",
        title: "The Contractor Portal",
        content: `RLS does the heavy lifting. A contractor's site_memberships record gives them role = 'contractor' on exactly one or more sites. Three policy rules cover the whole thing:

· can SELECT only inspections / actions where assigned_to_user_id = auth.uid() OR delegated_to_user_id = auth.uid()
· can UPDATE acceptance_status, accepted_at, declined_at, decline_reason, clock-on/off, completion fields
· can UPLOAD documents to /<org>/<site>/contractor-docs/<own>/ only — storage path RLS enforces it

The portal UI is a thin layer on top — it doesn't add security, just hides what the contractor was never going to be able to see anyway. That's how RLS-first works: the security model is the data model.`,
      },
      {
        id: "auto-recurring-inspections",
        title: "Auto-Recurring Inspections",
        content: `Migration 0008 adds a trigger: when an inspection is signed off (pass / advisory / fail), if its compliance register has a cadence_months value, the system inserts the next occurrence at performed_at + cadence_months, copies the asset and dutyholder references, and stamps the source_inspection_id so the audit chain is preserved. A weekly L8 sentinel-point check spawns 52 occurrences a year automatically — no human ever forgets to schedule the next one.`,
      },
      {
        id: "outcome",
        title: "The Outcome",
        content: `Live at fm-control-hub.co.uk. Demo: demo@jonnyai.co.uk / FMHub-Demo-2026! All 11 statutory frameworks covered. Contractor portal active. Auto-recurring inspections firing. Realtime widgets debounced and scopable by site. Email out on notifications via Resend. PDF export of inspection records for HSE handover. PWA install. Dark mode. Premium UI tier suitable for enterprise estate ops.

Sold as a tier above Compliance Hub: £299/mo Pro entry, £999/mo + £1,500 setup white-label for estates that need their own brand on their own domain.`,
      },
    ],
    screenshots: ["/portfolio/fm-control-hub.png"],
  },

  // ═══════════════════════════════════════════════════════════════
  // 4. BL Motorcycles
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "bl-motorcycles",
    title: "BL Motorcycles",
    subtitle: "Enterprise E-Commerce & Operations Platform",
    client: "Brett — B&L Motorcycles Ltd",
    category: "E-Commerce & Automation",
    hook: "A family motorcycle shop that needed to compete with national online retailers — automated from catalogue to dispatch.",
    heroImage: "/portfolio/bl-hero.png",
    featured: true,
    metrics: [
      { label: "eBay Listings", value: "3,000+" },
      { label: "Products", value: "11,900+" },
      { label: "Automations", value: "4" },
      { label: "Build Phases", value: "4" },
    ],
    techStack: ["Next.js 15", "React 19", "TypeScript", "Supabase", "PostgreSQL", "Stripe", "n8n", "Python", "eBay API", "Hostinger", "GA4"],
    sections: [
      {
        id: "brief",
        title: "The Brief",
        content: `Brett needed to move beyond a static web presence and manual marketplace operations. The business needed three things at once: a stronger brand presentation, a scalable commerce and operations backend, and automation to reduce repetitive listing and fulfilment overhead.

This wasn't a website project — it was a business transformation.`,
      },
      {
        id: "phase1",
        title: "Phase 1 — Brand Presence",
        content: `Custom industrial visual identity — "Kinetic Precision" — on a Vite + React + Express stack. Black and gold design language with sharp corners and chamfered UI components. Six specialist service pages, gallery sections, and social integration.`,
      },
      {
        id: "phase2",
        title: "Phase 2 — Enterprise Rebuild",
        content: `Next.js 15 App Router with TypeScript. Supabase/PostgreSQL-backed product and order data with search, pagination, and stock visibility. Stripe checkout with webhook-driven order creation. Internal admin portal with KPI-style operational reporting.`,
      },
      {
        id: "phase3",
        title: "Phase 3 — Operations & Automation",
        content: `Four core n8n automation workflows running continuously:
1. Dispatch email trigger — automatic notification when orders ship
2. Overdue order escalation — flags orders that haven't moved
3. Oversell risk alerts — catches stock discrepancies
4. Weekly operations summary — dashboard without logging in`,
      },
      {
        id: "phase4",
        title: "Phase 4 — Marketplace Automation",
        content: `Python automation for eBay and supplier sync: stock synchronisation, under-threshold listing control, AI-generated product descriptions, and pricing rules. The entire marketplace operation moved from manual effort to managed automation.`,
      },
      {
        id: "result",
        title: "The Result",
        content: `Brett now spends his time on motorcycles, not spreadsheets. 3,000+ eBay listings maintained automatically. Branded credibility competing with national retailers. Structured operations with dispatch tracking, escalation controls, and automated reporting.`,
      },
    ],
    screenshots: ["/portfolio/bl-hero.png", "/portfolio/bl-shop.png", "/portfolio/bl-services.png", "/portfolio/bl-automations.png", "/portfolio/bl-ourstory.png"],
  },

  // ═══════════════════════════════════════════════════════════════
  // 5. Sparta Coatings
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "sparta-coatings",
    title: "Sparta Coatings",
    subtitle: "Premium Spray Coating Services — UK-Wide",
    client: "Sparta Coatings",
    category: "Web Development & Lead Gen",
    hook: "22-page premium build with 16 service landing pages, sticky conversion CTAs, and full SEO — deployed static on Hostinger.",
    heroImage: "/portfolio/sparta-coatings.png",
    featured: false,
    metrics: [
      { label: "Pages", value: "22" },
      { label: "Service Pages", value: "16" },
      { label: "Deploy", value: "SSH" },
      { label: "SEO", value: "Full Schema" },
    ],
    techStack: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS v4", "Framer Motion", "Formspree", "JSON-LD Schema", "Static Export", "Hostinger", "Python deploy"],
    sections: [
      { id: "overview", title: "The Overview", content: `Sparta Coatings offers 16 distinct spray coating services. The primary revenue driver is quote form conversions — every page is engineered around that single goal.` },
      { id: "challenge", title: "The Challenge", content: `The old site failed to communicate premium, specialist positioning. 16 services each needing SEO-optimised landing pages on Hostinger shared hosting — fully static, no server runtime.` },
      { id: "solution", title: "The Solution", content: `Ground-up rebuild in Next.js 15 with static export. Dark premium design with refined gold (#C9A84C). Sticky floating CTA on every page. All 22 pages carry SEO meta, JSON-LD schema. Python SSH deploy script for zero-downtime deploys.` },
      { id: "deliverables", title: "Key Deliverables", content: `22-page static site. 16 service pages with sidebar quote form, FAQ accordion, process steps. Kolorbond approved applicator badges. One-command deploy: npm run build → ZIP → SSH → unzip → chmod.` },
    ],
    screenshots: ["/portfolio/sparta-coatings.png"],
  },

  // ═══════════════════════════════════════════════════════════════
  // 6. Marzer Pro Roofing
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "marzer-pro",
    title: "Marzer Pro Roofing",
    subtitle: "Roofing Contractor — Hampshire",
    client: "Marzer Pro Roofing",
    category: "Web Development & Lead Gen",
    hook: "Full-service roofing contractor build — domains, DNS, SSL, hosting, forms, analytics, and conversion-focused design.",
    heroImage: "/portfolio/marzer.png",
    featured: false,
    metrics: [
      { label: "Infrastructure", value: "Full Stack" },
      { label: "Hosting", value: "Hostinger" },
      { label: "Animations", value: "Framer Motion" },
      { label: "Deploy", value: "SSH Auto" },
    ],
    techStack: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "Framer Motion", "Static Export", "Hostinger", "Python deploy"],
    sections: [
      { id: "overview", title: "The Overview", content: `Hampshire-based roofing contractor. Not just a website — full infrastructure: domain registration, DNS, SSL, hosting, form routing, and analytics.` },
      { id: "build", title: "The Build", content: `Full-stack static website: Hero, TrustBar, Services, Projects gallery, Testimonials, About, Coverage map, CTA. Mobile-responsive with Framer Motion micro-animations. SVG logo integration.` },
      { id: "result", title: "The Result", content: `Complete digital foundation — domain, DNS, SSL, hosting, forms, analytics. The client got everything, not just a website they need to figure out how to host.` },
    ],
    screenshots: ["/portfolio/marzer.png", "/portfolio/marzer-logo.png"],
  },

  // ═══════════════════════════════════════════════════════════════
  // 7. Construct FM
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "construct-fm",
    title: "Construct FM",
    subtitle: "Facilities Management & Building Services",
    client: "Construct FM",
    category: "Web Development & Local SEO",
    hook: "30+ page content-heavy site with dual service trees, 8 location pages for Hampshire-wide SEO, and real project case studies.",
    heroImage: "/portfolio/construct-fm-hero.png",
    featured: false,
    metrics: [
      { label: "Pages", value: "30+" },
      { label: "Location Pages", value: "8" },
      { label: "Case Studies", value: "3" },
      { label: "Service Trees", value: "2" },
    ],
    techStack: ["CMS Website", "Local SEO", "Service Templates", "Contact Forms", "Blog CMS"],
    sections: [
      { id: "overview", title: "The Overview", content: `Portsmouth-based contractor delivering building services and facilities management across Hampshire. Multiple trade accreditations, local authority, commercial, and residential clients.` },
      { id: "challenge", title: "The Challenge", content: `Content-heavy site marketing to multiple buyer types (landlords, facilities managers, local authorities), ranking for location-specific terms across Hampshire, and building credibility through real case studies.` },
      { id: "solution", title: "The Solution", content: `30+ page content site separating building services and FM into distinct service trees. 8 location pages for local SEO. Case studies hub with Butlins, Portsmouth kitchen, and Portsmouth Academy projects.` },
      { id: "result", title: "The Result", content: `30+ unique pages. 8 area pages for Hampshire-wide SEO. Real project case studies with full detail. Dual service tree cleanly separates buyers.` },
    ],
    screenshots: ["/portfolio/construct-fm.png"],
  },

  // ═══════════════════════════════════════════════════════════════
  // 8. Primordial Stone
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "primordial-stone",
    title: "Primordial Stone",
    subtitle: "Artisan Faux Stone Craftsmen — Nationwide",
    client: "Primordial Stone",
    category: "Content Strategy & SEO",
    hook: "Complete content strategy and SEO copywriting for 8 pages and 7 service sections — zero template language, brand philosophy woven through every page.",
    heroImage: "/portfolio/primordial-hero.png",
    featured: false,
    metrics: [
      { label: "Service Pages", value: "7" },
      { label: "Total Pages", value: "8" },
      { label: "Coverage", value: "UK-wide" },
      { label: "Experience", value: "30+ years" },
    ],
    techStack: ["Content Strategy", "SEO Copywriting", "JSON-LD Schema", "Local SEO", "Next.js (planned)"],
    sections: [
      { id: "overview", title: "The Overview", content: `Specialist artisan stone crafting with 30+ years combined trade experience. Hand-sculpted faux stone and timber effects for residential and commercial clients UK-wide.` },
      { id: "solution", title: "The Solution", content: `7 full service pages: Interior Feature Walls, Exterior Facades, Fireplace & Chimney, Garden Rockery, Commercial Stone, New Build Features, Faux Timber Beams. Each with unique positioning, specs, process details, and FAQ schema. Brand philosophy: stone as permanence, not decoration.` },
      { id: "result", title: "The Result", content: `All copy written from scratch. 7 service pages with full product specs and FAQ. UK-wide coverage with city-level targeting across South Coast, London, Midlands, North.` },
    ],
    screenshots: ["/portfolio/primordial-stone-hero.png", "/portfolio/primordial-stone.png"],
  },

  // ═══════════════════════════════════════════════════════════════
  // 9. JSC Contractors
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "jsc-contractors",
    title: "JSC Contractors",
    subtitle: "Premium Building Contractors Website",
    client: "JSC Building Contractors",
    category: "Web Development",
    hook: "Internally branded 'God-Tier' — full-specification premium contractor website with no compromises. Deployed live.",
    heroImage: "/portfolio/jsc-hero.png",
    featured: false,
    metrics: [
      { label: "Quality", value: "God-Tier" },
      { label: "Export", value: "Static" },
      { label: "Hosting", value: "Hostinger" },
      { label: "Deploy", value: "SSH Auto" },
    ],
    techStack: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS v4", "Framer Motion", "Static Export", "Hostinger", "Python deploy"],
    sections: [
      { id: "overview", title: "The Overview", content: `JSC Building Contractors required a premium digital presence. Branded internally as 'God-Tier' — no compromises on design, performance, or content depth. Fully built, statically exported, and deployed live.` },
      { id: "build", title: "The Build", content: `Premium Next.js 15 static export deployed to Hostinger via custom Python script. Full page suite: home, about, services, case studies, areas, contact. Mobile-responsive with Framer Motion animations throughout.` },
      { id: "result", title: "The Result", content: `Deployed and live. Established the static-export pattern: Next.js build → static export → Python SSH deploy → Hostinger. One command, zero downtime, repeatable for every client.` },
    ],
    screenshots: ["/portfolio/jsc-hero.png"],
  },

  // ═══════════════════════════════════════════════════════════════
  // 10. PoundTrades
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "poundtrades",
    title: "PoundTrades",
    subtitle: "Mobile Marketplace for UK Tradespeople",
    client: "Internal Product",
    category: "Mobile Marketplace",
    hook: "A mobile marketplace for UK tradespeople to buy and sell surplus building materials — built by someone who's actually done the refits.",
    heroImage: "/portfolio/poundtrades-hero.png",
    featured: false,
    metrics: [
      { label: "Platform", value: "iOS + Android" },
      { label: "Backend", value: "Real-time" },
      { label: "Origin", value: "Trade experience" },
    ],
    techStack: ["React Native", "Expo", "Supabase", "TypeScript", "PostgreSQL"],
    sections: [
      { id: "problem", title: "The Problem", content: `Every building job produces leftover materials. There's no marketplace designed for how builders actually think about surplus stock. Facebook is too generic. eBay charges too much.` },
      { id: "differentiator", title: "Built by a Tradesman", content: `I've done national pub refits, run a motorcycle workshop, and managed multi-site building projects. The categories, listing flows, and search logic are designed around how tradespeople actually think.` },
      { id: "build", title: "The Build", content: `React Native with Expo for cross-platform mobile. Supabase handles real-time backend — listings, user profiles, messaging, and transactions through PostgreSQL with real-time subscriptions.` },
      { id: "result", title: "The Result", content: `A purpose-built mobile marketplace that speaks the language of the UK building trade. The best software comes from understanding the domain first.` },
    ],
    screenshots: ["/portfolio/poundtrades.png"],
  },

  // ═══════════════════════════════════════════════════════════════
  // 11. Kwizz
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "kwizz",
    title: "Kwizz",
    subtitle: "Real-Time Speed Quizzing Platform",
    client: "Internal Product",
    category: "Real-Time Web App",
    hook: "Live speed quizzing with host/contestant roles, real-time scoring over WebSocket, and device-based answer input.",
    heroImage: "/portfolio/kwizz.jpg",
    featured: false,
    metrics: [
      { label: "Architecture", value: "WebSocket" },
      { label: "Roles", value: "Host + Players" },
      { label: "Scoring", value: "Real-time" },
      { label: "Stack", value: "Next.js" },
    ],
    techStack: ["Next.js", "TypeScript", "WebSocket", "Real-time State", "Supabase"],
    sections: [
      { id: "overview", title: "The Overview", content: `Speed quizzing web application for real-time multiplayer gameplay. Host and contestant roles with live scoring, device-based answer input, and real-time state management over WebSocket.` },
      { id: "challenge", title: "The Challenge", content: `Speed quizzing requires sub-second state synchronisation across multiple devices. Every millisecond matters in competitive quizzing — no polling, no lag.` },
      { id: "build", title: "The Build", content: `TypeScript/Next.js with WebSocket-based real-time state management. Host and contestant interfaces are separate views of the same state machine. Answer timestamps to sub-second precision for speed-based scoring.` },
      { id: "result", title: "The Result", content: `Genuine real-time multiplayer quiz platform. Zero polling, zero lag, instant feedback — the way competitive quizzing should work.` },
    ],
    screenshots: ["/portfolio/kwizz.jpg"],
  },
];

// Live URLs for case studies that have a public site/product to link out to.
export const caseStudyLiveUrls: Record<string, string> = {
  "little-joes-tree-services": "https://www.littlejoestreeservices.co.uk",
  "compliance-hub": "https://compliance-hub.co.uk",
  "care-hub": "https://care-hub.app",
  "fm-control-hub": "https://fm-control-hub.co.uk",
  "sparta-coatings": "https://sparta-coatings.co.uk",
  "jsc-contractors": "https://jsccontractors.co.uk",
  "poundtrades": "https://poundtrades.app",
  "kwizz": "https://kwizz.co.uk",
};

export function getFeaturedCaseStudies(): CaseStudy[] {
  return caseStudies.filter((study) => study.featured);
}

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}
