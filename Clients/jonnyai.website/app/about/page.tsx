"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { Zap, Target, Flame, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24 px-6 max-w-5xl mx-auto">
        <section className="mb-24">
          <span className="text-orange-500 text-[11px] uppercase tracking-[0.4em] font-black mb-6 block">The Origin Story</span>
          <h1 className="text-4xl md:text-8xl font-bold mb-12 tracking-tighter">
            We don't build software. <br />
            <span className="text-white/40 italic">We build Engines.</span>
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <p className="text-white/60 text-lg md:text-xl leading-relaxed font-sans">
                JonnyAI was born out of a single realization: <span className="text-white font-bold">Traditional development is a relic.</span> 
                In a world of sub-second intelligence, waiting 6 months for an MVP is failure by default.
              </p>
              <p className="text-white/40 leading-relaxed">
                Antigravity is the result of that frustration. We've removed the project managers, the endless meetings, and the decision fatigue. In their place, we've built a 69-agent Hive Mind orchestrating code at terminal velocity.
              </p>
            </div>
            <div className="glass-card p-1 rounded-3xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-orange-500/10 blur-[40px] group-hover:bg-orange-500/20 transition-all" />
              <Image 
                src="/agents/portraits/marcus_cole.png" 
                alt="Conductor Marcus" 
                width={600} 
                height={600}
                className="relative z-10 grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {[
            { 
              title: "Trillion-Dollar Quality", 
              desc: "We don't do 'minimum viable.' We do 'market dominant.' Every line is type-safe, every design is God-tier.", 
              icon: Target 
            },
            { 
              title: "Collective Velocity", 
              desc: "69 specialized agents working in parallel means we hit milestones in 48 hours that take agencies months.", 
              icon: Flame 
            },
            { 
              title: "The Glass Box", 
              desc: "Total transparency. You see the commits, the banter, and the logic in real-time. No hidden progress.", 
              icon: Zap 
            }
          ].map((feature) => (
            <div key={feature.title} className="glass-card p-8 rounded-3xl border-white/5 hover:border-orange-500/20 transition-all">
              <feature.icon className="w-8 h-8 text-orange-500 mb-6" />
              <h3 className="text-white font-bold mb-4 uppercase tracking-wider">{feature.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </section>

        <section className="text-center py-24 border-t border-white/5">
          <h2 className="text-3xl font-bold mb-8">Ready to meet the <span className="text-orange-500 italic">Antigravity Orchestra?</span></h2>
          <div className="flex justify-center gap-4">
             <div className="flex -space-x-4">
                {[1,2,3,4,5].map(v => (
                  <div key={v} className="w-12 h-12 rounded-full border-2 border-black bg-white/[0.05] overflow-hidden">
                    <div className="w-full h-full bg-orange-500/20 flex items-center justify-center">
                      <Users className="w-4 h-4 text-white/20" />
                    </div>
                  </div>
                ))}
             </div>
             <span className="flex items-center text-[10px] uppercase tracking-widest text-white/20 font-black ml-4">
                + 64 More Specialists
             </span>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
