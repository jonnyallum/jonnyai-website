"use client";

import { useState, useEffect } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop Parts", href: "/shop" },
    { name: "Garage Services", href: "/services" },
    { name: "About Us", href: "#about" },
    { name: "Contact Us", href: "#contact" },
  ];

  return (
    <header
      className={cn(
        "fixed w-full z-50 transition-all duration-300 border-b border-transparent",
        scrolled
          ? "bg-black/95 backdrop-blur-sm border-brand-gold/20 py-2"
          : "bg-transparent py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo + Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/images/logo-transparent.png"
            alt="B&L Motorcycles"
            className="w-12 h-12 object-contain transition-transform group-hover:scale-105"
          />
          <div className="hidden sm:block">
            <span className="text-xl font-heading font-bold text-primary tracking-wider leading-none block">
              B&L MOTORCYCLES
            </span>
            <span className="text-[10px] font-mono text-gray-400 tracking-[0.2em] uppercase block">
              Parts & Repairs
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-heading font-medium uppercase tracking-wider transition-colors hover:text-primary relative py-1 text-white group"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-primary transform scale-x-0 transition-transform duration-300 origin-right group-hover:scale-x-100 group-hover:origin-left" />
            </Link>
          ))}
          <a
            href="https://www.ebay.co.uk/str/bnlmotorcycles"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-black px-4 py-2 font-heading font-bold text-sm uppercase tracking-wider clip-chamfer hover:bg-white transition-colors"
          >
            eBay Store
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white hover:text-primary transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black/98 border-b border-brand-gold/20 backdrop-blur-xl">
          <div className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-lg font-heading font-bold uppercase text-white hover:text-primary transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="https://www.ebay.co.uk/str/bnlmotorcycles"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-heading font-bold uppercase text-primary hover:text-white transition-colors flex items-center gap-2"
            >
              Visit eBay Store <ShoppingBag className="w-5 h-5" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
