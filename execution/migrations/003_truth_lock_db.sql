-- Migration: Create Truth-Lock DB for Verified Agency Facts
-- Authorized by: @Scholar (Intelligence Tier)

CREATE TABLE IF NOT EXISTS verified_facts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    category TEXT DEFAULT 'general', -- e.g., 'analytics', 'domain', 'api_key', 'branding'
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_by_ai TEXT NOT NULL, -- Handle of the agent who verified the fact
    UNIQUE(project_id, key)
);

-- Index for fast lookup by key-value pairs
CREATE INDEX idx_facts_project ON verified_facts(project_id);
CREATE INDEX idx_facts_key ON verified_facts(key);

COMMENT ON TABLE verified_facts IS 'Source of truth for project metadata to prevent agent hallucinations.';
