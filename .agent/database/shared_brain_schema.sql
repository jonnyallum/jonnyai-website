-- ═══════════════════════════════════════════════════════════════════════════════
--                              Jai.OS 4.0
--                    The Antigravity Shared Brain
--                         Complete Schema
-- ═══════════════════════════════════════════════════════════════════════════════
--
-- INSTRUCTIONS:
-- 1. Create a new Supabase project called "antigravity-brain"
-- 2. Go to SQL Editor
-- 3. Paste this entire file
-- 4. Click "Run"
--
-- ═══════════════════════════════════════════════════════════════════════════════


-- ─────────────────────────────────────────────────────────────────────────────────
-- TABLE 1: AGENTS
-- The 40-member orchestra with capabilities and status
-- ─────────────────────────────────────────────────────────────────────────────────

CREATE TABLE agents (
  id TEXT PRIMARY KEY,                          -- e.g., 'marcus', 'sebastian', 'priya'
  human_name TEXT NOT NULL,                     -- e.g., 'Marcus Cole'
  nickname TEXT NOT NULL,                       -- e.g., 'The Maestro'
  role TEXT NOT NULL,                           -- e.g., 'Orchestrator'
  status TEXT DEFAULT 'idle',                   -- idle | working | blocked | offline
  current_task_id UUID,                         -- FK to tasks (nullable)
  current_ai TEXT,                              -- Which AI is using this agent right now
  last_active TIMESTAMPTZ,
  capabilities TEXT[] DEFAULT '{}',             -- What they CAN do
  restrictions TEXT[] DEFAULT '{}',             -- What they CANNOT do
  signs_off_on TEXT[] DEFAULT '{}',             -- Quality gates they approve
  accent_color TEXT,                            -- HSL color for UI
  authority_level INTEGER DEFAULT 2,            -- 1=Tactical, 2=Operational, 3=Strategic, 4=Critical
  learning_count INTEGER DEFAULT 0,
  task_count INTEGER DEFAULT 0,
  success_rate DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_agents_current_ai ON agents(current_ai);


-- ─────────────────────────────────────────────────────────────────────────────────
-- TABLE 2: PROJECTS
-- All client projects with health scores and configuration
-- ─────────────────────────────────────────────────────────────────────────────────

CREATE TABLE projects (
  id TEXT PRIMARY KEY,                          -- e.g., 'dj-waste', 'kwizz', 'jonnyai'
  name TEXT NOT NULL,                           -- e.g., 'DJ Waste Management'
  client TEXT,                                  -- Client name
  status TEXT DEFAULT 'active',                 -- active | paused | archived | blocked
  health_score INTEGER DEFAULT 100,             -- 0-100

  -- Repository & Deployment
  github_repo TEXT,                             -- e.g., 'jonnyallum/dj-waste'
  github_branch TEXT DEFAULT 'main',
  live_url TEXT,                                -- e.g., 'https://djwastemanagement.co.uk'
  staging_url TEXT,

  -- Infrastructure
  supabase_project_id TEXT,                     -- If project has its own Supabase
  supabase_url TEXT,
  hostinger_path TEXT,                          -- e.g., '/public_html'
  hostinger_domain TEXT,

  -- Tech Stack
  tech_stack JSONB DEFAULT '{}',                -- {"framework": "next", "styling": "tailwind"}

  -- Team
  assigned_agents TEXT[] DEFAULT '{}',          -- ['sebastian', 'priya', 'milo']
  primary_contact TEXT,                         -- Main agent responsible

  -- Timestamps
  last_deploy TIMESTAMPTZ,
  last_commit TEXT,
  last_commit_ai TEXT,
  last_commit_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_health ON projects(health_score);


-- ─────────────────────────────────────────────────────────────────────────────────
-- TABLE 3: TASKS
-- Every task ever, with outcomes and learnings
-- ─────────────────────────────────────────────────────────────────────────────────

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,

  -- Task Details
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'P2',                   -- P0 (critical) | P1 | P2 | P3 (low)

  -- Assignment
  assigned_to TEXT REFERENCES agents(id) ON DELETE SET NULL,
  created_by_ai TEXT NOT NULL,                  -- claude | gemini | chatgpt | grok
  created_by_agent TEXT,                        -- Which agent created this
  created_by_machine TEXT,                      -- Machine identifier

  -- Status
  status TEXT DEFAULT 'pending',                -- pending | in_progress | blocked | completed | cancelled
  blocked_reason TEXT,

  -- Outcome (filled when completed)
  outcome TEXT,                                 -- success | partial | failed
  outcome_notes TEXT,
  friction TEXT,                                -- What slowed us down
  learning TEXT,                                -- What we'd do differently

  -- Timestamps
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_created ON tasks(created_at DESC);


-- ─────────────────────────────────────────────────────────────────────────────────
-- TABLE 4: LEARNINGS
-- Cross-agent knowledge that propagates
-- ─────────────────────────────────────────────────────────────────────────────────

CREATE TABLE learnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Source
  source_agent TEXT REFERENCES agents(id) ON DELETE SET NULL,
  source_task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  source_project TEXT REFERENCES projects(id) ON DELETE SET NULL,
  source_ai TEXT,                               -- Which AI discovered this

  -- Learning Content
  learning TEXT NOT NULL,                       -- The actual insight
  category TEXT,                                -- technical | process | design | content | performance | security
  tags TEXT[] DEFAULT '{}',                     -- ['mobile', 'performance', 'tailwind']

  -- Propagation
  propagate_to TEXT[] DEFAULT '{}',             -- Which agents should see this
  applied_count INTEGER DEFAULT 0,              -- How many times this learning was applied

  -- Validation
  verified BOOLEAN DEFAULT FALSE,               -- Has this been verified as useful?
  verified_by TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_learnings_agent ON learnings(source_agent);
CREATE INDEX idx_learnings_category ON learnings(category);
CREATE INDEX idx_learnings_tags ON learnings USING GIN(tags);


-- ─────────────────────────────────────────────────────────────────────────────────
-- TABLE 5: CHATROOM
-- Real-time multi-AI collaboration
-- ─────────────────────────────────────────────────────────────────────────────────

CREATE TABLE chatroom (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Source
  ai_source TEXT NOT NULL,                      -- claude | gemini | chatgpt | grok
  machine_id TEXT,                              -- Which physical machine
  agent_id TEXT REFERENCES agents(id) ON DELETE SET NULL,

  -- Message
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'chat',             -- chat | sync | alert | handoff | question | decision

  -- Context
  project_context TEXT REFERENCES projects(id) ON DELETE SET NULL,
  task_context UUID REFERENCES tasks(id) ON DELETE SET NULL,
  mentions TEXT[] DEFAULT '{}',                 -- ['marcus', 'priya']

  -- Metadata
  metadata JSONB DEFAULT '{}',                  -- Additional structured data

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chatroom_created ON chatroom(created_at DESC);
CREATE INDEX idx_chatroom_project ON chatroom(project_context);
CREATE INDEX idx_chatroom_agent ON chatroom(agent_id);
CREATE INDEX idx_chatroom_type ON chatroom(message_type);


-- ─────────────────────────────────────────────────────────────────────────────────
-- TABLE 6: SYNC_LOCKS
-- Prevents simultaneous git operations
-- ─────────────────────────────────────────────────────────────────────────────────

CREATE TABLE sync_locks (
  id TEXT NOT NULL,                             -- 'github-push' | 'deploy' | 'build'
  project_id TEXT NOT NULL,                     -- Which project is locked

  -- Lock holder
  held_by_ai TEXT NOT NULL,                     -- claude | gemini | chatgpt | grok
  held_by_machine TEXT,                         -- Machine identifier
  held_by_agent TEXT,                           -- Which agent holds the lock

  -- Timing
  acquired_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,              -- Auto-release after timeout

  -- Context
  reason TEXT,                                  -- Why the lock was acquired

  PRIMARY KEY (id, project_id)
);

CREATE INDEX idx_sync_locks_expires ON sync_locks(expires_at);


-- ─────────────────────────────────────────────────────────────────────────────────
-- TABLE 7: SYNC_STATE
-- Tracks who pushed what and when
-- ─────────────────────────────────────────────────────────────────────────────────

CREATE TABLE sync_state (
  project_id TEXT PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,

  -- Last Push
  last_push_ai TEXT,
  last_push_agent TEXT,
  last_push_machine TEXT,
  last_push_commit TEXT,                        -- Commit hash
  last_push_message TEXT,                       -- Commit message
  last_push_at TIMESTAMPTZ,

  -- Last Pull (per AI)
  last_pull_claude TIMESTAMPTZ,
  last_pull_gemini TIMESTAMPTZ,
  last_pull_chatgpt TIMESTAMPTZ,
  last_pull_grok TIMESTAMPTZ,

  -- Local Changes (JSON per AI)
  pending_changes JSONB DEFAULT '{}',           -- {"claude": ["file1.ts", "file2.ts"], "gemini": [...]}

  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ─────────────────────────────────────────────────────────────────────────────────
-- TABLE 8: HANDOFFS
-- Structured task passing between agents
-- ─────────────────────────────────────────────────────────────────────────────────

CREATE TABLE handoffs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Parties
  from_agent TEXT REFERENCES agents(id) ON DELETE SET NULL,
  from_ai TEXT,
  to_agent TEXT REFERENCES agents(id) ON DELETE SET NULL,

  -- Context
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,

  -- Handoff Details
  artifact TEXT,                                -- What was passed (file, component, etc.)
  context TEXT,                                 -- Why it was passed
  dependencies JSONB DEFAULT '{}',              -- What the receiver needs to know
  blockers TEXT[] DEFAULT '{}',                 -- Known blockers

  -- Status
  acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_at TIMESTAMPTZ,
  acknowledged_by_ai TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_handoffs_to ON handoffs(to_agent);
CREATE INDEX idx_handoffs_from ON handoffs(from_agent);
CREATE INDEX idx_handoffs_project ON handoffs(project_id);


-- ─────────────────────────────────────────────────────────────────────────────────
-- TABLE 9: SIGNOFFS
-- Quality gate approvals
-- ─────────────────────────────────────────────────────────────────────────────────

CREATE TABLE signoffs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- What's being signed off
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,

  -- Gate Details
  gate TEXT NOT NULL,                           -- design | mobile | truth | content | seo | security | data | deploy

  -- Approver
  agent_id TEXT REFERENCES agents(id) ON DELETE SET NULL,
  ai_source TEXT,

  -- Decision
  status TEXT DEFAULT 'pending',                -- pending | approved | blocked | waived
  notes TEXT,                                   -- Approval notes or block reasons

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  decided_at TIMESTAMPTZ
);

CREATE INDEX idx_signoffs_project ON signoffs(project_id);
CREATE INDEX idx_signoffs_gate ON signoffs(gate);
CREATE INDEX idx_signoffs_status ON signoffs(status);

-- Unique constraint: one sign-off per gate per project
CREATE UNIQUE INDEX idx_signoffs_unique ON signoffs(project_id, gate) WHERE task_id IS NULL;


-- ─────────────────────────────────────────────────────────────────────────────────
-- TABLE 10: DECISIONS
-- Architectural and strategic decisions log
-- ─────────────────────────────────────────────────────────────────────────────────

CREATE TABLE decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Context
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,

  -- Decision
  title TEXT NOT NULL,
  decision TEXT NOT NULL,                       -- What was decided
  rationale TEXT,                               -- Why
  alternatives_considered JSONB,                -- Other options considered

  -- Authority
  decided_by_agent TEXT,
  decided_by_ai TEXT,
  approved_by TEXT,                             -- Usually '@jonny' for L4 decisions
  authority_level INTEGER DEFAULT 2,            -- 1-4

  -- Status
  status TEXT DEFAULT 'proposed',               -- proposed | approved | implemented | superseded
  superseded_by UUID REFERENCES decisions(id),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ
);

CREATE INDEX idx_decisions_project ON decisions(project_id);
CREATE INDEX idx_decisions_status ON decisions(status);


-- ═══════════════════════════════════════════════════════════════════════════════
--                          ENABLE REALTIME
-- ═══════════════════════════════════════════════════════════════════════════════

-- Enable real-time for chatroom (critical for multi-AI collaboration)
ALTER PUBLICATION supabase_realtime ADD TABLE chatroom;

-- Enable real-time for tasks (see task updates live)
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;

-- Enable real-time for handoffs (see handoffs as they happen)
ALTER PUBLICATION supabase_realtime ADD TABLE handoffs;

-- Enable real-time for agent status
ALTER PUBLICATION supabase_realtime ADD TABLE agents;


-- ═══════════════════════════════════════════════════════════════════════════════
--                          ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE learnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatroom ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE handoffs ENABLE ROW LEVEL SECURITY;
ALTER TABLE signoffs ENABLE ROW LEVEL SECURITY;
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full access (all AIs use service role key)
-- In production, you'd have more granular policies

CREATE POLICY "Allow all for authenticated" ON agents FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON projects FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON tasks FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON learnings FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON chatroom FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON sync_locks FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON sync_state FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON handoffs FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON signoffs FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON decisions FOR ALL USING (true);


-- ═══════════════════════════════════════════════════════════════════════════════
--                          HELPER FUNCTIONS
-- ═══════════════════════════════════════════════════════════════════════════════

-- Function to clean expired locks
CREATE OR REPLACE FUNCTION clean_expired_locks()
RETURNS void AS $$
BEGIN
  DELETE FROM sync_locks WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to update agent stats
CREATE OR REPLACE FUNCTION update_agent_stats(agent_id_param TEXT)
RETURNS void AS $$
BEGIN
  UPDATE agents SET
    task_count = (SELECT COUNT(*) FROM tasks WHERE assigned_to = agent_id_param),
    success_rate = (
      SELECT COALESCE(
        ROUND(
          COUNT(*) FILTER (WHERE outcome = 'success')::DECIMAL /
          NULLIF(COUNT(*) FILTER (WHERE outcome IS NOT NULL), 0) * 100,
          2
        ),
        0
      )
      FROM tasks WHERE assigned_to = agent_id_param
    ),
    updated_at = NOW()
  WHERE id = agent_id_param;
END;
$$ LANGUAGE plpgsql;

-- Function to update project health based on recent tasks
CREATE OR REPLACE FUNCTION update_project_health(project_id_param TEXT)
RETURNS void AS $$
DECLARE
  recent_success_rate DECIMAL;
BEGIN
  -- Calculate success rate of last 10 tasks
  SELECT COALESCE(
    ROUND(
      COUNT(*) FILTER (WHERE outcome = 'success')::DECIMAL /
      NULLIF(COUNT(*) FILTER (WHERE outcome IS NOT NULL), 0) * 100,
      0
    ),
    100
  ) INTO recent_success_rate
  FROM (
    SELECT outcome FROM tasks
    WHERE project_id = project_id_param
    ORDER BY created_at DESC
    LIMIT 10
  ) recent;

  UPDATE projects SET
    health_score = recent_success_rate::INTEGER,
    updated_at = NOW()
  WHERE id = project_id_param;
END;
$$ LANGUAGE plpgsql;


-- ═══════════════════════════════════════════════════════════════════════════════
--                          INITIAL DATA
-- ═══════════════════════════════════════════════════════════════════════════════

-- Insert the 40 agents (core set - add more as needed)
INSERT INTO agents (id, human_name, nickname, role, capabilities, signs_off_on, accent_color, authority_level) VALUES
  ('marcus', 'Marcus Cole', 'The Maestro', 'Orchestrator', ARRAY['orchestrate', 'prioritize', 'resolve-conflicts', 'quality-gate'], ARRAY['final-approval'], 'hsl(270, 70%, 50%)', 3),
  ('sebastian', 'Sebastian Vance', 'The Architect', 'Full-Stack Architect', ARRAY['typescript', 'next-js', 'react', 'api-design', 'architecture'], ARRAY['technical-decisions'], 'hsl(210, 100%, 50%)', 3),
  ('priya', 'Priya Sharma', 'The Perfectionist', 'UI/UX Designer', ARRAY['ui-design', 'ux-design', 'tailwind', 'framer-motion', 'accessibility'], ARRAY['design-gate'], 'hsl(330, 80%, 60%)', 2),
  ('milo', 'Milo Swift', 'The Thumb', 'Mobile Specialist', ARRAY['mobile-optimization', 'core-web-vitals', 'pwa', 'touch-ux', 'responsive'], ARRAY['mobile-gate'], 'hsl(195, 100%, 50%)', 2),
  ('sam', 'Sam Blackwood', 'The Gatekeeper', 'Security Specialist', ARRAY['security-audit', 'penetration-testing', 'input-validation', 'authentication'], ARRAY['security-gate'], 'hsl(0, 70%, 50%)', 2),
  ('diana', 'Diana Chen', 'The Vault', 'Database Architect', ARRAY['postgresql', 'supabase', 'schema-design', 'rls', 'migrations'], ARRAY['data-gate'], 'hsl(240, 60%, 50%)', 2),
  ('owen', 'Owen Stinger', 'The Hornet', 'DevOps Engineer', ARRAY['ci-cd', 'github-actions', 'deployment', 'docker', 'monitoring'], ARRAY['deploy-gate'], 'hsl(30, 100%, 50%)', 2),
  ('rowan', 'Rowan Grave', 'The Beast', 'Content Specialist', ARRAY['content-depth', 'storytelling', 'truth-verification', 'narrative'], ARRAY['truth-gate'], 'hsl(25, 80%, 45%)', 2),
  ('eckhart', 'Eckhart Colle', 'The Present', 'Truth Auditor', ARRAY['fact-checking', 'claim-verification', 'bullshit-detection'], ARRAY['truth-gate'], 'hsl(45, 90%, 50%)', 2),
  ('elena', 'Elena Vasquez', 'The Voice', 'Copywriter', ARRAY['copywriting', 'brand-voice', 'microcopy', 'cta-optimization'], ARRAY['content-gate'], 'hsl(280, 70%, 55%)', 2),
  ('grace', 'Grace Liu', 'The Ranker', 'SEO Specialist', ARRAY['seo', 'meta-tags', 'schema-org', 'keyword-research', 'serp-analysis'], ARRAY['seo-gate'], 'hsl(120, 60%, 45%)', 2),
  ('carlos', 'Carlos Mendez', 'The Hook', 'Video Editor', ARRAY['video-editing', 'viral-hooks', 'retention-optimization', 'short-form'], ARRAY[]::TEXT[], 'hsl(350, 80%, 60%)', 2),
  ('blitz', 'Blake Vex', 'Neon', 'Visual Creative', ARRAY['logo-design', 'brand-identity', 'viral-graphics', 'thumbnail-design'], ARRAY[]::TEXT[], 'hsl(300, 100%, 50%)', 2),
  ('felix', 'Felix Morgan', 'The Alchemist', 'Growth Strategist', ARRAY['monetization', 'funnel-design', 'pricing-strategy', 'market-testing'], ARRAY[]::TEXT[], 'hsl(45, 100%, 50%)', 2),
  ('maya', 'Maya Singh', 'The Oracle', 'Analytics Expert', ARRAY['analytics', 'data-visualization', 'conversion-tracking', 'a-b-testing'], ARRAY[]::TEXT[], 'hsl(180, 70%, 45%)', 2),
  ('hannah', 'Hannah Park', 'The Fixer', 'Customer Success', ARRAY['customer-support', 'triage', 'feedback-collection', 'user-research'], ARRAY[]::TEXT[], 'hsl(340, 70%, 65%)', 2),
  ('arthur', 'Arthur Webb', 'The Librarian', 'Knowledge Manager', ARRAY['documentation', 'knowledge-base', 'runbooks', 'api-reference'], ARRAY[]::TEXT[], 'hsl(200, 20%, 50%)', 2),
  ('sophie', 'Sophie Reid', 'The Hawk', 'Research Analyst', ARRAY['web-research', 'competitor-analysis', 'market-research', 'scraping'], ARRAY[]::TEXT[], 'hsl(140, 60%, 45%)', 2),
  ('patrick', 'Patrick Nguyen', 'The Surgeon', 'Data Engineer', ARRAY['data-extraction', 'schema-validation', 'etl', 'data-transformation'], ARRAY[]::TEXT[], 'hsl(200, 50%, 50%)', 2),
  ('alex', 'Alex Torres', 'The Machine', 'Automation Engineer', ARRAY['automation', 'workflows', 'integrations', 'scripting'], ARRAY[]::TEXT[], 'hsl(190, 100%, 45%)', 2),
  ('victor', 'Victor Reyes', 'The Locksmith', 'Security Officer', ARRAY['secrets-management', 'encryption', 'certificates', 'key-rotation'], ARRAY[]::TEXT[], 'hsl(0, 50%, 40%)', 2),
  ('derek', 'Derek O''Brien', 'The Engine', 'Infrastructure Engineer', ARRAY['cloud-hosting', 'server-management', 'dns', 'ssl'], ARRAY[]::TEXT[], 'hsl(210, 50%, 55%)', 2),
  ('mason', 'Mason Drake', 'The Bridgemaster', 'Integration Specialist', ARRAY['mcp-servers', 'api-integration', 'tool-discovery'], ARRAY[]::TEXT[], 'hsl(270, 50%, 55%)', 2),
  ('adrian', 'Adrian Cross', 'The Welder', 'MCP Developer', ARRAY['mcp-development', 'server-building', 'protocol-design'], ARRAY[]::TEXT[], 'hsl(150, 70%, 45%)', 2),
  ('luna', 'Luna Sterling', 'The Shield', 'Legal Advisor', ARRAY['gdpr', 'contracts', 'ip-protection', 'risk-assessment'], ARRAY[]::TEXT[], 'hsl(220, 40%, 45%)', 2),
  ('winston', 'Winston Hayes', 'Whiz', 'Logistics Expert', ARRAY['dropshipping', 'supply-chain', 'margin-optimization'], ARRAY[]::TEXT[], 'hsl(240, 50%, 50%)', 2),
  ('trotter', 'Derek Trotter', 'The Trader', 'Trading Systems', ARRAY['trading', 'risk-management', 'backtesting', 'market-analysis'], ARRAY[]::TEXT[], 'hsl(120, 70%, 40%)', 2),
  ('genesis', 'Genesis Nova', 'The Cloner', 'Ecosystem Creator', ARRAY['project-scaffolding', 'template-creation', 'variant-generation'], ARRAY[]::TEXT[], 'hsl(320, 100%, 55%)', 2),
  ('vigil', 'Vigil Chen', 'The Eye', 'Quality Monitor', ARRAY['continuous-improvement', 'quality-scanning', 'feedback-loops'], ARRAY[]::TEXT[], 'hsl(250, 60%, 50%)', 2),
  ('daniel', 'Daniel Bukowski', 'The Detective', 'Mobile Debugger', ARRAY['expo-doctor', 'mobile-diagnostics', 'build-debugging'], ARRAY[]::TEXT[], 'hsl(200, 30%, 50%)', 2);

-- Insert initial projects (your current clients)
INSERT INTO projects (id, name, client, github_repo, live_url, tech_stack, assigned_agents) VALUES
  ('jonnyai', 'JonnyAI Website', 'Antigravity', 'jonnyallum/jonnyai.com', 'https://jonnyai.co.uk', '{"framework": "next", "styling": "tailwind"}', ARRAY['sebastian', 'priya', 'milo', 'grace']),
  ('dj-waste', 'DJ Waste Management', 'DJ Waste', 'jonnyallum/dj-waste', 'https://djwastemanagement.co.uk', '{"framework": "vite", "styling": "tailwind"}', ARRAY['sebastian', 'priya', 'rowan']),
  ('cd-waste', 'CD Waste', 'CD Waste', 'jonnyallum/cd-waste', NULL, '{"framework": "vite", "styling": "tailwind"}', ARRAY['sebastian', 'priya']),
  ('village-bakery', 'Village Bakery', 'Village Bakery', 'jonnyallum/village-bakery', 'https://villagebakeryandcafe.co.uk', '{"framework": "html", "styling": "css"}', ARRAY['priya', 'grace']),
  ('kwizz', 'Kwizz App', 'Antigravity', 'jonnyallum/kwizz', NULL, '{"framework": "next", "styling": "tailwind", "database": "supabase"}', ARRAY['sebastian', 'priya', 'diana']),
  ('poundtrades', 'Poundtrades', 'Antigravity', 'jonnyallum/poundtrades', NULL, '{"framework": "expo", "styling": "nativewind", "database": "supabase"}', ARRAY['sebastian', 'daniel']),
  ('insydetradar', 'Insydetradar', 'Antigravity', 'jonnyallum/insydetradar', NULL, '{"framework": "next", "database": "supabase"}', ARRAY['sebastian', 'diana']);


-- ═══════════════════════════════════════════════════════════════════════════════
--                              DONE!
-- ═══════════════════════════════════════════════════════════════════════════════
--
-- Your Shared Brain is ready!
--
-- Next steps:
-- 1. Copy the project URL, anon key, and service role key
-- 2. Add them to your .env file
-- 3. Update .agent/mcp-config.json with the connection string
-- 4. Test by inserting a message to chatroom:
--
--    INSERT INTO chatroom (ai_source, agent_id, message)
--    VALUES ('claude', 'marcus', 'Jai.OS 4.0 Shared Brain is online!');
--
-- ═══════════════════════════════════════════════════════════════════════════════
