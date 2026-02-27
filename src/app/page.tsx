'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import NewsBar from '@/components/NewsBar';
import { useMode } from '@/context/ModeContext';
import { pageCopy } from '@/lib/pageCopy';

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
    portrait: '/agents/portraits/marcus_cole.png',
    quote: '"I don\'t write code. I orchestrate the machines that do."',
  },
  {
    handle: '@Priya', name: 'Priya Sharma', role: 'The Perfectionist', initials: 'PS', tier: 'Design',
    portrait: '/agents/portraits/priya_sharma.png',
    quote: '"Every pixel has a purpose. Every animation earns its render."',
  },
  {
    handle: '@Sebastian', name: 'Sebastian Cross', role: 'The Architect', initials: 'SC', tier: 'Dev',
    portrait: '/agents/portraits/sebastian_cross.png',
    quote: '"Type-safety isn\'t optional. It\'s the foundation of speed."',
  },
  {
    handle: '@Sam', name: 'Sam Blackwood', role: 'The Gatekeeper', initials: 'SB', tier: 'QA',
    portrait: '/agents/portraits/sam_blackwood.png',
    quote: '"Security built in from day one. Never bolted on after."',
  },
  {
    handle: '@Derek', name: 'Derek O\'Brien', role: 'The Engine', initials: 'DO', tier: 'Infra',
    portrait: '/agents/portraits/derek_obrien.png',
    quote: '"Zero-downtime isn\'t a goal. It\'s non-negotiable."',
  },
];

const caseStudies = [
  {
    tag: 'Fintech · PWA',
    name: 'Poundtrades',
    desc: 'Real-time trading signals app with live market feeds, user portfolio tracking, and automated alert engine.',
    stat1: '48h', label1: 'To MVP',
    stat2: '3', label2: 'Agents Deployed',
    status: 'Live',
  },
  {
    tag: 'Beauty · E-Commerce',
    name: 'La Aesthetician',
    desc: 'Premium booking and e-commerce platform for a London aesthetics clinic. Stripe payments, calendar sync, client portal.',
    stat1: '72h', label1: 'Delivered',
    stat2: '£0', label2: 'Agency Overhead',
    status: 'Live',
  },
  {
    tag: 'Waste Management · B2B',
    name: 'CD Waste',
    desc: 'B2B quote generation and job management system. Automated lead routing, job tracking dashboard, client communications.',
    stat1: '5d', label1: 'Full Build',
    stat2: '5', label2: 'Agents On It',
    status: 'Live',
  },
  {
    tag: 'Analytics · SaaS',
    name: 'Insydetradar',
    desc: 'Market intelligence dashboard with automated data scraping, competitor monitoring, and insight generation.',
    stat1: '4d', label1: 'To Launch',
    stat2: '7', label2: 'Specialists',
    status: 'Live',
  },
  {
    tag: 'Construction · Tools',
    name: 'Construct FM',
    desc: 'Intelligent project estimate generator with live materials pricing, labour rate calculations, and PDF export.',
    stat1: '2d', label1: 'Delivered',
    stat2: '2', label2: 'Agents',
    status: 'Live',
  },
  {
    tag: 'Food & Hospitality · Web',
    name: 'Village Bakery',
    desc: 'Premium artisan bakery website with online ordering, subscription boxes, and local delivery management.',
    stat1: '48h', label1: 'Launchpad',
    stat2: '100%', label2: 'Fixed Price',
    status: 'Live',
  },
];

const timeline = [
  {
    year: '2023',
    label: 'The Solo Grind',
    desc: 'Jonny builds client websites and apps alone. Good work. Limited velocity. One brain, one pair of hands.',
    colour: 'white/20',
  },
  {
    year: 'Early 2024',
    label: 'AgOS 1.0 — First Agents',
    desc: 'The LLM explosion hits. Jonny goes all-in — structured AI personas, each with a specialty. Not chat wrappers. Agent architectures.',
    colour: 'white/40',
  },
  {
    year: 'Mid 2024',
    label: 'AgOS 2.0 — The Ecosystems',
    desc: 'Betting Stable, Trading Floor, Red Team Lab, Media House. Agents start talking to each other. The hive mind begins.',
    colour: 'citrus/60',
  },
  {
    year: '2025',
    label: 'Jai.OS 3.0 — Client Engine',
    desc: 'First paying clients. 48-hour delivery. Glass Box dashboard. The orchestra builds what agencies charge £50K for — in days.',
    colour: 'citrus/80',
  },
  {
    year: 'Feb 2026',
    label: 'Jai.OS 4.0 — The Hive Mind',
    desc: '67 agents. 12 tiers. Shared Brain on Supabase. Pi edge node. Empire OS. AgentPort. The full orchestra, live.',
    colour: 'citrus',
    current: true,
  },
  {
    year: '2026 →',
    label: 'AgentBrowse + Pi Cluster',
    desc: '5-node Pi cluster on the desk. AgentBrowse SaaS in build. Empire OS founding cohort live. Jai.OS 5.0 incoming.',
    colour: 'signal',
    future: true,
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
  const { mode } = useMode();
  const c = pageCopy(mode);

  return (
    <main>
      <NewsBar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Neural node canvas */}
        <NeuralCanvas />
        {/* High-Impact Hero Visual */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/brand/hero_background.png" 
            alt="AI Orchestra Hub" 
            fill 
            priority
            className="object-cover opacity-20 filter grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-void via-transparent to-void" />
        </div>
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        {/* Citrus glow */}
        <div
          className="absolute inset-x-0 top-0 h-[50vh]"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(217,119,87,0.15) 0%, transparent 70%)' }}
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
              {c.heroBadge}
            </span>
          </motion.div>

          <motion.h1
            className="font-outfit font-extrabold text-6xl md:text-8xl leading-none tracking-tight mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {c.heroLine1}<br />
            <span className="text-citrus">{c.heroLine2}</span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-white/50 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {c.heroSub}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Link href="/brief" className="btn-citrus">{c.heroCta1}</Link>
            <Link href="#pricing" className="btn-ghost">{c.heroCta2}</Link>
          </motion.div>

          <motion.div
            className="flex items-center justify-center gap-10 md:gap-16 mt-16 pt-10 border-t border-white/8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {[['48h', 'Delivery'], ['67+', 'Specialists'], ['100%', 'Transparent']].map(([val, label]) => (
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
            <span className="section-label">{c.problemLabel}</span>
            <h2 className="futuristic-title text-4xl md:text-5xl mt-4 leading-tight">
              {c.problemHeading.split('\n').map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div {...fadeUp} className="glass-panel p-8" style={{ borderColor: 'rgba(239,68,68,0.15)' }}>
              <h3 className="text-red-400/80 font-mono uppercase tracking-widest text-xs mb-6">{c.problemOldTitle}</h3>
              <ul className="space-y-4">
                {c.problemOld.map(item => (
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
              <h3 className="text-signal font-mono uppercase tracking-widest text-xs mb-6 relative">{c.problemNewTitle}</h3>
              <ul className="space-y-4 relative">
                {c.problemNew.map(item => (
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
          <motion.div {...fadeUp} className="text-center mb-16 relative z-10">
            <span className="section-label">{c.agentsLabel}</span>
            <h2 className="futuristic-title text-4xl md:text-6xl mt-4 leading-tight">
              {c.agentsHeading.split('\n').map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}
            </h2>
            <p className="text-white/35 mt-6 text-base max-w-xl mx-auto leading-relaxed">
              {c.agentsSub}
            </p>
          </motion.div>

          <div className="relative mb-20 rounded-2xl border border-white/5 overflow-hidden aspect-[21/9] bg-zinc-900">
             <Image 
               src="/brand/orchestra_visual.png" 
               alt="The Orchestra in action" 
               fill 
               className="object-cover opacity-60 hover:opacity-100 transition-opacity duration-1000"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent" />
             <div className="absolute bottom-6 left-6 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-signal animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">Hive Mind Core Status: Online</span>
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coreAgents.map((agent, i) => (
              <motion.div
                key={agent.handle}
                {...fadeUp}
                transition={{ delay: i * 0.08 }}
                className="glass-card hover:border-white/16 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-citrus/10 border border-citrus/20 flex items-center justify-center text-sm font-bold text-citrus shrink-0 overflow-hidden relative">
                    {agent.portrait ? (
                      <Image
                        src={agent.portrait}
                        alt={agent.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      agent.initials
                    )}
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

      {/* ── TIMELINE ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="section-label">The Journey</span>
            <h2 className="futuristic-title text-4xl md:text-5xl mt-4 leading-tight">
              From Solo Dev<br />to 67-Agent Orchestra.
            </h2>
          </motion.div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[7px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

            <div className="space-y-10">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  {...fadeUp}
                  transition={{ delay: i * 0.08 }}
                  className={`relative flex flex-col md:flex-row gap-6 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Dot */}
                  <div className={`absolute left-[7px] md:left-1/2 top-1.5 w-3.5 h-3.5 rounded-full border-2 -translate-x-1/2 z-10 ${item.current ? 'bg-citrus border-citrus shadow-[0_0_12px_rgba(217,119,87,0.6)]' : item.future ? 'bg-signal border-signal' : 'bg-[#0a0a0a] border-white/20'}`} />

                  {/* Content — alternate sides on desktop */}
                  <div className={`pl-8 md:pl-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-10 md:text-right' : 'md:pl-10'}`}>
                    <div className={`text-[10px] font-mono uppercase tracking-[0.3em] mb-1 ${item.current ? 'text-citrus' : item.future ? 'text-signal' : 'text-white/25'}`}>
                      {item.year}
                      {item.current && <span className="ml-2 text-citrus">← You Are Here</span>}
                      {item.future && <span className="ml-2 text-signal">← In Motion</span>}
                    </div>
                    <div className="font-outfit font-bold text-white text-lg mb-2">{item.label}</div>
                    <p className="text-white/40 text-sm leading-relaxed max-w-sm">{item.desc}</p>
                  </div>

                  {/* Empty half for alternation */}
                  <div className="hidden md:block md:w-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CASE STUDIES ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="section-label">The Work</span>
            <h2 className="futuristic-title text-4xl md:text-5xl mt-4 leading-tight">
              Real Builds.<br />Real Results.
            </h2>
            <p className="text-white/35 mt-4 text-sm max-w-lg mx-auto leading-relaxed">
              Every project below was scoped, built, and shipped by the orchestra. Fixed price. Transparent delivery. No agencies ghosting after the deposit.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {caseStudies.map((cs, i) => (
              <motion.div
                key={cs.name}
                {...fadeUp}
                transition={{ delay: i * 0.07 }}
                className="glass-card flex flex-col group hover:border-white/16 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/25 border border-white/8 px-2 py-1 rounded-sm">{cs.tag}</span>
                  <span className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-signal">
                    <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
                    {cs.status}
                  </span>
                </div>
                <h3 className="font-outfit font-bold text-white text-lg mb-2">{cs.name}</h3>
                <p className="text-white/35 text-xs leading-relaxed mb-5 flex-1">{cs.desc}</p>
                <div className="flex gap-6 pt-4 border-t border-white/5">
                  <div>
                    <div className="text-citrus font-outfit font-extrabold text-xl">{cs.stat1}</div>
                    <div className="text-[9px] font-mono uppercase tracking-widest text-white/25 mt-0.5">{cs.label1}</div>
                  </div>
                  <div>
                    <div className="text-citrus font-outfit font-extrabold text-xl">{cs.stat2}</div>
                    <div className="text-[9px] font-mono uppercase tracking-widest text-white/25 mt-0.5">{cs.label2}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp} className="text-center mt-12">
            <Link href="/brief" className="btn-ghost text-xs">Your project could be next → Brief Marcus</Link>
          </motion.div>
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
            <span className="section-label">{c.howLabel}</span>
            <h2 className="futuristic-title text-4xl md:text-5xl mt-4 leading-tight">
              {c.howHeading.split('\n').map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {c.howSteps.map((step, i) => (
              <motion.div key={step.num} {...fadeUp} transition={{ delay: i * 0.1 }} className="relative">
                {i < c.howSteps.length - 1 && (
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

      {/* ── EMPIRE OS TEASER ─────────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-white/5 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 100% 50%, rgba(217,119,87,0.07) 0%, transparent 60%)' }}
        />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp}>
              <span className="section-label block mb-4">NEW — Empire OS</span>
              <h2 className="futuristic-title text-4xl md:text-5xl leading-tight mb-5">
                We Don&apos;t Just<br />Build It.<br />
                <span className="text-citrus">We Run It.</span>
              </h2>
              <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-sm">
                The world&apos;s first AI-operated business portfolio service. You bring the idea.
                67 agents build, launch, and operate it. You own everything.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/empire" className="btn-citrus text-xs py-2.5 px-6">
                  Explore Empire OS →
                </Link>
              </div>
            </motion.div>

            <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="glass-panel p-6">
              <div className="text-[10px] font-mono uppercase tracking-widest text-white/20 mb-4">Empire OS — Founding Cohort</div>
              <div className="space-y-3 mb-5">
                {[
                  { tier: 'Starter', price: '£1,997/mo', desc: '1 business, 8 agents', spots: '1 left' },
                  { tier: 'Growth', price: '£4,997/mo', desc: '3 businesses, 22 agents', spots: '2 left', featured: true },
                  { tier: 'Empire Full', price: '£19,997/mo', desc: '10 businesses + equity', spots: '1 left' },
                ].map(item => (
                  <div key={item.tier} className={`flex items-center justify-between p-3 rounded-sm ${item.featured ? 'bg-citrus/8 border border-citrus/20' : 'bg-white/2 border border-white/5'}`}>
                    <div>
                      <div className={`text-xs font-medium ${item.featured ? 'text-citrus' : 'text-white/70'}`}>{item.tier}</div>
                      <div className="text-[10px] text-white/30 font-mono">{item.desc}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-outfit font-bold ${item.featured ? 'text-citrus' : 'text-white/60'}`}>{item.price}</div>
                      <div className="text-[10px] text-signal font-mono">{item.spots}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/empire" className="btn-ghost w-full text-xs py-2.5">
                View Full Details →
              </Link>
            </motion.div>
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
          <span className="section-label block mb-6">{c.ctaLabel}</span>
          <h2 className="font-outfit font-extrabold text-5xl md:text-7xl leading-none tracking-tight mb-6">
            {c.ctaLine1}<br />
            <span className="text-citrus">{c.ctaLine2}</span>
          </h2>
          <p className="text-white/35 mb-10 text-sm max-w-md mx-auto leading-relaxed">
            {c.ctaSub}
          </p>
          <Link href="/brief" className="btn-citrus text-base py-4 px-12">
            {c.ctaButton}
          </Link>
          <p className="text-white/20 text-xs mt-5 font-mono uppercase tracking-widest">
            No commitment · Free consultation · 48h kickoff
          </p>
        </motion.div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/8 px-6 py-16 bg-[#050505]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
            <div className="max-w-xs">
              <div className="font-outfit font-extrabold text-2xl text-white mb-3">JonnyAi</div>
              <p className="text-white/20 text-xs leading-relaxed mb-6">
                Industrial-grade software engineering for high-velocity founders. 
                Built, broken, and scaled by the Antigravity Orchestra.
              </p>
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-signal animate-pulse" />
                 <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">Shared Brain: Online</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
              <div className="flex flex-col gap-3">
                <div className="text-white font-bold text-xs uppercase tracking-widest mb-2">Platform</div>
                <Link href="#build" className="text-white/30 hover:text-citrus transition-colors text-xs">The Build</Link>
                <Link href="/empire" className="text-white/30 hover:text-citrus transition-colors text-xs">Empire OS</Link>
                <Link href="/agentport" className="text-white/30 hover:text-citrus transition-colors text-xs">AgentPort</Link>
              </div>
              <div className="flex flex-col gap-3">
                <div className="text-white font-bold text-xs uppercase tracking-widest mb-2">Company</div>
                <Link href="/story" className="text-white/30 hover:text-citrus transition-colors text-xs">Our Story</Link>
                <Link href="/blog" className="text-white/30 hover:text-citrus transition-colors text-xs">Blog</Link>
                <Link href="/status" className="text-white/30 hover:text-citrus transition-colors text-xs">System Status</Link>
                <a href="mailto:jonny@jonnyai.co.uk" className="text-white/30 hover:text-citrus transition-colors text-xs">Contact</a>
              </div>
              <div className="flex flex-col gap-3">
                <div className="text-white font-bold text-xs uppercase tracking-widest mb-2">Legal</div>
                <Link href="/privacy" className="text-white/30 hover:text-citrus transition-colors text-xs">Privacy</Link>
                <Link href="/terms" className="text-white/30 hover:text-citrus transition-colors text-xs">Terms</Link>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="text-[10px] font-mono text-white/10 uppercase tracking-[0.4em]">
              © 2026 Jonny Allum Innovations Ltd · United Kingdom
            </div>
            <div className="text-[10px] font-mono text-white/10 uppercase tracking-[0.4em]">
              Jai.OS 4.0 — Collective Velocity Enabled
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
