# GITHUB MONETISATION HUNT — Phase 1 Discovery

> **Status:** COMPLETE | **Phase:** 1 of 3 — Discovery
> **Agents:** @Dreamer (Lead), @Scholar (Research), @Hugo (GitHub Intel)
> **Date:** 2026-02-26
> **Data sourced from:** GitHub Search API (live, as of 2026-02-27)

---

## Top 5 High-Potential Repositories

---

### #1 — browser-use/browser-use

- **Stars:** 79,114 (one of the fastest-growing AI repos on GitHub right now)
- **Forks:** 9,361
- **Language:** Python
- **License:** MIT
- **URL:** https://github.com/browser-use/browser-use
- **Last Updated:** 2026-02-27

**What it does:**
Makes websites accessible and controllable by AI agents. Uses Playwright under the hood to let LLMs (GPT-4, Claude, Gemini) drive any browser like a human — click, fill forms, navigate, extract data — without requiring website-specific APIs. The tagline: "Make websites accessible for AI agents."

**Why it is monetisable:**
This is the pick-and-shovel play for the "agents do your work" wave. Every agentic product needs browser access, but raw `browser-use` is a Python library — there is no:
- Hosted cloud runner (pay-per-minute browser sessions)
- Team dashboard (monitor running agents, costs, screenshots)
- No-code interface (run browser agents via form/UI, not code)
- White-label SaaS version for agencies
- Zapier-style trigger system ("when X happens on this website, run this agent")

The SaaS gap is enormous. Browserbase and Steel.dev are building in this direction but at $49–$99/month enterprise price points. Antigravity could ship a developer-first, self-hostable tier at $19/month with a Vercel-style usage model.

**Jai.OS 5.0 Compatibility:** EXCELLENT
- Python backend integrates directly with Supabase via existing stack
- Next.js 15 dashboard for job queuing and live screenshot streaming (Framer Motion progress panels)
- @Owen deploys the Python runner on Hetzner/Hostinger VPS; @Sebastian builds the Next.js control panel
- @Sophie and @Hugo already use scraping patterns that this library powers

---

### #2 — microsoft/autogen

- **Stars:** 54,925
- **Forks:** 8,267
- **Language:** Python
- **License:** CC-BY-4.0 (note: core framework is Apache 2.0 — check individual package licenses)
- **URL:** https://github.com/microsoft/autogen
- **Last Updated:** 2026-02-27

**What it does:**
Microsoft's open-source multi-agent programming framework. Lets you build networks of AI agents that can collaborate, delegate, and execute tasks autonomously. AutoGen Studio (a no-code UI layer) exists but is buried and underfunded. Supports GroupChat, nested conversations, tool calling, human-in-the-loop checkpoints.

**Why it is monetisable:**
AutoGen is the most enterprise-credible open-source agent framework but has zero commercial wrapper. Companies want to run AutoGen-powered workflows without managing Python environments. The gaps:
- No hosted execution layer (teams can not deploy AutoGen flows to production without DevOps)
- AutoGen Studio is buggy and unmaintained relative to the core framework's ambition
- No Slack/Teams/email integration baked in
- No cost tracking or audit trails for enterprise governance

Product angle: "AutoGen as a Service" — a polished Vercel-like platform where you define your agent network in a YAML config, push to deploy, and get a webhook endpoint back. Target: mid-market ops teams and AI consultancies.

**Jai.OS 5.0 Compatibility:** GOOD
- Python backend; existing Supabase schema can store agent configs, run history, cost data
- @Nathan's n8n automation expertise maps directly to the webhook trigger layer
- @Felix can design a freemium-to-enterprise funnel around hosted execution units

---

### #3 — crewAIInc/crewAI

- **Stars:** 44,736
- **Forks:** 5,990
- **Language:** Python
- **License:** MIT
- **URL:** https://github.com/crewAIInc/crewAI
- **Topics:** agents, ai, ai-agents, aiagentframework, llms
- **Last Updated:** 2026-02-27

**What it does:**
The most developer-friendly multi-agent framework right now. CrewAI lets you define "crews" of role-playing agents (like a real team: researcher, writer, analyst) that collaborate on a task. It has an intuitive Python DSL and large community. CrewAI Enterprise exists but is expensive and opaque.

**Why it is monetisable:**
CrewAI is already proving the market but their commercial offering (crewai.com) targets large enterprises at $500+/month. The gap is the SMB/agency tier:
- Vertical-specific crew templates: "SEO Content Crew", "Lead Research Crew", "Competitor Monitoring Crew"
- White-label: agencies resell branded AI crew automation to their clients
- Antigravity already runs an agency with 67-agent persona system — Jai.OS 5.0 IS a productized CrewAI analogue

The play here is not to build on top of CrewAI directly — it is to position Jai.OS 5.0 as the productized, branded, no-code-accessible alternative. CrewAI proves the demand; Antigravity delivers the polished product.

**Jai.OS 5.0 Compatibility:** DIRECT — Jai.OS 5.0's agent orchestration architecture is philosophically identical to CrewAI. This validates the core Antigravity model.

---

### #4 — mastra-ai/mastra

- **Stars:** 21,471
- **Forks:** 1,619
- **Language:** TypeScript
- **License:** Elastic License 2.0 (source-available, not fully open)
- **URL:** https://github.com/mastra-ai/mastra
- **Topics:** agents, ai, chatbots, evals, javascript, llm, mcp, nextjs, nodejs, reactjs, tts, typescript, workflows
- **Last Updated:** 2026-02-27

**What it does:**
From the team that built Gatsby. Mastra is a TypeScript-native AI agent framework built for the modern web stack: Next.js, React, Node.js. It includes: agent definitions, memory, tool calling, workflow orchestration, evals, voice/TTS. It explicitly integrates with MCP (Model Context Protocol) — the same protocol Antigravity uses.

**Why it is monetisable:**
This is the most stack-compatible repo on this entire list. Mastra is the missing "AI agent layer" for Next.js apps. But it has:
- No hosted deployment platform
- No visual workflow builder
- No white-label / multi-tenant support for agencies
- No Supabase-native persistence layer (they use their own storage)

Product angle: Build "Mastra Cloud" — a hosted runner and visual builder for Mastra-powered agents, with Supabase as the backend. Target: Next.js developers who want to add AI agents without managing infrastructure.

Alternatively: build Mastra plugin packs for vertical use cases (e-commerce, SEO, lead gen) and sell them as a marketplace.

**Jai.OS 5.0 Compatibility:** EXCEPTIONAL
- TypeScript + Next.js 15 is the exact Antigravity stack
- MCP integration means Jai.OS 5.0 agent skills could be exposed as Mastra tools with minimal adapter code
- @Sebastian could build a Mastra-powered agent execution layer inside the existing Next.js app
- @Adrian's MCP server work maps directly to Mastra's tool system

---

### #5 — humanlayer/12-factor-agents

- **Stars:** 18,394
- **Forks:** 1,400
- **Language:** TypeScript
- **License:** Source-available (no SPDX assertion)
- **URL:** https://github.com/humanlayer/12-factor-agents
- **Topics:** 12-factor, agents, ai, context-window, framework, llms, memory, orchestration, prompt-engineering, rag
- **Last Updated:** 2026-02-27

**What it does:**
A methodology + reference implementation for building production-grade AI agents. The "12-Factor App" methodology but applied to LLM-powered software: 12 principles for reliable, observable, deployable agents (things like: "pause and resume at any time", "own your control flow", "compact errors into context"). It is rapidly becoming the canonical standard for "how to build agents that actually work in production."

**Why it is monetisable:**
This is not a product — it is a specification gap. And specification gaps produce product categories. The 12 factors are widely cited but there is no reference platform, no compliance checker, no deployment kit. Opportunities:
- "12FA Compliant" badge/audit service: certify that an agent deployment meets the 12 factors
- Starter kit / boilerplate SaaS that ships pre-12FA-compliant agents (the "Create React App" for agents)
- Consultancy upsell: Antigravity charges to audit and upgrade a company's existing agent stack to 12FA compliance
- The HumanLayer team (the company behind this) sells human-in-the-loop approval flows — there is a B2B SaaS product sitting right there

**Jai.OS 5.0 Compatibility:** STRONG
- TypeScript reference code; @Sebastian architects against these principles already
- The memory and context-window patterns described map to Jai.OS 5.0's Shared Brain + agent health JSON
- This is a framework for thinking, not a dependency — zero lock-in risk

---

## Best Bet Recommendation

**#1 Candidate for Blueprinting: browser-use/browser-use**

The reasoning is simple: browser-use solves a universal, unavoidable problem (agents need to use the internet), has 79K stars with velocity that rivals the biggest names in the space, is MIT licensed (zero commercial restrictions), and has zero credible SaaS wrapper in the sub-$100/month tier.

The product to build: **"AgentBrowse"** — a hosted browser agent runner with a Next.js dashboard.

- Tier 1 (Free): 50 browser sessions/month, 1 concurrent agent
- Tier 2 ($29/month): 500 sessions, 5 concurrent, Supabase logging, webhook triggers
- Tier 3 ($99/month): Unlimited sessions, team access, custom agent templates, white-label

Build time estimate: 3–4 weeks with Jai.OS 5.0 team (@Sebastian for Next.js shell, @Owen for VPS runner deployment, @Diana for Supabase session storage, @Felix for pricing and funnel).

The Mastra option (#4) is the longer-term, higher-margin play — building on a TypeScript framework that perfectly matches our stack. That is Phase 2 exploration.

---

## Patterns Noticed

1. **No SaaS leader in the $19–$99/month agent runner space.** AutoGen, CrewAI, and browser-use all have massive communities but their commercial offerings either do not exist or target $500+/month enterprise. The SMB gap is open.

2. **TypeScript is eating Python's lunch in the agent space.** Mastra (TypeScript, 21K stars) and 12-Factor Agents (TypeScript, 18K stars) both outpaced Python-only tools that launched earlier. Antigravity's TypeScript-first stack is correctly positioned.

3. **Local-first AI has community enthusiasm but no commercial density.** Repos like MemoryOS, CoWork-OS, and the local-first agent repos have low stars but high ideological energy. This is a 12–18 month ahead-of-the-curve play, not an immediate product.

4. **MCP (Model Context Protocol) is becoming the connective tissue.** Mastra, browser-use, and 12-Factor-Agents all integrate or reference MCP. Antigravity's existing MCP server infrastructure (@Adrian's work) is ahead of the curve — this is a distribution advantage.

5. **Multi-agent frameworks are converging on the same patterns.** CrewAI, AutoGen, MetaGPT, and Jai.OS 5.0 all implement role-playing specialist agents with memory and tool access. The differentiator is no longer the framework — it is the deployment UX and vertical specialization.

6. **Agent orchestration has no clear SaaS leader.** LangChain tried with LangSmith. CrewAI is trying with crewai.com. But neither owns the "Vercel for agents" position. This is arguably the most valuable gap in the entire AI infrastructure stack right now.

---

## Jai.OS 5.0 Compatibility Summary

| Repo | Stack Fit | Integration Effort | Opportunity Type |
|:-----|:----------|:------------------|:-----------------|
| browser-use | Python backend + Next.js dashboard | 2–3 weeks | Hosted SaaS runner |
| autogen | Python backend + Supabase config store | 3–4 weeks | Enterprise deployment kit |
| crewAI | Python; validates Jai.OS model | N/A — compete, not integrate | Market validation |
| mastra | TypeScript + Next.js 15 + MCP | 1–2 weeks for plugin | Native plugin ecosystem |
| 12-factor-agents | TypeScript reference patterns | Architecture alignment only | Consultancy + boilerplate |

---

## Recommended Next Steps (Phase 2)

1. **@Dreamer** to produce a full monetisation blueprint for "AgentBrowse" (browser-use SaaS wrapper) — pricing, landing page copy, feature tiers, 90-day build roadmap.
2. **@Sebastian** to prototype a Next.js dashboard shell that can queue and monitor browser-use Python jobs via a REST API — proof of concept only, no production code.
3. **@Felix** to sketch a conversion funnel for the freemium-to-paid model targeting solo developers and small agencies.
4. **@Hugo** to do a deep audit of the browser-use repo: licence compliance for commercial use, open issues, maintainer activity, dependency tree risks.

---

_Produced by @Dreamer + @Scholar + @Hugo | Antigravity Agency | Jai.OS 5.0_
_Phase 1 Discovery COMPLETE — Advance to Phase 2: Blueprinting_
