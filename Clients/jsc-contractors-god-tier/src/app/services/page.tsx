"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Services from "@/components/Services";

export default function ServicesPage() {
  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      {/* Page Hero */}
      <section className="relative pt-48 pb-32 px-6 md:px-12 bg-black overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/IMG-20260219-WA0003.jpg"
            alt="JSC Services"
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
              Our Core Expertise
            </span>
            <h1 className="text-6xl md:text-9xl font-serif text-white leading-none mb-8">
              What We <br /><span className="italic text-neutral-400">Build</span>.
            </h1>
            <p className="text-white/50 text-xl font-sans max-w-2xl leading-relaxed">
              From bespoke joinery in Portsmouth to full-scale commercial fit-outs across Hampshire - every service is delivered with carpentry-first precision.
            </p>
          </motion.div>

          {/* Breadcrumb */}
          <div className="mt-16 flex items-center gap-4 text-[11px] uppercase tracking-widest text-white/30">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <span>/</span>
            <span className="text-accent">Services</span>
          </div>
        </div>
      </section>

      {/* Services Component */}
      <Services />

      {/* CTA Section */}
      <section className="py-32 px-6 bg-neutral-950 text-white text-center">
        <h2 className="text-4xl md:text-7xl font-serif mb-8">
          Ready to <span className="italic text-neutral-500">Start</span> Your Build?
        </h2>
        <p className="text-neutral-400 text-lg font-sans max-w-xl mx-auto mb-12">
          Talk to our team about your project. We offer a free consultation and detailed project proposal.
        </p>
        <Link href="/contact/" className="inline-block px-16 py-6 bg-accent text-black text-[12px] uppercase tracking-[0.4em] font-black hover:bg-white transition-all transform hover:scale-105 duration-500 shadow-2xl">
          Get a Free Quote
        </Link>
      </section>

      <Footer />
    </main>
  );
}
