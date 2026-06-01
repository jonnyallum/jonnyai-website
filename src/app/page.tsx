'use client';

import React from 'react';
import Link from 'next/link';

// Revised focused SaaS Hub Suite landing - Pat Tate approved overhaul

export default function JonnyAIHome() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* NAV */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-orange-500 flex items-center justify-center">
              <span className="font-bold text-zinc-950">J</span>
            </div>
            <div>
              <div className="font-semibold tracking-tight">JONNYAI</div>
              <div className="text-[10px] text-white/50 -mt-1">SAAS OPERATING SYSTEMS</div>
            </div>
          </div>
          <div className="flex items-center gap-8 text-sm">
            <a href="#hubs" className="hover:text-orange-400 transition">The Hubs</a>
            <a href="#bizos" className="hover:text-orange-400 transition">Biz-OS</a>
            <a href="#why" className="hover:text-orange-400 transition">Why Us</a>
            <a href="#process" className="hover:text-orange-400 transition">Process</a>
            <Link href="/brief" className="px-4 py-2 rounded bg-white text-zinc-950 font-medium hover:bg-orange-400 hover:text-white transition">BRIEF US</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-block px-3 py-1 rounded-full bg-white/5 text-xs tracking-[2px] mb-4 border border-white/10">PRODUCTION GRADE • UK BUILT • AUDITED</div>
        <h1 className="text-6xl md:text-7xl font-semibold tracking-tighter leading-none mb-4">
          Own Your<br />Operating System.
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-white/70 mb-8">
          Compliance Hub. Care Hub. FM Control Hub. <span className="text-orange-400 font-medium">Biz-OS</span>.<br />
          Four serious platforms for serious UK operators. No generic SaaS rental bollocks. You own it. It runs your business.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/brief" className="px-8 py-4 rounded-xl bg-orange-500 text-white font-semibold text-lg hover:bg-orange-600 transition flex items-center justify-center gap-2">
            BRIEF US — GET A FIXED PRICE
          </Link>
          <a href="#hubs" className="px-8 py-4 rounded-xl border border-white/20 hover:bg-white/5 transition flex items-center justify-center gap-2 text-lg">
            SEE THE SUITE
          </a>
        </div>
        <div className="mt-8 text-xs text-white/50">Live in production • Real clients • £0 wasted on generic tools</div>
      </section>

      {/* STATS / TRUST */}
      <div className="border-y border-white/10 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-sm">
          <div><div className="text-3xl font-semibold text-orange-400">4</div><div className="text-white/60 mt-1">Production SaaS Platforms</div></div>
          <div><div className="text-3xl font-semibold text-orange-400">£275k–£350k</div><div className="text-white/60 mt-1">Independent Valuations</div></div>
          <div><div className="text-3xl font-semibold text-orange-400">UK</div><div className="text-white/60 mt-1">Statutory &amp; CQC Ready</div></div>
          <div><div className="text-3xl font-semibold text-orange-400">24/7</div><div className="text-white/60 mt-1">Live AI Systems Running</div></div>
        </div>
      </div>

      {/* THE HUB SUITE */}
      <section id="hubs" className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="text-center mb-10">
          <div className="text-orange-400 text-xs tracking-[3px] mb-2">THE JONNYAI SAAS FAMILY</div>
          <h2 className="text-5xl font-semibold tracking-tighter">The Hub Suite</h2>
          <p className="mt-3 text-white/70 max-w-md mx-auto">Four platforms. Built for UK businesses that actually give a fuck about compliance, operations and results. White-label ready. Audited. Live.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* COMPLIANCE HUB */}
          <div className="group rounded-3xl border border-white/10 bg-zinc-900 p-6 flex flex-col hover:border-orange-500/50 transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400">📋</div>
              <div>
                <div className="font-semibold text-xl">Compliance Hub</div>
                <div className="text-xs text-emerald-400">LIVE • PRODUCTION</div>
              </div>
            </div>
            <p className="text-white/70 text-sm flex-1">Multi-industry statutory compliance platform with 48 templates. 6 industry packs. White-label engine. Gas, Fire, H&amp;S, Asbestos, Property, Hospitality, Construction, Manufacturing, Education, Farms.</p>
            <div className="mt-4 pt-4 border-t border-white/10 text-xs text-white/50">48 templates • Template builder • AI Compliance Briefing</div>
            <a href="https://compliance-hub.co.uk" target="_blank" className="mt-4 inline-block text-sm font-medium text-orange-400 group-hover:underline">Access Compliance Hub →</a>
          </div>

          {/* CARE HUB */}
          <div className="group rounded-3xl border border-white/10 bg-zinc-900 p-6 flex flex-col hover:border-orange-500/50 transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400">🏥</div>
              <div>
                <div className="font-semibold text-xl">Care Hub</div>
                <div className="text-xs text-emerald-400">LIVE • PRODUCTION</div>
              </div>
            </div>
            <p className="text-white/70 text-sm flex-1">CQC-ready care home operating system. AI Wellness Summaries (Claude live), MAR &amp; CD Register, NEWS2, KLOE reporting, HACCP, COSHH, Legionella, Fire Safety, Family portal, mobile PWA.</p>
            <div className="mt-4 pt-4 border-t border-white/10 text-xs text-white/50">27 residents seeded • AI Wellness live • FHIR export</div>
            <a href="#" className="mt-4 inline-block text-sm font-medium text-orange-400 group-hover:underline">Request Care Hub Demo →</a>
          </div>

          {/* FM CONTROL HUB */}
          <div className="group rounded-3xl border border-white/10 bg-zinc-900 p-6 flex flex-col hover:border-orange-500/50 transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400">🏗️</div>
              <div>
                <div className="font-semibold text-xl">FM Control Hub</div>
                <div className="text-xs text-emerald-400">LIVE • PRODUCTION</div>
              </div>
            </div>
            <p className="text-white/70 text-sm flex-1">Full facilities management OS for UK estates, contractors, schools &amp; care groups. 30+ modules: Helpdesk, PPM, PAT, CDM 2015, Permits, RIDDOR, Soft FM, Energy, Contractor RAMS, 10-year AMP.</p>
            <div className="mt-4 pt-4 border-t border-white/10 text-xs text-white/50">30+ modules • SLA adherence • Crown Jewel status</div>
            <a href="#" className="mt-4 inline-block text-sm font-medium text-orange-400 group-hover:underline">Request FM Hub Demo →</a>
          </div>

          {/* BIZ-OS - THE BIG ONE */}
          <div className="group rounded-3xl border-2 border-orange-500 bg-zinc-900 p-6 flex flex-col relative overflow-hidden hover:border-orange-400 transition">
            <div className="absolute top-4 right-4 px-3 py-1 text-[10px] font-mono tracking-widest bg-orange-500 text-zinc-950 rounded">MOST AMBITIOUS YET</div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold">B</div>
              <div>
                <div className="font-semibold text-xl">Biz-OS</div>
                <div className="text-xs text-orange-400">IN ACTIVE DEVELOPMENT • Q3 2026</div>
              </div>
            </div>
            <p className="text-white/80 text-sm flex-1 font-medium">The one that changes everything. Unified AI-powered business operating system. 65+ agent swarm, shared brain, quality gates, full vertical integration. Compliance, operations, workforce, revenue — all in one autonomous platform. White-label. The future of how UK businesses run.</p>
            <div className="mt-4 pt-4 border-t border-white/10 text-xs text-orange-400">Antigravity Orchestra inside • AgentFLIP monetization • Prompt security</div>
            <a href="#bizos" className="mt-4 inline-block text-sm font-semibold text-orange-400 group-hover:underline">Join the Biz-OS Waitlist →</a>
          </div>
        </div>
      </section>

      {/* BIZ-OS DEEP DIVE */}
      <section id="bizos" className="bg-zinc-900 border-y border-white/10 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1">
              <div className="text-orange-400 text-xs tracking-[3px] mb-2">THE FLAGHSHIP</div>
              <h3 className="text-5xl font-semibold tracking-tighter mb-4">Biz-OS.<br />The Most Ambitious<br />One Yet.</h3>
              <p className="text-white/70 text-lg">This isn&apos;t another dashboard. This is the full fucking operating system for your business — powered by the Antigravity Orchestra agent swarm. 65+ specialised agents, shared Supabase brain, quality gates, autonomy levels. It handles compliance, facilities, care workflows, sales, ops, everything. White-label it for your clients or run it as your empire HQ.</p>
              <ul className="mt-6 space-y-2 text-sm text-white/80">
                <li className="flex gap-2"><span className="text-orange-400">→</span> Full agent swarm autonomy</li>
                <li className="flex gap-2"><span className="text-orange-400">→</span> Shared brain across all your verticals</li>
                <li className="flex gap-2"><span className="text-orange-400">→</span> Prompt injection security &amp; quality gates</li>
                <li className="flex gap-2"><span className="text-orange-400">→</span> White-label ready for resellers &amp; agencies</li>
                <li className="flex gap-2"><span className="text-orange-400">→</span> Monetization engines built in (AGENTFLIP)</li>
              </ul>
              <div className="mt-8">
                <Link href="/brief" className="inline-block px-6 py-3 rounded-xl bg-white text-zinc-950 font-semibold hover:bg-orange-400 hover:text-white transition">GET ON THE BIZ-OS WAITLIST</Link>
              </div>
            </div>
            <div className="flex-1 bg-zinc-950 border border-white/10 rounded-3xl p-8 text-sm text-white/60">
              <div className="font-mono text-xs mb-4 text-orange-400">COMING Q3 2026 • EARLY ACCESS AVAILABLE</div>
              <div className="space-y-4">
                <div>Imagine your entire back office running itself. Compliance registers updating automatically. FM work orders routing to the right contractor with RAMS checked. Care home wellness alerts before CQC even thinks about visiting. Sales agents qualifying leads 24/7. All talking to each other through one brain.</div>
                <div className="pt-4 border-t border-white/10">This is the one I&apos;ve been building towards since I started coding. The needle and the blueprint made real. The cunt that makes all the other SaaS look like toys.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY THESE HUBS */}
      <section id="why" className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-semibold tracking-tighter">Why JonnyAI Hubs Are Different</h2>
          <p className="text-white/70 mt-2">Most SaaS is generic American bullshit that doesn&apos;t understand UK law, UK regulators or UK operators. These were built in the trenches.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-zinc-900 border border-white/10">
            <div className="text-orange-400 mb-2">OWN IT FOREVER</div>
            <div className="font-medium">No monthly SaaS rental that stops working when you stop paying. These are installed on your terms. You own the system.</div>
          </div>
          <div className="p-6 rounded-2xl bg-zinc-900 border border-white/10">
            <div className="text-orange-400 mb-2">UK STATUTORY BUILT-IN</div>
            <div className="font-medium">Every register, every cadence, every CQC KLOE, every CDM, RIDDOR, HACCP, COSHH, Legionella L8 — already in there. Not bolted on later.</div>
          </div>
          <div className="p-6 rounded-2xl bg-zinc-900 border border-white/10">
            <div className="text-orange-400 mb-2">PROVEN &amp; AUDITED</div>
            <div className="font-medium">Independent audits: ChatGPT £240-260k, Perplexity £275-350k, Claude £200-280k. Real production use. Real clients cutting admin by 80%. Valued £200k–£350k each.</div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="border-y border-white/10 bg-zinc-900 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="text-xs tracking-[3px] text-orange-400">FROM BRIEF TO LIVE</div>
            <h2 className="text-4xl font-semibold tracking-tighter">Days, Not Months.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-6xl font-semibold text-white/10 mb-2">01</div>
              <div className="font-semibold mb-2">BRIEF US</div>
              <div className="text-white/70 text-sm">Tell us about your business and what&apos;s slowing you down. 10 minutes. We send a fixed-price proposal in 48 hours. No vague quotes. No sales patter.</div>
            </div>
            <div>
              <div className="text-6xl font-semibold text-white/10 mb-2">02</div>
              <div className="font-semibold mb-2">WE BUILD &amp; TEST</div>
              <div className="text-white/70 text-sm">We configure your hub in staging. Every workflow tested against real scenarios. AI agents trained on your SOPs and data.</div>
            </div>
            <div>
              <div className="text-6xl font-semibold text-white/10 mb-2">03</div>
              <div className="font-semibold mb-2">INSTALL &amp; RUN</div>
              <div className="text-white/70 text-sm">Remote or on-site install in one day. Training that week. Then it runs 24/7. You own it. We support if you want (£149/mo).</div>
            </div>
          </div>
        </div>
      </section>

      {/* REAL WORK */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <div className="text-xs tracking-[3px] text-orange-400">NO CASE STUDY THEATRE</div>
          <h2 className="text-3xl font-semibold tracking-tighter">Real Operators. Real Results.</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-4 text-sm">
          <div className="p-5 rounded-2xl bg-zinc-900 border border-white/10">BL Motorcycles — 3,000+ eBay listings automated. Stock sync &amp; pricing done.</div>
          <div className="p-5 rounded-2xl bg-zinc-900 border border-white/10">Construct FM — AI estimates from 4 hours to 12 minutes.</div>
          <div className="p-5 rounded-2xl bg-zinc-900 border border-white/10">La Aesthetician — Booking + automated follow-ups live in 5 days.</div>
          <div className="p-5 rounded-2xl bg-zinc-900 border border-white/10">CD Waste — Job ticketing &amp; invoicing. Admin time cut 80%.</div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-orange-500 py-16 text-zinc-950">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-semibold tracking-tighter mb-4">Ready to own your operating system?</h2>
          <p className="text-lg mb-8">Brief us now. No call required. We come back with scope, timeline and fixed price. Then we build the cunt that runs your business.</p>
          <Link href="/brief" className="inline-block px-10 py-4 rounded-2xl bg-zinc-950 text-white font-semibold text-lg hover:bg-black transition">BRIEF US NOW — FIXED PRICE IN 48HRS</Link>
          <div className="mt-4 text-xs opacity-70">demo@jonnyai.co.uk • UK based • Built in the trenches</div>
        </div>
      </section>

      <footer className="bg-zinc-950 border-t border-white/10 py-8 text-center text-xs text-white/50">
        © JonnyAI Ltd. Built for operators who give a fuck. All rights reserved. | jonnyai.co.uk
      </footer>
    </div>
  );
}
