"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Copy, Home, ExternalLink } from "lucide-react";
import { Suspense } from "react";

function AuthSuccessContent() {
  const searchParams = useSearchParams();
  
  const params = {
    ebaytkn: searchParams.get("ebaytkn"),
    tknexp: searchParams.get("tknexp"),
    username: searchParams.get("username"),
    code: searchParams.get("code"), // For OAuth flow
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-brand-dark flex items-center justify-center p-6 text-white">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-brand-gray/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative z-10 shadow-2xl"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 bg-brand-gold/10 rounded-full flex items-center justify-center mb-6 border border-brand-gold/20">
            <CheckCircle className="w-10 h-10 text-brand-gold" />
          </div>
          <h1 className="text-4xl font-black mb-2 tracking-tighter">AUTHENTICATION SUCCESS</h1>
          <p className="text-gray-400">eBay has successfully authorized B&L Motorcycles.</p>
        </div>

        <div className="space-y-4 mb-8">
          {Object.entries(params).map(([key, value]) => value && (
            <div key={key} className="bg-black/40 rounded-2xl p-4 border border-white/5 group hover:border-brand-gold/30 transition-colors">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{key}</span>
                <button 
                  onClick={() => copyToClipboard(value)}
                  className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 hover:text-brand-gold transition-all"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className="font-mono text-sm break-all text-gray-200">
                {value}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <a 
            href="/"
            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl py-4 font-bold transition-all"
          >
            <Home className="w-5 h-5" />
            GO HOME
          </a>
          <button 
            onClick={() => window.close()}
            className="flex items-center justify-center gap-2 bg-brand-gold text-black rounded-2xl py-4 font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-brand-gold/20"
          >
            <ExternalLink className="w-5 h-5" />
            CLOSE WINDOW
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 text-center text-xs text-gray-600 uppercase tracking-tighter">
          B&L MOTORCYCLES LTD • EBAY SYNC ENGINE v4.0
        </div>
      </motion.div>
    </main>
  );
}

export default function AuthSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-dark flex items-center justify-center text-brand-gold font-black">SYNCING...</div>}>
      <AuthSuccessContent />
    </Suspense>
  );
}
