'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import OrbitalCanvas from '@/components/OrbitalCanvas';

const services = [
  {
    label: 'Private AI Install',
    icon: '⬡',
    price: 'From £997',
    desc: 'Your own AI system, installed on your hardware. Not a subscription. Not a chatbot. A private, configured intelligence that runs your workflows — yours forever.',
    href: '/install',
    badge: 'Most Popular',
  },
  {
    label: 'Website & App Build',
    icon: '◈',
    price: 'From £497',
    desc: 'Next.js websites and web apps built to convert. Fast, modern, and designed to make you look like the most serious operator in your industry.',
    href: '/build',
    badge: null,
  },
  {
    label: 'Automation Packs',
    icon: '⟳',
    price: 'From £297',
    desc: 'n8n workflows that eliminate repetitive work. Order processing, lead routing, invoice generation, stock sync — automated end-to-end.',
    href: '/automate',
    badge: null,
  },
  {
    label: 'YouTube Automation',
    icon: '▶',
    price: '£500/mo',
    desc: '20 videos per month. Scripted, voiced, rendered, and uploaded — zero involvement from you. Meditation, education, and faceless content niches.',
    href: '/youtube',
    badge: null,
  },
  {
    label: 'AI Workforce',
    icon: '◎',
    price: '£1,000/mo',
    desc: 'A dedicated AI agent trained on your business — answering customer queries, qualifying leads, handling support. Runs 24/7. Never calls in sick.',
    href: '/workforce',
    badge: null,
  },
  {
    label: 'Empire OS',
    icon: '◆',
    price: 'From £1,997/mo',
    desc: 'Full-stack digital operation: AI systems, automation, content, analytics, and a dedicated team. For businesses ready to run at a different level.',
    href: '/empire',
    badge: 'Apply Only',
  },
];

const caseStudies = [
  {
    client: 'CD Waste',
    sector: 'Waste Management',
    result: 'Automated job ticketing and invoicing — cut admin time by 80%.',
  },
  {
    client: 'Construct FM',
    sector: 'Facilities Management',
    result: 'AI-generated estimate system. From 4-hour quotes to 12 minutes.',
  },
  {
    client: 'La Aesthetician',
    sector: 'Beauty & Aesthetics',
    result: 'Booking system, website, and automated follow-up sequences live in 5 days.',
  },
  {
    client: 'BL Motorcycles',
    sector: 'E-Commerce',
    result: '3,000+ eBay listings automated. Stock sync, pricing, and descriptions — zero manual entry.',
  },
];

const stats = [
  { value: '4+', label: 'Years building AI systems' },
  { value: '20+', label: 'Clients automated' },
  { value: '£0', label: 'Wasted on SaaS subscriptions' },
  { value: '24/7', label: 'Systems running right now' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-void text-white overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <OrbitalCanvas />

        <div className="relative z-10 flex flex-col items-center gap-8 pt-24">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative"
          >
            <div
              className="absolute inset-0 rounded-full blur-3xl"
              style={{ background: 'radial-gradient(ellipse, rgba(217,119,87,0.18) 0%, transparent 70%)', transform: 'scale(1.8)' }}
            />
            <Image
              src="/jai_logo_clean.png"
              alt="JonnyAI"
              width={160}
              height={50}
              className="relative object-contain"
              priority
            />
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            className="flex flex-col items-center gap-4"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none max-w-4xl" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Your Own AI.<br />
              <span style={{ color: '#D97757' }}>Built For Your Business.</span>
            </h1>
            <p className="text-base md:text-lg max-w-xl" style={{ color: 'rgba(255,255,255,0.5)' }}>
              We install private AI systems inside small businesses. Not subscriptions. Not chatbots. Real infrastructure — on your hardware, trained on your data, running your workflows.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: 'easeOut' }}
            className="flex flex-wrap gap-3 justify-center"
          >
            <Link href="/install" className="btn-citrus py-3 px-7 text-sm">
              See How It Works →
            </Link>
            <Link
              href="/brief"
              className="py-3 px-7 text-sm font-bold rounded-md border transition-all duration-200"
              style={{
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.7)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(217,119,87,0.4)';
                (e.currentTarget as HTMLAnchorElement).style.color = 'white';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.15)';
                (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.7)';
              }}
            >
              Get a Free Brief →
            </Link>
          </motion.div>

          {/* Live indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex items-center gap-2 text-xs"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            <span className="w-2 h-2 rounded-full bg-signal inline-block" style={{ boxShadow: '0 0 8px rgba(34,197,94,0.6)' }} />
            Systems live — UK-based, real clients, real results
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-4xl mt-20 grid grid-cols-2 md:grid-cols-4 gap-px"
          style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden' }}
        >
          {stats.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center justify-center gap-1 py-5 px-4" style={{ background: '#070708' }}>
              <span className="text-2xl md:text-3xl font-extrabold" style={{ color: '#D97757', fontFamily: 'Outfit, sans-serif' }}>{value}</span>
              <span className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── PROBLEM ── */}
      <section className="max-w-4xl mx-auto px-6 py-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-6" style={{ color: '#D97757', fontFamily: 'monospace' }}>The Problem</p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Most businesses are paying for AI they don't control.
          </h2>
          <p className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
            ChatGPT, Zapier, Make, Notion AI — you're renting access to someone else's system. Your data goes to their servers. The moment you stop paying, it stops working. And none of it is trained on how your business actually runs.
          </p>
          <p className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto mt-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
            We do the opposite. We build AI systems that live inside your business — on your hardware, behind your firewall, trained on your data. You own it. It runs even if we disappear.
          </p>
        </motion.div>
      </section>

      {/* ── SERVICES ── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: '#D97757', fontFamily: 'monospace' }}>What We Build</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>Six ways to install intelligence into your business.</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map(({ label, icon, price, desc, href, badge }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
            >
              <Link
                href={href}
                className="group block h-full p-6 rounded-xl transition-all duration-200 relative"
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(217,119,87,0.25)';
                  (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.07)';
                  (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
                }}
              >
                {badge && (
                  <span
                    className="absolute top-4 right-4 text-[10px] font-bold tracking-[0.15em] uppercase px-2 py-1 rounded"
                    style={{ background: badge === 'Apply Only' ? 'rgba(255,255,255,0.06)' : 'rgba(217,119,87,0.15)', color: badge === 'Apply Only' ? 'rgba(255,255,255,0.5)' : '#D97757' }}
                  >
                    {badge}
                  </span>
                )}
                <div className="text-2xl mb-4" style={{ color: '#D97757' }}>{icon}</div>
                <h3 className="text-lg font-bold mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>{label}</h3>
                <p className="text-sm font-semibold mb-3" style={{ color: '#D97757' }}>{price}</p>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{desc}</p>
                <div className="mt-5 text-xs font-bold" style={{ color: '#D97757' }}>Learn more →</div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="max-w-4xl mx-auto px-6 py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: '#D97757', fontFamily: 'monospace' }}>How It Works</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>From brief to live system in days — not months.</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Brief Us', body: 'Tell us what your business does, what slows you down, and what you want automated. Takes 10 minutes. No sales call.' },
            { step: '02', title: 'We Design & Build', body: "We scope the system, build it, and test it against your real workflows. You see it working before anything goes live." },
            { step: '03', title: 'We Install & Train You', body: 'We connect remotely (or on-site for enterprise), install the system, and walk your team through it. Then it runs.' },
          ].map(({ step, title, body }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative"
            >
              <div className="text-5xl font-extrabold mb-4 leading-none" style={{ color: 'rgba(217,119,87,0.15)', fontFamily: 'Outfit, sans-serif' }}>{step}</div>
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CASE STUDIES ── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: '#D97757', fontFamily: 'monospace' }}>Real Work</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>Clients. Results. No case study theatre.</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {caseStudies.map(({ client, sector, result }, i) => (
            <motion.div
              key={client}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="p-6 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>{client}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{sector}</p>
                </div>
                <span className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ background: '#22C55E', boxShadow: '0 0 8px rgba(34,197,94,0.6)' }} />
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{result}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="max-w-3xl mx-auto px-6 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center gap-6"
        >
          <p className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: '#D97757', fontFamily: 'monospace' }}>Ready?</p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Start with a brief.<br />
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>No call required.</span>
          </h2>
          <p className="text-base max-w-xl" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Tell us about your business and what you want to automate. We'll come back with a clear plan — scope, timeline, and price. No vague quotes. No sales patter.
          </p>
          <Link href="/brief" className="btn-citrus py-4 px-10 text-sm mt-2">
            Brief Us Now →
          </Link>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="border-t px-6 py-12"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Image src="/jai_logo_clean.png" alt="JonnyAI" width={90} height={28} className="object-contain opacity-60" />
          <div className="flex flex-wrap gap-6 text-xs justify-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <Link href="/install" className="hover:text-white transition-colors">Install</Link>
            <Link href="/build" className="hover:text-white transition-colors">Build</Link>
            <Link href="/automate" className="hover:text-white transition-colors">Automate</Link>
            <Link href="/youtube" className="hover:text-white transition-colors">YouTube</Link>
            <Link href="/workforce" className="hover:text-white transition-colors">Workforce</Link>
            <Link href="/empire" className="hover:text-white transition-colors">Empire</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            © {new Date().getFullYear()} JonnyAI. All rights reserved.
          </p>
        </div>
      </footer>

    </main>
  );
}
