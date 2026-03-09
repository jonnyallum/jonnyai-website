"use client";

import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, Zap, Target, Gauge } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-brand-gold/30">
      {/* Dynamic Scan Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-10">
        <div className="h-[2px] w-full bg-brand-gold absolute top-0 animate-[scan_4s_linear_infinite]" />
      </div>

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        <nav className="flex items-center justify-between mb-24">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-gold rounded-full flex items-center justify-center text-black font-black">G</div>
            <span className="font-bold tracking-tighter text-xl">GOLD STANDARD</span>
          </div>
          <div className="flex items-center gap-8 text-sm font-medium text-zinc-500">
            <Link href="/verify" className="hover:text-brand-gold transition-colors">Registry</Link>
            <Link href="#" className="hover:text-brand-gold transition-colors">Methodology</Link>
            <button className="px-5 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all text-white">Join Hive Mind</button>
          </div>
        </nav>

        <section className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs font-bold mb-8 uppercase tracking-widest">
              <Zap size={12} fill="currentColor" /> Jai.OS v4.0 Certified
            </div>
            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
              THE ERA OF THE <br />
              <span className="gold-gradient italic">WRAPPER</span> <br />
              IS OVER.
            </h1>
            <p className="text-xl text-zinc-400 mb-12 max-w-lg leading-relaxed">
              Don&apos;t build toys. Build assets. We provide the world&apos;s first deterministic logic certification for agentic systems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-5 bg-brand-gold text-black font-black uppercase tracking-tighter text-lg rounded-xl flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-[0.98] transition-all">
                Run Lite Scan <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <Link href="/verify" className="px-8 py-5 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-tighter text-lg rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                Access Registry
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            {/* Visual Representation of Agent Gates */}
            <div className="glass-card p-12 border-brand-gold/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-brand-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-12">
                  <h3 className="text-zinc-500 font-mono text-xs uppercase tracking-[0.3em]">System_Integrity_Report</h3>
                  <div className="signal-dot bg-brand-gold" />
                </div>
                
                <div className="space-y-8">
                  {[
                    { label: "Deterministic Gates", value: 13, icon: <ShieldCheck className="text-brand-gold" /> },
                    { label: "Identity Fragmentation", value: "0%", icon: <Target className="text-zinc-500" /> },
                    { label: "Logic Parity Score", value: "99.8", icon: <Gauge className="text-zinc-500" /> }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-white/5 pb-4">
                      <div className="flex items-center gap-4">
                        {item.icon}
                        <span className="font-bold text-lg uppercase tracking-tighter">{item.label}</span>
                      </div>
                      <span className="font-mono text-xl text-white">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-12 pt-12 border-t border-brand-gold/20">
                  <div className="flex items-center gap-2 text-brand-gold font-black italic text-2xl tracking-tighter">
                    GOLD_STANDARD_CERTIFIED
                  </div>
                  <p className="text-[10px] text-zinc-500 font-mono mt-2 uppercase tracking-widest">CID: GS-B821 | HIVE_LOCK: ACTIVE</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Grid Pattern Background */}
      <div className="fixed inset-0 z-[-1] opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #333 1px, transparent 0)', backgroundSize: '40px 40px' }} />
    </div>
  );
}
