---
description: Run the Jai.OS 5.0 Brain Sync Protocol — three modes depending on session phase.
---

# /sync — Brain Sync Protocol

Sync operates in **three modes** depending on when in the session it's called. Always identify which mode applies before executing.

---

## PRESYNC — Start of Session (Pull)

**When:** Beginning of a new conversation or session.
**Purpose:** Get up to date with everything that happened while you were offline — other AIs may have completed work, files may have changed, GitHub may have new commits.

### Steps

// turbo-all

1. Pull latest from GitHub:

```bash
cd c:\Users\jonny\Desktop\JonnyAI_JaiOS_5.0 && git pull origin main
```

2. Check chatroom for recent broadcasts:

```bash
cat .agent/boardroom/chatroom.md | tail -50
```

3. Validate agent health (quick scan, no fixes):

```bash
python execution/validate_agents.py
```

4. Check for any `.tmp/message4*.md` files (agent-to-agent messages):

```bash
dir .tmp\message4*.md 2>$null
```

5. Report to user: Summarize what changed since last session.

**PRESYNC never pushes.**

---

## MIDSYNC — Mid-Session (Pull Only)

**When:** Another AI (Claude, Cursor, etc.) has just completed work in the same workspace and you need to pick up their changes.
**Purpose:** Refresh your view of the filesystem — another AI may have edited SKILL.md files, updated the registry, created new methodology files, or changed code.

### Steps

1. Re-read any files that the other AI likely changed (check user's description of what was done).
2. Check chatroom for new broadcasts:

```bash
cat .agent/boardroom/chatroom.md | tail -20
```

3. If the other AI committed to GitHub, pull:

```bash
cd c:\Users\jonny\Desktop\JonnyAI_JaiOS_5.0 && git pull origin main
```

4. Validate agents if SKILL.md files were changed:

```bash
python execution/validate_agents.py
```

5. Report to user: Summarize what the other AI changed and confirm you're up to date.

**MIDSYNC never pushes. Only pull and re-read.**

---

## POSTSYNC — End of Session (Full Bidirectional)

**When:** The user says "sync" at the end of a work session, or explicitly asks to save progress.
**Purpose:** Pull everything together, push all changes to GitHub and Supabase, ensure nothing is lost if the environment resets.

### One-Command POSTSYNC (preferred)

```bash
python execution/full_sync.py "feat: your session summary here"
```

This single script does all steps below automatically: validate → Supabase → git commit → push.

**Flags:**
- `--dry-run` — preview what would happen, no writes
- `--skip-git` — Supabase only
- `--skip-supabase` — git only

---

### Manual Steps (fallback if full_sync.py is unavailable)

1. Validate all agent SKILL.md files:

```bash
python execution/validate_agents.py
```

2. Sync heartbeat + learnings to Supabase Shared Brain:

```bash
python execution/brain_sync.py
```

3. Sync full SKILL.md content to Supabase `agents.philosophy`:

```bash
python execution/sync_all_skills_full.py
```

4. Sync skills catalog:

```bash
python execution/sync_skill_catalog.py
```

5. Stage all changes and commit:

```bash
git add -A && git commit -m "sync: [summary]"
```

6. Pull rebase and push to GitHub:

```bash
git pull --rebase origin main && git push origin main
```

7. Post session summary to chatroom and sync to Supabase:

```
Append to .agent/boardroom/chatroom.md:
[timestamp] SESSION COMPLETE — [summary] — @[agent]
```

```bash
python execution/sync_chatroom.py
```

8. Clean up temp files if needed:

```bash
del .tmp\message4*.md 2>$null
```

---

## How to Identify the Mode

| Signal                                                               | Mode         |
| :------------------------------------------------------------------- | :----------- |
| Start of a new conversation                                          | **PRESYNC**  |
| User says "sync" or "pull" after mentioning another AI finished work | **MIDSYNC**  |
| User says "sync" at the end of a session, or "save progress"         | **POSTSYNC** |
| User says "push to github" or "push everything"                      | **POSTSYNC** |
| Ambiguous — ask the user which mode they mean                        | —            |

---

## Key Principles

- **PRESYNC and MIDSYNC never push.** They only pull and read.
- **POSTSYNC always pushes.** It writes to GitHub and Supabase.
- **Always validate agents** if any SKILL.md files were changed in the session.
- **Always ask before committing** if the change set is large or includes non-agent files.

---

_Jai.OS 5.0 | Brain Sync Protocol | Last Updated: 2026-02-23_
