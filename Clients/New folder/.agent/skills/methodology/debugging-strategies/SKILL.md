---
name: debugging-strategies
version: "1.0"
description: >
  Systematic debugging methodology covering the scientific method, binary search
  debugging, git bisect, differential analysis, memory leak detection, and
  language-specific tooling for JS/TS, Python, and Go.
domain: dev-excellence
owner: sam
triggers:
  - tracking down elusive bugs
  - investigating performance issues
  - debugging production incidents
  - analyzing crash dumps or stack traces
  - debugging distributed systems
source: sickn33/antigravity-awesome-skills (adapted for Jai.OS 5.0)
---

# Debugging Strategies

> **Owner:** @Sam (QA Lead)
> **Consumers:** @Sebastian, @Milo, @Qualityguard, all Dev Tier agents
> **Related:** `interactive-debugger-assistant`, `integration-debugging-coordinator`, `performance-regression-debugger`

## Overview

Transform debugging from frustrating guesswork into systematic problem-solving with proven strategies, powerful tools, and methodical approaches.

---

## Core Principles

### 1. The Scientific Method

1. **Observe:** What's the actual behavior?
2. **Hypothesize:** What could be causing it?
3. **Experiment:** Test your hypothesis
4. **Analyze:** Did it prove/disprove your theory?
5. **Repeat:** Until you find the root cause

### 2. Debugging Mindset

**Don't Assume:**

- "It can't be X" — Yes it can
- "I didn't change Y" — Check anyway
- "It works on my machine" — Find out why

**Do:**

- Reproduce consistently
- Isolate the problem
- Keep detailed notes
- Question everything
- Take breaks when stuck

### 3. Rubber Duck Debugging

Explain your code and problem out loud. Often reveals the issue.

---

## Systematic Debugging Process

### Phase 1: Reproduce

1. **Can you reproduce it?** Always? Sometimes? Randomly?
2. **Create minimal reproduction** — Simplify to smallest example
3. **Document steps** — Write down exact steps, note environment details

### Phase 2: Gather Information

1. **Error Messages** — Full stack trace, error codes, console output
2. **Environment** — OS version, runtime version, dependency versions
3. **Recent Changes** — Git history, deployment timeline, config changes
4. **Scope** — All users or specific? All browsers or specific? Prod only or dev too?

### Phase 3: Form Hypothesis

Based on gathered info, ask:

- **What changed?** Recent code, dependency updates, infrastructure
- **What's different?** Working vs broken environment/user/state
- **Where could this fail?** Input validation, business logic, data layer, external services

### Phase 4: Test & Verify

1. **Binary Search** — Comment out half the code, narrow down, repeat
2. **Add Logging** — Strategic console.log/print, track variable values
3. **Isolate Components** — Test each piece separately, mock dependencies
4. **Compare Working vs Broken** — Diff configurations, environments, data

---

## Advanced Techniques

### Binary Search Debugging with Git Bisect

```bash
git bisect start
git bisect bad                    # Current commit is bad
git bisect good v1.0.0            # v1.0.0 was good
# Git checks out middle commit — test it, then:
git bisect good   # if it works
git bisect bad    # if it's broken
# Continue until bug found
git bisect reset  # when done
```

### Differential Debugging

| Aspect | Working | Broken |
|--------|---------|--------|
| Environment | Development | Production |
| Node version | 18.16.0 | 18.15.0 |
| Data | Empty DB | 1M records |
| User | Admin | Regular user |
| Browser | Chrome | Safari |
| Time | During day | After midnight |

→ Hypothesis: Time-based issue? Check timezone handling.

### Memory Leak Detection (Node.js)

```typescript
if (process.memoryUsage().heapUsed > 500 * 1024 * 1024) {
    console.warn('High memory usage:', process.memoryUsage());
    require('v8').writeHeapSnapshot();
}
```

### Trace Debugging (TypeScript)

```typescript
function trace(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function(...args: any[]) {
        console.log(`Calling ${propertyKey} with args:`, args);
        const result = originalMethod.apply(this, args);
        console.log(`${propertyKey} returned:`, result);
        return result;
    };
    return descriptor;
}
```

---

## Debugging by Issue Type

### Intermittent Bugs

- Add extensive logging (timing, state transitions, external interactions)
- Look for **race conditions** (concurrent access, async order, missing sync)
- Check **timing dependencies** (setTimeout, Promise resolution order)
- **Stress test** — run many times, vary timing, simulate load

### Performance Issues

- **Profile first** — don't optimize blindly
- Common culprits: N+1 queries, unnecessary re-renders, large data processing, synchronous I/O
- Tools: Chrome DevTools Performance, Lighthouse, cProfile, clinic.js

### Production Bugs

- Gather evidence: error tracking (Sentry), logs, user reports, metrics
- Reproduce locally with production data (anonymized)
- Safe investigation: don't change production, use feature flags, test in staging

---

## Quick Debugging Checklist

When stuck, check:

- [ ] Spelling errors (typos in variable names)
- [ ] Case sensitivity (fileName vs filename)
- [ ] Null/undefined values
- [ ] Array index off-by-one
- [ ] Async timing (race conditions)
- [ ] Scope issues (closure, hoisting)
- [ ] Type mismatches
- [ ] Missing dependencies
- [ ] Environment variables
- [ ] File paths (absolute vs relative)
- [ ] Cache issues (clear cache)
- [ ] Stale data (refresh database)

---

## Best Practices

1. **Reproduce First** — Can't fix what you can't reproduce
2. **Isolate the Problem** — Remove complexity until minimal case
3. **Read Error Messages** — They're usually helpful
4. **Check Recent Changes** — Most bugs are recent
5. **Use Version Control** — Git bisect, blame, history
6. **Take Breaks** — Fresh eyes see better
7. **Document Findings** — Help future you
8. **Fix Root Cause** — Not just symptoms

---

## Common Mistakes

- **Making Multiple Changes** — Change one thing at a time
- **Not Reading Error Messages** — Read the full stack trace
- **Assuming It's Complex** — Often it's simple
- **Debug Logging in Prod** — Remove before shipping
- **Not Using Debugger** — console.log isn't always best
- **Giving Up Too Soon** — Persistence pays off
- **Not Testing the Fix** — Verify it actually works

---

## Learning Log

| Date | Learning | Source |
|:--|:--|:--|
| 2026-03-09 | Integrated from `sickn33/antigravity-awesome-skills` | Awesome Skills Evaluation Phase 1 |
