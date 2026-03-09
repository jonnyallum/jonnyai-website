"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { FlaskConical, Zap, ArrowRight, Search, Layers, Scale, BookOpen, Shield } from "lucide-react";
import Link from "next/link";

const ventures = [
  {
    title: "Creator Workflow",
    status: "LIVE",
    description: "AI automation templates that compress creator workflows from hours to minutes. One video → 12 platform-ready assets. Battle-tested by the Orchestra.",
    icon: Layers,
    color: "orange",
    href: "/creator-workflow",
    metric: "4h → 30min",
  },
  {
    title: "Compliance Firewall",
    status: "LIVE",
    description: "Know before you get banned. Real-time policy intelligence across 40+ creator platforms. Violation scanner, risk scoring, zero guesswork.",
    icon: Scale,
    color: "orange",
    href: "/compliance-firewall",
    metric: "260+ Rules Mapped",
  },
  {
    title: "Review Coach",
    status: "LIVE",
    description: "AI peer review simulator. Train on 50+ real papers before your first live review. Score breakdown across 8 dimensions. Conference-grade from day one.",
    icon: BookOpen,
    color: "orange",
    href: "/review-coach",
    metric: "50+ Real Papers",
  },
  {
    title: "GuardLayer",
    status: "LIVE",
    description: "The AI firewall for LLMs in production. Intercepts prompt injection, jailbreaks, and data exfiltration in real-time. Zero-latency. Full audit trail.",
    icon: Shield,
    color: "orange",
    href: "/ai-firewall",
    metric: "<1ms Interception",
  },
  {
    title: "AgentFlip",
    status: "SCALING",
    description: "AI-driven digital real estate arbitrage. Identifying liquidity gaps in 50+ niches simultaneously.",
    icon: Zap,
    color: "green",
    href: "https://agentflip.jonnyai.co.uk",
    metric: "50 Active Niches",
  },
  {
    title: "Headhunter_AI",
    status: "QUEUED",
    description: "Technical audit agent scanning GitHub complexity vs AI-fluff for elite candidate placement.",
    icon: Search,
    color: "blue",
    href: "#",
    metric: "Beta March 2026",
  }
];

export default function LabsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#050505]">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 px-6 max-w-7xl mx-auto w-full relative">
        {/* Background Atmosphere for Labs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-500/5 blur-[120px] rounded-full" />
        </div>

        <header className="mb-24 relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center border border-orange-500/20 font-black">
              <FlaskConical className="text-orange-500" size={24} />
            </div>
            <span className="text-orange-500 text-[11px] uppercase tracking-[0.5em] font-black">Antigravity Labs</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-8xl font-bold tracking-tighter text-white leading-none mb-8"
          >
            The Incubator. <br />
            <span className="text-white/40 italic font-serif">Building the Empire.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/60 text-lg md:text-xl max-w-2xl leading-relaxed font-sans border-l border-white/10 pl-8"
          >
            Autonomous monetization paths engineered by the Jai.OS 5.0 Orchestra. 
            High-margin code, recursive logic, and industrial-grade yield.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ventures.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.5 }}
              className="glass-card rounded-[32px] p-8 border-white/5 group hover:border-white/20 transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <v.icon size={120} />
              </div>

              <div className="flex items-center justify-between mb-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border bg-${v.color}-500/10 border-${v.color}-500/20`}>
                  <v.icon className={`text-${v.color}-500`} size={20} />
                </div>
                <span className="bg-white/5 border border-white/10 px-3 py-1 rounded text-[10px] text-white/50 font-black uppercase tracking-widest leading-none">
                  {v.status}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{v.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed font-medium mb-12">
                {v.description}
              </p>

              <div className="flex items-center justify-between mt-auto pt-8 border-t border-white/5">
                 <div className="flex flex-col">
                    <span className="text-[10px] text-white/20 uppercase font-black tracking-widest mb-1">Key Metric</span>
                    <span className="text-white text-lg font-black tracking-tighter">{v.metric}</span>
                 </div>
                 <Link 
                   href={v.href} 
                   className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-accent transition-all group/btn"
                 >
                    <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" size={20} />
                 </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
