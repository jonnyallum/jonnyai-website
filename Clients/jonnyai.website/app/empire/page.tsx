"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  GraduationCap, 
  Filter, 
  ChevronRight, 
  Rocket, 
  Target,
  BarChart3,
  Clock,
  ExternalLink,
  Crown
} from "lucide-react";
import Link from "next/link";

const spearheads = [
  { id: "S1", project: "Antigravity Assurance", lead: "@jasper + @luna", status: "WAITLIST LIVE", yield: "£2k/assessment", date: "2026-03-15", icon: ShieldCheck, color: "orange" },
  { id: "S2", project: "Antigravity Academy", lead: "@coursewright", status: "WAITLIST LIVE", yield: "£997/cert", date: "2026-03-10", icon: GraduationCap, color: "blue" },
  { id: "S3", project: "Prompt-Injection Guard", lead: "@vigil", status: "BUILDING", yield: "£497/cert", date: "2026-03-01", icon: Zap, color: "red" },
  { id: "S4", project: "AgentFlip Scale 50", lead: "@grace + @felix", status: "MONETIZING", yield: "£x,xxx/mo", date: "2026-02-27", icon: TrendingUp, color: "green" },
  { id: "S5", project: "Gold Standard", lead: "@sebastian", status: "DEPLOY READY", yield: "£149/audit", date: "2026-02-26", icon: Target, color: "cyan" },
];

const pipeline = [
  { id: 41, idea: "Antigravity Assurance", index: 9.5, verdict: "GREEN", phase: "S1 — ACTIVE" },
  { id: 50, idea: "Antigravity Partners", index: 9.3, verdict: "GREEN", phase: "Phase 3" },
  { id: 43, idea: "Antigravity Academy", index: 8.9, verdict: "GREEN", phase: "S2 — ACTIVE" },
  { id: 8, idea: "ConstructChecked", index: 8.7, verdict: "GREEN", phase: "Queue (2 weeks)" },
  { id: 47, idea: "Micro-SaaS Incubator", index: 8.6, verdict: "GREEN", phase: "Structural" },
  { id: 7, idea: "Hotel Demand-Spiker", index: 8.2, verdict: "GREEN", phase: "Queue (3 weeks)" },
  { id: 21, idea: "AgentFlip Scale 50", index: 7.8, verdict: "YELLOW", phase: "S4 — monetize" },
  { id: 30, idea: "Affiliate Arbitrage", index: 7.2, verdict: "YELLOW", phase: "Small test" },
  { id: 46, idea: "Gift-Logic Explorer", index: 6.5, verdict: "YELLOW", phase: "Q3 play" },
];

const logs = [
  { 
    date: "2026-02-26", 
    pulse: "#4", 
    items: [
      "Marcus AI Agent: Rebuilding /brief page - AI-first conversational UI",
      "Website Audit: Full imagery & SEO overhaul complete",
      "Cron Boost: Reddit/DEV/IndieHackers integrated into dreamer_daily.py",
      "GitHub Goldmine: live scanning of top repos",
      "Spearheads: S1+S2 landing pages scaffolded"
    ]
  },
  {
    date: "2026-02-25",
    pulse: "#3",
    items: [
      "9-idea boardroom session complete. Gravy Index locked.",
      "Vercel + Google MCP servers live (48 new tools)",
      "Infrastructure: 60% system lockdown achieved"
    ]
  }
];

export default function EmpirePage() {
  return (
    <div className="flex flex-col min-h-screen bg-black overflow-hidden selection:bg-orange-500 selection:text-black font-sans">
      <Navbar />

      <main className="pt-40 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Hero Section */}
          <div className="relative mb-32">
            <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-orange-500/10 blur-[150px] rounded-full" />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-4 py-1.5 glass-panel rounded-full border-orange-500/20 mb-12 w-fit"
            >
              <Crown className="w-4 h-4 text-orange-500" />
              <span className="text-[10px] uppercase tracking-[0.4em] font-black text-orange-500">LOKI MODE ASCENSION // ACTIVE</span>
            </motion.div>

            <h1 className="text-7xl md:text-9xl font-bold mb-8 leading-[0.85] tracking-tighter">
              The Empire <br />
              <span className="text-white/30 italic font-serif">Builder.</span>
            </h1>

            <p className="text-white/40 text-xl max-w-2xl leading-relaxed border-l-2 border-orange-500/20 pl-8">
                Autonomous monetization paths engineered by the Jai.OS 5.0 Orchestra. 
                Monitoring high-margin yield, recursive build logic, and total market domination.
            </p>
          </div>

          {/* Core Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-32">
            {[
              { label: "Infrastructure locked", value: "60%", icon: ShieldCheck },
              { label: "Active Spearheads", value: "05", icon: Rocket },
              { label: "Pipeline Ideas", value: "54", icon: Filter },
              { label: "Target Alpha", value: "£42K/mo", icon: BarChart3 },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="glass-panel p-8 rounded-[32px] border-white/5 group hover:border-orange-500/20 transition-all duration-500"
              >
                <stat.icon className="w-5 h-5 text-orange-500/40 mb-6 group-hover:scale-110 transition-transform" />
                <div className="text-xs uppercase tracking-widest text-white/30 font-black mb-2">{stat.label}</div>
                <div className="text-3xl font-bold text-white tracking-tighter">{stat.value}</div>
              </motion.div>
            ))}
          </div>

          {/* Active Spearheads Table */}
          <div className="mb-32">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <Rocket className="w-8 h-8 text-orange-500" />
                <h2 className="text-4xl font-bold uppercase tracking-tighter">Active Spearheads</h2>
              </div>
              <div className="hidden md:flex gap-4">
                 <div className="px-4 py-2 bg-white/5 rounded-full text-[10px] font-black uppercase text-white/40 border border-white/10">Priority Build Queue</div>
              </div>
            </div>

            <div className="glass-panel rounded-[40px] border-white/5 overflow-hidden">
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.2em] text-white/20 font-black">
                        <th className="px-8 py-6">ID</th>
                        <th className="px-8 py-6">Project</th>
                        <th className="px-8 py-6">Status</th>
                        <th className="px-8 py-6">Lead</th>
                        <th className="px-8 py-6">Target Yield</th>
                        <th className="px-8 py-6 text-right">Deploy</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                      {spearheads.map((s) => (
                        <tr key={s.id} className="group hover:bg-white/[0.02] transition-colors">
                          <td className="px-8 py-6 font-mono text-orange-500 text-sm">{s.id}</td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4 text-white font-bold tracking-tight">
                              <s.icon className={`w-5 h-5 text-${s.color}-500 opacity-40`} />
                              {s.project}
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`px-3 py-1 bg-white/5 border border-white/10 rounded text-[9px] font-black tracking-widest text-white/40 uppercase group-hover:border-white/20 transition-all`}>
                               {s.status}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-white/40 text-sm font-mono">{s.lead}</td>
                          <td className="px-8 py-6 text-orange-500/80 font-bold font-mono tracking-tighter">{s.yield}</td>
                          <td className="px-8 py-6 text-right text-white/20 text-xs font-mono">{s.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>
          </div>

          {/* Pipeline & Daily Log Split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Idea Pipeline */}
            <div>
               <div className="flex items-center gap-4 mb-12">
                  <Filter className="w-6 h-6 text-orange-500" />
                  <h2 className="text-3xl font-bold uppercase tracking-tighter">Idea Pipeline</h2>
                  <span className="text-[10px] text-white/20 font-mono tracking-widest ml-auto uppercase">Gravy Index Locked</span>
               </div>
               
               <div className="space-y-4">
                  {pipeline.map((item) => (
                    <div key={item.id} className="glass-panel p-6 rounded-2xl border-white/5 flex items-center justify-between group hover:border-white/10 transition-all">
                       <div className="flex items-center gap-6">
                          <div className="text-xs text-white/20 font-black font-mono">#{item.id.toString().padStart(2, '0')}</div>
                          <div className="flex flex-col">
                             <div className="text-white font-bold tracking-tight group-hover:text-orange-500 transition-colors">{item.idea}</div>
                             <div className="text-[10px] text-white/40 uppercase tracking-widest font-black">{item.phase}</div>
                          </div>
                       </div>
                       <div className="flex items-center gap-6">
                          <div className={`px-2 py-0.5 rounded text-[10px] font-black ${item.verdict === 'GREEN' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                             {item.verdict}
                          </div>
                          <div className="text-xl font-black text-white italic tracking-tighter">{item.index}<span className="text-[10px] not-italic text-white/20">GI</span></div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Daily Build Log */}
            <div>
               <div className="flex items-center gap-4 mb-12">
                  <Clock className="w-6 h-6 text-orange-500" />
                  <h2 className="text-3xl font-bold uppercase tracking-tighter">Build Log</h2>
                  <span className="text-[10px] text-white/20 font-mono tracking-widest ml-auto uppercase">Pulse Updates</span>
               </div>

               <div className="space-y-8 relative">
                  {/* Vertical line for timeline */}
                  <div className="absolute left-6 top-0 bottom-0 w-px bg-white/5" />

                  {logs.map((log) => (
                    <div key={log.date} className="relative pl-16">
                       <div className="absolute left-4 top-2 w-4 h-4 rounded-full bg-black border border-orange-500 group-hover:scale-150 transition-transform" />
                       <div className="mb-2 flex items-center gap-4">
                          <span className="text-sm font-mono text-orange-500 font-bold">{log.date}</span>
                          <span className="px-2 py-0.5 bg-orange-500/10 text-orange-500 text-[10px] font-black rounded border border-orange-500/10 uppercase tracking-widest">Pulse {log.pulse}</span>
                       </div>
                       <div className="glass-panel p-8 rounded-3xl border-white/5 space-y-4">
                          {log.items.map((item, i) => (
                            <div key={i} className="flex gap-4 text-sm text-white/60 leading-relaxed font-mono italic">
                               <span className="text-orange-500/40">???</span>
                               {item}
                            </div>
                          ))}
                       </div>
                    </div>
                  ))}
               </div>
            </div>

          </div>

          {/* Monetization retro-visual */}
          <div className="mt-32 p-12 glass-panel rounded-[60px] border-orange-500/20 text-center relative overflow-hidden group">
             <div className="absolute inset-0 bg-noise opacity-5" />
             <div className="relative z-10">
                <Target className="w-12 h-12 text-orange-500 mx-auto mb-8 animate-pulse" />
                <h3 className="text-4xl font-bold mb-12 tracking-tighter">Monetization Deployment Sync</h3>
                
                <div className="max-w-xl mx-auto space-y-8">
                   {[
                     { label: "Infrastructure Locked", progress: 60 },
                     { label: "Spearhead S3 Build", progress: 30 },
                     { label: "S1/S2 Planning", progress: 10 }
                   ].map((bar) => (
                     <div key={bar.label}>
                        <div className="flex justify-between text-[10px] uppercase tracking-widest font-black text-white/40 mb-3">
                           <span>{bar.label}</span>
                           <span>{bar.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             whileInView={{ width: `${bar.progress}%` }}
                             className="h-full bg-orange-500" 
                           />
                        </div>
                     </div>
                   ))}
                </div>

                <div className="mt-16 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                   <div className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em]">
                      Jai.OS 5.0 // Global Sync: ACTIVE
                   </div>
                   <button className="px-8 py-4 bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-orange-500 transition-all hover:scale-105">
                      Download Full Report
                   </button>
                </div>
             </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
