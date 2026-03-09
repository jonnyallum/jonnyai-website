-- Migration 004: events table
-- Tracks all significant project events: incidents, fixes, wins, training days, deploys.
-- Used by log_event.py and training_day.py.

CREATE TABLE IF NOT EXISTS events (
    id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type      TEXT        NOT NULL CHECK (event_type IN (
                                    'incident', 'fix', 'win', 'deploy',
                                    'training', 'milestone', 'learning', 'note'
                                )),
    project         TEXT,                          -- client/project name (NULL = system-wide)
    title           TEXT        NOT NULL,
    description     TEXT,
    agent           TEXT,                          -- @handle of the agent involved
    severity        TEXT        CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    status          TEXT        NOT NULL DEFAULT 'open'
                                CHECK (status IN ('open', 'resolved', 'closed')),
    resolves_id     UUID        REFERENCES events(id) ON DELETE SET NULL,  -- links fix → incident
    duration_mins   INTEGER,                       -- time to resolve (for incidents/fixes)
    tags            TEXT[]      DEFAULT '{}',
    meta            JSONB       DEFAULT '{}',      -- arbitrary structured data
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    resolved_at     TIMESTAMPTZ
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_events_type       ON events (event_type);
CREATE INDEX IF NOT EXISTS idx_events_project    ON events (project);
CREATE INDEX IF NOT EXISTS idx_events_agent      ON events (agent);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_status     ON events (status) WHERE status = 'open';

-- RLS: all authenticated users can read; only service role can insert/update
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "events_read_all"   ON events FOR SELECT USING (true);
CREATE POLICY "events_insert_svc" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "events_update_svc" ON events FOR UPDATE USING (true);

COMMENT ON TABLE events IS
    'Antigravity event log — incidents, fixes, wins, deploys, training days. '
    'All significant moments in project and system history are recorded here.';
