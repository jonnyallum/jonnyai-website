'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { useMode, type Mode } from '@/context/ModeContext';

const navLinks = [
  { label: 'The Build', href: '#build' },
  { label: 'The Traffic', href: '#traffic' },
  { label: 'The Workforce', href: '#workforce' },
  { label: 'AgentPort', href: '/agentport' },
  { label: 'Empire OS', href: '/empire' },
  { label: 'Review Coach', href: '/review-coach' },
  { label: 'AI Firewall', href: '/ai-firewall' },
  { label: 'Blog', href: '/blog' },
];

const modeConfig: Record<Mode, { label: string; activeClass: string; textClass: string }> = {
  nerds:  { label: 'Nerds',      activeClass: 'bg-citrus text-void',    textClass: 'text-citrus' },
  public: { label: 'Joe Public', activeClass: 'bg-white/80 text-void',  textClass: 'text-white' },
  idiots: { label: '🤪 Idiots',  activeClass: 'bg-yellow-400 text-black', textClass: 'text-yellow-400' },
};

function ModeToggle() {
  const { mode, setMode } = useMode();
  const [showBubble, setShowBubble] = useState(true);

  // Hide bubble once the user has dismissed or switched to idiots
  useEffect(() => {
    if (mode === 'idiots') setShowBubble(false);
  }, [mode]);

  return (
    <div className="relative flex flex-col items-center">
      {/* 3-segment pill */}
      <div className="flex bg-white/5 border border-white/10 rounded-full p-0.5 gap-0.5">
        {(Object.keys(modeConfig) as Mode[]).map((m) => {
          const cfg = modeConfig[m];
          const isActive = mode === m;
          return (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`relative px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider rounded-full transition-all duration-200 whitespace-nowrap ${
                isActive ? `${cfg.activeClass} font-bold` : 'text-white/30 hover:text-white/60'
              }`}
            >
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Speech bubble — shows when not in idiots mode */}
      <AnimatePresence>
        {showBubble && mode !== 'idiots' && (
          <motion.button
            initial={{ opacity: 0, y: -4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.9 }}
            transition={{ delay: 1.2, duration: 0.3 }}
            onClick={() => { setMode('idiots'); setShowBubble(false); }}
            className="absolute top-full mt-2.5 whitespace-nowrap z-50 cursor-pointer group"
          >
            {/* Upward triangle pointer */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-yellow-400/15 border-l border-t border-yellow-400/30 rotate-45 rounded-tl-sm" />
            <div className="bg-yellow-400/10 border border-yellow-400/25 rounded-lg px-3 py-1.5 text-[10px] text-yellow-300/80 group-hover:bg-yellow-400/20 group-hover:text-yellow-300 transition-colors">
              don&apos;t get it? click here 👆
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function GlassNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { mode, setMode } = useMode();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-void/90 backdrop-blur-xl border-b border-white/8' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image src="/jai_logo_clean.png" alt="JonnyAi" width={120} height={38} className="object-contain" />
          <span className="hidden sm:block text-[9px] font-mono uppercase tracking-[0.2em] text-citrus border border-citrus/30 px-1.5 py-0.5 rounded-sm">
            AI Product Engine
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map(({ label, href }) => (
            <Link key={label} href={href} className="text-sm text-white/50 hover:text-white transition-colors duration-200 font-medium whitespace-nowrap">
              {label}
            </Link>
          ))}
        </div>

        {/* Mode toggle */}
        <div className="hidden md:flex items-center">
          <ModeToggle />
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {user ? (
            <>
              <Link href="/dashboard" className="btn-ghost py-2 px-5 text-xs">
                My Glass Box
              </Link>
              <button onClick={handleSignOut} className="text-xs text-white/30 hover:text-white/60 transition-colors">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/brief" className="btn-citrus py-2 px-5 text-xs">
                Brief The Conductor
              </Link>
              <Link href="/login" className="btn-ghost py-2 px-5 text-xs">
                Client Login
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden flex flex-col gap-1.5 w-6 py-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block h-px w-full bg-white/60 transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block h-px w-full bg-white/60 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-px w-full bg-white/60 transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-surface/95 backdrop-blur-xl border-b border-white/8 overflow-hidden"
          >
            <div className="px-6 py-5 space-y-4">
              {navLinks.map(({ label, href }) => (
                <Link key={label} href={href} className="block text-sm text-white/60 hover:text-white py-1" onClick={() => setMenuOpen(false)}>
                  {label}
                </Link>
              ))}

              {/* Mobile mode toggle */}
              <div className="pt-3 border-t border-white/8">
                <div className="text-[9px] font-mono uppercase tracking-widest text-white/25 mb-2">View Mode</div>
                <div className="flex gap-2">
                  {(Object.keys(modeConfig) as Mode[]).map((m) => {
                    const cfg = modeConfig[m];
                    const isActive = mode === m;
                    return (
                      <button
                        key={m}
                        onClick={() => setMode(m)}
                        className={`px-3 py-1.5 text-[9px] font-mono uppercase tracking-wider rounded-full border transition-all duration-200 ${
                          isActive
                            ? `${cfg.activeClass} border-transparent`
                            : 'text-white/30 border-white/10 hover:text-white/50'
                        }`}
                      >
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
                {mode !== 'idiots' && (
                  <button
                    onClick={() => { setMode('idiots'); setMenuOpen(false); }}
                    className="mt-2 text-[10px] text-yellow-400/60 hover:text-yellow-400 transition-colors"
                  >
                    don&apos;t get it? → try Idiots mode 🤪
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-2 pt-3 border-t border-white/8">
                {user ? (
                  <>
                    <Link href="/dashboard" className="btn-ghost text-xs text-center py-2.5" onClick={() => setMenuOpen(false)}>
                      My Glass Box
                    </Link>
                    <button onClick={handleSignOut} className="text-xs text-white/30 text-center py-2">
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/brief" className="btn-citrus text-xs text-center py-2.5" onClick={() => setMenuOpen(false)}>
                      Brief The Conductor
                    </Link>
                    <Link href="/login" className="btn-ghost text-xs text-center py-2.5" onClick={() => setMenuOpen(false)}>
                      Client Login
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
