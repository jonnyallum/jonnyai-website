---
description: Start a 'Training Day' ritual to audit agents, detect skill gaps, and run learning sprints.
---

1. **Invoke Conductor**: Ask Conductor to initiate the 'Training Day' ritual.
2. **Signal Audit**:
   - Conductor queries `@Metric` for performance anomalies.
   - Conductor queries `@Sentinel` for recurring QA failures.
   - Conductor reviews `@Archivist` for missing or stale documentation.
3. **Gap Detection**:
   - Conductor uses the `skills-matrix-gap-detection` skill to identify where agents are falling short.
   - If a major gap is found, Conductor proposes a "Learning Sprint" or a new agent creation.
4. **Learning Sprint**:
   - Relevant agents are tasked to read their respective sections in the **Agent Bible** or **Skill Bible** via `@Scout` and `@Archivist`.
   - Agents update their `SKILL.md` with new learnings or refined workflows.
5. **Simulation Drill**:
   - Conductor designs a "Fire Drill" (e.g. a simulated production bug or a sudden market shift).
   - Agents must collaborate in a "Team Talk" to solve the drill.
6. **Validation**:
   - Conductor verifies that playbooks were updated and the drill was successful.
7. **Archive**:
   - @Archivist records the outcome of the Training Day in the project history.
