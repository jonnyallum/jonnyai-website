# n8n Automation Task List — Antigravity Orchestra

_Curated by @Alex (The Machine) & @Nathan (The Automation) | March 2026_
_Source: Perplexity research + community best practices_

---

## Priority 1: Revenue & Client Impact (Build This Week)

### 1. Automated Lead Capture → CRM Pipeline

- **Trigger:** New form submission (website contact form, FB lead ad)
- **Flow:** Capture lead → enrich with Clearbit/Hunter → create Supabase record → notify Slack/WhatsApp → trigger welcome email via Resend
- **Gravy Index:** 9/10 — Direct revenue pipeline. Every hour saved here is a client won faster.
- **Owner:** @Nathan + @Felix

### 2. Client Onboarding Automation

- **Trigger:** New project added to Supabase `projects` table
- **Flow:** Generate welcome pack email → create project Slack channel → assign agents → schedule kickoff → send client portal invite
- **Gravy Index:** 8/10 — Professional first impression, zero manual effort.
- **Owner:** @Nathan + @Hannah

### 3. Invoice & Payment Reminder Pipeline

- **Trigger:** Milestone completed / date-based
- **Flow:** Generate invoice (Stripe/manual) → email to client → track payment status → send reminder at 7/14/30 days → escalate to @Jasper if unpaid
- **Gravy Index:** 9/10 — Cash flow is oxygen. Automate the chase.
- **Owner:** @Nathan + @Finops

---

## Priority 1B: Monetisation & Outreach (Build This Week)

### 13. Cold Outreach Drip Campaign Engine

- **Trigger:** New lead added to `prospects` table / manual CSV import
- **Flow:** AI-personalise first email (scrape their site) → send via Resend → wait 3 days → if no reply, send follow-up → if reply, alert @Jasper → track open/click rates
- **Gravy Index:** 10/10 — Revenue generator #1. Every agency needs outbound.
- **Owner:** @Nathan + @Boyce + @Elena

### 14. Inbound Email Auto-Responder & Classifier

- **Trigger:** New email received (Postmark inbound webhook / n8n email trigger)
- **Flow:** AI classify intent (enquiry/support/spam/invoice) → auto-respond with branded template → route to correct handler → log to CRM → escalate urgent
- **Gravy Index:** 9/10 — Never miss an enquiry again. 24/7 professional response.
- **Owner:** @Nathan + @Hannah

### 15. Proposal & Quote Generator

- **Trigger:** On-demand / after discovery call logged
- **Flow:** Pull client requirements from CRM → AI-generate custom proposal (PDF) → send for review → auto-send after approval → track opens
- **Gravy Index:** 8/10 — Cuts proposal time from hours to minutes.
- **Owner:** @Nathan + @Jasper + @Elena

### 16. Referral & Review Request Pipeline

- **Trigger:** Project marked as "completed" in Supabase
- **Flow:** Wait 7 days → send satisfaction survey → if positive, request Google/Trustpilot review → offer referral incentive → track referrals
- **Gravy Index:** 8/10 — Social proof compounds. One review = £1000s in trust.
- **Owner:** @Nathan + @Successbot

### 17. Upsell & Cross-Sell Trigger

- **Trigger:** Client milestone (3 months active / project completed / usage threshold)
- **Flow:** AI analyse client history → identify upsell opportunity → generate personalised offer → send via email → alert @Jasper if interested
- **Gravy Index:** 9/10 — 5x easier to sell to existing clients than new ones.
- **Owner:** @Nathan + @Felix + @Boyce

---

## Priority 2: Operations & Efficiency (Build This Month)

### 4. Daily Social Media Auto-Scheduler

- **Trigger:** Cron (8am daily)
- **Flow:** Pull from content_calendar table → generate copy via Social Engine → quality gate → publish to FB/IG/LinkedIn → log results
- **Gravy Index:** 8/10 — Solves today's "no posts" problem permanently.
- **Owner:** @Nathan + @Contentforge

### 5. Automated Data Backup & Health Reports

- **Trigger:** Cron (midnight daily)
- **Flow:** Export Supabase tables → store in GCS/S3 → run health checks (row counts, null checks) → email summary report
- **Gravy Index:** 7/10 — Insurance policy. Worth its weight when disaster strikes.
- **Owner:** @Nathan + @Derek

### 6. Support Ticket Router & Auto-Responder

- **Trigger:** New email to support@ / new form submission
- **Flow:** Classify intent (AI) → route to correct agent → auto-respond with estimated time → create ticket in Supabase → escalate if urgent
- **Gravy Index:** 7/10 — Professional client handling, 24/7.
- **Owner:** @Nathan + @Hannah

### 7. E-Commerce Order Alert & Stock Sync (BL Motorcycles)

- **Trigger:** New eBay order / stock level change
- **Flow:** Parse order → check inventory → alert if low stock → update Supabase → notify Brett via WhatsApp → create dispatch task
- **Gravy Index:** 9/10 — Already partially built. Complete the loop.
- **Owner:** @Nathan + @Winston

---

## Priority 3: Intelligence & Growth (Build Next Month)

### 8. AI-Powered Customer Segmentation

- **Trigger:** Weekly cron
- **Flow:** Pull customer data → AI clustering by behavior/spend → tag segments in CRM → trigger personalised campaigns per segment
- **Gravy Index:** 6/10 — Long-term play. Compounds over time.
- **Owner:** @Nathan + @Maya

### 9. Competitor Intel Auto-Monitor

- **Trigger:** Daily cron
- **Flow:** Scrape competitor sites/social → detect changes (price, new features, messaging) → AI summarise → email digest to Jonny
- **Gravy Index:** 7/10 — Know what they're doing before they announce it.
- **Owner:** @Nathan + @Sophie

### 10. Blog & SEO Content Pipeline

- **Trigger:** Weekly / on-demand
- **Flow:** Research trending keywords → generate blog draft (AI) → quality gate → publish to CMS → create social teasers → schedule promotion
- **Gravy Index:** 8/10 — Organic traffic machine. One post = months of SEO juice.
- **Owner:** @Nathan + @Elena + @Grace

### 11. Weekly Client Performance Report

- **Trigger:** Friday 5pm cron
- **Flow:** Pull GA4/Supabase metrics per client → generate HTML report (like today's standard) → email to client + CC Jonny
- **Gravy Index:** 8/10 — Client retention through transparency.
- **Owner:** @Nathan + @Nina

### 12. Project Deadline & Overdue Escalator

- **Trigger:** Daily check against project milestones
- **Flow:** Compare due dates vs completion → if overdue → notify team lead → escalate to @Julian → alert Jonny if 48h+ overdue
- **Gravy Index:** 7/10 — Nothing slips through the cracks.
- **Owner:** @Nathan + @Chronos

---

## Already Built (Active on VPS)

- [x] BL Motorcycles Order Router
- [x] Dispatch Email Workflow
- [x] Overdue Escalator
- [x] Oversell Guard
- [x] Weekly Summary Reporter

---

## Dreamer's Recommendation

> "Build one new moving part every day. The compound effect of 30 automations in 30 days turns Antigravity from a consultancy into a SaaS-grade machine. Start with #4 (Social Auto-Scheduler) — it fixes today's gap immediately. Then #1 (Lead Capture) because that's direct revenue. The rest compound."
>
> — @Dreamer, "The Gravy" 🍖

---

_Last updated: 2026-03-05 | Jai.OS 5.0_
