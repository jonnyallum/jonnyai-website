"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Zap } from "lucide-react";

function DashboardContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (sessionId) setConfirmed(true);
  }, [sessionId]);

  return (
    <main className="flex-1 flex items-center justify-center px-6 py-32">
      <div className="max-w-2xl w-full text-center">
        {confirmed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-orange-500" />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-orange-500/20 bg-orange-500/5">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-orange-500 text-[10px] uppercase tracking-[0.4em] font-black">Payment Confirmed</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-[0.9] mb-6 tracking-tighter">
              You&apos;re in.<br />
              <span className="text-orange-500">Let&apos;s build.</span>
            </h1>

            <p className="text-white/50 text-lg max-w-lg mx-auto mb-12 leading-relaxed">
              Your purchase is confirmed. The Antigravity Orchestra is on it.
              Check your inbox — delivery details incoming within 24 hours.
            </p>

            <div className="glass-panel rounded-3xl p-8 border-white/5 mb-10 text-left">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-5 h-5 text-orange-500" />
                <span className="text-[10px] uppercase tracking-widest font-black text-white/40">What happens next</span>
              </div>
              <ul className="space-y-4">
                {[
                  "You'll receive a confirmation email within minutes",
                  "Your order is queued with the Antigravity Orchestra",
                  "Expect delivery / onboarding within 24 hours",
                  "Questions? Reply to the confirmation email or visit /brief",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/60">
                    <span className="text-orange-500 font-black text-xs mt-0.5">0{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/labs"
                className="group px-8 py-4 bg-orange-500 text-black text-[11px] uppercase tracking-[0.3em] font-black rounded-full hover:bg-white transition-all duration-300 flex items-center gap-3 justify-center"
              >
                Explore More Ventures
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/brief"
                className="px-8 py-4 border border-white/10 text-[11px] uppercase tracking-[0.3em] font-black rounded-full hover:border-orange-500/40 transition-all duration-300 text-white/60 hover:text-white"
              >
                Talk to the Team
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-4xl font-black mb-4">Dashboard</h1>
            <p className="text-white/40 mb-8">
              No active session found. If you&apos;ve just purchased, check your email for confirmation.
            </p>
            <Link href="/labs" className="px-8 py-4 bg-orange-500 text-black text-[11px] uppercase tracking-[0.3em] font-black rounded-full hover:bg-white transition-all">
              Back to Labs
            </Link>
          </motion.div>
        )}
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#050508] text-white">
      <Navbar />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="text-white/40">Loading...</div></div>}>
        <DashboardContent />
      </Suspense>
      <Footer />
    </div>
  );
}
