# VENTURE PLAN: ANTIGRAVITY ASSURANCE
**AI Agent Risk Assessment — Enterprise**
**Lead: @jasper (BD) + @luna (Legal) + @sebastian (Build)**
**Status: PRE-MORTEM COMPLETE — APPROVED FOR BUILD**
**Date: 2026-02-25**

---

## THE OPPORTUNITY

Enterprises are deploying AI agents into production at scale. A single failure — hallucinated medical advice, leaked financial data, a prompt-injected customer support bot giving away 100% discount codes — creates legal, financial, and reputational liability.

**The market has no answer yet.** There is no standardised product that:
1. Assesses the risk profile of an AI agent before deployment
2. Produces a report that insurers, boards, and legal teams can act on
3. Certifies agents as "deployment-ready" with a verifiable audit trail

Testudo is launching at Lloyd's for AI underwriting. UC Berkeley published the framework this week.
**The window is open. We move now.**

---

## WHAT WE ARE (AND ARE NOT)

### We ARE:
A **Risk Assessment Consultancy** for AI agent deployments.
We produce a standardised "Antigravity Risk Report" using the Gold Standard 13-gate methodology.
Clients pay for the assessment. The report is insurer-readable.

### We are NOT:
An insurer. An insurance intermediary. An FCA-regulated firm.

**This distinction is critical.** Selling or referring insurance products requires FCA authorisation
(Insurance Distribution Directive). Providing risk assessment consulting does NOT.
The moment we say "buy this policy from X" and take a commission = FCA territory.
The moment we say "here is your risk report, here are some insurers you could approach" = clean.

---

## PRE-MORTEM: PROBLEMS BEFORE THEY ARRIVE

### PROBLEM 1 — FCA Regulatory Trap
**Risk**: We accidentally become an insurance intermediary by taking referral fees from insurers.
**Severity**: HIGH — fines, forced shutdown, reputational damage.
**Solution**: Revenue comes ONLY from assessment fees. We never sell, refer, or earn commission from insurance products. If we eventually want to refer, @luna structures a formal Appointed Representative agreement with an FCA-authorised firm.
**Gate**: @luna reviews all partnership agreements before signing. No exceptions.

### PROBLEM 2 — "Bad Assessment" Liability
**Risk**: We rate an agent as "low risk." It causes a £500k loss. Client sues us for negligent assessment.
**Severity**: HIGH.
**Solution**:
- All reports include a clear disclaimer: "This assessment reflects the agent's behaviour at time of testing. Antigravity does not guarantee future performance."
- We carry Professional Indemnity Insurance ourselves (Hiscox PI cover for consultancies — approx £500/yr for £100k cover).
- Reports explicitly state they are not insurance products and do not confer liability.
**Gate**: @luna drafts the standard disclaimer language before first client report.

### PROBLEM 3 — No Actuarial Baseline
**Risk**: Insurers ask "what's your loss history?" We have none. No one does. They can't price the risk.
**Severity**: MEDIUM.
**Solution**: We don't need insurers to use our reports yet. Phase 1 is pure assessment revenue. Phase 2 (6 months in) is presenting aggregated (anonymised) risk data to insurers as a dataset. By then we have 50+ assessments = a real dataset. That data is what makes the insurer partnership possible.
**Reframe**: We're building the actuarial database that doesn't exist yet. That database IS the moat.

### PROBLEM 4 — "What are you actually testing?"
**Risk**: Clients ask what the 13 gates actually are. We either reveal our IP or look like we're hiding something.
**Severity**: MEDIUM.
**Solution**: SOP-005 (Black Box) from Gold Standard applies here too. We publish the *categories* of risk we assess (Prompt Injection, Identity Fragmentation, Data Leakage, Logic Parity, etc.) but not the specific test vectors. Same as a penetration testing firm — they don't publish their full exploit library.

### PROBLEM 5 — Testudo / CFC / Coalition beat us to market
**Risk**: A well-funded insurtech launches a competing product before we get traction.
**Severity**: MEDIUM.
**Solution**: Our moat is NOT being first. It's being the *independent* assessor with a verifiable, AI-built methodology. The big firms are building for enterprise FTSE 500 clients. We serve the SME AI builder market — agencies, startups, SaaS companies with AI features. Different buyer, different price point, different urgency.

### PROBLEM 6 — Sales cycle too long
**Risk**: Enterprise procurement takes 6-12 months. We run out of runway.
**Severity**: HIGH for enterprise. LOW if we stay SME.
**Solution**: Target buyer is NOT a FTSE 500 procurement team. Target buyer is:
- A startup CTO who just integrated an AI agent and needs a report for their Series A investors
- An AI agency owner who wants to offer "certified" work to clients
- A SaaS company whose enterprise customer is asking "has this been audited?"
These buyers can approve £2k in 24 hours. No procurement committee.

---

## BUSINESS MODEL

### Phase 1 — Assessment Revenue (Month 1-3)
| Product | Price | Target | Month 3 MRR |
| :--- | :--- | :--- | :--- |
| Standard Agent Audit | £997 | Startups, AI agencies | £9,970 (10/mo) |
| Enterprise Agent Audit | £2,497 | Scale-ups, Series A+ | £7,491 (3/mo) |
| Monthly Monitoring Add-on | £199/mo | Post-audit clients | £1,990 (10 clients) |
| **TOTAL** | | | **~£19,451/mo** |

### Phase 2 — Data Asset (Month 4-6)
- Aggregate anonymised risk data from 50+ assessments
- Package as "Agentic Risk Index" — quarterly published report
- License to insurtech firms as underwriting data feed: £5k/quarter per firm

### Phase 3 — Insurer Partnership (Month 7+)
- Formal referral arrangement with FCA-authorised insurtech (via @luna's Appointed Representative structure)
- Assessment fee + % of policy premium
- Requires: FCA AR registration, PI insurance, proper contracts

---

## BRAND DECISION: FRESH VENTURE

**Not on jonnyai.co.uk.**

Reason: Enterprise clients buying a £2,497 risk assessment need to trust the brand independently. "Antigravity Assurance" or "AgentAssure" needs its own domain, its own look, corporate credibility. jonnyai.co.uk is the creative agency that BUILT the methodology — it's the proof, not the product.

**Recommended domain**: `antigravity-assurance.com` or `agentassure.io`
**Visual identity**: Grayscale, precision engineering aesthetic — think Lloyd's meets McKinsey, not a tech startup
**Brand**: @vivienne to design. Completely separate from Neural Nova palette.

---

## BUILD PLAN

### Week 1 (Now)
- [ ] @luna: Draft client disclaimer language + "Antigravity Risk Report" template
- [ ] @luna: Research Appointed Representative route for Phase 3
- [ ] @jasper: Identify 10 target prospects (AI agencies, SaaS with AI features, Series A startups)
- [ ] @sebastian: Build `antigravity-assurance.com` — 1 page, enterprise landing, waitlist capture
- [ ] @vivienne: Brand identity brief — corporate, precision, not tech-bro

### Week 2
- [ ] @vigil: Formalise the 13-gate assessment process as a client-facing deliverable (not IP)
- [ ] @elena: Write the enterprise sales copy — "Your AI agent failed in production. Who pays?"
- [ ] @jasper: First 3 outreach emails sent to prospects
- [ ] Get PI insurance (Hiscox online — 30 min job)

### Week 3
- [ ] First pilot assessment run (ideally Antigravity's own Gold Standard agent as a demo)
- [ ] Produce sample report — 10-page PDF, branded, shareable
- [ ] @jasper: Use sample report as sales tool — "Here's what you get"

### Target: First paying assessment by 2026-03-15

---

## NORTH STAR METRIC
**10 assessments/month by Month 3 = £19k MRR**

---
*Pre-mortem by @marcus + @scholar + @luna | Approved: 2026-02-25*
