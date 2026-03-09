import json
import os
from pathlib import Path

import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Configuration
PROJECT_DIR = Path("./Clients/agentflip")
QUEUE_FILE = PROJECT_DIR / "data" / "arbitrage_queue.json"
APP_DIR = PROJECT_DIR / "app"

def generate_landers():
    print("🚀 @grace: Initializing Niche Lander Generation for AgentFlip...")
    
    if not QUEUE_FILE.exists():
        print("❌ ERROR: No flips detected. Run scavenger_engine_v1.py first.")
        return

    with open(QUEUE_FILE, "r") as f:
        flips = json.load(f)

    for flip in flips:
        niche_slug = flip["keyword"].lower().replace(" ", "-")
        niche_path = APP_DIR / "niches" / niche_slug
        os.makedirs(niche_path, exist_ok=True)
        
        print(f"Synthesizing high-intent lander for: {flip['keyword']}...")
        
        # Template for the niche lander - using separate string components to avoid f-string escaping hell
        content = '"use client";\n\n'
        content += 'import { motion } from "framer-motion";\n'
        content += 'import { Zap, ShieldCheck, Target, ArrowRight } from "lucide-react";\n'
        content += 'import Link from "next/link";\n\n'
        content += 'export default function NichePage() {\n'
        content += '  return (\n'
        content += '    <main className="min-h-screen bg-void-black text-zinc-400 p-8 lg:p-24 font-mono scanning relative">\n'
        content += '      <nav className="mb-24 flex justify-between items-center border-b border-white/5 pb-4">\n'
        content += '        <Link href="/" className="flex items-center gap-2">\n'
        content += f'          <Zap size={{16}} className="signal-text" /> \n'
        content += '          <span className="text-white font-bold tracking-widest text-xs uppercase">AgentFlip // Arbitrage</span>\n'
        content += '        </Link>\n'
        content += f'        <span className="text-[10px] signal-text uppercase">FLIP_ID: {niche_slug.upper()}</span>\n'
        content += '      </nav>\n\n'
        content += '      <div className="max-w-4xl">\n'
        content += '        <div className="mb-8 inline-block px-3 py-1 bg-signal-green/10 border border-signal-green/20 rounded text-[10px] signal-text font-bold uppercase tracking-widest">\n'
        content += '           Arbitrage Target Identified\n'
        content += '        </div>\n'
        content += f'        <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tighter mb-8 leading-none">\n'
        content += f'          {flip["keyword"].upper()} <br /> \n'
        content += '          <span className="signal-text italic underline decoration-rust-copper decoration-4 underline-offset-8">DEMAND_SPIKE</span>\n'
        content += '        </h1>\n'
        content += f'        <p className="text-lg mb-12 max-w-2xl leading-relaxed italic border-l-2 border-rust-copper pl-6">\n'
        content += f'          Our Scavenger Engine has detected a high-intent liquidity gap for "{flip["keyword"]}". \n'
        content += '          Traditional solutions are failing. Authenticity is leaking.\n'
        content += '        </p>\n\n'
        content += '        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">\n'
        content += '          <div className="glass-panel p-6 border border-white/5">\n'
        content += '            <h3 className="text-white font-bold mb-4 flex items-center gap-2">\n'
        content += '              <Target size={16} className="signal-text" /> THE_REVENUE_LEAK\n'
        content += '            </h3>\n'
        content += f'            <p className="text-sm">94% of traffic in the "{flip["keyword"]}" niche is being captured by unverified wrappers. This is digital waste.</p>\n'
        content += '          </div>\n'
        content += '          <div className="glass-panel p-6 border border-white/5">\n'
        content += '            <h3 className="text-white font-bold mb-4 flex items-center gap-2">\n'
        content += '               <ShieldCheck size={16} className="signal-text" /> THE_EQUITY_FIX\n'
        content += '            </h3>\n'
        content += '            <p className="text-sm">We provide the deterministic logic bridge to capture this intent and lock in sustainable yield.</p>\n'
        content += '          </div>\n'
        content += '        </div>\n\n'
        content += '        <button className="px-12 py-6 bg-white outline outline-1 outline-signal-green/20 hover:bg-signal-green hover:text-void-black text-void-black font-black uppercase tracking-tighter text-2xl transition-all flex items-center gap-4 group">\n'
        content += '          SECURE_THIS_ASSET <ArrowRight className="group-hover:translate-x-2 transition-transform" />\n'
        content += '        </button>\n'
        content += '      </div>\n\n'
        content += '      {/* Background Decor */}\n'
        content += '      <div className="absolute top-0 right-0 p-24 opacity-5 pointer-events-none">\n'
        content += '        <Zap size={400} className="rust-accents" />\n'
        content += '      </div>\n'
        content += '    </main>\n'
        content += '  );\n'
        content += '}\n'
        with open(niche_path / "page.tsx", "w", encoding="utf-8") as f:
            f.write(content)
            
    print(f"✅ Success: {len(flips)} high-velocity landers synthesized in /Clients/agentflip/app/niches/.")

if __name__ == "__main__":
    generate_landers()
