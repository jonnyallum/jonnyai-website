# Skills Matrix + Gap Detection (Training Day)

## Description
The ability to detect skill gaps across agents based on failures, overlaps, and project requirements.

## Implementation Instructions
1.  **Monitor Failures:** Track whenever an agent "Blocks" or requires excessive human help.
2.  **Audit Skills:** Compare the requested tasks to the agent's defined `SKILL.md` competencies.
3.  **Identify Gaps:** Spot areas where the current ecosystem lacks specialized knowledge (e.g. "We have no one for Web3 security").
4.  **Flag:** Notify @Conductor to initiate a "Training Day" or request a new agent.

## Constraints
- **DO NOT** assume failure is always a skill gap; check if it's a lack of context/docs first.
- **ALWAYS** base gap detection on multiple incidents, not a single outlier.
