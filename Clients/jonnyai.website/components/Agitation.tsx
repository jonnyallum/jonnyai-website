"use client";

import { motion } from "framer-motion";
import { XCircle, CheckCircle2, CloudRain, Zap } from "lucide-react";

const stats = [
  {
    label: "Wait Time",
    old: "3 - 6 Months",
    new: "48 Hours",
    iconOld: CloudRain,
    iconNew: Zap,
  },
  {
    label: "Feedback Loop",
    old: "Weekly Zoom Calls",
    new: "Real-Time Glass Box Feed",
    iconOld: XCircle,
    iconNew: CheckCircle2,
  },
  {
    label: "Price Target",
    old: "£20,000 - £50,000",
    new: "£497 - £2,497",
    iconOld: XCircle,
    iconNew: CheckCircle2,
  },
];

export default function Agitation() {
  return (
    <section id="build" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <motion.span 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-orange-500 text-[11px] uppercase tracking-[0.4em] font-black mb-6 block"
        >
          Traditional Development is Dead
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-8xl font-bold mb-8 tracking-tighter px-4"
        >
          Slow Code is <br />
          <span className="text-red-500 italic decoration-red-500/30 underline underline-offset-8">Financial Waste.</span>
        </motion.h2>
        <p className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto font-medium">
          The 12-week agency roadmap is a legacy relic. In 2026, if you aren't shipping in 48 hours, you're already behind the market.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        {/* Left: The Old Way */}
        <div className="p-8 md:p-16 bg-background relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50" />
          <h3 className="text-red-500 font-mono text-[10px] uppercase tracking-[0.4em] font-black mb-12">The Old Way</h3>
          
          <ul className="space-y-10">
            {stats.map((stat) => (
              <li key={stat.label} className="flex flex-col gap-2 group-hover:translate-x-2 transition-transform duration-500">
                <span className="text-white/20 text-[9px] uppercase tracking-widest font-bold">{stat.label}</span>
                <div className="flex items-center gap-4 text-white/40">
                  <stat.iconOld className="w-5 h-5 opacity-40" />
                  <span className="text-xl md:text-2xl font-medium">{stat.old}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: The AI Product Engine */}
        <div className="p-8 md:p-16 bg-white/[0.02] relative group">
          <div className="absolute top-0 left-0 w-full h-1 bg-orange-500" />
          <h3 className="text-orange-500 font-mono text-[10px] uppercase tracking-[0.4em] font-black mb-12">The AI Product Engine</h3>
          
          <ul className="space-y-10">
            {stats.map((stat) => (
              <li key={stat.label} className="flex flex-col gap-2 group-hover:translate-x-2 transition-transform duration-500">
                <span className="text-orange-500/40 text-[9px] uppercase tracking-widest font-black leading-none">{stat.label}</span>
                <div className="flex items-center gap-4 text-white">
                  <stat.iconNew className="w-5 h-5 text-orange-500 animate-pulse" />
                  <span className="text-2xl md:text-3xl font-black">{stat.new}</span>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-16 pt-12 border-t border-white/5">
            <p className="text-white/40 text-[11px] leading-relaxed italic">
              "We audited 42 traditional agencies in the UK. The average deliverable wait time was 14.2 weeks. Our average is 48 hours. The comparison isn't fair. It's an extinction event."
            </p>
            <span className="text-[10px] text-orange-500/60 font-black mt-4 block">— @Sophie (The Hawk) Research Lead</span>
          </div>
        </div>
      </div>
    </section>
  );
}
