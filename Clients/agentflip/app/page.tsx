"use client";

import { motion } from "framer-motion";
import { Terminal, Zap, Hash, TrendingUp, Cpu, Database, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

export default function AgentFlipDashboard() {
  const [isLive, setIsLive] = useState(false);
  
  useEffect(() => {
    setIsLive(true);
  }, []);

  const stats = [
    { label: "SCAVENGE_LOAD", value: "88%", icon: <Cpu size={14} /> },
    { label: "GRAVY_YIELD", value: "1.24x", icon: <TrendingUp size={14} /> },
    { label: "ACTIVE_FLIPS", value: "02", icon: <Hash size={14} /> },
    { label: "CORE_PARITY", value: "LOCKED", icon: <Database size={14} /> },
  ];

  const flips = [
    { keyword: "ai compliance tool for medical", score: "0.8333", status: "QUEUED_FOR_FLIP", priority: "GOLD" },
    { keyword: "agentic identity verification", score: "0.5532", status: "PENDING_SCRAPE", priority: "HIGH" },
  ];

  return (
    <main className="min-h-screen bg-void-black p-6 font-mono text-zinc-400 overflow-hidden relative scanning">
      
      {/* HUD Header */}
      <header className="flex justify-between items-center mb-12 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-signal-green rounded flex items-center justify-center text-void-black">
            <Zap size={20} fill="currentColor" />
          </div>
          <div>
            <h1 className="text-white font-bold tracking-tighter text-xl">AGENTFLIP_V02</h1>
            <p className="text-[10px] signal-text">ARBITRAGE_ENGINE_ONLINE</p>
          </div>
        </div>
        
        <div className="flex gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-right">
              <p className="text-[9px] uppercase tracking-widest flex items-center gap-1 justify-end">{s.icon} {s.label}</p>
              <p className="text-sm font-bold text-white">{s.value}</p>
            </div>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        
        {/* Left Column: Terminal Logic */}
        <section className="col-span-12 lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 scavenger-border relative">
            <div className="flex items-center gap-2 mb-4">
              <Terminal size={16} className="signal-text" />
              <h2 className="text-xs text-white uppercase tracking-widest font-bold">SCAVENGER_PULSE</h2>
            </div>
            
            <div className="space-y-4 text-[11px] leading-relaxed">
              <p><span className="text-white">SYS_INI:</span> Scavenger V1 loop started...</p>
              <p><span className="text-white">DATA_FEED:</span> Indexing expired SaaS domains...</p>
              <p className="signal-text flex items-center gap-2">
                <AlertTriangle size={12} /> ARBITRAGE_DETECTED: "ai-medical-audit"
              </p>
              <p><span className="text-white">GRAVY_SCORE:</span> 0.92 (Threshold: 0.75)</p>
              <p className="text-zinc-600">---------------------------------</p>
              <p><span className="text-white">NEXT_HOP:</span> Initiating @sebastian scaffold_page...</p>
            </div>
          </div>

          <div className="glass-panel p-4 border-l-2 border-rust-copper/50">
            <p className="text-[10px] uppercase text-rust-copper font-bold mb-2 underline decoration-dotted underline-offset-4">Identity Lock</p>
            <p className="text-[11px] italic">"We don't build sites. We build equity from digital waste." - @dreamer</p>
          </div>
        </section>

        {/* Right Column: Flip Ticker */}
        <section className="col-span-12 lg:col-span-8">
          <div className="glass-panel p-8 scavenger-border min-h-[400px]">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
              <h2 className="text-white font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-signal-green animate-pulse" />
                Live_Flip_Registry
              </h2>
              <span className="text-[10px] signal-text">TOTAL_YIELD: $0.00</span>
            </div>

            <div className="space-y-4">
              {flips.map((f, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="flex items-center justify-between p-4 bg-white/2 hover:bg-white/5 border border-white/5 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`text-[10px] px-2 py-1 rounded font-bold ${f.priority === 'GOLD' ? 'bg-rust-copper/20 text-rust-copper' : 'bg-white/5'}`}>
                      {f.priority}
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold group-hover:signal-text transition-colors">{f.keyword}</p>
                      <p className="text-[10px] text-zinc-600 uppercase">GRAVY: {f.score} | T-{Math.floor(Math.random() * 10)}m</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] signal-text font-bold mb-1">{f.status}</p>
                    <div className="w-32 h-1 bg-white/5 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "65%" }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        className="h-full bg-signal-green" 
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Empty State / Bottom Nav */}
            <div className="mt-12 text-center border-t border-white/5 pt-8">
              <p className="text-[10px] text-zinc-600 mb-4 animate-pulse uppercase tracking-[0.2em]">Listening_for_Market_Noise...</p>
              <button className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest border border-white/10 rounded-sm transition-all hover:signal-text">
                Initialize_Manual_Scavenge
              </button>
            </div>
          </div>
        </section>

      </div>
      
      {/* Background Rust Grid */}
      <div className="absolute inset-0 z-[-1] opacity-5 overflow-hidden pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#b87333 1px, transparent 1px), linear-gradient(90deg, #b87333 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    </main>
  );
}
