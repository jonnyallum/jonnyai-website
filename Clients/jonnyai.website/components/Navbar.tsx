"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Hammer, Users, Signal, Briefcase, ChevronRight, FlaskConical, Newspaper, Menu, X, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navLinks = [
  { name: "The Build", href: "/#build", icon: Hammer },
  { name: "The Feed", href: "/blog", icon: Newspaper },
  { name: "The Labs", href: "/labs", icon: FlaskConical },
  { name: "The Empire", href: "/empire", icon: Crown },
  { name: "The Workforce", href: "/#workforce", icon: Users },
  { name: "Our Work", href: "/#work", icon: Briefcase },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 md:p-6"
      >
        <div className="glass-panel w-full max-w-6xl rounded-full px-6 md:px-8 py-3 flex items-center justify-between border-white/5 shadow-2xl">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
              <span className="text-black font-black text-xs">JAI</span>
            </div>
            <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold hidden sm:block">JonnyAI</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-[10px] uppercase tracking-widest text-white/60 hover:text-orange-500 transition-colors duration-300 flex items-center gap-2"
              >
                <link.icon className="w-3 h-3" />
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="hidden sm:block text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors duration-300"
            >
              Login
            </Link>
            <Link 
              href="/brief" 
              className="group relative flex items-center gap-2 bg-white text-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-black px-4 md:px-6 py-2 md:py-2.5 rounded-full hover:bg-orange-500 transition-all duration-500 overflow-hidden"
            >
              <span className="relative z-10 font-black">BRIEF MARCUS</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            {/* Mobile Toggle */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -20 }}
        className={cn(
          "fixed inset-0 z-40 bg-black/95 backdrop-blur-xl lg:hidden flex flex-col pt-32 px-8 gap-8",
          !isOpen && "pointer-events-none"
        )}
      >
        {navLinks.map((link) => (
          <Link 
            key={link.name} 
            href={link.href}
            onClick={() => setIsOpen(false)}
            className="text-2xl uppercase tracking-tighter text-white/60 hover:text-orange-500 transition-colors flex items-center gap-4"
          >
            <link.icon className="w-6 h-6 text-orange-500" />
            {link.name}
          </Link>
        ))}
        <div className="mt-auto pb-12">
            <Link 
              href="/login" 
              className="text-xl uppercase tracking-widest text-white/40 block mb-8"
            >
              Client Login
            </Link>
            <div className="text-[10px] text-white/20 uppercase tracking-[0.4em]">Antigravity Orchestra // 2026</div>
        </div>
      </motion.div>
    </>
  );
}
