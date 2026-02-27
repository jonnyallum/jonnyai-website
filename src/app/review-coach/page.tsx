'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
} as const;

const features = [
  {
    icon: '🔍',
    title: 'Bias & Consistency Check',
    desc: 'Scans your review for logical inconsistencies, unsubstantiated claims, and scoring misalignment between sections.',
  },
  {
    icon: '📐',
    title: 'Rubric Alignment',
    desc: 'Compares your feedback against the conference or journal\'s official review criteria — flags gaps before you submit.',
  },
  {
    icon: '✍️',
    title: 'Tone & Clarity Audit',
    desc: 'Ensures feedback is constructive, professional, and actionable. Flags language that could be interpreted as hostile.',
  },
  {
    icon: '📊',
    title: 'Confidence Scoring',
    desc: 'Rates each section of your review from 1–10 and highlights the weakest areas with specific improvement suggestions.',
  },
  {
    icon: '🧑‍🏫',
    title: 'Expert Benchmark',
    desc: 'Compares your review structure against 10,000+ anonymised published reviews from senior academics in your field.',
  },
  {
    icon: '🔒',
    title: 'Blind-Review Safe',
    desc: 'No paper content is stored. Your review is processed and discarded — full confidentiality for double-blind submissions.',
  },
];

const useCases = [
  { role: 'First-Time Reviewer', pain: 'Terrified of missing something critical or embarrassing yourself in front of authors', solution: 'Review Coach validates your work before you submit — catch the gaps before others do.' },
  { role: 'PhD Student Reviewer', pain: 'Unclear whether your depth of criticism is appropriate for your career stage', solution: 'Field-calibrated feedback tells you if you\'re being too soft, too harsh, or just right.' },
  { role: 'Senior Reviewer (High Volume)', pain: 'Rushing through paper 7 of 9 and aware your quality is slipping', solution: '30-second safety check catches the obvious oversights even when you\'re moving fast.' },
  { role: 'Journal Editor', pain: 'Reviewer reports arriving that are too short, vague, or inconsistent to be actionable', solution: 'B2B licensing embeds Review Coach into your reviewer portal — quality gates before submission.' },
];

const tiers = [
  {
    name: 'Solo Researcher',
    price: '$29',
    period: '/month',
    desc: 'For independent reviewers and PhD students',
    features: [
      'Unlimited review checks',
      'Bias & consistency analysis',
      'Rubric alignment (50+ major conferences)',
      'Tone & clarity audit',
      'Confidence scoring per section',
      'PDF export of feedback report',
    ],
    cta: 'Join Waitlist',
    featured: false,
  },
  {
    name: 'Pay-Per-Check',
    price: '$5',
    period: '/review',
    desc: 'No subscription — pay only when you need it',
    features: [
      'Single review safety check',
      'Full confidence score report',
      'Rubric alignment check',
      'Tone audit',
      'No commitment required',
    ],
    cta: 'Join Waitlist',
    featured: false,
  },
  {
    name: 'Journal / Programme Committee',
    price: '$2,000',
    period: '/month',
    desc: 'Embedded quality gates for editorial teams',
    features: [
      'White-label reviewer portal integration',
      'API access for CMS/submission systems',
      'Custom rubric configuration',
      'Reviewer quality dashboards',
      'Anonymous aggregate reporting',
      'Dedicated support channel',
    ],
    cta: 'Book a Demo',
    featured: true,
  },
];

export default function ReviewCoachPage() {
  return (
    <main className="min-h-screen bg-void text-white">

      {/* ── NAV ────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-void/90 backdrop-blur-xl border-b border-white/8 px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-sm font-mono text-white/40 hover:text-citrus transition-colors">← JonnyAI</Link>
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-citrus border border-citrus/30 px-2 py-0.5 rounded-sm">Early Access</span>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(217,119,87,0.1) 0%, transparent 65%)' }} />
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-citrus mb-8">
              <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />
              Antigravity Ventures — AI Product
            </span>
          </motion.div>

          <motion.h1 className="font-outfit font-extrabold text-5xl md:text-7xl leading-tight mb-6"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            Submit Your Review<br /><span className="text-citrus">With Confidence.</span>
          </motion.h1>

          <motion.p className="text-xl text-white/50 max-w-2xl mx-auto mb-4"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            Review Coach is an AI-powered validation layer for academic peer reviewers. Before you hit submit,
            we check your review for bias, rubric gaps, inconsistencies, and tone — so you can review with authority,
            not anxiety.
          </motion.p>

          <motion.p className="text-sm text-white/30 max-w-xl mx-auto mb-10"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}>
            Built for NeurIPS, ICML, ICLR, ACL, CVPR reviewers and beyond. Blind-review compliant. Your paper content is never stored.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}>
            <Link href="/brief?product=review-coach" className="btn-citrus">Join the Waitlist</Link>
            <a href="#how-it-works" className="btn-ghost">See How It Works</a>
          </motion.div>

          <motion.div className="flex flex-wrap justify-center gap-6 mt-10 text-xs font-mono text-white/25"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}>
            <span>✓ No paper content stored</span>
            <span>✓ Double-blind compliant</span>
            <span>✓ 50+ conference rubrics</span>
            <span>✓ Results in under 60s</span>
          </motion.div>
        </div>
      </section>

      {/* ── PROBLEM ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-14">
            <div className="section-label mb-4">The problem</div>
            <h2 className="font-outfit font-extrabold text-4xl md:text-5xl">
              First-time reviewer?<br /><span className="text-citrus">You&apos;re not alone in that panic.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {useCases.map(u => (
              <motion.div key={u.role} {...fadeUp} className="glass-card">
                <div className="text-citrus font-mono text-xs uppercase tracking-widest mb-2">{u.role}</div>
                <div className="text-white/40 text-sm mb-3 italic">&ldquo;{u.pain}&rdquo;</div>
                <div className="text-white/70 text-sm leading-relaxed border-t border-white/8 pt-3">
                  <span className="text-signal mr-2">→</span>{u.solution}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-14">
            <div className="section-label mb-4">How it works</div>
            <h2 className="font-outfit font-extrabold text-4xl">Three steps. Under 60 seconds.</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Paste Your Review', desc: 'Copy your review text into Review Coach. No login required for a quick check. Your paper PDF is never needed — just your review.' },
              { step: '02', title: 'Select Your Venue', desc: 'Choose the conference or journal you\'re reviewing for. We load their specific criteria — or use our general academic rubric.' },
              { step: '03', title: 'Get Your Report', desc: 'In under 60 seconds, receive a confidence score, bias flags, rubric gaps, and specific suggestions for each section. Export as PDF.' },
            ].map(s => (
              <motion.div key={s.step} {...fadeUp} className="glass-card text-center">
                <div className="font-outfit font-extrabold text-5xl text-citrus/20 mb-4">{s.step}</div>
                <div className="text-white font-semibold mb-2">{s.title}</div>
                <div className="text-white/40 text-sm leading-relaxed">{s.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-14">
            <div className="section-label mb-4">What we check</div>
            <h2 className="font-outfit font-extrabold text-4xl">Six-gate validation before you submit.</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(f => (
              <motion.div key={f.title} {...fadeUp} className="glass-card">
                <div className="text-3xl mb-3">{f.icon}</div>
                <div className="text-white font-medium mb-2">{f.title}</div>
                <div className="text-white/40 text-sm leading-relaxed">{f.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-14">
            <div className="section-label mb-4">Pricing</div>
            <h2 className="font-outfit font-extrabold text-4xl">Fair pricing. No catch.</h2>
            <p className="text-white/40 mt-3">Early access is free — join the waitlist and lock in founding rates.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map(t => (
              <motion.div key={t.name} {...fadeUp}
                className={`glass-card relative flex flex-col ${t.featured ? 'border-citrus/30' : ''}`}>
                {t.featured && (
                  <>
                    <div className="absolute top-0 left-4 right-4 h-px bg-citrus" />
                    <div className="absolute -top-3 left-0 right-0 flex justify-center">
                      <span className="bg-citrus text-void text-[9px] font-mono uppercase tracking-widest px-3 py-0.5">Most Requested</span>
                    </div>
                  </>
                )}
                <div className="text-white font-semibold mb-1">{t.name}</div>
                <div className="text-white/40 text-xs mb-4">{t.desc}</div>
                <div className="mb-5">
                  <span className="font-outfit font-extrabold text-4xl text-citrus">{t.price}</span>
                  <span className="text-white/30 text-sm ml-1">{t.period}</span>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {t.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs text-white/50">
                      <span className="text-signal mt-0.5 shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/brief?product=review-coach"
                  className={t.featured ? 'btn-citrus text-center text-sm py-2.5' : 'btn-ghost text-center text-sm py-2.5'}>
                  {t.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <div className="section-label mb-4">Get early access</div>
            <h2 className="font-outfit font-extrabold text-4xl md:text-5xl mb-4">
              Stop second-guessing.<br /><span className="text-citrus">Start reviewing with authority.</span>
            </h2>
            <p className="text-white/40 mb-8">Join 200+ researchers on the early access waitlist. Founding pricing locked in for life.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/brief?product=review-coach" className="btn-citrus">Join Waitlist — It&apos;s Free</Link>
              <Link href="/" className="btn-ghost">Back to JonnyAI</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/8 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-white/20 font-mono">Review Coach — An Antigravity Venture · Est. 2026</div>
          <div className="flex gap-6">
            <Link href="/brief" className="text-xs text-white/30 hover:text-citrus transition-colors">Contact</Link>
            <Link href="/" className="text-xs text-white/30 hover:text-citrus transition-colors">JonnyAI</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
