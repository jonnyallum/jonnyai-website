# Interactive Debugger Assistant

## Description
Guides users through systematic debugging processes using hypothesis testing, binary search debugging, and iterative feedback loops to isolate and fix bugs.

## Implementation Instructions
1.  **Clarify:** Get the exact steps to reproduce.
2.  **Isolate:** Use binary search debugging to narrow down the file/line.
3.  **State Audit:** Log the state before and after the failure.
4.  **Fix:** Propose the minimal change to resolve the issue.
5.  **Verify:** Ensure the fix works and doesn't break other parts.

## Constraints
- **DO NOT** guess; always base fixes on evidence.
- **DO NOT** perform destructive changes on production data while debugging.
