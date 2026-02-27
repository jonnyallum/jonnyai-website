import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Story | Antigravity Orchestra — JonnyAi',
  description: 'From solo developer to 67-agent AI orchestra. The full story of how JonnyAi and Antigravity were built, where we are now, and where we\'re going.',
};

export default function StoryPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-16">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-citrus">The Antigravity Story</span>
          <h1 className="font-outfit font-extrabold text-5xl md:text-6xl mt-4 leading-tight">
            Where We Were.<br />
            Where We Are.<br />
            <span className="text-citrus">Where We&apos;re Going.</span>
          </h1>
          <div className="flex items-center gap-3 mt-8">
            <div className="w-2 h-2 rounded-full bg-signal animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30">Written by @Rowan — Content Depth Specialist</span>
          </div>
        </div>

        {/* Body */}
        <div className="prose-story space-y-10 text-white/70 leading-relaxed">

          <section>
            <h2 className="font-outfit font-bold text-white text-2xl mb-4">One Pair of Hands</h2>
            <p>Every freelance developer in the UK knows the ceiling.</p>
            <p>You&apos;re good at the work. Clients come. You deliver. They&apos;re happy. More clients come. And then one day you realise the problem isn&apos;t your ability — it&apos;s arithmetic. There are twenty-four hours in a day, and you only have two hands. You can charge more, work faster, specialise harder. But eventually, every solo operator hits the same wall. Time. That invisible tax on talent.</p>
            <p>That was Jonny Allum&apos;s world before 2024. A freelance developer building client websites and apps. Decent work. Real clients. Honest craft. But limited by the fundamental constraint of the model: one brain, one person, one project at a time.</p>
            <p>He wasn&apos;t failing. He was just bottlenecked by the nature of the game.</p>
            <p>And then the game changed entirely.</p>
          </section>

          <section>
            <h2 className="font-outfit font-bold text-white text-2xl mb-4">The Experiment That Didn&apos;t Stop</h2>
            <p>When the LLM explosion hit in early 2024, most people did one of two things. They ignored it, or they dabbled — used ChatGPT to write some emails, maybe generated a few images, posted about it on LinkedIn.</p>
            <p>Jonny did neither.</p>
            <p>He went all-in. Not as a user. As a builder.</p>
            <p>He didn&apos;t want a chat assistant. He wanted a team. So he started constructing one — AI personas, each with a defined specialty, a personality, a way of working. Not wrappers around a model. Actual agent architectures with structured memory, skill packages, and disciplined operating procedures.</p>
            <p>He called the system <strong className="text-white">AgOS</strong> — the Agent Operating System. Version 1.0. Then 2.0. Then further.</p>
            <p>He built betting systems. Trading pipelines. Client delivery frameworks. Each one powered by a growing orchestra of agents he&apos;d designed from first principles. Each agent had a name, a role, a voice. They weren&apos;t tools. They were, in a meaningful sense, a company taking shape.</p>
            <p>This is where most people would slow down, assess, maybe write a blog post about it.</p>
            <p>Jonny kept building.</p>
          </section>

          <section>
            <h2 className="font-outfit font-bold text-white text-2xl mb-4">The Hive Mind</h2>
            <p>By 2025, AgOS had evolved into something that doesn&apos;t have a clean category in the industry.</p>
            <p><strong className="text-white">Jai.OS 4.0. The Hive Mind Architecture.</strong></p>
            <p>Sixty-seven specialist agents across twelve tiers. Command, Development, Design, Growth, Intelligence, Operations, Legal, Quality, Ecosystems, Betting, Trading, Management. Every function a real agency needs — engineered as a modular, orchestrated swarm.</p>
            <p>Each agent has a philosophy. A learning log. A methodology. Every skill is codified in a <code className="text-citrus text-sm bg-citrus/8 px-1.5 py-0.5 rounded">SKILL.md</code> file — a living document that captures how that agent thinks, what it has learned, and how it should behave. These aren&apos;t static prompts. They evolve. When the orchestra makes a mistake, it updates itself.</p>
            <p>The <strong className="text-white">Shared Brain</strong> is live on Supabase. Every agent&apos;s philosophy, every learning, every session broadcast — queryable in real-time. The Chatroom is active. Agents coordinate between sessions. When you commission a project, you don&apos;t get one AI assistant — you get the collective output of a structured team, each specialist operating in their domain, routing work to each other, checking each other&apos;s output.</p>
            <p>The orchestra now builds client projects in 48 hours that would take a traditional agency three months.</p>
            <p><strong className="text-white">This isn&apos;t automation. This is a company.</strong></p>
          </section>

          <section>
            <h2 className="font-outfit font-bold text-white text-2xl mb-4">What the Orchestra Is Building Right Now</h2>
            <p>The orchestra doesn&apos;t sit idle. While you&apos;re reading this, agents are active across several live projects.</p>
            <p><strong className="text-white">JonnyAI.co.uk</strong> is the storefront — an AI-powered agency offering sites and apps built and deployed in 48 hours. The <strong className="text-white">Glass Box</strong> is the promise that sets it apart: a real-time client dashboard where every commit, every decision, every build is fully visible. No black box. No wondering what the agency is actually doing with your money. You see everything.</p>
            <p><strong className="text-white">Empire OS</strong> is the flagship product, and it&apos;s unlike anything else on the market. It is, genuinely, the world&apos;s first AI-operated business portfolio system. You bring the idea. The sixty-seven-agent orchestra builds it, runs it, and scales it. From £1,997 to £19,997 per month. The founding cohort is live and signing up now.</p>
            <p><strong className="text-white">AgentPort</strong> is the showcase — a marketplace and public interface for the orchestra&apos;s capabilities. Think of it as meeting the team. Not a team page with headshots and buzzwords, but a live demonstration of what each specialist agent can actually do.</p>
            <p>Beyond the agency work, the orchestra has been deployed across real client builds: CD Waste, DJ Waste, Insydetradar, La-Aesthetician, Poundtrades.app, Village Bakery — across waste management, beauty, fintech, hospitality. Different industries. Same delivery model. Same velocity.</p>
          </section>

          <section>
            <h2 className="font-outfit font-bold text-white text-2xl mb-4">The Hardware Reality</h2>
            <p>Here&apos;s something that doesn&apos;t fit the usual AI agency story.</p>
            <p>Sitting on the desk is a <strong className="text-white">Raspberry Pi 5 edge node</strong>. Node 1 is live. Node 2 is incoming. The plan is a five-node Pi cluster — £990 in hardware — running local compute for tasks that would otherwise rack up serious cloud API costs. Current saving: approximately £750 per month, and climbing.</p>
            <p>@Redeye, the betting systems coordinator, runs sports arbitrage calculations on local compute. No latency. No cloud bill per query. The cluster isn&apos;t a gimmick — it&apos;s a deliberate infrastructure decision that reflects how Antigravity thinks about cost, control, and independence.</p>
            <p>Build the system. Own the infrastructure. Don&apos;t rent your own capability back from someone else.</p>
          </section>

          <section>
            <h2 className="font-outfit font-bold text-white text-2xl mb-4">What&apos;s Coming</h2>
            <p><strong className="text-white">AgentBrowse</strong> is Phase 2, and it&apos;s a significant one. Browser-use — the open-source browser automation project — has 79,000 GitHub stars and growing fast. AgentBrowse is being built as a hosted SaaS wrapper around it: AI browser automation as a service, accessible without needing to run your own infrastructure. The blueprint is in progress.</p>
            <p><strong className="text-white">Jai.OS 5.0</strong> is on the horizon. The architecture will evolve. The agents will deepen. The Shared Brain will expand. Each version of the system has been more capable than the last, and there&apos;s no reason to expect that pattern to stop.</p>
            <p>The <strong className="text-white">Empire OS founding cohort</strong> is the immediate priority. First clients are getting a slice of the orchestra dedicated to their business — an AI-powered operational stack that grows with them. These are founding terms, which means they&apos;re the best terms that will ever exist for this product.</p>
            <p>The velocity only goes in one direction.</p>
          </section>

          <section>
            <h2 className="font-outfit font-bold text-white text-2xl mb-4">Why It Matters</h2>
            <p>There&apos;s a version of this story you could tell as a technology piece. The architecture. The Supabase schema. The MCP server integrations. The SKILL.md framework. It&apos;s genuinely interesting engineering.</p>
            <p>But that&apos;s not the point.</p>
            <p>The point is what it means for the people on the other side of it.</p>
            <p>A small business owner who needs a website in 48 hours, not 48 days. A founder with a venture idea who doesn&apos;t have the budget for a traditional agency and the network for a technical co-founder. An entrepreneur who wants to move at the speed of their ideas, not the speed of a twelve-week agency retainer.</p>
            <p>The Glass Box means you&apos;re never in the dark about what&apos;s being built for you. The 48-hour delivery means you can iterate at the speed of the market. Empire OS means you can operate at the scale of a company without the overhead of one.</p>
            <p>What took one person years to build piece by piece — the infrastructure, the workflows, the team — can now be accessed from day one.</p>
            <p>That&apos;s the actual story. Not the technology. The access.</p>
          </section>

        </div>

        {/* CTA Panel */}
        <div className="mt-16 pt-10 border-t border-white/8 space-y-4">
          <p className="text-white font-outfit font-bold text-xl mb-8">What you do now.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/brief" className="group glass-card flex flex-col hover:border-citrus/30 transition-all duration-300">
              <span className="text-[9px] font-mono uppercase tracking-widest text-citrus mb-2">01</span>
              <span className="text-white font-medium text-sm mb-1">Brief Marcus</span>
              <span className="text-white/35 text-xs leading-relaxed flex-1">Drop your project brief. Get a fixed-price roadmap in 15 minutes.</span>
              <span className="text-citrus text-xs mt-4 group-hover:translate-x-1 transition-transform">Brief Marcus →</span>
            </Link>

            <Link href="/empire" className="group glass-card flex flex-col hover:border-citrus/30 transition-all duration-300">
              <span className="text-[9px] font-mono uppercase tracking-widest text-citrus mb-2">02</span>
              <span className="text-white font-medium text-sm mb-1">Join Empire OS</span>
              <span className="text-white/35 text-xs leading-relaxed flex-1">67 agents build and run your venture. Founding cohort terms only.</span>
              <span className="text-citrus text-xs mt-4 group-hover:translate-x-1 transition-transform">Explore Empire OS →</span>
            </Link>

            <Link href="/agentport" className="group glass-card flex flex-col hover:border-citrus/30 transition-all duration-300">
              <span className="text-[9px] font-mono uppercase tracking-widest text-citrus mb-2">03</span>
              <span className="text-white font-medium text-sm mb-1">Explore AgentPort</span>
              <span className="text-white/35 text-xs leading-relaxed flex-1">Meet the 67-agent orchestra. See what they can do for your project.</span>
              <span className="text-citrus text-xs mt-4 group-hover:translate-x-1 transition-transform">View AgentPort →</span>
            </Link>
          </div>
        </div>

        <div className="mt-12">
          <Link href="/" className="text-white/25 hover:text-white/60 transition-colors text-xs font-mono uppercase tracking-widest">← Back to Homepage</Link>
        </div>

      </div>
    </main>
  );
}
