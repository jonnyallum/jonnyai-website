'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { music, socials } from '@/lib/data/ecosystem';
import {
  SpotifyIcon,
  AppleMusicIcon,
  YouTubeIcon,
  StreamingPill,
} from '@/components/StreamingIcons';

/* ── Animated equalizer bars — pure CSS, GPU-friendly ── */
function Equalizer({ className = '' }: { className?: string }) {
  const bars = [0.2, 0.55, 0.35, 0.8, 0.45, 0.95, 0.3, 0.7, 0.5, 0.25, 0.65, 0.4];
  return (
    <div aria-hidden className={`flex items-end gap-[3px] h-6 ${className}`}>
      {bars.map((d, i) => (
        <span
          key={i}
          className="eqbar w-[3px] rounded-full"
          style={{
            background: '#1DB954',
            height: '100%',
            transformOrigin: 'bottom',
            animation: `eq 1.1s ease-in-out ${d}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes eq { 0%,100% { transform: scaleY(0.25); opacity:0.65 } 50% { transform: scaleY(1); opacity:1 } }
        @media (prefers-reduced-motion: reduce) { .eqbar { animation: none !important; transform: scaleY(0.5) } }
      `}</style>
    </div>
  );
}

/* ── Spinning vinyl disc behind the portrait ── */
function Vinyl() {
  return (
    <div
      aria-hidden
      className="vinyl absolute -z-10 rounded-full"
      style={{
        width: '118%',
        height: '118%',
        top: '-9%',
        left: '-9%',
        background:
          'repeating-radial-gradient(circle at 50% 50%, #0a0a0a 0px, #0a0a0a 2px, #151515 3px, #0a0a0a 4px)',
        boxShadow: '0 0 80px rgba(217,119,87,0.18), inset 0 0 60px rgba(0,0,0,0.9)',
        border: '1px solid rgba(255,255,255,0.06)',
        animation: 'spin 14s linear infinite',
      }}
    >
      <div
        className="absolute rounded-full"
        style={{
          width: '34%',
          height: '34%',
          top: '33%',
          left: '33%',
          background: 'radial-gradient(circle, #D97757 0%, #b85a3c 55%, #0a0a0a 60%)',
          border: '3px solid #0a0a0a',
        }}
      />
      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @media (prefers-reduced-motion: reduce) { .vinyl { animation: none !important } }
      `}</style>
    </div>
  );
}

const releases = [
  { tag: 'Single', note: 'Streaming now on Spotify' },
  { tag: 'Visualiser', note: 'Watch on YouTube' },
  { tag: 'More incoming', note: 'New drops loading' },
];

export default function MusicPage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">

      {/* ───────────────────────── HERO ───────────────────────── */}
      <section className="relative min-h-[100svh] flex items-start md:items-center px-6 pt-28 pb-40 md:pb-20 overflow-hidden">
        {/* Cinematic backdrop */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 70% 25%, rgba(217,119,87,0.18) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 20% 80%, rgba(29,185,84,0.12) 0%, transparent 60%), #000',
          }}
        />
        {/* Soft film grain / vignette */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 md:gap-16 items-center">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-7 text-center md:text-left order-2 md:order-1"
          >
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <Equalizer />
              <span
                className="text-[11px] font-bold tracking-[0.45em] uppercase"
                style={{ color: '#1DB954', fontFamily: 'monospace' }}
              >
                Now streaming
              </span>
            </div>

            <h1
              className="font-extrabold tracking-tight"
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: 'clamp(3rem, 9vw, 6.5rem)',
                lineHeight: 0.9,
              }}
            >
              Jonny<br />
              <span style={{ color: '#D97757' }}>Allum</span>
            </h1>

            <p
              className="text-sm font-bold tracking-[0.3em] uppercase"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              Record Producer · Artist
            </p>

            <p
              className="text-lg leading-relaxed max-w-md mx-auto md:mx-0"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              Cinematic, electronic-leaning productions built in the same studio as
              everything else I make. New music is live now — press play.
            </p>

            {/* Streaming pills */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <StreamingPill platform="spotify" href={music.spotify} sublabel="Listen now" />
              <StreamingPill platform="youtube" href={music.youtube} sublabel="Watch" />
              <StreamingPill platform="apple" href={music.appleMusic || undefined} />
            </div>
          </motion.div>

          {/* Portrait + vinyl */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="relative mx-auto order-1 md:order-2 w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80"
          >
            <Vinyl />
            <div
              className="relative w-full h-full rounded-full overflow-hidden"
              style={{
                border: '2px solid rgba(217,119,87,0.5)',
                boxShadow: '0 0 60px rgba(217,119,87,0.3), 0 30px 60px rgba(0,0,0,0.7)',
              }}
            >
              <Image
                src="/jonny-profile.png"
                alt="Jonny Allum — record producer"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="hidden sm:flex absolute bottom-7 left-1/2 -translate-x-1/2 flex-col items-center gap-2"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Press play
          </span>
          <span className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
        </motion.div>
      </section>

      {/* ──────────────────── LISTEN — SPOTIFY EMBED ──────────────────── */}
      <section className="relative px-6 py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex items-center justify-between gap-4 mb-8 flex-wrap"
          >
            <div className="flex items-center gap-3">
              <SpotifyIcon className="w-7 h-7" />
              <h2
                className="font-extrabold tracking-tight"
                style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.7rem, 4vw, 2.6rem)' }}
              >
                Listen on Spotify
              </h2>
            </div>
            <a
              href={music.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold tracking-widest uppercase transition-colors hover:text-white"
              style={{ color: '#1DB954' }}
            >
              Open full profile →
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}
          >
            <iframe
              title="Jonny Allum on Spotify"
              src={music.spotifyEmbed}
              width="100%"
              height="452"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              style={{ border: 0, display: 'block' }}
            />
          </motion.div>

          <p className="mt-4 text-center text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Follow on Spotify so new releases land in your feed the day they drop.
          </p>
        </div>
      </section>

      {/* ──────────────────── WATCH — YOUTUBE ──────────────────── */}
      <section className="relative px-6 py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-3 mb-8"
          >
            <YouTubeIcon className="w-7 h-7" />
            <h2
              className="font-extrabold tracking-tight"
              style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.7rem, 4vw, 2.6rem)' }}
            >
              Watch on YouTube
            </h2>
          </motion.div>

          <motion.a
            href={music.youtube}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="group relative block rounded-2xl overflow-hidden aspect-video"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <Image
              src="/jonny-profile.png"
              alt="Jonny Allum on YouTube"
              fill
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.85) 100%)',
              }}
            />
            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="flex items-center justify-center w-20 h-20 rounded-full transition-transform duration-300 group-hover:scale-110"
                style={{ background: '#FF0000', boxShadow: '0 10px 40px rgba(255,0,0,0.45)' }}
              >
                <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8 ml-1">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-lg font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  @jonny-allum
                </p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Music videos, visualisers & studio sessions
                </p>
              </div>
              <span
                className="hidden sm:inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full"
                style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}
              >
                Subscribe →
              </span>
            </div>
          </motion.a>
        </div>
      </section>

      {/* ──────────────────── LISTEN EVERYWHERE ──────────────────── */}
      <section className="relative px-6 py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-xs font-bold tracking-[0.4em] uppercase mb-12"
            style={{ color: '#D97757', fontFamily: 'monospace' }}
          >
            Listen everywhere
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { platform: 'spotify' as const, href: music.spotify, status: 'Live now', color: '#1DB954', Icon: SpotifyIcon },
              { platform: 'youtube' as const, href: music.youtube, status: 'Live now', color: '#FF0000', Icon: YouTubeIcon },
              { platform: 'apple' as const, href: music.appleMusic, status: 'Within 72 hrs', color: '#FA243C', Icon: AppleMusicIcon },
            ].map(({ platform, href, status, color, Icon }, i) => {
              const live = !!href;
              const card = (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="flex flex-col items-center gap-4 p-8 rounded-2xl h-full transition-colors hover:bg-white/[0.03]"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <span style={{ color: live ? color : 'rgba(255,255,255,0.3)' }}>
                    <Icon className="w-10 h-10" />
                  </span>
                  <p className="text-base font-bold capitalize" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {platform === 'apple' ? 'Apple Music' : platform}
                  </p>
                  <span
                    className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full"
                    style={{
                      background: live ? `${color}1f` : 'rgba(255,255,255,0.05)',
                      color: live ? color : 'rgba(255,255,255,0.4)',
                    }}
                  >
                    {status}
                  </span>
                </motion.div>
              );
              return live ? (
                <a key={platform} href={href} target="_blank" rel="noopener noreferrer" className="block">
                  {card}
                </a>
              ) : (
                <div key={platform}>{card}</div>
              );
            })}
          </div>

          <p className="mt-8 text-center text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Apple Music, Amazon &amp; the rest go live as distribution finishes rolling out — usually within 72 hours.
          </p>
        </div>
      </section>

      {/* ──────────────────── THE PRODUCER ──────────────────── */}
      <section
        className="relative px-6 py-28"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(217,119,87,0.02)' }}
      >
        <div className="max-w-3xl mx-auto text-center flex flex-col gap-7">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-bold tracking-[0.4em] uppercase"
            style={{ color: '#D97757', fontFamily: 'monospace' }}
          >
            The producer
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-extrabold tracking-tight"
            style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.9rem, 4.5vw, 3rem)', lineHeight: 1.05 }}
          >
            Same hands. Different instrument.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-lg leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            By day I build brands, websites and software as a one-man, AI-native studio. The
            same obsession with craft goes into the music — written, produced and finished in
            the studio, then released to the world. This is the start of the catalogue; follow
            along and watch it grow.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-wrap gap-3 justify-center mt-2"
          >
            <StreamingPill platform="spotify" href={music.spotify} />
            <StreamingPill platform="youtube" href={music.youtube} />
            <Link href="/about" className="btn-ghost py-3 px-7 text-xs tracking-widest rounded-full">
              More about Jonny →
            </Link>
          </motion.div>

          {/* Release ticker */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
            {releases.map(({ tag, note }) => (
              <div
                key={tag}
                className="p-4 rounded-xl text-left"
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: '#1DB954' }}>
                  {tag}
                </p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── FOOTER ──────────────────── */}
      <footer className="px-6 py-14" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-6 text-center">
          <Image src="/jai_logo_clean.png" alt="JonnyAI" width={90} height={28} className="object-contain" style={{ opacity: 0.5 }} />
          <div className="flex flex-wrap gap-5 justify-center">
            <a href={music.spotify} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-100 opacity-60" style={{ color: '#1DB954' }} aria-label="Spotify"><SpotifyIcon className="w-6 h-6" /></a>
            <a href={music.youtube} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-100 opacity-60" style={{ color: '#FF0000' }} aria-label="YouTube"><YouTubeIcon className="w-6 h-6" /></a>
            <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-100 opacity-40 text-white" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
          </div>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.18)', fontFamily: 'monospace' }}>
            © {new Date().getFullYear()} Jonny Allum · Music
          </p>
        </div>
      </footer>
    </main>
  );
}
