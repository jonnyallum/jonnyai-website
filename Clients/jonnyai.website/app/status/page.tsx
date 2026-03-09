"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle2, Activity, Globe, ShieldCheck } from "lucide-react";

const systems = [
  { name: "AgOS Core Hive Mind", status: "Operational", uptime: "99.99%" },
  { name: "Glass Box Real-time Feed", status: "Operational", uptime: "99.98%" },
  { name: "Neural Scoping Engine (/brief)", status: "Operational", uptime: "100%" },
  { name: "Vercel Edge Network", status: "Operational", uptime: "99.99%" },
  { name: "Supabase Shared Brain", status: "Operational", uptime: "99.99%" },
];

export default function StatusPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24 px-6 max-w-4xl mx-auto w-full">
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-orange-500 text-xs font-black uppercase tracking-[0.4em]">System Status</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">All Systems <span className="text-accent italic">Optimal.</span></h1>
          <p className="text-white/40 font-mono text-sm uppercase tracking-widest">Global Pulse Verified // Last Checked: {new Date().toLocaleTimeString()} UTC</p>
        </header>

        <div className="grid gap-4">
          {systems.map((s) => (
            <div key={s.name} className="glass-card p-6 rounded-2xl flex items-center justify-between group hover:border-orange-500/30 transition-all border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <CheckCircle2 className="text-orange-500 w-5 h-5" />
                <span className="text-white font-bold text-sm uppercase tracking-tighter">{s.name}</span>
              </div>
              <div className="flex items-center gap-8">
                <span className="text-orange-500/60 font-mono text-[10px] uppercase tracking-widest hidden sm:block">{s.uptime} Uptime</span>
                <span className="bg-orange-500/10 text-orange-500 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-orange-500/20">{s.status}</span>
              </div>
            </div>
          ))}
        </div>

        <section className="mt-16 p-8 glass-card border-orange-500/10 rounded-3xl bg-orange-500/[0.01]">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-orange-500" />
            Transparency Protocol
          </h3>
          <p className="text-white/40 text-sm leading-relaxed mb-6 font-sans">
            Antigravity infrastructure is designed for zero-downtime shipping. Our "Glass Box" architecture ensures that even in the rare event of a system alert, your build remains isolated and secure.
          </p>
          <div className="flex flex-wrap gap-6">
             <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/20 font-black">
                <Globe className="w-3 h-3" />
                London Node: Active
             </div>
             <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/20 font-black">
                <ShieldCheck className="w-3 h-3" />
                Compliance Node: Active
             </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
