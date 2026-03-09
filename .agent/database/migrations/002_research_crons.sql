-- ─────────────────────────────────────────────────────────────────────────────────
-- JAI.OS 4.0: RESEARCH CRON & WEBSITE FEED
-- Migration Script
-- ─────────────────────────────────────────────────────────────────────────────────

-- 1. Support for Automated Website Updates
ALTER TABLE agents 
ADD COLUMN IF NOT EXISTS philosophy TEXT,
ADD COLUMN IF NOT EXISTS personality TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'development',
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS avatar TEXT;

CREATE TABLE IF NOT EXISTS system_news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT DEFAULT 'update', -- news | update | hiring | milestone
    is_active BOOLEAN DEFAULT true,
    agent_id TEXT REFERENCES agents(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Support for Scheduled Research Agents
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS cron_expression TEXT, -- e.g. '0 9 * * *'
ADD COLUMN IF NOT EXISTS next_run_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS parent_task_id UUID; -- Links instance to master schedule

CREATE INDEX IF NOT EXISTS idx_tasks_next_run ON tasks(next_run_at) WHERE is_recurring = true;

-- 3. Utility Function to update next run (run after completion)
CREATE OR REPLACE FUNCTION set_next_task_run()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_recurring = true AND NEW.status = 'completed' AND OLD.status != 'completed' THEN
        -- Basic logic: update next_run_at by 24 hours if no complex cron logic found
        -- In a real app, we'd use a postgres cron extension or parse the cron string
        UPDATE tasks SET next_run_at = NOW() + INTERVAL '1 day' WHERE id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_task_recurring
AFTER UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION set_next_task_run();
