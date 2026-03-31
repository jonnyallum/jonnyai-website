"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Work", href: "/portfolio/case-studies" },
  { label: "CV", href: "/portfolio/cv" },
];

export default function PortfolioNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(0, 0, 0, 0.9)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/portfolio"
          className="flex items-center gap-3 group"
          style={{ textDecoration: "none" }}
        >
          <span
            className="text-sm uppercase tracking-[0.2em] font-bold"
            style={{ color: "#fff" }}
          >
            Jonny Allum
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs uppercase tracking-[0.2em] font-medium transition-colors duration-200 hover:text-white"
                style={{
                  color: isActive ? "#fff" : "rgba(255,255,255,0.5)",
                }}
              >
                {link.label}
              </Link>
            );
          })}
          <a
            href="mailto:jonnyallum@gmail.com"
            className="text-xs px-5 py-2 rounded-full font-semibold transition-all duration-200 hover:opacity-80"
            style={{
              background: "#fff",
              color: "#000",
            }}
          >
            Get In Touch
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ color: "rgba(255,255,255,0.7)" }}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden px-6 pb-6 flex flex-col gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm uppercase tracking-widest py-2"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="mailto:jonnyallum@gmail.com"
            className="text-sm px-5 py-2.5 rounded-full font-semibold text-center"
            style={{ background: "#fff", color: "#000" }}
          >
            Get In Touch
          </a>
        </div>
      )}
    </nav>
  );
}
