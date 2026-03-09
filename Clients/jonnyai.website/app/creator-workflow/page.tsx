"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Package, DollarSign, Clock, ArrowRight, CheckCircle, ChevronRight, Layers, Repeat, Users } from "lucide-react";
import StripeButton from "@/components/StripeButton";

const templates = [
  {
    name: "Content Repurpose Engine",
    category: "Content",
    time_saved: "4h → 22min",
    description: "One video → 12 platform-ready assets. Auto-captions, clips, thumbnails, tweet threads, and newsletter blurb.",
    tools: ["Claude API", "FFmpeg", "Buffer"],
    price: 47,
  },
  {
    name: "Newsletter Factory",
    category: "Email",
    time_saved: "3h → 18min",
    description: "Research topics → draft → proofread → schedule. Full workflow from brief to Beehiiv/Substack publish.",
    tools: ["Claude API", "Beehiiv", "Perplexity"],
    price: 47,
  },
  {
    name: "Social Media Blitz Kit",
    category: "Social",
    time_saved: "2h → 12min",
    description: "Weekly social calendar in minutes. 21 posts across all platforms — pre-written, scheduled, and hashtagged.",
    tools: ["Claude API", "n8n", "Buffer"],
    price: 47,
  },
  {
    name: "Lead Magnet Builder",
    category: "Growth",
    time_saved: "6h → 35min",
    description: "Idea to downloadable PDF guide. Research, outline, write, design-ready export — automated start to finish.",
    tools: ["Claude API", "Canva API", "ConvertKit"],
    price: 67,
  },
  {
    name: "Podcast Show Notes Machine",
    category: "Audio",
    time_saved: "90min → 8min",
    description: "Upload raw audio. Get timestamped show notes, SEO title, description, and social clips automatically.",
    tools: ["Whisper API", "Claude API", "Transistor"],
    price: 47,
  },
  {
    name: "Agency Proposal Generator",
    category: "Sales",
    time_saved: "5h → 30min",
    description: "Answer 10 questions. Receive a fully scoped, priced, branded proposal PDF — client-ready in minutes.",
    tools: ["Claude API", "Notion", "DocuSign API"],
    price: 97,
  },
];

const proofPoints = [
  { stat: "4h → 30min", label: "Average workflow compression" },
  { stat: "£47", label: "Entry price per template" },
  { stat: "2 weeks", label: "From zero to first sale" },
  { stat: "68", label: "Specialist agents that built this" },
];

const howItWorks = [
  {
    step: "01",
    title: "Pick your bottleneck",
    description: "Browse the library by category — content, email, sales, audio. Every template targets one specific time sink.",
  },
  {
    step: "02",
    title: "Download and deploy",
    description: "Each template includes a ready-to-run automation blueprint for n8n or Zapier, plus a Claude prompt pack and setup guide.",
  },
  {
    step: "03",
    title: "Compress your workflow",
    description: "First run in under 30 minutes. Your 4-hour process becomes 30 minutes. Permanently.",
  },
];

export default function CreatorWorkflowPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#050508] text-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-3 mb-8 px-4 py-2 rounded-full border border-orange-500/20 bg-orange-500/5">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-orange-500 text-[10px] uppercase tracking-[0.4em] font-black">Dreamer Venture — Live Now</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-black leading-[0.9] mb-8 tracking-tighter">
              4 Hours.<br />
              <span className="text-orange-500">30 Minutes.</span>
            </h1>

            <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
              AI automation templates that compress creator workflows from hours to minutes.
              Built by the Antigravity Orchestra. Ready to deploy today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/brief?product=creator-workflow"
                className="group px-8 py-4 bg-orange-500 text-black text-[11px] uppercase tracking-[0.3em] font-black rounded-full hover:bg-white transition-all duration-300 flex items-center gap-3 justify-center"
              >
                Get Early Access
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#templates"
                className="px-8 py-4 border border-white/10 text-[11px] uppercase tracking-[0.3em] font-black rounded-full hover:border-orange-500/40 transition-all duration-300 text-white/60 hover:text-white"
              >
                Browse Templates
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Proof Bar */}
      <section className="py-12 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {proofPoints.map((p, i) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-black text-orange-500 mb-2">{p.stat}</div>
                <div className="text-[10px] uppercase tracking-widest text-white/30">{p.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-3xl p-10 md:p-16 border-white/5"
          >
            <span className="text-orange-500 text-[10px] uppercase tracking-[0.5em] font-black mb-6 block">The Problem</span>
            <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">
              You're spending your best hours on work that should take minutes.
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              {[
                { icon: Clock, label: "4–6 hours", sub: "per piece of content, manually" },
                { icon: Repeat, label: "Same tasks", sub: "repeated every single week" },
                { icon: DollarSign, label: "£50–200/hr", sub: "of your time burned on busywork" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-3">
                  <item.icon className="w-6 h-6 text-orange-500/60" />
                  <div className="text-xl font-black">{item.label}</div>
                  <div className="text-white/40 text-sm">{item.sub}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-orange-500 text-[10px] uppercase tracking-[0.5em] font-black mb-4 block">How It Works</span>
            <h2 className="text-4xl md:text-6xl font-black leading-tight">Download. Deploy. Done.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="glass-panel rounded-2xl p-8 border-white/5 relative"
              >
                <div className="text-[80px] font-black text-orange-500/10 leading-none mb-4">{step.step}</div>
                <h3 className="text-xl font-black mb-4">{step.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Template Library */}
      <section id="templates" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-orange-500 text-[10px] uppercase tracking-[0.5em] font-black mb-4 block">Template Library</span>
            <h2 className="text-4xl md:text-6xl font-black leading-tight">Pick Your Bottleneck</h2>
            <p className="text-white/40 mt-4 max-w-xl mx-auto">Every template includes a full automation blueprint, Claude prompt pack, setup video, and 30-day support.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-panel rounded-2xl p-8 border-white/5 hover:border-orange-500/20 transition-all duration-300 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-[9px] uppercase tracking-widest text-orange-500 font-black border border-orange-500/20 px-2 py-1 rounded-full">{t.category}</span>
                  <span className="text-orange-500 font-black text-lg">£{t.price}</span>
                </div>
                <h3 className="text-lg font-black mb-3">{t.name}</h3>
                <p className="text-white/40 text-sm leading-relaxed flex-1 mb-6">{t.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-orange-500/60" />
                    <span className="text-[10px] text-orange-500 font-black">{t.time_saved}</span>
                  </div>
                  <div className="flex gap-1">
                    {t.tools.slice(0, 2).map((tool) => (
                      <span key={tool} className="text-[8px] text-white/20 border border-white/10 px-2 py-0.5 rounded-full">{tool}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-orange-500 text-[10px] uppercase tracking-[0.5em] font-black mb-4 block">Pricing</span>
            <h2 className="text-4xl md:text-6xl font-black leading-tight">Pay Once. Own It Forever.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Single Template",
                price: "£47",
                sub: "one-time",
                amount: 47,
                isSubscription: false,
                description: "One template, full automation blueprint, Claude prompt pack, setup guide.",
                features: ["Full n8n / Zapier blueprint", "Claude prompt pack", "Video walkthrough", "30-day support"],
                cta: "Get a Template",
                highlight: false,
              },
              {
                name: "Creator Bundle",
                price: "£197",
                sub: "one-time",
                amount: 197,
                isSubscription: false,
                description: "5 templates of your choice. Best for full-stack content creators and agencies.",
                features: ["5 templates", "Everything in Single", "Priority support", "Lifetime updates"],
                cta: "Get the Bundle",
                highlight: true,
              },
              {
                name: "Template Builder",
                price: "£99/mo",
                sub: "per month",
                amount: 99,
                isSubscription: true,
                description: "Publish templates to our marketplace. Earn 60% revenue share on every sale.",
                features: ["Publish unlimited templates", "60% revenue share", "Builder community", "Co-marketing"],
                cta: "Start Building",
                highlight: false,
              },
            ].map((plan) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className={`glass-panel rounded-2xl p-8 border flex flex-col ${plan.highlight ? "border-orange-500/40 relative" : "border-white/5"}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-orange-500 rounded-full text-[9px] uppercase tracking-widest font-black text-black">Most Popular</div>
                )}
                <div className="text-[10px] uppercase tracking-widest text-white/40 font-black mb-4">{plan.name}</div>
                <div className="mb-2">
                  <span className="text-5xl font-black">{plan.price}</span>
                  <span className="text-white/30 text-sm ml-2">{plan.sub}</span>
                </div>
                <p className="text-white/40 text-sm mb-8 leading-relaxed">{plan.description}</p>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-white/60">
                      <CheckCircle className="w-4 h-4 text-orange-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <StripeButton
                  amount={plan.amount}
                  planName={`Creator Workflow — ${plan.name}`}
                  isSubscription={plan.isSubscription}
                  className={`text-center py-3 rounded-full text-[11px] uppercase tracking-widest font-black transition-all duration-300 cursor-pointer disabled:opacity-50 ${plan.highlight ? "bg-orange-500 text-black hover:bg-white" : "border border-white/10 hover:border-orange-500/40 text-white/60 hover:text-white"}`}
                >
                  {plan.cta}
                </StripeButton>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto glass-panel rounded-[48px] p-12 md:p-20 text-center border-orange-500/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-orange-500/3 pointer-events-none" />
          <span className="relative z-10 text-orange-500 text-[10px] uppercase tracking-[0.5em] font-black mb-6 block">Built by Antigravity</span>
          <h2 className="relative z-10 text-4xl md:text-6xl font-black mb-6 leading-tight">
            Stop burning 4 hours.<br />Deploy in 30 minutes.
          </h2>
          <p className="relative z-10 text-white/40 max-w-xl mx-auto mb-10">
            Every template is battle-tested by the Antigravity Orchestra before it ships.
            If it doesn&apos;t save you at least 2 hours, we refund it.
          </p>
          <Link
            href="/brief?product=creator-workflow"
            className="relative z-10 inline-flex items-center gap-3 px-10 py-5 bg-orange-500 text-black text-[11px] uppercase tracking-[0.3em] font-black rounded-full hover:bg-white transition-all duration-300 group"
          >
            Get Early Access
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
