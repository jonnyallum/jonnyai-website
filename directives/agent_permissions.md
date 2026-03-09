---
description: Formal Read/Write/Execute/Forbidden permissions model for all Antigravity agents. Enforces bounded autonomy.
---

# Agent Permissions Model (Jai.OS 5.0)

Every agent operates within explicit permission boundaries. Violations are logged and escalated to @Marcus.

---

## 🔑 Permission Tiers

### Tier L3 — Strategic (Command)

**Agents**: @Marcus

| Access           | Scope                                                                     |
| :--------------- | :------------------------------------------------------------------------ |
| **Read** ✅      | All workspace files, Shared Brain, agent health, task history, chatroom   |
| **Write** ✅     | Task lists, chatroom broadcasts, agent assignments, quality gate verdicts |
| **Execute** ✅   | Sync scripts, validation scripts, Ralph Loop harness, `jonnyai-mcp` tools |
| **Forbidden** 🚫 | Production code, direct deployments, financial transactions               |

### Tier L2 — Operational (Specialists)

**Agents**: @Sebastian, @Diana, @Priya, @Adrian, @Owen, @Sam, @Grace, @Felix, @Elena, @Carlos, @Maya, @Scholar, @Sophie, @Hugo, @Patrick, @Hannah, @Arthur, @Alex, @Mason, @Julian, @Luna, @Victor, @Winston, @Trotter, @Genesis, @Vigil, @Rowan, @Coursewright, and all Betting Tier agents.

| Access           | Scope                                                                                                                                                   |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Read** ✅      | Own domain files, Shared Brain (own learnings), chatroom, relevant project files                                                                        |
| **Write** ✅     | Own domain artifacts, `.tmp/` intermediates, own SKILL.md Learning Log                                                                                  |
| **Execute** ✅   | Domain-specific tools (e.g., @Owen → deploy scripts, @Grace → SEO audit tools)                                                                          |
| **Forbidden** 🚫 | Other agents' SKILL.md (except Learning Log), master config files (GEMINI.md, CLAUDE.md), direct Supabase schema changes without @Diana/@Steve approval |

### Tier L1 — Restricted (Verification)

**Agents**: @Vigil, @Rowan (when in verification mode)

| Access           | Scope                                                               |
| :--------------- | :------------------------------------------------------------------ |
| **Read** ✅      | All artifacts, all agent outputs, all quality gate reports          |
| **Write** ✅     | Verification verdicts, quality reports, Truth-Lock stamps           |
| **Execute** ✅   | Validation scripts, audit tools                                     |
| **Forbidden** 🚫 | Modifying the artifacts they are verifying, self-approving own work |

---

## 🛡️ Universal Forbidden Actions

These apply to ALL agents, ALL tiers, no exceptions:

1. 🚫 **No credential exposure** — API keys, tokens, passwords must never appear in chatroom, artifacts, or logs.
2. 🚫 **No placeholder content in production** — Lorem ipsum, "TODO", or generic stock content is a Protocol Violation.
3. 🚫 **No unilateral schema changes** — Database migrations require @Diana + @Marcus approval.
4. 🚫 **No financial transactions** — Stripe charges, bet placements, or fund transfers require explicit @Jonny approval.
5. 🚫 **No deleting other agents' Learning Logs** — Learnings are permanent institutional memory.

---

_Jai.OS 5.0 | The Antigravity Orchestra | Bounded Autonomy Active_
