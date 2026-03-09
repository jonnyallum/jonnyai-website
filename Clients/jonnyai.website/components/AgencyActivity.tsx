"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Activity, Zap, Cpu, Server } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import activityData from "@/lib/data/agent_activity.json";

export default function AgencyActivity() {
  const [logs, setLogs] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Speed of "live" updates
  useEffect(() => {
    // Initial load
    setLogs(activityData.slice(0, 5));
    setCurrentIndex(5);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < activityData.length) {
        setLogs((prev) => [activityData[currentIndex], ...prev].slice(0, 50));
        setCurrentIndex((prev) => prev + 1);
      } else {
        // Loop back or stay at end
        setCurrentIndex(0);
      }
    }, 4000); // New log every 4 seconds

    return () => clearInterval(interval);
  }, [currentIndex]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [logs]);

  return (
    <section className="py-32 bg-[#030303] border-y border-white/5 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-orange-500/5 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row gap-20 items-start">
          
          <div className="md:w-1/3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-[10px] text-orange-500 font-bold uppercase tracking-widest mb-8"
            >
              <Activity size={12} /> Neural activity live
            </motion.div>
            
            <h2 className="text-5xl font-bold text-white tracking-tighter mb-8 leading-[0.9]">
              The Warehouse <br />
              <span className="text-zinc-600 italic">Proof of Compute.</span>
            </h2>
            
            <p className="text-zinc-500 leading-relaxed mb-8">
              We don't just claim to have 67 agents. We broadcast their output. <br /><br />
              This is the live pulse of the Antigravity Orchestra — actual commits, build signatures, and autonomous logic forks occurring across our portfolio in real-time.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 border border-white/5 rounded-lg">
                <div className="text-2xl font-bold text-orange-500">67</div>
                <div className="text-[10px] uppercase tracking-widest text-zinc-600">Active Nodes</div>
              </div>
              <div className="p-4 bg-white/5 border border-white/5 rounded-lg">
                <div className="text-2xl font-bold text-orange-500">1,200+</div>
                <div className="text-[10px] uppercase tracking-widest text-zinc-600">Daily Events</div>
              </div>
            </div>
          </div>

          {/* Terminal Component */}
          <div className="md:w-2/3 w-full">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[500px]">
              {/* Terminal Header */}
              <div className="bg-zinc-900 px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
                </div>
                <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.3em] flex items-center gap-2">
                  <Cpu size={12} className="text-orange-500 animate-pulse" />
                  Neural_Bus_Primary // active
                </div>
                <div className="flex gap-4">
                    <Server size={14} className="text-zinc-800" />
                </div>
              </div>

              {/* Terminal Body */}
              <div 
                ref={scrollRef}
                className="flex-1 p-6 font-mono text-[11px] overflow-y-auto custom-scrollbar bg-black/60 backdrop-blur-sm"
              >
                <div className="space-y-4">
                  <AnimatePresence initial={false}>
                    {logs.map((log, i) => (
                      <motion.div
                        key={log.sha + i}
                        initial={{ opacity: 0, scale: 0.98, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="border-l border-white/5 pl-4 pb-4 last:pb-0"
                      >
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-orange-500 font-bold uppercase tracking-widest text-[9px]">
                            {log.author.split(' ')[0]}
                          </span>
                          <span className="text-zinc-800 text-[9px]">
                            {new Date(log.date).toLocaleTimeString()}
                          </span>
                          <span className="text-[9px] text-zinc-700 font-mono">
                            SHA-{log.sha.substring(0, 7)}
                          </span>
                        </div>
                        <div className="text-zinc-400 leading-normal max-w-2xl">
                          <span className="text-green-500 mr-2">$</span> {log.message}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </section>
  );
}
