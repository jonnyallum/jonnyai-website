"use client";

import { useState, useEffect } from "react";
import { Phone, Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Parts Catalogue", href: "/shop", external: false },
    { label: "eBay Store", href: "https://www.ebay.co.uk/sch/blmotorcycles/m.html", external: true },
    { label: "About", href: "#about", external: false },
    { label: "Contact", href: "#contact", external: false },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-brand-dark/95 backdrop-blur-md border-b border-white/5 py-3" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo — prominent */}
        <a href="/" className="flex items-center group">
          <img
            src="/images/logo-transparent.png"
            alt="B&L Motorcycles"
            className="h-16 w-auto transition-opacity group-hover:opacity-90"
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="tel:07881274193"
            className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-brand-gold transition-colors"
          >
            <Phone className="w-4 h-4" />
            07881 274193
          </a>
          <a
            href="/shop"
            className="bg-gradient-to-r from-brand-gold to-brand-gold-dark text-black px-5 py-2.5 rounded-full text-sm font-bold hover:from-brand-gold-dark hover:to-[#A8891E] transition-all shadow-lg shadow-brand-gold/20"
          >
            Shop Parts
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white p-2"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-brand-dark/98 border-t border-white/5 px-6 py-6 flex flex-col gap-5">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-base font-medium text-gray-300 hover:text-brand-gold transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="tel:07881274193"
            className="flex items-center gap-2 text-brand-gold font-semibold"
          >
            <Phone className="w-4 h-4" />
            07881 274193
          </a>
          <a
            href="/shop"
            className="bg-gradient-to-r from-brand-gold to-brand-gold-dark text-black text-center py-3 rounded-full font-bold"
          >
            Shop Parts
          </a>
        </div>
      )}
    </header>
  );
}
