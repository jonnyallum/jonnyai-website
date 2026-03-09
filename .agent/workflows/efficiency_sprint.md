---
description: How to run an AgOS 2.0 Efficiency Sprint to upgrade agent capabilities.
---

# 🏃 Efficiency Sprint Workflow

> **Goal**: Rapidly upgrade multiple agents to the new AgOS 2.0 standard (Capabilities + SOPs).

## 1. The Audit
Run the conductor toolkit to identify gaps:
```bash
python execution/conductor_toolkit.py audit
```

## 2. The Planning
Generate a task list targeting the "Missing" fields identified in the audit.
- Priority: Core Agents > Specialist Agents > Utility Agents.

## 3. The Execution Cycle
For each target agent:
1.  **Read**: Open their current `SKILL.md`.
2.  **Refactor**:
    - Add `## 🛠️ Core Capabilities` section.
    - Add `## 📋 Standard Operating Procedures (SOPs)` section.
    - Ensure `## 🎭 Persona Overview` is present.
3.  **Validate**: Run `conductor_toolkit.py audit` again to confirm green status.

## 4. The Feedback Loop
If an agent fails a task during the sprint:
1.  **Don't just retry.**
2.  **Update their SOP** immediately with the fix.
3.  **Log** the improvement in `decision-log.json`.

## 5. Persistent Memory
All sprint progress is logged in `.tmp/message4antigravity2.md` for context continuity.
