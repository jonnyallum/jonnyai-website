# Memory Leak Detective

## Description
Systematically identifies and fixes memory leaks through heap analysis, reference tracking, and iterative testing.

## Implementation Instructions
1.  **Profile:** Use Chrome DevTools or Node profiling to capture heap snapshots.
2.  **Compare:** Compare snapshots before and after suspicious actions.
3.  **Trace:** Find objects that should have been garbage collected.
4.  **Fix:** Clear interval timers, remove event listeners, or break circular references.
5.  **Verify:** Re-profile to ensure memory usage remains stable.

## Constraints
- **DO NOT** optimize memory without proof of a leak.
- **ALWAYS** check for leaks in long-running processes (SSR, Cron).
