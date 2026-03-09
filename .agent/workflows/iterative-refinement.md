---
description: An iterative loop where an agent refines content based on output from a validation script until quality gates are passed.
---

# /refine - Iterative Refinement Workflow

## Trigger
Use when high-precision content (code, schema, documentation) requires verification against deterministic rules.

## Steps

1. **Initial Draft** (@[Agent])
   - Create initial content based on requirements.
   - Save output to `.tmp/refinement_target.md`.

2. **Run Validation** (@Vigil)
   // turbo
   - Execute the appropriate validation script from `execution/` or the agent's `scripts/` folder.
   - Example: `python execution/validate_agents.py` or `python skills/[handle]/scripts/verify_output.py`.

3. **Analyze Results** (@Vigil)
   - Read error logs and success metrics.
   - If `status == SUCCESS`, proceed to Step 5.
   - If `status == FAILURE`, document specific errors.

4. **Iterative Fix** (@[Agent])
   - Modify the content to address the failures identified by @Vigil.
   - Return to Step 2.

5. **Final Quality Gate** (@Sam)
   - Perform final QA check.
   - Sign off and move content to production path.

## Output
- Verified production-grade content.
- Validation report in `.tmp/refinement_report.json`.
