---
description: Synchronize local Learning Logs from individual agent SKILL.md files into the global Shared Brain.
---

# /sync-brain - Brain Synchronization Workflow

## Trigger
Use before "Team Talk" debriefs, at the end of a sprint, or after major project milestones.

## Steps

1. **Check Local Logs** (@[Agent])
   - Review the `Learning Log` section in your `SKILL.md`.
   - Ensure all recent learnings are documented with `Date`, `Source`, and `Applied To`.

2. **Run Sync Tool** (@Alex)
   // turbo
   ```bash
   python execution/brain_sync.py --mode pull-local
   ```

3. **Validate Synchronization** (@Vigil)
   - Verify that local logs have been parsed and appended to the Shared Brain database or `AGENTS.md`.
   - Check for any parsing errors in `.tmp/brain_sync_report.md`.

4. **Propagate Learnings** (@Marcus)
   - Review high-impact learnings.
   - Ping relevant agents using the `@handle` found in the `Propagated To` column.

## Output
- Updated Shared Brain (Supabase or `AGENTS.md`).
- Coordination pings in the chatroom for relevant agents.
