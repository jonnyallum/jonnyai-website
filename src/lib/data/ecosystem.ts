// ─────────────────────────────────────────────────────────────────
// Ecosystem — single source of truth for live backlinks.
// Used by the home page, About page, BizOS page and the footer so
// every link to Jonny's live sites, products and socials stays in
// one place.
// ─────────────────────────────────────────────────────────────────

export type EcosystemLink = {
  name: string;
  url: string;
  blurb: string;
  status: 'live' | 'building' | 'for-sale';
};

// ── The HubSuite — sharp, regulated SaaS blades ──────────────────
export const hubSuite: (EcosystemLink & { accent: string; pain: string })[] = [
  {
    name: 'Compliance Hub',
    url: 'https://compliance-hub.co.uk',
    accent: '#5B8DEF',
    pain: 'Statutory compliance, audit-ready',
    blurb:
      'The system of record for UK facilities. LOLER, PUWER, RIDDOR, RAMS, Fire, Legionella, EICR, Gas — every obligation tracked, every action logged, audits in days not weeks.',
    status: 'live',
  },
  {
    name: 'Care Hub',
    url: 'https://care-hub.app',
    accent: '#31C6A9',
    pain: 'CQC calm for care homes',
    blurb:
      'A resident-first operating system for CQC-regulated homes. eMAR with dual-sign controlled drugs, NEWS2 auto-escalation, care plans and KLOE evidence on tap — inspection-ready, every day.',
    status: 'live',
  },
  {
    name: 'FM Control Hub',
    url: 'https://fm-control-hub.co.uk',
    accent: '#5EC86E',
    pain: 'Estates & contractors, controlled',
    blurb:
      'Facilities management for complex estates. PPM, work orders, permits, key control and a contractor portal that lives inside the audit trail — not in someone’s inbox.',
    status: 'live',
  },
];

// ── Live client websites & projects (backlinks) ──────────────────
export const liveProjects: EcosystemLink[] = [
  {
    name: "Little Joe's Tree Services",
    url: 'https://www.littlejoestreeservices.co.uk',
    blurb: 'Full studio build — rebrand, lead-gen website and an on-site content day for a Hampshire tree surgeon.',
    status: 'live',
  },
  {
    name: 'Sparta Coatings',
    url: 'https://sparta-coatings.co.uk',
    blurb: 'Dark-luxury rebrand and 11-service website for an industrial spray-coatings firm.',
    status: 'live',
  },
  {
    name: 'JSC Contractors',
    url: 'https://jsccontractors.co.uk',
    blurb: 'Premium contractor website with a case-study gallery.',
    status: 'live',
  },
  {
    name: 'Moling Expert',
    url: 'https://www.molingexpert.co.uk',
    blurb: 'Ranking-ready lead-gen site for a trenchless no-dig moling specialist.',
    status: 'live',
  },
  {
    name: 'Kwizz',
    url: 'https://kwizz.co.uk',
    blurb: 'Real-time multiplayer quiz platform with server-synced gameplay.',
    status: 'live',
  },
  {
    name: 'Insyde Tradar',
    url: 'https://insydetradar.com',
    blurb: 'Mobile trading-signals app with live broker integration.',
    status: 'building',
  },
  {
    name: 'PoundTrades',
    url: 'https://poundtrades.app',
    blurb: 'A mobile marketplace for UK tradespeople — buy, sell and hire kit locally.',
    status: 'live',
  },
  {
    name: "Little Jonny's Catering",
    url: 'https://littlejonnyscatering.co.uk',
    blurb: 'Brand and booking site for a mobile catering company.',
    status: 'live',
  },
  {
    name: 'KLIQT Media',
    url: 'https://kliqt.co.uk',
    blurb: 'AI infrastructure and media venture inside the JonnyAI ecosystem.',
    status: 'live',
  },
  {
    name: 'Marineflex',
    url: 'https://marineflex.co.uk',
    blurb: 'Product-led site for a marine sealant and adhesive line.',
    status: 'building',
  },
];

// ── Socials ──────────────────────────────────────────────────────
export const socials = {
  linkedin: 'https://www.linkedin.com/in/jonnyallum/',
  github: 'https://github.com/jonnyallum',
  instagram: 'https://www.instagram.com/jonnyai.co.uk',
  tiktok: 'https://www.tiktok.com/@jonnyai',
  youtube: 'https://youtube.com/@jonnyaitube',
  facebook: 'https://www.facebook.com/share/1JT92LVV3M/',
};

export const hubSuiteUrl = 'https://hub-suite.co.uk';
