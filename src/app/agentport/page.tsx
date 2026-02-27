'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AgentPortPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-orange-500/30">
      {/* ── BACKGROUND ORCHESTRATION ──────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-zinc-800/10 rounded-full blur-[150px]" />
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />
      </div>

      {/* ── HERO SECTION ─────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/5 text-[10px] font-mono uppercase tracking-[0.2em] text-orange-500 mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            Project: AgentPort — V0.1 Launch Sequence
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-outfit font-extrabold text-6xl md:text-8xl leading-[0.9] tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40"
          >
            Airport for<br />
            <span className="text-orange-500 italic">Autonomous AIs.</span>
          </motion.h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/40 text-lg md:text-xl leading-relaxed max-w-md"
            >
              Stop hosting agents on overpriced cloud clusters. 
              **AgentPort** provides hardened, edge-hardware Landing Zones with pre-installed Jai.OS 4.0 hooks.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="relative aspect-video rounded-xl border border-white/10 bg-zinc-900/50 backdrop-blur-3xl overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3/4 h-3/4 border border-dashed border-orange-500/20 rounded-lg animate-[spin_20s_linear_infinite]" />
                <div className="absolute w-1/2 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
                <div className="absolute h-1/2 w-px bg-gradient-to-b from-transparent via-orange-500/40 to-transparent" />
                <span className="text-white font-mono text-[10px] tracking-[0.5em] animate-pulse">DOCKING...</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CORE SPECS ───────────────────────────────────────────────────── */}
      <section className="py-24 px-6 border-y border-white/5 bg-zinc-950/20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            {[
              { label: 'Zero Lag', val: '500ms', desc: 'Direct WebSocket tunnels to your agent orchestra.' },
              { label: 'Deep Edge', val: '80 Nodes', desc: 'Physical Raspberry Pi 5 clusters across the grid.' },
              { label: 'Security', val: 'AES-256', desc: 'Isolated hardware containers for mission-critical logic.' },
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-xs font-mono uppercase tracking-widest text-orange-500/80 mb-2">{stat.label}</div>
                <div className="font-outfit font-bold text-4xl mb-3">{stat.val}</div>
                <p className="text-white/30 text-sm max-w-[200px] leading-relaxed mx-auto md:mx-0">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOCKING FEES ─────────────────────────────────────────────────── */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-outfit font-bold text-4xl md:text-5xl mb-4">Docking Fees</h2>
            <p className="text-white/40">Secure your agent&apos;s physical presence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl border border-white/8 bg-zinc-900/30 backdrop-blur-xl"
            >
              <div className="text-xs font-mono text-white/30 uppercase tracking-widest mb-6">Solo Landing Zone</div>
              <div className="flex items-end gap-2 mb-6">
                <span className="text-5xl font-outfit font-bold font-orange-500">£149</span>
                <span className="text-white/20 mb-1">/mo</span>
              </div>
              <ul className="space-y-4 mb-10 text-sm text-white/50">
                <li className="flex items-center gap-2">
                   <span className="w-1 h-1 bg-orange-500 rounded-full" />
                   Dedicated Pi 5 (8GB)
                </li>
                <li className="flex items-center gap-2">
                   <span className="w-1 h-1 bg-orange-500 rounded-full" />
                   Jai.OS 4.0 Pre-Installed
                </li>
                <li className="flex items-center gap-2">
                   <span className="w-1 h-1 bg-orange-500 rounded-full" />
                   100GB Local Storage
                </li>
              </ul>
              <button className="w-full py-4 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all duration-300">
                Reserve Spot
              </button>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl border border-orange-500/30 bg-orange-500/5 backdrop-blur-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 px-4 py-1 bg-orange-500 text-black text-[10px] font-bold uppercase tracking-widest">Limited</div>
              <div className="text-xs font-mono text-orange-500 uppercase tracking-widest mb-6">Industrial Swarm</div>
              <div className="flex items-end gap-2 mb-6">
                <span className="text-5xl font-outfit font-bold">£599</span>
                <span className="text-white/20 mb-1">/mo</span>
              </div>
              <ul className="space-y-4 mb-10 text-sm text-white/70">
                <li className="flex items-center gap-2">
                   <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                   5x Hardware Nodes
                </li>
                <li className="flex items-center gap-2">
                   <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                   Shared Memory Cache
                </li>
                <li className="flex items-center gap-2">
                   <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                   24/7 Ops Defense
                </li>
              </ul>
              <button className="w-full py-4 rounded-xl bg-orange-500 text-white font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300">
                Contact Fleet Command
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="py-24 px-6 border-t border-white/5 text-center">
        <Link href="/" className="text-[10px] font-mono text-white/20 uppercase tracking-[0.5em] hover:text-orange-500 transition-colors">
          Return to Hub
        </Link>
      </footer>
    </main>
  );
}
