"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Github, Twitter, Activity, ShieldAlert, FileText } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#050505] pt-24 pb-12 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-24">
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-8 group">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <span className="text-black font-black text-xs">JAI</span>
              </div>
              <span className="font-mono text-xs uppercase tracking-[0.4em] font-bold">JonnyAI</span>
            </Link>
            <p className="text-white/40 text-xs leading-relaxed max-w-xs mb-8">
              The AI Product Engine for high-velocity startups. Build, ship, and scale at the speed of thought. 
              <br /><br />
              © 2026 Antigravity Agency LTD. All Rights Reserved.
            </p>
            <div className="flex gap-4">
              <Link href="https://github.com" className="w-8 h-8 glass-panel rounded-lg flex items-center justify-center hover:bg-orange-500 hover:text-black transition-all">
                <Github className="w-4 h-4" />
              </Link>
              <Link href="https://twitter.com" className="w-8 h-8 glass-panel rounded-lg flex items-center justify-center hover:bg-orange-500 hover:text-black transition-all">
                <Twitter className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-white mb-8">The Ecosystem</h4>
            <ul className="space-y-4">
              {[
                { name: 'The Build', href: '/#build' },
                { name: 'The Feed', href: '/blog' },
                { name: 'The Labs', href: '/labs' },
                { name: 'The History', href: '/chronology' },
                { name: 'The Empire', href: '/empire' },
                { name: 'The Workforce', href: '/#workforce' },
                { name: 'The Agency', href: '/about' },
                { name: 'Client Login', href: '/login' },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-white/40 text-[11px] uppercase tracking-widest hover:text-orange-500 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Dreamer Ventures */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-white mb-8">Dreamer Ventures</h4>
            <ul className="space-y-4">
              {[
                { name: 'Creator Workflow', href: '/creator-workflow' },
                { name: 'Compliance Firewall', href: '/compliance-firewall' },
                { name: 'Injection Guard', href: 'https://injection-guard.jonnyai.co.uk' },
                { name: 'AgentFlip', href: 'https://agentflip.jonnyai.co.uk' },
                { name: 'Headhunter AI', href: '/labs' },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-white/40 text-[11px] uppercase tracking-widest hover:text-orange-500 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-8 border-t border-white/5">
              <span className="text-[9px] text-orange-500/40 font-black uppercase tracking-widest block mb-2">Autonomous Ventures</span>
              <p className="text-[8px] text-white/20 leading-relaxed font-mono">
                Built by the Orchestra.<br />Shipped by @Dreamer.
              </p>
            </div>
          </div>

          {/* Legal & Compliance (Luna Injected) */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-white mb-8">Legal & Policy</h4>
            <ul className="space-y-4">
              {[
                { name: 'Privacy Policy', icon: ShieldAlert },
                { name: 'Terms of Service', icon: FileText },
                { name: 'SLA Guarantee', icon: Activity }
              ].map((item) => (
                <li key={item.name}>
                  <Link href="/legal" className="flex items-center gap-3 text-white/40 text-[11px] uppercase tracking-widest hover:text-orange-500 transition-colors">
                    <item.icon className="w-3 h-3 opacity-50" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-8 border-t border-white/5">
              <span className="text-[9px] text-orange-500/40 font-black uppercase tracking-widest block mb-2">Legal Compliance</span>
              <p className="text-[8px] text-white/20 leading-relaxed font-mono">
                "Terms drafted for 48-hour delivery cycles. Uptime and performance benchmarks are legally binding."
                <br />— @Luna (The Shield)
              </p>
            </div>
          </div>

          {/* Technical Status (Milo Injected) */}
          <div>
            <Link href="/status">
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-white mb-8 hover:text-orange-500 transition-colors">System Status</h4>
            </Link>
            <div className="glass-panel p-6 rounded-2xl border-white/5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] text-white/40 uppercase tracking-widest">AgOS 4.0 Status</span>
                <span className="text-orange-500 text-[10px] font-black tracking-widest">99.98%</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mb-8">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '99.98%' }}
                  className="h-full bg-orange-500"
                />
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-white/20" />
                <span className="text-white/40 text-[11px] font-mono">support@jonnyai.co.uk</span>
              </div>
            </div>
            <p className="mt-4 text-[8px] text-white/20 font-mono text-center">
              "Lighthouse Load Score: 98. LCP: 0.8s. Standardized Performance verified."
              <br />— @Milo (The Optimizer)
            </p>
          </div>
        </div>

        {/* Global Footer Bottom */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
             {['Portsmouth, UK', 'London Office', 'Remote-First Architecture'].map((loc) => (
               <span key={loc} className="text-[9px] uppercase tracking-[0.25em] text-white/20 font-black">{loc}</span>
             ))}
          </div>
          <div className="text-[10px] font-mono text-white/20 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
             Jai.OS 5.0 // Global Sync: ACTIVE
          </div>
        </div>
      </div>
    </footer>
  );
}
