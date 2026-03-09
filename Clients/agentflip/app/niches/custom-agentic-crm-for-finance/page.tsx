"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, Target, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function NichePage() {
  return (
    <main className="min-h-screen bg-void-black text-zinc-400 p-8 lg:p-24 font-mono scanning relative">
      <nav className="mb-24 flex justify-between items-center border-b border-white/5 pb-4">
        <Link href="/" className="flex items-center gap-2">
          <Zap size={16} className="signal-text" /> 
          <span className="text-white font-bold tracking-widest text-xs uppercase">AgentFlip // Arbitrage</span>
        </Link>
        <span className="text-[10px] signal-text uppercase">FLIP_ID: CUSTOM-AGENTIC-CRM-FOR-FINANCE</span>
      </nav>

      <div className="max-w-4xl">
        <div className="mb-8 inline-block px-3 py-1 bg-signal-green/10 border border-signal-green/20 rounded text-[10px] signal-text font-bold uppercase tracking-widest">
           Arbitrage Target Identified
        </div>
        <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tighter mb-8 leading-none">
          CUSTOM AGENTIC CRM FOR FINANCE <br /> 
          <span className="signal-text italic underline decoration-rust-copper decoration-4 underline-offset-8">DEMAND_SPIKE</span>
        </h1>
        <p className="text-lg mb-12 max-w-2xl leading-relaxed italic border-l-2 border-rust-copper pl-6">
          Our Scavenger Engine has detected a high-intent liquidity gap for "custom agentic crm for finance". 
          Traditional solutions are failing. Authenticity is leaking.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="glass-panel p-6 border border-white/5">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Target size={16} className="signal-text" /> THE_REVENUE_LEAK
            </h3>
            <p className="text-sm">94% of traffic in the "custom agentic crm for finance" niche is being captured by unverified wrappers. This is digital waste.</p>
          </div>
          <div className="glass-panel p-6 border border-white/5">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
               <ShieldCheck size={16} className="signal-text" /> THE_EQUITY_FIX
            </h3>
            <p className="text-sm">We provide the deterministic logic bridge to capture this intent and lock in sustainable yield.</p>
          </div>
        </div>

        <button className="px-12 py-6 bg-white outline outline-1 outline-signal-green/20 hover:bg-signal-green hover:text-void-black text-void-black font-black uppercase tracking-tighter text-2xl transition-all flex items-center gap-4 group">
          SECURE_THIS_ASSET <ArrowRight className="group-hover:translate-x-2 transition-transform" />
        </button>
      </div>

      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-24 opacity-5 pointer-events-none">
        <Zap size={400} className="rust-accents" />
      </div>
    </main>
  );
}
