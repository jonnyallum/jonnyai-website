import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Agitation from "@/components/Agitation";
import GlassBoxPreview from "@/components/GlassBoxPreview";
import Workforce from "@/components/Workforce";
import AgencyActivity from "@/components/AgencyActivity";
import Pricing from "@/components/Pricing";
import EmpireTeaser from "@/components/EmpireTeaser";
import DreamerVentures from "@/components/DreamerVentures";
import Workflow from "@/components/Workflow";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main>
        <Hero />
        
        <div className="relative">
          {/* Subtle separator glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
          <Agitation />
        </div>

        <GlassBoxPreview />
        
        <Workforce />
        
        <AgencyActivity />

        <EmpireTeaser />

        <DreamerVentures />

        <div className="bg-white/[0.01]">
          <Pricing />
        </div>

        <Workflow />

        {/* Section 07: Final CTA */}
        <section className="py-24 px-6 bg-black">
          <div className="max-w-4xl mx-auto glass-card rounded-[60px] p-12 md:p-24 text-center border-accent/20 relative overflow-hidden group">
            {/* Background Decor */}
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-accent/5 blur-[120px] rounded-full group-hover:bg-accent/10 transition-colors duration-1000" />
            
            <span className="relative z-10 text-accent text-[11px] uppercase tracking-[0.5em] font-black mb-8 block">Ready for Production?</span>
            <h2 className="relative z-10 text-4xl md:text-7xl font-bold mb-10 leading-tight">
              Stop Burning Time.<br />
              <span className="text-white">Start </span>
              <span className="text-accent italic">Shipping.</span>
            </h2>
            
            <div className="relative z-10 flex flex-col items-center gap-8">
              <Link 
                href="/brief" 
                className="group w-full sm:w-auto px-10 py-6 bg-white text-black text-[14px] uppercase tracking-[0.2em] font-black hover:bg-accent hover:scale-105 transition-all duration-500 rounded-full flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(0,255,136,0.3)]"
              >
                Start Your Free Project Scope
                <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              
              <div className="flex items-center gap-4 text-[10px] text-white/30 uppercase tracking-[0.3em] font-mono">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                No Card Required // 48H Initial Concept Guarantee
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
