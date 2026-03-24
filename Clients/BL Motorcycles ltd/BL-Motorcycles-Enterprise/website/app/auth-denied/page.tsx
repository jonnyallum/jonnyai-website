"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function AuthDeniedPage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-brand-dark flex items-center justify-center p-6 text-white">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-red-950/20 backdrop-blur-xl border border-red-500/20 rounded-3xl p-8 relative z-10 shadow-2xl text-center"
      >
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-4xl font-black mb-2 tracking-tighter uppercase">Access Denied</h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          The eBay authorization request was declined or timed out. Syncing cannot proceed without account access.
        </p>

        <div className="space-y-4">
          <button 
            onClick={() => window.history.back()}
            className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl py-4 font-bold transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            TRY AGAIN
          </button>
          
          <a 
            href="/"
            className="w-full flex items-center justify-center gap-2 bg-black border border-white/5 hover:bg-white/5 rounded-2xl py-4 font-bold transition-all"
          >
            <Home className="w-5 h-5" />
            RETURN TO DASHBOARD
          </a>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 text-xs text-gray-600 uppercase tracking-tighter">
          SECURE CONNECTION INTERRUPTED
        </div>
      </motion.div>
    </main>
  );
}
