"use client";

import { motion } from "framer-motion";
import { MessageSquare, ClipboardCheck, Wallet, ChevronRight } from "lucide-react";

const steps = [
  {
    id: "01",
    label: "Brief @Marcus",
    description: "Connect to our chat interface. Our Conductor will ask 5 qualifying questions to map your product roadmap.",
    icon: MessageSquare,
  },
  {
    id: "02",
    label: "Review Milestones",
    description: "Receive a transparent 3-phase technical scope with exact delivery dates and fixed pricing signatures.",
    icon: ClipboardCheck,
  },
  {
    id: "03",
    label: "Fund & Watch",
    description: "Click 'Fund Phase 1'. Your Glass Box dashboard goes live instantly. Watch the orchestra ship your code.",
    icon: Wallet,
  },
];

export default function Workflow() {
  return (
    <section className="py-24 px-6 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-accent text-[11px] uppercase tracking-[0.4em] font-black mb-6 block"
          >
            Phase 06: Frictionless Onboarding
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-bold mb-8"
          >
            From Vision to Production.<br />
            <span className="text-white/40 italic">Zero Friction.</span>
          </motion.h2>
        </div>

        <div className="relative">
          {/* Connector Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="glass-card rounded-[40px] p-12 text-center group hover:border-accent/30 transition-all duration-700"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-10 transition-all duration-500 group-hover:scale-110 group-hover:bg-accent/10">
                  <step.icon className="w-7 h-7 text-white group-hover:text-accent transition-colors" />
                </div>
                
                <span className="text-accent text-[10px] font-black tracking-widest block mb-4">{step.id} // STEP</span>
                <h3 className="text-2xl font-bold text-white mb-6 leading-none tracking-tight">{step.label}</h3>
                <p className="text-white/40 text-sm leading-relaxed max-w-xs mx-auto mb-8 font-medium">
                  {step.description}
                </p>

                {i < 2 && (
                  <div className="lg:hidden w-px h-12 bg-white/10 mx-auto my-4" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-24 text-center"
        >
          <button className="group glass-panel rounded-full px-12 py-5 border-white/5 hover:bg-white/5 transition-all duration-500 flex items-center gap-4 mx-auto">
            <span className="text-[12px] uppercase tracking-[0.2em] font-black text-white">Start Your Free Project Scope</span>
            <ChevronRight className="w-5 h-5 text-accent group-hover:translate-x-2 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
