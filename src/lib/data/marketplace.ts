export type SaasPricingTier = {
  name: "Starter" | "Professional" | "Enterprise (white-label)";
  monthlyGbp: number;
  setupGbp: number | null;
  includesUserCap: string;
  includesSiteCap: string;
  perks: string[];
};

export type SaasPricing = {
  tiers: SaasPricingTier[];
  overagePerUserGbp: number;
  caseStudySlug: string;
  liveAppUrl: string;
  demoLogin: { email: string; password: string };
};

export type MarketplaceListing = {
  slug: string;
  title: string;
  domain: string | null;
  kind: "website" | "saas-tool" | "mobile-app" | "platform" | "saas-product";
  track: "for-sale" | "fund-or-acquire" | "saas";
  status: "paid-not-settled" | "unfinished" | "live-saas";
  percentComplete: number;
  stack: string[];
  liveUrl: string | null;
  repoUrl: string | null;
  priceGbp: { low: number; high: number } | null;
  fundingGbp: { low: number; high: number } | null;
  saasPricing?: SaasPricing | null;
  tagline: string;
  summary: string;
  includes: string[];
  builtFeatures: string[];
  remaining: string[];
  buyerProfile: string;
};

export const marketplaceListings: MarketplaceListing[] = [
  // ─────────────────────────── FOR SALE ───────────────────────────
  {
    slug: "sparta-coatings",
    title: "Sparta Coatings",
    domain: "sparta-coatings.co.uk",
    kind: "website",
    track: "for-sale",
    status: "paid-not-settled",
    percentComplete: 95,
    stack: ["Next.js 15", "React 19", "TypeScript", "Tailwind v4", "Framer Motion"],
    liveUrl: "https://sparta-coatings.co.uk",
    repoUrl: "https://github.com/jonnyallum/sparta-coatings.co.uk",
    priceGbp: { low: 900, high: 1800 },
    fundingGbp: null,
    tagline: "Premium industrial spraying & coatings site — dark luxury architectural theme.",
    summary:
      "Complete Next.js 15 marketing site for an industrial coatings business. Dark charcoal + gold palette, 11 service detail pages with real imagery, manufacturer partner list, quote-form CTAs on every page, responsive and animated. Currently live on Hostinger.",
    includes: [
      "Domain: sparta-coatings.co.uk",
      "Matching email inbox",
      "Google Business Profile listing",
      "GitHub repository transfer",
      "Hostinger deployment + deploy script",
    ],
    builtFeatures: [
      "11 service detail pages (cladding, UPVC, kitchen cabinets, industrial units…)",
      "Dynamic [slug] routing for services",
      "Manufacturer partners section",
      "Quote-form CTA wired into every page",
      "Dark premium brand system (charcoal / navy / #c9a84c gold)",
      "Full mobile responsiveness, Framer Motion animations",
    ],
    remaining: ["Quote-form POST backend (1–2 hr Formspree wire-up)"],
    buyerProfile: "Spraying / coatings / industrial contractor ready to rebrand and launch. Or a web agency acquiring a white-label contractor template.",
  },
  {
    slug: "jsc-contractors",
    title: "JSC Contractors",
    domain: "jsccontractors.co.uk",
    kind: "website",
    track: "for-sale",
    status: "paid-not-settled",
    percentComplete: 45,
    stack: ["Next.js 15", "React 19", "TypeScript", "Tailwind v4"],
    liveUrl: "https://jsccontractors.co.uk",
    repoUrl: "https://github.com/jonnyallum/jsccontractors",
    priceGbp: { low: 300, high: 500 },
    fundingGbp: null,
    tagline: "Clean, modern contractor showcase site with case-study gallery.",
    summary:
      "Next.js 15 portfolio site for a building contractor. Working home page, 5 pre-built case studies with dynamic routing, Tailwind styling, live on Hostinger. Contact form and imagery need finishing — ideal flipper project.",
    includes: [
      "Domain: jsccontractors.co.uk",
      "Matching email inbox",
      "Google Business Profile listing",
      "GitHub repository transfer",
      "Hostinger deployment + deploy script",
    ],
    builtFeatures: [
      "Home page with hero, services grid, featured case studies",
      "Dynamic /case-studies/[id] route with 5 seeded projects",
      "generateStaticParams() for SEO-friendly pre-renders",
      ".htaccess configured for Hostinger",
    ],
    remaining: [
      "Build /contact page (referenced in nav, not implemented)",
      "Swap placeholder image paths for real case-study photos",
      "Wire a contact form backend (Formspree or Resend API)",
    ],
    buyerProfile: "Building contractor wanting a turn-key polished site. Or a flipper who will add the contact form + images and resell for £2k–£2.5k.",
  },
  // ─────────────────────── FUND / ACQUIRE ───────────────────────
  {
    slug: "construct-fm-estimate-generator",
    title: "Construct FM — Estimate & Invoice Generator",
    domain: null,
    kind: "saas-tool",
    track: "fund-or-acquire",
    status: "unfinished",
    percentComplete: 95,
    stack: ["Next.js 15", "React 19", "TypeScript", "Tailwind v4", "ExcelJS"],
    liveUrl: null,
    repoUrl: "https://github.com/jonnyallum/construct.fm-estimate-generator",
    priceGbp: { low: 1000, high: 2800 },
    fundingGbp: { low: 2000, high: 4000 },
    tagline: "Full-featured estimate & invoice generator for contractors. White-label ready.",
    summary:
      "A genuinely useful internal tool: 50+ rate-card line items across 11 trade categories, editable quantities, auto-calculated prelims & VAT, Excel export, professional invoice PDF with bank details and payment terms. Runs entirely client-side — zero backend cost.",
    includes: [
      "GitHub repository transfer",
      "Construct FM dark/orange brand system (re-brandable in an hour)",
      "Full rate-card JSON (trades-ready)",
    ],
    builtFeatures: [
      "50+ editable rate-card items across 11 categories",
      "Line-item builder with custom items, auto prelims %, VAT, grand total",
      "Invoice generator: editable number, dates, bank details, payment terms",
      "Excel (.xlsx) export via ExcelJS",
      "Print-to-PDF with branded output",
      "Zero backend — deploys to any static host",
    ],
    remaining: [
      "Generalise rate card (make per-tenant configurable) for SaaS model",
      "Add auth + cloud save (Supabase) if selling as multi-tenant SaaS",
      "Stripe billing layer",
    ],
    buyerProfile: "Trade contractor who wants to stop estimating in Excel. Or a founder pivoting it into a £29/mo SaaS for self-employed tradespeople.",
  },
  {
    slug: "kwizz",
    title: "Kwizz — Real-Time Quiz Platform",
    domain: "kwizz.co.uk",
    kind: "platform",
    track: "fund-or-acquire",
    status: "unfinished",
    percentComplete: 60,
    stack: ["Next.js 16", "React 19", "Supabase Realtime", "Tailwind v4", "Framer Motion"],
    liveUrl: "https://kwizz.co.uk",
    repoUrl: "https://github.com/jonnyallum/kwizd-app",
    priceGbp: { low: 900, high: 1500 },
    fundingGbp: { low: 3000, high: 5500 },
    tagline: "Working real-time multiplayer quiz engine. Missing only monetisation.",
    summary:
      "Live at kwizz.co.uk. Host/player separation, Supabase Realtime sync, countdown timers server-synchronised across all players, QR-code join flow, neon electric UI. The game engine works end-to-end. The pricing page exists but Stripe is not wired — that's the £8k–£15k of work to turn this into a revenue-generating SaaS.",
    includes: [
      "Domain: kwizz.co.uk",
      "GitHub repository transfer",
      "Hostinger deployment",
      "Supabase project + 1,150+ pre-verified questions across 123 packs",
      "Implementation & monetisation strategy docs",
    ],
    builtFeatures: [
      "Host dashboard (game control, leaderboard, question advance)",
      "Player join via 6-digit PIN + QR code",
      "Server-synced countdown timer (all players in sync)",
      "Real-time answer submission + buzzer race",
      "Live leaderboard with team names",
      "Pricing page (Free Trial / PAYG / Unlimited) designed",
      "Trial host auto-creation on first login",
    ],
    remaining: [
      "Stripe checkout + webhooks (PAYG + subscription)",
      "Credit deduction gate on game creation",
      "AI question-pack generator endpoint (script exists, not wired)",
      "Audio SFX (buzzer, countdown, victory)",
      "PWA manifest + service worker",
      "Google Sign-In",
    ],
    buyerProfile: "Pub-quiz chain, school EdTech, or corporate events company wanting a white-label live quiz product. Or a solo founder adding Stripe to unlock £29/mo host subscriptions.",
  },
  {
    slug: "safeguardian",
    title: "Safeguardian — Child Safety Platform",
    domain: null,
    kind: "platform",
    track: "fund-or-acquire",
    status: "unfinished",
    percentComplete: 30,
    stack: ["Flask 3.1", "Python", "Supabase", "React 19 (dashboard)", "React + Capacitor (mobile)"],
    liveUrl: null,
    repoUrl: "https://github.com/jonnyallum/safeguardian",
    priceGbp: { low: 1000, high: 1800 },
    fundingGbp: { low: 6000, high: 12000 },
    tagline: "Three-tier child-safety skeleton: backend + parent dashboard + working APK.",
    summary:
      "Honest call: this is a skeleton, not a shipped product. The mobile APK installs and runs like an app on Android, the UI is polished across all three tiers (Flask backend, React dashboard, Capacitor mobile), and auth/user management work. But the core promise — real-time monitoring of social platforms with AI grooming detection — is scaffolded only. The monitoring buttons open the platforms in a browser; no message interception exists. Priced accordingly.",
    includes: [
      "GitHub monorepo transfer (backend, dashboard, mobile)",
      "Android APK build pipeline (Capacitor)",
      "Docker backend deployment",
      "Design system (Radix + Tailwind) across all three apps",
    ],
    builtFeatures: [
      "Flask backend with JWT auth, user/child/family models, Supabase wiring",
      "React parent dashboard — children list, alerts centre, settings, analytics shells",
      "Mobile app — home screen with 6 platform buttons, settings sub-views, parent-email flow",
      "Capacitor Android build, APKs verified",
      "Auth endpoints: /register, /login, /refresh, /me, /change-password",
    ],
    remaining: [
      "Real AI grooming-detection pipeline (TensorFlow/spaCy models)",
      "Platform message-interception layer (Instagram/Snap/WhatsApp/Discord)",
      "WebSocket real-time monitoring stream",
      "Forensic logging + E2E encryption",
      "Proper MFA (currently placeholder)",
      "Evidence-collection system",
    ],
    buyerProfile: "Family-safety SaaS company or safeguarding charity wanting a ready-made UI shell + APK to skin and graft onto their own monitoring engine. Not a working monitoring product as-is.",
  },
  {
    slug: "insyde-tradar",
    title: "Insyde Tradar — Autonomous Trading Infrastructure",
    domain: "insydetradar.com",
    kind: "mobile-app",
    track: "fund-or-acquire",
    status: "unfinished",
    percentComplete: 35,
    stack: ["Expo / React Native", "tRPC", "Drizzle ORM", "Supabase", "Alpaca API", "Gemini 2.5"],
    liveUrl: "https://insydetradar.com",
    repoUrl: "https://github.com/jonnyallum/Insydetradar",
    priceGbp: null,
    fundingGbp: { low: 10000, high: 18000 },
    tagline: "Mobile trading-signals app with real broker integration. Needs finishing.",
    summary:
      "Ambitious architecture: Expo mobile front-end, fully-typed tRPC backend, Drizzle ORM on Supabase, live Alpaca brokerage integration, Gemini 2.5 signal engine, Loops mailing-list sync. 30+ TypeScript errors currently block the build — the funding goes into fixing those, completing OAuth and Alpaca flows, and shipping to the App Store.",
    includes: [
      "GitHub repo transfer",
      "Domain insydetradar.com (currently placeholder landing)",
      "Expo EAS build configuration",
      "Vitest testing framework",
    ],
    builtFeatures: [
      "Expo Router multi-tab app (Auth / Trade / Wallet / Analytics)",
      "tRPC backend with full type safety",
      "Supabase + Drizzle ORM schema",
      "Alpaca brokerage API integration (partial)",
      "Gemini 2.5 Flash signal engine",
      "Loops API mailing-list sync",
      "Expo push notifications + Resend email wiring",
    ],
    remaining: [
      "Resolve 30+ TypeScript compile errors blocking the build",
      "Complete Google OAuth (exchangeCodeForToken, getUserInfo)",
      "Finish trading-signal state machine",
      "End-to-end testing of Alpaca trade flows",
      "iOS + Android store submission",
    ],
    buyerProfile: "Fintech founder or trading-signal publisher seeking a mobile delivery channel. Or an investor backing a serious 8–12 week MVP sprint.",
  },
  {
    slug: "moling-expert",
    title: "Moling Expert",
    domain: "molingexpert.co.uk",
    kind: "website",
    track: "for-sale",
    status: "paid-not-settled",
    percentComplete: 92,
    stack: ["Next.js 15", "React 19", "TypeScript", "Tailwind v4"],
    liveUrl: "https://www.molingexpert.co.uk",
    repoUrl: null,
    priceGbp: { low: 800, high: 1600 },
    fundingGbp: null,
    tagline: "Live trenchless / no-dig moling lead-gen site — Portsmouth & South East.",
    summary:
      "Live, professionally-designed local-service site for a moling specialist: trenchless water-main and lead-pipe replacement across Portsmouth, Hampshire and the South East. Schema.org Plumber markup, areas-served structure, callback form, 24/7 phone CTA, full why-moling / how-it-works content, accreditation badges (WaterSafe, CHAS, £5m PL, DBS, 25-year MDPE). Ranking-ready for local Google searches.",
    includes: [
      "Domain: molingexpert.co.uk",
      "Matching email inbox (info@molingexpert.co.uk)",
      "Google Business Profile listing",
      "Hostinger deployment + deploy script",
      "GitHub repository transfer",
    ],
    builtFeatures: [
      "Home, Services, About, Areas, Contact pages",
      "Schema.org Plumber + LocalBusiness JSON-LD",
      "13-area service-coverage list (Portsmouth, Basingstoke, Guildford, Bournemouth, Reading…)",
      "Quote-request form with service dropdown",
      "Click-to-call header (24/7) + sticky CTAs",
      "Trust strip: WaterSafe, CHAS, £5m PL, DBS, MDPE warranty",
      "Mobile-first responsive layout",
    ],
    remaining: [
      "Real photography (currently illustrative)",
      "Customer testimonials / case-study photos",
      "Optional: blog / news section for local SEO",
    ],
    buyerProfile: "Working moling or no-dig contractor in the South East who wants a finished, ranking-ready lead-gen site under their own brand — drop in real photos and go.",
  },
  {
    slug: "marineflex",
    title: "Marineflex",
    domain: "marineflex.co.uk",
    kind: "website",
    track: "for-sale",
    status: "unfinished",
    percentComplete: 20,
    stack: ["Next.js 15", "React 19", "TypeScript", "Tailwind v4"],
    liveUrl: "https://marineflex.co.uk",
    repoUrl: "https://github.com/jonnyallum/marineflex.com",
    priceGbp: { low: 600, high: 1400 },
    fundingGbp: null,
    tagline: "Marine-grade sealant & adhesive product site — domain secured, build in progress.",
    summary:
      "Product-led site for a marine polyurethane sealant / adhesive line: above and below waterline, deck bedding, hull repairs, chandlery distribution. Audience is boat builders, marine trades, chandleries and DIY boat owners. Domain is live on Hostinger and the GitHub repo is reserved — funding completes the product pages, datasheet downloads, stockist locator and B2B trade-account flow.",
    includes: [
      "Domain: marineflex.co.uk (live on Hostinger DNS)",
      "Matching email inbox setup",
      "GitHub repo (jonnyallum/marineflex.com) transfer",
      "Brand system + product-page structure",
    ],
    builtFeatures: [
      "Domain registered + parked on Hostinger",
      "GitHub repository reserved",
      "Brand direction defined (marine / industrial)",
      "Product taxonomy mapped (above-water / below-water / deck / repair)",
    ],
    remaining: [
      "Product pages with technical datasheets (PDF download)",
      "Stockist / dealer locator",
      "Trade-account enquiry flow",
      "E-commerce or distributor handoff (Shopify or static product cards)",
      "Marine-trade SEO + schema",
      "Deploy + DNS cutover",
    ],
    buyerProfile: "Marine sealant manufacturer or chandlery distributor wanting an owned digital storefront. Or a brand operator backing the build to launch a UK marine-products line.",
  },
  // ─────────────────────────────── SaaS ───────────────────────────────
  {
    slug: "compliance-hub-saas",
    title: "Compliance Hub",
    domain: "compliance-hub.co.uk",
    kind: "saas-product",
    track: "saas",
    status: "live-saas",
    percentComplete: 100,
    stack: ["Next.js 15", "React 19", "TypeScript 5.7 strict", "Supabase Postgres 17", "Row-Level Security", "Server Actions", "Zod", "Tailwind 3.4", "pg_cron", "Resend", "PM2 + nginx"],
    liveUrl: "https://compliance-hub.co.uk",
    repoUrl: null,
    priceGbp: null,
    fundingGbp: null,
    tagline: "Statutory compliance operating system for UK facilities management — LOLER, PUWER, RIDDOR, RAMS, Fire, L8, CDM, EICR, Gas, H&S, Asbestos.",
    summary:
      "A multi-tenant SaaS for UK facilities, estates and H&S teams. RLS-first, RAG-as-data, audit-by-default. Delegation workflows with acceptance/decline/escalation on both inspections and actions. Time tracking, photo evidence, threaded comments with @mentions, calendar with cadence projections, mobile-responsive PWA. Live now at compliance-hub.co.uk.",
    includes: [
      "Hosted instance on your subdomain (or your own domain on Enterprise)",
      "Supabase project + 11 statutory frameworks pre-wired",
      "Magic-link auth, invite flow, super-admin / compliance-manager / site-manager / staff / contractor roles",
      "Email notifications (Resend), PDF inspection export, PWA install, dark mode",
      "Onboarding call + ongoing email support",
    ],
    builtFeatures: [
      "11 statutory regimes (LOLER, PUWER, RIDDOR, RAMS, Fire, L8, CDM, EICR, Gas, H&S, Asbestos)",
      "Delegation workflow on actions + inspections (accept / decline / escalate)",
      "Time tracking — clock on/off with single-task rule + history",
      "Auto-recurring inspections (sign-off → next cadence)",
      "Photo evidence on incidents + comment attachments",
      "Compliance score per site with breakdown UI",
      "Audit log on every operational write (previous + new values)",
    ],
    remaining: [],
    buyerProfile: "UK facilities manager, estate ops director, or H&S lead replacing spreadsheets with a defensible system of record. White-label for FM consultancies and TFM contractors.",
    saasPricing: {
      tiers: [
        {
          name: "Starter",
          monthlyGbp: 99,
          setupGbp: null,
          includesUserCap: "1 super admin + up to 5 users",
          includesSiteCap: "1 site",
          perks: ["All 11 frameworks", "Email support", "Hosted on your subdomain"],
        },
        {
          name: "Professional",
          monthlyGbp: 299,
          setupGbp: null,
          includesUserCap: "1 super admin + up to 25 users",
          includesSiteCap: "Up to 5 sites",
          perks: ["Priority email + chat support", "Contractor accounts included", "PDF export + PWA install"],
        },
        {
          name: "Enterprise (white-label)",
          monthlyGbp: 999,
          setupGbp: 1500,
          includesUserCap: "Unlimited users",
          includesSiteCap: "Unlimited sites",
          perks: ["Your brand, your domain", "Custom onboarding + training", "SLA + dedicated support", "One-off £1,500 setup fee"],
        },
      ],
      overagePerUserGbp: 15,
      caseStudySlug: "compliance-hub",
      liveAppUrl: "https://compliance-hub.co.uk",
      demoLogin: { email: "demo@jonnyai.co.uk", password: "Demo2026!!" },
    },
  },
  {
    slug: "fm-control-hub-saas",
    title: "FM Control Hub",
    domain: "fm-control-hub.co.uk",
    kind: "saas-product",
    track: "saas",
    status: "live-saas",
    percentComplete: 100,
    stack: ["Next.js 15", "React 19", "TypeScript 5.7 strict", "Supabase Postgres 17", "Row-Level Security", "Server Actions", "Zod", "Tailwind 3.4", "pg_cron", "Resend", "Vercel + GCP VM mirror"],
    liveUrl: "https://fm-control-hub.co.uk",
    repoUrl: null,
    priceGbp: null,
    fundingGbp: null,
    tagline: "Tailored facilities management OS for complex multi-territory estates — Compliance Hub's engine plus a Contractor Portal and premium UI tier.",
    summary:
      "Same RLS-first compliance engine as Compliance Hub, productised for enterprise estates with a Contractor Portal so external supply-chain partners work inside the audit trail rather than emailing certificates. Auto-recurring inspections, Longleat-class sample data, premium glassmorphism UI. Dual-deployed on Vercel and a GCP VM mirror.",
    includes: [
      "Hosted instance with Contractor Portal enabled",
      "All Compliance Hub frameworks + contractor onboarding flow",
      "Vercel deployment + GCP VM mirror for failover",
      "Onboarding workshop tailored to your estate's structure",
      "Quarterly compliance review with Jonny",
    ],
    builtFeatures: [
      "Contractor Portal — role-gated dashboard, company KPIs, work-order queue",
      "Automated contractor onboarding — invitation + magic-link provisioning",
      "All 11 frameworks (Compliance Hub parity)",
      "Auto-recurring inspections with cadence trigger",
      "Realtime widgets, scopable per site",
      "Premium glassmorphism UI tier",
      "PDF export + PWA install + dark mode",
    ],
    remaining: [],
    buyerProfile: "Multi-territory estate operations director (heritage estates, safari parks, mixed-use venues, university estates) or a Total Facilities Management contractor needing contractor-portal-grade audit trail.",
    saasPricing: {
      tiers: [
        {
          name: "Starter",
          monthlyGbp: 99,
          setupGbp: null,
          includesUserCap: "1 super admin + up to 5 users",
          includesSiteCap: "1 site, no contractor portal",
          perks: ["Compliance Hub feature set", "Email support"],
        },
        {
          name: "Professional",
          monthlyGbp: 299,
          setupGbp: null,
          includesUserCap: "1 super admin + up to 25 users + unlimited contractor accounts",
          includesSiteCap: "Up to 5 sites",
          perks: ["Contractor Portal enabled", "Premium UI tier", "Priority support"],
        },
        {
          name: "Enterprise (white-label)",
          monthlyGbp: 999,
          setupGbp: 1500,
          includesUserCap: "Unlimited users + unlimited contractors",
          includesSiteCap: "Unlimited sites + sub-estate territories",
          perks: ["Your brand, your domain", "Vercel + VM mirror under your DNS", "Quarterly compliance review", "Custom contractor onboarding"],
        },
      ],
      overagePerUserGbp: 15,
      caseStudySlug: "fm-control-hub",
      liveAppUrl: "https://fm-control-hub.co.uk",
      demoLogin: { email: "demo@jonnyai.co.uk", password: "FMHub-Demo-2026!" },
    },
  },
  {
    slug: "care-hub-saas",
    title: "Care Hub",
    domain: "care-hub.app",
    kind: "saas-product",
    track: "saas",
    status: "live-saas",
    percentComplete: 100,
    stack: ["Next.js 15", "React 19", "TypeScript 5.7 strict", "Supabase Postgres 17", "Row-Level Security", "Server Actions", "Zod", "Tailwind 3", "BEFORE triggers", "Storage RLS", "PM2 + nginx"],
    liveUrl: "https://care-hub.app",
    repoUrl: null,
    priceGbp: null,
    fundingGbp: null,
    tagline: "Resident-centred operating system for UK CQC-regulated care homes — eMAR with dual-sign CDs, NEWS2 auto-escalation, HACCP/L8/COSHH, KLOE evidence.",
    summary:
      "A multi-tenant SaaS for residential and nursing care homes. 62 tables, 17 migrations, 21 industry entities. eMAR with DB-enforced dual-signature on controlled drugs. NEWS2 vitals with auto-escalation. HACCP food safety, Legionella L8, COSHH all built in. CQC KLOE evidence on every action. Manor House seed data so demos sell themselves.",
    includes: [
      "Hosted instance on your subdomain (or your own domain on Enterprise)",
      "Supabase project with 17 migrations pre-applied",
      "All 8 roles (super_admin through family_viewer) configured",
      "Onboarding call + Manor House demo data for training",
      "Email + chat support",
    ],
    builtFeatures: [
      "Care plans + risk assessments with resident RAG triggers",
      "eMAR with controlled drugs register (dual-signature DB constraint)",
      "NEWS2 vitals with auto-escalation flagging",
      "HACCP food safety, COSHH, Legionella L8 modules",
      "Staff records with DBS / RtW / training matrix RAG",
      "Rota with WTD view, agency bookings",
      "CQC KLOE evidence tagging across Safe/Effective/Caring/Responsive/Well-led",
      "Family communications + visitors register with IPC screening",
    ],
    remaining: [],
    buyerProfile: "Care home owner, registered manager, or care group head of operations replacing paper MAR and spreadsheets. White-label for care groups and CQC consultancies.",
    saasPricing: {
      tiers: [
        {
          name: "Starter",
          monthlyGbp: 99,
          setupGbp: null,
          includesUserCap: "1 super admin + up to 5 care staff",
          includesSiteCap: "1 home",
          perks: ["Full clinical + compliance modules", "Email support", "Demo data for training"],
        },
        {
          name: "Professional",
          monthlyGbp: 299,
          setupGbp: null,
          includesUserCap: "1 super admin + up to 25 staff + unlimited family viewers",
          includesSiteCap: "Up to 5 homes",
          perks: ["Group reporting across homes", "Priority email + chat", "Family portal access"],
        },
        {
          name: "Enterprise (white-label)",
          monthlyGbp: 999,
          setupGbp: 1500,
          includesUserCap: "Unlimited staff + family viewers",
          includesSiteCap: "Unlimited homes",
          perks: ["Your brand, your domain", "Custom CQC report templates", "Onboarding + training included", "SLA + dedicated support"],
        },
      ],
      overagePerUserGbp: 15,
      caseStudySlug: "care-hub",
      liveAppUrl: "https://care-hub.app",
      demoLogin: { email: "demo@jonnyai.co.uk", password: "Demo2026!!" },
    },
  },
];

export function getByTrack(track: MarketplaceListing["track"]) {
  return marketplaceListings.filter((l) => l.track === track);
}
