'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { liveProjects, hubSuite, socials, hubSuiteUrl, music } from '@/lib/data/ecosystem';
import AtmosphereField from '@/components/AtmosphereField';
import { SpotifyIcon, AppleMusicIcon, YouTubeIcon, StreamingPill } from '@/components/StreamingIcons';

const beliefs = [
  { t: 'You hire me, you get me', b: 'No account managers, no juniors learning on your budget, no being passed around a team. The person you brief is the person who does the work.' },
  { t: 'AI-amplified, not AI-instead', b: 'I use my own AI tooling and a 108-agent system to move at the speed of a full agency — but a human with taste signs off on everything that ships.' },
  { t: 'I’ve run real businesses', b: 'Mobile catering, a motorcycle workshop, national pub refits, trade carpentry. I know what the bottlenecks feel like from the inside — so the work actually fits.' },
  { t: 'One studio, the whole job', b: 'Brand, website, app, content, ads, SEO and automation under one roof. No finger-pointing between five suppliers when something breaks.' },
];

const skills = [
  { label: 'Brand & creative', items: ['Logos & identity', 'Rebrands', 'On-site filming', 'Vertical reels'] },
  { label: 'Build', items: ['Next.js websites', 'React Native apps', 'E-commerce', 'Custom tools'] },
  { label: 'Marketing', items: ['Paid media', 'Local & technical SEO', 'Social', 'Email & lifecycle'] },
  { label: 'AI & software', items: ['Private AI & automation', 'The HubSuite', 'BizOS platform', 'Multi-agent systems'] },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-void text-white overflow-x-hidden">

      {/* HERO */}
      <section className="relative overflow-hidden px-6 pt-36 pb-20">
        <AtmosphereField intensity={0.45} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(217,119,87,0.1) 0%, transparent 70%)' }} />
        <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[auto_1fr] gap-12 items-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative w-44 h-44 md:w-52 md:h-52 rounded-2xl overflow-hidden mx-auto md:mx-0" style={{ border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 0 60px rgba(217,119,87,0.2)' }}>
            <Image src="/jonny-profile.png" alt="Jonny Allum" fill className="object-cover" priority />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="flex flex-col gap-5 text-center md:text-left">
            <p className="text-xs font-bold tracking-[0.4em] uppercase" style={{ color: '#D97757', fontFamily: 'monospace' }}>About · Jonny Allum</p>
            <h1 className="font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2.4rem, 6vw, 4.5rem)', lineHeight: 0.98 }}>
              A one-man,<br /><span style={{ color: '#D97757' }}>AI-native</span> agency.
            </h1>
            <p className="text-lg leading-relaxed max-w-xl" style={{ color: 'rgba(255,255,255,0.55)' }}>
              I’m Jonny. JonnyAI is me — a single operator who brands, builds, films and automates for
              ambitious businesses, and ships a software line of my own. Big-agency output, one
              accountable person.
            </p>
          </motion.div>
        </div>
      </section>

      {/* STORY */}
      <section className="max-w-3xl mx-auto px-6 py-20" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="flex flex-col gap-6 text-base md:text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
          <p className="text-xs font-bold tracking-[0.4em] uppercase mb-2" style={{ color: '#D97757', fontFamily: 'monospace' }}>The story</p>
          <p>I didn’t come to this from a marketing department. I came from running real businesses — mobile catering, a motorcycle workshop, national pub refits, trade carpentry, community operations. I’ve done the quotes, the payroll, the stock, the compliance, the late nights.</p>
          <p>So when a website doesn’t bring in calls, or admin eats the whole week, or an inspection looms — I’ve felt all of it. That’s the difference. I build the brand, the site and the automation the way I’d want them if it were my own shop. Because it usually has been.</p>
          <p>A few years ago I started building multi-agent AI systems — not chatbots, but coordinated teams of AI specialists that handle the full spread of product and marketing work. It meant one person could move at the pace of a whole agency. That’s how a single operator now delivers branding, websites, apps, content, campaigns <span className="text-white/90">and</span> production-grade software.</p>
          <p>It’s also how the <Link href="/bizos" className="underline decoration-citrus/40 hover:decoration-citrus" style={{ color: '#D97757' }}>BizOS</Link> platform and the <a href={hubSuiteUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-citrus/40 hover:decoration-citrus" style={{ color: '#D97757' }}>HubSuite</a> exist — real software, live in production, built and run by one person with the right systems.</p>
        </motion.div>
      </section>

      {/* NOW PRODUCING MUSIC */}
      <section className="max-w-5xl mx-auto px-6 py-20" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8"
          style={{
            background: 'linear-gradient(135deg, rgba(29,185,84,0.07) 0%, rgba(217,119,87,0.05) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Streaming icon cluster */}
          <div className="flex items-center gap-4 shrink-0">
            <a href={music.spotify} target="_blank" rel="noopener noreferrer" aria-label="Spotify" className="transition-transform hover:scale-110" style={{ color: '#1DB954' }}>
              <SpotifyIcon className="w-10 h-10" />
            </a>
            <a href={music.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="transition-transform hover:scale-110" style={{ color: '#FF0000' }}>
              <YouTubeIcon className="w-10 h-10" />
            </a>
            <span aria-label="Apple Music — coming soon" title="Apple Music — coming soon" style={{ color: 'rgba(255,255,255,0.3)' }}>
              <AppleMusicIcon className="w-10 h-10" />
            </span>
          </div>

          <div className="flex-1 text-center md:text-left">
            <p className="text-xs font-bold tracking-[0.4em] uppercase mb-3" style={{ color: '#1DB954', fontFamily: 'monospace' }}>
              New chapter · Music
            </p>
            <h3 className="text-2xl md:text-3xl font-extrabold mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
              I&apos;m also a record producer.
            </h3>
            <p className="text-sm md:text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              New music streaming now on Spotify and YouTube — Apple Music lands within 72 hours.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <StreamingPill platform="spotify" href={music.spotify} sublabel="Listen now" />
            <Link href="/music" className="btn-citrus py-3 px-7 text-xs tracking-widest rounded-full text-center">
              The music →
            </Link>
          </div>
        </motion.div>
      </section>

      {/* BELIEFS */}
      <section className="max-w-6xl mx-auto px-6 py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-14">
          <p className="text-xs font-bold tracking-[0.4em] uppercase mb-6" style={{ color: '#D97757', fontFamily: 'monospace' }}>How I work</p>
          <h2 className="font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', lineHeight: 1.05 }}>
            The one-man advantage.
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {beliefs.map(({ t, b }, i) => (
            <motion.div key={t} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: (i % 2) * 0.1 }} className="p-8 rounded-2xl" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>{t}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{b}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WHAT I DO */}
      <section className="max-w-6xl mx-auto px-6 py-20" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center text-xs font-bold tracking-[0.4em] uppercase mb-12" style={{ color: '#D97757', fontFamily: 'monospace' }}>
          What I do under one roof
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {skills.map(({ label, items }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: (i % 4) * 0.06 }} className="p-6 rounded-xl" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <h3 className="text-sm font-bold mb-4 uppercase tracking-wider" style={{ fontFamily: 'Outfit, sans-serif', color: '#D97757' }}>{label}</h3>
              <ul className="flex flex-col gap-2">
                {items.map(it => (
                  <li key={it} className="text-sm flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    <span className="w-1 h-1 rounded-full" style={{ background: '#D97757' }} />{it}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* THE ECOSYSTEM — backlinks */}
      <section className="w-full relative overflow-hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(217,119,87,0.02)' }}>
        <div className="max-w-6xl mx-auto px-6 py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-14">
            <p className="text-xs font-bold tracking-[0.4em] uppercase mb-6" style={{ color: '#D97757', fontFamily: 'monospace' }}>Live in the wild</p>
            <h2 className="font-extrabold tracking-tight mb-5" style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', lineHeight: 1.05 }}>
              Real sites. Real products.<br />All built by one person.
            </h2>
            <p className="text-base max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
              A selection of the websites, apps and platforms I’ve shipped — every one live, every one a link you can click.
            </p>
          </motion.div>

          {/* Products */}
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-4" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>Software products</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
            {hubSuite.map(({ name, blurb, url, accent }) => (
              <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="flex flex-col p-6 rounded-xl transition-colors hover:bg-white/[0.04]" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="w-8 h-1 rounded-full mb-4" style={{ background: accent }} />
                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>{name}</h3>
                <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>{blurb}</p>
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: accent }}>Visit →</span>
              </a>
            ))}
          </div>

          {/* Projects */}
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-4" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>Websites &amp; projects</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {liveProjects.map(({ name, url, blurb, status }) => (
              <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="group flex items-start justify-between gap-4 p-5 rounded-xl transition-colors hover:bg-white/[0.04]" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>{name}</h3>
                    <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: status === 'live' ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.06)', color: status === 'live' ? '#7FD89A' : 'rgba(255,255,255,0.4)' }}>{status}</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{blurb}</p>
                </div>
                <span className="text-citrus text-sm shrink-0 transition-transform group-hover:translate-x-0.5">↗</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(217,119,87,0.1) 0%, transparent 70%)' }} />
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative z-10 max-w-3xl mx-auto px-6 py-36 text-center flex flex-col items-center gap-8">
          <h2 className="font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2.2rem, 5.5vw, 4rem)', lineHeight: 1.0 }}>
            Work with the person<br /><span style={{ color: 'rgba(255,255,255,0.35)' }}>doing the work.</span>
          </h2>
          <p className="text-lg max-w-xl" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Tell me what you’re trying to build or fix. I’ll come back with a clear, fixed-price plan — no sales patter.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/brief" className="btn-citrus py-5 px-12 text-sm tracking-widest">START A PROJECT</Link>
            <Link href="/portfolio" className="btn-ghost py-5 px-12 text-sm tracking-widest">SEE THE WORK</Link>
          </div>
          <div className="flex flex-wrap gap-6 justify-center mt-4 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
            <a href={socials.github} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
            <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
            <a href={socials.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">YouTube</a>
            <a href={music.spotify} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Spotify</a>
            <Link href="/music" className="hover:text-white transition-colors">Music</Link>
            <Link href="/card" className="hover:text-white transition-colors">Digital card</Link>
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
