"use client";

import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Download } from "lucide-react";
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="glass-card max-w-lg w-full p-12 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-8 gold-glow"
        >
          <CheckCircle className="text-brand-dark" size={40} />
        </motion.div>
        
        <h1 className="text-3xl font-bold mb-4 gold-gradient italic">Audit Locked</h1>
        <p className="text-zinc-400 mb-8 leading-relaxed">
          Payment confirmed. The Antigravity Orchestra's specialized auditors (@vigil & @rowan) have been pings. Your comprehensive 13-Gate Audit Report will be delivered to your email within 6 hours.
        </p>
        
        <div className="space-y-4">
          <button className="w-full py-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all font-semibold">
            <Download size={18} />
            Download Lite Report
          </button>
          
          <Link href="/" className="inline-flex items-center gap-2 text-brand-gold hover:underline font-medium mt-4">
            Return to Dashboard <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}
