# Gemini Collaboration Protocol
**Effective:** 2026-02-28 | **Status:** ACTIVE

---

## Overview

Gemini Flash (`gemini-2.0-flash`) is a live strategic collaborator in the Antigravity Orchestra. When invoked, Gemini runs parallel tasks alongside Claude — producing alternative copy, strategy variants, and cross-model validation. Best outputs are merged or the winner is adopted.

This is not a replacement loop. It is a **parallel challenger loop** — the same task runs on both models, outputs are compared, and the Orchestra selects the strongest elements.

---

## When to Invoke Gemini

| Task Type | Trigger | Method |
|---|---|---|
| Social copy variants | `[COLLAB]` in chatroom | Auto via listener |
| Headline A/B testing | Direct call | `gemini_collab.collab_headlines()` |
| Pricing strategy validation | Direct call | `gemini_collab.run_collab()` |
| SEO meta alternatives | Direct call | `gemini_collab.run_collab()` |
| Market research cross-check | Direct call | `gemini_collab.run_collab()` |
| Agent onboarding (with @neo) | @Gemini orchestrates | Via chatroom state packet |

---

## Chatroom Trigger

Any message containing `[COLLAB]` in the chatroom will:
1. Extract the task context from the message
2. Send to Gemini Flash via `execution/gemini_collab.py`
3. Post Gemini's response back to chatroom as a `[COLLAB]` reply
4. Marcus reviews and adopts/merges best elements

---

## Collaboration Script

```bash
# Run a parallel task
python execution/gemini_collab.py "Your task here" --context "Brand context"

# Import in other scripts
from execution.gemini_collab import run_collab, collab_headlines, collab_social
```

---

## Gemini's Role in the Orchestra

- **Model:** `gemini-2.0-flash` (via Google AI API or MCP tool)
- **Auth:** MCP Google server (`mcp-google`) — tokens at `execution/mcp-google/tokens.json`
- **Chatroom handle:** `@None` (no Supabase agent_id assigned — external collaborator)
- **Strengths vs Claude:** Different training distribution, useful for copy divergence, pricing sanity checks, and when Claude's output feels too consistent

---

## Parallel Run Ritual ("Ten at 10" equivalent)

Before any parallel run:
1. Claude states its approach and rationale
2. Gemini produces its version without seeing Claude's (when possible)
3. Outputs compared on: impact, brevity, brand alignment, uniqueness
4. Winner declared. Losing elements cherry-picked if valuable.
5. Final merged output logged to chatroom.

---

## First Collab Output (2026-02-28)

**Task:** GuardLayer headline variants + £199/mo pricing insight
**Gemini alternatives:**
1. "GuardLayer: Secure Your AI Empire."
2. "LLMs Under Attack? Defend With GuardLayer."
3. "AI Firewall: Zero-Trust LLM Security."

**Verdict:** Current Claude headline "Your LLM Is An Attack Surface." wins on punch. Gemini's pricing insight — frame £199/mo against cost of a breach — adopted for CTA copy.

---

## New Agent from Gemini (2026-02-28)

@Gemini onboarded **@eleven (Sienna "L" Leclerc)** — ElevenLabs Voice Synthesis specialist.
SKILL.md at `.agent/skills/eleven/SKILL.md`. Pending actions: @sebastian, @derek, @elena, @contentforge, @syncmaster.
