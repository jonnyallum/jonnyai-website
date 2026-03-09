# Jai.OS 5.0 - Sync Protocol
> *How multiple AIs collaborate without stepping on each other*

---

## The Problem

When Claude, Gemini, ChatGPT, and Grok all work on the same codebase:
- Who has the latest version?
- Who's allowed to push right now?
- How do we prevent merge conflicts?
- How do we know what each AI changed?

---

## The Solution: Distributed Locking + Sync State

### 1. The Sync Lock Table (Shared Brain)

```sql
CREATE TABLE sync_locks (
  id TEXT PRIMARY KEY,          -- 'github-push' | 'file-edit' | 'deploy'
  project_id TEXT,              -- Which project is locked
  held_by_ai TEXT NOT NULL,     -- claude | gemini | chatgpt | grok
  held_by_machine TEXT,         -- machine identifier
  held_by_agent TEXT,           -- @marcus, @sebastian, etc.
  acquired_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,       -- Auto-release after timeout
  reason TEXT                   -- Why the lock was acquired
);

-- Index for fast lookups
CREATE INDEX idx_sync_locks_project ON sync_locks(project_id);
```

### 2. The Sync State Table

```sql
CREATE TABLE sync_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT NOT NULL,
  last_push_ai TEXT,            -- Which AI pushed last
  last_push_agent TEXT,         -- Which agent pushed
  last_push_commit TEXT,        -- Commit hash
  last_push_at TIMESTAMPTZ,
  last_pull_ai TEXT,            -- Which AI pulled last
  last_pull_at TIMESTAMPTZ,
  local_changes JSONB,          -- Uncommitted changes by AI
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Protocol: Before Any Git Operation

### Step 1: Check Sync State

```python
# Every AI runs this before touching git
def check_sync_state(project_id):
    state = supabase.table('sync_state').select('*').eq('project_id', project_id).single()

    if state['last_push_at'] > my_last_pull_at:
        print(f"WARNING: {state['last_push_ai']}/@{state['last_push_agent']} pushed since your last pull")
        print(f"Commit: {state['last_push_commit']}")
        print("You MUST pull before making changes")
        return False

    return True
```

### Step 2: Acquire Lock Before Push

```python
def acquire_push_lock(project_id, ai_identity, agent_id, reason):
    # Check if lock exists
    existing = supabase.table('sync_locks').select('*').eq('project_id', project_id).eq('id', 'github-push').single()

    if existing and existing['expires_at'] > now():
        print(f"BLOCKED: {existing['held_by_ai']}/@{existing['held_by_agent']} holds the push lock")
        print(f"Reason: {existing['reason']}")
        print(f"Expires: {existing['expires_at']}")
        return False

    # Acquire lock (5 minute timeout)
    supabase.table('sync_locks').upsert({
        'id': 'github-push',
        'project_id': project_id,
        'held_by_ai': ai_identity,
        'held_by_agent': agent_id,
        'expires_at': now() + timedelta(minutes=5),
        'reason': reason
    })

    return True
```

### Step 3: Release Lock After Push

```python
def release_push_lock(project_id):
    supabase.table('sync_locks').delete().eq('project_id', project_id).eq('id', 'github-push')
```

### Step 4: Update Sync State

```python
def record_push(project_id, ai_identity, agent_id, commit_hash):
    supabase.table('sync_state').upsert({
        'project_id': project_id,
        'last_push_ai': ai_identity,
        'last_push_agent': agent_id,
        'last_push_commit': commit_hash,
        'last_push_at': now()
    })
```

---

## The Full Push Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                    GITHUB PUSH PROTOCOL                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. CHECK SYNC STATE                                             │
│     └── Has anyone pushed since my last pull?                    │
│         ├── YES → Pull first, resolve conflicts                  │
│         └── NO → Continue                                        │
│                                                                  │
│  2. ACQUIRE PUSH LOCK                                            │
│     └── Is the lock available?                                   │
│         ├── NO → Wait or abort                                   │
│         └── YES → Lock acquired (5 min timeout)                  │
│                                                                  │
│  3. PULL LATEST (safety check)                                   │
│     └── git pull --rebase                                        │
│                                                                  │
│  4. COMMIT & PUSH                                                │
│     └── Include AI/agent attribution in commit message           │
│                                                                  │
│  5. UPDATE SYNC STATE                                            │
│     └── Record push in Shared Brain                              │
│                                                                  │
│  6. RELEASE LOCK                                                 │
│     └── Other AIs can now push                                   │
│                                                                  │
│  7. NOTIFY CHATROOM                                              │
│     └── "[Claude/@Sebastian] Pushed to jonnyai.com: feat: ..."   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Commit Message Format

Every commit includes AI and agent attribution:

```
feat: add mobile optimization to hero section

- Implemented responsive breakpoints (320-1440px)
- Added touch targets meeting 48px minimum
- Core Web Vitals: LCP 1.8s, CLS 0.02

[Jai.OS] Claude/@Milo | Machine: jonny-desktop
```

### Commit Template

```
<type>: <description>

<body>

[Jai.OS] <AI>/@<Agent> | Machine: <machine_id>
```

Types: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`

---

## Conflict Resolution

When two AIs have conflicting changes:

### Automatic Resolution
1. Check timestamps - more recent change wins (if non-overlapping)
2. Check agent authority - specialist wins in their domain

### Manual Resolution (Rare)
1. Flag conflict in Shared Brain
2. Notify @Marcus in chatroom
3. @Marcus assigns resolution owner
4. Owner resolves and pushes
5. Others pull and continue

---

## Cross-Machine Chatroom

### Real-Time Collaboration

The chatroom is a Supabase table with real-time subscriptions:

```sql
CREATE TABLE chatroom (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ai_source TEXT NOT NULL,        -- claude | gemini | chatgpt | grok
  machine_id TEXT,                -- Which physical machine
  agent_id TEXT,                  -- @marcus, @sebastian, etc.
  message TEXT NOT NULL,
  project_context TEXT,           -- Which project this relates to
  mentions TEXT[],                -- @agent mentions
  message_type TEXT DEFAULT 'chat', -- chat | sync | alert | handoff
  metadata JSONB,                 -- Additional structured data
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE chatroom;

-- Index for fast queries
CREATE INDEX idx_chatroom_created ON chatroom(created_at DESC);
CREATE INDEX idx_chatroom_project ON chatroom(project_context);
```

### Subscribing (Any AI)

```javascript
// JavaScript example (works in any AI with Supabase access)
const subscription = supabase
  .channel('chatroom-live')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'chatroom' },
    (payload) => {
      const msg = payload.new
      console.log(`[${msg.ai_source}/@${msg.agent_id}] ${msg.message}`)
    }
  )
  .subscribe()
```

### Posting (Any AI)

```javascript
await supabase.from('chatroom').insert({
  ai_source: process.env.AI_IDENTITY,
  machine_id: process.env.MACHINE_ID,
  agent_id: 'marcus',
  message: 'Starting DJ Waste content refresh. Need @Rowan and @Priya.',
  project_context: 'dj-waste',
  mentions: ['rowan', 'priya'],
  message_type: 'chat'
})
```

### Message Types

| Type | Purpose | Example |
|:-----|:--------|:--------|
| `chat` | General conversation | "Good morning team" |
| `sync` | Git/sync notifications | "Pushed to main: feat: hero section" |
| `alert` | Important notifications | "Build failing on dj-waste" |
| `handoff` | Task handoffs | "Passing hero design to @Milo for mobile QA" |
| `question` | Questions needing answers | "Which color palette for Village Bakery?" |
| `decision` | Decisions made | "Going with Option B for auth flow" |

---

## The Handoff Protocol

When one AI/agent passes work to another:

```sql
-- Record in handoffs table
INSERT INTO handoffs (from_agent, to_agent, artifact, context, dependencies)
VALUES (
  'priya',
  'milo',
  'hero-section-v2.tsx',
  'Desktop design complete, needs mobile QA',
  '{"brand_guide": "applied", "breakpoints": "defined"}'
);

-- Post to chatroom
INSERT INTO chatroom (ai_source, agent_id, message, message_type, mentions)
VALUES (
  'claude',
  'priya',
  'Handing off hero section to @Milo for mobile QA. All breakpoints defined.',
  'handoff',
  ARRAY['milo']
);
```

The receiving AI sees the handoff and picks it up.

---

## Session Handoff

When you need to hand off an entire session to another AI:

### 1. Create Session Summary

```markdown
## Session Handoff: DJ Waste Content Refresh
**From:** Claude (jonny-desktop)
**To:** Gemini (or any available AI)
**Time:** 2026-02-05 16:30 UTC

### Completed
- [x] Hero section copy (@Rowan)
- [x] Services section copy (@Rowan)
- [x] Desktop design (@Priya)

### In Progress
- [ ] Mobile QA (@Milo) - BLOCKED on touch target audit

### Next Steps
1. Complete mobile audit (estimated 15 min)
2. SEO gate review (@Grace)
3. Deploy to staging

### Key Files Changed
- `src/components/Hero.tsx`
- `src/components/Services.tsx`
- `src/styles/mobile.css`

### Blockers
- None

### Context
Client wants "premium industrial" feel. Truth-locked copy from Checkatrade.
```

### 2. Post to Chatroom

```
[Claude/@Marcus] SESSION HANDOFF: DJ Waste content refresh
Summary posted to Shared Brain. Gemini, please pick up when available.
Blocking issue: Mobile QA incomplete.
```

### 3. Update Shared Brain

```sql
INSERT INTO tasks (project_id, title, status, assigned_to, created_by)
VALUES ('dj-waste', 'Complete mobile QA', 'pending', 'milo', 'claude');
```

---

## Summary

| Component | Purpose |
|:----------|:--------|
| **sync_locks** | Prevents simultaneous git pushes |
| **sync_state** | Tracks who pushed what and when |
| **chatroom** | Real-time cross-AI communication |
| **handoffs** | Structured task passing between agents |
| **Commit format** | AI/agent attribution in git history |

**Result:** Multiple AIs can work on the same codebase without conflicts, with full visibility into each other's work.

---

*Jai.OS 5.0 - Sync Protocol v1.0*
