'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function AgentPortPage() {
  return (
    <main className="min-h-screen bg-[#070708] text-white selection:bg-orange-500/30 font-sans">
      {/* ── BACKGROUND ORCHESTRATION ──────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-orange-600/5 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 right-1/4 w-[1000px] h-[1000px] bg-zinc-800/10 rounded-full blur-[200px]" />
        <div 
          className="absolute inset-0 opacity-[0.02]" 
          style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} 
        />
      </div>

      {/* ── HERO SECTION ─────────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/5 text-[10px] font-mono uppercase tracking-[0.2em] text-orange-500 mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              Deployment Active: UK-SOUTH-01
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-outfit font-extrabold text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.85] tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/30"
            >
              Dock Your<br />
              <span className="text-orange-500">Autonomous</span><br />
              <span className="italic uppercase tracking-tight">Frontier.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/40 text-lg md:text-xl leading-relaxed max-w-lg mb-12"
            >
              The cloud is for websites. **AgentPort** is for machines. 
              Hardened, physical docking zones for AgOS 4.0 orchestras with sub-1ms internal latency.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/brief" className="px-8 py-4 rounded-xl bg-orange-500 text-white font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_40px_rgba(249,115,22,0.2)] text-center">
                Reserve Docking Bay
              </Link>
              <Link href="#tech" className="px-8 py-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all duration-300 text-center">
                View Fleet Specs
              </Link>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative aspect-square rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-3xl overflow-hidden group shadow-2xl"
          >
            <Image 
              src="/agentport_hero.png" 
              alt="AgentPort Docking Bay" 
              fill 
              priority
              className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070708] via-transparent to-transparent" />
            
            {/* HUD Elements */}
            <div className="absolute top-8 left-8 flex flex-col gap-2">
              <div className="w-12 h-0.5 bg-orange-500" />
              <div className="text-[10px] font-mono text-orange-500 uppercase tracking-widest">Sector 7-G / Status: Optimal</div>
            </div>
            
            <div className="absolute bottom-8 right-8 text-right">
              <div className="text-[40px] font-outfit font-bold leading-none mb-1">99.9%</div>
              <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Hardware Pulse</div>
            </div>

            {/* Scanning Line */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <motion.div 
                animate={{ y: ['0%', '100%'] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="w-full h-1/2 bg-gradient-to-b from-transparent via-orange-500/10 to-transparent"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TECHNICAL GRID ───────────────────────────────────────────────── */}
      <section id="tech" className="py-24 md:py-32 px-6 border-y border-white/5 bg-zinc-950/40 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-16 md:mb-20">
            <div>
              <div className="text-orange-500 font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] mb-4">Under The Hood</div>
              <h2 className="font-outfit font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1]">Aerospace Standards.<br />Silicon Execution.</h2>
            </div>
            <p className="text-white/30 max-w-sm text-[10px] sm:text-sm leading-relaxed font-mono uppercase tracking-tight bg-white/5 p-4 rounded border border-white/5">
              &gt; SYNC_MODE: DETERMINISTIC<br />
              &gt; LATENCY_CAP: 0.8MS<br />
              &gt; POWER_REDUNDANCY: 2N+1
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Isolated Clusters', desc: 'Each agent orchestra runs on physically isolated hardware nodes. No shared OS noise.' },
              { title: 'AgOS 4.0 Native', desc: 'Pre-configured with full Jai.OS protocols for instant hive mind synchronization.' },
              { title: 'Neural Tunnels', desc: 'Encrypted, high-speed WebSocket tunnels for real-time human-to-orchestra feedback.' },
              { title: 'Hardened Edge', desc: 'Steel-encased Raspberry Pi 5 clusters with industrial thermal management.' },
            ].map((feature, i) => (
              <motion.div 
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,1)]" />
                </div>
                <h3 className="font-outfit font-bold text-lg mb-4">{feature.title}</h3>
                <p className="text-white/30 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING SECTIONS ────────────────────────────────────────────── */}
      <section className="py-40 px-6 relative">
         <div className="max-w-5xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="font-outfit font-extrabold text-5xl md:text-6xl mb-6">Commercial Access</h2>
            <p className="text-white/40 max-w-xl mx-auto text-lg leading-relaxed">
              Industrial-grade hosting for high-velocity teams. Scale your orchestra without the cloud tax.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div 
              whileHover={{ y: -8 }}
              className="p-10 rounded-3xl border border-white/10 bg-zinc-900/20 backdrop-blur-2xl relative group"
            >
              <div className="text-xs font-mono text-white/30 uppercase tracking-[0.3em] mb-8">Standard Docking</div>
              <div className="flex items-end gap-2 mb-8">
                <span className="text-6xl font-outfit font-bold">£149</span>
                <span className="text-white/20 mb-2 font-mono">/MO</span>
              </div>
              <ul className="space-y-5 mb-12 text-[13px] text-white/40">
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 mt-1">→</span>
                  <span>Single Dedicated Pi 5 (8GB RAM)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 mt-1">→</span>
                  <span>AgOS 4.0 Standard Firmware</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 mt-1">→</span>
                  <span>100GB NVMe Landing Partition</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 mt-1">→</span>
                  <span>Standard 1Gbps Uplink</span>
                </li>
              </ul>
              <Link href="/brief" className="block w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500 text-center">
                Apply for Docking
              </Link>
            </motion.div>

            <motion.div 
              whileHover={{ y: -8 }}
              className="p-10 rounded-3xl border border-orange-500/40 bg-orange-500/[0.03] backdrop-blur-2xl relative overflow-hidden group shadow-[0_30px_100px_rgba(249,115,22,0.1)]"
            >
              <div className="absolute top-0 right-0 px-6 py-2 bg-orange-500 text-black text-[10px] font-bold uppercase tracking-[0.3em]">Priority Fleet</div>
              <div className="text-xs font-mono text-orange-500 uppercase tracking-[0.3em] mb-8 italic">Industrial Swarm</div>
              <div className="flex items-end gap-2 mb-8">
                <span className="text-6xl font-outfit font-bold text-orange-500">£599</span>
                <span className="text-white/20 mb-2 font-mono">/MO</span>
              </div>
              <ul className="space-y-5 mb-12 text-[13px] text-white/60">
                <li className="flex items-start gap-3 font-semibold">
                  <span className="text-orange-500 mt-1">⚡</span>
                  <span>5x High-Density Hardware Nodes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 mt-1">⚡</span>
                  <span>Shared KV Memory (Sub-1ms Sync)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 mt-1">⚡</span>
                  <span>Dedicated Threat Mitigation Layer</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 mt-1">⚡</span>
                  <span>VIP Orchestrator Support</span>
                </li>
              </ul>
              <Link href="/brief" className="block w-full py-5 rounded-2xl bg-orange-500 text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500 text-center">
                Dispatch Fleet Command
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-white/5 bg-gradient-to-t from-orange-500/5 to-transparent">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
          <div>
            <h3 className="font-outfit font-bold text-3xl md:text-4xl mb-3 text-orange-500">Ready for Landing?</h3>
            <p className="text-white/40 font-mono tracking-tight uppercase text-sm">Orchestra Readiness Test: PASSED</p>
          </div>
          <Link href="/brief" className="px-10 py-5 rounded-full border border-orange-500/30 text-orange-500 font-bold text-xs uppercase tracking-[0.4em] hover:bg-orange-500 hover:text-white transition-all duration-500 shadow-[0_0_50px_rgba(249,115,22,0.15)]">
            Brief Fleet Command
          </Link>
        </div>
      </section>

      <footer className="py-12 px-6 text-center border-t border-white/5 bg-zinc-950">
        <div className="text-[10px] font-mono text-white/10 uppercase tracking-[0.5em] mb-4">
          Operated by Jonny Allum Innovations Ltd
        </div>
        <div className="flex justify-center gap-8 text-[9px] font-mono text-white/20 uppercase tracking-widest">
          <Link href="/privacy" className="hover:text-orange-500 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-orange-500 transition-colors">Terms</Link>
          <span>Est. 2026</span>
        </div>
      </footer>
    </main>
  );
}
