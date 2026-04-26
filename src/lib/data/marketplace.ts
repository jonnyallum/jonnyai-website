export type MarketplaceListing = {
  slug: string;
  title: string;
  domain: string | null;
  kind: "website" | "saas-tool" | "mobile-app" | "platform";
  track: "for-sale" | "fund-or-acquire";
  status: "paid-not-settled" | "unfinished";
  percentComplete: number;
  stack: string[];
  liveUrl: string | null;
  repoUrl: string | null;
  priceGbp: { low: number; high: number } | null;
  fundingGbp: { low: number; high: number } | null;
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
];

export function getByTrack(track: MarketplaceListing["track"]) {
  return marketplaceListings.filter((l) => l.track === track);
}
