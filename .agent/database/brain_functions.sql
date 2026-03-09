-- ═══════════════════════════════════════════════════════════════════════════════
--                              Jai.OS 4.0
--                         Brain Functions & Automation
-- ═══════════════════════════════════════════════════════════════════════════════
--
-- Run this AFTER shared_brain_schema.sql
-- Adds: Task routing, alerts, health scoring, daily digest
--
-- ═══════════════════════════════════════════════════════════════════════════════


-- ─────────────────────────────────────────────────────────────────────────────────
-- TABLE: ALERTS
-- Proactive notifications for the system
-- ─────────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Alert details
  alert_type TEXT NOT NULL,               -- stale_project | failed_task | quality_drift | blocked_agent
  severity TEXT DEFAULT 'info',           -- info | warning | critical
  title TEXT NOT NULL,
  message TEXT NOT NULL,

  -- Context
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  agent_id TEXT REFERENCES agents(id) ON DELETE SET NULL,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,

  -- Status
  status TEXT DEFAULT 'active',           -- active | acknowledged | resolved
  acknowledged_by TEXT,
  acknowledged_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,

  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_type ON alerts(alert_type);
CREATE INDEX idx_alerts_project ON alerts(project_id);

-- Enable real-time for alerts
ALTER PUBLICATION supabase_realtime ADD TABLE alerts;


-- ─────────────────────────────────────────────────────────────────────────────────
-- FUNCTION: Route Task to Agents
-- Automatically assigns agents based on task keywords and capabilities
-- ─────────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION route_task(
  p_title TEXT,
  p_description TEXT DEFAULT NULL,
  p_project_id TEXT DEFAULT NULL
)
RETURNS TABLE(agent_id TEXT, human_name TEXT, match_score INTEGER, matched_capabilities TEXT[])
LANGUAGE plpgsql
AS $$
DECLARE
  search_text TEXT;
BEGIN
  -- Combine title and description for matching
  search_text := LOWER(COALESCE(p_title, '') || ' ' || COALESCE(p_description, ''));

  RETURN QUERY
  SELECT
    a.id,
    a.human_name,
    (
      -- Score based on capability matches
      COALESCE(
        (SELECT COUNT(*)::INTEGER
         FROM unnest(a.capabilities) AS cap
         WHERE search_text LIKE '%' || cap || '%'),
        0
      ) +
      -- Bonus for design-related keywords
      CASE WHEN search_text ~ '(design|ui|ux|visual|style|css|tailwind)' AND 'ui-design' = ANY(a.capabilities) THEN 3 ELSE 0 END +
      -- Bonus for mobile-related keywords
      CASE WHEN search_text ~ '(mobile|responsive|touch|pwa|ios|android)' AND 'mobile-optimization' = ANY(a.capabilities) THEN 3 ELSE 0 END +
      -- Bonus for SEO keywords
      CASE WHEN search_text ~ '(seo|meta|search|rank|google)' AND 'seo' = ANY(a.capabilities) THEN 3 ELSE 0 END +
      -- Bonus for security keywords
      CASE WHEN search_text ~ '(security|auth|password|encrypt|vulnerability)' AND 'security-audit' = ANY(a.capabilities) THEN 3 ELSE 0 END +
      -- Bonus for database keywords
      CASE WHEN search_text ~ '(database|sql|supabase|postgres|schema|migration)' AND 'postgresql' = ANY(a.capabilities) THEN 3 ELSE 0 END +
      -- Bonus for deploy keywords
      CASE WHEN search_text ~ '(deploy|ci|cd|github|action|build|release)' AND 'ci-cd' = ANY(a.capabilities) THEN 3 ELSE 0 END +
      -- Bonus for content keywords
      CASE WHEN search_text ~ '(content|copy|write|text|story|narrative)' AND 'copywriting' = ANY(a.capabilities) THEN 3 ELSE 0 END
    ) AS match_score,
    ARRAY(
      SELECT cap
      FROM unnest(a.capabilities) AS cap
      WHERE search_text LIKE '%' || cap || '%'
    ) AS matched_capabilities
  FROM agents a
  WHERE a.status != 'offline'
  ORDER BY match_score DESC
  LIMIT 5;
END;
$$;


-- ─────────────────────────────────────────────────────────────────────────────────
-- FUNCTION: Check Stale Projects
-- Finds projects that haven't been touched recently
-- ─────────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION check_stale_projects(days_threshold INTEGER DEFAULT 14)
RETURNS TABLE(
  project_id TEXT,
  project_name TEXT,
  days_since_activity INTEGER,
  last_commit TEXT,
  assigned_agents TEXT[]
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    EXTRACT(DAY FROM NOW() - COALESCE(p.updated_at, p.created_at))::INTEGER AS days_since,
    p.last_commit,
    p.assigned_agents
  FROM projects p
  WHERE
    p.status = 'active'
    AND COALESCE(p.updated_at, p.created_at) < NOW() - (days_threshold || ' days')::INTERVAL
  ORDER BY days_since DESC;
END;
$$;


-- ─────────────────────────────────────────────────────────────────────────────────
-- FUNCTION: Generate Project Health Score
-- Calculates health based on activity, task completion, quality gates
-- ─────────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION calculate_project_health(p_project_id TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  health INTEGER := 100;
  days_inactive INTEGER;
  failed_tasks INTEGER;
  pending_signoffs INTEGER;
BEGIN
  -- Check days since last activity (-5 per week inactive, max -30)
  SELECT EXTRACT(DAY FROM NOW() - COALESCE(updated_at, created_at))::INTEGER
  INTO days_inactive
  FROM projects WHERE id = p_project_id;

  health := health - LEAST((days_inactive / 7) * 5, 30);

  -- Check failed tasks in last 30 days (-10 each, max -30)
  SELECT COUNT(*)::INTEGER INTO failed_tasks
  FROM tasks
  WHERE project_id = p_project_id
    AND outcome = 'failed'
    AND created_at > NOW() - INTERVAL '30 days';

  health := health - LEAST(failed_tasks * 10, 30);

  -- Check pending sign-offs (-5 each, max -20)
  SELECT COUNT(*)::INTEGER INTO pending_signoffs
  FROM signoffs
  WHERE project_id = p_project_id
    AND status = 'pending';

  health := health - LEAST(pending_signoffs * 5, 20);

  -- Ensure health is between 0 and 100
  RETURN GREATEST(0, LEAST(100, health));
END;
$$;


-- ─────────────────────────────────────────────────────────────────────────────────
-- FUNCTION: Update All Project Health Scores
-- Batch update for all active projects
-- ─────────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_all_project_health()
RETURNS TABLE(project_id TEXT, old_health INTEGER, new_health INTEGER)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH health_updates AS (
    SELECT
      p.id,
      p.health_score AS old_score,
      calculate_project_health(p.id) AS new_score
    FROM projects p
    WHERE p.status = 'active'
  )
  UPDATE projects p
  SET
    health_score = hu.new_score,
    updated_at = NOW()
  FROM health_updates hu
  WHERE p.id = hu.id
  RETURNING p.id, hu.old_score, hu.new_score;
END;
$$;


-- ─────────────────────────────────────────────────────────────────────────────────
-- FUNCTION: Generate Daily Digest
-- Summary of activity across all projects
-- ─────────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION generate_daily_digest()
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'generated_at', NOW(),
    'period', 'last_24_hours',

    -- Task summary
    'tasks', (
      SELECT jsonb_build_object(
        'created', COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours'),
        'completed', COUNT(*) FILTER (WHERE status = 'completed' AND updated_at > NOW() - INTERVAL '24 hours'),
        'failed', COUNT(*) FILTER (WHERE outcome = 'failed' AND updated_at > NOW() - INTERVAL '24 hours')
      )
      FROM tasks
    ),

    -- Chatroom activity
    'chatroom', (
      SELECT jsonb_build_object(
        'messages', COUNT(*),
        'by_ai', jsonb_object_agg(COALESCE(ai_source, 'unknown'), cnt)
      )
      FROM (
        SELECT ai_source, COUNT(*) as cnt
        FROM chatroom
        WHERE created_at > NOW() - INTERVAL '24 hours'
        GROUP BY ai_source
      ) sub
    ),

    -- Active agents
    'agents', (
      SELECT jsonb_build_object(
        'active', COUNT(*) FILTER (WHERE status = 'working'),
        'idle', COUNT(*) FILTER (WHERE status = 'idle')
      )
      FROM agents
    ),

    -- Project health
    'projects', (
      SELECT jsonb_agg(jsonb_build_object(
        'id', id,
        'name', name,
        'health', health_score
      ) ORDER BY health_score ASC)
      FROM projects
      WHERE status = 'active'
    ),

    -- New learnings
    'learnings', (
      SELECT COUNT(*)
      FROM learnings
      WHERE created_at > NOW() - INTERVAL '24 hours'
    ),

    -- Active alerts
    'alerts', (
      SELECT jsonb_build_object(
        'critical', COUNT(*) FILTER (WHERE severity = 'critical' AND status = 'active'),
        'warning', COUNT(*) FILTER (WHERE severity = 'warning' AND status = 'active'),
        'info', COUNT(*) FILTER (WHERE severity = 'info' AND status = 'active')
      )
      FROM alerts
    )
  ) INTO result;

  RETURN result;
END;
$$;


-- ─────────────────────────────────────────────────────────────────────────────────
-- FUNCTION: Create Alert for Stale Projects
-- Automatically creates alerts for projects that need attention
-- ─────────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION create_stale_project_alerts()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  alert_count INTEGER := 0;
  stale RECORD;
BEGIN
  FOR stale IN SELECT * FROM check_stale_projects(14)
  LOOP
    -- Only create if no active alert exists for this project
    IF NOT EXISTS (
      SELECT 1 FROM alerts
      WHERE project_id = stale.project_id
        AND alert_type = 'stale_project'
        AND status = 'active'
    ) THEN
      INSERT INTO alerts (alert_type, severity, title, message, project_id, metadata)
      VALUES (
        'stale_project',
        CASE WHEN stale.days_since_activity > 30 THEN 'warning' ELSE 'info' END,
        'Project needs attention: ' || stale.project_name,
        'No activity for ' || stale.days_since_activity || ' days. Assigned agents: ' || array_to_string(stale.assigned_agents, ', '),
        stale.project_id,
        jsonb_build_object('days_inactive', stale.days_since_activity)
      );
      alert_count := alert_count + 1;
    END IF;
  END LOOP;

  RETURN alert_count;
END;
$$;


-- ─────────────────────────────────────────────────────────────────────────────────
-- TRIGGER: Auto-update project timestamp on task completion
-- ─────────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_project_on_task_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.project_id IS NOT NULL THEN
    UPDATE projects
    SET updated_at = NOW()
    WHERE id = NEW.project_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_task_updates_project ON tasks;
CREATE TRIGGER trg_task_updates_project
  AFTER INSERT OR UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_project_on_task_change();


-- ─────────────────────────────────────────────────────────────────────────────────
-- TRIGGER: Auto-update agent last_active on task assignment
-- ─────────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_agent_on_task_assignment()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.assigned_to IS NOT NULL THEN
    UPDATE agents
    SET
      last_active = NOW(),
      status = CASE WHEN NEW.status = 'in_progress' THEN 'working' ELSE status END,
      current_task_id = CASE WHEN NEW.status = 'in_progress' THEN NEW.id ELSE current_task_id END
    WHERE id = NEW.assigned_to;
  END IF;

  -- Clear current_task if task completed
  IF NEW.status IN ('completed', 'cancelled') AND OLD.assigned_to IS NOT NULL THEN
    UPDATE agents
    SET
      status = 'idle',
      current_task_id = NULL,
      task_count = task_count + 1,
      success_rate = CASE
        WHEN NEW.outcome = 'success' THEN (success_rate * task_count + 100) / (task_count + 1)
        WHEN NEW.outcome = 'failed' THEN (success_rate * task_count) / (task_count + 1)
        ELSE success_rate
      END
    WHERE id = OLD.assigned_to;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_task_updates_agent ON tasks;
CREATE TRIGGER trg_task_updates_agent
  AFTER INSERT OR UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_agent_on_task_assignment();


-- ═══════════════════════════════════════════════════════════════════════════════
-- COMPLETE
-- ═══════════════════════════════════════════════════════════════════════════════

-- Test the routing function
-- SELECT * FROM route_task('redesign the mobile homepage with better SEO');

-- Test stale project check
-- SELECT * FROM check_stale_projects(7);

-- Test daily digest
-- SELECT generate_daily_digest();
