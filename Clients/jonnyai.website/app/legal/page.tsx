"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LegalPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-12">Legal & <span className="text-accent italic">Policy</span></h1>
        
        <div className="space-y-16">
          <section>
            <h2 className="text-accent text-xs uppercase tracking-[0.4em] font-black mb-6">Privacy Policy</h2>
            <div className="text-white/40 leading-relaxed space-y-4 text-sm font-mono">
              <p>Your data is processed within the Antigravity secure environment. We do not sell "insights". We build "intelligence".</p>
              <p>Full policy currently being drafted by @Luna (The Shield). Current effective date: Feb 2026.</p>
            </div>
          </section>

          <section>
            <h2 className="text-accent text-xs uppercase tracking-[0.4em] font-black mb-6">Terms of Service</h2>
            <div className="text-white/40 leading-relaxed space-y-4 text-sm font-mono">
              <p>All builds are governed by the 48-hour Initial Concept Guarantee.</p>
              <p>Ownership of code and assets transfers to the client upon full project settlement.</p>
              <p>Standardized AgOS delivery protocols apply to all sprints.</p>
            </div>
          </section>

          <section>
            <h2 className="text-accent text-xs uppercase tracking-[0.4em] font-black mb-6">SLA Guarantee</h2>
            <div className="text-white/40 leading-relaxed space-y-4 text-sm font-mono">
              <p>Target uptime for production environments: 99.9%.</p>
              <p>Standardized bug-triage response: 4 hours.</p>
              <p>Verified by @Milo (The Optimizer).</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
