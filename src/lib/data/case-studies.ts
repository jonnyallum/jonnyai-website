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
  // 1. jAIlbreakO.S
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "jailbreak-os",
    title: "jAIlbreakO.S",
    subtitle: "108-Agent LangGraph System with Memory Spine & Self-Annealing Routing",
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
    techStack: ["Python", "LangGraph", "LangChain", "Claude Haiku", "Supabase", "pgvector", "FastAPI", "Docker", "ElevenLabs", "Chatterbox TTS", "FFmpeg", "Whisper", "Telegram", "structlog"],
    sections: [
      {
        id: "origin",
        title: "The Origin",
        content: `jAIlbreakO.S began as the Antigravity Orchestra \u2014 a Python-based system where different scripts and functions each played a specialised role, strictly coordinated to handle tasks across development, content, and automation. It worked, but it had no structured routing and no way to chain agents intelligently. The instruments played independently; they couldn\u2019t truly listen to each other.

The reimagining asked one question: what if every instrument had a brain, a name, a criminal backstory \u2014 and they all lived in a fridge?`,
      },
      {
        id: "architecture",
        title: "The Architecture Decision: LangGraph",
        content: `The pivotal choice was rebuilding the entire system on LangGraph, which gave the project three things the original lacked: stateful graph execution, checkpointing, and typed message passing between nodes.

Each agent became a LangGraph node with a typed BaseState TypedDict, tenacity-backed retry logic, and a persona defined in personas/config.py. The supervisor graph (~1,800 lines) is the central nervous system. Every request hits a two-stage intent extractor \u2014 first keyword matching via ROUTING_RULES, then an LLM fallback using Claude Haiku for cost-safe disambiguation \u2014 before dispatching to the right agent.`,
      },
      {
        id: "agents",
        title: "The Fridge: 108 Agents Across 15 Domains",
        content: `What started as 67 agents grew to 108 across 15 specialised categories:

Core Dev (8) \u2014 Architecture, code review, agent building
Infrastructure (9) \u2014 DevOps, deployment, automation, MCP
Data & Research (11) \u2014 Supabase intelligence, RAG, GitHub analysis
Security & Quality (7) \u2014 Auditing, fact-checking, eval judging
Finance (9) \u2014 Analytics, risk, investment, pricing
Marketing & Content (12) \u2014 SEO, copy, social, email, video briefs
Betting Ecosystem (7) \u2014 Football, darts, F1, horses, roulette
Meditation Pipeline (7) \u2014 Script to YouTube, fully automated
Audio & Video (6) \u2014 Whisper, Chatterbox TTS, FFmpeg, YouTube

They argue through graph edges until they agree on a solution.`,
      },
      {
        id: "memory",
        title: "The Memory Spine",
        content: `The most architecturally significant addition was the Memory Spine \u2014 a pgvector layer backed by Supabase, giving every agent persistent, searchable memory across sessions.

Memories are embedded using text-embedding-3-small (1536 dimensions), stored with HNSW indexes for fast ANN retrieval, and scoped per-agent via hardened row-level security. A decay engine reduces memory strength 10% per cycle and archives anything that drops below 0.15 after 14 days.

Five memory types: episodic, semantic, procedural, reflective, and shared (broadcast channel readable by all 108 agents). The result is a system that genuinely learns.`,
      },
      {
        id: "ralph",
        title: "RALPH: The Self-Annealing Routing Loop",
        content: `RALPH (Routing And Learning Pattern Handler) is an autonomous background process that continuously routes tasks, observes outcomes, and adjusts its own routing weights based on results. It\u2019s the system learning how to dispatch itself better \u2014 a feedback loop layered on top of the supervisor graph.`,
      },
      {
        id: "meditation",
        title: "The Meditation Pipeline",
        content: `End-to-end meditation video pipeline \u2014 script to YouTube with zero human involvement:

1. Theme Factory \u2014 generates theme and tone
2. Scriptwriter \u2014 writes the full guided meditation script
3. Narrator \u2014 voices it via Chatterbox TTS or ElevenLabs
4. Music Generation \u2014 scores ambient background audio
5. Visual Designer \u2014 selects and assembles background video
6. Video Assembler \u2014 FFmpeg rendering
7. YouTube Upload \u2014 titles, tags, description, publish

A single CLI command triggers the full chain.`,
      },
      {
        id: "quality",
        title: "Production Readiness",
        content: `455 passing tests across routing integrity, agent load, eval gate behaviour, memory store, and pipeline execution. An LLM-as-judge eval gate scores outputs 1\u201310 on relevance, completeness, and clarity, failing closed if quality drops below threshold. The full stack runs containerised via Docker, served through FastAPI.`,
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
    subtitle: "Enterprise E-Commerce & Operations Platform",
    client: "Brett \u2014 B&L Motorcycles Ltd",
    category: "E-Commerce & Automation",
    hook: "A family motorcycle shop that needed to compete with national online retailers \u2014 automated from catalogue to dispatch.",
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

This wasn\u2019t a website project \u2014 it was a business transformation.`,
      },
      {
        id: "phase1",
        title: "Phase 1 \u2014 Brand Presence",
        content: `Custom industrial visual identity \u2014 "Kinetic Precision" \u2014 on a Vite + React + Express stack. Black and gold design language with sharp corners and chamfered UI components. Six specialist service pages, gallery sections, and social integration.`,
      },
      {
        id: "phase2",
        title: "Phase 2 \u2014 Enterprise Rebuild",
        content: `Next.js 15 App Router with TypeScript. Supabase/PostgreSQL-backed product and order data with search, pagination, and stock visibility. Stripe checkout with webhook-driven order creation. Internal admin portal with KPI-style operational reporting.`,
      },
      {
        id: "phase3",
        title: "Phase 3 \u2014 Operations & Automation",
        content: `Four core n8n automation workflows running continuously:
1. Dispatch email trigger \u2014 automatic notification when orders ship
2. Overdue order escalation \u2014 flags orders that haven\u2019t moved
3. Oversell risk alerts \u2014 catches stock discrepancies
4. Weekly operations summary \u2014 dashboard without logging in`,
      },
      {
        id: "phase4",
        title: "Phase 4 \u2014 Marketplace Automation",
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
  // 3. Antigravity Orchestra
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "antigravity-orchestra",
    title: "The Antigravity Orchestra",
    subtitle: "71-Agent Hive Mind with Shared Persistent Brain",
    client: "Internal Operating System",
    category: "Multi-Agent AI Platform",
    hook: "The internal infrastructure behind every client build \u2014 a 71-agent hive mind with a shared persistent brain that accumulates context across every project.",
    heroImage: "/portfolio/jonnyai-hero.png",
    featured: true,
    metrics: [
      { label: "Active Agents", value: "71" },
      { label: "Skills", value: "269" },
      { label: "Tiers", value: "12" },
      { label: "Learnings", value: "65+" },
    ],
    techStack: ["Python", "Supabase", "PostgreSQL", "ElevenLabs", "Meta Graph API", "GitHub Actions", "n8n", "Docker", "Claude API", "GPT-4o"],
    sections: [
      {
        id: "what",
        title: "What It Is",
        content: `A Python-based multi-agent operating system running 71 specialist agents, each with a defined SKILL.md persona, tool catalogue, and collaboration protocol. It\u2019s the production infrastructure used to build and ship every client project.

Each agent has a human name, a nickname, a defined role, and a learning log. Organised across 12 operational tiers: Command, Development, Design, Growth, Intelligence, Operations, Legal, Quality, Specialized, Betting, Management, and Education.`,
      },
      {
        id: "brain",
        title: "The Shared Brain",
        content: `All agent data lives in a Supabase Shared Brain \u2014 a persistent knowledge graph. Four core tables: agents (70 records with full SKILL.md content), learnings (65+ entries), chatroom (real-time broadcasts), and projects (client registry). The system doesn\u2019t forget what worked, what failed, or what a client needs.`,
      },
      {
        id: "ralph",
        title: "The Ralph Loop",
        content: `Autonomous iterative build process: build \u2192 validate \u2192 correct cycles. A 13-gate checklist enforced by @Vigil catches issues before production. Content depth verified by @Rowan. Mechanical QA by @Validator before every handoff. This turns AI generation from "probably fine" into "verified and shipped."`,
      },
      {
        id: "social",
        title: "Voice & Social Pipeline",
        content: `ElevenLabs voice synthesis and Meta Graph API social distribution. A chatroom listener polls Supabase every 5 seconds. Tagged messages trigger Claude Haiku to generate social copy, publishing to Facebook and Instagram within 5 seconds. Every deployment automatically becomes social proof.`,
      },
    ],
    screenshots: ["/portfolio/jonnyai-hero.png", "/portfolio/jonnyai2.png", "/portfolio/jonnyai3.png", "/portfolio/jonnyai4.png"],
  },

  // ═══════════════════════════════════════════════════════════════
  // 4. InsydeTradar
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "insydetradar",
    title: "InsydeTradar",
    subtitle: "AI-Driven Trading Infrastructure",
    client: "Internal Product",
    category: "AI Trading Infrastructure",
    hook: "Real-time market data feeds into AI-driven signal generation, with human-in-the-loop approval before any capital moves.",
    heroImage: "/portfolio/insydetradar-hero.jpg",
    featured: true,
    metrics: [
      { label: "Architecture", value: "Real-time" },
      { label: "Signals", value: "AI-driven" },
      { label: "Risk Controls", value: "Human-in-loop" },
      { label: "Stack", value: "TypeScript" },
    ],
    techStack: ["TypeScript", "Node.js", "Real-time Data Feeds", "AI/LLM APIs", "Risk Management Engine", "Paper Trading"],
    sections: [
      {
        id: "problem",
        title: "The Problem",
        content: `Most retail trading tools are either fully manual or fully automated black boxes. The challenge: harness AI-driven pattern recognition while maintaining absolute human control over capital deployment.`,
      },
      {
        id: "architecture",
        title: "The Architecture",
        content: `TypeScript-native trading infrastructure: real-time market data feeds, AI-driven signal generation with conviction scoring (0\u2013100), reasoning chains, and risk parameters. Fast where speed matters, slow where caution matters.`,
      },
      {
        id: "human-loop",
        title: "Human-in-the-Loop",
        content: `AI suggests, human decides. Every trade signal arrives at a human approval gate with signal, reasoning, risk parameters, and portfolio impact. No capital moves without explicit confirmation. The AI handles data processing; the human handles judgment.`,
      },
      {
        id: "result",
        title: "The Result",
        content: `A trading infrastructure that combines AI speed with human judgment. Paper trading validation before live capital. Position sizing, exposure limits, and drawdown controls baked into the architecture.`,
      },
    ],
    screenshots: ["/portfolio/insydetradar-hero.jpg", "/portfolio/insydetradar2.jpg", "/portfolio/insydetradar3.jpg", "/portfolio/insydetradar4.jpg"],
  },

  // ═══════════════════════════════════════════════════════════════
  // 5. JonnyAI.Website
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "jonnyai-website",
    title: "JonnyAI.Website",
    subtitle: "AI Agency Platform & Tools Hub",
    client: "Jonny Allum Innovations",
    category: "Full-Stack Platform",
    hook: "Not a brochure \u2014 a 15+ route platform presenting the 70-agent orchestra, AI tools, and commercial products in one unified experience.",
    heroImage: "/portfolio/jonnyai-hero.png",
    featured: true,
    metrics: [
      { label: "Live Routes", value: "15+" },
      { label: "Agents", value: "70" },
      { label: "Products", value: "5" },
      { label: "Deploy", value: "Vercel" },
    ],
    techStack: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS v4", "Framer Motion", "Supabase", "Vercel"],
    sections: [
      {
        id: "overview",
        title: "The Overview",
        content: `JonnyAI.website is the primary public face of the Antigravity Agency. Full platform with routes for agent workforce, dashboard, labs, empire builder, AI firewall, compliance firewall, creator workflow, review coach, chronology, and legal.`,
      },
      {
        id: "challenge",
        title: "The Challenge",
        content: `Representing a 70-agent hive mind requires a site that is itself a demonstration of the capability. Every section must work technically, look world-class, and communicate specific product value across 15+ coherent routes.`,
      },
      {
        id: "build",
        title: "The Build",
        content: `Next.js 15 multi-route platform with dark accent-driven design. Live-feel Workforce section, AgencyActivity feed, GlassBox preview, EmpireTeaser, DreamerVentures, and Pricing. Auto-generated robots.ts and sitemap.ts.`,
      },
      {
        id: "result",
        title: "The Result",
        content: `15+ live routes \u2014 a full platform, not a brochure. The site demonstrates that the agency practices what it sells: built using the same multi-agent system it showcases.`,
      },
    ],
    screenshots: ["/portfolio/jonnyai-hero.png", "/portfolio/jonnyai2.png", "/portfolio/jonnyai3.png", "/portfolio/jonnyai4.png"],
  },

  // ═══════════════════════════════════════════════════════════════
  // 6. Sparta Coatings
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "sparta-coatings",
    title: "Sparta Coatings",
    subtitle: "Premium Spray Coating Services \u2014 UK-Wide",
    client: "Sparta Coatings",
    category: "Web Development & Lead Gen",
    hook: "22-page premium build with 16 service landing pages, sticky conversion CTAs, and full SEO \u2014 deployed static on Hostinger.",
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
      { id: "overview", title: "The Overview", content: `Sparta Coatings offers 16 distinct spray coating services. The primary revenue driver is quote form conversions \u2014 every page is engineered around that single goal.` },
      { id: "challenge", title: "The Challenge", content: `The old site failed to communicate premium, specialist positioning. 16 services each needing SEO-optimised landing pages on Hostinger shared hosting \u2014 fully static, no server runtime.` },
      { id: "solution", title: "The Solution", content: `Ground-up rebuild in Next.js 15 with static export. Dark premium design with refined gold (#C9A84C). Sticky floating CTA on every page. All 22 pages carry SEO meta, JSON-LD schema. Python SSH deploy script for zero-downtime deploys.` },
      { id: "deliverables", title: "Key Deliverables", content: `22-page static site. 16 service pages with sidebar quote form, FAQ accordion, process steps. Kolorbond approved applicator badges. One-command deploy: npm run build \u2192 ZIP \u2192 SSH \u2192 unzip \u2192 chmod.` },
    ],
    screenshots: ["/portfolio/sparta-coatings.png"],
  },

  // ═══════════════════════════════════════════════════════════════
  // 7. PoundTrades
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "poundtrades",
    title: "PoundTrades",
    subtitle: "Mobile Marketplace for UK Tradespeople",
    client: "Internal Product",
    category: "Mobile Marketplace",
    hook: "A mobile marketplace for UK tradespeople to buy and sell surplus building materials \u2014 built by someone who\u2019s actually done the refits.",
    heroImage: "/portfolio/poundtrades-hero.png",
    featured: false,
    metrics: [
      { label: "Platform", value: "iOS + Android" },
      { label: "Backend", value: "Real-time" },
      { label: "Origin", value: "Trade experience" },
    ],
    techStack: ["React Native", "Expo", "Supabase", "TypeScript", "PostgreSQL"],
    sections: [
      { id: "problem", title: "The Problem", content: `Every building job produces leftover materials. There\u2019s no marketplace designed for how builders actually think about surplus stock. Facebook is too generic. eBay charges too much.` },
      { id: "differentiator", title: "Built by a Tradesman", content: `I\u2019ve done national pub refits, run a motorcycle workshop, and managed multi-site building projects. The categories, listing flows, and search logic are designed around how tradespeople actually think.` },
      { id: "build", title: "The Build", content: `React Native with Expo for cross-platform mobile. Supabase handles real-time backend \u2014 listings, user profiles, messaging, and transactions through PostgreSQL with real-time subscriptions.` },
      { id: "result", title: "The Result", content: `A purpose-built mobile marketplace that speaks the language of the UK building trade. The best software comes from understanding the domain first.` },
    ],
    screenshots: [],
  },

  // ═══════════════════════════════════════════════════════════════
  // 8. Construct FM
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
    screenshots: [],
  },

  // ═══════════════════════════════════════════════════════════════
  // 9. Kwizz
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
      { id: "challenge", title: "The Challenge", content: `Speed quizzing requires sub-second state synchronisation across multiple devices. Every millisecond matters in competitive quizzing \u2014 no polling, no lag.` },
      { id: "build", title: "The Build", content: `TypeScript/Next.js with WebSocket-based real-time state management. Host and contestant interfaces are separate views of the same state machine. Answer timestamps to sub-second precision for speed-based scoring.` },
      { id: "result", title: "The Result", content: `Genuine real-time multiplayer quiz platform. Zero polling, zero lag, instant feedback \u2014 the way competitive quizzing should work.` },
    ],
    screenshots: ["/portfolio/kwizz.jpg"],
  },

  // ═══════════════════════════════════════════════════════════════
  // 10. Injection Guard
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "injection-guard",
    title: "Injection Guard",
    subtitle: "Prompt Injection Detection & Deterministic Hardening",
    client: "Internal Product",
    category: "AI Security",
    hook: "Four-gate prompt injection detection \u2014 identity anchoring, latent-space drift monitoring, and output parity verification.",
    heroImage: "/portfolio/injection-guard-hero.png",
    featured: false,
    metrics: [
      { label: "Gates", value: "4" },
      { label: "Vectors", value: "Encoded + Semantic" },
      { label: "Architecture", value: "Deterministic" },
      { label: "Target", value: "B2B SaaS" },
    ],
    techStack: ["Next.js 15", "TypeScript", "Supabase", "Custom Scanner", "Vector Similarity"],
    sections: [
      { id: "overview", title: "The Overview", content: `AI security product targeting prompt injection in commercial LLM deployments. Goes beyond regex guardrails to implement identity anchoring, latent-space drift detection, and output parity verification.` },
      { id: "problem", title: "The Problem", content: `Most AI security is probabilistic guardrails \u2014 more AI trying to detect if other AI is misbehaving. Fails across four attack vectors: encoded payloads, persona drift, semantic drift, and tool-call injection. 99% success rate means 100% vulnerability.` },
      { id: "solution", title: "The Solution", content: `Four-gate system: G1 Payload Base-X (encoded jailbreaks), G2 Persona Drift (identity consistency), G3 Zero-Trust Schema (system metadata blocking), G4 Recursive Loop (token-burning detection). Three pillars: Identity Anchoring, Latent-Space Locks, Output Parity / Truth-Lock.` },
      { id: "result", title: "The Result", content: `Deterministic security layer handling encoded, semantic, persona-drift, and structural attacks. Identity Anchoring means the agent cannot process contradictory instructions. Built from a documented Adversarial Vector Map, not theoretical research.` },
    ],
    screenshots: [],
  },

  // ═══════════════════════════════════════════════════════════════
  // 11. Antigravity Academy
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "antigravity-academy",
    title: "Antigravity Academy",
    subtitle: "Jai.OS 5.0 Practitioner Programme",
    client: "Jonny Allum Innovations",
    category: "EdTech & Course Platform",
    hook: "4-week online training programme teaching the Jai.OS 5.0 multi-agent system \u2014 agent-assessed final projects, 20-spot founding cohort.",
    heroImage: "/portfolio/academy-hero.png",
    featured: false,
    metrics: [
      { label: "Programme", value: "4 weeks" },
      { label: "Founding Price", value: "\u00A3297" },
      { label: "Founding Spots", value: "20" },
      { label: "Assessment", value: "13-gate" },
    ],
    techStack: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "Framer Motion", "Supabase", "Stripe", "Vercel"],
    sections: [
      { id: "overview", title: "The Overview", content: `Structured 4-week programme teaching the Jai.OS 5.0 multi-agent system. Aimed at developers, AI agency founders, and freelancers. Delivers the Jai.OS 5.0 Practitioner Certificate. Founding cohort: 20 spots at \u00A3297.` },
      { id: "curriculum", title: "The Curriculum", content: `Week 1: Jai.OS Foundation. Week 2: First Agent \u2014 SKILL.md authoring, persona design. Week 3: Multi-Agent Orchestration \u2014 routing, quality gates. Week 4: Monetisation \u2014 Empire Builder system. Final projects assessed by @Vigil using the 13-gate checklist.` },
      { id: "result", title: "The Result", content: `Course platform with tiered pricing, full curriculum breakdown, six learning outcomes. The monetisation module teaches the Empire Builder system with 5 revenue streams \u2014 students learn to build and sell agents.` },
    ],
    screenshots: [],
  },

  // ═══════════════════════════════════════════════════════════════
  // 12. Antigravity Assurance
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "antigravity-assurance",
    title: "Antigravity Assurance",
    subtitle: "AI Agent Audit & Risk Certification",
    client: "Jonny Allum Innovations",
    category: "AI Security & B2B SaaS",
    hook: "Professional AI agent audit using the 13-gate methodology \u2014 risk scoring, remediation checklists, and the Antigravity Checksum seal.",
    heroImage: "/portfolio/assurance-hero.png",
    featured: false,
    metrics: [
      { label: "Audit Gates", value: "13" },
      { label: "Standard", value: "\u00A3997" },
      { label: "Enterprise", value: "\u00A32,497" },
      { label: "Monitoring", value: "\u00A3199/mo" },
    ],
    techStack: ["Next.js 15", "TypeScript", "Tailwind CSS", "Stripe", "Supabase", "Vercel"],
    sections: [
      { id: "overview", title: "The Overview", content: `Professional AI agent audit and risk certification using the 13-gate methodology. Targets AI startups, agencies, and scale-ups. Three tiers: Standard Audit (\u00A3997), Enterprise (\u00A32,497), Monthly Monitoring (\u00A3199/mo).` },
      { id: "problem", title: "The Problem", content: `AI agent failures \u2014 hallucination, identity fragmentation, prompt injection, data leakage \u2014 create real financial and reputational risk. No credible third-party certification standard exists.` },
      { id: "solution", title: "The Solution", content: `Three-tier product with 13-gate methodology. Enterprise tier includes executive briefing and insurer-formatted risk schedule. The Antigravity Checksum seal turns a one-off audit into an ongoing marketing asset for clients.` },
    ],
    screenshots: [],
  },

  // ═══════════════════════════════════════════════════════════════
  // 13. AgentFlip
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "agentflip",
    title: "AgentFlip",
    subtitle: "Digital Domain Arbitrage Platform",
    client: "Internal Product",
    category: "SaaS & Domain Arbitrage",
    hook: "Cyber-industrial HUD for digital domain arbitrage \u2014 Scavenger Pulse feed, GRAVY_SCORE ranking, and a trading-floor aesthetic.",
    heroImage: "/portfolio/agentflip-hero.png",
    featured: false,
    metrics: [
      { label: "Design", value: "Cyber-Industrial" },
      { label: "Scoring", value: "GRAVY_SCORE" },
      { label: "Dashboard", value: "Trading HUD" },
      { label: "Status", value: "In Development" },
    ],
    techStack: ["Next.js 15", "TypeScript", "Tailwind CSS", "Framer Motion", "JetBrains Mono", "Space Grotesk"],
    sections: [
      { id: "overview", title: "The Overview", content: `Domain and digital asset arbitrage platform. Systematically identifies undervalued digital real estate \u2014 expired domains, SaaS micro-niches, keyword gaps \u2014 and flips them for profit. Visual identity: Void Black, Signal Green (#00FF41), Rust Copper.` },
      { id: "build", title: "The Build", content: `Full Next.js 15 dashboard functioning like a trading terminal. Live Scavenger Pulse feed, GRAVY_SCORE metrics (0\u20131 opportunity ranking), active flips ticker. Glass-panel cards with Signal Green glow effects and scanning animations.` },
      { id: "result", title: "The Result", content: `A cyber-industrial HUD aesthetic that stands alone in the domain arbitrage space. GRAVY_SCORE is proprietary opportunity-ranking. "We don\u2019t build sites. We build equity from digital waste."` },
    ],
    screenshots: [],
  },

  // ═══════════════════════════════════════════════════════════════
  // 14. JSC Contractors
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "jsc-contractors",
    title: "JSC Contractors",
    subtitle: "Premium Building Contractors Website",
    client: "JSC Building Contractors",
    category: "Web Development",
    hook: "Internally branded 'God-Tier' \u2014 full-specification premium contractor website with no compromises. Deployed live.",
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
      { id: "overview", title: "The Overview", content: `JSC Building Contractors required a premium digital presence. Branded internally as 'God-Tier' \u2014 no compromises on design, performance, or content depth. Fully built, statically exported, and deployed live.` },
      { id: "build", title: "The Build", content: `Premium Next.js 15 static export deployed to Hostinger via custom Python script. Full page suite: home, about, services, case studies, areas, contact. Mobile-responsive with Framer Motion animations throughout.` },
      { id: "result", title: "The Result", content: `Deployed and live. Established the Antigravity static-export pattern: Next.js build \u2192 static export \u2192 Python SSH deploy \u2192 Hostinger. One command, zero downtime, repeatable for every client.` },
    ],
    screenshots: [],
  },

  // ═══════════════════════════════════════════════════════════════
  // 15. Marzer Pro Roofing
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "marzer-pro",
    title: "Marzer Pro Roofing",
    subtitle: "Roofing Contractor \u2014 Hampshire",
    client: "Marzer Pro Roofing",
    category: "Web Development & Lead Gen",
    hook: "Full-service roofing contractor build \u2014 domains, DNS, SSL, hosting, forms, analytics, and conversion-focused design.",
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
      { id: "overview", title: "The Overview", content: `Hampshire-based roofing contractor. Not just a website \u2014 full infrastructure: domain registration, DNS, SSL, hosting, form routing, and analytics.` },
      { id: "build", title: "The Build", content: `Full-stack static website: Hero, TrustBar, Services, Projects gallery, Testimonials, About, Coverage map, CTA. Mobile-responsive with Framer Motion micro-animations. SVG logo integration.` },
      { id: "result", title: "The Result", content: `Complete digital foundation \u2014 domain, DNS, SSL, hosting, forms, analytics. The client got everything, not just a website they need to figure out how to host.` },
    ],
    screenshots: ["/portfolio/marzer.png"],
  },

  // ═══════════════════════════════════════════════════════════════
  // 16. Primordial Stone
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "primordial-stone",
    title: "Primordial Stone",
    subtitle: "Artisan Faux Stone Craftsmen \u2014 Nationwide",
    client: "Primordial Stone",
    category: "Content Strategy & SEO",
    hook: "Complete content strategy and SEO copywriting for 8 pages and 7 service sections \u2014 zero template language, brand philosophy woven through every page.",
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
    screenshots: [],
  },

  // ═══════════════════════════════════════════════════════════════
  // 17. Translate-R
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "translate-r",
    title: "Translate-R",
    subtitle: "Real-Time Video Call Translation Overlay",
    client: "Internal Product",
    category: "AI & Mobile App",
    hook: "React Native app overlaying real-time translated subtitles on live video calls \u2014 Deepgram streaming STT, GPT-4o-mini translation, sub-second latency.",
    heroImage: "/portfolio/translate-r-hero.png",
    featured: false,
    metrics: [
      { label: "Latency", value: "Sub-second" },
      { label: "STT", value: "Deepgram" },
      { label: "Translation", value: "GPT-4o-mini" },
      { label: "Platform", value: "Mobile" },
    ],
    techStack: ["React Native", "Expo", "Deepgram", "GPT-4o-mini", "TypeScript", "Streaming Audio"],
    sections: [
      { id: "overview", title: "The Overview", content: `React Native/Expo app overlaying real-time translated subtitles on live video calls. Audio streams through Deepgram for STT, translates via GPT-4o-mini, renders subtitles \u2014 all sub-second.` },
      { id: "build", title: "The Build", content: `Streaming (not batch) STT, lightweight translation model (4o-mini), immediate render without waiting for complete sentences. Architecture prioritises latency above all else.` },
      { id: "result", title: "The Result", content: `Working real-time translation overlay maintaining sub-second latency. Live audio in one language becomes readable subtitles in another before the speaker finishes their thought.` },
    ],
    screenshots: [],
  },

  // ═══════════════════════════════════════════════════════════════
  // 18. SafeGuardian
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "safeguardian",
    title: "SafeGuardian",
    subtitle: "Child Safety Detection with Human-in-the-Loop",
    client: "Internal Product",
    category: "AI Safety Tool",
    hook: "Child safety detection system with strict human-in-the-loop review \u2014 AI flags, humans decide, zero autonomous action.",
    heroImage: "/portfolio/safeguardian-hero.png",
    featured: false,
    metrics: [
      { label: "Architecture", value: "Human-in-loop" },
      { label: "Detection", value: "AI-powered" },
      { label: "Action", value: "Zero autonomous" },
      { label: "Stack", value: "Python" },
    ],
    techStack: ["Python", "AI/LLM APIs", "Human Review Interface", "Supabase"],
    sections: [
      { id: "overview", title: "The Overview", content: `Python child safety tool using AI detection to identify potential threats. Strict principle: AI flags, humans decide. No autonomous action is ever taken.` },
      { id: "architecture", title: "The Architecture", content: `Honeytrap-style detection monitoring interaction patterns. Every flag generates a case file routed to a human reviewer. The human makes every decision about escalation or reporting. In child safety, false positives and false negatives both have devastating consequences.` },
      { id: "result", title: "The Result", content: `Responsible AI deployment in the most sensitive context. Zero autonomous action. Strict evidence handling with chain-of-custody tracking. Privacy by design \u2014 no dragnet surveillance. The more sensitive the domain, the more essential human oversight becomes.` },
    ],
    screenshots: [],
  },
];

export function getFeaturedCaseStudies(): CaseStudy[] {
  return caseStudies.filter((study) => study.featured);
}

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}
