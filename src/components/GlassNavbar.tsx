'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Install', href: '/install' },
  { label: 'Build', href: '/build' },
  { label: 'Automate', href: '/automate' },
  { label: 'YouTube', href: '/youtube' },
  { label: 'Workforce', href: '/workforce' },
  { label: 'Empire', href: '/empire' },
  { label: 'Resorts', href: '/resorts' },
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'Blog', href: '/blog' },
];

export default function GlassNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-void/90 backdrop-blur-xl border-b border-white/[0.07]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="shrink-0 flex items-center" aria-label="JonnyAI Home">
          <Image
            src="/jai_logo_clean.png"
            alt="JonnyAI"
            width={110}
            height={34}
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-7">
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-[13px] text-white/45 hover:text-white transition-colors duration-200 font-medium whitespace-nowrap"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <Link href="/brief" className="hidden md:inline-flex btn-citrus py-2 px-5 text-xs shrink-0">
          Get Started →
        </Link>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden flex flex-col gap-1.5 w-6 py-1 shrink-0"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className={`block h-px w-full bg-white/60 transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block h-px w-full bg-white/60 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-px w-full bg-white/60 transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden bg-void/95 backdrop-blur-xl border-b border-white/[0.07] overflow-hidden"
          >
            <div className="px-6 py-5 space-y-1">
              {navLinks.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="block text-sm text-white/60 hover:text-white py-2.5 border-b border-white/[0.04] last:border-0 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <div className="pt-4">
                <Link
                  href="/brief"
                  className="btn-citrus text-xs text-center py-3 w-full block"
                  onClick={() => setMenuOpen(false)}
                >
                  Get Started →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
