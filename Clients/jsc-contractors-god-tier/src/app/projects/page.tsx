"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Projects from "@/components/Projects";

export default function ProjectsPage() {
  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      {/* Page Hero */}
      <section className="relative pt-48 pb-32 px-6 md:px-12 bg-black overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/IMG-20260219-WA0007.jpg"
            alt="JSC Projects"
            fill
            className="object-cover opacity-20 grayscale"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <span className="text-accent text-[12px] uppercase tracking-[0.5em] font-black mb-8 block">
              Portfolio
            </span>
            <h1 className="text-6xl md:text-9xl font-serif text-white leading-none mb-8">
              Case <br /><span className="italic text-neutral-400">Studies</span>.
            </h1>
            <p className="text-white/50 text-xl font-sans max-w-2xl leading-relaxed">
              A curated selection of completed projects. Hover each image to reveal the true finish of our craftsmanship.
            </p>
          </motion.div>

          {/* Breadcrumb */}
          <div className="mt-16 flex items-center gap-4 text-[11px] uppercase tracking-widest text-white/30">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <span>/</span>
            <span className="text-accent">Case Studies</span>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <Projects />

      {/* Stats Section */}
      <section className="py-24 px-6 md:px-12 bg-neutral-950 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
            {[
              { number: "20+", label: "Years Experience" },
              { number: "500+", label: "Projects Completed" },
              { number: "2", label: "Counties Served" },
              { number: "100%", label: "Client Satisfaction" },
            ].map((stat) => (
              <div key={stat.label} className="bg-neutral-950 p-12 text-center space-y-4">
                <h3 className="text-4xl md:text-6xl font-serif text-accent">{stat.number}</h3>
                <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-white text-center border-t border-neutral-100">
        <h2 className="text-4xl md:text-6xl font-serif text-black mb-6">
          Ready to start your <span className="italic">project</span>?
        </h2>
        <p className="text-neutral-500 text-lg font-sans max-w-xl mx-auto mb-10">
          Contact us today for a free consultation and detailed project proposal.
        </p>
        <Link href="/contact/" className="inline-block px-14 py-6 bg-black text-white text-[12px] uppercase tracking-[0.4em] font-black hover:bg-accent hover:text-black transition-all duration-500 shadow-2xl">
          Start a Conversation
        </Link>
      </section>

      <Footer />
    </main>
  );
}
