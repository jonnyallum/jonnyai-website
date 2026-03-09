"use client";

import { motion } from "framer-motion";
import { Terminal, Shield, Activity, Code2, CheckCircle2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface Task {
  id: number;
  time: string;
  agent: string;
  action: string;
  status: 'success' | 'active' | 'alert';
}

export default function GlassBoxPreview() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('/data/glass_box.json');
        if (res.ok) {
          const data = await res.json();
          setTasks(data);
        }
      } catch (e) {
        console.error("Failed to fetch Glass Box tasks", e);
      }
    };

    fetchTasks();
    const interval = setInterval(fetchTasks, 30000); // Polling every 30s
    return () => clearInterval(interval);
  }, []);
  return (
    <section className="py-24 px-6 bg-black relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[300px] md:h-[500px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 glass-panel rounded-xl flex items-center justify-center border-orange-500/20">
              <Shield className="w-5 h-5 text-orange-500" />
            </div>
            <span className="text-orange-500 text-[11px] uppercase tracking-[0.4em] font-black">Section 03: The Showstopper</span>
          </div>
          
          <h2 className="text-4xl md:text-7xl font-bold mb-8 leading-tight">
            See Your Code<br />
            <span className="italic text-orange-500">Come to Life.</span>
          </h2>
          
          <p className="text-white/60 text-base md:text-xl font-sans max-w-xl leading-relaxed mb-10">
            Traditional agencies hide behind "Weekly Updates." We give you the <span className="text-white font-bold">Glass Box</span>. Watch Marcus, Priya, and Jonny AI commit code, resolve alerts, and push milestones in real-time. 
          </p>

          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4">
               <div className="mt-1 bg-orange-500/20 p-2 rounded-lg">
                  <Activity className="w-4 h-4 text-orange-500" />
               </div>
               <div>
                  <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-1">Zero Blind Spots</h4>
                  <p className="text-white/40 text-[11px]">Every task, alert, and commit is visualized via Supabase Realtime.</p>
               </div>
            </div>
            <div className="flex items-start gap-4">
               <div className="mt-1 bg-white/5 p-2 rounded-lg">
                  <Shield className="w-4 h-4 text-white/40" />
               </div>
               <div>
                  <h4 className="text-white/40 font-bold text-sm uppercase tracking-wider mb-1">Military-Grade Isolation</h4>
                  <p className="text-white/40 text-[11px]">RLS policies ensure you see only your build. Truth-lock verified by @Victor.</p>
               </div>
            </div>
          </div>
        </motion.div>

        {/* The Mock Dashboard */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="relative group w-full"
        >
          <div className="glass-card rounded-[32px] p-4 md:p-6 border-white/10 relative z-10 overflow-hidden shadow-2xl">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="h-3 w-3 rounded-full bg-red-500/20 flex-shrink-0 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                </div>
                <span className="text-[9px] md:text-[10px] uppercase tracking-widest font-mono text-white/40 truncate">Glass Box Feed // Project: Alpha_MVP</span>
              </div>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-white/10" />
                <div className="w-2 h-2 rounded-full bg-white/10" />
              </div>
            </div>

            {/* Live Feed Container */}
            <div className="space-y-4 mb-8 min-h-[300px]">
              {tasks.length > 0 ? tasks.slice(0, 5).map((task, i) => (
                <motion.div 
                  key={task.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 md:gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group/task"
                >
                  <span className="text-[9px] font-mono text-white/20 mt-1 flex-shrink-0">{task.time}</span>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] md:text-[10px] font-black text-orange-500 uppercase tracking-tighter">@{task.agent}</span>
                      {task.status === "success" ? (
                        <CheckCircle2 className="w-3 h-3 text-orange-500" />
                      ) : task.status === "alert" ? (
                        <AlertCircle className="w-3 h-3 text-red-500" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                      )}
                    </div>
                    <p className="text-[11px] md:text-[12px] text-white/80 font-mono tracking-tight break-words line-clamp-2">{task.action}</p>
                  </div>
                </motion.div>
              )) : (
                <div className="flex flex-col items-center justify-center py-20 text-white/20 font-mono text-[10px] uppercase tracking-widest">
                  <Activity className="w-5 h-5 mb-4 animate-pulse" />
                  Synchronizing Pulse...
                </div>
              )}
            </div>

            {/* Terminal Input Mock */}
            <div className="bg-black/40 rounded-xl p-4 border border-white/5 flex items-center gap-3">
              <Terminal className="w-4 h-4 text-white/20 flex-shrink-0" />
              <span className="text-white/20 text-[10px] md:text-xs font-mono">Awaiting mission update from @Conductor...</span>
            </div>

            {/* Workforce Overlay */}
            <div className="absolute top-20 right-4 md:right-6 flex flex-col gap-3">
               {[1,2,3].map((v) => (
                 <div key={v} className="w-8 h-8 rounded-full border border-orange-500/30 bg-black flex items-center justify-center shadow-[0_0_15px_rgba(255,80,0,0.1)]">
                   <div className="w-6 h-6 rounded-full bg-white/10 overflow-hidden" />
                 </div>
               ))}
            </div>
          </div>
          
          {/* Decorative Background Elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/20 blur-[60px] rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-500/10 blur-[60px] rounded-full" />
        </motion.div>
      </div>
    </section>
  );
}
