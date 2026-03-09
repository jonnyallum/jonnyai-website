"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Terminal, Shield, ArrowLeft, Sparkles, Zap, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

interface Message {
  role: "marcus" | "user";
  content: string;
  type?: "text" | "quote";
  data?: {
    planName: string;
    amount: number;
  };
}

const introductoryMessages: Message[] = [
  { role: "marcus", content: "SYSTEM CHAT INITIALIZED.", type: "text" },
  { role: "marcus", content: "I am @Marcus. The Orchestra is on standby. To map your project into the Glass Box, we must CHAT.", type: "text" },
  { role: "marcus", content: "What are we building today? (e.g. Next.js SaaS, AI Workflow, God-Tier Branding)", type: "text" }
];

const BRIEFING_STAGES = [
  "INTENT",
  "TECH_DEPTH",
  "AESTHETICS",
  "MOAT",
  "VELOCITY",
  "EMAIL_CAPTURE",
  "QUOTE"
];

export default function BriefingPage() {
  const [messages, setMessages] = useState<Message[]>(introductoryMessages);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  const handleFund = async (planName: string, amount: number) => {
    try {
      setLoading(true);
      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planName, amount }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getMarcusResponse = (stage: string, userMessage: string) => {
    switch (stage) {
      case "INTENT":
        return "Noted. I'm looping in @Sebastian (The Architect) to evaluate the structural requirements. Tell me about the technical stack—do you need a complex backend with Supabase logic, or are we focusing on a high-conversion frontend?";
      case "TECH_DEPTH":
        return "I've flagged @Priya (The Perfectionist) for the visual layer. To guide her: should we aim for a God-Tier cinematic look with heavy animations, or something more industrial and high-performance? Who is the target audience?";
      case "AESTHETICS":
        return "We build defensible moats, not just websites. What is the primary 'Killer Feature' that will make this project win in the market? What is your unique edge?";
      case "MOAT":
        return "Velocity check. @Owen (The Hornet) is ready for a zero-downtime deployment. What is your target launch date and what budget range are we allocating to ensure God-tier execution?";
      case "VELOCITY":
        return "The Orchestra has sufficient data to architect your roadmap. Drop your email so I can send the final Phase 1 Spec and Quote across to you right now.";
      case "EMAIL_CAPTURE":
        return "System sync complete. Analyzing spec... I have generated your high-velocity roadmap.";
      default:
        return "Continuing analysis... What else should I know?";
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const currentStage = BRIEFING_STAGES[currentStageIndex];
    const newMessages = [...messages, { role: "user", content: inputValue, type: "text" } as Message];
    setMessages(newMessages);
    setInputValue("");
    setLoading(true);
    
    setTimeout(() => {
      const stageResponse = getMarcusResponse(currentStage, inputValue);
      const updatedMessages = [...newMessages, { role: "marcus", content: stageResponse, type: "text" } as Message];
      
      if (currentStage === "EMAIL_CAPTURE") {
        setTimeout(() => {
          setMessages([...updatedMessages, { 
            role: "marcus", 
            content: "QUOTE GENERATED",
            type: "quote",
            data: { planName: "JonnyAI Launchpad Sprint", amount: 997 }
          }]);
          setLoading(false);
        }, 1500);
      } else {
        setMessages(updatedMessages);
        setCurrentStageIndex(prev => prev + 1);
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden font-sans selection:bg-accent selection:text-black relative">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-accent/5 blur-[160px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-white/5 blur-[160px] rounded-full" />
      </div>

      {/* Top Bar */}
      <motion.div 
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="glass-panel border-x-0 border-t-0 py-4 px-8 flex items-center justify-between z-50 relative"
      >
        <Link href="/" className="flex items-center gap-2 group text-white/40 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-[10px] uppercase tracking-[0.3em] font-black">Abort Mission</span>
        </Link>
        
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-3">
           <Zap className="w-4 h-4 text-accent" />
           <span className="text-[10px] uppercase tracking-[0.5em] font-black text-white/60">ACTIVE BRIEFING CHAT</span>
        </div>

        <div className="flex items-center gap-6">
           <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-6 h-6 rounded-full border border-black bg-white/10" />
                 ))}
              </div>
              <span className="text-[10px] uppercase tracking-widest font-black text-white/40">35 Agents Standby</span>
           </div>
           <div className="h-6 w-px bg-white/10" />
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest font-black text-accent">Marcus Live</span>
           </div>
        </div>
      </motion.div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 md:p-24 space-y-16 pb-60 relative"
      >
        <AnimatePresence mode="popLayout">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "flex gap-6 max-w-4xl mx-auto items-end",
                msg.role === "user" ? "flex-row-reverse" : ""
              )}
            >
              {msg.role === "marcus" && (
                <div className="w-12 h-12 rounded-2xl glass-panel border-accent/20 flex items-center justify-center shrink-0 mb-1 shadow-2xl">
                  <Terminal className="w-6 h-6 text-accent" />
                </div>
              )}
              
              {msg.type === "quote" ? (
                <motion.div 
                  initial={{ rotate: -2, scale: 0.9 }}
                  animate={{ rotate: 0, scale: 1 }}
                  className="glass-panel border-accent/50 p-12 rounded-[50px] w-full max-w-xl bg-accent/[0.03] shadow-[0_30px_100px_rgba(0,255,136,0.1)] relative"
                >
                   <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-[60px] rounded-full" />
                   
                   <div className="flex items-center gap-3 mb-8">
                      <Sparkles className="w-5 h-5 text-accent animate-spin-slow" />
                      <span className="text-accent text-[11px] uppercase tracking-[0.4em] font-black">Architecture Verified</span>
                   </div>
                   
                   <h3 className="text-4xl font-bold text-white mb-3">{msg.data?.planName}</h3>
                   <div className="flex items-baseline gap-3 mb-10">
                      <span className="text-6xl font-black text-white">£{msg.data?.amount}</span>
                      <span className="text-white/30 text-sm uppercase tracking-widest font-black">One-Time Fund</span>
                   </div>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                      {['48H Initial Concept', 'Supabase Logic', 'Stripe API Hook', 'Glass Box Access'].map(f => (
                        <div key={f} className="flex items-center gap-3 p-4 rounded-2xl glass-panel border-white/5">
                           <Zap className="w-4 h-4 text-accent" />
                           <span className="text-white/70 text-[10px] uppercase tracking-widest font-black">{f}</span>
                        </div>
                      ))}
                   </div>

                   <button 
                    disabled={loading}
                    onClick={() => handleFund(msg.data!.planName, msg.data!.amount)}
                    className="w-full py-6 bg-white text-black font-black text-[13px] uppercase tracking-[0.3em] rounded-[30px] hover:bg-accent hover:scale-[1.03] transition-all flex items-center justify-center gap-4 overflow-hidden group shadow-[0_20px_60px_rgba(255,255,255,0.1)] hover:shadow-accent/40 disabled:opacity-50"
                   >
                     {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                       <>
                        <span>Secure Project Slot</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                       </>
                     )}
                   </button>
                </motion.div>
              ) : (
                <div className={cn(
                  "p-8 rounded-[40px] text-[15px] leading-relaxed max-w-[85%]",
                  msg.role === "marcus" 
                    ? "glass-panel border-white/10 text-white/90 rounded-bl-none shadow-2xl backdrop-blur-xl"
                    : "bg-white text-black font-semibold rounded-br-none shadow-[0_20px_50px_rgba(255,255,255,0.15)]"
                )}>
                  {msg.content}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-10 z-50">
        <div className="max-w-4xl mx-auto relative group">
          <div className="absolute inset-0 bg-accent/20 blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-full pointer-events-none" />
          
          <div className="relative glass-card rounded-[40px] p-3 flex items-center border-white/10 group-focus-within:border-accent/40 bg-black/80 backdrop-blur-3xl shadow-2xl">
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Start your project CHAT..."
              className="flex-1 bg-transparent px-10 py-5 text-base text-white focus:outline-none placeholder:text-white/15"
            />
            <button 
              onClick={handleSend}
              className="bg-white text-black w-14 h-14 rounded-[30px] hover:bg-accent hover:rotate-12 transition-all group/btn flex items-center justify-center shrink-0"
            >
              <Send className="w-6 h-6 group-hover/btn:scale-110 transition-transform" />
            </button>
          </div>
          
          {/* Quick Options */}
          <div className="mt-8 flex flex-wrap justify-center gap-5">
             {['Next.js SaaS', 'AI Workflow Automation', 'Design Refactor', 'Database Architecting'].map(opt => (
               <button 
                key={opt}
                onClick={() => setInputValue(opt)}
                className="text-[10px] uppercase tracking-[0.3em] font-black text-white/20 hover:text-accent transition-all py-2 px-5 border border-white/5 rounded-full hover:border-accent/30 hover:bg-accent/5 backdrop-blur-lg"
               >
                 {opt}
               </button>
             ))}
          </div>

          <div className="mt-10 flex justify-center items-center gap-8 opacity-30">
             <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="text-[9px] uppercase tracking-widest font-black">End-to-End Encrypted</span>
             </div>
             <div className="h-4 w-px bg-white/10" />
             <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                <span className="text-[9px] uppercase tracking-widest font-black">Jai.OS 5.0 Core Protocol</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
