'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
const services = [
  {
    label: 'Private AI Install',
    price: 'From £997',
    desc: 'Your own AI system on your hardware. Configured for your workflows. Trained on your data. Yours forever — not a subscription.',
    href: '/install',
    badge: 'Hero Product',
  },
  {
    label: 'Website & App Build',
    price: 'From £497',
    desc: 'Next.js sites and web apps built to convert. Fast, modern, and designed to make you look like the most serious operator in your space.',
    href: '/build',
    badge: null,
  },
  {
    label: 'Automation Packs',
    price: 'From £297',
    desc: 'n8n workflows that eliminate repetitive work — order processing, lead routing, invoicing, stock sync. Automated end-to-end.',
    href: '/automate',
    badge: null,
  },
  {
    label: 'YouTube Automation',
    price: '£500/mo',
    desc: '20 videos per month. Scripted, voiced, rendered, uploaded. Zero involvement from you. Faceless channels that compound.',
    href: '/youtube',
    badge: null,
  },
  {
    label: 'AI Workforce',
    price: '£1,000/mo',
    desc: 'A dedicated AI agent trained on your business — handling leads, support, or outreach. Runs 24/7. Never calls in sick.',
    href: '/workforce',
    badge: null,
  },
  {
    label: 'Empire OS',
    price: 'From £1,997/mo',
    desc: 'We build and operate entire businesses for you. From blueprint to revenue in 30 days. Apply only.',
    href: '/empire',
    badge: 'Apply Only',
  },
];

const caseStudies = [
  {
    client: 'BL Motorcycles',
    sector: 'E-Commerce',
    result: '3,000+ eBay listings automated. Stock sync, pricing, and descriptions — zero manual entry.',
  },
  {
    client: 'Construct FM',
    sector: 'Facilities Management',
    result: 'AI estimate generator. From 4-hour quotes to 12 minutes.',
  },
  {
    client: 'La Aesthetician',
    sector: 'Beauty & Aesthetics',
    result: 'Booking system and automated follow-ups live in 5 days.',
  },
  {
    client: 'CD Waste',
    sector: 'Waste Management',
    result: 'Automated job ticketing and invoicing. Admin time cut by 80%.',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-void text-white overflow-x-hidden">

      {/* ════════════════════════════════════════════════════════════
          HERO — Logo is the gravitational centre of the universe
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-10 gap-0">

          {/* ── THE LOGO — Star of the show ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center justify-center mb-10"
          >
            {/* The logo — dominant */}
            <Image
              src="/jai_logo_clean.png"
              alt="JonnyAI"
              width={800}
              height={245}
              className="relative object-contain"
              style={{
                width: 'clamp(300px, 52vw, 720px)',
                height: 'auto',
                filter: 'drop-shadow(0 0 48px rgba(217,119,87,0.55)) drop-shadow(0 0 12px rgba(217,119,87,0.3))',
              }}
              priority
            />
          </motion.div>

          {/* ── HEADLINE ── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-5 max-w-5xl"
          >
            <h1
              className="font-extrabold tracking-tight leading-[0.92] text-white"
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: 'clamp(3rem, 9vw, 7.5rem)',
              }}
            >
              Your Business.<br />
              <span
                style={{
                  color: '#D97757',
                  textShadow: '0 0 80px rgba(217,119,87,0.4)',
                }}
              >
                Run by AI.
              </span>
            </h1>

            <p
              className="text-lg md:text-xl leading-relaxed max-w-2xl"
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              Private AI systems installed inside your business. Not a SaaS.
              Not a chatbot. Real infrastructure — on your hardware, trained on your data.
            </p>
          </motion.div>

          {/* ── CTAs ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-4 justify-center mt-10"
          >
            <Link
              href="/install"
              className="btn-citrus py-4 px-10 text-sm tracking-widest"
            >
              SEE HOW IT WORKS
            </Link>
            <Link
              href="/brief"
              className="py-4 px-10 text-sm font-bold tracking-widest uppercase rounded-sm transition-all duration-300"
              style={{
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.55)',
                background: 'rgba(255,255,255,0.03)',
              }}
            >
              START YOUR BRIEF
            </Link>
          </motion.div>

          {/* ── Live signal ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="mt-8 flex items-center gap-2 text-xs"
            style={{ color: 'rgba(255,255,255,0.25)' }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#22C55E', boxShadow: '0 0 8px rgba(34,197,94,0.8)' }}
            />
            UK-based · Real clients · Systems live right now
          </motion.div>
        </div>

        {/* ── Stats bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="relative z-10 w-full max-w-3xl px-6 mt-16"
        >
          <div
            className="grid grid-cols-2 md:grid-cols-4"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            {[
              { v: '4+', l: 'Years building AI' },
              { v: '20+', l: 'Businesses automated' },
              { v: '£0', l: 'Wasted on SaaS' },
              { v: '24/7', l: 'Systems running' },
            ].map(({ v, l }) => (
              <div
                key={l}
                className="flex flex-col items-center justify-center py-5 px-4 gap-1"
                style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}
              >
                <span
                  className="text-2xl md:text-3xl font-extrabold"
                  style={{ color: '#D97757', fontFamily: 'Outfit, sans-serif' }}
                >
                  {v}
                </span>
                <span className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {l}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        >
          <div
            className="w-px h-12 mx-auto"
            style={{ background: 'linear-gradient(to bottom, rgba(217,119,87,0.4), transparent)' }}
          />
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FULL-BLEED BRAND VISUAL — neural network / fiber aesthetic
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden" style={{ height: 'clamp(320px, 45vw, 600px)' }}>
        <Image
          src="/brand/web_hero_field.png"
          alt=""
          fill
          className="object-cover object-center"
          style={{ opacity: 0.78 }}
          aria-hidden="true"
        />
        {/* gradient overlays — fade into void at top and bottom */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #070708 0%, transparent 18%, transparent 82%, #070708 100%)' }} />
        {/* left vignette */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #070708 0%, transparent 30%, transparent 70%, #070708 100%)' }} />
        {/* centred statement */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="font-extrabold tracking-tight text-white"
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(1.8rem, 4.5vw, 3.5rem)',
              lineHeight: 1.1,
              textShadow: '0 0 60px rgba(0,0,0,0.8)',
            }}
          >
            This is what your business<br />
            <span style={{ color: '#D97757' }}>looks like with AI inside it.</span>
          </motion.p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          THE PROBLEM
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative max-w-4xl mx-auto px-6 py-32 text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p
            className="text-xs font-bold tracking-[0.4em] uppercase mb-8"
            style={{ color: '#D97757', fontFamily: 'monospace' }}
          >
            The Problem
          </p>
          <h2
            className="font-extrabold tracking-tight mb-8"
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(2rem, 5vw, 3.75rem)',
              lineHeight: 1.05,
            }}
          >
            Most businesses are paying for AI<br />they don&apos;t own.
          </h2>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>
            ChatGPT, Zapier, Make, Notion AI — you&apos;re renting access to someone else&apos;s system.
            Your data goes to their servers. Stop paying, it stops working.
            None of it is trained on how your business actually runs.
          </p>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.45)' }}>
            We do the opposite. We build AI systems that live <em>inside</em> your business —
            on your hardware, behind your firewall. You own it outright.
            It runs even if we disappear.
          </p>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          PRIVATE AI INSTALL — Hero product feature callout
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="w-full overflow-hidden"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Image — left on desktop */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-2xl overflow-hidden order-2 lg:order-1"
              style={{ aspectRatio: '4/3' }}
            >
              <Image
                src="/brand/web_private_install.png"
                alt="Private AI system installation"
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, transparent 60%, rgba(7,7,8,0.7) 100%)' }} />
              {/* Badge overlay */}
              <div
                className="absolute top-5 left-5 px-3 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase rounded"
                style={{ background: 'rgba(217,119,87,0.2)', color: '#D97757', border: '1px solid rgba(217,119,87,0.3)', backdropFilter: 'blur(8px)' }}
              >
                Hero Product
              </div>
            </motion.div>

            {/* Copy — right on desktop */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="flex flex-col gap-6 order-1 lg:order-2"
            >
              <p className="text-xs font-bold tracking-[0.4em] uppercase" style={{ color: '#D97757', fontFamily: 'monospace' }}>
                Private AI Install
              </p>
              <h2
                className="font-extrabold tracking-tight"
                style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: 1.05 }}
              >
                Your own AI system.<br />On your hardware.<br />
                <span style={{ color: '#D97757' }}>Yours forever.</span>
              </h2>
              <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                We come in, map your workflows, and build a private AI system configured
                specifically for how your business runs. Not a SaaS tool. Not a chatbot.
                Real infrastructure — installed on your server, trained on your data, running
                behind your firewall.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  'Configured for your exact workflows — not generic',
                  'Trained on your documents, SOPs, and business data',
                  'Runs on your hardware — zero monthly SaaS fees',
                  'Keep running even if we disappear',
                  'From £997 one-time. Support from £149/mo.',
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#22C55E', boxShadow: '0 0 8px rgba(34,197,94,0.7)' }} />
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{point}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/install" className="btn-citrus py-3 px-8 text-xs">
                  SEE HOW IT WORKS
                </Link>
                <Link href="/brief" className="btn-ghost py-3 px-8 text-xs">
                  GET A QUOTE
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          HUB SUITE — Acquisition / Pilot / White-Label
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="w-full overflow-hidden relative"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(217,119,87,0.02)' }}
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(217,119,87,0.06) 0%, transparent 70%)' }} />

        <div className="relative max-w-7xl mx-auto px-6 py-28">

          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-6"
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full" style={{ background: 'rgba(217,119,87,0.08)', border: '1px solid rgba(217,119,87,0.2)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#22C55E', boxShadow: '0 0 8px rgba(34,197,94,0.8)' }} />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: '#D97757', fontFamily: 'monospace' }}>Live in Production · Available Now</span>
            </div>
            <h2
              className="font-extrabold tracking-tight mb-5"
              style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2.2rem, 5vw, 4rem)', lineHeight: 1.0 }}
            >
              Three Production-Grade SaaS Platforms.<br />
              <span style={{ color: '#D97757' }}>Built. Audited. Available.</span>
            </h2>
            <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Three independent AI audits — ChatGPT, Perplexity, Claude — each used a different methodology. ChatGPT live-tested at £30k, then re-audited after a 30-hour build sprint and returned £240k–£260k. Claude verified AI running in production at database level. Central valuation: <strong style={{ color: 'rgba(255,255,255,0.75)' }}>£275k–£300k.</strong>
            </p>

            {/* Audit proof bar */}
            <div className="inline-grid grid-cols-3 gap-px rounded-lg overflow-hidden mb-16" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)' }}>
              {[
                { ai: 'ChatGPT', verdict: '£240k–£260k', note: 'Post-sprint live audit' },
                { ai: 'Perplexity', verdict: '£275k–£350k', note: 'Independent click-through' },
                { ai: 'Claude', verdict: '£200k–£280k', note: 'Code + live DB verified' },
              ].map(({ ai, verdict, note }) => (
                <div key={ai} className="flex flex-col items-center px-6 py-4" style={{ background: 'rgba(7,7,8,0.6)' }}>
                  <span className="text-[9px] font-mono uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{ai}</span>
                  <span className="text-base font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: '#D97757' }}>{verdict}</span>
                  <span className="text-[9px] mt-0.5" style={{ color: 'rgba(255,255,255,0.2)' }}>{note}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Hub cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {[
              {
                badge: 'Facilities Management',
                name: 'FM Control Hub',
                tagline: 'A full facilities management operating system for UK estates, contractors, schools, and care groups.',
                features: [
                  'Helpdesk & Work Orders, PPM Schedules, Site Patrols',
                  'PAT Register, CDM 2015, Permits to Work, RIDDOR',
                  'Soft FM: Cleaning, Pest, Waste, Catering, Energy',
                  'FCI reporting, SLA adherence, 10-year AMP',
                  'Contractor management with RAMS & document expiry',
                ],
                buyers: 'FM companies · Estates teams · Schools · Care groups',
                rebuild: '£65k–£110k rebuild cost',
                valuation: '£200k–£320k',
                demo: 'https://fm-control-hub.jonnyai.co.uk',
                caseStudy: '/portfolio/case-studies/fm-control-hub',
                modules: '30+',
                label: 'modules',
              },
              {
                badge: 'Crown Jewel · AI Live',
                name: 'Care Hub',
                tagline: 'A CQC-ready care home OS with live AI wellness summaries — verified running in production.',
                features: [
                  'AI Wellness Summary — Claude, live, 528 tokens per run',
                  'Full MAR & CD Register, NEWS2 vital scoring',
                  'KLOE reporting (Safe / Effective / Caring / Responsive / Well-led)',
                  'HACCP, COSHH, Legionella L8, Fire Safety modules',
                  'FHIR export, family portal, mobile PWA confirmed live',
                ],
                buyers: 'Independent care homes · Small care groups · Supported living',
                rebuild: '£60k–£100k rebuild cost',
                valuation: '£250k–£350k',
                demo: 'https://care-hub.jonnyai.co.uk',
                caseStudy: '/portfolio/case-studies/care-hub',
                modules: '27',
                label: 'residents seeded',
                crown: true,
              },
              {
                badge: 'White-Label Ready',
                name: 'Compliance Hub',
                tagline: 'A multi-industry statutory compliance platform with a template engine built for white-label deployment.',
                features: [
                  '6 industry packs × 8 registers with UK statutory cadences',
                  'Property, Hospitality, Construction, Manufacturing, Education, Farms',
                  'AI Compliance Briefing live on dashboard (Claude Haiku)',
                  'Template builder — save site config → one-click reuse',
                  'Gas Safety, Fire, H&S, Asbestos dedicated modules',
                ],
                buyers: 'Multi-site SMEs · Property groups · Manufacturing · Resellers',
                rebuild: '£40k–£65k rebuild cost',
                valuation: '£200k–£280k',
                demo: 'https://compliance-hub.jonnyai.co.uk',
                caseStudy: '/portfolio/case-studies/compliance-hub',
                modules: '48',
                label: 'compliance templates',
              },
            ].map(({ badge, name, tagline, features, buyers, rebuild, valuation, demo, caseStudy, modules, label, crown }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex flex-col rounded-xl overflow-hidden"
                style={{
                  background: crown ? 'linear-gradient(160deg, rgba(217,119,87,0.07) 0%, rgba(255,255,255,0.02) 60%)' : 'rgba(255,255,255,0.025)',
                  border: crown ? '1px solid rgba(217,119,87,0.25)' : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {/* Card header */}
                <div className="p-7 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <span
                      className="text-[9px] font-bold tracking-[0.25em] uppercase px-2.5 py-1 rounded-full"
                      style={{
                        background: crown ? 'rgba(217,119,87,0.15)' : 'rgba(255,255,255,0.06)',
                        color: crown ? '#D97757' : 'rgba(255,255,255,0.4)',
                        border: crown ? '1px solid rgba(217,119,87,0.2)' : '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      {badge}
                    </span>
                    <div className="text-right">
                      <div className="text-2xl font-extrabold leading-none" style={{ fontFamily: 'Outfit, sans-serif', color: '#D97757' }}>{modules}</div>
                      <div className="text-[9px] font-mono mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-extrabold mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>{name}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{tagline}</p>
                </div>

                {/* Features */}
                <div className="p-7 py-5 flex-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-[9px] font-mono uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.25)' }}>What&apos;s included</p>
                  <ul className="flex flex-col gap-2.5">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                        <span className="mt-1 w-1 h-1 rounded-full shrink-0" style={{ background: crown ? '#D97757' : 'rgba(255,255,255,0.25)' }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Buyers + valuation */}
                <div className="p-7 pt-5 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-[9px] font-mono uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.25)' }}>Target buyers</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{buyers}</p>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-[9px] font-mono uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.25)' }}>Acquisition range</p>
                      <p className="text-xl font-extrabold" style={{ fontFamily: 'Outfit, sans-serif', color: '#D97757' }}>{valuation}</p>
                    </div>
                    <p className="text-[9px] font-mono text-right" style={{ color: 'rgba(255,255,255,0.2)' }}>{rebuild}</p>
                  </div>
                </div>

                {/* CTAs */}
                <div className="p-7 pt-5 flex flex-col gap-3">
                  <a
                    href={demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center py-2.5 px-4 rounded-lg text-xs font-bold tracking-widest uppercase transition-all duration-200"
                    style={{
                      background: crown ? 'rgba(217,119,87,0.15)' : 'rgba(255,255,255,0.05)',
                      border: crown ? '1px solid rgba(217,119,87,0.3)' : '1px solid rgba(255,255,255,0.1)',
                      color: crown ? '#D97757' : 'rgba(255,255,255,0.6)',
                    }}
                  >
                    Access Live Demo →
                  </a>
                  <Link
                    href={caseStudy}
                    className="w-full text-center py-2.5 px-4 rounded-lg text-xs font-bold tracking-widest uppercase transition-all duration-200"
                    style={{ border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.3)' }}
                  >
                    Full Case Study
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div>
              <p className="text-sm font-semibold mb-1">Available individually or as a suite.</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Acquisition · Pilot partnership · White-label licensing · <a href="https://www.compliance-hub.co.uk" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">compliance-hub.co.uk</a>
              </p>
            </div>
            <div className="flex gap-3 flex-wrap justify-center sm:justify-end">
              <Link
                href="/blog/jonnyai-hub-suite-valuation"
                className="px-6 py-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-all duration-200"
                style={{ background: 'rgba(217,119,87,0.12)', border: '1px solid rgba(217,119,87,0.25)', color: '#D97757' }}
              >
                Read Valuation Report
              </Link>
              <Link
                href="/brief"
                className="px-6 py-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-all duration-200"
                style={{ background: '#D97757', color: '#000' }}
              >
                Get in Touch
              </Link>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SERVICES GRID
      ═══════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p
            className="text-xs font-bold tracking-[0.4em] uppercase mb-6"
            style={{ color: '#D97757', fontFamily: 'monospace' }}
          >
            What We Build
          </p>
          <h2
            className="font-extrabold tracking-tight"
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
              lineHeight: 1.05,
            }}
          >
            Six ways to install intelligence<br />into your business.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map(({ label, price, desc, href, badge }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <Link
                href={href}
                className="group flex flex-col h-full p-7 rounded-xl transition-all duration-300 relative"
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.borderColor = 'rgba(217,119,87,0.3)';
                  el.style.background = 'rgba(217,119,87,0.04)';
                  el.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.borderColor = 'rgba(255,255,255,0.07)';
                  el.style.background = 'rgba(255,255,255,0.025)';
                  el.style.transform = 'translateY(0)';
                }}
              >
                {badge && (
                  <span
                    className="absolute top-5 right-5 text-[9px] font-bold tracking-[0.2em] uppercase px-2 py-1 rounded"
                    style={{
                      background: badge === 'Hero Product' ? 'rgba(217,119,87,0.15)' : 'rgba(255,255,255,0.06)',
                      color: badge === 'Hero Product' ? '#D97757' : 'rgba(255,255,255,0.4)',
                    }}
                  >
                    {badge}
                  </span>
                )}
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  {label}
                </h3>
                <p
                  className="text-base font-bold mb-4"
                  style={{ color: '#D97757' }}
                >
                  {price}
                </p>
                <p
                  className="text-sm leading-relaxed flex-1"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                >
                  {desc}
                </p>
                <div
                  className="mt-6 text-xs font-bold tracking-widest uppercase"
                  style={{ color: '#D97757' }}
                >
                  Learn more →
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          HOW IT WORKS — 3 steps
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="max-w-5xl mx-auto px-6 py-32"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <p
            className="text-xs font-bold tracking-[0.4em] uppercase mb-6"
            style={{ color: '#D97757', fontFamily: 'monospace' }}
          >
            The Process
          </p>
          <h2
            className="font-extrabold tracking-tight"
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
              lineHeight: 1.05,
            }}
          >
            Brief to live system.<br />Days, not months.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              n: '01',
              title: 'Brief Us',
              body: 'Fill in the form — 10 minutes. Tell us what your business does and what slows you down. We scope it and send you a fixed-price proposal within 48 hours.',
            },
            {
              n: '02',
              title: 'We Build & Test',
              body: 'We configure your AI system in a staging environment. Every automation is tested against real scenarios before it touches your live operation.',
            },
            {
              n: '03',
              title: 'Install & Train',
              body: 'Remote install via secure screen share, or on-site for enterprise. Installation takes one day. Training follows that week. Then it runs.',
            },
          ].map(({ n, title, body }, i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
            >
              <div
                className="text-6xl font-extrabold mb-6 leading-none"
                style={{
                  color: 'rgba(217,119,87,0.12)',
                  fontFamily: 'Outfit, sans-serif',
                }}
              >
                {n}
              </div>
              <h3
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                {title}
              </h3>
              <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          CASE STUDIES
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="max-w-7xl mx-auto px-6 py-24"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p
            className="text-xs font-bold tracking-[0.4em] uppercase mb-6"
            style={{ color: '#D97757', fontFamily: 'monospace' }}
          >
            Real Work
          </p>
          <h2
            className="font-extrabold tracking-tight"
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
              lineHeight: 1.05,
            }}
          >
            Clients. Results.<br />No case study theatre.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {caseStudies.map(({ client, sector, result }, i) => (
            <motion.div
              key={client}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="p-8 rounded-xl"
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p
                    className="text-xl font-bold"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    {client}
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}
                  >
                    {sector}
                  </p>
                </div>
                <span
                  className="w-2 h-2 rounded-full mt-2 shrink-0"
                  style={{ background: '#22C55E', boxShadow: '0 0 10px rgba(34,197,94,0.7)' }}
                />
              </div>
              <p
                className="text-base leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.55)' }}
              >
                {result}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          IMAGE TRIPTYCH — brand visual strip
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full overflow-hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0 }}
          className="grid grid-cols-3"
          style={{ height: 'clamp(180px, 25vw, 380px)' }}
        >
          {[
            { src: '/brand/v2_automation.png', label: 'Automation' },
            { src: '/brand/web_network_deep.png', label: 'Network' },
            { src: '/brand/v2_cta.png',        label: 'Scale' },
          ].map(({ src, label }) => (
            <div key={label} className="relative overflow-hidden">
              <Image src={src} alt="" fill className="object-cover object-center" style={{ opacity: 0.7 }} aria-hidden="true" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(7,7,8,0.4), transparent 30%, transparent 70%, rgba(7,7,8,0.4))' }} />
            </div>
          ))}
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(217,119,87,0.1) 0%, transparent 70%)',
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl mx-auto px-6 py-40 text-center flex flex-col items-center gap-8"
        >
          <p
            className="text-xs font-bold tracking-[0.4em] uppercase"
            style={{ color: '#D97757', fontFamily: 'monospace' }}
          >
            Ready?
          </p>
          <h2
            className="font-extrabold tracking-tight"
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              lineHeight: 1.0,
            }}
          >
            Start with a brief.{' '}
            <br />
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>No call required.</span>
          </h2>
          <p className="text-lg max-w-xl" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Tell us about your business and what you want automated. We come back with a
            clear plan — scope, timeline, fixed price. No vague quotes. No sales patter.
          </p>
          <Link href="/brief" className="btn-citrus py-5 px-12 text-sm tracking-widest">
            BRIEF US NOW
          </Link>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════════ */}
      <footer
        className="px-6 py-14"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <Image
            src="/jai_logo_clean.png"
            alt="JonnyAI"
            width={90}
            height={28}
            className="object-contain"
            style={{ opacity: 0.5 }}
          />
          <div
            className="flex flex-wrap gap-x-8 gap-y-3 text-xs justify-center"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            {[
              ['Install', '/install'],
              ['Build', '/build'],
              ['Automate', '/automate'],
              ['YouTube', '/youtube'],
              ['Workforce', '/workforce'],
              ['Empire', '/empire'],
              ['Blog', '/blog'],
              ['Privacy', '/privacy'],
              ['Terms', '/terms'],
            ].map(([label, href]) => (
              <Link key={label} href={href} className="hover:text-white transition-colors duration-200">
                {label}
              </Link>
            ))}
          </div>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.18)', fontFamily: 'monospace' }}>
            © {new Date().getFullYear()} JonnyAI
          </p>
        </div>
      </footer>
    </main>
  );
}
