---
description: Mandatory onboarding checklist for every new agent added to the Jai.OS 5.0 Orchestra. Zero exceptions.
---

# Agent Onboarding Protocol

> **Every step is mandatory. An agent is not live until ALL steps pass.**
> If any step fails, the agent is NOT considered onboarded — do not proceed to the next step.

---

## Who Runs This

- **@neo** runs this protocol for every new SKILL.md he authors.
- **@marcus** audits compliance before sign-off.
- **Claude Code** runs this protocol when onboarding agents from the IDE.

---

## The 10-Step Onboarding Checklist

### STEP 1 — Write the SKILL.md

**File:** `.agent/skills/[handle]/SKILL.md`

Required elements (Jai.OS 5.0 Gold Standard):

- [ ] YAML frontmatter: `name: @[handle]`, `description`, `tier`, `allowed_tools`
- [ ] Philosophy Quote (the soul test): `> _"..."_`
- [ ] **The Creed** (unmodified, standard 6-point creed)
- [ ] **Identity** table (7 rows: Handle, Human Name, Nickname, Role, Authority Level, Accent Color, Signs Off On)
- [ ] **Personality** (4 subsections: Vibe, Communication Style, Working Style, Quirks)
- [ ] **Capabilities** — Can Do (min 3), Cannot Do (min 2 with routing), Specializations table
- [ ] **Standard Operating Procedures** — min 4 SOPs, each with Trigger + numbered steps
- [ ] **Collaboration** — Inner Circle table, Reports To, Quality Gates
- [ ] **Feedback Loop** — Before Every Task + After Every Task (code block format)
- [ ] **Performance Metrics** table
- [ ] **Learning Log** table
- [ ] **Restrictions** — Do NOT + ALWAYS sections
- [ ] **Tools & Resources** — Primary Tools + MCP Servers
- [ ] **Governing Directives** table (5 directives)
- [ ] Footer: `_Jai.OS 5.0 | The Antigravity Orchestra | Last Updated: YYYY-MM-DD_`

---

### STEP 2 — Validate

```bash
python execution/validate_agents.py
```

**Expected result:** Total agents checked increases by 1. Zero invalids. Zero warnings.

If the new agent FAILS: fix the SKILL.md before proceeding.

---

### STEP 3 — Register in brain_sync.py

**File:** `execution/brain_sync.py`

Add an entry to the `agent_meta` dict:

```python
"[handle]": ("[Human Name]", "[Nickname]", "[Role]", "[Tier]"),
```

Tier values: `"Development"`, `"Design"`, `"Growth"`, `"Intelligence"`, `"Operations"`, `"Legal"`, `"Quality"`, `"Specialized"`, `"Betting"`, `"Management"`, `"Education"`, `"Command"`

---

### STEP 4 — Update AGENT_REGISTRY.md

**File:** `.agent/AGENT_REGISTRY.md`

- [ ] Add agent row to the completed agents table
- [ ] Update `**Total Complete: N / N**` counter

---

### STEP 5 — Update Mirror Docs (ALL THREE)

**Files:** `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`

In each file:

- [ ] Update agent count in header: `"all N agent profiles"` → `"all N+1 agent profiles"`
- [ ] Update `| agents | N agents |` in Supabase table
- [ ] Update `"The N-Agent Orchestra"` header
- [ ] Update `"N specialized personnel"` subheader
- [ ] Update tier header count: `### [Tier] Tier (N)` → `(N+1)`
- [ ] Add agent row to the correct tier table

**Correct tier placement:**

| Tier | Agents |
|:-----|:-------|
| Command | @marcus, @design-manager |
| Development | @sebastian, @diana, @steve, @sam, @derek, @owen, @milo, @adrian |
| Design & Creative | @priya, @vivienne, @blaise, @elena |
| Growth & Marketing | @felix, @grace, @carlos, @maya, @contentforge, @boyce, @rocket |
| Intelligence & Research | @scholar, @sophie, @hugo, @patrick, @parser, @intelhub |
| Operations & Support | @hannah, @arthur, @alex, @mason, @julian, @chronos, @quartermaster, @successbot, @finops |
| Legal & Safety | @luna, @victor, @riskguard |
| Quality & Verification | @vigil, @rowan, @watcher, @qualityguard |
| Specialized Ecosystems | @winston, @trotter, @genesis, @neo, @dreamer |
| Betting Ecosystem | @gareth, @monty, @redeye, @pietro, @terry, @harry, @daniel, @sterling |
| Management & Automation | @quinn, @jasper, @nina, @theo, @executor, @coursewright, @dashboard |
| Education & Course Design | *(absorbed into Management & Automation above)* |

---

### STEP 6 — Supabase Brain Sync

```bash
python execution/brain_sync.py
python execution/sync_all_skills_full.py
```

**Expected result:** New agent appears in Supabase `agents` table. `philosophy` column is populated.

---

### STEP 7 — Skill Catalog Update (if applicable)

If the new agent has dedicated domain skills:

- [ ] Add skill entries to the correct section in `.agent/library/SKILL_CATALOG.md`
- [ ] Create SOP SKILL.md stubs in `.agent/skills/methodology/[skill-handle]/SKILL.md`
- [ ] Add entries to the Methodology table at the bottom of SKILL_CATALOG.md

```bash
python execution/sync_skill_catalog.py
```

---

### STEP 8 — Chatroom Broadcast

Append to `.agent/boardroom/chatroom.md`:

```
[YYYY-MM-DD HH:MM UTC] AGENT ONLINE — @[handle] ([Human Name], "[Nickname]") — [Tier] — ready for missions — @marcus
```

```bash
python execution/sync_chatroom.py
```

---

### STEP 9 — Commit

```bash
git add -A
git status --short
git commit -m "feat(agent): @[handle] ([Human Name]) online — Jai.OS 5.0 standard"
git push origin main
```

---

### STEP 10 — Final Verification

Run the full audit:

```bash
python execution/validate_agents.py
```

Confirm in output:
- Total agents checked: **N** (incremented)
- Valid: **N**
- Invalid: **0**
- Warnings: **0**

Also confirm in Supabase:
```sql
SELECT handle, human_name, tier FROM agents ORDER BY created_at DESC LIMIT 3;
```

---

## Common Mistakes to Avoid

| Mistake | Prevention |
|:--------|:-----------|
| `name: @handle` missing `@` | Always check the YAML frontmatter starts with `@` |
| Philosophy Quote missing | Must be the first thing after `---` end of frontmatter |
| Agent in brain_sync.py but not in mirror docs | Step 5 is mandatory — all three files |
| Agent count not updated in tier header | Update `### [Tier] Tier (N)` in all 3 files |
| New agent not added to Supabase | Run brain_sync.py AND sync_all_skills_full.py |
| Skills without SOP files on disk | Run sync_skill_catalog.py after creating stubs |
| Chatroom broadcast skipped | Step 8 is mandatory — sync_chatroom.py |

---

## Quick Reference: Agent Count by Tier

> Update this table each time an agent is added.

| Tier | Count | Agents |
|:-----|:------|:-------|
| Command | 2 | @marcus, @design-manager |
| Development | 8 | @sebastian, @diana, @steve, @sam, @derek, @owen, @milo, @adrian |
| Design & Creative | 4 | @priya, @vivienne, @blaise, @elena |
| Growth & Marketing | 7 | @felix, @grace, @carlos, @maya, @contentforge, @boyce, @rocket |
| Intelligence & Research | 6 | @scholar, @sophie, @hugo, @patrick, @parser, @intelhub |
| Operations & Support | 9 | @hannah, @arthur, @alex, @mason, @julian, @chronos, @quartermaster, @successbot, @finops |
| Legal & Safety | 3 | @luna, @victor, @riskguard |
| Quality & Verification | 4 | @vigil, @rowan, @watcher, @qualityguard |
| Specialized Ecosystems | 5 | @winston, @trotter, @genesis, @neo, @dreamer |
| Betting Ecosystem | 8 | @gareth, @monty, @redeye, @pietro, @terry, @harry, @daniel, @sterling |
| Management & Automation | 6 | @quinn, @jasper, @nina, @theo, @executor, @dashboard |
| Education & Course Design | 1 | @coursewright |
| **TOTAL** | **63** | |

---

_Jai.OS 5.0 | Agent Onboarding Protocol | Last Updated: 2026-02-23_
