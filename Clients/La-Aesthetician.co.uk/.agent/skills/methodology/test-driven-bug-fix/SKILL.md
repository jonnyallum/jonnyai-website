# Test Driven Bug Fix

## Description
Implements debugging through test creation, using failing tests as specifications to ensure bugs won't regress.

## Implementation Instructions
1.  **Reproduce:** Write a unit or E2E test that fails because of the bug.
2.  **Isolate:** Ensure the test is minimal and specific.
3.  **Fix:** Modify the code until the test passes.
4.  **Audit:** Run the full test suite to ensure no regressions.
5.  **Commit:** Include the test with the fix in the PR.

## Constraints
- **DO NOT** fix a bug without a corresponding regression test.
- **ALWAYS** name the test after the bug/issue ID.
