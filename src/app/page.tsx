'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

// ── Studio services (Door 1 — for local businesses) ──────────────
const services = [
  {
    label: 'Branding & Rebrands',
    line: 'Logo design, brand identity, the lot.',
    desc: 'A proper identity that makes a local business look like the most serious operator in its area. Logo, colours, type, the full system — applied everywhere.',
  },
  {
    label: 'Websites & Apps',
    line: 'Fast, modern, built to convert.',
    desc: 'Next.js sites and web apps with local SEO baked in. Service pages, area pages, reviews, quote forms — engineered to turn searches into phone calls.',
  },
  {
    label: 'Content & Reels',
    line: 'We come on site and film it.',
    desc: 'This is what most agencies can’t do: we turn up, record you working, and cut vertical reels — then publish them to your site and socials. Real content, not stock.',
  },
  {
    label: 'AI & Automation',
    line: 'Quietly running in the background.',
    desc: 'Private AI and automations that kill the repetitive admin — quotes, follow-ups, bookings, invoicing. Set up once, running 24/7.',
  },
];

// ── Featured work (the proof) ────────────────────────────────────
const work = [
  {
    client: 'BL Motorcycles',
    sector: 'E-commerce · Automation',
    result: '3,000+ eBay listings automated — stock, pricing and descriptions, zero manual entry.',
    href: '/portfolio/case-studies/bl-motorcycles',
  },
  {
    client: 'Sparta Coatings',
    sector: 'Branding · Web',
    result: 'Dark-luxury rebrand and 11-service website for an industrial spraying firm.',
    href: '/portfolio/case-studies/sparta-coatings',
  },
  {
    client: 'Marzer Pro Roofing',
    sector: 'Branding · Web',
    result: 'New brand and lead-gen site for a Hampshire roofing contractor.',
    href: '/portfolio/case-studies/marzer-pro',
  },
  {
    client: 'Construct FM',
    sector: 'Web · Tools',
    result: 'Estimate generator that took quotes from 4 hours down to 12 minutes.',
    href: '/portfolio/case-studies/construct-fm',
  },
];

// ── Products (Door 2 — our own software) ─────────────────────────
const products = [
  {
    name: 'Compliance Hub',
    tagline: 'Statutory compliance OS for UK facilities — LOLER, PUWER, RIDDOR, RAMS, Fire, L8, EICR, Gas.',
    href: 'https://compliance-hub.co.uk',
    accent: '#5B8DEF',
  },
  {
    name: 'Care Hub',
    tagline: 'CQC-aligned operating system for care homes — eMAR, NEWS2, care plans, family portal.',
    href: 'https://care-hub.app',
    accent: '#31C6A9',
  },
  {
    name: 'FM Control Hub',
    tagline: 'Facilities OS for complex estates — PPM, work orders, permits, contractor & key control.',
    href: 'https://fm-control-hub.co.uk',
    accent: '#5EC86E',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-void text-white overflow-x-hidden">

      {/* ════════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-10 gap-0">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center justify-center mb-10"
          >
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

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-5 max-w-5xl"
          >
            <h1
              className="font-extrabold tracking-tight leading-[0.95] text-white"
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: 'clamp(2.4rem, 6.5vw, 5.5rem)',
              }}
            >
              We brand it, build it,<br />
              <span style={{ color: '#D97757', textShadow: '0 0 80px rgba(217,119,87,0.4)' }}>
                film it &amp; automate it.
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed max-w-2xl" style={{ color: 'rgba(255,255,255,0.5)' }}>
              An AI-native creative &amp; tech studio for local businesses. One team for your
              rebrand, your website, your content — and the AI that runs behind it. Plus our own
              software line, the HubSuite.
            </p>
          </motion.div>

          {/* Two-door CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-4 justify-center mt-10"
          >
            <Link href="#services" className="btn-citrus py-4 px-10 text-sm tracking-widest">
              FOR YOUR BUSINESS
            </Link>
            <Link
              href="#products"
              className="py-4 px-10 text-sm font-bold tracking-widest uppercase rounded-sm transition-all duration-300"
              style={{
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.6)',
                background: 'rgba(255,255,255,0.03)',
              }}
            >
              SEE OUR PRODUCTS
            </Link>
          </motion.div>

          {/* Live signal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="mt-8 flex items-center gap-2 text-xs"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#22C55E', boxShadow: '0 0 8px rgba(34,197,94,0.8)' }} />
            UK-based · Real clients · Hampshire &amp; beyond
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="relative z-10 w-full max-w-3xl px-6 mt-16"
        >
          <div
            className="grid grid-cols-2 md:grid-cols-4"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden' }}
          >
            {[
              { v: '20+', l: 'Businesses built' },
              { v: '4', l: 'Services, one team' },
              { v: 'On-site', l: 'Filming & reels' },
              { v: '3', l: 'SaaS products live' },
            ].map(({ v, l }) => (
              <div key={l} className="flex flex-col items-center justify-center py-5 px-4 gap-1" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-2xl md:text-3xl font-extrabold" style={{ color: '#D97757', fontFamily: 'Outfit, sans-serif' }}>{v}</span>
                <span className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>{l}</span>
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
          <div className="w-px h-12 mx-auto" style={{ background: 'linear-gradient(to bottom, rgba(217,119,87,0.4), transparent)' }} />
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          TWO DOORS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center text-xs font-bold tracking-[0.4em] uppercase mb-12"
          style={{ color: '#D97757', fontFamily: 'monospace' }}
        >
          Two ways in
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              kicker: 'For your business',
              title: 'Sort out my business',
              body: 'You run a real-world business and you want it to look the part, get found, and stop drowning in admin. We do the brand, the website, the content and the automation — start to finish.',
              cta: 'Explore services',
              href: '#services',
            },
            {
              kicker: 'Our software',
              title: 'Browse the products',
              body: 'We don’t just build for clients — we ship our own SaaS. The HubSuite is three production-grade platforms for regulated UK industries, available to subscribe, license or acquire.',
              cta: 'See the products',
              href: '#products',
            },
          ].map(({ kicker, title, body, cta, href }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Link
                href={href}
                className="group flex flex-col h-full p-10 rounded-2xl transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)' }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = 'rgba(217,119,87,0.3)'; el.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = 'rgba(255,255,255,0.08)'; el.style.transform = 'translateY(0)'; }}
              >
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-5" style={{ color: '#D97757', fontFamily: 'monospace' }}>{kicker}</p>
                <h3 className="text-3xl font-extrabold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>{title}</h3>
                <p className="text-base leading-relaxed flex-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{body}</p>
                <span className="mt-8 text-xs font-bold tracking-widest uppercase" style={{ color: '#D97757' }}>{cta} →</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SERVICES (Door 1)
      ═══════════════════════════════════════════════════════════════ */}
      <section id="services" className="max-w-7xl mx-auto px-6 py-24 scroll-mt-24" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-bold tracking-[0.4em] uppercase mb-6" style={{ color: '#D97757', fontFamily: 'monospace' }}>For your business</p>
          <h2 className="font-extrabold tracking-tight mb-6" style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', lineHeight: 1.05 }}>
            Brand. Build. Film. Automate.<br />One studio, the whole job.
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Most agencies run ads and post on Instagram. We do the thing they outsource —
            we design the brand, build the site, turn up and film the content, and wire in the AI.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {services.map(({ label, line, desc }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex flex-col h-full p-8 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className="text-xl font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>{label}</h3>
              </div>
              <p className="text-sm font-semibold mb-3" style={{ color: '#D97757' }}>{line}</p>
              <p className="text-sm leading-relaxed flex-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link href="/brief" className="btn-citrus py-4 px-10 text-sm tracking-widest">START A PROJECT</Link>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FLAGSHIP CASE STUDY — Little Joe's
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full overflow-hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(61,163,93,0.02)' }}>
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-2xl overflow-hidden"
              style={{ aspectRatio: '4/3', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <Image src="/portfolio/littlejoes/hero.svg" alt="Little Joe's Tree Services" fill className="object-cover object-center" />
              <div className="absolute top-5 left-5 px-3 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase rounded" style={{ background: 'rgba(61,163,93,0.25)', color: '#7FD89A', border: '1px solid rgba(61,163,93,0.4)', backdropFilter: 'blur(8px)' }}>
                Flagship · Full Studio Build
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="flex flex-col gap-6"
            >
              <p className="text-xs font-bold tracking-[0.4em] uppercase" style={{ color: '#3DA35D', fontFamily: 'monospace' }}>Case Study · Little Joe&apos;s Tree Services</p>
              <h2 className="font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: 1.05 }}>
                A great tree team,<br /><span style={{ color: '#3DA35D' }}>invisible online.</span><br />Not anymore.
              </h2>
              <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                NPTC-qualified, fully insured, brilliant on the tools — but living off word-of-mouth
                with no real brand. We gave them the works: a new logo and identity, a fast lead-gen
                website covering 25+ Hampshire towns, and a content day on site cutting reels of the
                team in the trees — published to the site and socials.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { v: '25+', l: 'Areas covered' },
                  { v: '100+', l: 'Reviews' },
                  { v: '24/7', l: 'Emergency line' },
                  { v: 'Full', l: 'Rebrand + film' },
                ].map(({ v, l }) => (
                  <div key={l} className="flex flex-col gap-1 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <span className="text-lg font-extrabold" style={{ fontFamily: 'Outfit, sans-serif', color: '#3DA35D' }}>{v}</span>
                    <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{l}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/portfolio/case-studies/little-joes-tree-services" className="btn-citrus py-3 px-8 text-xs">READ THE CASE STUDY</Link>
                <a href="https://www.littlejoestreeservices.co.uk" target="_blank" rel="noopener noreferrer" className="btn-ghost py-3 px-8 text-xs">VISIT THE SITE →</a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          MORE WORK
      ═══════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-bold tracking-[0.4em] uppercase mb-6" style={{ color: '#D97757', fontFamily: 'monospace' }}>Real Work</p>
          <h2 className="font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', lineHeight: 1.05 }}>
            Clients. Results.<br />No case study theatre.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {work.map(({ client, sector, result, href }, i) => (
            <motion.div
              key={client}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                href={href}
                className="group flex flex-col h-full p-8 rounded-xl transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = 'rgba(217,119,87,0.3)'; el.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = 'rgba(255,255,255,0.07)'; el.style.transform = 'translateY(0)'; }}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-xl font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>{client}</p>
                    <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>{sector}</p>
                  </div>
                  <span className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ background: '#22C55E', boxShadow: '0 0 10px rgba(34,197,94,0.7)' }} />
                </div>
                <p className="text-base leading-relaxed flex-1" style={{ color: 'rgba(255,255,255,0.55)' }}>{result}</p>
                <span className="mt-6 text-xs font-bold tracking-widest uppercase" style={{ color: '#D97757' }}>View →</span>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link href="/portfolio" className="btn-ghost py-4 px-10 text-sm tracking-widest">SEE ALL WORK</Link>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          PRODUCTS (Door 2) — HubSuite + Biz-OS + PoundTrades
      ═══════════════════════════════════════════════════════════════ */}
      <section id="products" className="w-full overflow-hidden relative scroll-mt-24" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(217,119,87,0.02)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(217,119,87,0.06) 0%, transparent 70%)' }} />

        <div className="relative max-w-7xl mx-auto px-6 py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full" style={{ background: 'rgba(217,119,87,0.08)', border: '1px solid rgba(217,119,87,0.2)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#22C55E', boxShadow: '0 0 8px rgba(34,197,94,0.8)' }} />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: '#D97757', fontFamily: 'monospace' }}>Our Software · Live in Production</span>
            </div>
            <h2 className="font-extrabold tracking-tight mb-5" style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2.2rem, 5vw, 4rem)', lineHeight: 1.0 }}>
              The HubSuite.<br /><span style={{ color: '#D97757' }}>Three operating systems of record.</span>
            </h2>
            <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Multi-tenant SaaS for regulated UK industries — same RLS-first, audit-by-default
              architecture, three different regulatory regimes. Use one, two, or all three.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            {products.map(({ name, tagline, href, accent }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex flex-col rounded-xl p-7"
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="w-10 h-1 rounded-full mb-5" style={{ background: accent }} />
                <h3 className="text-2xl font-extrabold mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>{name}</h3>
                <p className="text-sm leading-relaxed flex-1 mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>{tagline}</p>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center py-2.5 px-4 rounded-lg text-xs font-bold tracking-widest uppercase transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${accent}55`, color: accent }}
                >
                  Visit site →
                </a>
              </motion.div>
            ))}
          </div>

          {/* Suite + other products bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col gap-6 pt-10"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <p className="text-sm font-semibold mb-1">Available individually or as a bundle.</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Subscribe · White-label licensing · Acquisition — full suite at{' '}
                  <a href="https://hub-suite.co.uk" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">hub-suite.co.uk</a>
                </p>
              </div>
              <div className="flex gap-3 flex-wrap justify-center">
                <a href="https://hub-suite.co.uk" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-all duration-200" style={{ background: 'rgba(217,119,87,0.12)', border: '1px solid rgba(217,119,87,0.25)', color: '#D97757' }}>
                  View the suite
                </a>
                <Link href="/blog/jonnyai-hub-suite-valuation" className="px-6 py-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-all duration-200" style={{ background: '#D97757', color: '#000' }}>
                  Valuation report
                </Link>
              </div>
            </div>

            {/* Also building */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {[
                { name: 'Biz-OS', tag: 'Our most ambitious project — an all-in-one operating system for running a small business.', href: '/marketplace', label: 'In development' },
                { name: 'PoundTrades', tag: 'A mobile marketplace for UK tradespeople — buy, sell and hire kit locally.', href: 'https://poundtrades.app', label: 'Live' },
              ].map(({ name, tag, href, label }) => {
                const external = href.startsWith('http');
                const inner = (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>{name}</h4>
                      <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}>{label}</span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{tag}</p>
                  </>
                );
                return external ? (
                  <a key={name} href={href} target="_blank" rel="noopener noreferrer" className="p-6 rounded-xl transition-colors hover:bg-white/[0.04]" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>{inner}</a>
                ) : (
                  <Link key={name} href={href} className="p-6 rounded-xl transition-colors hover:bg-white/[0.04]" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>{inner}</Link>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-6 py-32" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <p className="text-xs font-bold tracking-[0.4em] uppercase mb-6" style={{ color: '#D97757', fontFamily: 'monospace' }}>The Process</p>
          <h2 className="font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', lineHeight: 1.05 }}>
            Brief to live.<br />Days, not months.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { n: '01', title: 'Brief Us', body: 'Tell us about your business and what you want — 10 minutes. We come back with a clear, fixed-price plan within 48 hours.' },
            { n: '02', title: 'We Build & Film', body: 'Brand, website and automations built in staging. Where it fits, we book a content day and come on site to film.' },
            { n: '03', title: 'Launch & Run', body: 'We go live, hand it over, and keep the content and automations running. One studio, ongoing.' },
          ].map(({ n, title, body }, i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
            >
              <div className="text-6xl font-extrabold mb-6 leading-none" style={{ color: 'rgba(217,119,87,0.12)', fontFamily: 'Outfit, sans-serif' }}>{n}</div>
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>{title}</h3>
              <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          IMAGE TRIPTYCH
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
            { src: '/brand/v2_cta.png', label: 'Scale' },
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
      <section className="relative overflow-hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(217,119,87,0.1) 0%, transparent 70%)' }} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl mx-auto px-6 py-40 text-center flex flex-col items-center gap-8"
        >
          <p className="text-xs font-bold tracking-[0.4em] uppercase" style={{ color: '#D97757', fontFamily: 'monospace' }}>Ready?</p>
          <h2 className="font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 1.0 }}>
            Let&apos;s make your business{' '}<br />
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>look the part.</span>
          </h2>
          <p className="text-lg max-w-xl" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Tell us what you do and what you need. We&apos;ll come back with a clear plan —
            scope, timeline, fixed price. No vague quotes, no sales patter.
          </p>
          <Link href="/brief" className="btn-citrus py-5 px-12 text-sm tracking-widest">START A PROJECT</Link>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════════ */}
      <footer className="px-6 py-14" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <Image src="/jai_logo_clean.png" alt="JonnyAI" width={90} height={28} className="object-contain" style={{ opacity: 0.5 }} />
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-xs justify-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {[
              ['Services', '/#services'],
              ['Work', '/portfolio'],
              ['Products', '/#products'],
              ['Marketplace', '/marketplace'],
              ['Blog', '/blog'],
              ['Privacy', '/privacy'],
              ['Terms', '/terms'],
            ].map(([label, href]) => (
              <Link key={label} href={href} className="hover:text-white transition-colors duration-200">{label}</Link>
            ))}
          </div>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.18)', fontFamily: 'monospace' }}>© {new Date().getFullYear()} JonnyAI</p>
        </div>
      </footer>
    </main>
  );
}
