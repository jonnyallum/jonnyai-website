"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { agents, AgentTier } from "@/lib/data/agents";
import { Users, Code, Palette, Search, Shield, Target, TrendingUp, Cpu, Scale, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

const tiers: { label: AgentTier; icon: any }[] = [
  { label: "Command", icon: CrownIcon },
  { label: "Development", icon: Code },
  { label: "Design", icon: Palette },
  { label: "Growth", icon: TrendingUp },
  { label: "Intelligence", icon: Brain },
  { label: "Operations", icon: Cpu },
  { label: "Legal", icon: scaleIcon },
  { label: "Quality", icon: Shield },
  { label: "Strategy", icon: Target },
  { label: "Betting", icon: BoltIcon },
];

function CrownIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  );
}

function BoltIcon(props: any) {
    return <Search {...props} /> // Placeholder for Bolt
}

function scaleIcon(props: any) {
    return <Scale {...props} />
}

export default function AgentGrid() {
  const [activeTier, setActiveTier] = useState<AgentTier | "All">("All");

  const filteredAgents = activeTier === "All" 
    ? agents 
    : agents.filter(a => a.tier === activeTier);

  return (
    <div className="space-y-12">
      {/* Tier Filter */}
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={() => setActiveTier("All")}
          className={cn(
            "px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-black transition-all border",
            activeTier === "All" 
              ? "bg-accent text-black border-accent" 
              : "border-white/10 text-white/40 hover:text-white hover:border-white/20"
          )}
        >
          All Personnel
        </button>
        {tiers.map(tier => (
          <button
            key={tier.label}
            onClick={() => setActiveTier(tier.label)}
            className={cn(
              "px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-black transition-all border flex items-center gap-2",
              activeTier === tier.label 
                ? "bg-accent text-black border-accent" 
                : "border-white/10 text-white/40 hover:text-white hover:border-white/20"
            )}
          >
            <tier.icon className="w-3 h-3" />
            {tier.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredAgents.map((agent) => (
            <motion.div
              key={agent.handle}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="glass-card rounded-2xl p-6 group hover:border-accent/40 transition-all flex flex-col items-start"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5 text-white/40 group-hover:text-accent" />
                </div>
                <div>
                   <span className="text-accent text-[9px] uppercase tracking-widest font-black block">{agent.handle}</span>
                   <h4 className="text-white font-bold text-sm">{agent.name}</h4>
                </div>
              </div>
              
              <div className="mb-4">
                <span className="text-[8px] uppercase tracking-tighter text-white/20 font-mono block mb-1">Position // {agent.tier}</span>
                <p className="text-white/60 text-[11px] leading-tight font-medium">{agent.role}</p>
              </div>

              <div className="mt-auto pt-4 border-t border-white/5 w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  <span className="text-[8px] text-accent font-black uppercase tracking-widest">Active</span>
                </div>
                <span className="text-[8px] text-white/10 font-mono">AgOS 4.0 Stable</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
