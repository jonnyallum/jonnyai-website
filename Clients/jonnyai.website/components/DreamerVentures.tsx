"use client";

import { motion } from "framer-motion";
import { Layers, Scale, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

const ventures = [
  {
    tag: "Creator Tools",
    title: "Creator Workflow",
    description: "AI automation templates that compress creator workflows from hours to minutes. One video → 12 platform-ready assets.",
    metric: "4h → 30min",
    price: "From £47",
    href: "/creator-workflow",
    icon: Layers,
    status: "LIVE",
  },
  {
    tag: "Compliance",
    title: "Compliance Firewall",
    description: "Know before you get banned. Real-time policy intelligence across 40+ creator platforms. Violation scanner, instant alerts.",
    metric: "260+ Rules",
    price: "Free tier available",
    href: "/compliance-firewall",
    icon: Scale,
    status: "LIVE",
  },
];

export default function DreamerVentures() {
  return (
    <section className="py-24 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-6"
            >
              <Zap className="text-orange-500 w-4 h-4" />
              <span className="text-orange-500 text-[10px] uppercase tracking-[0.4em] font-black">Dreamer Ventures — Live Now</span>
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
              Products from the Orchestra.
            </h2>
          </div>
          <Link href="/labs" className="group flex items-center gap-3 text-white/40 hover:text-white transition-all shrink-0">
            <span className="text-[10px] uppercase tracking-[0.3em] font-black">View All Ventures</span>
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-black transition-all">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ventures.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={v.href}
                className="glass-card rounded-[32px] p-10 border-white/5 group hover:border-orange-500/20 transition-all duration-500 relative overflow-hidden flex flex-col h-full block"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-500/10 border border-orange-500/20">
                      <v.icon className="text-orange-500" size={20} />
                    </div>
                    <span className="text-[9px] uppercase tracking-widest text-orange-500 font-black border border-orange-500/20 px-2 py-1 rounded-full">{v.tag}</span>
                  </div>
                  <span className="bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded text-[9px] text-orange-500 font-black uppercase tracking-widest">{v.status}</span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{v.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed mb-10 flex-1">{v.description}</p>

                <div className="flex items-center justify-between pt-8 border-t border-white/5">
                  <div className="flex gap-6">
                    <div>
                      <div className="text-[9px] text-white/20 uppercase tracking-widest mb-1">Time Saved</div>
                      <div className="text-white font-black text-sm">{v.metric}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-white/20 uppercase tracking-widest mb-1">Pricing</div>
                      <div className="text-orange-500 font-black text-sm">{v.price}</div>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-black transition-all">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
