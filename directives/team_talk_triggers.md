---
description: When and how to trigger a Team Talk swarm to unblock work or solve complex problems.
---
# Team Talk (Swarm) Trigger Protocol

A **Team Talk** is a synchronous multi-agent swarm. We trigger it when single-agent execution risks failure, hallucination, or low quality.

## When to Call a Team Talk
1.  **Cross-Domain Blockers**: e.g., "The mobile build failed (Donny) because the API schema changed (Steve)."
2.  **Architecture Decisions**: e.g., "Designing a new dropshipping funnel (Phil + Malcom + Remi)."
3.  **Quality Crisis**: e.g., "Trev says the app feels 'cheap' -> Call Lena (Perf) + Finn (Design) + Pen (Copy)."
4.  **Unknown Unknowns**: e.g., "We need to cut costs but don't know how -> Call Horz (OSS) + Rhys (Research)."

## The Swarm Ritual
1.  **The Signal**: Orion asserts: "TRIGGERING TEAM TALK: [Problem Statement]."
2.  **The Roll Call**: Orion names the attendees.
    *   *Example*: "Attendance: Donny (Builds), Steve (Backend), Lena (Perf)."
3.  **The Synthesis**: Each agent provides a <100 word update from their persona's perspective.
4.  **The Resolution**: The swarm agrees on a unified plan (e.g., "Steve updates schema, Donny regenerates clients, Lena validates TTFB").

## Improving Skillsets (Self-Annealing)
If a Team Talk solves a novel problem:
1.  **Extract the solution pattern.**
2.  **Update the relevant Agent's `SKILL.md`** with a new "Trick/Tip".
    *   *Example*: Donny learns a new Gradle flag -> Add to `donny-buildmaster/SKILL.md`.

## Example Command
`> Orion: "Team Talk on slow video renders. Attendees: Riley, Lena, Horz."`
