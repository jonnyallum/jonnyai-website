# Twenty CRM — High-Velocity Ecosystem Architecture & Monetization

Last Updated: 2026-03-09
Author: @Marcus + Antigravity Hive Mind

## Overview

This document records the exact architectural blueprint, technical landmines, and deployment strategy for turning the open-source Twenty CRM into a $5,000–$10,000/month "AI-Infused OS" for client businesses. We have successfully proven the end-to-end circuit integrating a self-hosted Twenty CRM instance with a Supabase Shared Brain, n8n active orchestration, and our AI Swarm.

By standardizing this, Antigravity can now offer "Autonomous Enterprise OS" as a productized service.

---

## 1. Core Architecture (The Circuit)

The value prop of our CRM is not just "contact management" — it is **Autonomous Intelligence**.

Here is the exact circuit:

1. **The Human Layer (Twenty CRM):** Hosted on VPS via Docker Compose. The human team interacts here. Notes, status changes, manual triggers.
2. **The Nerve Center (n8n Webhooks):** A central n8n workflow listening explicitly to the Twenty CRM internal webhook system (`messageChannel.updated` and standard webhooks).
3. **The Shared Brain (Supabase):** n8n formats the raw CRM output and securely `POST`s it directly to the Supabase `/chatroom` table.
4. **The Swarm (Jai.OS 5.0):** The autonomous agents continuously read the Chatroom. When a CRM ping arrives (e.g., "Note added: 'Research this client'"), the Swarm is triggered.
5. **The Feedback Loop (MCP):** Using the specialized `mcp-twenty-crm` server, the AI uses its tool access to reach back into Twenty CRM and dynamically update records, add notes, or manipulate data silently.

---

## 2. Technical Learnings & Landmines (Crucial for Client Deployments)

We bled for these lessons. Never forget them:

### A. The Infinite Email Loop (The "Auto-Responder Death Spiral")

**The Danger:** If a user invite is sent to an email address that bounces or has a generic failure auto-responder (e.g., `marcus@jonnyai.co.uk` with no physical inbox setup), Twenty receives the bounce notification, logs it as a "New Reply", sends a notification *of* that reply... which bounces again. This spirals infinitely into a DDoSing loop that consumes the message queue and spams webhooks.
**The Fix:**

- **Rule 1:** NEVER invite pseudo-users or AI personas to the CRM unless they have a real inbox capable of silently absorbing mail.
- **Rule 2:** If it happens, you must SSH to the host and hard stop the worker container (`docker compose stop worker`), then manually scrub the user from the PostgreSQL `core."user"` and `core.workspace_member` tables before restarting.

### B. Database Migration & Extensions (The Schema Trap)

**The Danger:** Twenty CRM expects the `uuid-ossp` network extension to be available across schemas. If the Supabase instance defaults it to `public` but the CRM runs in a `core` or `workspace` schema, Docker migrations will flatline with `uuid_generate_v4() does not exist`.
**The Fix:**

- Modify the `PG_DATABASE_URL` in Twenty's `.env` to enforce the default search path on connection, e.g., `?search_path=public,core`.
- If an installation becomes corrupted halfway, use a DB admin tool (or Python script) to completely `DROP SCHEMA core CASCADE` and `DROP SCHEMA workspace CASCADE` to reset state for the `yarn database:reset` script.

### C. The n8n Webhook Connection Bug

**The Danger:** Programmatic injection of n8n workflows via API can sometimes fail to correctly bind the Webhook trigger to the Action node (even if JSON says so). If a Webhook is "disconnected" on the UI canvas, the production URL turns off and starts returning `404 Not Found`.
**The Fix:**

- Always use UI node connections.
- If automating, output the raw JSON from the script and paste it directly onto an empty n8n canvas via `Ctrl+V`. The GUI auto-binds them perfectly.

### D. Reverse Proxy Networking constraints

**The Danger:** Since we run CRM behind a custom NGINX proxy on the same host, the internal CRM health checks (`/healthz`) might bounce if the internal frontend docker container is not explicitly told what domain name it's operating on.
**The Fix:**

- Keep `FRONT_BASE_URL` identical across all configuration planes.

---

## 3. The Monetization Strategy: What We Sell

We are not selling CRM setup. We are selling an "Automated Employee Engine."

### Tier 1: The AI-Ready OS ($1,500 Setup / $250/m)

- Deployed Twenty CRM on custom sub-domain.
- Fully wired OAuth (Google/Microsoft SSO) and inbound email synching.
- Resend API configured for mass outbound.
- *(We keep the keys to the infrastructure).*

### Tier 2: The Actionable Swarm ($4,000 Setup / $750/m)

- Everything in Tier 1.
- Dedicated n8n circuit deployed.
- **Client intelligence:** An agent that "listens" to new company profiles created in the CRM and instantly populates the notes field with a scraped dossier (LinkedIn, recent news, estimated revenue) without a human touching it.

### Tier 3: The Trading Floor ($10,000+ Setup / $2000/m)

- Total automation suite.
- When an invoice status flips to "Overdue" in Twenty CRM, it triggers the legal bot to generate a formal chaser email, which flags the ops team in Slack, and reschedules the calendar.
- Swarm connects Twenty CRM dynamically to the rest of the business tools via MCP servers.

---

## 4. Next Steps for Core Tech

1. **Agent Sandbox:** Build a dedicated MCP server or script that lets `@Marcus` query Twenty CRM directly (e.g., `list_crm_contacts()`, `update_deal_stage()`).
2. **Auto-Research Loop:** Build a persistent workflow where any new entity creates a "Research" flag in the Chatroom, processed by `@Scholar`, then patched back to the CRM using the API.
3. **Productized Deployment:** Wrap the specific Docker/NGINX/Env process into a single 1-click shell script we can sell to agencies.
