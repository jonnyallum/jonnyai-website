---
name: test-driven-development
version: "1.0"
description: >
  Comprehensive Test-Driven Development methodology enforcing the Iron Law:
  no production code without a failing test first. Covers Red-Green-Refactor
  cycle, anti-patterns, rationalization busters, and verification checklists.
domain: dev-excellence
owner: sam
triggers:
  - implementing new features
  - bug fixes
  - refactoring existing code
  - establishing testing standards
  - code review quality gates
source: sickn33/antigravity-awesome-skills (adapted for Jai.OS 5.0)
---

# Test-Driven Development (TDD)

> **Owner:** @Sam (QA Lead)
> **Consumers:** @Sebastian, @Qualityguard, @Validator, all Dev Tier agents
> **Related:** `test-driven-bug-fix`, `react-component-test-generator`, `test-suite-prioritization`

## Overview

Write the test first. Watch it fail. Write minimal code to pass.

**Core principle:** If you didn't watch the test fail, you don't know if it tests the right thing.

**Violating the letter of the rules is violating the spirit of the rules.**

---

## When to Use

**Always:**

- New features
- Bug fixes
- Refactoring
- Behavior changes

**Exceptions (ask Jonny):**

- Throwaway prototypes
- Generated code
- Configuration files

---

## The Iron Law

```
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
```

Write code before the test? Delete it. Start over.

**No exceptions:**

- Don't keep it as "reference"
- Don't "adapt" it while writing tests
- Don't look at it
- Delete means delete

---

## Red-Green-Refactor Cycle

### RED — Write Failing Test

Write one minimal test showing what should happen.

**Good:**

```typescript
test('retries failed operations 3 times', async () => {
  let attempts = 0;
  const operation = () => {
    attempts++;
    if (attempts < 3) throw new Error('fail');
    return 'success';
  };

  const result = await retryOperation(operation);

  expect(result).toBe('success');
  expect(attempts).toBe(3);
});
```

Clear name, tests real behavior, one thing.

**Bad:**

```typescript
test('retry works', async () => {
  const mock = jest.fn()
    .mockRejectedValueOnce(new Error())
    .mockRejectedValueOnce(new Error())
    .mockResolvedValueOnce('success');
  await retryOperation(mock);
  expect(mock).toHaveBeenCalledTimes(3);
});
```

Vague name, tests mock not code.

**Requirements:**

- One behavior per test
- Clear, descriptive name
- Real code (no mocks unless unavoidable)

### Verify RED — Watch It Fail (MANDATORY)

```bash
npm test path/to/test.test.ts
```

Confirm:

- Test **fails** (not errors)
- Failure message is expected
- Fails because feature is missing (not typos)

### GREEN — Minimal Code

Write simplest code to pass the test. Nothing more.

Don't add features, refactor other code, or "improve" beyond the test.

### Verify GREEN — Watch It Pass (MANDATORY)

```bash
npm test path/to/test.test.ts
```

Confirm:

- Test passes
- Other tests still pass
- Output pristine (no errors, warnings)

### REFACTOR — Clean Up

After green only:

- Remove duplication
- Improve names
- Extract helpers

Keep tests green. Don't add behavior.

### Repeat

Next failing test for next feature.

---

## Test Quality Standards

| Quality | Good | Bad |
|---------|------|-----|
| **Minimal** | One thing. "and" in name? Split it. | `test('validates email and domain and whitespace')` |
| **Clear** | Name describes behavior | `test('test1')` |
| **Shows intent** | Demonstrates desired API | Obscures what code should do |

---

## Common Rationalizations (All Invalid)

| Excuse | Reality |
|--------|---------|
| "Too simple to test" | Simple code breaks. Test takes 30 seconds. |
| "I'll test after" | Tests passing immediately prove nothing. |
| "Already manually tested" | Ad-hoc is not systematic. No record, can't re-run. |
| "Deleting X hours is wasteful" | Sunk cost fallacy. Keeping unverified code is tech debt. |
| "Need to explore first" | Fine. Throw away exploration, start with TDD. |
| "Test hard = design unclear" | Listen to test. Hard to test = hard to use. |
| "TDD will slow me down" | TDD is faster than debugging. |

---

## Red Flags — STOP and Start Over

- Code before test
- Test after implementation
- Test passes immediately
- Can't explain why test failed
- Tests added "later"
- Rationalizing "just this once"

**All of these mean: Delete code. Start over with TDD.**

---

## Bug Fix Protocol

1. Write failing test reproducing the bug
2. Verify RED — watch it fail
3. Write minimal fix
4. Verify GREEN — watch it pass
5. Refactor if needed

Never fix bugs without a test.

---

## Verification Checklist

Before marking work complete:

- [ ] Every new function/method has a test
- [ ] Watched each test fail before implementing
- [ ] Each test failed for expected reason (feature missing, not typo)
- [ ] Wrote minimal code to pass each test
- [ ] All tests pass
- [ ] Output pristine (no errors, warnings)
- [ ] Tests use real code (mocks only if unavoidable)
- [ ] Edge cases and errors covered

Can't check all boxes? You skipped TDD. Start over.

---

## When Stuck

| Problem | Solution |
|---------|----------|
| Don't know how to test | Write wished-for API. Write assertion first. Ask Jonny. |
| Test too complicated | Design too complicated. Simplify interface. |
| Must mock everything | Code too coupled. Use dependency injection. |
| Test setup huge | Extract helpers. Still complex? Simplify design. |

---

## Anti-Patterns to Avoid

- **Testing mock behavior instead of real behavior** — Mocks verify interactions, not outcomes.
- **Adding test-only methods to production classes** — Design for testability, not test-convenience.
- **Mocking without understanding dependencies** — Know why you're mocking before you mock.
- **Snapshot overuse** — Snapshots are fragile. Test behavior, not output shape.

---

## Learning Log

| Date | Learning | Source |
|:--|:--|:--|
| 2026-03-09 | Integrated from `sickn33/antigravity-awesome-skills` | Awesome Skills Evaluation Phase 1 |
