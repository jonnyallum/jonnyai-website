"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle, ArrowRight, ChevronRight, Star, FileText, Target, TrendingUp } from "lucide-react";
import StripeButton from "@/components/StripeButton";

const painPoints = [
  { stat: "9 papers", label: "Assigned to first-time reviewer — overnight" },
  { stat: "28%", label: "Of peer reviews have critical errors (Nature study)" },
  { stat: "Zero", label: "Training provided by most conferences" },
  { stat: "3 months", label: "Review cycle damaged by poor first-pass feedback" },
];

const features = [
  {
    icon: BookOpen,
    title: "50+ Real Paper Simulations",
    description: "Practice on a curated library of real papers across ML, NLP, CV, and systems. See what good reviews look like vs weak ones.",
  },
  {
    icon: Target,
    title: "Review Quality Scoring",
    description: "Submit your practice review. Our AI scores it across 8 dimensions: clarity, technical depth, fairness, constructiveness, and more.",
  },
  {
    icon: FileText,
    title: "Structured Review Templates",
    description: "Conference-specific review templates for NeurIPS, ICML, ICLR, CVPR, and ACL. Know exactly what each PC chair expects.",
  },
  {
    icon: Star,
    title: "Calibration Benchmarks",
    description: "Compare your scores against the consensus of 10+ actual reviewers on the same paper. See where you over- or under-rate.",
  },
  {
    icon: TrendingUp,
    title: "Weakness Detection",
    description: "Identify your blind spots before you go live. Do you miss methodological flaws? Reproducibility issues? We'll tell you.",
  },
  {
    icon: CheckCircle,
    title: "Reviewer Reputation Shield",
    description: "Your first 5 real reviews define your reviewer reputation. Practice until your scores are conference-grade before you submit.",
  },
];

const steps = [
  { step: "01", title: "Select your conference", description: "Pick from NeurIPS, ICML, ICLR, CVPR, ACL, or general ML. Get the exact rubric and expectations for that venue." },
  { step: "02", title: "Review a real paper", description: "Read an actual submission from our library. Write your review as if it were live — score, summary, strengths, weaknesses, questions." },
  { step: "03", title: "Get your debrief", description: "AI scores your review. See where you aligned with consensus, where you diverged, and what expert reviewers caught that you missed." },
];

export default function ReviewCoachPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#050508] text-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/8 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-3 mb-8 px-4 py-2 rounded-full border border-orange-500/20 bg-orange-500/5">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-orange-500 text-[10px] uppercase tracking-[0.4em] font-black">Dreamer Venture — Live Now</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-black leading-[0.9] mb-8 tracking-tighter">
              Review Like<br />
              <span className="text-orange-500">A Veteran.</span>
            </h1>

            <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-6 leading-relaxed">
              AI peer review simulator that trains first-time academic reviewers on 50+ real papers before they submit.
              No more guesswork. No more anxiety. Conference-grade from day one.
            </p>
            <p className="text-white/30 text-sm max-w-xl mx-auto mb-12 font-mono">
              &quot;I got assigned 9 papers. I&apos;m so nervous. What if I mess up.&quot; — every first-time reviewer ever.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#pricing"
                className="group px-8 py-4 bg-orange-500 text-black text-[11px] uppercase tracking-[0.3em] font-black rounded-full hover:bg-white transition-all duration-300 flex items-center gap-3 justify-center"
              >
                Start Training
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#how-it-works"
                className="px-8 py-4 border border-white/10 text-[11px] uppercase tracking-[0.3em] font-black rounded-full hover:border-orange-500/40 transition-all duration-300 text-white/60 hover:text-white"
              >
                How It Works
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pain Stats */}
      <section className="py-12 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {painPoints.map((p, i) => (
              <motion.div key={p.label} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
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
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="glass-panel rounded-3xl p-10 md:p-16 border-white/5">
            <span className="text-orange-500 text-[10px] uppercase tracking-[0.5em] font-black mb-6 block">The Problem</span>
            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
              You get assigned 9 papers with zero training. Your reputation is on the line.
            </h2>
            <p className="text-white/50 text-lg leading-relaxed">
              Peer review is the backbone of academic publishing — and yet first-time reviewers are thrown in cold.
              A single biased, shallow, or unfair review damages authors, erodes your reputation, and undermines science itself.
              We built Review Coach so you arrive prepared, not panicked.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-orange-500 text-[10px] uppercase tracking-[0.5em] font-black mb-4 block">How It Works</span>
            <h2 className="text-4xl md:text-6xl font-black leading-tight">Train. Debrief. Ship.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="glass-panel rounded-2xl p-8 border-white/5"
              >
                <div className="text-[80px] font-black text-orange-500/10 leading-none mb-4">{step.step}</div>
                <h3 className="text-xl font-black mb-4">{step.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-orange-500 text-[10px] uppercase tracking-[0.5em] font-black mb-4 block">What&apos;s Inside</span>
            <h2 className="text-4xl md:text-6xl font-black leading-tight">The Full Arsenal</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-panel rounded-2xl p-8 border-white/5 hover:border-orange-500/20 transition-all duration-300"
              >
                <f.icon className="w-6 h-6 text-orange-500 mb-6" />
                <h3 className="text-lg font-black mb-3">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-orange-500 text-[10px] uppercase tracking-[0.5em] font-black mb-4 block">Pricing</span>
            <h2 className="text-4xl md:text-6xl font-black leading-tight">Confidence Has a Price. Anxiety Costs More.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Single Review",
                price: "£5",
                sub: "per review",
                amount: 5,
                isSubscription: false,
                description: "One practice review with full AI debrief. Score breakdown across 8 dimensions.",
                features: ["1 practice paper", "Full AI debrief", "8-dimension scoring", "Consensus comparison"],
                cta: "Start Reviewing",
                highlight: false,
              },
              {
                name: "Review Mastery",
                price: "£29",
                sub: "per month",
                amount: 29,
                isSubscription: true,
                description: "Unlimited reviews, all conferences. Track your calibration improvement over time.",
                features: ["Unlimited reviews", "All 6 conferences", "Calibration tracking", "Weakness detection", "Conference templates"],
                cta: "Get Mastery",
                highlight: true,
              },
              {
                name: "Conference Bundle",
                price: "£199",
                sub: "one-time",
                amount: 199,
                isSubscription: false,
                description: "One-time deep preparation for a specific conference. 20 targeted papers + 1:1 debrief.",
                features: ["20 curated papers", "Conference-specific rubric", "1:1 expert debrief", "Submission-ready review template", "Lifetime access"],
                cta: "Book the Bundle",
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
                  planName={`Review Coach — ${plan.name}`}
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
            Your first review matters.<br />
            <span className="text-orange-500">Arrive prepared.</span>
          </h2>
          <p className="relative z-10 text-white/40 max-w-xl mx-auto mb-10">
            Practice on 50+ real papers. Get debrief scores. Know your blind spots before they hit your reputation.
          </p>
          <a
            href="#pricing"
            className="relative z-10 inline-flex items-center gap-3 px-10 py-5 bg-orange-500 text-black text-[11px] uppercase tracking-[0.3em] font-black rounded-full hover:bg-white transition-all duration-300 group"
          >
            Start Training Now
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
