"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const values = [
  {
    number: "01",
    title: "Carpentry First",
    body: "We are joiners at heart. Our mastery of timber — from structural framing to bespoke cabinetry — sets a precision standard that drives every project we take on, residential or commercial.",
  },
  {
    number: "02",
    title: "Honest Craftmanship",
    body: "No shortcuts, no substitutions. We use the right materials for the right application; always. Our clients trust us because our work speaks for itself, project after project.",
  },
  {
    number: "03",
    title: "Full-Service Delivery",
    body: "From initial design consultation through to final snagging, JSC manages the complete lifecycle of your build. One point of accountability. Zero loose ends.",
  },
];

const milestones = [
  { year: "2004", event: "JSC Contractors founded by master joiners in Hampshire." },
  { year: "2008", event: "Expanded into full-scale residential extensions and loft conversions." },
  { year: "2012", event: "Launched commercial division — pubs, restaurants, and retail fit-outs." },
  { year: "2018", event: "Awarded preferred contractor status for regional service station refits." },
  { year: "2024", event: "Over 500 completed projects across Hampshire, West Sussex & the South East." },
];

export default function AboutPage() {
  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-48 pb-32 px-6 md:px-12 bg-black overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/IMG-20260219-WA0006.jpg"
            alt="JSC Craftsmanship"
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
              Since 2004 — Master Craftsmen
            </span>
            <h1 className="text-6xl md:text-9xl font-serif text-white leading-none mb-8">
              Two Decades of <br /><span className="italic text-neutral-400">Excellence</span>.
            </h1>
            <p className="text-white/50 text-xl font-sans max-w-2xl leading-relaxed">
              Hampshire and West Sussex&apos;s premier carpentry-led building contractors — building homes, fitting commercial spaces, and setting the standard since 2004.
            </p>
          </motion.div>
          <div className="mt-16 flex items-center gap-4 text-[11px] uppercase tracking-widest text-white/30">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <span>/</span>
            <span className="text-accent">About</span>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-40 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <div className="relative aspect-[4/5] overflow-hidden shadow-2xl">
            <Image
              src="/assets/IMG-20260219-WA0008.jpg"
              alt="JSC Team at Work"
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
              <span className="text-accent text-[10px] uppercase tracking-widest font-black">Est. 2004</span>
              <p className="text-white text-sm font-sans mt-1">Founded in Hampshire</p>
            </div>
          </div>
          <div className="space-y-12">
            <h2 className="text-4xl md:text-6xl font-serif text-black leading-tight">
              A foundation built on <em>carpentry</em> and technical precision.
            </h2>
            <div className="space-y-8 text-neutral-500 text-lg leading-relaxed font-sans">
              <p>
                Founded by master joiners, JSC Contractors has spent over 20 years perfecting the art of the build. We believe that every high-end extension, loft conversion, or commercial fit-out depends on the structural integrity that only a carpentry-first perspective can deliver.
              </p>
              <p>
                Our team is a collective of specialised craftsmen who share a singular vision: to deliver uncompromising quality on every site, every time. From the selection of premium timber to the final structural finishes, our attention to detail is absolute.
              </p>
              <p>
                Today, we are the South East&apos;s premier contractors for both luxury residential transformations and high-stakes commercial refits - including specialty projects like service station restrooms, pub refurbishments, and architectural office refits.
              </p>
            </div>
            <Link href="/contact/" className="inline-block px-12 py-5 bg-black text-white text-[11px] uppercase tracking-[0.4em] font-black hover:bg-accent hover:text-black transition-all duration-500 shadow-xl">
              Work With Us
            </Link>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 px-6 md:px-12 bg-[#f8f8f8]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24">
            <span className="text-accent text-[12px] uppercase tracking-[0.5em] font-black mb-6 block">
              Our Philosophy
            </span>
            <h2 className="text-5xl md:text-8xl font-serif text-black leading-tight">
              How We <span className="italic">Work</span>.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-200 border border-neutral-200">
            {values.map((value) => (
              <motion.div
                key={value.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-[#f8f8f8] p-12 space-y-6 hover:bg-black group transition-colors duration-500"
              >
                <span className="text-[11px] uppercase tracking-widest text-accent font-black">{value.number}</span>
                <h3 className="text-3xl font-serif text-black group-hover:text-white transition-colors">{value.title}</h3>
                <p className="text-neutral-500 text-sm font-sans leading-relaxed group-hover:text-neutral-400 transition-colors">{value.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-32 px-6 md:px-12 bg-black text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/5 -skew-x-12 transform translate-x-1/2" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-24">
            <span className="text-accent text-[12px] uppercase tracking-[0.5em] font-black mb-6 block">
              Our History
            </span>
            <h2 className="text-5xl md:text-8xl font-serif leading-tight">
              20 Years in the <em>Making</em>.
            </h2>
          </div>
          <div className="space-y-0">
            {milestones.map((m, idx) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.7 }}
                className="flex gap-12 md:gap-24 items-start border-t border-white/10 py-10 group hover:border-accent transition-colors duration-500"
              >
                <span className="text-accent font-serif text-2xl md:text-3xl min-w-[80px] group-hover:scale-110 transition-transform duration-300">{m.year}</span>
                <p className="text-neutral-400 text-lg font-sans leading-relaxed group-hover:text-white transition-colors duration-500">{m.event}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 px-6 md:px-12 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { number: "20+", label: "Years Experience" },
            { number: "500+", label: "Projects Completed" },
            { number: "2", label: "Counties Served" },
            { number: "6", label: "Core Service Lines" },
          ].map((stat) => (
            <div key={stat.label} className="space-y-4">
              <h3 className="text-5xl md:text-7xl font-serif text-black">{stat.number}</h3>
              <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-neutral-950 text-white text-center">
        <h2 className="text-4xl md:text-7xl font-serif mb-8">
          Ready to <span className="italic text-neutral-500">Build</span> Together?
        </h2>
        <p className="text-neutral-400 text-lg font-sans max-w-xl mx-auto mb-12">
          Tell us about your project. We will listen, advise, and deliver beyond your expectations.
        </p>
        <Link href="/contact/" className="inline-block px-16 py-6 bg-accent text-black text-[12px] uppercase tracking-[0.4em] font-black hover:bg-white transition-all transform hover:scale-105 duration-500 shadow-2xl">
          Get in Touch
        </Link>
      </section>

      <Footer />
    </main>
  );
}
