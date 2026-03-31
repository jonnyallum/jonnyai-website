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
    content: string; // HTML-safe markdown-style content
  }[];
  screenshots: string[];
}

export const caseStudies: CaseStudy[] = [
  // ═══════════════════════════════════════════════════════════════
  // 1. jAIlbreakO.S
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "jailbreak-os",
    title: "jAIlbreakO.S",
    client: "Internal R&D",
    category: "Multi-Agent Orchestration",
    hook: "108 brains in a fridge. A LangGraph-native multi-agent OS with persistent vector memory, self-annealing routing, and a fully autonomous meditation video pipeline.",
    heroImage: "/portfolio/jailbreakos-hero.png",
    featured: true,
    metrics: [
      { label: "Agents", value: "108" },
      { label: "Domains", value: "15" },
      { label: "Tests Passing", value: "455" },
      { label: "Commits (1 month)", value: "416" },
      { label: "Spec Compliance", value: "14/14" },
    ],
    techStack: [
      "Python",
      "LangGraph",
      "LangChain",
      "Claude Haiku",
      "Supabase",
      "pgvector",
      "FastAPI",
      "Docker",
      "ElevenLabs",
      "Chatterbox TTS",
      "FFmpeg",
      "Whisper",
      "Telegram",
      "structlog",
    ],
    sections: [
      {
        id: "origin",
        title: "The Origin",
        content: `jAIlbreakO.S began as the Antigravity Orchestra — a Python-based system where different scripts and functions each played a specialised role, strictly coordinated to handle tasks across development, content, and automation. It worked, but it had no structured routing and no way to chain agents intelligently. The instruments played independently; they couldn't truly listen to each other.

The reimagining asked one question: what if every instrument had a brain, a name, a criminal backstory — and they all lived in a fridge?`,
      },
      {
        id: "architecture",
        title: "The Architecture Decision: LangGraph",
        content: `The pivotal choice was rebuilding the entire system on LangGraph, which gave the project three things the original lacked: stateful graph execution, checkpointing, and typed message passing between nodes.

Each agent became a LangGraph node with a typed BaseState TypedDict, tenacity-backed retry logic, and a persona defined in personas/config.py. The graphs themselves act as the warden — routing, sequencing, and controlling flow rather than letting agents run loose.

The supervisor graph (~1,800 lines) is the central nervous system. Every request hits a two-stage intent extractor — first keyword matching via ROUTING_RULES, then an LLM fallback using Claude Haiku for cost-safe disambiguation — before dispatching to the right agent.`,
      },
      {
        id: "agents",
        title: "The Fridge: 108 Agents Across 15 Domains",
        content: `What started as 67 agents grew to 108 across 15 specialised categories, spread across the full surface area of running a digital operation:

Core Dev (8) — Architecture, code review, agent building
Infrastructure (9) — DevOps, deployment, automation, MCP
Data & Research (11) — Supabase intelligence, RAG, GitHub analysis
Security & Quality (7) — Auditing, fact-checking, eval judging
Finance (9) — Analytics, risk, investment, pricing
Marketing & Content (12) — SEO, copy, social, email, video briefs
Betting Ecosystem (7) — Football, darts, F1, horses, roulette
Meditation Pipeline (7) — Script to YouTube, fully automated
Audio & Video (6) — Whisper, Chatterbox TTS, FFmpeg, YouTube

The names and backstories live in the Fridge Manifest. They argue through graph edges until they agree on a solution.`,
      },
      {
        id: "memory",
        title: "The Memory Spine: A Hippocampus for the Fridge",
        content: `The most architecturally significant addition was the Memory Spine — a pgvector layer backed by Supabase, giving every agent persistent, searchable memory across sessions.

Memories are embedded using text-embedding-3-small (1536 dimensions), stored with HNSW indexes for fast ANN retrieval, and scoped per-agent via hardened row-level security. A decay engine reduces memory strength 10% per cycle and archives anything that drops below 0.15 after 14 days.

Five memory types are supported: episodic (what happened), semantic (distilled knowledge), procedural (how-to patterns), reflective (meta-learning across sessions), and shared (broadcast channel readable by all 108 agents). The result is a system that genuinely learns — every mistake, every successful route, every client detail persists and is recalled by vector similarity.`,
      },
      {
        id: "ralph",
        title: "RALPH: The Self-Annealing Routing Loop",
        content: `RALPH (Routing And Learning Pattern Handler) is an autonomous background process that continuously routes tasks, observes outcomes, and adjusts its own routing weights based on results.

ralph_self_anneal.py runs optimisation passes, shifting the weighting of keyword rules based on what actually worked. It's the system learning how to dispatch itself better — a feedback loop layered on top of the supervisor graph.`,
      },
      {
        id: "meditation",
        title: "The Meditation Pipeline",
        content: `One of the most distinctive capabilities is the end-to-end meditation video pipeline — script to YouTube with zero human involvement:

1. Theme Factory — generates theme and tone
2. Scriptwriter — writes the full guided meditation script
3. Narrator — voices it via Chatterbox TTS or ElevenLabs voice cloning
4. Music Generation — scores ambient background audio
5. Visual Designer — selects and assembles background video
6. Video Assembler — FFmpeg rendering
7. YouTube Upload — titles, tags, description, publish

A single CLI command triggers the full chain. The GPU on the RTX 4070 handles local Whisper transcription and voice workloads.`,
      },
      {
        id: "quality",
        title: "Production Readiness",
        content: `The test suite stands at 455 passing tests across routing integrity, agent load, eval gate behaviour, memory store, and pipeline execution.

An LLM-as-judge eval gate sits at the end of every pipeline — scoring outputs 1–10 on relevance, completeness, and clarity, failing closed if quality drops below threshold.

The full stack runs containerised via Docker, served through a FastAPI layer with endpoints for single-agent dispatch, named pipelines, memory CRUD, and system health. Telegram alerts handle error notification. Structlog handles observability.`,
      },
    ],
    screenshots: [],
  },

  // ═══════════════════════════════════════════════════════════════
  // 2. BL Motorcycles
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "bl-motorcycles",
    title: "BL Motorcycles",
    client: "Brett — B&L Motorcycles Ltd",
    category: "E-Commerce & Operations Automation",
    hook: "A family motorcycle shop that needed to compete with national online retailers — automated from catalogue to dispatch.",
    heroImage: "/portfolio/bl-hero.png",
    featured: true,
    metrics: [
      { label: "eBay Listings Automated", value: "3,000+" },
      { label: "Catalogued Products", value: "11,900+" },
      { label: "Automation Workflows", value: "4" },
      { label: "Build Phases", value: "4" },
    ],
    techStack: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
      "Stripe",
      "n8n",
      "Python",
      "eBay API",
      "Hostinger",
      "GA4",
    ],
    sections: [
      {
        id: "brief",
        title: "The Brief",
        content: `Brett needed to move beyond a static web presence and manual marketplace operations. The business needed three things at once: a stronger brand presentation, a scalable commerce and operations backend, and automation to reduce repetitive listing and fulfilment overhead.

This wasn't a website project — it was a business transformation. The goal was to take a hands-on, workshop-first motorcycle business and give it the digital infrastructure to compete with national online parts retailers while keeping the personal service that Brett's customers value.`,
      },
      {
        id: "phase1",
        title: "Phase 1 — Brand Presence",
        content: `The first build delivered a custom industrial visual identity — "Kinetic Precision" — on a Vite + React + Express stack:

Black and gold design language with sharp corners and chamfered UI components. Custom UI components (TechButton, TechCard, SectionTitle) that feel like motorcycle engineering, not generic web templates. Six specialist service pages, gallery sections, and social integration. Mobile-responsive SPA routing with GA4 instrumentation.

The result: a workshop brand experience that matched the quality of Brett's real-world service. Customers landing on the site immediately understood this was a serious operation.`,
      },
      {
        id: "phase2",
        title: "Phase 2 — Enterprise Rebuild",
        content: `The second build moved from brochure site to business platform:

Next.js 15 App Router with TypeScript for type safety and server-side rendering. Supabase/PostgreSQL-backed product and order data with search, pagination, and stock visibility. Stripe checkout initiation with webhook-driven order creation. Internal admin portal with order visibility, status segmentation, and KPI-style operational reporting.

This phase turned the website from a marketing tool into the central nervous system of the business.`,
      },
      {
        id: "phase3",
        title: "Phase 3 — Operations Schema & Automation",
        content: `A dedicated operations migration introduced dispatch and escalation controls:

Tracking fields and timestamps for every order stage. Dispatch, review, and upsell flags to prevent duplicate customer messaging. Escalation state fields for overdue and problematic orders. Customer email audit table for compliance and communication tracking.

Four core n8n automation workflows now run continuously:
1. Dispatch email trigger — automatic notification when orders ship
2. Overdue order escalation — flags orders that haven't moved
3. Oversell risk alerts — catches stock discrepancies before they become customer problems
4. Weekly operations summary — gives Brett a dashboard of the week's activity without logging in`,
      },
      {
        id: "phase4",
        title: "Phase 4 — Marketplace Automation",
        content: `This is where operational leverage was created. Python automation for eBay and supplier sync handles:

Catalogue and listing operations that previously required hours of manual work. Stock synchronisation between supplier feeds and live marketplace listings. Under-threshold listing control and active-listing state sync. AI-generated product descriptions that maintain brand consistency across thousands of listings. Pricing rules that account for margins, shipping, and competitor positioning.

The entire marketplace operation moved from manual effort to managed automation.`,
      },
      {
        id: "result",
        title: "The Result",
        content: `The transformation changed B&L from a constrained, manually intensive setup into a platform with:

Branded customer-facing credibility that competes with national retailers. A searchable e-commerce catalogue with payment flow and order management. Structured operations with dispatch tracking, escalation controls, and automated reporting. 3,000+ eBay listings maintained automatically with stock sync and pricing rules. A clear path forward — current work is unifying the premium V1 design language with the V2 enterprise platform.

Brett now spends his time on motorcycles, not spreadsheets.`,
      },
    ],
    screenshots: [
      "/portfolio/bl-hero.png",
      "/portfolio/bl-shop.png",
      "/portfolio/bl-services.png",
      "/portfolio/bl-automations.png",
      "/portfolio/bl-ourstory.png",
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 3. Antigravity Orchestra (Jai.OS 5.0)
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "antigravity-orchestra",
    title: "The Antigravity Orchestra",
    client: "Internal Operating System",
    category: "Multi-Agent AI Platform",
    hook: "The internal infrastructure behind every client build — a 71-agent hive mind with a shared persistent brain that accumulates context across every project.",
    heroImage: "/portfolio/jonnyai-hero.png",
    featured: true,
    metrics: [
      { label: "Active Agents", value: "71" },
      { label: "Documented Skills", value: "269" },
      { label: "Operational Tiers", value: "12" },
      { label: "Learnings in Brain", value: "65+" },
    ],
    techStack: [
      "Python",
      "Supabase",
      "PostgreSQL",
      "ElevenLabs",
      "Meta Graph API",
      "GitHub Actions",
      "n8n",
      "Docker",
      "Claude API",
      "GPT-4o",
    ],
    sections: [
      {
        id: "what",
        title: "What It Is",
        content: `The Antigravity Orchestra is a Python-based multi-agent operating system running 71 specialist agents, each with a defined SKILL.md persona, tool catalogue, and collaboration protocol.

It's not a demo or a proof-of-concept — it's the production infrastructure I use to build and ship every client project. The reason I can deliver at the pace of a small agency while working solo is because this system handles the coordination, quality checking, and repetitive execution that would otherwise require a team.

Each agent has a human name, a nickname, a defined role, and a learning log. They're organised across 12 operational tiers: Command, Development, Design & Creative, Growth & Marketing, Intelligence & Research, Operations & Support, Legal & Safety, Quality & Verification, Specialized Ecosystems, Betting, Management & Automation, and Education.`,
      },
      {
        id: "brain",
        title: "The Shared Brain",
        content: `All agent data lives in a Supabase Shared Brain — a persistent knowledge graph that lets the whole system accumulate context across projects and clients.

The brain contains four core tables: agents (70 records with full SKILL.md content), learnings (65+ individual entries parsed from agent experience), chatroom (real-time session broadcasts), and projects (active client registry).

Every session ends with a sync: agent heartbeats update, new learnings are pushed, and session broadcasts are posted to the chatroom. The result is institutional memory — the system doesn't forget what worked, what failed, or what a client needs.`,
      },
      {
        id: "ralph",
        title: "The Ralph Loop",
        content: `The Ralph Loop is an autonomous iterative build process that lets agents self-correct output against defined quality gates without human prompting.

Rather than a single-pass generation model, the Ralph Loop runs build → validate → correct cycles. A 13-gate checklist (enforced by @Vigil) catches issues before they reach production. Content depth is verified by @Rowan. Mechanical QA runs through @Validator before every handoff.

This is the mechanism that turns AI generation from "probably fine" into "verified and shipped."`,
      },
      {
        id: "social",
        title: "Voice & Social Pipeline",
        content: `The Orchestra integrates voice synthesis via ElevenLabs (PVC/TTS) and social content distribution via Meta Graph API.

A chatroom listener polls Supabase every 5 seconds. When tagged messages arrive ([MILESTONE], [LAUNCH], [WIN], etc.), Claude Haiku generates social copy and the system publishes to Facebook and Instagram within 5 seconds. A social calendar pre-loads 20 posts at a time.

This means every significant achievement, deployment, or client milestone automatically becomes social proof — without manual effort.`,
      },
      {
        id: "scale",
        title: "The Scale",
        content: `71 agents across 12 tiers. 269 documented skills. 65+ individual learnings. Full validation suite ensuring every agent passes compliance checks. Sync scripts that keep the Supabase brain, Git repository, and local state in lockstep.

The system has been running continuously since 2024, accumulating context and improving with every project delivered.`,
      },
    ],
    screenshots: [
      "/portfolio/jonnyai-hero.png",
      "/portfolio/jonnyai2.png",
      "/portfolio/jonnyai3.png",
      "/portfolio/jonnyai4.png",
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 4. InsydeTradar
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "insydetradar",
    title: "InsydeTradar",
    client: "Internal Product",
    category: "AI Trading Infrastructure",
    hook: "Autonomous financial trading infrastructure — real-time market data feeds into AI-driven signal generation, with human-in-the-loop approval before any capital moves.",
    heroImage: "/portfolio/insydetradar-hero.jpg",
    featured: true,
    metrics: [
      { label: "Architecture", value: "Real-time" },
      { label: "Signal Generation", value: "AI-driven" },
      { label: "Risk Controls", value: "Human-in-loop" },
      { label: "Stack", value: "TypeScript" },
    ],
    techStack: [
      "TypeScript",
      "Node.js",
      "Real-time Data Feeds",
      "AI/LLM APIs",
      "Risk Management Engine",
      "Paper Trading",
    ],
    sections: [
      {
        id: "problem",
        title: "The Problem",
        content: `Most retail trading tools fall into two camps: fully manual (charts and gut feeling) or fully automated (black boxes that blow up accounts). Neither is acceptable.

The challenge was building infrastructure that harnesses AI-driven pattern recognition and signal generation while maintaining absolute human control over capital deployment. Speed where it matters (data ingestion, pattern detection), caution where it matters (execution).`,
      },
      {
        id: "architecture",
        title: "The Architecture",
        content: `InsydeTradar is a TypeScript-native trading infrastructure built around a clear pipeline:

Real-time market data feeds ingest live price, volume, and order book data. An AI-driven signal generation layer analyses patterns, detects breakout conditions, and generates conviction-scored trade signals. Each signal includes a conviction score (0–100), reasoning chain, and risk parameters.

The system is designed to be fast where speed matters and slow where caution matters.`,
      },
      {
        id: "paper-trading",
        title: "Paper Trading Environment",
        content: `Before any strategy touches real capital, it runs through a paper trading environment — a full simulation of market execution with realistic fill modelling, slippage estimation, and portfolio tracking.

This isn't a backtester running against historical data. It's a forward-testing environment running against live market conditions, validating that signals generated in real-time would have produced profitable outcomes before they're approved for live execution.`,
      },
      {
        id: "human-loop",
        title: "Human-in-the-Loop",
        content: `The non-negotiable design principle: AI suggests, human decides.

Every trade signal that passes the conviction threshold arrives at a human approval gate. The operator sees the signal, the reasoning, the risk parameters, and the portfolio impact. They approve, reject, or modify. No capital moves without explicit human confirmation.

This isn't a limitation — it's the entire point. The AI handles the parts humans are bad at (processing thousands of data points simultaneously, eliminating emotional bias, maintaining consistency). The human handles the parts AI is bad at (contextual judgment, risk appetite, knowing when the model is wrong).`,
      },
      {
        id: "result",
        title: "The Result",
        content: `A trading infrastructure that combines AI speed with human judgment. Real-time signal generation with full conviction scoring. Paper trading validation before live capital deployment. Position sizing, portfolio exposure limits, and drawdown controls baked into the architecture.

The system demonstrates a principle that applies far beyond trading: AI infrastructure should augment human decision-making, not replace it.`,
      },
    ],
    screenshots: [
      "/portfolio/insydetradar-hero.jpg",
      "/portfolio/insydetradar2.jpg",
      "/portfolio/insydetradar3.jpg",
      "/portfolio/insydetradar4.jpg",
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 5. PoundTrades
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "poundtrades",
    title: "PoundTrades",
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
    techStack: [
      "React Native",
      "Expo",
      "Supabase",
      "TypeScript",
      "PostgreSQL",
    ],
    sections: [
      {
        id: "problem",
        title: "The Problem",
        content: `Every building job produces leftover materials. Half-used bags of plaster, surplus timber, extra tiles. Tradespeople either bin it, stack it in the van, or sell it for nothing on Facebook Marketplace to people who don't understand what they're buying.

There's no marketplace designed for how builders actually think about surplus stock. Facebook is too generic. eBay charges too much. Gumtree is dying. The trade needs something purpose-built.`,
      },
      {
        id: "differentiator",
        title: "Built by a Tradesman",
        content: `This is where the operations background matters. I've done national pub refits (RNJ Customs), run a motorcycle workshop (Savage Spanner), and managed multi-site building projects. I know what a materials list looks like. I know which categories matter. I know the difference between "leftover timber" and "3m treated C16 4x2."

The categories, listing flows, and search logic in PoundTrades are designed around how tradespeople actually think — not how a product manager in a tech company imagines they might. Listings are structured by material type, condition, and trade category, not by generic marketplace taxonomies.`,
      },
      {
        id: "build",
        title: "The Build",
        content: `React Native with Expo for cross-platform mobile (iOS + Android from a single codebase). Supabase handles the real-time backend — listings, user profiles, messaging, and transactions all flow through PostgreSQL with real-time subscriptions.

Dual-platform presence: the mobile app at poundtrades.app and marketing sites at poundtrades.co.uk drive discovery and downloads.`,
      },
      {
        id: "result",
        title: "The Result",
        content: `A purpose-built mobile marketplace that speaks the language of the UK building trade. Real-time listing and messaging. Cross-platform native app. Trade-authentic categorisation and UX.

The project demonstrates a recurring theme in my work: the best software comes from understanding the domain first, then building the technology — not the other way around.`,
      },
    ],
    screenshots: [],
  },

  // ═══════════════════════════════════════════════════════════════
  // 6. The Client Portfolio
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "client-portfolio",
    title: "The Client Portfolio",
    client: "10+ UK Businesses",
    category: "Full-Stack Web Development",
    hook: "Every site built from scratch. Every system designed for the specific business. No templates, no page builders, no shortcuts.",
    heroImage: "/portfolio/client-portfolio-hero.png",
    featured: false,
    metrics: [
      { label: "Live Businesses", value: "10+" },
      { label: "Production Deploys", value: "34+" },
      { label: "Active Repos", value: "54" },
      { label: "Contributions (12mo)", value: "1,583" },
    ],
    techStack: [
      "Next.js",
      "React",
      "TypeScript",
      "HTML/CSS",
      "Supabase",
      "Vercel",
      "Hostinger",
      "GA4",
      "Google Workspace",
    ],
    sections: [
      {
        id: "pattern",
        title: "The Pattern",
        content: `Every client engagement follows the same principle: understand the business first, then build the technology.

Each project includes full infrastructure management — not just a website. That means domain registration, DNS configuration, SSL certificates, hosting setup, email routing (Google Workspace or M365), analytics instrumentation, and ongoing maintenance. The client gets a complete digital foundation, not a template they need to figure out.`,
      },
      {
        id: "projects",
        title: "Selected Projects",
        content: `Kwizz (kwizz.co.uk) — Speed quizzing web app. Host and contestant roles, live scoring, device-based answer input, real-time state management over WebSocket connections. TypeScript/Next.js.

Translate-R — React Native/Expo app that overlays real-time translated subtitles on live video calls. Deepgram streaming speech-to-text, GPT-4o-mini translation, sub-second pipeline latency.

SafeGuardian — Python child safety tool. Honeytrap-style detection system with strict human-in-the-loop review before any action.

Construct FM Estimate Generator — Internal quoting tool for facilities management. 50+ rates across 11 categories, structured pricing engine, professional PDF estimates. Replaced a four-hour quoting process with twelve minutes.

DJ Waste (dj-waste.co.uk) — Marketing and lead-capture site for Portsmouth waste and demolition. Full analytics, form routing, CRM integration.

La Aesthetician (la-aesthetician.co.uk) — Clean, compliant presentation for an aesthetics practitioner in a trust-sensitive niche.

Marzer Pro (marzer-pro.co.uk) — Full-service build for a roofing contractor including domains, DNS, SSL, hosting, forms, analytics.

Sparta Coatings (sparta-coatings.co.uk) — Industrial spray-coating business with operational systems and automation workflows.

Village Bakery & Cafe (villagebakeryandcafe.co.uk) — Award-winning bakery covering their Breakfast Challenge, fresh bakes, and buffet catering.

Little Jonnys Catering (littlejonnys.co.uk) — Mobile catering brand. Festival, wedding, and market circuit.

Primordial Stone (primordialstone.co.uk) — Faux-stone wall installation built on 30+ years of collective building trade experience.`,
      },
      {
        id: "result",
        title: "The Throughline",
        content: `10+ live businesses. 34+ production deployments on jonnyai.co.uk alone. 54 active repositories. 1,583 contributions in the last 12 months.

The common thread: every system is designed for the specific business it serves. The quoting tool for Construct FM encodes their actual rate card. The waste site for DJ Waste routes their actual enquiry types. The marketplace categories in PoundTrades reflect how tradespeople actually think about materials.

This is what happens when software is built by someone who's run businesses, not just written code for them.`,
      },
    ],
    screenshots: [
      "/portfolio/kwizz.jpg",
      "/portfolio/djwaste.png",
      "/portfolio/la-aesthetician.png",
      "/portfolio/marzer.png",
      "/portfolio/sparta-coatings.png",
      "/portfolio/village-bakery.png",
    ],
  },
];

export function getFeaturedCaseStudies(): CaseStudy[] {
  return caseStudies.filter((study) => study.featured);
}

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}
