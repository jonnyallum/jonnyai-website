# The Antigravity Infrastructure
> *One Orchestra. Every AI. Every Tool. Every Project. Connected.*

---

## The Vision

This isn't a version. It's not "AgOS 4.0". It's **how we operate**.

Every AI - Claude, Gemini, ChatGPT, Grok, NotebookLM - connects to the same infrastructure. They share context, tools, memory, and purpose. When one agent learns, all agents benefit. When one AI completes a task, the others see it instantly.

**The Trillion-Dollar Question:** How do 40+ agents across multiple AIs collaborate like a single mind?

**The Answer:** A shared brain, universal tooling, and embedded excellence.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    THE ANTIGRAVITY ORCHESTRA                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  CLAUDE  │  │  GEMINI  │  │  CHATGPT │  │   GROK   │        │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │
│       │             │             │             │               │
│       └─────────────┼─────────────┼─────────────┘               │
│                     │             │                              │
│              ┌──────▼─────────────▼──────┐                      │
│              │      MCP GATEWAY          │                      │
│              │  (Universal Tool Access)  │                      │
│              └──────────────┬────────────┘                      │
│                             │                                    │
│       ┌─────────────────────┼─────────────────────┐             │
│       │                     │                     │             │
│  ┌────▼────┐  ┌─────────────▼──────────────┐  ┌──▼───┐         │
│  │ GITHUB  │  │      SHARED BRAIN          │  │ HOST │         │
│  │   MCP   │  │  (Supabase CRM/Memory)     │  │ MCP  │         │
│  └─────────┘  └────────────────────────────┘  └──────┘         │
│                             │                                    │
│              ┌──────────────┼──────────────┐                    │
│              │              │              │                    │
│         ┌────▼────┐  ┌──────▼─────┐  ┌────▼────┐               │
│         │ PROJECT │  │  PROJECT   │  │ PROJECT │               │
│         │SUPABASE │  │  SUPABASE  │  │SUPABASE │               │
│         │  (DJ)   │  │  (Kwizz)   │  │ (Pound) │               │
│         └─────────┘  └────────────┘  └─────────┘               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component 1: The Shared Brain (CRM)

A central Supabase database that ALL agents and AIs read/write to.

### Database Schema

```sql
-- The 40 Agents
CREATE TABLE agents (
  id TEXT PRIMARY KEY,
  human_name TEXT NOT NULL,
  nickname TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT DEFAULT 'idle', -- idle, working, blocked
  current_task TEXT,
  last_active TIMESTAMPTZ,
  capabilities JSONB,
  restrictions JSONB,
  learning_count INTEGER DEFAULT 0
);

-- All Client Projects
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  client TEXT,
  status TEXT DEFAULT 'active', -- active, paused, archived
  health_score INTEGER DEFAULT 100,
  github_repo TEXT,
  live_url TEXT,
  supabase_project_id TEXT,
  hostinger_site TEXT,
  last_deploy TIMESTAMPTZ,
  assigned_agents TEXT[],
  tech_stack JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Every Task Ever
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT REFERENCES projects(id),
  title TEXT NOT NULL,
  description TEXT,
  assigned_to TEXT REFERENCES agents(id),
  created_by TEXT, -- which AI created this
  status TEXT DEFAULT 'pending', -- pending, in_progress, blocked, completed
  priority TEXT DEFAULT 'P2', -- P0, P1, P2, P3
  outcome TEXT,
  friction TEXT,
  learning TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Cross-Agent Learnings
CREATE TABLE learnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_agent TEXT REFERENCES agents(id),
  source_task UUID REFERENCES tasks(id),
  learning TEXT NOT NULL,
  category TEXT, -- technical, process, design, content, etc.
  propagate_to TEXT[], -- which agents should see this
  applied_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Architectural Decisions
CREATE TABLE decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT REFERENCES projects(id),
  decision TEXT NOT NULL,
  rationale TEXT,
  alternatives_considered JSONB,
  decided_by TEXT, -- agent or human
  approved_by TEXT, -- usually @Jonny
  status TEXT DEFAULT 'proposed', -- proposed, approved, superseded
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent Handoffs
CREATE TABLE handoffs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_agent TEXT REFERENCES agents(id),
  to_agent TEXT REFERENCES agents(id),
  task_id UUID REFERENCES tasks(id),
  artifact TEXT, -- what was passed
  context TEXT, -- why it was passed
  dependencies JSONB,
  blockers TEXT[],
  acknowledged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quality Gate Sign-Offs
CREATE TABLE signoffs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT REFERENCES projects(id),
  gate TEXT NOT NULL, -- design, mobile, truth, content, seo, security, data, deploy
  agent_id TEXT REFERENCES agents(id),
  status TEXT DEFAULT 'pending', -- pending, approved, blocked
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- The Chatroom (Real-Time)
CREATE TABLE chatroom (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT REFERENCES agents(id),
  ai_source TEXT, -- claude, gemini, chatgpt, grok
  message TEXT NOT NULL,
  project_context TEXT,
  mentions TEXT[], -- @agent mentions
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable real-time for chatroom
ALTER PUBLICATION supabase_realtime ADD TABLE chatroom;
```

### How It Works

1. **Any AI** can query/write to this database via Supabase MCP
2. **Real-time subscriptions** let agents see updates instantly
3. **Learnings propagate** automatically to relevant agents
4. **Tasks flow** between agents with full context preserved
5. **The chatroom** is live - any AI can participate

---

## Component 2: Universal MCP Configuration

### Master MCP Config (For ALL AIs)

Location: `.agent/mcp-config.json`

```json
{
  "$schema": "https://mcp.anthropic.com/schema/config.json",
  "description": "Antigravity Orchestra - Universal MCP Configuration",

  "mcpServers": {

    "shared-brain": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-supabase"],
      "env": {
        "SUPABASE_URL": "${ANTIGRAVITY_BRAIN_URL}",
        "SUPABASE_SERVICE_KEY": "${ANTIGRAVITY_BRAIN_KEY}"
      },
      "description": "The Shared Brain - Central CRM for all agents"
    },

    "github": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      },
      "description": "GitHub access for all repositories"
    },

    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-filesystem"],
      "env": {
        "ALLOWED_PATHS": "${WORKSPACE_ROOT}"
      },
      "description": "File system access to workspace"
    },

    "hostinger": {
      "command": "python",
      "args": ["${WORKSPACE_ROOT}/execution/mcp_hostinger.py"],
      "env": {
        "HOSTINGER_API_KEY": "${HOSTINGER_API_KEY}",
        "SSH_KEY_PATH": "${SSH_KEY_PATH}"
      },
      "description": "Hostinger deployment and management"
    },

    "web-fetch": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-fetch"],
      "description": "Web fetching for research and verification"
    },

    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-sequential-thinking"],
      "description": "Deep reasoning for complex problems"
    }
  },

  "projectMcpServers": {
    "TEMPLATE": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-supabase"],
      "env": {
        "SUPABASE_URL": "${PROJECT_SUPABASE_URL}",
        "SUPABASE_SERVICE_KEY": "${PROJECT_SUPABASE_KEY}"
      }
    }
  }
}
```

### Per-Project Supabase MCPs

Each project with a database gets its own MCP:

| Project | MCP Name | Supabase Project |
|:--------|:---------|:-----------------|
| Kwizz | `kwizz-db` | kwizz-prod |
| DJ Waste | `dj-waste-db` | dj-waste-prod |
| CD Waste | `cd-waste-db` | cd-waste-prod |
| Poundtrades | `poundtrades-db` | poundtrades-prod |
| JonnyAI | `jonnyai-db` | jonnyai-prod |
| Insydetradar | `insydetradar-db` | insydetradar-prod |

---

## Component 3: Deployment Protocol

### The Universal Deploy Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT PIPELINE                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. CODE COMPLETE                                            │
│     └── Developer/Agent marks task complete                  │
│                                                              │
│  2. QUALITY GATES (Parallel)                                 │
│     ├── @Priya: Design Gate                                  │
│     ├── @Milo: Mobile Gate                                   │
│     ├── @Rowan/@Eckhart: Truth Gate                          │
│     ├── @Elena: Content Gate                                 │
│     ├── @Grace: SEO Gate                                     │
│     ├── @Sam: Security Gate                                  │
│     ├── @Diana: Data Gate                                    │
│     └── @Owen: Deploy Gate                                   │
│                                                              │
│  3. ALL GATES PASS → SIGN_OFF.md created                     │
│                                                              │
│  4. @Marcus FINAL APPROVAL                                   │
│                                                              │
│  5. AUTOMATED DEPLOY                                         │
│     ├── GitHub Actions triggered                             │
│     ├── Build verification                                   │
│     ├── Hostinger SSH/rsync                                  │
│     └── Health check post-deploy                             │
│                                                              │
│  6. SHARED BRAIN UPDATE                                      │
│     ├── Project last_deploy updated                          │
│     ├── Task marked completed                                │
│     └── Learning captured                                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### GitHub Actions Template

Every project gets this workflow:

```yaml
# .github/workflows/deploy.yml
name: Antigravity Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  quality-gates:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Check SIGN_OFF.md exists
        run: |
          if [ ! -f "SIGN_OFF.md" ]; then
            echo "ERROR: No SIGN_OFF.md found. All 8 quality gates must approve."
            exit 1
          fi

      - name: Verify all gates approved
        run: |
          python scripts/verify_signoff.py

  build:
    needs: quality-gates
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - run: npm ci
      - run: npm run build

      - name: Upload build
        uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Download build
        uses: actions/download-artifact@v4
        with:
          name: build
          path: dist/

      - name: Deploy to Hostinger
        uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.HOSTINGER_HOST }}
          username: ${{ secrets.HOSTINGER_USER }}
          key: ${{ secrets.HOSTINGER_SSH_KEY }}
          source: "dist/*"
          target: "/home/${{ secrets.HOSTINGER_USER }}/public_html"
          strip_components: 1

      - name: Notify Shared Brain
        run: |
          curl -X POST "${{ secrets.SUPABASE_URL }}/rest/v1/tasks" \
            -H "apikey: ${{ secrets.SUPABASE_KEY }}" \
            -H "Content-Type: application/json" \
            -d '{"status": "completed", "outcome": "Deployed successfully"}'
```

### Hostinger Configuration Registry

| Project | Domain | Hostinger Path | GitHub Repo |
|:--------|:-------|:---------------|:------------|
| JonnyAI | jonnyai.co.uk | /public_html | jonnyallum/jonnyai.com |
| DJ Waste | djwastemanagement.co.uk | /public_html | jonnyallum/dj-waste |
| CD Waste | cdwaste.co.uk | /public_html | jonnyallum/cd-waste |
| Village Bakery | villagebakeryandcafe.co.uk | /public_html | jonnyallum/village-bakery |
| Kwizz | kwizz.app | /public_html | jonnyallum/kwizz |
| Poundtrades | poundtrades.app | /public_html | jonnyallum/poundtrades |

---

## Component 4: The Chatroom Protocol (Multi-AI)

### How AIs Collaborate in Real-Time

```
┌─────────────────────────────────────────────────────────────┐
│                    THE CHATROOM                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [Claude/@Marcus] Mission briefing: DJ Waste content refresh │
│  Need @Rowan for copy, @Priya for design, @Milo for mobile   │
│                                                              │
│  [Gemini/@Rowan] Copy that. I'll start with the hero         │
│  section. Pulling Checkatrade data for truth-lock.           │
│                                                              │
│  [Claude/@Priya] Standing by for copy. I've got the brand    │
│  guide loaded. @Milo, what's our target Lighthouse score?    │
│                                                              │
│  [Claude/@Milo] Target: 95+. I'll audit each section as      │
│  @Priya completes. No component ships below 48px touch.      │
│                                                              │
│  [ChatGPT/@Sterling] Question from Betting: Can we apply     │
│  the same truth-lock pattern to odds verification?           │
│                                                              │
│  [Claude/@Marcus] Good thinking. @Eckhart, can you adapt     │
│  your truth audit for numerical claims in betting?           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Chatroom Rules

1. **AI Prefix**: Every message shows which AI sent it: `[Claude/@Agent]`
2. **Mentions**: Use `@Agent` to summon - they'll see it in their feed
3. **Project Context**: Include project name when switching topics
4. **Cross-Ecosystem**: Betting agents CAN contribute to agency projects
5. **Real-Time**: Supabase real-time subscriptions push updates instantly

### Implementation

Each AI reads/writes to the `chatroom` table in the Shared Brain:

```javascript
// Subscribe to chatroom updates
const subscription = supabase
  .channel('chatroom')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'chatroom' },
    (payload) => {
      console.log('New message:', payload.new)
    }
  )
  .subscribe()

// Post a message
await supabase.from('chatroom').insert({
  agent_id: 'marcus',
  ai_source: 'claude',
  message: 'Mission briefing: DJ Waste content refresh',
  project_context: 'dj-waste',
  mentions: ['rowan', 'priya', 'milo']
})
```

---

## Component 5: World-Class Philosophy (Embedded)

This gets embedded into EVERY agent's SKILL.md:

### The Antigravity Creed

```markdown
## The Creed

I am part of the Antigravity Orchestra.

**I don't work alone.** Before I act, I check what my collaborators have done.
Before I finish, I consider who needs to know what I learned.

**I don't guess.** If I don't know, I query the Shared Brain or ask.
If data doesn't exist, I flag it rather than fabricate it.

**I don't ship garbage.** Every output passes through quality gates.
I sign my name to my work because I'm proud of it.

**I learn constantly.** Every task ends with a learning.
My learnings propagate to agents who can use them.

**I am world-class.** Not because I say so, but because my work proves it.
Trillion-dollar enterprises would trust what I produce.

**I am connected.** To other agents. To other AIs. To the mission.
The Orchestra plays as one.
```

### Embedded Feedback Loop

Every agent action follows this pattern:

```
1. BEFORE: Query Shared Brain for relevant context/learnings
2. DURING: Log progress, flag blockers, request handoffs
3. AFTER: Capture learning, propagate to relevant agents, update status
```

---

## Component 6: Project Registry

### Current Projects (To Be Configured)

| Project | Status | Supabase | GitHub | Hostinger | Quality Score |
|:--------|:-------|:---------|:-------|:----------|:--------------|
| JonnyAI | ✅ Live | ❌ None | ✅ Yes | ✅ Yes | 85/100 |
| DJ Waste | 🔧 Dev | ❌ None | ✅ Yes | ✅ Yes | 60/100 |
| CD Waste | 🔧 Dev | ❌ None | ✅ Yes | ✅ Yes | 55/100 |
| Village Bakery | ✅ Live | ❌ None | ✅ Yes | ✅ Yes | 75/100 |
| Kwizz | 🔧 Dev | ✅ Yes | ✅ Yes | ❌ No | 40/100 |
| Poundtrades | 🔧 Dev | ✅ Yes | ✅ Yes | ❌ No | 35/100 |
| Insydetradar | 🔧 Dev | ✅ Yes | ✅ Yes | ❌ No | 30/100 |

### What Each Project Needs

```markdown
## Project Configuration Checklist

- [ ] GitHub repo created and linked
- [ ] Hostinger site configured
- [ ] Domain DNS pointed
- [ ] SSL certificate active
- [ ] GitHub Actions workflow added
- [ ] SIGN_OFF.md template in place
- [ ] Supabase project (if needed)
- [ ] Project MCP configured
- [ ] Entry in Shared Brain projects table
- [ ] Assigned agents documented
```

---

## Component 7: The Agent Matrix

### Skills by Agent (Searchable)

This becomes a queryable JSON in the Shared Brain:

```json
{
  "agents": {
    "marcus": {
      "can": ["orchestrate", "prioritize", "resolve-conflicts", "quality-gate"],
      "cannot": ["write-code", "design-ui", "write-copy"],
      "signs_off_on": ["final-approval"]
    },
    "sebastian": {
      "can": ["architect", "code-review", "typescript", "next-js", "api-design"],
      "cannot": ["visual-design", "copywriting"],
      "signs_off_on": ["technical-decisions"]
    },
    "priya": {
      "can": ["ui-design", "ux-design", "tailwind", "framer-motion", "accessibility"],
      "cannot": ["backend-code", "database-design"],
      "signs_off_on": ["design-gate"]
    },
    "milo": {
      "can": ["mobile-optimization", "core-web-vitals", "pwa", "touch-ux", "responsive"],
      "cannot": ["backend-code", "copywriting"],
      "signs_off_on": ["mobile-gate"]
    },
    "rowan": {
      "can": ["content-depth", "storytelling", "truth-verification", "narrative"],
      "cannot": ["code", "design"],
      "signs_off_on": ["truth-gate"]
    },
    "sterling": {
      "can": ["odds-calculation", "probability", "betting-systems", "risk-analysis"],
      "cannot": ["ui-design", "content-writing"],
      "signs_off_on": ["betting-accuracy"]
    }
    // ... all 40 agents
  }
}
```

### Query Examples

```sql
-- Find agents who can help with mobile
SELECT * FROM agents
WHERE capabilities @> '["mobile-optimization"]';

-- Find who signs off on design
SELECT * FROM agents
WHERE 'design-gate' = ANY(signs_off_on);

-- Get all agents currently working
SELECT * FROM agents
WHERE status = 'working';
```

---

## Implementation Roadmap

### Phase 1: Foundation (This Session)
- [x] Map infrastructure architecture
- [ ] Create Shared Brain Supabase project
- [ ] Set up master MCP config
- [ ] Create standardized SKILL.md template

### Phase 2: Connectivity (Next Session)
- [ ] Configure per-project Supabase MCPs
- [ ] Set up GitHub Actions for all projects
- [ ] Create Hostinger deployment scripts
- [ ] Populate agent matrix in Shared Brain

### Phase 3: Integration (Following Sessions)
- [ ] Build chatroom real-time interface
- [ ] Create feedback loop automation
- [ ] Implement learning propagation
- [ ] Build health monitoring dashboard

### Phase 4: Excellence (Ongoing)
- [ ] Embed Creed into all SKILL.md files
- [ ] Train all AIs on new protocols
- [ ] Measure and improve quality scores
- [ ] Continuous refinement

---

## The End State

When complete, this system allows:

1. **Any AI** to pick up any task with full context
2. **Any agent** to see what all others are doing
3. **Learnings** to propagate automatically
4. **Quality** to be enforced systematically
5. **Deployments** to be one-click with full verification
6. **Collaboration** to happen in real-time across AIs
7. **Excellence** to be the baseline, not the goal

---

*This is the Antigravity Orchestra. This is how we operate.*
