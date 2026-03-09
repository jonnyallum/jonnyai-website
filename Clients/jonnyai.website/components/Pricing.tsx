"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, ShieldCheck, Zap, Globe } from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    name: "The Facelift",
    subtitle: "UI/UX REVOLUTION",
    price: "£497",
    original: "£997",
    features: ["God-Tier Visual Makeover", "Performance Audit (95+)", "Framer Motion Animations", "24h Initial Concept"],
    cta: "Start Your Preview",
    accent: false,
  },
  {
    name: "The Launchpad",
    subtitle: "FULL PRODUCT ENGINE",
    price: "£997",
    original: "£1,997",
    features: ["Complete Next.js Build", "Supabase Integration", "48-Hour Delivery Guarantee", "Glass Box Access Included"],
    cta: "Brief The Conductor",
    accent: true,
  },
  {
    name: "The App Sprint",
    subtitle: "FUNCTIONAL WEB APP",
    price: "£2,497",
    original: "£4,997",
    features: ["Complex DB Architecture", "PWA/Mobile Optimization", "72-Hour Rapid Assembly", "Dedicated Conductor Support"],
    cta: "Secure Your Slot",
    accent: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6 bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="mb-8 inline-flex items-center gap-2 px-6 py-2 glass-panel rounded-full border-orange-500/20 bg-orange-500/5"
          >
            <span className="text-orange-500 text-[10px] uppercase tracking-[0.3em] font-black">Early Adopter Offer: 50% Off Until March 31</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-bold mb-8"
          >
            Surgical Pricing.<br />
            <span className="text-white/40 italic">Industrial Velocity.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card rounded-[40px] p-10 flex flex-col border-white/5 relative group hover:border-white/20 transition-all duration-700 ${tier.accent ? 'scale-105 z-10 border-orange-500/20' : ''}`}
            >
              {tier.accent && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-orange-500 rounded-full">
                  <span className="text-black text-[10px] uppercase font-black tracking-widest leading-none">Most Popular</span>
                </div>
              )}

              <div className="mb-10">
                <span className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-black mb-4 block leading-none">{tier.subtitle}</span>
                <h3 className="text-3xl font-bold text-white mb-6 leading-none">{tier.name}</h3>
                
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-black text-white leading-none tracking-tighter">{tier.price}</span>
                  <span className="text-white/20 text-xl font-bold line-through mb-1">{tier.original}</span>
                </div>
              </div>

              <div className="space-y-6 mb-12 flex-1">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-4 group/item">
                    <div className="mt-1 w-5 h-5 rounded-full bg-white/5 flex items-center justify-center group-hover/item:bg-orange-500/20 transition-colors">
                      <Check className="w-3 h-3 text-orange-500" />
                    </div>
                    <span className="text-white/60 text-sm font-medium group-hover/item:text-white transition-colors">{feature}</span>
                  </div>
                ))}
              </div>

              <Link 
                href="/brief"
                className={`w-full py-5 rounded-[20px] text-center text-[12px] uppercase tracking-[0.2em] font-black transition-all duration-500 flex items-center justify-center gap-3 overflow-hidden relative group/btn ${tier.accent ? 'bg-orange-500 text-black shadow-[0_20px_40px_rgba(255,80,0,0.2)]' : 'bg-white text-black hover:bg-orange-500'}`}
              >
                <span className="relative z-10">{tier.cta}</span>
                <ArrowRight className="w-4 h-4 relative z-10 group-hover/btn:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Global Guarantees */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
           <div className="flex items-center gap-6 p-8 glass-panel rounded-3xl group">
              <Zap className="w-10 h-10 text-orange-500 group-hover:scale-110 transition-transform" />
              <div>
                <h4 className="text-white font-black text-xs uppercase tracking-widest mb-2">48H SLA</h4>
                <p className="text-white/40 text-[11px] leading-relaxed">Full builds shipped in 48 hours or you get Phase 1 free.</p>
              </div>
           </div>
           <div className="flex items-center gap-6 p-8 glass-panel rounded-3xl group">
              <ShieldCheck className="w-10 h-10 text-orange-500 group-hover:scale-110 transition-transform" />
              <div>
                <h4 className="text-white font-black text-xs uppercase tracking-widest mb-2">0% Hidden Fees</h4>
                <p className="text-white/40 text-[11px] leading-relaxed">Exact pricing via Marcus during briefing. No surprise invoices.</p>
              </div>
           </div>
           <div className="flex items-center gap-6 p-8 glass-panel rounded-3xl group">
              <Globe className="w-10 h-10 text-orange-500 group-hover:scale-110 transition-transform" />
              <div>
                <h4 className="text-white font-black text-xs uppercase tracking-widest mb-2">Global Scale</h4>
                <p className="text-white/40 text-[11px] leading-relaxed">Distributed Jai.OS 5.0 infrastructure for zero latency.</p>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}
