'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { hubSuite, hubSuiteUrl } from '@/lib/data/ecosystem';
import AtmosphereField from '@/components/AtmosphereField';

// ── The full agency offering (the crew) ──────────────────────────
const services = [
  { label: 'Branding & Rebrands', line: 'Look like the serious operator.', desc: 'Logo, identity, the full system — applied everywhere from your van to your invoices.' },
  { label: 'Websites & Web Apps', line: 'Fast, modern, built to convert.', desc: 'Next.js sites with local SEO baked in. Engineered to turn searches into phone calls.' },
  { label: 'Mobile Apps', line: 'iOS & Android, done properly.', desc: 'React Native apps and marketplaces — the same product quality I ship in my own software.' },
  { label: 'Content & Reels', line: 'We come on site and film it.', desc: 'I turn up, record you working, and cut vertical reels — then publish them to your site and socials.' },
  { label: 'Paid Media', line: 'Ads that actually pay back.', desc: 'Google, Meta and TikTok campaigns wired to real tracking, so you know what every pound does.' },
  { label: 'SEO', line: 'Get found before your competitors.', desc: 'Technical SEO, local area pages and schema that put you at the top of "near me" searches.' },
  { label: 'Social & Email', line: 'Stay in front of people.', desc: 'Organic social, newsletters and lifecycle email — kept warm without you lifting a finger.' },
  { label: 'AI & Automation', line: 'Quietly running in the background.', desc: 'Private AI and automations that kill the admin — quotes, follow-ups, bookings, invoicing, 24/7.' },
];

// ── Featured work (the proof) ────────────────────────────────────
const work = [
  { client: 'BL Motorcycles', sector: 'E-commerce · Automation', result: '3,000+ eBay listings automated — stock, pricing and descriptions, zero manual entry.', href: '/portfolio/case-studies/bl-motorcycles', live: null },
  { client: 'Sparta Coatings', sector: 'Branding · Web', result: 'Dark-luxury rebrand and 11-service website for an industrial spraying firm.', href: '/portfolio/case-studies/sparta-coatings', live: 'https://sparta-coatings.co.uk' },
  { client: 'Moling Expert', sector: 'Web · Local SEO', result: 'Ranking-ready lead-gen site for a trenchless no-dig specialist across the South East.', href: '/portfolio/case-studies', live: 'https://www.molingexpert.co.uk' },
  { client: 'Construct FM', sector: 'Web · Tools', result: 'Estimate generator that took quotes from 4 hours down to 12 minutes.', href: '/portfolio/case-studies/construct-fm', live: null },
];

// ── BizOS — what's already live ──────────────────────────────────
const bizosLive = [
  { v: '50+', l: 'Live modules' },
  { v: '85+', l: 'Modules in the catalogue' },
  { v: '108', l: 'AI agents in the swarm' },
  { v: '1', l: 'Brain, every department' },
];

const bizosPillars = [
  { title: 'One brain, every department', body: 'Care, compliance, facilities, finance and field work stop being separate apps. They become rooms in one building that already talk to each other.' },
  { title: 'Built for your business, at runtime', body: 'The Section Builder lets us shape screens, fields and workflows to how you actually work — without a developer and without a rebuild.' },
  { title: 'An intelligent layer that never sleeps', body: 'JAIOS — a 108-agent swarm — watches the live signals, drafts the work, flags what matters and answers questions in plain English with “Ask JonnyAI”.' },
  { title: 'Yours, white-labelled', body: 'Your brand, your domain, your rules. The deterministic engines mean the numbers are always right, and the human-gated steps mean nothing risky happens on its own.' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-void text-white overflow-x-hidden">

      {/* ════════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-10 gap-0">
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

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-5 max-w-5xl"
          >
            <h1
              className="font-extrabold tracking-tight leading-[0.95] text-white"
              style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2.4rem, 6.5vw, 5.5rem)' }}
            >
              We brand it, build it,<br />
              <span style={{ color: '#D97757', textShadow: '0 0 80px rgba(217,119,87,0.4)' }}>
                film it &amp; automate it.
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed max-w-2xl" style={{ color: 'rgba(255,255,255,0.55)' }}>
              A one-man, AI-native digital marketing agency for ambitious businesses.
              One person for your brand, your website, your content and the AI behind it —
              plus a software line of my own: the <span className="text-white/80">HubSuite</span> blades and the{' '}
              <span className="text-white/80">BizOS</span> platform.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-4 justify-center mt-10"
          >
            <Link href="#services" className="btn-citrus py-4 px-10 text-sm tracking-widest">
              SORT OUT MY BUSINESS
            </Link>
            <Link
              href="#bizos"
              className="py-4 px-10 text-sm font-bold tracking-widest uppercase rounded-sm transition-all duration-300"
              style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.03)' }}
            >
              MEET BIZOS
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="mt-8 flex items-center gap-2 text-xs"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#22C55E', boxShadow: '0 0 8px rgba(34,197,94,0.8)' }} />
            UK-based · Real clients · Software live in production
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="relative z-10 w-full max-w-3xl px-6 mt-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden' }}>
            {[
              { v: '20+', l: 'Businesses built' },
              { v: '8', l: 'Services, one person' },
              { v: '50+', l: 'Live software modules' },
              { v: '108', l: 'AI agents in BizOS' },
            ].map(({ v, l }) => (
              <div key={l} className="flex flex-col items-center justify-center py-5 px-4 gap-1" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-2xl md:text-3xl font-extrabold" style={{ color: '#D97757', fontFamily: 'Outfit, sans-serif' }}>{v}</span>
                <span className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>{l}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}>
          <div className="w-px h-12 mx-auto" style={{ background: 'linear-gradient(to bottom, rgba(217,119,87,0.4), transparent)' }} />
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          THE STACK — three layers
      ═══════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="text-center mb-14 max-w-2xl mx-auto"
        >
          <p className="text-xs font-bold tracking-[0.4em] uppercase mb-6" style={{ color: '#D97757', fontFamily: 'monospace' }}>How it all fits together</p>
          <h2 className="font-extrabold tracking-tight mb-5" style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2rem, 4.5vw, 3.4rem)', lineHeight: 1.05 }}>
            Three layers.<br />One person behind them.
          </h2>
          <p className="text-base md:text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Start wherever it hurts. A sharp tool for one painful problem, a platform that runs the whole
            operation, or a crew that gets you live fast — they’re built to flow into each other.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { kicker: 'The crew', title: 'JonnyAI Services', body: 'Brand, websites, apps, content, ads and automation — the agency that gets you live and keeps you growing.', cta: 'See services', href: '#services', accent: '#D97757' },
            { kicker: 'The entry blades', title: 'The HubSuite', body: 'Sharp, high-ticket software that kills one regulated pain fast — compliance, care, facilities. Audits in days, not weeks.', cta: 'Explore HubSuite', href: '#hubsuite', accent: '#5B8DEF' },
            { kicker: 'The flagship', title: 'BizOS', body: 'The unified, intelligent operating system for your whole business. The hubs are the door. BizOS is the building.', cta: 'Meet BizOS', href: '#bizos', accent: '#31C6A9' },
          ].map(({ kicker, title, body, cta, href, accent }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}>
              <Link
                href={href}
                className="group flex flex-col h-full p-9 rounded-2xl transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${accent}55`; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div className="w-10 h-1 rounded-full mb-5" style={{ background: accent }} />
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-3" style={{ color: accent, fontFamily: 'monospace' }}>{kicker}</p>
                <h3 className="text-2xl font-extrabold mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>{title}</h3>
                <p className="text-sm leading-relaxed flex-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{body}</p>
                <span className="mt-7 text-xs font-bold tracking-widest uppercase" style={{ color: accent }}>{cta} →</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SERVICES (the crew)
      ═══════════════════════════════════════════════════════════════ */}
      <section id="services" className="max-w-7xl mx-auto px-6 py-24 scroll-mt-24" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <p className="text-xs font-bold tracking-[0.4em] uppercase mb-6" style={{ color: '#D97757', fontFamily: 'monospace' }}>The full agency offering</p>
          <h2 className="font-extrabold tracking-tight mb-6" style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', lineHeight: 1.05 }}>
            Everything a marketing agency does.<br />Without the agency overhead.
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
            One person, AI-amplified. No account managers, no hand-offs, no waiting weeks for a reply.
            The brand, the build, the content and the campaigns — all from the person doing the work.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map(({ label, line, desc }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
              className="flex flex-col h-full p-7 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <span className="text-xs font-mono mb-3" style={{ color: 'rgba(255,255,255,0.25)' }}>{String(i + 1).padStart(2, '0')}</span>
              <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>{label}</h3>
              <p className="text-sm font-semibold mb-3" style={{ color: '#D97757' }}>{line}</p>
              <p className="text-sm leading-relaxed flex-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-12">
          <Link href="/brief" className="btn-citrus py-4 px-10 text-sm tracking-widest">START A PROJECT</Link>
          <Link href="/portfolio" className="btn-ghost py-4 px-10 text-sm tracking-widest">SEE THE WORK</Link>
        </div>
        <p className="text-center text-xs mt-6" style={{ color: 'rgba(255,255,255,0.3)' }}>
          One-off projects or monthly retainers — pick what fits.
        </p>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FLAGSHIP CASE STUDY — Little Joe's
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full overflow-hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(61,163,93,0.02)' }}>
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '4/3', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Image src="/portfolio/littlejoes/hero.svg" alt="Little Joe's Tree Services" fill className="object-cover object-center" />
              <div className="absolute top-5 left-5 px-3 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase rounded" style={{ background: 'rgba(61,163,93,0.25)', color: '#7FD89A', border: '1px solid rgba(61,163,93,0.4)', backdropFilter: 'blur(8px)' }}>
                Flagship · Full Studio Build
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1 }} className="flex flex-col gap-6">
              <p className="text-xs font-bold tracking-[0.4em] uppercase" style={{ color: '#3DA35D', fontFamily: 'monospace' }}>Case Study · Little Joe&apos;s Tree Services</p>
              <h2 className="font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: 1.05 }}>
                A great tree team,<br /><span style={{ color: '#3DA35D' }}>invisible online.</span><br />Not anymore.
              </h2>
              <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                NPTC-qualified, fully insured, brilliant on the tools — but living off word-of-mouth
                with no real brand. I gave them the works: a new logo and identity, a fast lead-gen
                website covering 25+ Hampshire towns, a content day on site cutting reels of the
                team in the trees, and a Google Ads campaign hitting the hottest postcodes.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { v: '25+', l: 'Areas covered' },
                  { v: '100+', l: 'Reviews' },
                  { v: '24/7', l: 'Emergency line' },
                  { v: 'Full', l: 'Brand · Web · Film · Ads' },
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
          HUBSUITE — entry blades
      ═══════════════════════════════════════════════════════════════ */}
      <section id="hubsuite" className="w-full overflow-hidden relative scroll-mt-24" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(91,141,239,0.025)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(91,141,239,0.07) 0%, transparent 70%)' }} />
        <div className="relative max-w-7xl mx-auto px-6 py-28">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full" style={{ background: 'rgba(91,141,239,0.1)', border: '1px solid rgba(91,141,239,0.25)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#22C55E', boxShadow: '0 0 8px rgba(34,197,94,0.8)' }} />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: '#7BA5F2', fontFamily: 'monospace' }}>The HubSuite · Live in production</span>
            </div>
            <h2 className="font-extrabold tracking-tight mb-5" style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2.2rem, 5vw, 4rem)', lineHeight: 1.0 }}>
              Sharp blades for<br /><span style={{ color: '#7BA5F2' }}>one regulated pain.</span>
            </h2>
            <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
              When the pressure is real — an inspection looming, a CQC visit, a stack of statutory
              obligations — you don’t want a platform project. You want the pain gone this week.
              Each HubSuite product does exactly that.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {hubSuite.map(({ name, blurb, pain, url, accent }, i) => (
              <motion.div key={name} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }} className="flex flex-col rounded-xl p-7" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="w-10 h-1 rounded-full mb-5" style={{ background: accent }} />
                <h3 className="text-2xl font-extrabold mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>{name}</h3>
                <p className="text-xs font-semibold mb-4 uppercase tracking-wider" style={{ color: accent }}>{pain}</p>
                <p className="text-sm leading-relaxed flex-1 mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>{blurb}</p>
                <a href={url} target="_blank" rel="noopener noreferrer" className="w-full text-center py-2.5 px-4 rounded-lg text-xs font-bold tracking-widest uppercase transition-all duration-200" style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${accent}55`, color: accent }}>
                  Visit site →
                </a>
              </motion.div>
            ))}
          </div>

          {/* Upsell to BizOS */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-between gap-6 p-7 rounded-2xl" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(49,198,169,0.25)' }}>
            <div className="text-center sm:text-left">
              <p className="text-sm font-semibold mb-1" style={{ color: '#fff' }}>The hubs are the door. BizOS is the building.</p>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Start with one blade to solve today’s pain. When you’re ready to run the whole operation
                from one place, every hub folds into the BizOS platform — same data, one brain.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap justify-center shrink-0">
              <a href={hubSuiteUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-all duration-200" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)' }}>
                View the suite
              </a>
              <Link href="#bizos" className="px-6 py-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-all duration-200" style={{ background: '#31C6A9', color: '#04211c' }}>
                Meet BizOS →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          BIZOS — the flagship
      ═══════════════════════════════════════════════════════════════ */}
      <section id="bizos" className="w-full overflow-hidden relative scroll-mt-24" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <AtmosphereField intensity={0.4} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 90% 60% at 50% 0%, rgba(217,119,87,0.1) 0%, rgba(49,198,169,0.05) 40%, transparent 75%)' }} />
        <div className="relative max-w-7xl mx-auto px-6 py-32">

          {/* Intro */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full" style={{ background: 'rgba(217,119,87,0.1)', border: '1px solid rgba(217,119,87,0.25)' }}>
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: '#D97757', fontFamily: 'monospace' }}>The Flagship</span>
            </div>
            <h2 className="font-extrabold tracking-tight mb-6" style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2.4rem, 6vw, 4.5rem)', lineHeight: 0.98 }}>
              BizOS — the one brain<br />
              <span style={{ color: '#D97757', textShadow: '0 0 80px rgba(217,119,87,0.35)' }}>for your whole business.</span>
            </h2>
            <p className="text-base md:text-xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Most businesses run on a dozen disconnected apps that don’t talk to each other.
              BizOS replaces the lot with one intelligent operating system — built around how you
              actually work, white-labelled to your brand, and watched over by AI that never sleeps.
            </p>
          </motion.div>

          {/* Live stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="grid grid-cols-2 md:grid-cols-4 mb-20 rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {bizosLive.map(({ v, l }) => (
              <div key={l} className="flex flex-col items-center justify-center py-7 px-4 gap-1.5 text-center" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-3xl md:text-4xl font-extrabold" style={{ color: '#D97757', fontFamily: 'Outfit, sans-serif' }}>{v}</span>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{l}</span>
              </div>
            ))}
          </motion.div>

          {/* What it is / four pillars */}
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center text-xs font-bold tracking-[0.4em] uppercase mb-10" style={{ color: '#D97757', fontFamily: 'monospace' }}>
            What it is, in plain English
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-20">
            {bizosPillars.map(({ title, body }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: (i % 2) * 0.1 }} className="p-8 rounded-2xl" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Outfit, sans-serif', color: '#fff' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{body}</p>
              </motion.div>
            ))}
          </div>

          {/* How it works simply */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="rounded-2xl p-9 md:p-12 mb-12" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-xs font-bold tracking-[0.4em] uppercase mb-8" style={{ color: '#31C6A9', fontFamily: 'monospace' }}>How it works, simply</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { n: '01', t: 'Pick your modules', b: 'Choose from 85+ ready modules — over 50 already live. Care, compliance, FM, finance, jobs, CRM. Switch on what you need; leave the rest.' },
                { n: '02', t: 'We shape it to you', b: 'The Section Builder tailors screens, fields and workflows to your business at runtime — no rebuild, no big dev project, no waiting.' },
                { n: '03', t: 'The brain takes over', b: 'JAIOS — 108 AI agents — drafts the work, watches live signals, and answers questions in plain English. You stay in control; nothing risky happens on its own.' },
              ].map(({ n, t, b }) => (
                <div key={n}>
                  <div className="text-5xl font-extrabold mb-4 leading-none" style={{ color: 'rgba(217,119,87,0.15)', fontFamily: 'Outfit, sans-serif' }}>{n}</div>
                  <h4 className="text-lg font-bold mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>{t}</h4>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{b}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Why it matters + CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="flex flex-col items-center text-center gap-7">
            <h3 className="font-extrabold tracking-tight max-w-3xl" style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)', lineHeight: 1.1 }}>
              Why it matters: <span style={{ color: 'rgba(255,255,255,0.4)' }}>one place to run everything, and it runs itself when you’re not looking.</span>
            </h3>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/bizos" className="btn-citrus py-4 px-10 text-sm tracking-widest">EXPLORE BIZOS</Link>
              <Link href="/brief" className="btn-ghost py-4 px-10 text-sm tracking-widest">BOOK A WALKTHROUGH</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          HOW IT ALL WORKS TOGETHER
      ═══════════════════════════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-6 py-28" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-14">
          <p className="text-xs font-bold tracking-[0.4em] uppercase mb-6" style={{ color: '#D97757', fontFamily: 'monospace' }}>The whole picture</p>
          <h2 className="font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2rem, 4.5vw, 3.4rem)', lineHeight: 1.05 }}>
            One door in. Room to grow into.
          </h2>
        </motion.div>
        <div className="flex flex-col gap-4">
          {[
            { step: 'You arrive with a problem', body: 'A brand that looks tired, a website that doesn’t sell, an inspection that’s overdue, or admin that’s eating your week.' },
            { step: 'We pick the right tool', body: 'Maybe it’s a rebrand and a content day. Maybe it’s a HubSuite blade to make the compliance pain disappear this week. We start where it counts.' },
            { step: 'It grows with you', body: 'The website feeds the automations. The hub becomes a room in BizOS. The AI starts drafting the work. Everything you build connects to everything else.' },
            { step: 'You run on one brain', body: 'Brand, marketing, operations and intelligence in one place — kept fed by the crew, watched over by the swarm, owned and branded by you.' },
          ].map(({ step, body }, i) => (
            <motion.div key={step} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }} className="flex items-start gap-5 p-6 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-xl font-extrabold shrink-0 w-10" style={{ color: '#D97757', fontFamily: 'Outfit, sans-serif' }}>{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="text-lg font-bold mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>{step}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          MORE WORK
      ═══════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <p className="text-xs font-bold tracking-[0.4em] uppercase mb-6" style={{ color: '#D97757', fontFamily: 'monospace' }}>Real Work</p>
          <h2 className="font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', lineHeight: 1.05 }}>
            Clients. Results.<br />No case study theatre.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {work.map(({ client, sector, result, href, live }, i) => (
            <motion.div key={client} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }} className="flex flex-col h-full p-8 rounded-xl transition-all duration-300" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-xl font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>{client}</p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>{sector}</p>
                </div>
                <span className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ background: '#22C55E', boxShadow: '0 0 10px rgba(34,197,94,0.7)' }} />
              </div>
              <p className="text-base leading-relaxed flex-1" style={{ color: 'rgba(255,255,255,0.55)' }}>{result}</p>
              <div className="mt-6 flex items-center gap-5">
                <Link href={href} className="text-xs font-bold tracking-widest uppercase" style={{ color: '#D97757' }}>View →</Link>
                {live && (
                  <a href={live} target="_blank" rel="noopener noreferrer" className="text-xs font-bold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Live site ↗
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link href="/portfolio" className="btn-ghost py-4 px-10 text-sm tracking-widest">SEE ALL WORK</Link>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          ABOUT TEASER — one-man agency
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full overflow-hidden relative" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(217,119,87,0.02)' }}>
        <div className="max-w-5xl mx-auto px-6 py-28">
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 items-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative w-36 h-36 md:w-44 md:h-44 rounded-2xl overflow-hidden mx-auto md:mx-0" style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
              <Image src="/jonny-profile.png" alt="Jonny Allum" fill className="object-cover" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }} className="flex flex-col gap-5 text-center md:text-left">
              <p className="text-xs font-bold tracking-[0.4em] uppercase" style={{ color: '#D97757', fontFamily: 'monospace' }}>The one-man agency</p>
              <h2 className="font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 3rem)', lineHeight: 1.05 }}>
                You hire me. You get me.
              </h2>
              <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                I’m Jonny Allum — a one-man, AI-native digital marketing agency. No account managers, no
                juniors learning on your budget, no being passed around. I’ve run real businesses, and I
                build the software the big platforms charge a fortune for. When you work with me, you work
                with the person doing the work.
              </p>
              <div className="flex justify-center md:justify-start">
                <Link href="/about" className="btn-ghost py-3 px-8 text-xs tracking-widest">MORE ABOUT ME →</Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(217,119,87,0.1) 0%, transparent 70%)' }} />
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative z-10 max-w-3xl mx-auto px-6 py-40 text-center flex flex-col items-center gap-8">
          <p className="text-xs font-bold tracking-[0.4em] uppercase" style={{ color: '#D97757', fontFamily: 'monospace' }}>Ready?</p>
          <h2 className="font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 1.0 }}>
            Let&apos;s make your business{' '}<br />
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>look the part.</span>
          </h2>
          <p className="text-lg max-w-xl" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Tell me what you do and what you need. I&apos;ll come back with a clear plan —
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
              ['HubSuite', '/#hubsuite'],
              ['BizOS', '/bizos'],
              ['Work', '/portfolio'],
              ['About', '/about'],
              ['Blog', '/blog'],
              ['Contact', '/brief'],
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
