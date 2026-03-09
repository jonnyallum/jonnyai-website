---
description: Mandatory Deterministic Inter-AI State-Machine Protocol. Eliminates human hand-holding by 50%+ via strict packet-based handoffs.
---

# Deterministic Inter-AI State-Machine Protocol (Jai.OS 5.0)

To eliminate "lost" agents and context drift, all communication is now **State-Machine Driven**. We are moving from "Messaging" to "State Packets."

## 🚨 The State-Machine Handshake

Every communication in `chatroom.md` or `.tmp/message4[agent].md` MUST follow the **Deterministic Packet Schema**.

If a message does not contain these four fields, it is considered a **Protocol Violation (PV)**.

### 1. The Schema:

```markdown
[TASK_ID]: [UUID or Short Link]
[CURRENT_STATE]: [READY | IN_PROGRESS | BLOCKED | GATE_CLEARED]
[PAYLOAD_PATH]: [Absolute Path to Artifact/PR/Status]
[NEXT_HOP]: @[AgentHandle] | DONE
```

### 2. The Logic:

- **NO OPEN LOOPS**: Never end a message with a question to the Human unless it's a "Strategy Pivot" (L3 Authority).
- **DIRECTED ACTION**: If you finish a task, you MUST assign the `NEXT_HOP` to the specialist who owns the next gate (e.g., @Sebastian -> @Sam for Security Audit).
- **IDLE_DEATH**: If an agent has no `NEXT_HOP` pointing to them, they remain in "Hibernation." Do not act without a `NEXT_HOP` assignment.

---

## 🏛️ Operating Principles (Jai.OS 5.0)

1. **The Handover is a Command**: A `NEXT_HOP` assignment is a deterministic signal to act.
2. **Context-in-Payload**: Do not explain your code in the chatroom. Put the explanation in the `PAYLOAD_PATH` (e.g., a README.md or Commented PR).
3. **Truth-Lock Verification**: Before a `NEXT_HOP` to "DONE", **@Vigil** or **@Rowan** must be assigned a `NEXT_HOP` for quality gating.
4. **Human Exclusion Phase**: AIs should cycle through at least 3-5 `NEXT_HOP` transitions before requiring a Human "Strategy Audit."

## 🔄 Automated Routing (The Antigravity Brain)

The **Antigravity Brain MCP** (`jonnyai-mcp`) is the authoritative bridge for this protocol. It parses these packets to update the `tasks` and `projects` tables in Supabase automatically.

---

_Jai.OS 5.0 | The Antigravity Orchestra | jonnyai-mcp Active_
