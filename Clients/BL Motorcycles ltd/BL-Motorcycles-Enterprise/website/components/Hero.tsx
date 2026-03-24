"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ChevronRight } from "lucide-react";

export default function Hero() {
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    if (search.trim()) {
      window.location.href = `/shop?q=${encodeURIComponent(search)}`;
    } else {
      window.location.href = "/shop";
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-brand-dark">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
      />

      {/* Gold glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — copy + search */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-brand-gold/10 border border-brand-gold/20 rounded-full px-4 py-1.5 text-xs font-semibold text-brand-gold tracking-widest uppercase mb-8"
            >
              Motorcycle Breaker · Fareham, Hampshire
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-6xl lg:text-7xl font-black leading-[0.9] mb-6 tracking-tighter"
            >
              YOUR LOCAL<br />
              <span className="text-brand-gold">BIKE BREAKER</span><br />
              & PARTS SHOP.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-400 mb-10 max-w-lg leading-relaxed"
            >
              Based in Fareham, Hampshire. We break bikes, repair them, and supply
              quality new & used parts to riders across the South of England.
              Come find us locally or browse our online catalogue.
            </motion.p>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex gap-3 mb-8"
            >
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search by part name or bike model..."
                  className="w-full bg-brand-gray border border-white/10 rounded-2xl py-5 pl-12 pr-6 text-sm focus:border-brand-gold outline-none transition-all placeholder:text-gray-600"
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-gradient-to-br from-brand-gold to-brand-gold-dark text-black w-16 h-16 rounded-2xl flex items-center justify-center hover:from-brand-gold-dark hover:to-[#A8891E] active:scale-95 transition-all shadow-lg shadow-brand-gold/20"
                aria-label="Search"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            </motion.div>

            {/* Quick links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-3 text-xs text-gray-500"
            >
              <span>Search:</span>
              {["Brake Pads", "Used Parts", "Chain Kits", "Air Filters", "Exhausts"].map((term) => (
                <a
                  key={term}
                  href={`/shop?q=${encodeURIComponent(term)}`}
                  className="hover:text-brand-gold transition-colors underline underline-offset-2 decoration-white/20 hover:decoration-brand-gold"
                >
                  {term}
                </a>
              ))}
            </motion.div>
          </div>

          {/* Right — image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="absolute inset-0 bg-brand-gold/15 blur-[80px] rounded-full scale-75" />
            <img
              src="/images/about-workshop.jpg"
              alt="B&L Motorcycles workshop — Fareham"
              className="relative rounded-3xl border border-white/10 shadow-2xl w-full object-cover h-[480px]"
            />
            <div className="absolute bottom-6 left-6 right-6 bg-black/75 backdrop-blur-md rounded-2xl p-4 border border-brand-gold/20 flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-400 mb-0.5">Local breaker</div>
                <div className="text-sm font-bold text-white">Fareham, Hants</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <div className="text-xs text-gray-400 mb-0.5">New parts</div>
                <div className="text-2xl font-black text-brand-gold">32,000+</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <div className="text-xs text-gray-400 mb-0.5">Call us</div>
                <a href="tel:07881274193" className="text-sm font-bold text-white hover:text-brand-gold transition-colors">07881 274193</a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
      >
        <div className="w-px h-8 bg-gradient-to-b from-brand-gold/50 to-transparent" />
        <span className="text-[10px] text-gray-600 tracking-widest uppercase">Scroll</span>
      </motion.div>
    </section>
  );
}
