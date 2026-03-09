"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Calendar, Zap, Terminal, Code, Cpu, Shield, ArrowRight, ExternalLink } from "lucide-react";
import { useState, useMemo } from "react";
import activityData from "@/lib/data/agent_activity.json";
import { format } from "date-fns";

type Activity = {
  date: string;
  message: string;
  sha: string;
};

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "feat" | "fix" | "docs" | "chore">("all");

  const filteredActivity = useMemo(() => {
    return activityData.filter((item: Activity) => {
      const matchesSearch = item.message.toLowerCase().includes(search.toLowerCase());
      const type = item.message.split(":")[0]?.split("(")[0]?.toLowerCase();
      const matchesFilter = filter === "all" || type === filter;
      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  return (
    <div className="flex flex-col min-h-screen bg-black overflow-hidden selection:bg-accent selection:text-black">
      <Navbar />
      
      <main className="pt-40 pb-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-24 flex flex-col items-center text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-4 py-1.5 glass-panel rounded-full border-accent/20 mb-8"
            >
              <Terminal className="w-3.5 h-3.5 text-accent" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-black text-accent">Real-Time Development Stream</span>
            </motion.div>
            
            <h1 className="text-6xl md:text-9xl font-bold mb-8 leading-[0.95]">
              System<br />
              <span className="text-white/30 italic">Intelligence.</span>
            </h1>
            
            <p className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-sans">
              Experience the heartbeat of the Jai.OS 5.0 infrastructure. Every system update, skill optimization, and agent deployment streamed in real-time.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-6 mb-16 items-center justify-between">
             <div className="relative w-full md:w-96 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-hover:text-accent transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search system logs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-12 pr-6 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-accent/40 focus:bg-white/[0.07] transition-all"
                />
             </div>

             <div className="flex gap-2 overflow-x-auto pb-4 md:pb-0 w-full md:w-auto">
                {["all", "feat", "fix", "docs", "chore"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilter(t as any)}
                    className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                      filter === t 
                        ? "bg-accent text-black border-accent" 
                        : "bg-white/5 text-white/40 border-white/5 hover:border-white/20"
                    }`}
                  >
                    {t}
                  </button>
                ))}
             </div>
          </div>

          {/* Activity Feed */}
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredActivity.map((item: Activity, index: number) => {
                const type = item.message.split(":")[0]?.split("(")[0]?.toLowerCase() || "sys";
                const content = item.message.includes(":") ? item.message.split(":").slice(1).join(":").trim() : item.message;
                
                return (
                  <motion.div
                    key={item.sha}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="glass-panel p-8 md:p-10 rounded-[40px] border-white/5 hover:border-accent/20 transition-all group relative overflow-hidden"
                  >
                    {/* Dev Icon */}
                    <div className="absolute right-10 top-10 opacity-5 group-hover:opacity-10 transition-opacity">
                       {type === 'feat' ? <Zap className="w-16 h-16 text-accent" /> : <Terminal className="w-16 h-16 text-white" />}
                    </div>

                    <div className="flex flex-col md:flex-row md:items-start gap-8 relative z-10">
                       <div className="flex-shrink-0 flex md:flex-col items-center gap-4 text-white/20">
                          <Calendar className="w-4 h-4" />
                          <span className="text-[10px] font-mono tracking-tighter uppercase whitespace-nowrap">
                            {format(new Date(item.date), "MMM d, HH:mm")}
                          </span>
                       </div>

                       <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                             <div className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter ${
                               type === 'feat' ? 'bg-accent/10 text-accent border border-accent/20' : 
                               type === 'fix' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                               'bg-white/10 text-white/60 border border-white/20'
                             }`}>
                                {type}
                             </div>
                             <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">SHA // {item.sha.substring(0, 7)}</span>
                          </div>

                          <h3 className="text-xl md:text-2xl font-bold text-white mb-6 group-hover:text-accent transition-colors leading-snug max-w-4xl">
                             {content.split('\n')[0]}
                          </h3>

                          {content.includes('\n') && (
                            <div className="bg-black/40 rounded-2xl p-6 border border-white/5 mb-8">
                               <pre className="text-[11px] md:text-xs text-white/40 leading-relaxed font-mono whitespace-pre-wrap">
                                 {content.split('\n').slice(1).join('\n').trim()}
                               </pre>
                            </div>
                          )}

                          <div className="flex items-center gap-8">
                             <div className="flex items-center gap-2">
                                <Code className="w-3.5 h-3.5 text-accent/40" />
                                <span className="text-[10px] text-white/40 uppercase font-black tracking-widest">Modified by @Orchestra</span>
                             </div>
                             <motion.div 
                              whileHover={{ x: 5 }}
                              className="flex items-center gap-2 cursor-pointer"
                             >
                                <span className="text-[10px] text-accent font-black uppercase tracking-widest">View diff</span>
                                <ExternalLink className="w-3.5 h-3.5 text-accent" />
                             </motion.div>
                          </div>
                       </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {filteredActivity.length === 0 && (
              <div className="py-24 text-center glass-panel rounded-[40px] border-dashed border-white/10">
                 <Search className="w-12 h-12 text-white/10 mx-auto mb-6" />
                 <p className="text-white/40 uppercase tracking-widest text-xs font-black">No system events matched your query.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
