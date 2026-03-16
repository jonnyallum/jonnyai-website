'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
} as const;

const packs = [
  {
    name: 'Order & Fulfilment Pack',
    price: '£497',
    desc: 'Automate order intake, stock updates, supplier notifications, and customer confirmations. Works with Shopify, WooCommerce, eBay, and custom platforms.',
    use: 'E-commerce, wholesale, distributors',
  },
  {
    name: 'Lead & CRM Pack',
    price: '£397',
    desc: 'Capture leads from website, social, and ads → qualify → route to CRM → trigger follow-up sequences. No more leads falling through the cracks.',
    use: 'Agencies, consultants, service businesses',
  },
  {
    name: 'Invoicing & Finance Pack',
    price: '£397',
    desc: 'Auto-generate invoices when jobs complete, chase overdue payments, reconcile with accounting software, and alert you to anomalies.',
    use: 'Contractors, tradespeople, service businesses',
  },
  {
    name: 'Estimate & Quote Pack',
    price: '£297',
    desc: 'Receive a job enquiry → AI reads the brief → generates a structured estimate in your format → sends for review → one-click approval to send.',
    use: 'Construction, facilities management, trades',
  },
  {
    name: 'Support & Helpdesk Pack',
    price: '£497',
    desc: 'AI reads incoming emails and tickets → classifies → answers known queries → escalates complex issues → logs everything. First-line support, automated.',
    use: 'Any business with high email/support volume',
  },
  {
    name: 'Reporting & Dashboard Pack',
    price: '£297',
    desc: 'Pull data from your key sources → clean it → push to a dashboard → send a weekly summary to your inbox. Know your numbers without opening ten tabs.',
    use: 'Business owners who hate building reports',
  },
];

export default function AutomatePage() {
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
          <p className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: '#D97757', fontFamily: 'monospace' }}>Automation Packs</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Stop doing things<br />
            <span style={{ color: '#D97757' }}>a machine can do.</span>
          </h1>
          <p className="text-base md:text-lg max-w-2xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            We build n8n automation workflows that connect your tools, process your data, and eliminate the repetitive work that's quietly costing you hours every week.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            <Link href="/brief?service=automate" className="btn-citrus py-3 px-8 text-sm">Get a Free Scope →</Link>
          </div>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>From £297 per pack · Delivered in 2–5 days · No lock-in</p>
        </motion.div>
      </section>

      {/* ── PACKS ── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <motion.div {...fadeUp} className="text-center mb-14">
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: '#D97757', fontFamily: 'monospace' }}>What We Build</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>Pre-scoped automation packs. Live in days.</h2>
          <p className="text-sm mt-3 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Each pack is a complete automation workflow, built and tested in your environment. Don't see your use case? We scope custom.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {packs.map(({ name, price, desc, use }, i) => (
            <motion.div
              key={name}
              {...fadeUp}
              transition={{ delay: i * 0.07 }}
              className="p-6 rounded-xl flex flex-col gap-4"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-bold leading-snug" style={{ fontFamily: 'Outfit, sans-serif' }}>{name}</h3>
                <span className="text-lg font-extrabold shrink-0" style={{ color: '#D97757', fontFamily: 'Outfit, sans-serif' }}>{price}</span>
              </div>
              <p className="text-sm leading-relaxed flex-1" style={{ color: 'rgba(255,255,255,0.45)' }}>{desc}</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace' }}>Best for: {use}</p>
              <Link
                href={`/brief?service=automate&pack=${encodeURIComponent(name)}`}
                className="text-xs font-bold mt-1 transition-colors duration-200"
                style={{ color: '#D97757' }}
              >
                Scope This Pack →
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CUSTOM ── */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-t text-center" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <motion.div {...fadeUp} className="flex flex-col items-center gap-6">
          <p className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: '#D97757', fontFamily: 'monospace' }}>Custom Builds</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Have a specific process in mind?<br />
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>We'll scope it.</span>
          </h2>
          <p className="text-base max-w-xl" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Not everything fits a pre-built pack. If you have a workflow that's eating your team's time, describe it in the brief form. We'll scope it and give you a fixed price within 48 hours.
          </p>
          <Link href="/brief?service=automate&custom=true" className="btn-citrus py-4 px-10 text-sm mt-2">
            Describe Your Workflow →
          </Link>
        </motion.div>
      </section>

    </main>
  );
}
