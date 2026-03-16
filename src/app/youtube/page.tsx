'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
} as const;

const pipeline = [
  { n: '01', label: 'Topic Research', desc: 'AI identifies high-search, low-competition topics in your niche. Every video is built around a real keyword opportunity.' },
  { n: '02', label: 'Script Generation', desc: 'Full video script written — hook, content, call-to-action. Length calibrated for your format (short-form or long-form).' },
  { n: '03', label: 'Voice Synthesis', desc: 'Professional voiceover generated using ElevenLabs — natural, engaging, and consistent across every video.' },
  { n: '04', label: 'Video Render', desc: 'Script + voice + visuals assembled into a complete video. Branded intros, transitions, and captions included.' },
  { n: '05', label: 'Upload & Optimise', desc: 'Video uploaded to your channel with SEO-optimised title, description, tags, and thumbnail. Scheduled at optimal times.' },
];

const niches = [
  { name: 'Meditation & Mindfulness', desc: 'Sleep meditations, guided breathing, ambient journeys. High ad rates, passive audience, evergreen content.' },
  { name: 'Finance & Wealth', desc: 'Faceless explainer content on investing, saving, and financial independence. Algorithm-friendly and high CPM.' },
  { name: 'Motivational & Self-Help', desc: 'Short-form speeches, stoic philosophy, productivity content. Consistent demand, strong subscriber retention.' },
  { name: 'Niche Education', desc: 'How-to content for specific professional audiences. High authority, strong watch time, monetisation-ready quickly.' },
];

export default function YouTubePage() {
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
          <p className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: '#D97757', fontFamily: 'monospace' }}>YouTube Automation</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none" style={{ fontFamily: 'Outfit, sans-serif' }}>
            20 videos a month.<br />
            <span style={{ color: '#D97757' }}>Zero involvement from you.</span>
          </h1>
          <p className="text-base md:text-lg max-w-2xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            We run your faceless YouTube channel end-to-end — topic research, scripting, voiceover, rendering, uploading, and SEO optimisation. You receive ad revenue. You do nothing else.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            <Link href="/brief?service=youtube" className="btn-citrus py-3 px-8 text-sm">Start a Channel →</Link>
          </div>
          <div className="flex items-center gap-8 mt-4">
            {[['20', 'Videos/month'], ['£500', '/mo flat fee'], ['30 days', 'First upload']].map(([val, label]) => (
              <div key={label} className="text-center">
                <p className="text-xl font-extrabold" style={{ color: '#D97757', fontFamily: 'Outfit, sans-serif' }}>{val}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── PIPELINE ── */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <motion.div {...fadeUp} className="text-center mb-14">
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: '#D97757', fontFamily: 'monospace' }}>The Pipeline</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>Everything automated. Nothing outsourced to you.</h2>
        </motion.div>
        <div className="space-y-4">
          {pipeline.map(({ n, label, desc }, i) => (
            <motion.div
              key={n}
              {...fadeUp}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-6 p-6 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="text-3xl font-extrabold shrink-0 leading-none" style={{ color: 'rgba(217,119,87,0.2)', fontFamily: 'Outfit, sans-serif' }}>{n}</div>
              <div>
                <h3 className="text-base font-bold mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>{label}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── NICHES ── */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <motion.div {...fadeUp} className="text-center mb-14">
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: '#D97757', fontFamily: 'monospace' }}>Niches We Operate In</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>Built for faceless channels that scale.</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {niches.map(({ name, desc }, i) => (
            <motion.div
              key={name}
              {...fadeUp}
              transition={{ delay: i * 0.08 }}
              className="p-6 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <h3 className="text-base font-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>{name}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PRICING + CTA ── */}
      <section className="max-w-3xl mx-auto px-6 py-32 text-center border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <motion.div {...fadeUp} className="flex flex-col items-center gap-6">
          <p className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: '#D97757', fontFamily: 'monospace' }}>Pricing</p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
            £500/month.<br />
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>Flat. All in.</span>
          </h2>
          <p className="text-base max-w-xl" style={{ color: 'rgba(255,255,255,0.45)' }}>
            20 videos per month, every month. Research, scripting, voice, render, upload, SEO. No extras. Three clients at this rate covers a full-time salary at zero marginal effort after setup.
          </p>
          <Link href="/brief?service=youtube" className="btn-citrus py-4 px-10 text-sm mt-2">
            Start Your Channel →
          </Link>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>First video live within 30 days · Rolling monthly · Cancel anytime</p>
        </motion.div>
      </section>

    </main>
  );
}
