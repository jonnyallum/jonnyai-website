"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { History, GitCommit, Search, Calendar, Rocket, Clock, ExternalLink } from "lucide-react";
import timelineData from "@/lib/data/timeline.json";
import { format } from "date-fns";

export default function HistoryPage() {
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
              <History className="w-3.5 h-3.5 text-accent" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-black text-accent">Tracing the Evolution</span>
            </motion.div>
            
            <h1 className="text-6xl md:text-9xl font-bold mb-8 leading-[0.95]">
              System<br />
              <span className="text-white/30 italic">Chronology.</span>
            </h1>
            
            <p className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-sans">
              From a single price calculator to a distributed Jai.OS 5.0 infrastructure. Explore the technical milestones that built the Antigravity Orchestra.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Center Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent/0 via-accent/20 to-accent/0 hidden md:block" />

            <div className="space-y-24 relative z-10">
              {timelineData.map((item, index) => {
                const date = new Date(item.date);
                const isEven = index % 2 === 0;

                return (
                  <motion.div 
                    key={item.name}
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className={`flex flex-col md:flex-row items-center gap-12 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    {/* Content Half */}
                    <div className={`flex-1 w-full ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                      <div className={`glass-panel p-8 md:p-12 rounded-[40px] border-white/5 hover:border-accent/20 transition-all group relative overflow-hidden`}>
                        {/* Background Decor */}
                        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-accent/5 blur-[120px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        
                        <div className={`relative z-10 flex flex-col ${isEven ? 'md:items-end' : 'md:items-start'} gap-4`}>
                           <div className="flex items-center gap-3 text-accent/60 font-mono text-[10px] uppercase tracking-widest mb-2">
                              {isEven && <span className="hidden md:block">{format(date, "MMMM d, yyyy")}</span>}
                               <Calendar className="w-3 h-3 text-accent" />
                              {!isEven && <span className="hidden md:block">{format(date, "MMMM d, yyyy")}</span>}
                              <span className="md:hidden">{format(date, "MMMM d, yyyy")}</span>
                           </div>
                           
                           <h3 className="text-2xl md:text-4xl font-bold text-white group-hover:text-accent transition-colors leading-tight mb-4 uppercase">
                              {item.name.replace(/-/g, ' ')}
                           </h3>
                           
                           <p className={`text-white/40 text-[13px] md:text-base leading-relaxed font-sans max-w-xl ${isEven ? 'md:ml-auto' : ''}`}>
                              {item.desc || "A critical milestone in the Antigravity infrastructure deployment chain."}
                           </p>

                           <div className={`mt-8 flex flex-wrap gap-4 ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                              <div className="px-4 py-2 border border-white/5 bg-white/5 rounded-full text-[9px] font-black uppercase tracking-widest text-white/30 group-hover:text-white transition-colors">
                                 #COMMIT-{format(date, "yyyyMMdd")}
                              </div>
                              <div className="px-4 py-2 border border-accent/10 bg-accent/5 rounded-full text-[9px] font-black uppercase tracking-widest text-accent opacity-40 group-hover:opacity-100 transition-opacity">
                                 {index < 5 ? "GENESIS PHASE" : index < 20 ? "KLIQT SPRINT" : "JAI.OS ACTIVE"}
                              </div>
                           </div>
                        </div>
                      </div>
                    </div>

                    {/* Center Point */}
                    <div className="relative flex items-center justify-center">
                       <div className="w-12 h-12 rounded-full border border-accent/20 bg-black z-20 flex items-center justify-center p-3 shadow-[0_0_30px_rgba(0,255,136,0.1)]">
                          <Rocket className="w-full h-full text-accent" />
                       </div>
                       <motion.div 
                        initial={{ scale: 0.8, opacity: 1 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute w-12 h-12 rounded-full border border-accent/40 z-10"
                       />
                    </div>

                    {/* Spacer Half */}
                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Final Call to Action */}
          <div className="mt-48 text-center bg-accent/5 rounded-[60px] p-24 border border-accent/10 relative overflow-hidden group">
             <div className="absolute inset-0 bg-noise opacity-10" />
             <Rocket className="w-16 h-16 text-accent mx-auto mb-12 animate-bounce" />
             <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to make <span className="text-accent italic">History?</span></h2>
             <p className="text-white/40 text-lg mb-12 max-w-2xl mx-auto uppercase tracking-widest leading-loose">
               The next major milestone is your project. Join the orchestra and build at the speed of thought.
             </p>
             <button className="px-12 py-6 bg-white text-black font-black uppercase tracking-[0.2em] rounded-full hover:bg-accent hover:scale-110 transition-all duration-500 shadow-[0_20px_60px_rgba(0,255,136,0.3)]">
                Launch My Project
             </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
