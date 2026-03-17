# jonnyai.co.uk — Full Rebuild Plan
**Architect:** jAIlbreakO.S (95-agent LangGraph system)
**Orchestrator:** Claude Code
**Target:** Production-ready site, deployed to Vercel
**Date:** 2026-03-15

---

## The Brief

Rebuild jonnyai.co.uk from scratch around a single coherent offer suite for small businesses and entrepreneurs. Remove all Antigravity Orchestra / Marcus / agent-roster branding. Position **Private AI Install** as the hero product. Clean, credible, converts.

---

## New Offering Suite

| Product | Type | Price |
|---|---|---|
| Private AI Install | One-time + retainer | £997–£1,997 + £149–299/mo |
| Website / App Build | One-time | £497–£4,997 |
| Automation Pack | One-time | £297–£497 |
| YouTube Automation | Monthly retainer | £500/mo |
| AI Workforce (SDR / Support) | Monthly retainer | £1,000/mo each |
| Social Autopilot | Monthly retainer | £299/mo |
| SEO Engine | Monthly retainer | £249/mo |
| Empire OS | Monthly retainer | £1,997–£19,997/mo |

---

## New Site Structure

```
jonnyai.co.uk
├── /                  Homepage — "Your Own AI. Installed in a Day."
├── /install           Private AI Install (anchor hero product)
├── /build             Websites & Apps
├── /automate          Packaged automations (n8n workflows)
├── /youtube           Automated YouTube channels
├── /workforce         AI SDR + Support agents
├── /empire            Empire OS (high-ticket, low nav prominence)
├── /brief             Single intake form — all services funnel here
├── /blog              Content / SEO
├── /story             About Jonny
├── /status            System status
├── /privacy           Privacy policy (UK GDPR)
└── /terms             Terms of service
```

**Remove:** /agentport, /review-coach, /ai-firewall, /dashboard (internal only)

---

## What Changes on Every Page

**Kill:**
- All agent names (Marcus, Priya, Sebastian, etc.)
- "Antigravity Orchestra" / "Orchestra" language
- "Jai.OS", "Shared Brain", "Glass Box"
- "Brief the Conductor"
- Agent rosters, tiers, SKILL.md references
- "67/95 agents" as a selling point

**Keep (reframed):**
- Dark aesthetic, neural canvas backgrounds
- citrus/signal colour palette
- Glass panel card style
- Framer Motion animations
- Neural node canvas

**New voice:** Confident, grounded, plain English. Not sci-fi. Not corporate. Sounds like someone who actually knows what they're doing and explains it simply.

---

## Agent Build Phases

### Phase 1 — INTELLIGENCE (Parallel, ~15 min)
*Agents: research_analyst, competitor_monitor*

- **research_analyst**: Market landscape for AI agency / AI install services for SMBs. What converts? What pain points? What are top competitors doing? Deliver: research brief with 10 key insights.
- **competitor_monitor**: Scrape and analyse top 3 AI agency sites. Deliver: competitive positioning matrix.

### Phase 2 — STRATEGY (Sequential, uses Phase 1, ~10 min)
*Agent: product_strategist*

- Full site architecture decision
- Conversion funnel design (hero → proof → offer → CTA)
- Pricing page structure
- CTA hierarchy across all pages
- Deliver: site strategy document

### Phase 3 — COPY (Parallel, uses Phase 2, ~20 min)
*Agents: content_scaler (×6 pages), seo_specialist*

- **content_scaler** fires 6 briefs (one per page): `/`, `/install`, `/build`, `/automate`, `/youtube`, `/workforce`
- Each delivers: hero headline, sub-headline, 3 feature blocks, pricing section copy, CTA text, FAQ (3 questions)
- **seo_specialist**: Meta title, meta description, H1, schema markup for all 7 pages

### Phase 4 — LEGAL (Sequential, ~8 min)
*Agent: legal_advisor*

- UK GDPR-compliant Privacy Policy
- Terms of Service for digital services / AI products
- Cookie policy snippet

### Phase 5 — LAUNCH (Sequential, uses all above, ~8 min)
*Agent: launch_orchestrator*

- Pre-launch checklist
- Social announcement copy (FB, IG, LinkedIn)
- Blog post: "Why we rebuilt everything"
- Email to existing clients

### Phase 6 — QUALITY GATE (~5 min)
*Agent: eval_judge*

- Score all copy outputs (depth, clarity, conversion potential, 1-10)
- Flag anything below 7 for re-run
- Deliver: final sign-off report

---

## Implementation (Claude Code)

After all agent outputs are collected:

1. **Strip** — Remove /agentport, /review-coach, /ai-firewall pages
2. **Rewrite** — Homepage, navbar, all landing pages using agent copy
3. **New pages** — /install, /automate, /youtube (don't exist yet)
4. **Update** — /empire, /build, /workforce with new copy (no agent names)
5. **SEO** — Apply all meta tags, schema markup from seo_specialist output
6. **Legal** — Paste privacy + ToS from legal_advisor output
7. **Nav** — Rebuild GlassNavbar with new structure
8. **Brief form** — Update /brief to reflect new offerings

---

## Design Constraints

- Keep: dark void background (#070708), citrus (#D97757), signal (green)
- Font: Outfit (headings), system mono (labels)
- Animations: Framer Motion fade-up on scroll, neural canvas hero
- Mobile-first, Lighthouse 95+
- No placeholder text, no Latin, no generic stock imagery
- Every price on the page — no "contact for quote" except Empire Full

---

## Delivery

All agent outputs saved to: `jonnyai.website/build-plan/outputs/`
Each phase output: `phase-[N]-[agent]-[page].md`
Master context: `build-plan/outputs/MASTER_CONTEXT.md`

Claude Code reads MASTER_CONTEXT.md and implements.

---

## Success Criteria

- [ ] Zero "Marcus" / "Orchestra" / "Antigravity" mentions on public site
- [ ] Private AI Install has its own dedicated page with clear pricing
- [ ] Every page has a single CTA pointing to /brief
- [ ] All 7 pages pass Lighthouse 95+
- [ ] Legal pages are UK GDPR compliant
- [ ] Deployed to Vercel and live on jonnyai.co.uk
