'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { hubSuite, hubSuiteUrl } from '@/lib/data/ecosystem';
import BizOSBrain from '@/components/BizOSBrain';

const liveModules = [
  'Care & clinical', 'Statutory compliance', 'Facilities & PPM', 'Contractor portal',
  'CRM & contacts', 'Jobs & scheduling', 'Quotes & invoicing', 'Finance & ledgers',
  'Documents & evidence', 'Audit & activity log', 'Notifications & inbox', 'Reporting & dashboards',
  'Staff & rota', 'Assets & registers', 'Forms & checklists', 'Calendar & cadence',
];

const capabilities = [
  { title: 'Section Builder', body: 'Reshape any screen, field or workflow to your business — live, with no code and no rebuild. The platform bends to you, not the other way round.' },
  { title: 'JAIOS — the 108-agent swarm', body: 'An intelligent layer that drafts the work, watches the live signals, and flags what needs you. It’s the brain that turns a database into a colleague.' },
  { title: 'Ask JonnyAI', body: 'A single question box across the whole platform. Ask in plain English — “which sites are overdue an inspection?” — and get an answer pulled from live data.' },
  { title: 'Deterministic engines', body: 'The numbers — compliance scores, rotas, finance — are computed by pure, predictable engines. The AI assists; the maths is never a guess.' },
  { title: 'Multi-backend AI', body: 'BizOS isn’t tied to one AI provider. It routes to the best model for the job and keeps working if any single provider has a bad day.' },
  { title: 'Human-gated automation', body: 'Sensitive steps — like the full simulated HMRC series — are drafted by the swarm but always wait for a human to approve. Speed without the risk.' },
];

const provisioning = [
  { t: 'Provisioning CLI', b: 'Spin up a fully-branded tenant — your domain, your modules, your data — in minutes, not weeks.' },
  { t: 'Module generator', b: 'New module needed? The generator scaffolds it to the platform’s standards, so the catalogue keeps growing cleanly.' },
  { t: 'White-label by default', b: 'Your brand, your colours, your domain. Customers see your product; the engine underneath is BizOS.' },
];

export default function BizOSPage() {
  return (
    <main className="min-h-screen bg-void text-white overflow-x-hidden">

      {/* HERO */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-6 pt-28 pb-16">
        <BizOSBrain className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(680px,90vw)] opacity-[0.55]" />
        {/* Legibility scrim over the brain centre */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 55% 45% at 50% 48%, rgba(7,7,8,0.82) 0%, rgba(7,7,8,0.45) 45%, transparent 75%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(217,119,87,0.1) 0%, rgba(49,198,169,0.05) 45%, transparent 78%)' }} />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="relative z-10 max-w-4xl text-center flex flex-col items-center gap-7">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full" style={{ background: 'rgba(217,119,87,0.1)', border: '1px solid rgba(217,119,87,0.25)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#22C55E', boxShadow: '0 0 8px rgba(34,197,94,0.8)' }} />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: '#D97757', fontFamily: 'monospace' }}>The JonnyAI Flagship · Building live</span>
          </div>
          <h1 className="font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2.6rem, 7vw, 5.5rem)', lineHeight: 0.96 }}>
            BizOS.<br />
            <span style={{ color: '#D97757', textShadow: '0 0 80px rgba(217,119,87,0.4)' }}>The one brain for your whole business.</span>
          </h1>
          <p className="text-lg md:text-xl leading-relaxed max-w-2xl" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Stop juggling a dozen apps that don’t talk to each other. BizOS is a single, intelligent
            operating system — composable, white-labelled to your brand, and run by an AI swarm that
            never clocks off.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-2">
            <Link href="/brief" className="btn-citrus py-4 px-10 text-sm tracking-widest">BOOK A WALKTHROUGH</Link>
            <a href={hubSuiteUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost py-4 px-10 text-sm tracking-widest">SEE THE HUBSUITE</a>
          </div>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="max-w-5xl mx-auto px-6 -mt-4 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {[
            { v: '85+', l: 'Modules in the catalogue' },
            { v: '50+', l: 'Already live' },
            { v: '108', l: 'AI agents (JAIOS)' },
            { v: '1', l: 'Unified brain' },
          ].map(({ v, l }) => (
            <div key={l} className="flex flex-col items-center justify-center py-7 px-4 gap-1.5 text-center" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-3xl md:text-4xl font-extrabold" style={{ color: '#D97757', fontFamily: 'Outfit, sans-serif' }}>{v}</span>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT IT IS */}
      <section className="max-w-4xl mx-auto px-6 py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center">
          <p className="text-xs font-bold tracking-[0.4em] uppercase mb-6" style={{ color: '#D97757', fontFamily: 'monospace' }}>What it is</p>
          <h2 className="font-extrabold tracking-tight mb-7" style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.9rem, 4.5vw, 3rem)', lineHeight: 1.08 }}>
            Think of it as your business, with the walls knocked through.
          </h2>
          <div className="flex flex-col gap-5 text-left text-base md:text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <p>Most businesses end up with one app for jobs, another for invoices, a spreadsheet for compliance, an inbox for everything else — and none of them talk to each other. You become the integration.</p>
            <p>BizOS replaces that mess with one building. Each part of your business — care, compliance, facilities, finance, field work — is a room, and the rooms already share the same data, the same audit trail, the same calendar.</p>
            <p>It’s <span className="text-white/90">composable</span>, so you switch on only the modules you need. It’s <span className="text-white/90">white-label</span>, so it carries your brand on your domain. And it’s <span className="text-white/90">intelligent</span>, so it doesn’t just store your work — it helps do it.</p>
          </div>
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-6 py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <p className="text-xs font-bold tracking-[0.4em] uppercase mb-6" style={{ color: '#31C6A9', fontFamily: 'monospace' }}>How it works, simply</p>
          <h2 className="font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', lineHeight: 1.05 }}>
            Pick it. Shape it. Let the brain run it.
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { n: '01', t: 'Pick your modules', b: 'Choose from 85+ modules — 50+ already live. Only pay for the rooms you use; add more any time without a migration.' },
            { n: '02', t: 'Shape it to you', b: 'The Section Builder tailors fields, screens and workflows to exactly how you work — at runtime, no developer required.' },
            { n: '03', t: 'The swarm runs it', b: 'JAIOS drafts the work, watches the signals and answers questions. You approve the important calls; it handles the rest.' },
          ].map(({ n, t, b }, i) => (
            <motion.div key={n} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.12 }} className="p-8 rounded-2xl" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="text-5xl font-extrabold mb-5 leading-none" style={{ color: 'rgba(217,119,87,0.15)', fontFamily: 'Outfit, sans-serif' }}>{n}</div>
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>{t}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{b}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="w-full relative overflow-hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(217,119,87,0.02)' }}>
        <div className="max-w-6xl mx-auto px-6 py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16">
            <p className="text-xs font-bold tracking-[0.4em] uppercase mb-6" style={{ color: '#D97757', fontFamily: 'monospace' }}>The clever bits</p>
            <h2 className="font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', lineHeight: 1.05 }}>
              What makes it a brain, not a database.
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {capabilities.map(({ title, body }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: (i % 3) * 0.08 }} className="p-7 rounded-xl" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <h3 className="text-lg font-bold mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT'S ALREADY LIVE */}
      <section className="max-w-6xl mx-auto px-6 py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-14">
          <p className="text-xs font-bold tracking-[0.4em] uppercase mb-6" style={{ color: '#22C55E', fontFamily: 'monospace' }}>What&apos;s already live</p>
          <h2 className="font-extrabold tracking-tight mb-5" style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', lineHeight: 1.05 }}>
            Not a roadmap. Running today.
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
            The HubSuite products you can use right now — Compliance Hub, Care Hub and FM Control Hub —
            are BizOS modules in the wild. Over 50 modules are live; here&apos;s a flavour.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {liveModules.map((m, i) => (
            <motion.span key={m} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: (i % 8) * 0.04 }} className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#22C55E' }} />
              {m}
            </motion.span>
          ))}
        </div>

        {/* HubSuite as live proof */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hubSuite.map(({ name, blurb, url, accent }) => (
            <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="group flex flex-col p-7 rounded-xl transition-all duration-300" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="w-10 h-1 rounded-full mb-5" style={{ background: accent }} />
              <h3 className="text-xl font-extrabold mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>{name}</h3>
              <p className="text-sm leading-relaxed flex-1 mb-5" style={{ color: 'rgba(255,255,255,0.5)' }}>{blurb}</p>
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: accent }}>Visit live site →</span>
            </a>
          ))}
        </div>
      </section>

      {/* PROVISIONING / WHITE-LABEL */}
      <section className="w-full relative overflow-hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(49,198,169,0.025)' }}>
        <div className="max-w-6xl mx-auto px-6 py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16">
            <p className="text-xs font-bold tracking-[0.4em] uppercase mb-6" style={{ color: '#31C6A9', fontFamily: 'monospace' }}>Built to scale</p>
            <h2 className="font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', lineHeight: 1.05 }}>
              Your brand on the front. Serious engineering behind it.
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {provisioning.map(({ t, b }, i) => (
              <motion.div key={t} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="p-8 rounded-2xl" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <h3 className="text-lg font-bold mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>{t}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{b}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY IT MATTERS + CTA */}
      <section className="relative overflow-hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(217,119,87,0.1) 0%, transparent 70%)' }} />
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative z-10 max-w-3xl mx-auto px-6 py-36 text-center flex flex-col items-center gap-8">
          <p className="text-xs font-bold tracking-[0.4em] uppercase" style={{ color: '#D97757', fontFamily: 'monospace' }}>Why it matters</p>
          <h2 className="font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2.2rem, 5.5vw, 4rem)', lineHeight: 1.0 }}>
            One place to run everything.<br />
            <span style={{ color: 'rgba(255,255,255,0.35)' }}>And it runs itself when you’re not looking.</span>
          </h2>
          <p className="text-lg max-w-xl" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Start with a single HubSuite blade today. Grow into the full platform when you’re ready —
            same data, one brain, your brand. Let me show you what it could look like for your business.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/brief" className="btn-citrus py-5 px-12 text-sm tracking-widest">BOOK A WALKTHROUGH</Link>
            <Link href="/#hubsuite" className="btn-ghost py-5 px-12 text-sm tracking-widest">START WITH A HUB</Link>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-14" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <Image src="/jai_logo_clean.png" alt="JonnyAI" width={90} height={28} className="object-contain" style={{ opacity: 0.5 }} />
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-xs justify-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {[['Services', '/#services'], ['HubSuite', '/#hubsuite'], ['BizOS', '/bizos'], ['Work', '/portfolio'], ['About', '/about'], ['Contact', '/brief']].map(([label, href]) => (
              <Link key={label} href={href} className="hover:text-white transition-colors duration-200">{label}</Link>
            ))}
          </div>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.18)', fontFamily: 'monospace' }}>© {new Date().getFullYear()} JonnyAI</p>
        </div>
      </footer>
    </main>
  );
}
