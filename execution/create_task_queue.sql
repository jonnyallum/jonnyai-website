-- ================================================
-- MIGRATION: task_queue for Antigravity Pi nodes
-- Run in Supabase SQL Editor → New Query → Run
-- ================================================

CREATE TABLE IF NOT EXISTS task_queue (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Routing
  node_tier       TEXT NOT NULL DEFAULT 'research',
  node_id         TEXT,

  -- Task identity
  task_type       TEXT NOT NULL,
  task_payload    JSONB NOT NULL DEFAULT '{}',

  -- Lifecycle
  status          TEXT NOT NULL DEFAULT 'queued',
  priority        INT NOT NULL DEFAULT 5,

  -- Timestamps
  queued_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  picked_up_at    TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,

  -- Worker
  worker_node_id  TEXT,

  -- Results
  result          JSONB,
  error_message   TEXT,
  retry_count     INT NOT NULL DEFAULT 0,
  max_retries     INT NOT NULL DEFAULT 3,

  -- Tracing
  requested_by    TEXT,
  session_id      UUID
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_task_queue_tier_status
  ON task_queue (node_tier, status, priority ASC, queued_at ASC);

CREATE INDEX IF NOT EXISTS idx_task_queue_status
  ON task_queue (status);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_task_queue_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS task_queue_updated_at ON task_queue;
CREATE TRIGGER task_queue_updated_at
  BEFORE UPDATE ON task_queue
  FOR EACH ROW EXECUTE FUNCTION update_task_queue_updated_at();

-- RLS: service role only (Pi uses service role key)
ALTER TABLE task_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all" ON task_queue
  FOR ALL USING (auth.role() = 'service_role');

-- node_status table for Pi heartbeats
CREATE TABLE IF NOT EXISTS node_status (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id     TEXT NOT NULL UNIQUE,
  node_tier   TEXT NOT NULL DEFAULT 'research',
  last_seen   TIMESTAMPTZ NOT NULL DEFAULT now(),
  cpu_temp_c  FLOAT,
  cpu_percent FLOAT,
  mem_percent FLOAT,
  disk_percent FLOAT,
  status      TEXT DEFAULT 'healthy',
  metadata    JSONB DEFAULT '{}'
);

SELECT 'task_queue and node_status tables created successfully' AS result;
