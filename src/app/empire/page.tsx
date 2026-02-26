'use client';

import Link from 'next/link';
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

    const NODE_COUNT = 67;
    const nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2 + 0.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(217,119,87,${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(217,119,87,0.6)';
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

const tiers = [
  {
    name: 'Empire Starter',
    tagline: 'One business. Fully operated.',
    price: '£1,997',
    period: '/month',
    highlight: false,
    includes: [
      '1 business built and operated by the AI team',
      'Up to 8 specialist agents deployed',
      'Weekly Monday brief + progress reporting',
      'Glass Box real-time transparency dashboard',
      'Monthly performance review with Jonny',
      'Fixed fee — no equity taken',
    ],
    cta: 'Apply for Starter',
  },
  {
    name: 'Empire Growth',
    tagline: 'Three businesses. Compounding velocity.',
    price: '£4,997',
    period: '/month',
    highlight: true,
    includes: [
      '3 businesses built and operated simultaneously',
      'Up to 22 specialist agents deployed',
      'Priority queue — faster builds, faster pivots',
      'Cross-portfolio growth intelligence (agents spot synergies)',
      'Dedicated Marcus orchestrator thread',
      'Glass Box dashboard for all three portfolios',
      'Monthly equity review option available',
    ],
    cta: 'Apply for Growth',
    badge: 'Most Popular',
  },
  {
    name: 'Empire Full',
    tagline: 'Ten businesses. Partner-level.',
    price: '£19,997',
    period: '/month',
    highlight: false,
    includes: [
      'Up to 10 businesses — we run the portfolio',
      '38+ specialist agents across all verticals',
      'Equity positions available (we earn with you)',
      'Dedicated empire dashboard — full intelligence layer',
      'Quarterly in-person strategy day with Jonny',
      'First-access to new agents as they train',
      'Bespoke SLA — you set the KPIs',
    ],
    cta: 'Apply for Full Empire',
  },
];

const mechanism = [
  {
    week: 'Week 1',
    title: 'Intelligence & Architecture',
    desc: 'Your dedicated Marcus thread opens. @Scholar + @Sophie run market research. @Priya + @Sebastian design the full business architecture. You approve the blueprint.',
    agents: ['@Marcus', '@Scholar', '@Sophie', '@Priya', '@Sebastian'],
  },
  {
    week: 'Month 1',
    title: 'Build & Launch',
    desc: 'Your business goes live. Site, brand, automations, and first revenue channel operational. @Felix builds the funnel. @Grace handles SEO from day one. @Derek ships infra.',
    agents: ['@Felix', '@Grace', '@Derek', '@Nathan', '@Owen'],
  },
  {
    week: 'Monthly',
    title: 'Operate & Optimise',
    desc: 'The orchestra runs 24/7. @Jasper handles outreach, @Maya tracks performance, @Dreamer spots the next opportunity. You get a Monday brief and a Glass Box dashboard.',
    agents: ['@Jasper', '@Maya', '@Dreamer', '@Hannah', '@Finops'],
  },
];

const comparisons = [
  { category: 'Speed to first revenue', traditional: '3–6 months', empire: '< 30 days' },
  { category: 'Cost of 3 business builds', traditional: '£150,000+', empire: '£4,997/mo' },
  { category: 'Visibility', traditional: 'Monthly reports (if lucky)', empire: 'Real-time Glass Box' },
  { category: 'Who runs the business', traditional: 'You + expensive hires', empire: '38 AI specialists' },
  { category: 'Equity in your ventures', traditional: 'You keep it all (if it works)', empire: 'You keep it all (and it works)' },
  { category: 'Bandwidth', traditional: 'One thing at a time', empire: 'Up to 10 simultaneously' },
];

const faqs = [
  {
    q: 'What kind of businesses does Empire OS build?',
    a: 'Digital businesses with fast feedback loops: SaaS, content sites, e-commerce, agency models, info products, AI tools. We don\'t do heavy manufacturing, physical supply chains, or anything that requires a physical presence we can\'t manage remotely. If it runs on a laptop, we can run it.',
  },
  {
    q: 'Do I need to be involved day-to-day?',
    a: 'No. That\'s the point. You get a Monday morning brief and a Glass Box dashboard. We handle everything in between. You make the high-level calls — which opportunity to pursue, when to scale, when to exit. We execute.',
  },
  {
    q: 'What does "equity option" mean on Empire Full?',
    a: 'On the Empire Full tier, we can structure deals where Antigravity takes a small equity stake (typically 5–15%) in exchange for reduced monthly fees. This means our incentives are completely aligned — we win when you win. @Luna handles all legal documentation.',
  },
  {
    q: 'How is this different from hiring a VA or a dev team?',
    a: 'A VA or dev team executes tasks. Empire OS builds and operates entire business systems — from market research and brand identity to revenue operations and growth loops. It\'s the difference between hiring employees and hiring a CEO, CMO, CTO, and CFO simultaneously.',
  },
  {
    q: 'What\'s the minimum commitment?',
    a: 'Three months. Building something real takes time. If we miss agreed KPIs in Month 1, you don\'t pay Month 2. After Month 3, it\'s rolling monthly with 30-day notice.',
  },
  {
    q: 'How many spots are available?',
    a: 'Empire is intentionally limited. We take a maximum of 3 Starter clients, 2 Growth clients, and 1 Full Empire client per cohort. Applications are reviewed in order. Current cohort closes when full.',
  },
];

export default function EmpirePage() {
  return (
    <main>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <NeuralCanvas />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(217,119,87,0.16) 0%, transparent 60%)' }}
        />
        <motion.div
          className="absolute left-0 right-0 h-px pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(217,119,87,0.3), transparent)' }}
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24 pb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-citrus mb-10">
              <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />
              Empire OS — Founding Cohort Open
            </span>
          </motion.div>

          <motion.h1
            className="font-outfit font-extrabold text-5xl md:text-8xl leading-none tracking-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            We Build and<br />
            <span className="text-citrus">Run Your Business.</span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-white/45 mb-4 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            The World&apos;s First AI-Operated Business Portfolio Service.
          </motion.p>

          <motion.p
            className="text-sm text-white/30 mb-10 max-w-xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            You bring the idea. 67 specialist agents — orchestrated by Jonny — build it, launch it, and operate it.
            You own the business. We run the machine.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <a href="#apply" className="btn-citrus">Apply to Empire OS →</a>
            <a href="#how-it-works" className="btn-ghost">See How It Works ↓</a>
          </motion.div>

          <motion.div
            className="flex items-center justify-center gap-10 md:gap-16 mt-16 pt-10 border-t border-white/8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {[['67+', 'Agents Deployed'], ['< 30d', 'First Revenue'], ['80%+', 'Gross Margin']].map(([val, label]) => (
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

      {/* ── THE PROBLEM ──────────────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="section-label">The Opportunity</span>
            <h2 className="futuristic-title text-4xl md:text-5xl mt-4 leading-tight">
              You Have Ideas.<br />You Don&apos;t Have Time.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div {...fadeUp} className="glass-panel p-8" style={{ borderColor: 'rgba(239,68,68,0.15)' }}>
              <h3 className="text-red-400/80 font-mono uppercase tracking-widest text-xs mb-6">✕  The Graveyard</h3>
              <ul className="space-y-4">
                {[
                  'A business idea you\'ve been sitting on for 18 months',
                  'Not enough hours to build it yourself',
                  'Agencies want £50k+ to even start',
                  'Freelancers disappear after the first payment',
                  'Your main job requires your full attention',
                  'So the idea sits. And sits. And eventually dies.',
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
              <h3 className="text-signal font-mono uppercase tracking-widest text-xs mb-6 relative">✓  Empire OS</h3>
              <ul className="space-y-4 relative">
                {[
                  'You brief us. We design, build, and launch in 30 days',
                  '67 specialist agents working your portfolio simultaneously',
                  'Fixed monthly fee — no hidden costs, no equity trap',
                  'Glass Box dashboard — see every move in real-time',
                  'Your idea runs. You stay focused on what matters to you',
                  'First revenue within 30 days or Month 2 is free',
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

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="section-label">The Mechanism</span>
            <h2 className="futuristic-title text-4xl md:text-5xl mt-4 leading-tight">
              How Empire OS<br />Actually Works.
            </h2>
            <p className="text-white/35 mt-4 text-sm max-w-lg mx-auto">
              A repeatable operating rhythm. 67 agents. One shared brain. Running 24/7.
            </p>
          </motion.div>

          <div className="space-y-4">
            {mechanism.map((phase, i) => (
              <motion.div
                key={phase.week}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-6 md:p-8"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="shrink-0">
                    <span className="inline-block text-xs font-mono uppercase tracking-[0.2em] text-citrus border border-citrus/20 px-3 py-1.5 rounded-sm bg-citrus/5">
                      {phase.week}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-outfit font-bold text-xl text-white mb-2">{phase.title}</h3>
                    <p className="text-white/45 text-sm leading-relaxed mb-4">{phase.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {phase.agents.map(agent => (
                        <span key={agent} className="text-[10px] font-mono text-white/30 border border-white/8 px-2 py-1 rounded-sm bg-white/2">
                          {agent}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VS COMPARISON ────────────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="section-label">The Reality Check</span>
            <h2 className="futuristic-title text-4xl md:text-5xl mt-4 leading-tight">
              Empire OS vs<br />Everything Else.
            </h2>
          </motion.div>

          <motion.div {...fadeUp} className="glass-panel overflow-hidden">
            <div className="grid grid-cols-3 text-xs font-mono uppercase tracking-widest">
              <div className="px-5 py-3 text-white/25 border-b border-white/8">Category</div>
              <div className="px-5 py-3 text-red-400/50 border-b border-white/8 border-l border-white/8">Traditional</div>
              <div className="px-5 py-3 text-citrus border-b border-white/8 border-l border-white/8">Empire OS</div>
            </div>
            {comparisons.map((row, i) => (
              <div
                key={row.category}
                className={`grid grid-cols-3 text-sm ${i % 2 === 0 ? 'bg-white/1' : ''}`}
              >
                <div className="px-5 py-4 text-white/40 text-xs">{row.category}</div>
                <div className="px-5 py-4 text-white/30 text-xs border-l border-white/8">{row.traditional}</div>
                <div className="px-5 py-4 text-signal text-xs border-l border-white/8 font-medium">{row.empire}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────────── */}
      <section id="apply" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-6">
            <span className="section-label">Choose Your Empire</span>
            <h2 className="futuristic-title text-4xl md:text-5xl mt-4 leading-tight">
              Three Tiers.<br />One Operating System.
            </h2>
          </motion.div>

          <motion.div {...fadeUp} className="flex justify-center mb-12">
            <span className="inline-flex items-center gap-2 text-xs font-mono text-yellow-400/80 border border-yellow-400/20 bg-yellow-400/5 px-4 py-2 rounded-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
              Founding cohort pricing — limited spots per tier
            </span>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className={`glass-panel relative flex flex-col ${tier.highlight ? 'border-citrus/30' : ''}`}
              >
                {tier.highlight && (
                  <div className="absolute top-0 left-4 right-4 h-px bg-citrus" />
                )}
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-void bg-citrus px-3 py-1">
                      {tier.badge}
                    </span>
                  </div>
                )}

                <div className="p-6 pb-0">
                  <div className="text-xs font-mono uppercase tracking-[0.2em] text-citrus mb-1">{tier.name}</div>
                  <div className="text-white/35 text-xs mb-4">{tier.tagline}</div>
                  <div className="flex items-end gap-1 mb-6">
                    <span className="text-4xl font-outfit font-extrabold text-white">{tier.price}</span>
                    <span className="text-white/30 text-sm font-mono mb-1">{tier.period}</span>
                  </div>
                </div>

                <div className="px-6 flex-1">
                  <ul className="space-y-3">
                    {tier.includes.map(item => (
                      <li key={item} className="flex items-start gap-2.5 text-xs text-white/55 leading-relaxed">
                        <span className="text-signal mt-0.5 shrink-0 text-[10px]">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 pt-6">
                  <Link
                    href={`/brief?service=empire&tier=${tier.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className={tier.highlight ? 'btn-citrus w-full text-xs' : 'btn-ghost w-full text-xs'}
                  >
                    {tier.cta} →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp} className="mt-8 text-center">
            <p className="text-white/20 text-xs font-mono">
              3-month minimum · First revenue in 30 days or Month 2 is free · @luna service agreement provided
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── THE ORCHESTRA ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="section-label">The Machine</span>
            <h2 className="futuristic-title text-4xl md:text-5xl mt-4 leading-tight">
              38 Agents on Your<br />Empire. Day One.
            </h2>
            <p className="text-white/35 mt-4 text-sm max-w-lg mx-auto">
              Not generalist AI. Not ChatGPT. Specialist agents — each trained, tested, and deployed on specific domains.
            </p>
          </motion.div>

          <motion.div {...fadeUp} className="glass-panel overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {[
                { dept: 'Strategy', agents: ['@Marcus', '@Delegator', '@Quinn'], color: 'text-citrus' },
                { dept: 'Build', agents: ['@Sebastian', '@Diana', '@Priya', '@Sam', '@Derek'], color: 'text-signal' },
                { dept: 'Growth', agents: ['@Felix', '@Grace', '@Maya', '@Jasper', '@Rocket'], color: 'text-blue-400' },
                { dept: 'Operations', agents: ['@Hannah', '@Nathan', '@Finops', '@Chronos', '@Arthur'], color: 'text-purple-400' },
                { dept: 'Research', agents: ['@Scholar', '@Sophie', '@Dreamer', '@Hugo'], color: 'text-yellow-400' },
                { dept: 'Content', agents: ['@Elena', '@Blaise', '@Contentforge', '@Carlos'], color: 'text-pink-400' },
                { dept: 'Legal & Security', agents: ['@Luna', '@Victor', '@Sam'], color: 'text-red-400' },
                { dept: 'Quality', agents: ['@Vigil', '@Validator', '@Rowan'], color: 'text-orange-400' },
              ].map(dept => (
                <div key={dept.dept} className="p-5 border-r border-b border-white/8 last:border-r-0">
                  <div className={`text-[10px] font-mono uppercase tracking-widest mb-3 ${dept.color}`}>{dept.dept}</div>
                  <div className="space-y-1.5">
                    {dept.agents.map(agent => (
                      <div key={agent} className="text-xs text-white/35 font-mono">{agent}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="mt-6 text-center">
            <p className="text-white/15 text-xs font-mono">38 of 67 agents deployed per Empire client · Shared Brain: ONLINE · Jai.OS 4.0</p>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="section-label">Questions</span>
            <h2 className="futuristic-title text-4xl md:text-5xl mt-4 leading-tight">
              Straight Answers.
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ delay: i * 0.07 }}
                className="glass-panel p-6"
              >
                <h3 className="font-outfit font-bold text-sm text-white mb-3">{faq.q}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="py-32 px-6 border-t border-white/5 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(217,119,87,0.1) 0%, transparent 70%)' }}
        />
        <motion.div {...fadeUp} className="relative z-10 max-w-3xl mx-auto text-center">
          <span className="section-label block mb-6">Founding Cohort</span>
          <h2 className="font-outfit font-extrabold text-5xl md:text-7xl leading-none tracking-tight mb-6">
            Your Empire.<br />
            <span className="text-citrus">Our Machines.</span>
          </h2>
          <p className="text-white/35 mb-4 text-sm max-w-md mx-auto leading-relaxed">
            Apply now. Marcus scopes your portfolio in one call.
            If we&apos;re a fit, your empire is live in 30 days.
          </p>
          <p className="text-white/20 text-xs font-mono mb-10">
            Limited to 6 founding clients. 3 spots filled. 3 remaining.
          </p>
          <Link href="/brief?service=empire" className="btn-citrus text-base py-4 px-12">
            Apply to Empire OS Now →
          </Link>
          <p className="text-white/20 text-xs mt-5 font-mono uppercase tracking-widest">
            Free strategy call · No commitment · Results in 30 days
          </p>
        </motion.div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/8 px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">
            <div>
              <div className="font-outfit font-extrabold text-xl text-white mb-1">JonnyAi</div>
              <div className="text-xs text-white/25 font-mono uppercase tracking-widest">Empire OS · AI-Operated Business Portfolio Service</div>
              <div className="text-xs text-white/15 mt-2">Jonny Allum Innovations Ltd · United Kingdom</div>
            </div>
            <nav className="flex flex-wrap gap-x-8 gap-y-2 text-xs text-white/30">
              <Link href="/" className="hover:text-white/60 transition-colors">← Back to JonnyAI</Link>
              <Link href="/brief" className="hover:text-white/60 transition-colors">Brief Marcus</Link>
              <Link href="/blog" className="hover:text-white/60 transition-colors">Blog</Link>
              <a href="mailto:hello@jonnyai.co.uk" className="hover:text-white/60 transition-colors">hello@jonnyai.co.uk</a>
            </nav>
          </div>
          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="text-xs text-white/15 font-mono">Powered by Jai.OS 4.0 · 67 Agents · Shared Brain: ONLINE</div>
            <div className="text-xs text-white/15 font-mono">© 2026 Jonny Allum Innovations Ltd</div>
          </div>
        </div>
      </footer>
    </main>
  );
}
