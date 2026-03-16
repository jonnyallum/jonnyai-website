'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
} as const;

const tiers = [
  {
    name: 'Starter Install',
    price: '£997',
    period: 'one-time',
    retainer: '+ £149/mo support',
    highlight: false,
    includes: [
      'Discovery call — map your workflows and pain points',
      'Private AI system configured for your business',
      'Up to 3 automated workflows built and tested',
      'Remote installation via secure screen share',
      'Full team walkthrough and training session',
      '30-day post-install support included',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Business Install',
    price: '£1,997',
    period: 'one-time',
    retainer: '+ £299/mo support',
    highlight: true,
    badge: 'Most Popular',
    includes: [
      'Everything in Starter',
      'Up to 8 automated workflows',
      'Custom AI trained on your documents, SOPs, and data',
      'CRM, email, and calendar integrations',
      'Staff training for up to 10 team members',
      '90-day priority support with direct Jonny access',
    ],
    cta: 'Apply Now',
  },
  {
    name: 'Enterprise Install',
    price: 'Custom',
    period: '',
    retainer: 'Monthly retainer included',
    highlight: false,
    includes: [
      'Everything in Business',
      'Unlimited workflow automation',
      'On-site installation available',
      'Multi-department rollout with dedicated project management',
      'Custom integrations with your existing software stack',
      'Dedicated monthly performance review',
    ],
    cta: 'Book a Call',
  },
];

const before = [
  'Manually copying data between spreadsheets',
  'Chasing invoices and purchase orders by hand',
  'Staff answering the same customer questions 20× a day',
  'Hours spent on admin that adds zero value',
  'No visibility into what\'s happening in the business',
];

const after = [
  'Data flows automatically — no human in the loop',
  'Invoices generated and sent the moment a job closes',
  'AI handles first-line customer queries 24/7',
  'Your team focuses on actual skilled work',
  'Real-time dashboard showing the health of your business',
];

const steps = [
  {
    n: '01',
    title: 'Brief & Discovery',
    body: 'You fill in our brief form — takes 10 minutes. We map your current workflows, identify the highest-impact automation targets, and send you a clear scope within 48 hours.',
  },
  {
    n: '02',
    title: 'Build & Configure',
    body: 'We build your AI system in a staging environment. Every automation is tested against real scenarios before it touches your live business. You review and sign off.',
  },
  {
    n: '03',
    title: 'Install & Train',
    body: 'We connect to your systems via secure screen share (or on-site for enterprise). Installation takes one day. Training follows the same week. Then it runs — with you in full control.',
  },
];

export default function InstallPage() {
  return (
    <main className="min-h-screen bg-void text-white overflow-x-hidden">

      {/* ── HERO ── */}
      <section
        className="relative min-h-[90vh] flex items-center justify-center text-center px-6 pt-24 pb-16 overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(217,119,87,0.12) 0%, transparent 60%)' }}
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
          <p className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: '#D97757', fontFamily: 'monospace' }}>Private AI Install</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Your AI.<br />
            Your Hardware.<br />
            <span style={{ color: '#D97757' }}>Your Control.</span>
          </h1>
          <p className="text-base md:text-lg max-w-2xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            We install a private AI system inside your business — configured for your workflows, trained on your data, running on your hardware. Not a SaaS subscription. Not a chatbot plugin. Yours, permanently, from day one.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            <Link href="/brief" className="btn-citrus py-3 px-8 text-sm">Brief Us Now →</Link>
            <a href="#how-it-works" className="py-3 px-8 text-sm font-bold rounded-md transition-all duration-200"
              style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)' }}>
              See How It Works ↓
            </a>
          </div>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>From £997 · Live in your business within a week</p>
        </motion.div>
      </section>

      {/* ── BEFORE / AFTER ── */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <motion.div {...fadeUp} className="text-center mb-14">
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: '#D97757', fontFamily: 'monospace' }}>The Difference</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>What your business looks like before and after.</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <motion.div {...fadeUp} className="p-7 rounded-xl" style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.1)' }}>
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-5" style={{ color: 'rgba(239,68,68,0.6)', fontFamily: 'monospace' }}>✕ Before</p>
            <ul className="space-y-3">
              {before.map(item => (
                <li key={item} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  <span style={{ color: 'rgba(239,68,68,0.5)' }} className="shrink-0 mt-0.5">✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="p-7 rounded-xl" style={{ background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.15)' }}>
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-5" style={{ color: '#22C55E', fontFamily: 'monospace' }}>✓ After Install</p>
            <ul className="space-y-3">
              {after.map(item => (
                <li key={item} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  <span style={{ color: '#22C55E' }} className="shrink-0 mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="max-w-4xl mx-auto px-6 py-20 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <motion.div {...fadeUp} className="text-center mb-14">
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: '#D97757', fontFamily: 'monospace' }}>The Process</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>Brief to live in days, not months.</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map(({ n, title, body }, i) => (
            <motion.div key={n} {...fadeUp} transition={{ delay: i * 0.1 }}>
              <div className="text-5xl font-extrabold mb-4 leading-none" style={{ color: 'rgba(217,119,87,0.15)', fontFamily: 'Outfit, sans-serif' }}>{n}</div>
              <h3 className="text-lg font-bold mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="max-w-6xl mx-auto px-6 py-24 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <motion.div {...fadeUp} className="text-center mb-14">
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: '#D97757', fontFamily: 'monospace' }}>Pricing</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>Fixed price. No surprises.</h2>
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
              <div className="p-7 flex-1 flex flex-col gap-5">
                <div>
                  <p className="text-xs font-bold tracking-[0.2em] uppercase mb-1" style={{ color: '#D97757', fontFamily: 'monospace' }}>{tier.name}</p>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-extrabold" style={{ fontFamily: 'Outfit, sans-serif' }}>{tier.price}</span>
                    {tier.period && <span className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{tier.period}</span>}
                  </div>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{tier.retainer}</p>
                </div>
                <ul className="space-y-3 flex-1">
                  {tier.includes.map(item => (
                    <li key={item} className="flex items-start gap-2.5 text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      <span style={{ color: '#22C55E' }} className="shrink-0 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/brief?service=install&tier=${tier.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className={tier.highlight ? 'btn-citrus text-center text-sm py-3' : 'text-center text-sm py-3 rounded-md font-bold transition-all duration-200'}
                  style={!tier.highlight ? { border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)' } : {}}
                >
                  {tier.cta} →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-3xl mx-auto px-6 py-32 text-center border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <motion.div {...fadeUp} className="flex flex-col items-center gap-6">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Ready to install intelligence<br />into your business?
          </h2>
          <p className="text-base max-w-xl" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Fill in the brief form — 10 minutes, no sales call. We'll scope your system and send you a fixed-price proposal within 48 hours.
          </p>
          <Link href="/brief?service=install" className="btn-citrus py-4 px-10 text-sm mt-2">
            Start Your Brief →
          </Link>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>No commitment · Fixed price · Live within a week</p>
        </motion.div>
      </section>

    </main>
  );
}
