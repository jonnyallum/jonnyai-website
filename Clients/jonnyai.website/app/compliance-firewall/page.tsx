"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldAlert, AlertTriangle, CheckCircle, ArrowRight, ChevronRight, Scale, Zap, Eye, FileWarning } from "lucide-react";
import StripeButton from "@/components/StripeButton";

const violations = [
  { platform: "Etsy", risk: "CRITICAL", type: "Reseller Policy", description: "Dropshipping without disclosure = permanent ban. Zero warning.", recovery: "None — account deleted" },
  { platform: "TikTok Shop", risk: "HIGH", type: "IP / Copyright", description: "Unlicensed music in product demos triggers automated strikes.", recovery: "72h to appeal, 3 strikes = ban" },
  { platform: "Amazon", risk: "CRITICAL", type: "ASIN Policy", description: "Multiple ASIN variations violate variation abuse rules silently.", recovery: "ASIN removed, seller suspended" },
  { platform: "Instagram", risk: "HIGH", type: "Community Standards", description: "Before-after images in health/beauty violates medical claims policy.", recovery: "Post removed, account flagged" },
  { platform: "Gumroad", risk: "MEDIUM", type: "Refund Policy", description: "Failure to honour refunds per TOS triggers account review.", recovery: "Payout held 90 days" },
  { platform: "YouTube", risk: "HIGH", type: "Monetisation TOS", description: "Repurposed content flagged as low-effort = demonetised channel.", recovery: "Appeal process 30-60 days" },
];

const features = [
  {
    icon: Eye,
    title: "Pre-Launch TOS Scanner",
    description: "Paste your product description, listing copy, or campaign creative. We cross-reference against 40+ platform policies in real-time.",
  },
  {
    icon: AlertTriangle,
    title: "Violation Risk Score",
    description: "Every scan returns a 0-100 risk score with specific flagged clauses. Red = don't launch. Amber = fix first. Green = ship it.",
  },
  {
    icon: Scale,
    title: "Policy Change Alerts",
    description: "Platforms change TOS without warning. We monitor 40+ platforms daily and alert you when something that affects your business shifts.",
  },
  {
    icon: FileWarning,
    title: "Platform-Specific Guidance",
    description: "Generic advice kills businesses. We tell you exactly which clause you're violating, what the penalty is, and how to rewrite the copy to stay clean.",
  },
  {
    icon: Zap,
    title: "Automated Re-Scan",
    description: "Set automated scans before every launch. Integrates with your existing workflow via Zapier or n8n webhook.",
  },
  {
    icon: ShieldAlert,
    title: "Account Recovery Brief",
    description: "If you're already suspended, we generate a structured appeal brief in the format each platform's trust & safety team actually responds to.",
  },
];

const riskLevels = [
  { level: "CRITICAL", color: "red", count: "47 violations tracked", description: "Permanent account termination. No appeals. Revenue gone." },
  { level: "HIGH", color: "orange", count: "89 violations tracked", description: "Suspension likely. 72h appeal window. Revenue on hold." },
  { level: "MEDIUM", color: "yellow", count: "124 violations tracked", description: "Post removal or penalty. Account flagged for review." },
];

export default function ComplianceFirewallPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#050508] text-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-500/8 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-3 mb-8 px-4 py-2 rounded-full border border-red-500/20 bg-red-500/5">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-400 text-[10px] uppercase tracking-[0.4em] font-black">Dreamer Venture — Live Now</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-black leading-[0.9] mb-8 tracking-tighter">
              Don&apos;t Get<br />
              <span className="text-red-500">Banned.</span>
            </h1>

            <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-6 leading-relaxed">
              The AI compliance layer that checks your product, listing, and campaign copy against 40+ platform policies before you launch.
            </p>
            <p className="text-white/30 text-sm max-w-xl mx-auto mb-12 font-mono">
              One Etsy creator lost everything overnight. She built it back in 7 days. We built this so you never need to.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/brief?product=compliance-firewall"
                className="group px-8 py-4 bg-orange-500 text-black text-[11px] uppercase tracking-[0.3em] font-black rounded-full hover:bg-white transition-all duration-300 flex items-center gap-3 justify-center"
              >
                Scan My Product
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#violations"
                className="px-8 py-4 border border-white/10 text-[11px] uppercase tracking-[0.3em] font-black rounded-full hover:border-orange-500/40 transition-all duration-300 text-white/60 hover:text-white"
              >
                See Common Violations
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stat Bar */}
      <section className="py-12 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { stat: "40+", label: "Platforms monitored" },
              { stat: "260+", label: "Violation types tracked" },
              { stat: "£0", label: "Freemium entry tier" },
              { stat: "24h", label: "Policy change alert time" },
            ].map((p, i) => (
              <motion.div key={p.label} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
                <div className="text-3xl md:text-4xl font-black text-orange-500 mb-2">{p.stat}</div>
                <div className="text-[10px] uppercase tracking-widest text-white/30">{p.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Levels */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-orange-500 text-[10px] uppercase tracking-[0.5em] font-black mb-4 block">What We Catch</span>
            <h2 className="text-4xl md:text-6xl font-black leading-tight">Three Tiers of Danger</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {riskLevels.map((r, i) => (
              <motion.div
                key={r.level}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`glass-panel rounded-2xl p-8 border ${r.color === 'red' ? 'border-red-500/30' : r.color === 'orange' ? 'border-orange-500/30' : 'border-yellow-500/20'}`}
              >
                <div className={`text-[10px] uppercase tracking-widest font-black mb-4 ${r.color === 'red' ? 'text-red-500' : r.color === 'orange' ? 'text-orange-500' : 'text-yellow-500'}`}>
                  {r.level}
                </div>
                <div className="text-2xl font-black mb-3">{r.count}</div>
                <p className="text-white/40 text-sm leading-relaxed">{r.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Violation Table */}
      <section id="violations" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-orange-500 text-[10px] uppercase tracking-[0.5em] font-black mb-4 block">Real Examples</span>
            <h2 className="text-4xl md:text-6xl font-black leading-tight">Violations That Kill Accounts</h2>
          </div>
          <div className="space-y-3">
            {violations.map((v, i) => (
              <motion.div
                key={v.platform + v.type}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="glass-panel rounded-2xl p-6 border-white/5 grid grid-cols-12 gap-4 items-center"
              >
                <div className="col-span-2">
                  <span className="text-sm font-black text-white">{v.platform}</span>
                </div>
                <div className="col-span-2">
                  <span className={`text-[9px] uppercase tracking-widest font-black px-2 py-1 rounded-full ${v.risk === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : v.risk === 'HIGH' ? 'bg-orange-500/20 text-orange-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {v.risk}
                  </span>
                </div>
                <div className="col-span-3">
                  <span className="text-xs text-white/60 font-black">{v.type}</span>
                </div>
                <div className="col-span-3">
                  <span className="text-xs text-white/30">{v.description}</span>
                </div>
                <div className="col-span-2 text-right">
                  <span className="text-[9px] text-red-400/60 font-mono">{v.recovery}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-orange-500 text-[10px] uppercase tracking-[0.5em] font-black mb-4 block">The Firewall</span>
            <h2 className="text-4xl md:text-6xl font-black leading-tight">What&apos;s Inside</h2>
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
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-orange-500 text-[10px] uppercase tracking-[0.5em] font-black mb-4 block">Pricing</span>
            <h2 className="text-4xl md:text-6xl font-black leading-tight">One Ban Costs More Than a Year.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Free Scan",
                price: "£0",
                sub: "forever",
                amount: 0,
                isSubscription: false,
                description: "3 scans per month. Single platform. Risk score + top 3 violations flagged.",
                features: ["3 scans/month", "1 platform", "Risk score", "Top 3 flags"],
                cta: "Start Free",
                highlight: false,
                href: "/brief?product=compliance-firewall-free",
              },
              {
                name: "Safe Launch",
                price: "£19",
                sub: "per month",
                amount: 19,
                isSubscription: true,
                description: "Unlimited scans across all 40+ platforms. Policy alerts + full violation report.",
                features: ["Unlimited scans", "40+ platforms", "Policy change alerts", "Full violation reports", "Zapier/n8n integration"],
                cta: "Get Safe Launch",
                highlight: true,
                href: null,
              },
              {
                name: "Agency Audit",
                price: "£199",
                sub: "one-time",
                amount: 199,
                isSubscription: false,
                description: "Deep manual audit of your entire product catalogue by our compliance specialists.",
                features: ["Full catalogue audit", "Manual review", "Rewrite recommendations", "Appeal brief if needed", "90-day policy monitoring"],
                cta: "Book an Audit",
                highlight: false,
                href: null,
              },
            ].map((plan) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className={`glass-panel rounded-2xl p-8 border flex flex-col ${plan.highlight ? "border-orange-500/40 relative" : "border-white/5"}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-orange-500 rounded-full text-[9px] uppercase tracking-widest font-black text-black">Best Value</div>
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
                {plan.href ? (
                  <Link
                    href={plan.href}
                    className={`text-center py-3 rounded-full text-[11px] uppercase tracking-widest font-black transition-all duration-300 ${plan.highlight ? "bg-orange-500 text-black hover:bg-white" : "border border-white/10 hover:border-orange-500/40 text-white/60 hover:text-white"}`}
                  >
                    {plan.cta}
                  </Link>
                ) : (
                  <StripeButton
                    amount={plan.amount}
                    planName={`Compliance Firewall — ${plan.name}`}
                    isSubscription={plan.isSubscription}
                    className={`text-center py-3 rounded-full text-[11px] uppercase tracking-widest font-black transition-all duration-300 cursor-pointer disabled:opacity-50 ${plan.highlight ? "bg-orange-500 text-black hover:bg-white" : "border border-white/10 hover:border-orange-500/40 text-white/60 hover:text-white"}`}
                  >
                    {plan.cta}
                  </StripeButton>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto glass-panel rounded-[48px] p-12 md:p-20 text-center border-red-500/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-red-500/3 pointer-events-none" />
          <span className="relative z-10 text-orange-500 text-[10px] uppercase tracking-[0.5em] font-black mb-6 block">Built by Antigravity</span>
          <h2 className="relative z-10 text-4xl md:text-6xl font-black mb-6 leading-tight">
            One ban. All your revenue.<br />
            <span className="text-orange-500">Gone overnight.</span>
          </h2>
          <p className="relative z-10 text-white/40 max-w-xl mx-auto mb-10">
            Scan before you launch. Monitor after you ship.
            The compliance firewall that runs so you don&apos;t have to rebuild from zero.
          </p>
          <Link
            href="/brief?product=compliance-firewall"
            className="relative z-10 inline-flex items-center gap-3 px-10 py-5 bg-orange-500 text-black text-[11px] uppercase tracking-[0.3em] font-black rounded-full hover:bg-white transition-all duration-300 group"
          >
            Scan My Product Now
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
