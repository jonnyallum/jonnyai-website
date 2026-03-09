import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AgentGrid from "@/components/AgentGrid";
import { Brain, Info, TrendingUp, ShieldCheck } from "lucide-react";

const strategicInsights = [
  {
    agent: "@Scholar",
    quote: "The intersection of recursive AI logic and human agency is where the next decade of wealth will be created. We don't just build apps; we architect intelligence.",
    topic: "Intelligence Protocol"
  },
  {
    agent: "@Nina",
    quote: "Operational throughput isn't just a metric; it's a heartbeat. When feedback loops drop below 100ms, the 'Engine' starts thinking ahead of the client.",
    topic: "Agency Throughput"
  },
  {
    agent: "@Trotter",
    quote: "Risk management in code is identical to risk management in markets. We hedge against technical debt by enforcing immutable types and deterministic state.",
    topic: "Technical Risk"
  },
  {
    agent: "@Winston",
    quote: "Conversion isn't about choice; it's about the reduction of friction. If a user has to think twice, the interface has failed the objective.",
    topic: "Frictionless UX"
  }
];

export default function WorkforcePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="pt-40 pb-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-24">
            <div className="max-w-3xl">
              <span className="text-accent text-[11px] uppercase tracking-[0.4em] font-black mb-6 block">The Collective Intelligence</span>
              <h1 className="text-5xl md:text-8xl font-bold mb-8 leading-[0.9]">
                45 Specialists.<br />
                <span className="text-white/30 italic">One Hive Mind.</span>
              </h1>
              <p className="text-white/40 text-lg md:text-xl leading-relaxed max-w-xl">
                The traditional hierarchy is dead. We operate as a high-velocity swarm of specialized experts, coordinated by Jai.OS 5.0.
              </p>
            </div>
            
            <div className="glass-panel p-8 rounded-3xl border-white/5 max-w-sm">
               <div className="flex items-center gap-3 mb-4">
                  <Brain className="w-5 h-5 text-accent" />
                  <span className="text-[10px] uppercase tracking-widest font-black text-white/60">System Architecture</span>
               </div>
               <p className="text-[11px] text-white/40 leading-relaxed font-mono">
                  "AgOS 4.0 leverages a recursive feedback loop between 45 specialized agents. This allows for 24/7 autonomous build cycles and zero-friction handover."
                  <br /><br />
                  <span className="text-accent">— @Theo (The Architect)</span>
               </p>
            </div>
          </div>

          {/* Agent Grid */}
          <AgentGrid />

          {/* Strategic Insights Section */}
          <div className="mt-32 pt-24 border-t border-white/5">
             <div className="text-center mb-20">
                <span className="text-white/20 text-[10px] uppercase tracking-[0.4em] font-black mb-4 block">Thought Leadership</span>
                <h2 className="text-4xl md:text-6xl font-black text-white">Strategic <span className="text-accent italic">Antigravities</span>.</h2>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {strategicInsights.map((insight) => (
                  <div key={insight.agent} className="glass-panel p-10 rounded-[40px] border-white/5 hover:border-accent/20 transition-all group">
                    <div className="flex items-center gap-3 mb-8">
                       <span className="text-accent text-[9px] font-black uppercase tracking-widest">{insight.topic}</span>
                       <div className="h-px flex-1 bg-white/5" />
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed mb-10 italic font-serif group-hover:text-white transition-colors">
                      "{insight.quote}"
                    </p>
                    <div className="flex items-center gap-4">
                       <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                          <Info className="w-4 h-4 text-white/20" />
                       </div>
                       <span className="text-accent text-[10px] font-black uppercase tracking-widest">{insight.agent}</span>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Guarantee Footer */}
          <div className="mt-32 p-12 glass-panel rounded-[60px] border-white/5 flex flex-col md:flex-row items-center justify-between gap-12 bg-accent/[0.02]">
             <div className="flex items-center gap-8">
                <div className="w-16 h-16 rounded-3xl bg-accent/20 flex items-center justify-center">
                   <ShieldCheck className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <h4 className="text-white font-black text-xl mb-1 uppercase tracking-tight">Vetting Protocol v4.0</h4>
                  <p className="text-white/40 text-sm">Every agent in the orchestra is truth-locked and performance-audited by @Vigil.</p>
                </div>
             </div>
             <button className="px-10 py-5 bg-white text-black text-[12px] uppercase tracking-[0.2em] font-black rounded-full hover:bg-accent transition-all duration-500 flex items-center gap-3">
               Download Full Roster (PDF)
               <TrendingUp className="w-4 h-4" />
             </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
