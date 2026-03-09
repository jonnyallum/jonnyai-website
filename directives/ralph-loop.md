# Ralph Wiggum Loop – JaiOS 5.0 Pattern

## When to use

- Long‑running, toolable work where “done” can be checked automatically:
  - Implementing a feature from a PRD or IMPLEMENTATION_PLAN.
  - Fixing test suites / red builds.
  - Refactors where tests + lint are the backpressure.

## Core idea

- Same high‑level spec every iteration.
- Fresh context each run.
- External **completion criteria**:
  - Tests/lints all green.
  - Required files exist & pass structural checks.
  - Optional: a DONE marker, e.g. `<promise>DONE</promise>` in logs.

## Inputs

- `IMPLEMENTATION_PLAN.md` or PRD/plan file.
- Target repo / directory.
- Max iterations, time, and budget.

## Outputs

- Updated codebase.
- Test/lint logs.
- `ralph-history.json` (one entry per iteration).
- Final summary in Supabase `projects` + `learnings`.
