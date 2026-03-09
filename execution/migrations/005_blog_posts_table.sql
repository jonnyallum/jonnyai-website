-- ============================================================
-- Migration 005: blog_posts table
-- Purpose: CMS layer for all jonnyai.website blog content
--          Agents write here; website reads here; static file
--          is the fallback/seed source only.
-- Run: paste into Supabase SQL editor or use migration runner
-- ============================================================

CREATE TABLE IF NOT EXISTS blog_posts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- ── Content ────────────────────────────────────────────────
  slug            text UNIQUE NOT NULL,          -- URL-safe identifier, e.g. 'week-in-ai-23-feb-2026'
  title           text NOT NULL,
  excerpt         text NOT NULL,                  -- 1-2 sentence summary shown on /blog index
  content         text NOT NULL,                  -- Full article body. Markdown: **bold**, \n\n paragraphs
  date            date NOT NULL,                  -- Publication date (or backdate for historical posts)
  category        text NOT NULL CHECK (category IN (
                    'System Update',
                    'Product',
                    'Case Study',
                    'Insight',
                    'Weekly Intel'
                  )),
  read_time       integer NOT NULL DEFAULT 5,     -- Minutes to read
  featured        boolean NOT NULL DEFAULT false, -- Pin to featured slot on /blog
  tags            text[] NOT NULL DEFAULT '{}',   -- SEO tags array

  -- ── Publishing ─────────────────────────────────────────────
  status          text NOT NULL DEFAULT 'draft' CHECK (status IN (
                    'draft',      -- In progress, not visible on site
                    'published',  -- Live on jonnyai.website/blog
                    'archived'    -- Hidden from index, still accessible via slug
                  )),
  published_at    timestamptz,                    -- Null until first publish

  -- ── Project linkage ────────────────────────────────────────
  project_ref     text,                           -- Matches client project slug, e.g. 'construct-fm', 'gold-standard'
  client_name     text,                           -- Display name for the client/project

  -- ── Agent authorship ───────────────────────────────────────
  author_agent    text NOT NULL DEFAULT '@elena', -- Which agent wrote/owns this post
  reviewed_by     text[],                         -- Agent handles that have signed off, e.g. ['{@vigil}','{@rowan}']

  -- ── SEO overrides (optional) ───────────────────────────────
  seo_title       text,                           -- Overrides title for <head> if set
  seo_description text,                           -- Overrides excerpt for meta description if set

  -- ── Timestamps ─────────────────────────────────────────────
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ── Indexes ────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS blog_posts_status_date_idx
  ON blog_posts (status, date DESC);

CREATE INDEX IF NOT EXISTS blog_posts_category_idx
  ON blog_posts (category);

CREATE INDEX IF NOT EXISTS blog_posts_project_ref_idx
  ON blog_posts (project_ref)
  WHERE project_ref IS NOT NULL;

CREATE INDEX IF NOT EXISTS blog_posts_slug_idx
  ON blog_posts (slug);

-- ── Auto-update updated_at ─────────────────────────────────────
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  -- Auto-set published_at on first publish
  IF NEW.status = 'published' AND OLD.status != 'published' THEN
    NEW.published_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS blog_posts_updated_at ON blog_posts;
CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_blog_posts_updated_at();

-- ── RLS: Public read for published posts only ──────────────────
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published posts"
  ON blog_posts FOR SELECT
  USING (status = 'published');

-- Service role (agents writing via seed/API) bypasses RLS automatically.

-- ── Grant anon read ────────────────────────────────────────────
GRANT SELECT ON blog_posts TO anon;
GRANT SELECT ON blog_posts TO authenticated;

-- ============================================================
-- Companion: projects_registry table
-- Tracks all client projects so every project has a
-- documented home and can be linked to blog case studies.
-- ============================================================

CREATE TABLE IF NOT EXISTS projects_registry (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- ── Identity ───────────────────────────────────────────────
  project_ref     text UNIQUE NOT NULL,           -- Slug, e.g. 'construct-fm', 'gold-standard'
  client_name     text NOT NULL,
  project_name    text NOT NULL,
  description     text NOT NULL,

  -- ── Classification ─────────────────────────────────────────
  project_type    text NOT NULL CHECK (project_type IN (
                    'client_site',        -- Standard client web/app build
                    'client_product',     -- Product built for a client
                    'internal_product',   -- Antigravity-owned product (Gold Standard, AgentFlip)
                    'internal_tooling',   -- Internal tools and infrastructure
                    'concept'             -- In-progress concept/prototype
                  )),
  industry        text,                           -- e.g. 'construction', 'finance', 'hospitality'
  tech_stack      text[],                         -- e.g. ['Next.js', 'Supabase', 'Stripe']

  -- ── Timeline ───────────────────────────────────────────────
  started_at      date,
  delivered_at    date,
  is_live         boolean DEFAULT false,
  live_url        text,

  -- ── Blog linkage ───────────────────────────────────────────
  has_case_study  boolean NOT NULL DEFAULT false,
  case_study_slug text REFERENCES blog_posts(slug) ON DELETE SET NULL,
  case_study_status text DEFAULT 'none' CHECK (case_study_status IN (
                    'none',         -- No case study written
                    'draft',        -- Being written
                    'ready',        -- Written, pending quality gates
                    'published'     -- Live on /blog
                  )),

  -- ── Notes ──────────────────────────────────────────────────
  notes           text,                           -- Any internal notes, lessons, context
  is_public       boolean NOT NULL DEFAULT true,  -- Whether this project can be mentioned publicly

  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS projects_registry_type_idx
  ON projects_registry (project_type);

CREATE INDEX IF NOT EXISTS projects_registry_case_study_status_idx
  ON projects_registry (case_study_status);

ALTER TABLE projects_registry ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read public projects"
  ON projects_registry FOR SELECT
  USING (is_public = true);

GRANT SELECT ON projects_registry TO anon;
GRANT SELECT ON projects_registry TO authenticated;

-- ============================================================
-- Done. Run seed_blog_posts.py to populate initial data.
-- ============================================================
