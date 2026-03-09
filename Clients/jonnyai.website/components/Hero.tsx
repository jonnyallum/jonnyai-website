"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Play, Info } from "lucide-react";
import { useRef } from "react";

export default function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-32 pb-20 px-6"
    >
      {/* Background Animated Atmosphere */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/brand/hero_background.png"
          alt="Antigravity Command Center"
          fill
          priority
          className="object-cover opacity-[0.25]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
        
        {/* The Neural Nova (Orange/Red) */}
        <motion.div 
          animate={{ 
            opacity: [0.08, 0.15, 0.08],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[radial-gradient(circle_800px_at_20%_40%,rgba(255,80,0,0.08),transparent)] blur-[120px]" 
        />
        
        {/* The Electric Cyan Flare */}
        <motion.div 
          animate={{ 
            opacity: [0.06, 0.12, 0.06],
            scale: [1.1, 1, 1.1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute inset-0 bg-[radial-gradient(circle_900px_at_80%_60%,rgba(0,180,255,0.07),transparent)] blur-[120px]" 
        />

        {/* High-Fidelity Neural Grid */}
        <div className="absolute inset-0 opacity-[0.05]" 
             style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "50px 50px" }} 
        />

        {/* Scrolling Pulse Line */}
        <motion.div 
          initial={{ top: "-10%" }}
          animate={{ top: "110%" }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-500/20 to-transparent pointer-events-none shadow-[0_0_20px_rgba(255,80,0,0.1)]"
        />
      </div>

      {/* Hero Content */}
      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 text-center max-w-5xl"
      >
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8 }}
           className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 glass-panel rounded-full border-orange-500/20"
        >
          <span className="flex h-2 w-2 rounded-full bg-[#FF5722] animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.3em] font-black text-[#FF5722]">February 2026: 50% Off Early Adopter Phase</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="text-4xl sm:text-6xl md:text-9xl font-black tracking-tight mb-8 leading-[0.95] md:leading-[1.1] text-white"
        >
          Stop Waiting Months.<br />
          Build at the <br />
          <span className="text-[#FF5722] italic">Speed of Thought.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-base sm:text-lg md:text-2xl font-sans max-w-3xl mx-auto leading-relaxed mb-12 px-4 text-white/80"
        >
          The <span className="text-white font-bold">AI Product Engine</span> that ships enterprise-grade MVPs in 48 hours. No project managers. No decision fatigue. Just an elite orchestra of 68 agents shipping code.
        </motion.p>

        {/* CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link 
            href="/brief" 
            className="group w-full sm:w-auto px-12 py-5 bg-white text-black text-[12px] uppercase tracking-[0.2em] font-black hover:bg-orange-500 hover:scale-105 transition-all duration-500 rounded-full flex items-center justify-center gap-2 shadow-[0_0_50px_rgba(255,80,0,0.2)]"
          >
            CHAT NOW
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/menu" 
            className="group w-full sm:w-auto px-12 py-5 glass-panel border-white/10 text-white text-[12px] uppercase tracking-[0.2em] font-black hover:bg-white/5 transition-all duration-500 rounded-full flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            View Service Menu
          </Link>
        </motion.div>

        {/* Trust Signals / Footer context */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 2 }}
          className="mt-20 flex flex-wrap justify-center gap-x-12 gap-y-6 opacity-30 grayscale hover:grayscale-0 transition-all duration-1000"
        >
          {['NEXT.JS 15', 'SUPABASE REALTIME', 'FRAMER MOTION', 'AgOS 4.0'].map((tech) => (
            <span key={tech} className="text-[10px] font-mono tracking-[0.3em] font-black">{tech}</span>
          ))}
        </motion.div>
      </motion.div>

      {/* Side Intelligence Context (Dr. Elias Thorne Injected) */}
      <div className="hidden xl:block absolute left-10 top-1/2 -translate-y-1/2 max-w-[140px] opacity-20 hover:opacity-100 transition-opacity duration-500 cursor-default">
         <div className="flex flex-col gap-8 border-l border-white/10 pl-4 py-8">
            <div className="flex flex-col gap-2">
               <Info className="w-4 h-4 text-orange-500" />
                <p className="text-[9px] leading-relaxed font-mono uppercase tracking-wider">
                  &quot;Speed is the only defensible moat for startups in 2026.&quot;
                </p>
               <span className="text-[8px] text-orange-500/60 font-black">— Dr. Elias Thorne</span>
            </div>
         </div>
      </div>
    </section>
  );
}
