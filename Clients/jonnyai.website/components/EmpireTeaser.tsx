"use client";

import { motion } from "framer-motion";
import { Crown, Zap, ShieldCheck, Rocket, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    name: "Founding Cohort",
    status: "3 SPOTS LEFT",
    price: "£4,997/mo",
    features: ["Direct @Marcus Access", "Full Architecture Sync", "Prioritized Build Queue"],
    color: "orange"
  },
  {
    name: "Expansion Tier",
    status: "AVAILABLE",
    price: "£2,497/mo",
    features: ["Agent Orchestra Access", "Glass Box Monitoring", "Weekly Strategic Sprints"],
    color: "blue"
  }
];

export default function EmpireTeaser() {
  return (
    <section className="py-24 px-6 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-6"
            >
              <Crown className="text-orange-500 w-5 h-5" />
              <span className="text-orange-500 text-[10px] uppercase tracking-[0.4em] font-black">Empire OS // Initial Release</span>
            </motion.div>
            
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6">
              Own the Orchestra. <br />
              <span className="text-white/40 italic font-serif">Build your Empire.</span>
            </h2>
            
            <p className="text-white/60 text-lg leading-relaxed border-l border-white/10 pl-8">
              We aren't just a service; we are an OS for your business. 
              Deploy the 68-agent Antigravity Orchestra onto your projects with 
              recursive build logic and industrial-grade yield.
            </p>
          </div>
          
          <Link href="/empire" className="group flex items-center gap-3 text-white/40 hover:text-white transition-all">
             <span className="text-[10px] uppercase tracking-[0.3em] font-black">Enter The Dashboard</span>
             <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-black transition-all">
                <ArrowRight className="w-4 h-4" />
             </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-10 rounded-[40px] border-white/5 relative overflow-hidden group hover:border-orange-500/20 transition-all duration-500"
            >
              <div className="flex justify-between items-start mb-12">
                 <div>
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded text-[9px] font-black text-white/40 uppercase tracking-widest mb-4 block w-fit">
                       {tier.status}
                    </span>
                    <h3 className="text-3xl font-bold text-white">{tier.name}</h3>
                 </div>
                 {tier.color === 'orange' ? <Crown className="text-orange-500 w-8 h-8 opacity-20" /> : <Rocket className="text-blue-500 w-8 h-8 opacity-20" />}
              </div>

              <div className="mb-12">
                 <div className="text-4xl font-black text-white mb-2">{tier.price}</div>
                 <div className="text-[10px] text-white/20 uppercase tracking-[0.2em]">Retainer / Project Management</div>
              </div>

              <ul className="space-y-4 mb-12">
                 {tier.features.map(f => (
                   <li key={f} className="flex items-center gap-3 text-sm text-white/60">
                      <Zap className="w-3 h-3 text-orange-500" />
                      {f}
                   </li>
                 ))}
              </ul>

              <Link 
                href="/brief"
                className="flex items-center justify-center gap-3 w-full py-5 bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-orange-500 transition-all"
              >
                Request Access
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
