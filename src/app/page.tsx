"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import BrandLogo from "@/components/BrandLogo";
import NodeRegistry from "@/components/NodeRegistry";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-titanium selection:bg-citrus/30 selection:text-citrus">

      {/* --- NEURAL GRID OVERLAY --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-gradient-to-tr from-white via-transparent to-white/50" />

        {/* Animated Scanning Line */}
        <motion.div
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-citrus/20 to-transparent z-0 opacity-50"
        />
      </div>

      {/* --- BACKGROUND LAYER --- */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
        <Image
          src="/backdrop-hq.png"
          alt="JAI Innovation Lab"
          fill
          className="object-cover object-center grayscale contrast-125"
        />
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 inset-x-0 z-50 py-8 px-8 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-6 pointer-events-auto">
          <BrandLogo />
          <div className="h-px w-12 bg-citrus/20" />
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 bg-void text-white px-4 py-1.5 rounded-full border border-white/10 shadow-2xl"
          >
            <span className="w-1.5 h-1.5 bg-citrus rounded-full animate-ping" />
            <span className="text-[8px] font-black tracking-[.2em] uppercase">Inter-AI Sync: MIGRATION ACTIVE</span>
          </motion.div>
        </div>
        <div className="hidden md:flex gap-12 font-black tracking-[.4em] text-[10px] pointer-events-auto">
          <a href="#lab" className="hover:text-citrus transition-colors">THE LAB</a>
          <a href="#projects" className="hover:text-citrus transition-colors">SYSTEMS</a>
          <a href="#monetize" className="hover:text-citrus transition-colors">VENTURES</a>
          <button className="btn-citrus !py-2 !px-6 !text-[10px]">CONNECT</button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-32 pb-48">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-24 items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-citrus font-bold tracking-[.4em] mb-6 text-sm"
            >
              SCALING SMALL BUSINESSES WITH AGENTIC AI
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-outfit text-7xl md:text-[10rem] font-black leading-[0.85] mb-8 text-void tracking-tighter uppercase"
            >
              THE UNFAIR <br />
              <span className="text-citrus/90">ADVANTAGE.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-void/80 text-xl md:text-2xl font-medium mb-12 max-w-2xl leading-relaxed"
            >
              I’m Jonny. I build high-performance AI systems that actually work for small businesses. No fluff, just autonomous velocity engineered to help you scale.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-6 items-center"
            >
              <button className="btn-citrus shadow-2xl">AUTOMATE MY BUSINESS</button>
              <div className="h-px w-8 bg-void/10" />
              <p className="text-[10px] font-black tracking-widest text-void/40 uppercase">AgOS 2.0 PROTOCOL: READY</p>
            </motion.div>
          </div>

          {/* Floating HUD/Metric nodes */}
          <div className="hidden lg:block relative">
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="glass-card relative z-20 !p-10 border-citrus/20 shadow-[-20px_20px_60px_rgba(0,0,0,0.05)]"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="text-[10px] font-black tracking-widest text-citrus">OPERATIONAL TELEMETRY</span>
                <div className="w-2 h-2 bg-citrus rounded-full animate-pulse" />
              </div>
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between text-[10px] font-bold mb-2">
                    <span className="opacity-40 uppercase">MANUAL REDUCTION</span>
                    <span className="text-citrus">84%</span>
                  </div>
                  <div className="w-full h-1 bg-void/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '84%' }} transition={{ duration: 2, delay: 0.5 }} className="h-full bg-citrus" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-bold mb-2">
                    <span className="opacity-40 uppercase">AGENTIC UPTIME</span>
                    <span className="text-citrus">99.99%</span>
                  </div>
                  <div className="w-full h-1 bg-void/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '99.9%' }} transition={{ duration: 2, delay: 0.7 }} className="h-full bg-citrus" />
                  </div>
                </div>
              </div>
              <div className="mt-12 pt-8 border-t border-void/5">
                <p className="text-[9px] font-medium leading-relaxed opacity-40 uppercase">
                  "Current system status indicates 42% decrease in parasitic drag across client nodes."
                </p>
              </div>
            </motion.div>

            {/* Shadow Nodes */}
            <div className="absolute top-24 -right-12 w-32 h-32 bg-citrus/10 blur-3xl rounded-full" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-void/5 blur-3xl rounded-full" />
          </div>
        </div>

        {/* --- STATS CLUSTERS --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-48 border-t border-void/5 pt-24">
          {[
            { label: "AGENTS DEPLOYED", val: "420+" },
            { label: "SYSTEM UPTIME", val: "99.9%" },
            { label: "SIGNAL ACCURACY", val: "94.2%" },
            { label: "ROI MULTIPLIER", val: "12.5X" }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <p className="text-[10px] tracking-[.3em] text-citrus font-bold mb-2 uppercase opacity-60 group-hover:opacity-100 transition-opacity">{stat.label}</p>
              <h4 className="text-5xl font-outfit font-black tracking-tighter">{stat.val}</h4>
            </motion.div>
          ))}
        </div>
      </main>

      {/* --- EXPERTISE / FUSION --- */}
      <section id="dna" className="relative z-10 py-32 border-b border-void/5">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-4 gap-12 text-center">
            {[
              { title: "THE ARCHITECT", desc: "Engineering recursive AgOS systems that self-heal and evolve.", icon: "⚡" },
              { title: "THE CHEF", desc: "Precision gastronomy meets high-tech logistics. Little Jonnys founder.", icon: "🔥" },
              { title: "THE RACER", desc: "Optimizing lines. Identifying drag. Maximum operational velocity.", icon: "🏁" },
              { title: "THE ORACLE", desc: "Financial signal intelligence and high-conviction discovery.", icon: "🔮" }
            ].map((skill, i) => (
              <div key={i} className="group">
                <div className="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all">{skill.icon}</div>
                <h3 className="text-xs font-black tracking-[.4em] text-void mb-3">{skill.title}</h3>
                <p className="text-[10px] text-steel leading-relaxed font-light">{skill.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURED VENTURE --- */}
      <section id="lab" className="relative z-10 py-32 bg-ghost/50 border-y border-void/5">
        <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-24 items-center">
          <div className="relative aspect-video rounded-sm overflow-hidden shadow-2xl group">
            <Image
              src="/backdrop-lab.png"
              alt="AI Implementation"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-[2s]"
            />
            <div className="absolute inset-0 bg-citrus/10 mix-blend-overlay" />
          </div>
          <div>
            <h2 className="futuristic-title text-4xl mb-8">LOCAL SCALE ENGINE</h2>
            <p className="text-steel text-lg font-light mb-8 leading-relaxed">
              Evolved from **KLIQT Media**, I specialize in vertical AI integration for local businesses. My flagship system—the **Honeytrap Protocol**—collects high-conviction market signals and automates presence without human drag.
            </p>
            <div className="grid grid-cols-2 gap-8 mb-12">
              <div>
                <h4 className="text-[10px] font-black text-citrus tracking-widest mb-2 uppercase">Ventures</h4>
                <ul className="text-[10px] font-bold text-void/60 space-y-1">
                  <li>Little Jonnys AI</li>
                  <li>Insydetradar</li>
                  <li>Poundtrades</li>
                  <li>The Honeytrap Protocol</li>
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-citrus tracking-widest mb-2 uppercase">Focus</h4>
                <ul className="text-[10px] font-bold text-void/60 space-y-1">
                  <li>Small Business Pivot</li>
                  <li>Operational Velocity</li>
                  <li>Supabase Integration</li>
                  <li>AgOS 2.0 Core</li>
                </ul>
              </div>
            </div>
            <button className="btn-citrus">VIEW THE LAUNCHPAD</button>
          </div>
        </div>
      </section>

      {/* --- CASE STUDIES --- */}
      <section id="portfolio" className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="futuristic-title text-5xl mb-4 text-white">PROVEN ALPHA</h2>
              <p className="text-steel text-xl font-light">Documented transformations and agentic deployments.</p>
            </div>
            <div className="hidden md:block text-right">
              <span className="text-[10px] font-bold tracking-[.3em] text-citrus uppercase">Status: 8 ACTIVE CLIENTS</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                title: "VILLAGE BAKERY COMPLIANCE",
                tag: "COMPLIANCE / AUTOMATION",
                img: "/backdrop-lab.png",
                desc: "Nationwide audit automation. Deployed AgOS sub-systems to monitor real-time health and safety compliance across high-volume distribution networks."
              },
              {
                title: "LITTLE JONNYS AI",
                tag: "GASTRONOMY / VOICE",
                img: "/backdrop-hq.png",
                desc: "Revolutionizing high-end street food. Deployed AI Voice Synthesis and automated marketing flows for rapid scale in the UK market."
              },
              {
                title: "INSYDETRADAR",
                tag: "FINANCE / SIGNALS",
                img: "/backdrop-lab.png",
                desc: "High-conviction financial intelligence. Built a statistical signal engine that decodes market volatility patterns with agentic precision."
              },
              {
                title: "DJ WASTE INDUSTRIAL UI",
                tag: "AESTHETIC PIVOT / LOGISTICS",
                img: "/backdrop-lab.png",
                desc: "Complete aesthetic overhaul to 'Premium Industrial'. Engineered a high-conviction UI for Portsmouth's leading waste specialists, integrating Checkatrade signal verification and God-tier animations."
              }
            ].map((caseStudy, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative aspect-video rounded-sm overflow-hidden mb-6 bg-void/5">
                  <Image
                    src={caseStudy.img}
                    alt={caseStudy.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-[1.5s]"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-void to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-[10px] font-black tracking-widest text-white border border-white/20 px-4 py-2 hover:bg-white hover:text-void transition-all uppercase">View Brief</button>
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-[9px] font-black tracking-[.4em] text-citrus/60 uppercase">{caseStudy.tag}</span>
                  <div className="flex-1 h-px bg-void/5" />
                </div>
                <h3 className="font-outfit font-black text-2xl mb-3 tracking-tight group-hover:text-citrus transition-colors uppercase">{caseStudy.title}</h3>
                <p className="text-sm text-steel leading-relaxed font-light opacity-80">{caseStudy.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- THE PHILOSOPHY (OPERATIONAL VELOCITY) --- */}
      <section id="philosophy" className="relative z-10 py-32 bg-void text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          <div className="w-full h-full border-l border-white/20 rotate-12 translate-x-1/2" />
        </div>
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="futuristic-title text-5xl mb-12 text-white">THE PHILOSOPHY OF VELOCITY</h2>
              <div className="space-y-8">
                <div>
                  <h4 className="text-citrus font-black text-xs tracking-[.4em] mb-4 uppercase">01. Eliminate Drag</h4>
                  <p className="text-white/60 font-light leading-relaxed">I can’t stand waste. Every manual task is a parasitic drain on your potential. I use **AgOS 2.0** to strip away friction and replace it with autonomous flow.</p>
                </div>
                <div>
                  <h4 className="text-citrus font-black text-xs tracking-[.4em] mb-4 uppercase">02. Find the Apex</h4>
                  <p className="text-white/60 font-light leading-relaxed">Whether it's a corner on a racetrack or a market gap, success is about timing and trajectory. We build intelligence systems that decode the noise and point you straight toward the high-ROI apex.</p>
                </div>
                <div>
                  <h4 className="text-citrus font-black text-xs tracking-[.4em] mb-4 uppercase">03. Recursive Growth</h4>
                  <p className="text-white/60 font-light leading-relaxed">Our systems don't just work—they learn. By integrating a network of specialized AI agents, your infrastructure moves from static tool to living, evolving asset that scales as you do.</p>
                </div>
              </div>
            </div>
            <div className="glass-card border-white/10 bg-white/[0.02] backdrop-blur-xl">
              <h3 className="font-outfit font-black text-3xl mb-8">THE TRILLION-DOLLAR SETUP</h3>
              <p className="text-white/40 text-sm mb-12 font-light italic">"We don't build projects. We engineer autonomous entities that operate at a standard that would be acceptable at a FAANG board meeting."</p>
              <div className="grid grid-cols-2 gap-8">
                <div className="p-4 border border-white/5 bg-white/[0.01]">
                  <div className="text-2xl mb-2">💎</div>
                  <span className="text-[10px] font-bold tracking-widest text-white/80">SUPABASE CORE</span>
                </div>
                <div className="p-4 border border-white/5 bg-white/[0.01]">
                  <div className="text-2xl mb-2">⚡</div>
                  <span className="text-[10px] font-bold tracking-widest text-white/80">NEXT.JS SPEED</span>
                </div>
                <div className="p-4 border border-white/5 bg-white/[0.01]">
                  <div className="text-2xl mb-2">🤖</div>
                  <span className="text-[10px] font-bold tracking-widest text-white/80">AGENT SWARMS</span>
                </div>
                <div className="p-4 border border-white/5 bg-white/[0.01]">
                  <div className="text-2xl mb-2">🛡️</div>
                  <span className="text-[10px] font-bold tracking-widest text-white/80">RLS SECURITY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- THE FOUNDER'S SIGNAL --- */}
      <section id="founder" className="relative z-10 py-32 bg-titanium">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row items-center gap-24">
            <div className="w-full md:w-1/3">
              <div className="aspect-[4/5] bg-void rounded-sm relative overflow-hidden shadow-2xl skew-y-3 group hover:skew-y-0 transition-transform duration-700">
                <Image
                  src="/backdrop-hq.png"
                  alt="The Architect"
                  fill
                  className="object-cover opacity-80 group-hover:scale-110 transition-transform duration-[3s]"
                />
                <div className="absolute inset-x-0 bottom-0 p-8 pt-24 bg-gradient-to-t from-void to-transparent">
                  <h3 className="font-outfit font-black text-4xl text-white">JONNY ALLUM</h3>
                  <span className="text-citrus font-bold text-[10px] tracking-[.5em] uppercase">SYSTEMS ARCHITECT</span>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-citrus font-black text-[10px] tracking-[.4em] mb-6 uppercase">TRANSMITTING FROM THE LAB</p>
              <h2 className="futuristic-title text-5xl mb-8">CRAFT. CODE. COMMERCE.</h2>
              <div className="space-y-6 text-void/80 font-light text-lg leading-relaxed">
                <p>
                  I bridge the gap between deterministic software and high-performance physical craft. My background as a **Personal Chef** taught me precision and timing; my passion for **Motorbike Racing** taught me about velocity and identifying drag.
                </p>
                <p>
                  Today, I apply those same principles to **Small Business AI Integration**. I don't just build websites; I build autonomous growth engines—utilizing **Supabase**, **Next.js**, and **AgOS 2.0** to give you an unfair advantage in a digital world.
                </p>
                <p className="font-outfit font-black text-citrus italic">
                  "If it doesn't scale, it's just a hobby. We build businesses."
                </p>
              </div>
              <div className="mt-12 flex items-center gap-8">
                <div>
                  <div className="text-2xl font-black font-outfit">10+</div>
                  <div className="text-[9px] font-black tracking-widest text-void/40 uppercase">VENTURES LAUNCHED</div>
                </div>
                <div className="w-px h-8 bg-void/10" />
                <div>
                  <div className="text-2xl font-black font-outfit">35</div>
                  <div className="text-[9px] font-black tracking-widest text-void/40 uppercase">SPECIALIZED AGENTS</div>
                </div>
                <div className="w-px h-8 bg-void/10" />
                <div>
                  <div className="text-2xl font-black font-outfit">∞</div>
                  <div className="text-[9px] font-black tracking-widest text-void/40 uppercase">SIGNAL CAPACITY</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* --- THE DIGITAL WORKFORCE (£3/HR) --- */}
      <section id="workforce" className="relative z-10 py-32 bg-citrus text-white">
        <div className="max-w-7xl mx-auto px-8 relative overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <p className="text-[10px] font-black tracking-[.5em] mb-4 uppercase opacity-80">AGENTIC RENTAL SERVICE</p>
              <h2 className="font-outfit text-6xl md:text-8xl font-black leading-none mb-8 tracking-tighter uppercase">
                THE 168-HOUR <br />
                <span className="opacity-60 underline">EMPLOYEE.</span>
              </h2>
              <p className="text-white text-2xl font-light mb-12 max-w-xl leading-relaxed">
                Why pay a human for 40 hours when you can rent a dedicated AgOS Agent that never stops working? I'm offering direct access to my neural network for a flat utility rate.
              </p>
              <div className="flex items-center gap-12">
                <div>
                  <div className="text-6xl font-black font-outfit uppercase">£3</div>
                  <div className="text-[10px] font-black tracking-widest uppercase mt-2">PER HOUR / 24-7</div>
                </div>
                <div className="w-px h-16 bg-white/20" />
                <p className="text-xs font-bold leading-relaxed max-w-[200px] uppercase opacity-80">
                  FULL OSINT, AUTOMATION, AND LEAD CAPTURE - DEPLOYED IN MINUTES.
                </p>
              </div>
            </div>
            <div className="glass-card !bg-white/10 !border-white/20 backdrop-blur-3xl p-12 relative">
              <div className="absolute top-8 right-8 flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                <span className="text-[8px] font-black tracking-widest">LIVE INSTANCE: ACTIVE</span>
              </div>
              <h3 className="font-outfit font-black text-3xl mb-8">CHOOSE YOUR AGENT</h3>
              <div className="space-y-4">
                {[
                  { n: "@Scout", r: "OSINT & Discovery", s: "ONLINE" },
                  { n: "@Autoflow", r: "Process Engineering", s: "ONLINE" },
                  { n: "@Metric", r: "Growth Intelligence", s: "ONLINE" },
                  { n: "@Echo", r: "Professional Synthesis", s: "ONLINE" }
                ].map((agent, i) => (
                  <div key={i} className="flex justify-between items-center p-4 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                    <div>
                      <div className="text-xs font-black tracking-widest">{agent.n}</div>
                      <div className="text-[9px] font-bold opacity-60 uppercase">{agent.r}</div>
                    </div>
                    <span className="text-[8px] font-black bg-white text-citrus px-2 py-1 rounded-sm">{agent.s}</span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-4 bg-white text-citrus font-black text-xs tracking-[.4em] uppercase hover:bg-void hover:text-white transition-all">
                HIRE THE ORCHESTRA
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="monetize" className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="futuristic-title text-5xl mb-4 text-white">THE COMMITMENT</h2>
            <p className="text-steel text-xl font-light">I work with businesses ready for the apex. Every build I do includes a full **Supabase Implementation** as standard.</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8 mb-24">
            {[
              {
                tier: "THE WEBSITE",
                price: "£1,000",
                items: ["White Futuristic UI", "Supabase Database Ready", "Custom CMS Integration", "Responsive & SEO Rich"],
                btn: "INITIATE"
              },
              {
                tier: "THE MOBILE APP",
                price: "£2,500",
                items: ["Cross-Platform (iOS/Android)", "Real-time AI Integration", "Secure User Auth (RLS)", "AgOS Performance Core"],
                btn: "ENGINEER"
              },
              {
                tier: "THE OPERATING SYSTEM",
                price: "£5,000",
                items: ["Custom AgOS Core Build", "Autonomous Agent Swarm", "End-to-end Ops Automation", "Private Security Cluster"],
                btn: "DEEP SYNC"
              }
            ].map((plan, i) => (
              <div key={i} className={`glass-card flex flex-col ${i === 1 ? 'border-citrus/40 bg-citrus/[0.02]' : ''}`}>
                <h4 className="text-xs font-black tracking-[.4em] text-citrus mb-4">{plan.tier}</h4>
                <div className="text-5xl font-outfit font-black mb-8">{plan.price}</div>
                <ul className="flex-1 space-y-4 mb-12">
                  {plan.items.map((item, j) => (
                    <li key={j} className="text-xs font-bold text-void/60 flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-citrus/40 rounded-full" /> {item}
                    </li>
                  ))}
                </ul>
                <button className={`btn-citrus w-full ${i !== 1 ? 'bg-void text-white hover:bg-void/80 hover:shadow-none' : ''}`}>
                  {plan.btn}
                </button>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            {/* --- HOURLY & BESPOKE --- */}
            <div className="glass-card">
              <h3 className="futuristic-title text-2xl mb-8">ONE-OFF DELIVERABLES</h3>
              <div className="space-y-6">
                {[
                  { s: "SEO Optimization (Goldie)", r: "£75/hr" },
                  { s: "AI Automation & Gen", r: "£75/hr" },
                  { s: "Course & Training Creation", r: "£60/hr" },
                  { s: "Video Editing & Animation", r: "£50/hr" },
                  { s: "Advanced Spreadsheets/Data", r: "£50/hr" }
                ].map((service, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-void/5 pb-4 last:border-0">
                    <span className="text-xs font-bold tracking-widest text-void/80">{service.s}</span>
                    <span className="text-sm font-black text-citrus">{service.r}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* --- MANAGEMENT RETAINERS --- */}
            <div className="glass-card bg-void text-white selection:bg-citrus selection:text-white">
              <h3 className="futuristic-title text-2xl mb-8 text-white">RETAINERS</h3>
              <div className="space-y-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-citrus font-black text-[10px] tracking-widest mb-1 underline">BASIC MANAGEMENT</h5>
                    <p className="text-[10px] text-white/60">Uptime, security, and critical updates.</p>
                  </div>
                  <span className="text-xl font-outfit font-black">£100/mo</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-citrus font-black text-[10px] tracking-widest mb-1 underline">FULL MANAGEMENT</h5>
                    <p className="text-[10px] text-white/60">Unlimited minor changes, SEO audits.</p>
                  </div>
                  <span className="text-xl font-outfit font-black">£250/mo</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-citrus font-black text-[10px] tracking-widest mb-1 underline">DIGITAL DOMINANCE</h5>
                    <p className="text-[10px] text-white/60">Full ad-mgt & content workflows.</p>
                  </div>
                  <span className="text-xl font-outfit font-black">£250/mo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- AI NEWS BULLETIN (AGENTIC SIGNAL) --- */}
      <section id="news" className="relative z-10 py-32 bg-titanium border-t border-void/5">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div className="max-w-xl">
              <h2 className="futuristic-title text-4xl mb-4">NEURAL SIGNAL: NEWS</h2>
              <p className="text-steel font-light">Real-time intelligence curated by the **Antigravity Scout Network**. High-conviction AI industry shifts, delivered at velocity.</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-black tracking-[.3em] text-citrus">
              <span className="w-2 h-2 bg-citrus rounded-full animate-ping" />
              LIVE AGENTIC SYNC: ACTIVE
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                tag: "OSINT / AGENTIC",
                title: "AGOS 2.0 PROTOCOL REACHES SCALE",
                agent: "@Scout",
                time: "04:12 UTC",
                summary: "Autonomous discovery analytics now monitoring 42k+ data nodes across the Honeytrap Network."
              },
              {
                tag: "SIGNAL / FINANCE",
                title: "S&P 500 AI ALPHA DETECTED",
                agent: "@Metric",
                time: "02:45 UTC",
                summary: "Proprietary signals identify high-conviction divergence in chip-sector volatility patterns."
              },
              {
                tag: "GEN-AI / CRAFT",
                title: "VOICE CLONING V4.1 DEPLOYED",
                agent: "@Echo",
                time: "01:20 UTC",
                summary: "Bespoke synthesis engine achieves 99.8% emotional fidelity in luxury brand application."
              },
              {
                tag: "DEV / SYNC",
                title: "CLAUDE HANDOVER ACKNOWLEDGED",
                agent: "@Conductor",
                time: "NOW",
                summary: "Inter-AI message received via Chatroom. Android production build for Poundtrades initiated on EAS. Security audit: PAT rotation required."
              }
            ].map((news, i) => (
              <div key={i} className="glass-card group hover:border-citrus/20 transition-all">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[9px] font-black tracking-[.4em] text-citrus/60">{news.tag}</span>
                  <span className="text-[9px] font-bold text-void/30">{news.time}</span>
                </div>
                <h3 className="font-outfit font-black text-lg mb-4 group-hover:text-citrus transition-colors">{news.title}</h3>
                <p className="text-xs text-steel font-light leading-relaxed mb-8 opacity-70">
                  {news.summary}
                </p>
                <div className="flex items-center gap-2 pt-4 border-t border-void/5">
                  <div className="w-1.5 h-1.5 bg-void/20 rounded-full" />
                  <span className="text-[8px] font-black tracking-widest text-void/40 uppercase">SOURCE: {news.agent}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 p-6 border border-citrus/10 bg-citrus/[0.01] rounded-sm text-center">
            <p className="text-[10px] font-bold tracking-[.5em] text-citrus uppercase">SUBSCRIBE TO THE ARCHITECT'S DAILY SIGNAL</p>
          </div>
        </div>
      </section>

      {/* --- RESIDENT AI CHIP --- */}
      <div className="fixed bottom-8 right-8 z-[100]">
        <div className="group relative">
          <div className="w-16 h-16 bg-white border border-ghost shadow-2xl rounded-full flex items-center justify-center cursor-pointer hover:border-citrus transition-all">
            <div className="w-8 h-8 bg-citrus rounded-full animate-pulse shadow-[0_0_20px_rgba(217,119,87,0.6)]" />
          </div>
          <div className="absolute bottom-full right-0 mb-4 w-72 h-48 glass-card translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
            <p className="text-[10px] font-black tracking-widest text-citrus mb-2">THE ARCHITECT AI (V2.0)</p>
            <p className="text-xs text-steel font-light leading-relaxed italic">
              "Welcome, Boss. I am monitoring your session. Move your cursor to the apex of any project to reveal its statistical edge."
            </p>
            <div className="mt-4 pt-4 border-t border-void/5">
              <div className="flex justify-between items-center">
                <span className="text-[8px] font-bold text-void/40">SYSTEM: OPTIMAL</span>
                <span className="text-[8px] font-bold text-citrus">INIT: AGOS_CORE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- LEAD GENERATION (SIGNAL INTAKE) --- */}
      <section id="connect" className="relative z-10 py-32 bg-ghost/30">
        <div className="max-w-3xl mx-auto px-8">
          <div className="glass-card !p-12 text-center">
            <h2 className="futuristic-title text-3xl mb-4">INITIATE SIGNAL</h2>
            <p className="text-steel font-light mb-12">Ready to engineer your edge? Submit your project parameters for an agentic audit.</p>

            <form className="space-y-6 text-left">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black tracking-widest text-citrus mb-2 block uppercase">Project Name</label>
                  <input type="text" className="w-full bg-titanium border-b border-void/10 p-4 font-outfit focus:outline-none focus:border-citrus transition-colors" placeholder="e.g. AGOS_SYNC_V1" />
                </div>
                <div>
                  <label className="text-[10px] font-black tracking-widest text-citrus mb-2 block uppercase">Budget Tier</label>
                  <select className="w-full bg-titanium border-b border-void/10 p-4 font-outfit focus:outline-none focus:border-citrus transition-colors appearance-none">
                    <option>THE VISIONARY (£1,000+)</option>
                    <option>THE ARCHITECT (£2,500+)</option>
                    <option>THE OPERATING SYSTEM (£5,000+)</option>
                    <option>BESPOKE / HOURLY</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black tracking-widest text-citrus mb-2 block uppercase">Intelligence Brief</label>
                <textarea className="w-full bg-titanium border-b border-void/10 p-4 font-outfit focus:outline-none focus:border-citrus transition-colors h-32" placeholder="Describe the mission parameters..."></textarea>
              </div>
              <button type="submit" className="btn-citrus w-full mt-8">TRANSMIT SIGNAL</button>
            </form>

            <p className="mt-8 text-[8px] font-bold text-void/20 tracking-[.3em] uppercase">
              SECURE SUPABASE UPLINK: ENCRYPTED
            </p>
          </div>
        </div>
      </section>

      <NodeRegistry />

      {/* --- FOOTER --- */}
      <footer className="relative z-10 py-24 border-t border-void/5">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-left">
            <h3 className="futuristic-title text-xl mb-2">JONNY AI</h3>
            <p className="text-[10px] tracking-[.3em] text-void/40 uppercase font-black">Jonny Allum Innovations Ltd</p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-12 text-[10px] font-black tracking-[.4em] text-void/60 cursor-pointer">
              <span className="hover:text-citrus transition-colors uppercase">STRATEGY</span>
              <span className="hover:text-citrus transition-colors uppercase">PRIVACY</span>
              <span className="hover:text-citrus transition-colors uppercase">OSINT</span>
            </div>
            <a href="https://jonnyai.website" className="text-[10px] font-bold text-citrus/80 hover:text-citrus transition-all tracking-widest uppercase">
              love this website? try JonnyAi. By Jonny Allum Innovations ltd
            </a>
          </div>
          <p className="text-[10px] tracking-[.3em] text-void/30 uppercase font-black text-center md:text-right">
            Engineered by AgOS 2.0 | © 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
