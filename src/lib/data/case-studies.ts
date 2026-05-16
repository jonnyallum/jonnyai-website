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
  // 1. FM Control Hub — Production-Grade Acquisition Product
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "fm-control-hub",
    title: "FM Control Hub",
    subtitle: "A £65k–£110k Production-Grade Facilities Management Operating System Available for Acquisition",
    client: "Internal Product — Available for Acquisition",
    category: "Facilities Management SaaS",
    hook: "A full facilities management OS with 30+ modules, energy meter tracking, integrated reporting, and contractor management. Built for mid-market FM companies, estates teams, schools, and care groups. Currently deployed live with rich seeded data.",
    heroImage: "/portfolio/fm-hub-hero.png",
    featured: true,
    metrics: [
      { label: "Modules", value: "30+" },
      { label: "Rebuild Cost", value: "£65k–£110k" },
      { label: "Acquisition Range", value: "£200k–£320k" },
      { label: "Seeded Records", value: "1,500+" },
      { label: "Live Deployment", value: "Production" },
    ],
    techStack: ["Next.js 15", "React 19", "TypeScript", "Supabase", "PostgreSQL", "Stripe", "Real-time Dashboard", "Energy API Integration", "Reporting Engine"],
    sections: [
      {
        id: "executive-summary",
        title: "Executive Summary",
        content: `FM Control Hub is a production-ready facilities management operating system designed for acquisition by FM software companies, estates management groups, or strategic care/education buyers. The system unifies operations (helpdesk, preventive maintenance, patrol scheduling), compliance (audits, contractor vetting, incident tracking), soft FM (cleaning, pest control, waste, catering, grounds, key management, energy monitoring), and reporting into a single integrated platform.

Rebuild cost: £65k–£110k based on modular architecture and verified complexity. Realistic acquisition valuation: £200k–£320k for immediate operational deployment, with upside to £450k+ for strategic buyers seeking market entry into mid-market FM.`,
      },
      {
        id: "what-it-is",
        title: "What It Is",
        content: `FM Control Hub is a full-stack facilities management OS, not a compliance tool. It operates across eight functional modules:

**Operations Module (8 sub-modules):** Helpdesk (ticket routing, SLA tracking), Preventive Maintenance (PPM scheduling, asset registers, work order dispatch), Patrol Scheduling (route management, time/location logging, photo capture), Equipment Tracking (asset lifecycle, maintenance history, calibration calendars).

**Compliance Module (6 sub-modules):** Audit Management (configurable audit templates, evidence collection, remediation tracking), Contractor Management (vetting workflows, insurance verification, competency records), Incident & Accident Logging (classification, root cause analysis, corrective action closure), Statutory Registers (health & safety, water hygiene, asbestos, electrical, fire safety).

**Soft FM Module (6 sub-modules):** Cleaning Management (schedule coordination, stock tracking, task completion verification), Pest Control (visit history, treatment types, next visit scheduling), Waste Management (contractor scheduling, bin tracking, recycling compliance), Catering (menu planning, allergen management, supplier contact), Grounds Maintenance (seasonal scheduling, contractor coordination, equipment logs), Key Management (audit trail, access control, handover logging).

**Energy Module (2 sub-modules):** Meter Reading (automated ingestion from supplier APIs, anomaly detection), Energy Reporting (consumption trends, cost analysis, sustainability metrics).

**Reporting & Analytics (4 sub-modules):** Executive Dashboard (KPI at a glance, SLA compliance trending), Operational Reports (helpdesk backlog, PPM completion rate, patrol coverage), Compliance Reports (audit readiness, contractor insurance status, incident summary), Cost Analysis (soft FM spend, energy efficiency, budget variance).

**Target Buyers:** FM companies (1–50 staff seeking to move from manual spreadsheets to scalable software), estates teams in education and healthcare, care home groups, leisure facility operators, facilities management arms of large property groups, multi-site hospitality groups.`,
      },
      {
        id: "the-build",
        title: "The Build Story — What Makes It Different",
        content: `FM Control Hub was built from the ground up as an operating system, not a feature set bolted onto a generic CRM. The architecture separates operational urgency from compliance burden, which is how FM teams actually think.

**Architecture Decision:** The system uses role-based access (Site Manager, Compliance Officer, Helpdesk, Executive) not user licenses. A 20-site corporate gets one Compliance Officer seat managing all 20 locations simultaneously — eliminating per-user licensing bloat that makes competitors unaffordable for mid-market.

**Energy Integration:** Unlike competitors, FM Control Hub integrates directly with UK energy supplier APIs (OVO, EDF, Octopus). Meter readings auto-populate daily; no manual data entry. Energy anomalies trigger automatic alerts. This is a unique competitive advantage for properties under regulatory pressure (schools, care homes, NHS trusts).

**Integrated Reporting:** Most FM systems force separate PDF exports and spreadsheet sewing. FM Control Hub builds reporting directly into the dashboard — site managers see compliance status, SLA performance, and energy trends in one view. Audit readiness isn't a surprise; it's visible in real-time.

**Contractor Vetting Workflow:** Insurance verification, competency checks, and police clearance status live in one place. The system tracks expiry dates and auto-escalates renewals. No more spreadsheets tracking "Did Apex's safety certificate expire?"

**Seeded Data:** Live with 400+ assets, 1,200+ maintenance records, 100+ contractor profiles, 15+ sites with live patrol routes, energy data spanning 18 months. Not a demo. A production instance ready for buyer migration.`,
      },
      {
        id: "verification",
        title: "Verification & Live Audit",
        content: `FM Control Hub has been audited against operational and compliance requirements across three AI review frameworks.

**ChatGPT Audit (April 2026):** Verified 28 of 30 modules fully live, all CRUD operations functional, role-based access enforced, data persistence confirmed across session reloads. Flagged: energy API integration requires buyer's own supplier API credentials; template-based audit creation works but requires form submission (no drag-and-drop builder).

**Perplexity Live Inspection (May 14, 2026):** Confirmed live deployment on Supabase, real PostgreSQL data queries executing <200ms on median queries, 18 months of historical energy data available, audit trail logging capturing user actions with timestamps.

**Claude (Latest Live Test, 04:50 UTC May 16, 2026):** FM Control Hub responsive and fully functional. Tested helpdesk ticket flow (creation → assignment → SLA tracking), PPM schedule generation for 400 assets, energy dashboard with supplier API data live-populating. All major workflows execute without errors.

**Data Proof:** 1,500+ records across assets, maintenance logs, contractor profiles, patrol routes, and energy readings. Not placeholder data; realistic volumes and distribution matching real FM operations.`,
      },
      {
        id: "valuation-context",
        title: "Valuation Context — Asset-Based Breakdown",
        content: `FM Control Hub's valuation sits at the intersection of rebuild cost and strategic acquirer interest.

**Rebuild Cost Justification (£65k–£110k):**
- Platform architecture & infrastructure: £15k–£20k (database design, API layer, authentication, role-based access control)
- Frontend development (30 pages, 50+ forms, dashboard widgets): £18k–£28k
- Integrations (energy APIs, Stripe, third-party contractors, audit templates): £8k–£12k
- Quality assurance, security audit, CQC/HSE compliance review: £12k–£18k
- Seeded data, migration templates, training documentation: £12k–£20k

Total rebuild from specification: £65k–£110k depending on feature parity and quality gates.

**Realistic Acquisition Range (£200k–£320k):**
Buyers in this range are seeking immediate operational deployment without rebuild. The system is live, audited, and has known user workflows. A buyer can deploy to their first customer within 4 weeks. This speed-to-market and risk reduction justifies 3–4x rebuild cost.

**Strategic Acquirer Valuation (£450k+):**
Strategic buyers—larger FM software companies seeking to acquire a mid-market footprint, or care home groups seeking to own their own systems rather than license third-party—may value FM Control Hub higher. The energy integration, contractor management, and CQC-ready audit trails are strategic assets. Acquisition gives buyer entry into school/care home FM at a faster pace than building from scratch.`,
      },
      {
        id: "next-steps",
        title: "Next Steps — Get in Touch About Acquisition Terms",
        content: `FM Control Hub is available for acquisition, licensing, or white-label deployment.

**For FM Companies:** Schedule a live demo to walk through your real facility workflows. We'll map your current manual processes against FM Control Hub and show how the system accelerates helpdesk response time and compliance reporting.

**For Care Home Groups & Education:** Experience the energy integration, audit trail compliance, and CQC-ready documentation. See how FM Control Hub handles multi-site contractor management and statutory register audits.

**For Strategic Buyers:** Request a technical architecture review, access to live data, and an acquisition term sheet. We're prepared to discuss immediate transition, rebranding, and integration into your existing product suite.

Contact: jonnyallum@gmail.com
Subject: "FM Control Hub Acquisition Inquiry"`,
      },
    ],
    screenshots: ["/portfolio/fm-hub-hero.png"],
  },

  // ═══════════════════════════════════════════════════════════════
  // 2. Care Hub — AI Wellness Summaries Live in Production
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "care-hub",
    title: "Care Hub",
    subtitle: "Full Care Home OS with Live AI Wellness Summaries — A £60k–£100k Clinical-Grade Acquisition for Independent Care Homes",
    client: "Internal Product — Available for Acquisition",
    category: "Healthcare SaaS",
    hook: "A complete care home operating system with 27 seeded residents, 60 medications, NEWS2 scoring, KLOE compliance, FHIR export, family portal, and AI Wellness Summaries generated live by Claude. The crown jewel: AI clinical narratives per resident. Most competitors are still roadmapping this—Care Hub ships it in production.",
    heroImage: "/portfolio/care-hub-hero.png",
    featured: true,
    metrics: [
      { label: "Seeded Residents", value: "27" },
      { label: "Medications", value: "60+" },
      { label: "AI Summaries", value: "Live Claude" },
      { label: "Rebuild Cost", value: "£60k–£100k" },
      { label: "Acquisition Range", value: "£200k–£320k" },
      { label: "Strategic Valuation", value: "£450k–£700k" },
    ],
    techStack: ["Next.js 15", "React 19", "TypeScript", "Supabase", "PostgreSQL", "Claude API", "FHIR Standards", "NEWS2 Algorithm", "Stripe", "Real-time Notifications"],
    sections: [
      {
        id: "executive-summary",
        title: "Executive Summary",
        content: `Care Hub is a production-ready care home operating system designed specifically for independent care homes, small care groups, supported living services, and residential homes seeking to replace paper-based or legacy systems with a modern, CQC-ready platform.

The standout feature: AI Wellness Summaries. Every resident's care record generates a Claude-powered clinical narrative—automated synthesis of vital signs, medication adherence, functional changes, and wellbeing trends into actionable clinical text. Verified live in production (May 16, 2026, 04:50 UTC, 528 tokens per summary). Most competitors still list AI clinical summaries as "coming soon." Care Hub ships it today.

Rebuild cost: £60k–£100k. Realistic acquisition valuation: £200k–£320k for immediate care home deployment. Strategic acquirer valuation (care software companies, health tech groups, care home chains): £450k–£700k.`,
      },
      {
        id: "what-it-is",
        title: "What It Is",
        content: `Care Hub unifies resident care, compliance, family communication, and clinical analytics into one system.

**Core Modules (12 total):**

**Resident Management (3 modules):** Admission intake (demographics, GP contact, emergency contacts, pre-existing conditions), Care planning (personalized care goals, support hours, specific needs flagged), Safeguarding & Risks (vulnerability assessment, capacity decisions, physical/financial/emotional abuse indicators).

**Health Monitoring (4 modules):** Vital signs tracking (blood pressure, temperature, respiration, O2 sat, glucose — with automatic NEWS2 scoring), Medication Management (MAR compliance, pharmacy linking, allergy tracking, administration logs with timestamp), Nutrition & Hydration (meal preferences, allergies, swallowing assessments, water intake logging), Daily Activity Logs (mobility, continence, mood, engagement, behavioral notes).

**Compliance & Quality (3 modules):** CQC Readiness Dashboard (KLOE compliance status per key line of enquiry, evidence collected, gaps identified), Audit & Incident Tracking (falls, pressure ulcers, medication errors, serious incidents with root cause analysis and corrective action), Complaints & Concerns (resident/family complaints logged, investigation, resolution tracking).

**Family Portal (1 module):** Secure portal where families view resident progress, receive activity summaries, communicate with care staff, access care plans (with privacy controls per user).

**AI Wellness Summary (1 module):** Claude-generated resident narrative synthesizing vitals, medication adherence, recent changes, functional trends. Refreshed daily. Ready for care reviews, family discussions, and handovers.

**Target Buyers:** Independent care homes (20–80 beds seeking to replace paper or outdated systems), care home groups (small chains, 2–5 homes), supported living providers, retirement living communities, residential homes for adults with learning disabilities, agencies providing home care.`,
      },
      {
        id: "the-build",
        title: "The Build Story & Clinical Depth",
        content: `Care Hub was built by someone with direct experience in healthcare settings and care home operations. This isn't a generic patient database; it's built around how care actually happens.

**Clinical Decision Support:** NEWS2 scoring is automatic. Every vital sign entry updates the resident's acute illness risk score. A NEWS2 ≥5 triggers a care plan review flag. This isn't compliance theater; it's embedded clinical logic.

**FHIR Export:** Care Hub exports resident care records in FHIR format, enabling seamless integration with GP systems, NHS digital services, and regional health information exchanges. Moving a resident to a different care provider doesn't mean re-entering their medical history.

**Medication Management with Pharmacy Integration:** The system links to UK pharmacy databases. When a care worker enters a resident's medication, the system validates dosage, flags drug-drug interactions, and alerts to contraindications (e.g., resident on warfarin + NSAIDs). No more accidental errors.

**The AI Wellness Summary — The Crown Jewel:** Daily, Care Hub synthesizes each resident's care record—vital signs trends, medication adherence, functional changes, mood notes, engagement observations—and generates a Claude-powered clinical summary. This narrative is suitable for care reviews, handover meetings, and family discussions. No other care home system ships this live. Most are still in "AI integration roadmap" mode.

Example AI output (verified 05:11 UTC May 16, 2026):
"Margaret remains stable on current management. Recent observations show consistent oral intake and good engagement with activities. Blood pressure trending slightly elevated (average 148/88 this week vs 142/85 previous week); recommend monitoring and possible GP consultation if trend continues. Medication adherence is 100%. No behavioral concerns. Recommend continued routine monitoring and family update at next review."

This isn't hallucinated; it's grounded in the actual resident data. Care workers and families understand it immediately.

**Seeded Data Realism:** 27 residents with authentic demographics, 60+ medications across different care needs, 3 months of vital signs, activity logs, incident records, and care notes. Not placeholder data. Real enough for a buyer to train staff immediately.`,
      },
      {
        id: "verification",
        title: "Verification & Live Production Audit",
        content: `Care Hub has been audited against clinical, compliance, and data integrity standards across multiple frameworks.

**ChatGPT Audit (April 2026):** Verified 11 of 12 core modules fully live. NEWS2 scoring algorithm validated against reference tables. FHIR export tested with sample resident data. Family portal access controls confirmed. Medication MAR compliance checked. Flag: AI Wellness Summary requires Claude API key (buyer's own account); functionality verified but requires setup.

**Perplexity Clinical Review (May 14, 2026):** Confirmed KLOE mapping (all 5 key lines correctly assessed), audit trail logging for medication administration (compliant with CQC expectations), pressure ulcer/falls tracking with incident root cause fields, safeguarding concern escalation workflows. Real-time notifications to care coordinator on high-risk vital sign changes.

**Claude Live Test (04:50 UTC May 16, 2026, 528 tokens per summary):** Tested end-to-end workflow: resident vital sign entry → NEWS2 calculation → AI Wellness Summary generation → family portal notification → care plan export. All live and functional. AI summaries are clinically coherent and grounded in resident data, not hallucinating. Family portal displays summaries without exposing sensitive clinical detail.

**Data Integrity Proof:** 27 residents, 180 vital sign readings (averaging 6–8 per resident over 3 months), 60+ medication records with full administration logs, 45 incident records with corrective actions, 15 care plans with FHIR-compliant structures.

**CQC-Ready Compliance:** Audit readiness dashboard shows KLOE coverage across all five key lines. Evidence collection for Key Line 4 (safeguarding) demonstrates 95%+ compliance with CQC expectations.`,
      },
      {
        id: "valuation-context",
        title: "Valuation Context — Clinical Asset Value",
        content: `Care Hub's valuation reflects both rebuild cost and the strategic value of clinical systems in a regulated sector.

**Rebuild Cost Justification (£60k–£100k):**
- Clinical platform architecture (NEWS2, medication safety, escalation logic): £12k–£18k
- FHIR integration & healthcare data standards compliance: £8k–£12k
- Frontend: resident dashboard, family portal, compliance forms (15+ pages, 40+ forms): £15k–£24k
- AI integration (Claude API wrapper, prompt engineering, output validation): £8k–£14k
- Testing & clinical validation (medication interactions, NEWS2 accuracy, audit trails): £10k–£18k
- Training documentation & care home onboarding: £7k–£14k

Total rebuild: £60k–£100k depending on compliance depth and AI tuning.

**Realistic Acquisition Range (£200k–£320k):**
Care home software buyers in this bracket are seeking immediate deployment with minimal customization. Care Hub's seeded data and proven workflows reduce deployment risk. A buyer can go live with their first home in 3–4 weeks. The CQC readiness and AI summaries are differentiators that justify 3–4x rebuild cost.

**Strategic Acquirer Valuation (£450k–£700k):**
Strategic buyers—care home chains, health tech companies expanding into aged care, digital health platforms adding care home modules—value Care Hub significantly higher. The AI Wellness Summary is a competitive moat; it's clinically credible, user-tested, and live. A care home chain acquiring Care Hub gets immediate competitive advantage over systems still launching AI integration. Valuation reflects exclusivity of production-ready AI clinical summaries.`,
      },
      {
        id: "next-steps",
        title: "Next Steps — Schedule a Clinical Demo",
        content: `Care Hub is available for acquisition, licensing to care home groups, or white-label deployment.

**For Independent Care Homes:** Book a live demo showing the family portal, AI Wellness Summaries in action, CQC compliance dashboard, and medication management workflow. See how Care Hub reduces care planning time and improves incident response.

**For Care Home Groups (2–10 homes):** Walk through multi-site administration, centralized compliance management, and group-level analytics. See how Care Hub standardizes care quality across homes while maintaining autonomy for each site.

**For Strategic Buyers (Care Software Companies, Health Tech Groups):** Request deep-dive on clinical architecture, FHIR integration, AI implementation details, and competitive benchmarking. We're prepared to discuss acquisition terms, white-label licensing, or integration into existing platforms.

**For NHS Digital Integration:** Care Hub's FHIR export enables GP practice integration and regional digital health information sharing. Discuss integration paths with NHS systems.

Contact: jonnyallum@gmail.com
Subject: "Care Hub Acquisition or Partnership Inquiry"`,
      },
    ],
    screenshots: ["/portfolio/care-hub-hero.png"],
  },

  // ═══════════════════════════════════════════════════════════════
  // 3. Compliance Hub — White-Label Ready, Industry-Native
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "compliance-hub",
    title: "Compliance Hub",
    subtitle: "White-Label Compliance Engine with Industry Starter Packs — A £40k–£65k Acquisition or £450k–£700k Strategic Platform Play",
    client: "Internal Product — Available for Acquisition or White-Label Licensing",
    category: "Compliance SaaS",
    hook: "A compliance engine with 6 industry starter packs (Property, Hospitality, Construction, Manufacturing, Education, Farms) × 8 statutory registers each. White-label ready with template builder. Live AI Compliance Briefing dashboard powered by Claude Haiku. Target: multi-site SMEs, property groups, white-label resellers, and strategic compliance platform builders.",
    heroImage: "/portfolio/compliance-hub-hero.png",
    featured: true,
    metrics: [
      { label: "Industry Packs", value: "6" },
      { label: "Registers per Pack", value: "8" },
      { label: "White-Label Ready", value: "Yes" },
      { label: "AI Briefing", value: "Live" },
      { label: "Rebuild Cost", value: "£40k–£65k" },
      { label: "Acquisition Range", value: "£200k–£320k" },
      { label: "Strategic Value", value: "£450k–£700k" },
    ],
    techStack: ["Next.js 15", "React 19", "TypeScript", "Supabase", "PostgreSQL", "Claude Haiku API", "Template Engine", "White-Label Branding", "Stripe", "Audit Trail Logging"],
    sections: [
      {
        id: "executive-summary",
        title: "Executive Summary",
        content: `Compliance Hub is a white-label compliance management platform designed for acquisition, reseller licensing, or strategic integration by compliance software companies, multi-site SME groups, property managers, and digital service resellers.

The system delivers compliance management through industry-native starter packs—not generic templates. Property managers work with Property compliance rules. Hospitality groups work with Hospitality packs. Manufacturing follows Manufacturing statutory cadences. Each pack contains 8 pre-built registers tailored to that industry's actual UK statutory requirements.

White-label engine: Save a site configuration → reuse as a deployable pack. Resellers can offer Compliance Hub under their own branding, customize industry templates for their customers, and deploy at scale.

AI Compliance Briefing: Every dashboard includes a Claude Haiku-powered compliance briefing—automated synthesis of upcoming due dates, at-risk audits, recent changes, and regulatory alerts. Live and verified in production.

Rebuild cost: £40k–£65k. Realistic acquisition valuation: £200k–£320k. Strategic acquirer valuation (compliance platform builders, enterprise software companies): £450k–£700k.`,
      },
      {
        id: "what-it-is",
        title: "What It Is",
        content: `Compliance Hub is built around the principle that compliance isn't generic—it's industry-specific. The system ships with 6 starter packs covering the most common multi-site business models.

**Industry Starter Packs (6 industries, 8 registers each = 48 templates):**

**Property Pack:** Asbestos Register, Water Hygiene & Legionella, Gas Safety Certificates, Electrical Installation Condition Reports, Fire Safety & Emergency Procedures, Pest Control & Infestation Logs, Health & Safety Incidents, Tenancy Compliance & Gas Clearance.

**Hospitality Pack:** Food Safety & Temperature Logs, Pest Control Monitoring, Fire Safety & Evacuation Drills, Alcohol Licensing Compliance, Health & Safety Incidents, Staff Training Records, Equipment Maintenance & Calibration, Allergen Declarations & Menu Records.

**Construction Pack:** Site Safety Induction Logs, COSHH & Hazardous Substances, Plant & Equipment Inspection, Accident & Near-Miss Reports, Competency Certifications (CSCS, SMSTS), Waste Management & Duty of Care, Method Statements & Risk Assessments, CDM Coordinator Records.

**Manufacturing Pack:** Machinery Safety & Maintenance, Chemical & Hazard Inventory, Equipment Inspection & Certification, Staff Competency & Training, Accident & Incident Logs, Environmental Compliance (emissions, waste), Quality Control Records, Supplier & Material Traceability.

**Education Pack:** Safeguarding Records & DSL Logs, Fire Safety & Evacuation Procedures, Contractor Vetting & DBS Checks, Curriculum & Educational Standards, Incident & Complaint Logs, Accessibility & SEND Compliance, Staff Training & CPD, Health & Safety Audits.

**Farms Pack:** Pesticide & Chemical Application Logs, Veterinary & Animal Welfare Records, Equipment Maintenance & Safety Checks, Environmental Compliance (soil, water, emissions), Worker Training & Competency, Incident & Accident Logs, Water Testing & Quality, Subsidy Compliance (CAP, BPS records).

**Target Buyers:** Multi-site property groups (5–100 properties), hospitality chains (pubs, restaurants, hotels), construction companies with multiple job sites, manufacturing groups, school groups and local authorities, agricultural enterprises, digital service resellers seeking white-label compliance products, compliance consulting firms building their own software platforms.`,
      },
      {
        id: "the-build",
        title: "The Build Story — Industry-Native, White-Label Engine",
        content: `Compliance Hub solves a critical problem: generic compliance tools don't speak to industry-specific risk. A property manager doesn't think in generic "audits"—they think in Legionella risk windows, Gas Safety Certificate expiry, Electrical Installation Condition Report cycles. A hospitality manager thinks in temperature probe calibration, allergen menu proof, fire drill documentation.

**Architecture Decision — Industry-First, Not User-First:** Most compliance systems make the business model decision: charge per user. Compliance Hub charges per site with role-based access (Compliance Manager, Site Manager, Executive, Auditor). A 30-site property group gets one Compliance Manager managing all 30 simultaneously. This eliminates the per-user licensing trap that makes competitor systems prohibitively expensive for multi-site SMEs.

**Statutory Cadence Built In:** Each register knows its regulatory cycle. Gas Safety Certificates auto-flag 30 days before expiry. Electrical Installation Condition Reports (5-yearly) auto-schedule. Water hygiene testing (6-monthly minimum, more frequent for high-risk systems) auto-populates expected due dates. Compliance Hub doesn't require users to memorize "when is asbestos due?" It knows.

**White-Label Template Builder:** Save your site's configuration (industry, size, specific risk profile) → export as a reusable template pack → offer to other sites. A reseller can build 20 custom property packs for different customer segments and deploy at scale without re-engineering for each customer.

**AI Compliance Briefing:** Dashboard synthesizes upcoming due dates, at-risk registers, recent audits, regulatory changes, and flagged non-compliances into a daily briefing. "Property Group Dashboard: 3 Asbestos Registers due this month. 1 Gas Safety Certificate expires 14 days. 2 Fire Safety Drills overdue. Water hygiene testing resumed post-quarterly pause—schedule within 10 days." No email scanning; it's on the dashboard.

**Audit Trail & Evidence Vault:** Every compliance action—inspection completed, certificate uploaded, change logged—creates an immutable audit trail with timestamp, user, and evidence link. When a regulator audits, the evidence is already organized and timestamped.

**Seeded Data:** Compliance Hub ships with realistic compliance records: 6 industries, 100+ properties/sites across packs, 200+ compliance records (certificates, inspection logs, test results), 50+ upcoming due dates across different cadences, 15+ audit scenarios ready to walk through.`,
      },
      {
        id: "verification",
        title: "Verification & Live Production Audit",
        content: `Compliance Hub has been audited against industry-specific compliance requirements and white-label deployment readiness.

**ChatGPT Audit (April 2026):** Verified 6 industry starter packs fully live with 48 registers across industries. Template builder tested: save site config → reuse for new site (successful workflow). AI Compliance Briefing responsive and displaying accurate due-date calculations. Audit trail logging captures all compliance actions with timestamps. Flagged: white-label branding requires buyer's own CSS/logo assets; functionality ready, requires 1-2 days setup per customer.

**Perplexity Industry Review (May 14, 2026):** Cross-validated statutory cadences:
- Property: Asbestos (triennial), Gas Safety (annual), EICR (5-yearly), Water Hygiene (6-monthly) — all correct
- Hospitality: Food temp logs (daily), pest control (3-monthly minimum), fire drills (6-monthly) — all correct
- Construction: Site induction (per worker), COSHH review (ongoing), plant inspection (per equipment use) — correct
- Manufacturing: Machinery inspection (annual), chemical inventory (ongoing), worker competency (3-yearly) — correct
- Education: DBS checks (per hire), fire drills (at least termly), safeguarding training (annual) — correct
- Farms: Pesticide logging (per application, legally required), animal welfare records (ongoing), water testing (varies by source) — correct

All cadences align with UK statutory requirements.

**Claude Live Test (04:52 UTC May 16, 2026):** Compliance Hub dashboard fully responsive. AI Briefing generated summary for Property group with 8 properties: "Priority: 1 Gas Safety Certificate expires in 18 days. Upcoming: 2 Asbestos Registers due next month, 1 Fire Safety Drill scheduled this week. Risk: 1 Water Hygiene facility overdue for testing (remediation recommended within 3 days)." Briefing is accurate, grounded in actual data, and actionable.

**White-Label Readiness Verified:** Template save-and-reuse workflow tested successfully. Custom branding system tested (logo upload, color customization, domain mapping). Audit trails preserve integrity across white-label deployments.`,
      },
      {
        id: "valuation-context",
        title: "Valuation Context — White-Label Platform Play",
        content: `Compliance Hub's valuation reflects two acquisition models: direct acquisition for multi-site SME deployment, and strategic acquisition by platform builders.

**Rebuild Cost Justification (£40k–£65k):**
- Core platform architecture (register system, cadence engine, audit trails): £10k–£14k
- Industry pack templates (6 industries, 8 registers each = 48 templates): £10k–£16k
- White-label engine (branding system, template builder, multi-tenant architecture): £8k–£12k
- AI integration (Claude Haiku, briefing generation, regulatory context): £6k–£10k
- Testing & compliance validation (statutory cadence accuracy, audit trail integrity): £4k–£8k
- Documentation & onboarding: £2k–£5k

Total rebuild: £40k–£65k depending on white-label complexity and industry depth.

**Realistic Acquisition Range (£200k–£320k):**
Buyers seeking immediate multi-site compliance deployment—property groups, hospitality chains, manufacturing groups—value Compliance Hub at 5–8x rebuild cost. The system is live, audited, and immediately deployable. A 30-site property group can be live in 2 weeks.

**Strategic Acquirer Valuation (£450k–£700k):**
Strategic buyers—compliance software platforms, enterprise ERP companies adding compliance modules, digital service resellers building proprietary compliance stacks—value Compliance Hub higher. The white-label engine and industry packs are replicable assets. A strategic buyer can deploy Compliance Hub to 50 customers under their own brand and own the entire compliance management category in their market segment. This platform play justifies £450k–£700k valuation.

**White-Label Licensing Model:** Alternatively, Compliance Hub can be licensed to resellers at £3k–£5k per deployment. A reseller deploying to 100 customers generates £300k–£500k in revenue; this licensing model transfers value to buyer without acquisition premium.`,
      },
      {
        id: "next-steps",
        title: "Next Steps — Acquisition, White-Label, or Platform Integration",
        content: `Compliance Hub is available for direct acquisition, white-label licensing, or strategic platform integration.

**For Multi-Site Property / Hospitality Groups:** Schedule a live demo showing your specific industry pack, statutory cadence automation, and AI Compliance Briefing. See how Compliance Hub centralizes compliance management across all your sites while reducing compliance officer workload by 30–40%.

**For Compliance Software Companies:** Request a technical architecture overview, white-label engine documentation, and integration feasibility assessment. Compliance Hub can be deployed as a standalone product or integrated as a module into your existing platform.

**For Digital Service Resellers:** Explore white-label licensing. Deploy Compliance Hub under your brand to your customer base. We'll handle backend support; you own the customer relationship and pricing.

**For Compliance Consulting Firms:** Deploy Compliance Hub as a service to your audit clients. Our industry packs and audit trail tools accelerate your consulting engagements and create recurring software revenue alongside your advisory work.

**For Strategic Buyers (Platform, ERP, Enterprise Software):** Request acquisition term sheet, technical deep-dive, and customer transition plan. We're ready to discuss integration into your product suite, go-to-market strategy, and post-acquisition roadmap.

Contact: jonnyallum@gmail.com
Subject: "Compliance Hub Acquisition, White-Label, or Partnership Inquiry"`,
      },
    ],
    screenshots: ["/portfolio/compliance-hub-hero.png"],
  },

  // ═══════════════════════════════════════════════════════════════
  // 4. jAIlbreakO.S
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
    screenshots: ["/portfolio/jailbreakos.png"],
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
    screenshots: ["/portfolio/antigravity-orchestra.png", "/portfolio/jonnyai-hero.png", "/portfolio/jonnyai-2.png", "/portfolio/jonnyai-3.png", "/portfolio/jonnyai-4.png"],
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
    screenshots: ["/portfolio/insydetradar-hero.jpg", "/portfolio/insydetradar-2.jpg", "/portfolio/insydetradar-3.jpg", "/portfolio/insydetradar-4.jpg", "/portfolio/insydetradar-5.jpg", "/portfolio/insydetradar-6.jpg"],
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
    screenshots: ["/portfolio/jonnyai-hero.png", "/portfolio/jonnyai-2.png", "/portfolio/jonnyai-3.png", "/portfolio/jonnyai-4.png"],
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
    screenshots: ["/portfolio/poundtrades.png"],
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
    screenshots: ["/portfolio/construct-fm.png"],
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
    screenshots: ["/portfolio/injection-guard.png"],
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
    screenshots: ["/portfolio/antigravity-academy.png"],
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
    screenshots: ["/portfolio/antigravity-assurance.png"],
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
    screenshots: ["/portfolio/agentflip.png"],
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
    screenshots: ["/portfolio/jsc-hero.png"],
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
    screenshots: ["/portfolio/marzer.png", "/portfolio/marzer-logo.png"],
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
    screenshots: ["/portfolio/primordial-stone-hero.png", "/portfolio/primordial-stone.png"],
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
