-- ============================================================
-- Migration 006: task_queue + node-aware agent routing
-- Authors: @Sebastian + @Diana
-- Date: 2026-02-27
-- ============================================================

-- ── ENUMS ────────────────────────────────────────────────────────────────────

CREATE TYPE task_status AS ENUM (
    'pending',
    'picked_up',
    'complete',
    'failed'
);

CREATE TYPE node_tier_enum AS ENUM (
    'research',
    'automation',
    'llm-a',
    'llm-b',
    'betting'
);

-- ── TASK QUEUE TABLE ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS task_queue (
    id              UUID            DEFAULT gen_random_uuid() PRIMARY KEY,
    agent_handle    TEXT            NOT NULL,
    node_tier       node_tier_enum  NOT NULL,
    node_id         TEXT,                                   -- NULL = any node in tier
    status          task_status     NOT NULL DEFAULT 'pending',
    retry_count     SMALLINT        NOT NULL DEFAULT 0,
    error_message   TEXT,
    task_type       TEXT            NOT NULL,
    payload         JSONB           NOT NULL DEFAULT '{}',
    result          JSONB           DEFAULT NULL,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    picked_up_at    TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    CONSTRAINT valid_agent_handle CHECK (char_length(agent_handle) > 0),
    CONSTRAINT valid_task_type    CHECK (char_length(task_type) > 0),
    CONSTRAINT retry_limit        CHECK (retry_count <= 10)
);

COMMENT ON TABLE task_queue IS
    'Node-aware distributed task queue for the Antigravity Pi cluster. '
    'Nodes poll by node_tier. State is authoritative in Supabase — nodes are stateless.';

COMMENT ON COLUMN task_queue.node_id IS
    'Optional: pin task to a specific node. NULL means any healthy node in the tier may pick it up.';

-- ── INDEXES ──────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_task_queue_polling
    ON task_queue (node_tier, status, created_at ASC)
    WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_task_queue_node_id
    ON task_queue (node_id)
    WHERE node_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_task_queue_agent
    ON task_queue (agent_handle, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_task_queue_stale
    ON task_queue (picked_up_at, status)
    WHERE status = 'picked_up';

CREATE INDEX IF NOT EXISTS idx_task_queue_type
    ON task_queue (task_type, created_at DESC);

-- ── ROW LEVEL SECURITY ───────────────────────────────────────────────────────

ALTER TABLE task_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "task_queue_service_all"
    ON task_queue FOR ALL TO service_role
    USING (true) WITH CHECK (true);

CREATE POLICY "task_queue_node_select"
    ON task_queue FOR SELECT TO anon
    USING (
        node_tier = current_setting('app.current_node_tier', true)::node_tier_enum
        AND status = 'pending'
    );

CREATE POLICY "task_queue_node_update"
    ON task_queue FOR UPDATE TO anon
    USING (node_tier = current_setting('app.current_node_tier', true)::node_tier_enum)
    WITH CHECK (node_tier = current_setting('app.current_node_tier', true)::node_tier_enum);

CREATE POLICY "task_queue_read_authenticated"
    ON task_queue FOR SELECT TO authenticated USING (true);

-- ── STALE TASK VIEWS ─────────────────────────────────────────────────────────

CREATE OR REPLACE VIEW stale_tasks AS
SELECT
    id, agent_handle, node_tier, node_id, task_type, retry_count,
    picked_up_at, NOW() - picked_up_at AS stale_duration, payload
FROM task_queue
WHERE status = 'picked_up' AND picked_up_at < NOW() - INTERVAL '5 minutes';

CREATE OR REPLACE VIEW dead_tasks AS
SELECT id, agent_handle, node_tier, task_type, retry_count, error_message, created_at, completed_at
FROM task_queue
WHERE (status = 'picked_up' AND retry_count >= 10) OR status = 'failed';

-- ── FAILOVER FUNCTION ─────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION reset_stale_tasks()
RETURNS TABLE (
    reset_id      UUID,
    agent_handle  TEXT,
    node_tier     node_tier_enum,
    was_node_id   TEXT,
    retry_count   SMALLINT
)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    RETURN QUERY
    UPDATE task_queue
    SET
        status        = 'pending',
        picked_up_at  = NULL,
        node_id       = NULL,
        retry_count   = retry_count + 1,
        error_message = format(
            'Failover reset at %s — was held by %s (attempt %s)',
            NOW()::TEXT, COALESCE(node_id, 'unknown'), (retry_count + 1)::TEXT
        )
    WHERE status = 'picked_up'
      AND picked_up_at < NOW() - INTERVAL '5 minutes'
      AND retry_count < 10
    RETURNING id, agent_handle, node_tier, node_id, retry_count;
END; $$;

-- ── AGENTS TABLE UPDATE ───────────────────────────────────────────────────────

ALTER TABLE agents
    ADD COLUMN IF NOT EXISTS node_tier  node_tier_enum,
    ADD COLUMN IF NOT EXISTS node_id    TEXT;

CREATE INDEX IF NOT EXISTS idx_agents_node_tier
    ON agents (node_tier) WHERE node_tier IS NOT NULL;

-- Backfill
UPDATE agents SET node_tier = 'research'   WHERE id IN ('sophie','scholar','hugo','patrick','intelhub','parser');
UPDATE agents SET node_tier = 'automation' WHERE id IN ('alex','nathan','syncmaster','executor','owen','chronos','qualityguard','validator','watcher','hannah','mason','julian','quartermaster','successbot','finops');
UPDATE agents SET node_tier = 'llm-a'      WHERE id IN ('marcus','sebastian','diana','delegator','steve','derek','sam','vigil','rowan','milo','adrian','victor','luna','riskguard','arthur');
UPDATE agents SET node_tier = 'llm-b'      WHERE id IN ('priya','felix','grace','maya','dreamer','neo','elena','vivienne','blaise','contentforge','boyce','rocket','quinn','jasper','nina','theo','dashboard','coursewright','genesis','winston','trotter');
UPDATE agents SET node_tier = 'betting'    WHERE id IN ('gareth','monty','redeye','pietro','terry','harry','daniel','sterling');
