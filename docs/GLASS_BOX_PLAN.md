# Project Glass Box: Implementation Plan

Audit of the "AI Product Engine" pivot and development roadmap for `jonnyai.co.uk` V4.

## 1. Architectural Strategy

We are moving from a standard Next.js landing page to a **Hybrid Platform**.

- **Public Site**: Routing, SEO-hardened pages, and the "Marcus Briefing" conversational funnel.
- **The Glass Box**: A protected `/dashboard/[project_id]` route driven by Supabase Realtime.

## 2. Component Inventory (@Priya & @Sebastian)

- `GlassNavbar`: Ruthlessly simple (Links: Build, Traffic, Workforce, Work | CTAs: Brief/Login).
- `GlassTerminal`: A Framer Motion powered scrolling log component for real-time task updates.
- `WorkforceRoster`: State-aware avatars with pulsing rings based on `agent_status`.
- `MilestoneProgress`: Visual bar mapped to `projects.health_score`.
- `BriefingChat`: Full-screen conversational UI for Project Scoping.

## 3. Data Integration (@Diana & @Jonny AI)

- **Supabase Realtime**: Enable replication for `tasks`, `alerts`, `agents`, and `projects`.
- **RLS Enforcement**:
  ```sql
  -- Example Policy for Tasks
  CREATE POLICY "Clients can view their own tasks" ON tasks
  FOR SELECT USING (project_id IN (
    SELECT id FROM projects WHERE client_id = auth.uid()
  ));
  ```
- **Live Sync**: Orchestrate `useEffect` hooks to listen for global events and update dashboard stats immediately.

## 4. Homepage Hierarchy (Psychological Flow)

1. **Hero**: Animated background (noise + grid) + Speed-first copy.
2. **Comparison Mask**: "The Problem" column vs "The Solution" (AI Product Engine).
3. **The Glass Box Visual**: Interactive dashboard preview (Proof of Workforce).
4. **Agent Roster**: Trust building via the core 40-agent orchestra signatures.
5. **Pricing Grid**: 50% Early Adopter discount (3-pillar model).
6. **Timeline**: Onboarding workflow (Chat -> Quote -> Fund).

## 5. Deployment Configuration (@Owen)

- **Framework**: Next.js 15+ (App Router).
- **Hosting**: Vercel (preferred for seamless Auth/Socket stability).
- **SEO**: XML Dynamic Sitemap + strict semantic HTML5.

---

**Audit Result**: PLAN APPROVED.
Initiating Foundation Setup.
