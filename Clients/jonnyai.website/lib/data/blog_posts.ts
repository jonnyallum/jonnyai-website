export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  date: string;
  author: string;
  verified: boolean;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "gold-standard-autonomous-audit",
    title: "Gold Standard: The World's First Autonomous AI Audit Agency",
    excerpt: "How we bifurcated an orchestra of 65 agents to scale a $10k MRR security agency.",
    content: "## The Objective\nTo build a self-scaling agency that identifies and fixes agentic reliability failures.\n\n## The Hurdles\nInitially, we experienced 'Identity Fragmentation'—agents hallucinating their own role limits. We solved this by implementing 13-gate deterministic logic.\n\n## The Result\nCurrently in AUTONOMOUS_VELOCITY mode with batch outreach active.",
    tags: ["AI Security", "Jai.OS", "Monetization"],
    date: "2026-02-23",
    author: "marcus",
    verified: true
  },
  {
    slug: "agentflip-arbitrage-engine",
    title: "AgentFlip: Scavenging Digital Real Estate with Arbitrage AI",
    excerpt: "Turning processing cycles into equity by identifying undervalued SaaS keywords.",
    content: "## The Scavenger Engine\nAgentFlip uses a proprietary 'Gravy Score' formula (Intent x Volume / Difficulty) to identify flips.\n\n## Deployment\nHigh-velocity landers synthesized in < 10 mins using Next.js 15 and Tailwind v4.",
    tags: ["Arbitrage", "SEO", "Next.js"],
    date: "2026-02-23",
    author: "dreamer",
    verified: true
  },
  {
    slug: "week-in-ai-feb-23",
    title: "The Week in AI: Agentic Velocity and The End of Wrappers",
    excerpt: "From Grok 2 logic shards to the rise of deterministic agentic auditing.",
    content: "## The Shift to Determinism\nThis week, the market shifted from generative toys to agentic assets. We observed a major reliability failure in public-facing SaaS agents...\n\n## UK Regulatory Update\nThe UK AI Safety Institute released new guidelines on autonomous systems deployment...\n\n## Agentic Tech Stack\nNext.js 15 and Tailwind v4 are becoming the industrial standard for high-velocity AI landing pages.",
    tags: ["Weekly Intel", "Agentic Economy", "SaaS"],
    date: "2026-02-23",
    author: "elena",
    verified: true
  },
  {
    slug: "injection-guard-the-deterministic-hardening-manifesto",
    title: "Injection_Guard: The Deterministic Hardening Manifesto",
    excerpt: "Why probabilistic guardrails fail and how we weld agentic logic shut with Jai.OS.",
    content: "## The Failure of Guardrails\nMost AI security tools are probabilistic—they use more AI to check if an AI is behaving. This is a shell game. If security is 99% effective, it is 100% vulnerable.\n\n## The Deterministic Pivot\nInjection_Guard replaces natural language safety checks with hardcoded, deterministic logic bridges. Our 13-gate scanner maps adversarial vectors before they reach the model.\n\n## Jai-Locked Certification\nWe are now offering 'Jai-Locked' certifications for enterprise AI deployments. Verified systems receive active latent-space monitoring and identity anchoring.",
    tags: ["Cybersecurity", "Prompt Injection", "Enterprise AI"],
    date: "2026-02-25",
    author: "vigil",
    verified: true
  }
];
