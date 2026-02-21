'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

function NeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const NODE_COUNT = 60;
    const nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });
      // Draw edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(217,119,87,${0.12 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      // Draw nodes
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(217,119,87,0.5)';
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
} as const;

const terminalLines = [
  { time: '10:43', text: '🟢 @Sebastian committed: setup-supabase-auth.ts', type: 'commit' },
  { time: '10:45', text: '🟢 @Priya committed: GlassNavbar.tsx — dark mode approved', type: 'commit' },
  { time: '10:48', text: '🟡 @Marcus reviewing: milestone-1-auth', type: 'info' },
  { time: '10:51', text: '⚠️  @Sam raised alert: RLS policy missing on tasks', type: 'alert' },
  { time: '10:52', text: '🟢 @Victor patched: multi-tenant RLS secured', type: 'commit' },
  { time: '10:54', text: '🟢 @Sebastian committed: dashboard-realtime-hooks.ts', type: 'commit' },
  { time: '10:56', text: '✅ Phase 1 complete — 4 tasks shipped in 2h 13m', type: 'success' },
];

const demoRoster = [
  { initials: 'MC', active: true, handle: '@Marcus', status: 'Reviewing' },
  { initials: 'PS', active: true, handle: '@Priya', status: 'Designing' },
  { initials: 'SC', active: false, handle: '@Sebastian', status: 'Idle' },
  { initials: 'SB', active: false, handle: '@Sam', status: 'Idle' },
];

const coreAgents = [
  {
    handle: '@Marcus', name: 'Marcus Cole', role: 'The Conductor', initials: 'MC', tier: 'Command',
    quote: '"I don\'t write code. I orchestrate the machines that do."',
  },
  {
    handle: '@Priya', name: 'Priya Sharma', role: 'The Perfectionist', initials: 'PS', tier: 'Design',
    quote: '"Every pixel has a purpose. Every animation earns its render."',
  },
  {
    handle: '@Sebastian', name: 'Sebastian Cross', role: 'The Architect', initials: 'SC', tier: 'Dev',
    quote: '"Type-safety isn\'t optional. It\'s the foundation of speed."',
  },
  {
    handle: '@Sam', name: 'Sam Blackwood', role: 'The Gatekeeper', initials: 'SB', tier: 'QA',
    quote: '"Security built in from day one. Never bolted on after."',
  },
  {
    handle: '@Derek', name: 'Derek O\'Brien', role: 'The Engine', initials: 'DO', tier: 'Infra',
    quote: '"Zero-downtime isn\'t a goal. It\'s non-negotiable."',
  },
];

const buildPricing = [
  { name: 'The Facelift', desc: 'High-converting UI makeover & speed optimisation', regular: '£997', sale: '£497' },
  { name: 'The Launchpad', desc: 'Full premium website built in 48 hours', regular: '£1,997', sale: '£997', featured: true },
  { name: 'The App Prototype', desc: 'Clickable mobile PWA shell', regular: '£1,997', sale: '£997' },
  { name: 'The MVP App', desc: 'Fully functional web application', regular: '£9,997', sale: '£4,997' },
];

const trafficPricing = [
  { name: 'The Ranking Engine', desc: 'AI-driven SEO, weekly blogs & backlinks', regular: '£997/mo', sale: '£497/mo' },
  { name: 'The Conversion Engine', desc: 'Google Ads & PPC campaign management', regular: '£997/mo', sale: '£497/mo', featured: true },
  { name: 'The Social Engine', desc: 'Automated content repurposing & posting', regular: '£497/mo', sale: '£247/mo' },
];

const workforcePricing = [
  { name: 'Hire an AI SDR', desc: '24/7 lead generation and cold outreach', regular: '£2,000/mo', sale: '£1,000/mo', featured: true },
  { name: 'Hire an AI Support Rep', desc: 'Autonomous customer service agent', regular: '£2,000/mo', sale: '£1,000/mo' },
  { name: 'The Growth Retainer', desc: 'Uptime monitoring, backups & web updates', regular: '£497/mo', sale: '£247/mo' },
];

const steps = [
  {
    num: '01', icon: '💬', title: 'Chat with Marcus',
    desc: 'Free 15-minute scope session. Marcus maps your idea into a 3-phase technical roadmap — fixed price, no fluff.',
  },
  {
    num: '02', icon: '📋', title: 'Review Milestones',
    desc: 'Approve your roadmap. Crystal clear deliverables, timeline, and fixed price per phase. Zero scope creep.',
  },
  {
    num: '03', icon: '🚀', title: 'Fund & Watch',
    desc: 'Pay per milestone. Watch your product being built live in the Glass Box dashboard. Ship when it\'s done.',
  },
];

type PricingItem = { name: string; desc: string; regular: string; sale: string; featured?: boolean };

function PricingCard({ item }: { item: PricingItem }) {
  return (
    <div className={`glass-card relative flex flex-col ${item.featured ? 'border-citrus/30' : ''}`}>
      {item.featured && <div className="absolute top-0 left-4 right-4 h-px bg-citrus" />}
      <div className="text-white font-medium text-sm mb-1">{item.name}</div>
      <div className="text-white/40 text-xs leading-relaxed mb-4 flex-1">{item.desc}</div>
      <div>
        <div className="text-white/25 text-xs line-through mb-0.5">{item.regular}</div>
        <div className="text-citrus font-outfit font-extrabold text-2xl">{item.sale}</div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Neural node canvas */}
        <NeuralCanvas />
        {/* Subtle grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Citrus glow */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(217,119,87,0.13) 0%, transparent 65%)' }}
        />
        {/* Scanning line */}
        <motion.div
          className="absolute left-0 right-0 h-px pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(217,119,87,0.25), transparent)' }}
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24 pb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-citrus mb-10">
              <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />
              AI Product Engine — Now Live
            </span>
          </motion.div>

          <motion.h1
            className="font-outfit font-extrabold text-6xl md:text-8xl leading-none tracking-tight mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Stop Waiting Months<br />
            <span className="text-citrus">for Software.</span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-white/50 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Build at the Speed of Thought.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Link href="/brief" className="btn-citrus">Brief The Conductor</Link>
            <a href="#pricing" className="btn-ghost">View 50% Off Menu ↓</a>
          </motion.div>

          <motion.div
            className="flex items-center justify-center gap-10 md:gap-16 mt-16 pt-10 border-t border-white/8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {[['48h', 'Delivery'], ['40+', 'Specialists'], ['100%', 'Transparent']].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="text-3xl md:text-4xl font-outfit font-extrabold text-white">{val}</div>
                <div className="text-xs text-white/30 uppercase tracking-widest mt-1 font-mono">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
        >
          <div className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent mx-auto" />
        </motion.div>
      </section>

      {/* ── AGITATION ────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="section-label">The Problem</span>
            <h2 className="futuristic-title text-4xl md:text-5xl mt-4 leading-tight">
              Traditional Dev<br />is Broken.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div {...fadeUp} className="glass-panel p-8" style={{ borderColor: 'rgba(239,68,68,0.15)' }}>
              <h3 className="text-red-400/80 font-mono uppercase tracking-widest text-xs mb-6">✕  The Old Way</h3>
              <ul className="space-y-4">
                {[
                  '3–6 months to launch anything',
                  '£50,000+ for a basic MVP',
                  'Endless scope creep and change requests',
                  'Agencies that ghost after the deposit',
                  'Zero visibility into what\'s being built',
                  'Broken promises and missed deadlines',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-white/35 text-sm">
                    <span className="text-red-400/50 mt-0.5 shrink-0">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ delay: 0.1 }}
              className="glass-panel p-8 relative overflow-hidden"
              style={{ borderColor: 'rgba(34,197,94,0.2)' }}
            >
              <div
                className="absolute inset-0"
                style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.06) 0%, transparent 70%)' }}
              />
              <h3 className="text-signal font-mono uppercase tracking-widest text-xs mb-6 relative">✓  The AI Product Engine</h3>
              <ul className="space-y-4 relative">
                {[
                  '48-hour delivery on your first milestone',
                  'Crystal clear pricing — zero surprises',
                  'Real-time Glass Box dashboard — watch it live',
                  '40+ specialist agents on your project now',
                  'Every commit, every decision — fully visible',
                  'Pay per milestone. Cancel if we miss.',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-white/80 text-sm">
                    <span className="text-signal mt-0.5 shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── GLASS BOX SHOWSTOPPER ─────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="section-label">The Glass Box</span>
            <h2 className="futuristic-title text-4xl md:text-5xl mt-4 leading-tight">
              See Your Code<br />Come to Life.
            </h2>
            <p className="text-white/40 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
              Every task, every commit, every agent — visible in real-time. This is what it looks like when your product is actively being built.
            </p>
          </motion.div>

          <motion.div {...fadeUp} className="glass-panel overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/8">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-signal/60" />
              </div>
              <span className="text-[11px] font-mono text-white/20 hidden sm:block">
                glass-box — Project: ACME App — Phase 1 of 3
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-signal font-mono uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
                Live
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-2 border-b md:border-b-0 md:border-r border-white/8 p-5 font-mono text-xs">
                <div className="text-white/20 uppercase tracking-widest text-[10px] mb-3">Live Terminal</div>
                <div className="space-y-2.5">
                  {terminalLines.map((line, i) => (
                    <div
                      key={i}
                      className={`leading-relaxed ${
                        line.type === 'alert' ? 'text-yellow-400/75' :
                        line.type === 'commit' ? 'text-signal/75' :
                        line.type === 'success' ? 'text-citrus/90' :
                        'text-white/40'
                      }`}
                    >
                      <span className="text-white/20 mr-2">{line.time}</span>
                      {line.text}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5">
                <div className="text-white/20 uppercase tracking-widest text-[10px] font-mono mb-3">Workforce</div>
                <div className="space-y-3 mb-5">
                  {demoRoster.map(agent => (
                    <div key={agent.handle} className="flex items-center gap-3">
                      <div className={`relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${agent.active ? 'bg-citrus/10 text-citrus border border-citrus/20' : 'bg-white/5 text-white/30 border border-white/8'}`}>
                        {agent.initials}
                        {agent.active && (
                          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-signal animate-pulse" />
                        )}
                      </div>
                      <div>
                        <div className={`text-xs ${agent.active ? 'text-white/80' : 'text-white/30'}`}>{agent.handle}</div>
                        <div className={`text-[10px] ${agent.active ? 'text-signal' : 'text-white/20'}`}>{agent.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-white/8">
                  <div className="text-white/20 text-[10px] uppercase tracking-widest font-mono mb-2">Phase 1</div>
                  <div className="w-full h-1 bg-white/8 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-signal rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: '35%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                    />
                  </div>
                  <div className="text-[10px] text-white/25 mt-1.5">35% complete</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="text-center mt-8">
            <Link href="/brief" className="btn-citrus">Get Your Glass Box →</Link>
          </motion.div>
        </div>
      </section>

      {/* ── AGENT ROSTER ─────────────────────────────────────────────────── */}
      <section id="workforce" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="section-label">The Workforce</span>
            <h2 className="futuristic-title text-4xl md:text-5xl mt-4 leading-tight">
              Not a ChatGPT Wrapper.<br />An Orchestra.
            </h2>
            <p className="text-white/35 mt-4 text-sm max-w-md mx-auto">
              40+ specialist agents. Hired, trained, and deployed by Jonny. On your project in 48 hours.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coreAgents.map((agent, i) => (
              <motion.div
                key={agent.handle}
                {...fadeUp}
                transition={{ delay: i * 0.08 }}
                className="glass-card hover:border-white/16 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-citrus/10 border border-citrus/20 flex items-center justify-center text-sm font-bold text-citrus shrink-0">
                    {agent.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-white font-medium text-sm truncate">{agent.name}</div>
                    <div className="text-white/35 text-xs">{agent.handle}</div>
                  </div>
                  <span className="ml-auto text-[9px] font-mono uppercase tracking-widest text-white/20 border border-white/8 px-1.5 py-0.5 rounded-sm shrink-0">
                    {agent.tier}
                  </span>
                </div>
                <div className="text-citrus/75 text-xs font-medium mb-2">{agent.role}</div>
                <p className="text-white/35 text-xs italic leading-relaxed">{agent.quote}</p>
              </motion.div>
            ))}

            <motion.div
              {...fadeUp}
              transition={{ delay: 0.4 }}
              className="glass-card flex flex-col items-center justify-center text-center min-h-[160px] border-dashed"
            >
              <div className="text-4xl font-outfit font-extrabold text-white/15">+35</div>
              <div className="text-xs text-white/25 mt-1 uppercase tracking-widest font-mono">More Specialists</div>
              <div className="text-[10px] text-white/15 mt-2 font-mono">SEO · Data · Legal · DevOps · Betting</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-6">
            <span className="section-label">The Offer</span>
            <h2 className="futuristic-title text-4xl md:text-5xl mt-4 leading-tight">
              50% Off.<br />March 2026 Only.
            </h2>
          </motion.div>

          <motion.div {...fadeUp} className="flex justify-center mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-mono text-yellow-400/80 border border-yellow-400/20 bg-yellow-400/5 px-4 py-2 rounded-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
              Early Adopter pricing ends March 31, 2026
            </span>
          </motion.div>

          <motion.div {...fadeUp} id="build" className="mb-12">
            <h3 className="font-mono uppercase tracking-[0.25em] text-white/30 text-xs mb-5">— The Build</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {buildPricing.map(item => <PricingCard key={item.name} item={item} />)}
            </div>
          </motion.div>

          <motion.div {...fadeUp} id="traffic" className="mb-12">
            <h3 className="font-mono uppercase tracking-[0.25em] text-white/30 text-xs mb-5">— The Traffic</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {trafficPricing.map(item => <PricingCard key={item.name} item={item} />)}
            </div>
          </motion.div>

          <motion.div {...fadeUp} id="work" className="mb-12">
            <h3 className="font-mono uppercase tracking-[0.25em] text-white/30 text-xs mb-5">— The Workforce (WaaS)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {workforcePricing.map(item => <PricingCard key={item.name} item={item} />)}
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="text-center">
            <Link href="/brief" className="btn-citrus">Claim 50% Off — Brief Marcus Now</Link>
          </motion.div>
        </div>
      </section>

      {/* ── WORKFLOW ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="section-label">How It Works</span>
            <h2 className="futuristic-title text-4xl md:text-5xl mt-4 leading-tight">
              From Idea to Live<br />in 3 Steps.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {steps.map((step, i) => (
              <motion.div key={step.num} {...fadeUp} transition={{ delay: i * 0.1 }} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-white/10 to-transparent z-0" />
                )}
                <div className="relative z-10">
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <div className="font-mono text-xs text-citrus mb-2 uppercase tracking-widest">{step.num}</div>
                  <h3 className="font-outfit font-bold text-xl text-white mb-3">{step.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="py-32 px-6 border-t border-white/5 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(217,119,87,0.09) 0%, transparent 70%)' }}
        />
        <motion.div {...fadeUp} className="relative z-10 max-w-3xl mx-auto text-center">
          <span className="section-label block mb-6">The Decision</span>
          <h2 className="font-outfit font-extrabold text-5xl md:text-7xl leading-none tracking-tight mb-6">
            Stop Burning Time.<br />
            <span className="text-citrus">Start Shipping.</span>
          </h2>
          <p className="text-white/35 mb-10 text-sm max-w-md mx-auto leading-relaxed">
            Free scope session. No commitment. Marcus maps your project in 15 minutes and gives you a fixed-price roadmap on the spot.
          </p>
          <Link href="/brief" className="btn-citrus text-base py-4 px-12">
            Start Your Free Project Scope Now
          </Link>
          <p className="text-white/20 text-xs mt-5 font-mono uppercase tracking-widest">
            No commitment · Free consultation · 48h kickoff
          </p>
        </motion.div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/8 px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">
            <div>
              <div className="font-outfit font-extrabold text-xl text-white mb-1">JonnyAi</div>
              <div className="text-xs text-white/25 font-mono uppercase tracking-widest">AI Product Engine</div>
              <div className="text-xs text-white/15 mt-2">Jonny Allum Innovations Ltd · United Kingdom</div>
            </div>
            <nav className="flex flex-wrap gap-x-8 gap-y-2 text-xs text-white/30">
              <a href="#" className="hover:text-white/60 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white/60 transition-colors">Terms of Service</a>
              <a href="/status" className="hover:text-white/60 transition-colors">System Status</a>
              <a href="#" className="hover:text-white/60 transition-colors">AI Documentation</a>
              <a href="mailto:support@jonnyai.co.uk" className="hover:text-white/60 transition-colors">support@jonnyai.co.uk</a>
            </nav>
          </div>
          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="text-xs text-white/15 font-mono">Powered by Jai.OS 4.0 · Shared Brain: ONLINE</div>
            <div className="text-xs text-white/15 font-mono">© 2026 Jonny Allum Innovations Ltd</div>
          </div>
        </div>
      </footer>
    </main>
  );
}
