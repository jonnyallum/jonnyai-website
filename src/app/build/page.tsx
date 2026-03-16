'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
} as const;

const services = [
  {
    name: 'Marketing Website',
    price: 'From £497',
    desc: 'Clean, fast, conversion-focused. Built in Next.js with Tailwind. SEO foundations included. Live in 5–7 days.',
    examples: 'Agency sites, consultant portfolios, service businesses',
  },
  {
    name: 'E-Commerce Store',
    price: 'From £997',
    desc: 'Custom Shopify or Next.js storefront. Product pages that convert, checkout that works, and integrations to your fulfilment stack.',
    examples: 'Product businesses, wholesale, B2B catalogues',
  },
  {
    name: 'Web Application',
    price: 'From £1,997',
    desc: 'Full-stack Next.js app with database, auth, and API. Client portals, booking systems, internal tools, dashboards.',
    examples: 'SaaS MVPs, client portals, internal dashboards',
  },
  {
    name: 'Landing Page',
    price: 'From £297',
    desc: 'Single-purpose, high-converting. Designed around one action — sign up, book, buy, or contact. Delivered in 48 hours.',
    examples: 'Product launches, lead gen, ad campaigns',
  },
];

const stack = ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Vercel', 'Framer Motion', 'Stripe'];

const clients = [
  { name: 'BL Motorcycles', type: 'E-commerce', result: 'Full e-commerce site, admin dashboard, eBay sync — launched in 3 weeks.' },
  { name: 'Construct FM', type: 'Web App', result: 'AI estimate generator — cut quoting time from 4 hours to 12 minutes.' },
  { name: 'La Aesthetician', type: 'Marketing Site', result: 'Booking system and client portal — live in 5 days.' },
];

export default function BuildPage() {
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
          <p className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: '#D97757', fontFamily: 'monospace' }}>Website & App Build</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Built to convert.<br />
            <span style={{ color: '#D97757' }}>Shipped to deadline.</span>
          </h1>
          <p className="text-base md:text-lg max-w-2xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Fast, modern websites and web applications built on the right stack. No templates, no WordPress, no page builders. Real code, real performance, real results.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            <Link href="/brief?service=build" className="btn-citrus py-3 px-8 text-sm">Get a Quote →</Link>
          </div>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>From £297 · Fixed price · Delivered on time</p>
        </motion.div>
      </section>

      {/* ── SERVICES ── */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <motion.div {...fadeUp} className="text-center mb-14">
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: '#D97757', fontFamily: 'monospace' }}>What We Build</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>Four types of digital product. All fixed price.</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {services.map(({ name, price, desc, examples }, i) => (
            <motion.div
              key={name}
              {...fadeUp}
              transition={{ delay: i * 0.08 }}
              className="p-7 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-xl font-extrabold" style={{ fontFamily: 'Outfit, sans-serif' }}>{name}</h3>
                <span className="text-base font-bold shrink-0" style={{ color: '#D97757' }}>{price}</span>
              </div>
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>{desc}</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace' }}>e.g. {examples}</p>
              <Link href={`/brief?service=build&type=${encodeURIComponent(name)}`} className="block mt-4 text-xs font-bold" style={{ color: '#D97757' }}>
                Get a Quote →
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── STACK ── */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <motion.div {...fadeUp} className="text-center mb-10">
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: '#D97757', fontFamily: 'monospace' }}>The Stack</p>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>Modern tools. No compromise.</h2>
        </motion.div>
        <motion.div {...fadeUp} className="flex flex-wrap justify-center gap-3">
          {stack.map(tech => (
            <span
              key={tech}
              className="px-4 py-2 rounded-lg text-sm font-bold"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </section>

      {/* ── PROOF ── */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <motion.div {...fadeUp} className="text-center mb-12">
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: '#D97757', fontFamily: 'monospace' }}>Built & Shipped</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>Real projects. Real results.</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {clients.map(({ name, type, result }, i) => (
            <motion.div
              key={name}
              {...fadeUp}
              transition={{ delay: i * 0.08 }}
              className="p-6 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <p className="font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>{name}</p>
                <span className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ background: '#22C55E', boxShadow: '0 0 8px rgba(34,197,94,0.6)' }} />
              </div>
              <p className="text-xs mb-3" style={{ color: '#D97757', fontFamily: 'monospace' }}>{type}</p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{result}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-3xl mx-auto px-6 py-32 text-center border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <motion.div {...fadeUp} className="flex flex-col items-center gap-6">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Ready to build something?<br />
            <span style={{ color: '#D97757' }}>Brief us in 10 minutes.</span>
          </h2>
          <p className="text-base max-w-xl" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Tell us what you need. We'll scope it, price it, and send you a fixed proposal within 48 hours. No discovery calls unless you want one.
          </p>
          <Link href="/brief?service=build" className="btn-citrus py-4 px-10 text-sm mt-2">
            Start Your Brief →
          </Link>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>Fixed price · No scope creep · Delivered on time</p>
        </motion.div>
      </section>

    </main>
  );
}
