"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Case Studies", href: "/projects/" },
    { name: "Services", href: "/services/" },
    { name: "About", href: "/about/" },
    { name: "Contact", href: "/contact/" },
  ];

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 w-full z-50 transition-all duration-700 px-6 md:px-12",
          scrolled || menuOpen
            ? "py-4 bg-white shadow-2xl border-b border-black/5"
            : "py-8 md:py-12 bg-transparent"
        )}
      >
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          {/* God-Tier Logo - Forced Background Elimination */}
          <Link href="/" className="relative group" onClick={() => setMenuOpen(false)}>
            <div className="relative h-12 w-40 md:h-24 md:w-64 transition-all duration-700 group-hover:scale-105">
              <Image
                src={scrolled || menuOpen ? "/assets/jsc-logo.svg" : "/assets/jsc-logo-white.svg"}
                alt="JSC Contractors"
                fill
                className="object-contain transition-all duration-700"
                priority
              />
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-12">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-[13px] uppercase tracking-[0.4em] font-black transition-all duration-500 hover:-translate-y-0.5",
                  scrolled ? "text-black hover:text-accent" : "text-white hover:text-accent font-bold drop-shadow-md"
                )}
              >
                {link.name}
              </Link>
            ))}

            <Link
              href="/contact/"
              className={cn(
                "px-10 py-4 text-[11px] uppercase tracking-[0.3em] font-black transition-all duration-700 shadow-2xl transform hover:scale-105",
                scrolled
                  ? "bg-black text-white hover:bg-accent hover:text-black"
                  : "bg-white text-black hover:bg-black hover:text-white"
              )}
            >
              Start Build
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden relative z-50 w-10 h-10 flex flex-col justify-center items-center gap-[7px]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={cn("block w-8 h-[2px] transition-all duration-500 origin-center", menuOpen ? "bg-black rotate-45 translate-y-[9px]" : scrolled ? "bg-black" : "bg-white drop-shadow-lg")} />
            <span className={cn("block w-8 h-[2px] transition-all duration-500", menuOpen ? "bg-transparent scale-x-0" : scrolled ? "bg-black" : "bg-white drop-shadow-lg")} />
            <span className={cn("block w-8 h-[2px] transition-all duration-500 origin-center", menuOpen ? "bg-black -rotate-45 -translate-y-[9px]" : scrolled ? "bg-black" : "bg-white drop-shadow-lg")} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white flex flex-col justify-center px-8 pt-32"
          >
            <nav className="space-y-2">
              {navLinks.map((link, idx) => (
                <motion.div key={link.name} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.08 }}>
                  <Link href={link.href} onClick={() => setMenuOpen(false)} className="block text-5xl font-serif text-black hover:text-accent py-4 border-b border-neutral-100">
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-16 space-y-3 text-neutral-500 text-sm font-sans font-bold">
              <p className="uppercase tracking-widest text-[10px] text-neutral-400 mb-4">Official Contact</p>
              <Link href="tel:07506699826" className="text-black text-xl block">07506 699 826</Link>
              <Link href="mailto:info@jsccontractors.co.uk" className="text-black text-lg block font-normal">info@jsccontractors.co.uk</Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
