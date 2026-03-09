"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const blur = useTransform(scrollYProgress, [0, 0.5], ["0px", "10px"]);

  return (
    <section 
      ref={containerRef}
      className="relative h-screen h-[100svh] w-full flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Background Image (Color Revealed via Interaction or Scroll) */}
      <motion.div 
        style={{ y, scale, filter: `grayscale(15%)` }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="/assets/logo-hero.png"
          alt="JSC Construction Excellence"
          fill
          className="object-cover md:object-center opacity-70 md:opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/90 md:from-black/60 md:via-transparent md:to-black/80" />
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl pt-32 md:pt-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ opacity }}
        >
          <span className="text-accent text-[9px] md:text-[12px] uppercase tracking-[0.4em] font-semibold mb-6 block md:hidden">
            Carpentry Contractors
          </span>
          <h1 className="text-4xl md:text-8xl text-white font-serif leading-[1.1] md:leading-none mb-8">
            Building with purpose.<br />
            <span className="italic">Crafted</span> with care.
          </h1>
          <p className="text-white/80 text-sm md:text-xl font-sans max-w-2xl mx-auto leading-relaxed text-shadow-sm px-4 md:px-0">
            Premium residential construction and renovations across <span className="text-white font-bold">Portsmouth</span>, <span className="text-white font-bold">Hampshire</span>, <span className="text-white font-bold">West Sussex</span> and beyond.
          </p>
          
          <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
            <Link href="/projects/" className="w-full md:w-auto px-10 py-4 bg-white text-black text-[11px] uppercase tracking-[0.2em] font-black hover:bg-accent transition-colors duration-500 shadow-xl">
              View Our Work
            </Link>
            <Link href="/services/" className="w-full md:w-auto px-10 py-4 border border-white/40 text-white text-[11px] uppercase tracking-[0.2em] font-black hover:bg-white/10 transition-colors duration-500 backdrop-blur-sm">
              Our Services
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center pointer-events-none"
      >
        <span className="text-[8px] uppercase tracking-[0.3em] text-white/30 mb-4 whitespace-nowrap">Scroll to Explore</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-accent/50 to-transparent" />
      </motion.div>

      {/* Grain Overlay for Tactility */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </section>
  );
}
