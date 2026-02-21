'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'The Build', href: '#build' },
  { label: 'The Traffic', href: '#traffic' },
  { label: 'The Workforce', href: '#workforce' },
  { label: 'Our Work', href: '#work' },
];

export default function GlassNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-void/90 backdrop-blur-xl border-b border-white/8' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="font-outfit font-extrabold text-xl text-white tracking-tight">JonnyAi</span>
          <span className="hidden sm:block text-[9px] font-mono uppercase tracking-[0.2em] text-citrus border border-citrus/30 px-1.5 py-0.5 rounded-sm">
            AI Product Engine
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, href }) => (
            <a key={label} href={href} className="text-sm text-white/50 hover:text-white transition-colors duration-200 font-medium">
              {label}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/brief" className="btn-citrus py-2 px-5 text-xs">
            Brief The Conductor
          </Link>
          <Link href="/dashboard" className="btn-ghost py-2 px-5 text-xs">
            Client Login
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex flex-col gap-1.5 w-6 py-1"
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
            className="md:hidden bg-surface/95 backdrop-blur-xl border-b border-white/8 overflow-hidden"
          >
            <div className="px-6 py-5 space-y-4">
              {navLinks.map(({ label, href }) => (
                <a key={label} href={href} className="block text-sm text-white/60 hover:text-white py-1" onClick={() => setMenuOpen(false)}>
                  {label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-3 border-t border-white/8">
                <Link href="/brief" className="btn-citrus text-xs text-center py-2.5" onClick={() => setMenuOpen(false)}>
                  Brief The Conductor
                </Link>
                <Link href="/dashboard" className="btn-ghost text-xs text-center py-2.5" onClick={() => setMenuOpen(false)}>
                  Client Login
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
