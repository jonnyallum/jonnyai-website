export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: 'System Update' | 'Product' | 'Case Study' | 'Insight';
  readTime: number; // minutes
  featured?: boolean;
  tags: string[];
}

export interface TimelineEvent {
  date: string;
  phase: string;
  title: string;
  description: string;
  metric?: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'why-65-specialist-agents-not-one-ai',
    title: 'Why We Built 65 Specialist Agents Instead of One AI',
    excerpt:
      'Every AI agency says they use AI. Most mean they copy-paste from ChatGPT. Here\'s why we took a completely different path — and why it matters for your project.',
    date: '2026-02-23',
    category: 'Insight',
    readTime: 5,
    featured: true,
    tags: ['AI development', 'specialist agents', 'AI agency UK', 'Jai.OS'],
    content: `
The question we get asked most often is simple: why 65 agents?

When we started building the Antigravity Orchestra, the obvious path was to pick one AI model, write a really good system prompt, and call it an AI agency. That's what everyone else was doing. Fast, cheap, and entirely mediocre.

The problem is that "one AI does everything" is like hiring one person to simultaneously be your architect, designer, lawyer, accountant, and CMO. They'll do every job at a C-minus level. You don't want that on a product that has your name on it.

**The Orchestra Architecture**

Instead, we built a swarm. 65 specialists, each with a precise domain, a defined role, and — critically — a documented set of SOPs they never deviate from. @Sebastian owns the architecture. @Priya owns the pixels. @Sam owns security. @Diana owns the database schema. They don't step on each other's work, and they don't guess in each other's domains.

Every agent has what we call a SKILL.md — a formal specification of their capabilities, restrictions, and operating procedures. When @Sebastian writes an API route, he knows exactly which patterns @Sam will reject in the security audit. When @Priya ships a component, she knows the performance budget @Milo will measure it against.

This is what we mean by "Collective Velocity." The specialists move faster in parallel than any generalist could move in sequence.

**What This Means for Your Project**

When you brief Marcus with a project, he doesn't sit down and start guessing. He decomposes your brief into phases and routes each phase to the right specialist. The result is a build that actually holds up — production-grade, not prototype-grade.

The 48-hour delivery timeline isn't a marketing claim. It's the natural output of 65 specialists running in parallel, each doing the one thing they're best at.

If you've ever hired an agency and watched your project get handed between three different "developers" who each undid the last person's work, you understand why we built it this way.

The Orchestra exists because great software deserves specialists, not generalists. Your project is one of them.
    `.trim(),
  },
  {
    slug: 'the-glass-box-why-we-show-you-everything',
    title: 'The Glass Box: Why We Show You Everything',
    excerpt:
      'Black box development is the leading cause of missed deadlines, scope creep, and client betrayal. We designed the Glass Box to end it permanently.',
    date: '2026-02-21',
    category: 'Product',
    readTime: 4,
    tags: ['transparent development', 'Glass Box', 'AI product engine', 'client dashboard'],
    content: `
You've been there. Three weeks into a project, you ask your developer "how's it going?" and they say "good, nearly there." Two weeks later, same answer. The invoice arrives before the product does.

We built the Glass Box because that experience is not acceptable, and it's not necessary.

**Real-Time. Every Commit.**

The Glass Box is your live window into your project while it's being built. Every agent commit, every milestone completed, every decision made — logged in real-time to your personal dashboard. You're not waiting for a status update. You're watching the build happen.

When @Sebastian commits `supabase-auth.ts`, you see it in your Glass Box within seconds. When @Sam flags a security concern in the RLS policy, you see that too. When @Vigil signs off the truth-lock before launch, you see the gate clear. The whole pipeline is visible to you, always.

**Milestones, Not Invoices**

We don't invoice you for time. We invoice for milestones — clearly defined, pre-agreed deliverables that you approve before we move to the next phase. If a milestone isn't done, we don't charge for it. If we miss our timeline, you have leverage. That's by design.

This is what "fully transparent" means in practice. Not a weekly email. Not a Figma link. A live feed of your product being built, with a paper trail of every decision made along the way.

**Why Agencies Hide**

Traditional agencies work in black boxes because opacity protects them. If you can't see what's happening, you can't challenge the estimate, the approach, or the quality. When your project eventually arrives half-built, they're already onto the next client.

We don't have that problem. We want you watching. The Glass Box is our quality gate as much as yours — our agents know their work is visible, and that visibility is what keeps standards high.

Your next project shouldn't be a leap of faith. Book a scope session with Marcus and see the Glass Box working before you commit to a single pound.
    `.trim(),
  },
  {
    slug: 'shared-brain-architecture-live-ai-coordination',
    title: 'The Shared Brain: How 65 Agents Stay in Sync',
    excerpt:
      'Coordinating 65 AI specialists without a central nervous system would be chaos. Here\'s how the Antigravity Shared Brain keeps every agent informed and every project on track.',
    date: '2026-02-22',
    category: 'Insight',
    readTime: 5,
    tags: ['AI coordination', 'Supabase', 'AI architecture', 'agent orchestration UK'],
    content: `
The hardest problem in multi-agent AI systems isn't building the agents. It's keeping them synchronised.

If 65 specialists are working in parallel, information needs to flow between them without creating bottlenecks. Agent A needs to know what Agent B decided. Agent C needs to know Agent D's current workload. Without a coordination layer, you get duplicate work, conflicting outputs, and missed handoffs.

We solved this with what we call the Shared Brain.

**One Source of Truth**

The Shared Brain is a live Supabase database that every agent in the Orchestra reads from and writes to. Every agent's capabilities, current status, and recent learnings are stored there. Before any specialist starts a task, they query the Shared Brain to understand the current state of the project and what their collaborators have already done.

The result: agents don't repeat work that's already been done. @Diana knows what schema decisions @Sebastian made before she writes the migrations. @Vigil knows what components @Priya built before she runs her truth-lock scan.

**Learnings That Propagate**

When an agent discovers something important — a new pattern that works, a failure mode to avoid, a client-specific preference — that learning is written to the Shared Brain and propagated to the agents who need it. The next time a similar task is run, the Orchestra is smarter than it was before.

This is how the system improves over time. Not by updating a single model. By accumulating institutional knowledge across every agent, on every project, every day.

**What This Means in Practice**

When you start a new project with us, you're not getting a blank slate. You're getting an Orchestra that has already learned from every project we've run before. The performance improvements, the security patterns, the SEO strategies that worked — all of that is in the Shared Brain, ready to be applied to your build from day one.

That's the compounding advantage of the collective architecture. Every client project makes the next one faster and better.
    `.trim(),
  },
  {
    slug: 'jai-os-4-0-the-operating-system-for-ai-agencies',
    title: 'Jai.OS 4.0: The Operating System Beneath Your Build',
    excerpt:
      'We don\'t just use AI tools. We built an operating system for AI development. Here\'s what Jai.OS 4.0 actually is, and why it changes the quality ceiling for every project we touch.',
    date: '2026-02-22',
    category: 'System Update',
    readTime: 4,
    tags: ['Jai.OS', 'AI operating system', 'AI development framework', 'AI agency infrastructure'],
    content: `
Most AI agencies have a toolchain. We have an operating system.

Jai.OS 4.0 is the framework that governs how every agent in the Antigravity Orchestra behaves — how they communicate, how they hand off work, how they verify quality, and how they respond when something goes wrong. It's the difference between 65 agents doing 65 things and 65 agents behaving as one coherent system.

**Four Layers**

Jai.OS 4.0 operates on four layers:

The **Talent Layer** is where the agents live — each with a formal SKILL.md specification defining exactly what they can and cannot do. There are no generalists here. Every specialist has a precise scope and documented SOPs that govern their behaviour on every task.

The **Boardroom Layer** is the coordination infrastructure — the protocols, chatroom, and decision logs that keep the Orchestra aligned. When a critical decision is made, it's documented. When a milestone is hit, it's broadcast to every relevant agent. Nothing is lost between sessions.

The **Engine Layer** is the automation backbone — the Python scripts and pipelines that handle validation, synchronisation, and deployment without human intervention. When we say "48-hour delivery," this layer is why we can mean it.

The **Memory Layer** is the Shared Brain — the live Supabase database that gives the Orchestra persistent memory across every project and session.

**Why It Matters for Your Build**

Jai.OS 4.0 means your project isn't dependent on a single developer's memory or habits. The quality gates are baked into the operating system. The security checks happen automatically. The truth-lock verification runs before every deploy. The performance audit runs before every launch.

You're not hiring a good developer and hoping they follow best practices. You're deploying a system where best practices are enforced at the infrastructure level.

That's the quality ceiling that Jai.OS 4.0 raises. Every project we take on runs on it.
    `.trim(),
  },
  {
    slug: 'from-concept-to-65-specialist-orchestra',
    title: 'From Concept to 65 Specialists: The Antigravity Story',
    excerpt:
      'In early 2026 we decided to stop building AI tools and start building an AI workforce. This is what happened in the weeks that followed.',
    date: '2026-02-23',
    category: 'System Update',
    readTime: 6,
    tags: ['AI agency origin', 'Antigravity', 'AI workforce', 'build in public'],
    content: `
The idea was simple. Hire the entire team you'd need for any digital project — designer, developer, security engineer, SEO specialist, copywriter, data analyst — and replace each role with a world-class AI specialist. Not a tool. A specialist. One that knows its domain, knows its limits, and knows who to hand the work to next.

The execution was anything but simple.

**February 2026: The Foundation**

We started with the architecture question: how do you build a system of AI agents that collaborate reliably? The answer wasn't to connect them via chat. It was to give them a shared operating protocol, a live memory layer, and formal handoff procedures. The first version of Jai.OS was born from that problem.

The earliest agents were scrappy. They had names, roles, and rough instructions — but they didn't have the precision we needed. A security agent that produces vague recommendations isn't useful. A copywriter agent that writes generically isn't useful. We spent the first two weeks writing the specifications that would eventually become SKILL.md: the formal contract for every agent in the Orchestra.

**The Upgrade Cycle**

By mid-February, we had the framework. What followed was a systematic upgrade of every agent from rough specification to gold standard: precise SOPs, domain-specific operating procedures, collaboration patterns, and the restrictions that stop them from straying outside their expertise.

The quality bar was uncompromising. If a personality felt generic, it was rewritten. If a SOP lacked a trigger condition, it was fixed. If an agent's capabilities overlapped with a specialist who did it better, the boundaries were redrawn.

**65 and Growing**

On February 23rd, 2026, the Orchestra hit 65 validated specialists, all running on Jai.OS 4.0, all connected to the Shared Brain, all ready to be deployed on client projects.

That's not a milestone we're celebrating internally. It's the baseline. The system is designed to improve continuously — new learnings after every project, new specialists as new domains are required, new SOPs as new failure modes are discovered.

If you're reading this, you're getting the Orchestra at its current best. The next project will be built by one that's better still.
    `.trim(),
  },
];

export const timeline: TimelineEvent[] = [
  {
    date: '2026-02-01',
    phase: 'Genesis',
    title: 'AgOS 2.0 Launches',
    description:
      'The first iteration of the Antigravity agency platform goes live. Initial focus: small business AI integration, lead intake, and core brand identity.',
    metric: 'v1.0',
  },
  {
    date: '2026-02-02',
    phase: 'Genesis',
    title: 'Brand Identity & Multi-Agent Concept',
    description:
      'God-tier hero v2 with Framer Motion animations. First experiments with multi-agent coordination patterns. The node network aesthetic reflects the architecture.',
    metric: 'Design System v1',
  },
  {
    date: '2026-02-17',
    phase: 'Build Phase',
    title: 'First Client Tools Shipped',
    description:
      'Client-specific tooling built and delivered. Construct FM estimate generator, invoice generation, Excel export — full toolchain in 48 hours. Proof of concept confirmed.',
    metric: '48h delivery',
  },
  {
    date: '2026-02-19',
    phase: 'Jai.OS Active',
    title: 'Jai.OS 4.0 Foundation',
    description:
      'The operating system layer is formalised. Standardised Orchestra architecture, governing directives, and Shared Brain sync established. This is the inflection point.',
    metric: 'Jai.OS 4.0',
  },
  {
    date: '2026-02-21',
    phase: 'Jai.OS Active',
    title: 'AI Product Engine Goes Live',
    description:
      'jonnyai.website v4 launches with the Glass Box concept. Real-time project dashboards, Stripe payments, magic link auth. The commercial product is live.',
    metric: 'Glass Box v1',
  },
  {
    date: '2026-02-22',
    phase: 'Jai.OS Active',
    title: '57-Agent Orchestra — Full Compliance',
    description:
      '57 specialists hit Jai.OS 4.0 compliance simultaneously. Governing directives injected, SKILL.md gold standard achieved, Shared Brain wired to Claude Code via jonnyai-mcp.',
    metric: '57/57 validated',
  },
  {
    date: '2026-02-23',
    phase: 'Jai.OS Active',
    title: '65-Agent Orchestra — Production Ready',
    description:
      '65 specialists fully deployed: 135 catalogued skills, automated training day protocol, full sync pipeline, @delegator routing layer, @validator artifact gate. The Orchestra is complete.',
    metric: '65 specialists',
  },
];

export const newsItems = [
  'NEW: 65 specialist agents — Jai.OS 4.0 fully operational',
  '@delegator online — complex missions now auto-routed across the Orchestra',
  '135 skills catalogued — every domain covered, every SOP documented',
  'Training Day protocol active — agents learning from every project',
  'Shared Brain: ONLINE — 65 agents queryable in real-time',
  'Glass Box dashboard live — watch your build happen in real time',
  '48-hour delivery confirmed — scope to shipped, no exceptions',
];
