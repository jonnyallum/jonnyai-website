'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
} as const;

const roles = [
  {
    name: 'AI SDR',
    subtitle: 'Sales Development Representative',
    price: '£1,000/mo',
    desc: 'Researches prospects, writes personalised outreach, sends emails and LinkedIn messages, follows up, and books qualified calls into your calendar. Works every day, never takes a lunch break.',
    handles: ['Prospect research', 'Personalised outreach', 'Follow-up sequences', 'Calendar booking', 'CRM updates'],
  },
  {
    name: 'AI Support Agent',
    subtitle: 'Customer Support',
    price: '£1,000/mo',
    desc: 'Reads and classifies incoming support queries. Answers known questions instantly. Escalates edge cases to your team. Logs everything. Your customers get faster responses — around the clock.',
    handles: ['Ticket classification', 'Instant first-line responses', 'FAQ handling', 'Escalation routing', 'Support logging'],
  },
];

export default function WorkforcePage() {
  return (
    <main className="min-h-screen bg-void text-white overflow-x-hidden">

      {/* ── HERO ── */}
      <section
        className="relative min-h-[80vh] flex items-center justify-center text-center px-6 pt-24 pb-16 overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(217,119,87,0.1) 0%, transparent 60%)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-6"
        >
          <p className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: '#D97757', fontFamily: 'monospace' }}>AI Workforce</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none" style={{ fontFamily: 'Outfit, sans-serif' }}>
            A dedicated AI agent,<br />
            <span style={{ color: '#D97757' }}>trained on your business.</span>
          </h1>
          <p className="text-base md:text-lg max-w-2xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Not a generic chatbot. An AI agent configured for your specific workflows — with knowledge of your products, your customers, and your processes. It runs 24/7 and never calls in sick.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            <Link href="/brief?service=workforce" className="btn-citrus py-3 px-8 text-sm">Deploy Your Agent →</Link>
          </div>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>£1,000/mo per agent · Live within 2 weeks · Rolling monthly</p>
        </motion.div>
      </section>

      {/* ── ROLES ── */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <motion.div {...fadeUp} className="text-center mb-14">
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: '#D97757', fontFamily: 'monospace' }}>Available Roles</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>Choose your first agent. Add more when ready.</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map(({ name, subtitle, price, desc, handles }, i) => (
            <motion.div
              key={name}
              {...fadeUp}
              transition={{ delay: i * 0.1 }}
              className="p-7 rounded-xl flex flex-col gap-5"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h3 className="text-xl font-extrabold" style={{ fontFamily: 'Outfit, sans-serif' }}>{name}</h3>
                  <span className="text-lg font-extrabold shrink-0" style={{ color: '#D97757', fontFamily: 'Outfit, sans-serif' }}>{price}</span>
                </div>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>{subtitle}</p>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{desc}</p>
              <div>
                <p className="text-xs font-bold tracking-[0.15em] uppercase mb-3" style={{ color: '#D97757', fontFamily: 'monospace' }}>Handles</p>
                <ul className="space-y-2">
                  {handles.map(h => (
                    <li key={h} className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      <span style={{ color: '#22C55E' }}>✓</span> {h}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href={`/brief?service=workforce&role=${name.toLowerCase().replace(/\s+/g, '-')}`}
                className="btn-citrus text-center text-sm py-3 mt-auto"
              >
                Deploy This Agent →
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW ── */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <motion.div {...fadeUp} className="text-center mb-14">
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: '#D97757', fontFamily: 'monospace' }}>How It Works</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>We train it. You deploy it.</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { n: '01', title: 'Train on Your Business', body: 'We feed the agent your products, FAQs, SOPs, tone of voice, and past conversations. It learns how you operate.' },
            { n: '02', title: 'Connect to Your Tools', body: 'We hook it into your email, CRM, helpdesk, or calendar — wherever the work happens. No manual copy-paste.' },
            { n: '03', title: 'Go Live & Iterate', body: 'Agent goes live. We monitor the first two weeks, refine based on real conversations, and hand you the reins.' },
          ].map(({ n, title, body }, i) => (
            <motion.div key={n} {...fadeUp} transition={{ delay: i * 0.1 }}>
              <div className="text-5xl font-extrabold mb-4 leading-none" style={{ color: 'rgba(217,119,87,0.15)', fontFamily: 'Outfit, sans-serif' }}>{n}</div>
              <h3 className="text-lg font-bold mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-3xl mx-auto px-6 py-32 text-center border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <motion.div {...fadeUp} className="flex flex-col items-center gap-6">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Your first AI team member<br />
            <span style={{ color: '#D97757' }}>doesn't need a desk.</span>
          </h2>
          <p className="text-base max-w-xl" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Brief us on your use case. We'll scope the agent, build it, train it on your business, and have it live within two weeks.
          </p>
          <Link href="/brief?service=workforce" className="btn-citrus py-4 px-10 text-sm mt-2">
            Brief Us Now →
          </Link>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>£1,000/mo · Rolling monthly · Cancel with 30 days notice</p>
        </motion.div>
      </section>

    </main>
  );
}
