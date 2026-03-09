"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ShieldCheck, ShieldX, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function VerifyPage() {
  const [cid, setCid] = useState("");
  const [status, setStatus] = useState<"idle" | "searching" | "found" | "not_found">("idle");

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cid) return;
    
    setStatus("searching");
    // Simulated global registry lookup
    setTimeout(() => {
      if (cid.toUpperCase() === "GS-B821") {
        setStatus("found");
      } else {
        setStatus("not_found");
      }
    }, 1500);
  };

  return (
    <main className="min-h-screen px-6 py-12 lg:px-24">
      <nav className="mb-24 flex items-center justify-between max-w-4xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to Audit
        </Link>
      </nav>

      <section className="max-w-xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Registry <span className="gold-gradient italic">Verification</span></h1>
        <p className="text-zinc-500 text-sm">Enter an Antigravity Checksum ID (CID) to verify an agent's audit status.</p>
      </section>

      <section className="max-w-lg mx-auto">
        <form onSubmit={handleVerify} className="relative mb-12">
          <input 
            type="text" 
            value={cid}
            onChange={(e) => setCid(e.target.value)}
            placeholder="e.g. GS-B821"
            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-12 py-4 text-center text-lg font-mono tracking-widest focus:outline-none focus:border-brand-gold/50"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={20} />
          <button 
            type="submit"
            className="w-full mt-4 py-3 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all uppercase tracking-tighter text-xs"
          >
            Query Registry
          </button>
        </form>

        {status === "searching" && (
          <div className="flex flex-col items-center gap-4 text-zinc-500">
            <Loader2 className="animate-spin text-brand-gold" size={32} />
            <span className="font-mono text-[10px]">READING_SHARED_BRAIN...</span>
          </div>
        )}

        {status === "found" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 border-brand-gold/30 bg-brand-gold/5 text-center"
          >
            <ShieldCheck className="mx-auto text-brand-gold mb-4" size={48} />
            <h2 className="text-xl font-bold text-white mb-2">VERIFIED_SECURE</h2>
            <div className="text-[10px] text-zinc-500 font-mono space-y-1">
              <p>ID: {cid.toUpperCase()}</p>
              <p>AUDIT_DATE: 2026-02-23</p>
              <p>GATES_PASSED: 13/13</p>
              <p>HIVE_LOCK: ACTIVE</p>
            </div>
          </motion.div>
        )}

        {status === "not_found" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 border-red-500/30 bg-red-500/5 text-center"
          >
            <ShieldX className="mx-auto text-red-500 mb-4" size={48} />
            <h2 className="text-xl font-bold text-white mb-2">ID_NOT_RECOGNIZED</h2>
            <p className="text-xs text-zinc-400">This agent has not been certified by the Gold Standard. It may be an unverified wrapper.</p>
          </motion.div>
        )}
      </section>
    </main>
  );
}
