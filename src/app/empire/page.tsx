'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

function GradientCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = Date.now() / 8000;
      const grd = ctx.createRadialGradient(
        canvas.width * (0.5 + 0.1 * Math.sin(t)), canvas.height * (0.4 + 0.08 * Math.cos(t * 0.7)), 0,
        canvas.width * 0.5, canvas.height * 0.5, Math.max(canvas.width, canvas.height) * 0.7
      );
      grd.addColorStop(0, 'rgba(217,119,87,0.12)');
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />;
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
      'One business built and operated by our team',
      'Full-stack build: site, brand, automations',
      'Weekly progress reports and performance data',
      'Monthly strategy call with Jonny',
      'Fixed fee — no equity taken',
      '3-month minimum · 30-day notice after',
    ],
    cta: 'Apply for Starter',
  },
  {
    name: 'Empire Growth',
    tagline: 'Three businesses. Compounding velocity.',
    price: '£4,997',
    period: '/month',
    highlight: true,
    badge: 'Most Popular',
    includes: [
      'Three businesses built and operated simultaneously',
      'Priority queue — faster builds, faster pivots',
      'Cross-portfolio intelligence (spot synergies across businesses)',
      'Dedicated project oversight and weekly briefs',
      'Monthly equity review option available',
      '3-month minimum · 30-day notice after',
    ],
    cta: 'Apply for Growth',
  },
  {
    name: 'Empire Full',
    tagline: 'Up to ten businesses. Partner-level.',
    price: '£19,997',
    period: '/month',
    highlight: false,
    includes: [
      'Up to 10 businesses — we run the portfolio',
      'Equity positions available (we earn with you)',
      'Dedicated empire dashboard — full intelligence layer',
      'Quarterly in-person strategy day',
      'First-access to new capabilities as they launch',
      'Bespoke SLA — you set the KPIs',
    ],
    cta: 'Apply for Full Empire',
  },
];

const mechanism = [
  {
    week: 'Week 1',
    title: 'Intelligence & Architecture',
    desc: 'We run market research and map the full business architecture — product, brand, revenue model, and competitive positioning. You review and sign off the blueprint.',
  },
  {
    week: 'Month 1',
    title: 'Build & Launch',
    desc: 'Your business goes live. Website, brand, automation stack, and first revenue channel operational. SEO foundations laid from day one.',
  },
  {
    week: 'Monthly',
    title: 'Operate & Optimise',
    desc: 'The system runs 24/7. Outreach, content, support, and analytics managed. You receive a weekly brief and real-time performance data.',
  },
];

const comparisons = [
  { category: 'Speed to first revenue', traditional: '3–6 months', empire: '< 30 days' },
  { category: 'Cost of 3 business builds', traditional: '£150,000+', empire: '£4,997/mo' },
  { category: 'Visibility', traditional: 'Monthly reports (if lucky)', empire: 'Real-time performance data' },
  { category: 'Who runs the business', traditional: 'You + expensive hires', empire: 'JonnyAI team' },
  { category: 'Equity in your ventures', traditional: 'You keep it (if it works)', empire: 'You keep it (and it works)' },
  { category: 'Bandwidth', traditional: 'One thing at a time', empire: 'Up to 10 simultaneously' },
];

const faqs = [
  {
    q: 'What kind of businesses does Empire OS build?',
    a: 'Digital businesses with fast feedback loops: SaaS, content sites, e-commerce, agency models, info products, AI tools. We don\'t do heavy manufacturing or businesses that require a physical presence we can\'t manage remotely. If it runs on a laptop, we can run it.',
  },
  {
    q: 'Do I need to be involved day-to-day?',
    a: 'No. You get a weekly brief and real-time access to performance data. We handle everything in between. You make the high-level calls — which opportunity to pursue, when to scale, when to exit.',
  },
  {
    q: 'What does "equity option" mean on Empire Full?',
    a: 'On Empire Full, we can structure deals where JonnyAI takes a small equity stake (typically 5–15%) in exchange for reduced monthly fees. This means our incentives are completely aligned — we win when you win.',
  },
  {
    q: 'How is this different from hiring a VA or an agency?',
    a: 'A VA or agency executes tasks. Empire OS builds and operates entire business systems — market research, brand, revenue operations, and growth loops. It\'s the difference between hiring a freelancer and running a fully-staffed operation.',
  },
  {
    q: 'What\'s the minimum commitment?',
    a: 'Three months. Building something real takes time. If we miss agreed KPIs in Month 1, you don\'t pay Month 2. After Month 3, it\'s rolling monthly with 30-day notice.',
  },
  {
    q: 'How many spots are available?',
    a: 'Empire is intentionally limited. We take a maximum of 3 Starter clients, 2 Growth clients, and 1 Full Empire client per cohort. Applications are reviewed in order.',
  },
];

export default function EmpirePage() {
  return (
    <main className="min-h-screen bg-void text-white overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <GradientCanvas />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24 pb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.3em] uppercase mb-10" style={{ color: '#D97757', fontFamily: 'monospace' }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#22C55E' }} />
              Empire OS — Founding Cohort Open
            </span>
          </motion.div>

          <motion.h1
            className="font-extrabold text-5xl md:text-8xl leading-none tracking-tight mb-6"
            style={{ fontFamily: 'Outfit, sans-serif' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            We Build and<br />
            <span style={{ color: '#D97757' }}>Run Your Business.</span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl mb-4 max-w-2xl mx-auto"
            style={{ color: 'rgba(255,255,255,0.45)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            The AI-Operated Business Portfolio Service.
          </motion.p>

          <motion.p
            className="text-sm mb-10 max-w-xl mx-auto leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.3)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            You bring the idea. We design it, launch it, and operate it. You own the business. We run the machine.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <a href="#apply" className="btn-citrus">Apply to Empire OS →</a>
            <a
              href="#how-it-works"
              className="py-3 px-8 text-sm font-bold rounded-md transition-all duration-200"
              style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)' }}
            >
              See How It Works ↓
            </a>
          </motion.div>

          <motion.div
            className="flex items-center justify-center gap-10 md:gap-16 mt-16 pt-10 border-t"
            style={{ borderColor: 'rgba(255,255,255,0.08)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {[['< 30d', 'First Revenue'], ['80%+', 'Gross Margin'], ['3-month', 'Minimum']].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="text-3xl md:text-4xl font-extrabold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>{val}</div>
                <div className="text-xs uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── THE PROBLEM ── */}
      <section className="py-24 px-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: '#D97757', fontFamily: 'monospace' }}>The Opportunity</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              You Have Ideas.<br />You Don&apos;t Have Time.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div {...fadeUp} className="p-8 rounded-xl" style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.1)' }}>
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-6" style={{ color: 'rgba(239,68,68,0.6)', fontFamily: 'monospace' }}>✕ Without Empire OS</h3>
              <ul className="space-y-4">
                {[
                  'A business idea you\'ve been sitting on for 18 months',
                  'Not enough hours to build it yourself',
                  'Agencies want £50k+ to even start',
                  'Freelancers disappear after the first payment',
                  'Your main business needs your full attention',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    <span style={{ color: 'rgba(239,68,68,0.5)' }} className="shrink-0 mt-0.5">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-xl relative overflow-hidden"
              style={{ background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.15)' }}
            >
              <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.06) 0%, transparent 70%)' }} />
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-6 relative" style={{ color: '#22C55E', fontFamily: 'monospace' }}>✓ With Empire OS</h3>
              <ul className="space-y-4 relative">
                {[
                  'Brief us. We design, build, and launch in 30 days',
                  'Full team working your portfolio simultaneously',
                  'Fixed monthly fee — no hidden costs, no equity trap',
                  'Real-time performance data — see every move',
                  'First revenue within 30 days or Month 2 is free',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    <span style={{ color: '#22C55E' }} className="shrink-0 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: '#D97757', fontFamily: 'monospace' }}>The Mechanism</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              How Empire OS<br />Actually Works.
            </h2>
            <p className="text-sm max-w-lg mx-auto mt-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
              A repeatable operating rhythm. Running 24/7.
            </p>
          </motion.div>

          <div className="space-y-4">
            {mechanism.map((phase, i) => (
              <motion.div
                key={phase.week}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className="p-6 md:p-8 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="shrink-0">
                    <span
                      className="inline-block text-xs font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded"
                      style={{ color: '#D97757', border: '1px solid rgba(217,119,87,0.2)', background: 'rgba(217,119,87,0.05)', fontFamily: 'monospace' }}
                    >
                      {phase.week}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>{phase.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{phase.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VS COMPARISON ── */}
      <section className="py-24 px-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: '#D97757', fontFamily: 'monospace' }}>Reality Check</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Empire OS vs<br />Everything Else.
            </h2>
          </motion.div>

          <motion.div {...fadeUp} className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="grid grid-cols-3 text-xs font-bold tracking-[0.15em] uppercase" style={{ fontFamily: 'monospace' }}>
              <div className="px-5 py-3 border-b" style={{ color: 'rgba(255,255,255,0.25)', borderColor: 'rgba(255,255,255,0.08)' }}>Category</div>
              <div className="px-5 py-3 border-b border-l" style={{ color: 'rgba(239,68,68,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>Traditional</div>
              <div className="px-5 py-3 border-b border-l" style={{ color: '#D97757', borderColor: 'rgba(255,255,255,0.08)' }}>Empire OS</div>
            </div>
            {comparisons.map((row, i) => (
              <div key={row.category} className="grid grid-cols-3 text-sm" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                <div className="px-5 py-4 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{row.category}</div>
                <div className="px-5 py-4 text-xs border-l" style={{ color: 'rgba(255,255,255,0.3)', borderColor: 'rgba(255,255,255,0.08)' }}>{row.traditional}</div>
                <div className="px-5 py-4 text-xs border-l font-medium" style={{ color: '#22C55E', borderColor: 'rgba(255,255,255,0.08)' }}>{row.empire}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="apply" className="py-24 px-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-6">
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: '#D97757', fontFamily: 'monospace' }}>Choose Your Empire</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Three Tiers.<br />One Operating System.
            </h2>
          </motion.div>

          <motion.div {...fadeUp} className="flex justify-center mb-12">
            <span
              className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded"
              style={{ color: 'rgba(250,204,21,0.8)', border: '1px solid rgba(250,204,21,0.2)', background: 'rgba(250,204,21,0.05)', fontFamily: 'monospace' }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'rgba(250,204,21,0.8)' }} />
              Founding cohort pricing — limited spots per tier
            </span>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className="relative flex flex-col rounded-xl overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: tier.highlight ? '1px solid rgba(217,119,87,0.35)' : '1px solid rgba(255,255,255,0.07)',
                }}
              >
                {tier.highlight && <div className="h-px w-full" style={{ background: '#D97757' }} />}
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1" style={{ background: '#D97757', color: '#070708' }}>
                      {tier.badge}
                    </span>
                  </div>
                )}

                <div className="p-6 pb-0">
                  <div className="text-xs font-bold tracking-[0.2em] uppercase mb-1" style={{ color: '#D97757', fontFamily: 'monospace' }}>{tier.name}</div>
                  <div className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>{tier.tagline}</div>
                  <div className="flex items-end gap-1 mb-6">
                    <span className="text-4xl font-extrabold" style={{ fontFamily: 'Outfit, sans-serif' }}>{tier.price}</span>
                    <span className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>{tier.period}</span>
                  </div>
                </div>

                <div className="px-6 flex-1">
                  <ul className="space-y-3">
                    {tier.includes.map(item => (
                      <li key={item} className="flex items-start gap-2.5 text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                        <span style={{ color: '#22C55E' }} className="shrink-0 mt-0.5">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6">
                  <Link
                    href={`/brief?service=empire&tier=${tier.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className={tier.highlight ? 'btn-citrus w-full text-center text-xs py-3 block' : 'w-full text-center text-xs py-3 block rounded-md font-bold transition-all duration-200'}
                    style={!tier.highlight ? { border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)' } : {}}
                  >
                    {tier.cta} →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp} className="mt-8 text-center">
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>
              3-month minimum · First revenue in 30 days or Month 2 is free · Service agreement provided
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: '#D97757', fontFamily: 'monospace' }}>Questions</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>Straight Answers.</h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ delay: i * 0.07 }}
                className="p-6 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <h3 className="font-bold text-sm mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>{faq.q}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-32 px-6 border-t relative overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(217,119,87,0.1) 0%, transparent 70%)' }} />
        <motion.div {...fadeUp} className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-6" style={{ color: '#D97757', fontFamily: 'monospace' }}>Founding Cohort</p>
          <h2 className="text-5xl md:text-7xl font-extrabold leading-none tracking-tight mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Your Empire.<br />
            <span style={{ color: '#D97757' }}>Our Machine.</span>
          </h2>
          <p className="text-sm mb-4 max-w-md mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Apply now. We scope your portfolio within 48 hours. If we&apos;re a fit, your business is live in 30 days.
          </p>
          <p className="text-xs font-bold mb-10" style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>
            Limited to 6 founding clients. 3 spots filled. 3 remaining.
          </p>
          <Link href="/brief?service=empire" className="btn-citrus text-base py-4 px-12">
            Apply to Empire OS Now →
          </Link>
          <p className="text-xs mt-5 font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>
            Free scope · No commitment · Results in 30 days
          </p>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t px-6 py-12" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-xl font-extrabold" style={{ fontFamily: 'Outfit, sans-serif' }}>JonnyAI</div>
            <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.2)' }}>Empire OS · AI-Operated Business Portfolio</div>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-2 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <Link href="/" className="hover:text-white transition-colors">← Back to JonnyAI</Link>
            <Link href="/brief" className="hover:text-white transition-colors">Get Started</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <a href="mailto:hello@jonnyai.co.uk" className="hover:text-white transition-colors">hello@jonnyai.co.uk</a>
          </nav>
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.15)', fontFamily: 'monospace' }}>© 2026 JonnyAI</div>
        </div>
      </footer>
    </main>
  );
}
