"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Services from "@/components/Services";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen selection:bg-accent selection:text-black">
      <Navbar />
      <Hero />
      
      {/* Narrative Section - The Soul of JSC */}
      <section className="py-40 px-6 bg-[#fdfdfd] relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-neutral-100" />
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-12"
          >
            <span className="text-accent text-[12px] uppercase tracking-[0.5em] font-black block">
              EST. 2004 — Master of Custom Timber
            </span>
            <h2 className="text-5xl md:text-8xl font-serif text-black leading-tight">
              A <span className="italic">Carpentry-First</span> <br />Building Philosophy.
            </h2>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-[11px] uppercase tracking-[0.3em] font-black text-neutral-400 max-w-4xl mx-auto pt-8 border-t border-neutral-100">
              <span className="text-accent">Extensions</span>
              <span>Roofs</span>
              <span className="text-accent">Loft Conversions</span>
              <span>Kitchen Fitting</span>
              <span className="text-accent">Shop Fit Outs</span>
              <span>Summer Houses</span>
              <span className="text-accent">New Builds</span>
              <span>Service Station Restrooms</span>
              <span className="text-accent">Pub Refurbs</span>
              <span>Restaurant Fit Outs</span>
              <span className="text-accent">Office Refits</span>
              <span>Decking</span>
              <span className="text-accent">Fencing</span>
            </div>
            <p className="text-neutral-500 text-xl md:text-2xl font-sans leading-relaxed max-w-4xl pt-10">
              With over 20 years of mastery, JSC Contractors has evolved from Portsmouth&apos;s finest joiners into full-service building contractors. Our foundation in carpentry ensures that every extension, conversion, or commercial fit-out across Hampshire is built with structural integrity and aesthetic perfection.
            </p>
            <div className="h-24 w-[1px] bg-accent/30 mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* NEW: Project Blueprint Section */}
      <section className="py-32 px-6 bg-black text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/5 -skew-x-12 transform translate-x-1/2" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <header className="space-y-6">
              <span className="text-accent text-[12px] uppercase tracking-[0.4em] font-black">
                The JSC Blueprint
              </span>
              <h2 className="text-5xl md:text-7xl font-serif leading-tight">
                Architectural <br /><span className="italic">Integrity</span>.
              </h2>
            </header>
            <div className="space-y-8 text-neutral-400 text-lg leading-relaxed font-sans">
              <p>
                Every project begins with a baseline of technical precision. Whether we are refitting a service station restroom or constructing a bespoke residential new build, our methodology remains unchanged: **Precision first.**
              </p>
              <p>
                As a carpentry-led firm, we understand the structural "bones" of a building better than anyone. This allows us to foresee complications before they arise, ensuring that extensions, loft conversions, and commercial refits are delivered on time and beyond specification.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
              <div>
                <h4 className="text-white font-serif text-2xl mb-2">20+</h4>
                <p className="text-neutral-500 text-[11px] uppercase tracking-widest leading-loose">Years of Master Joinery Experience</p>
              </div>
              <div>
                <h4 className="text-white font-serif text-2xl mb-2">100%</h4>
                <p className="text-neutral-500 text-[11px] uppercase tracking-widest leading-loose">Technical Precision Standards</p>
              </div>
            </div>
          </div>
          <div className="relative aspect-square md:aspect-[4/5] overflow-hidden group">
            <Image 
              src="/assets/IMG-20260219-WA0008.jpg" 
              alt="JSC Construction Precision" 
              fill 
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 border-[20px] border-black/50 pointer-events-none" />
          </div>
        </div>
      </section>

      <Projects />
      
      {/* NEW: Industry Sectors Section */}
      <section className="py-32 px-6 bg-[#f8f8f8]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <div className="max-w-2xl">
              <span className="text-accent text-[12px] uppercase tracking-[0.4em] font-black mb-6 block">
                Broad Sector Expertise
              </span>
              <h2 className="text-5xl md:text-8xl font-serif text-black leading-tight">
                Built for <span className="italic">Every</span> <br />Environment.
              </h2>
            </div>
            <p className="text-neutral-500 text-lg max-w-sm font-sans mb-4">
              From the intimacy of a designer kitchen to the high-traffic demands of commercial shop fitting and pub renovations.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-200 border border-neutral-200">
            {[
              { title: "Residential", list: "Extensions, Lofts, New Builds" },
              { title: "Hospitality", list: "Pubs, Restaurants, Hotels" },
              { title: "Retail", list: "Shop Fitting, Showrooms" },
              { title: "Public Sector", list: "Service Stations, Offices" }
            ].map((sector) => (
              <div key={sector.title} className="bg-white p-12 space-y-6 hover:bg-black group transition-colors duration-500">
                <h4 className="text-xl font-serif text-black group-hover:text-white transition-colors">{sector.title}</h4>
                <p className="text-neutral-400 text-sm font-sans leading-relaxed group-hover:text-neutral-500 transition-colors uppercase tracking-widest border-t border-neutral-100 pt-6">
                  {sector.list}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Services />
      
      {/* Final Call to Action */}
      <section className="py-32 px-6 bg-neutral-950 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('/assets/background.png')] opacity-[0.02] pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-8xl font-serif mb-12">
            Ready to <span className="italic text-neutral-500">Build</span> your Legacy?
          </h2>
          <Link href="/contact/" className="inline-block px-16 py-6 bg-accent text-black text-[12px] uppercase tracking-[0.4em] font-black hover:bg-white transition-all transform hover:scale-105 duration-500 shadow-2xl">
            Get a Free Quote
          </Link>
        </div>
      </section>

      <section className="py-32 px-6 bg-white border-t border-neutral-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="space-y-6">
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-accent">Standard 01</h4>
              <h3 className="text-3xl font-serif text-black italic">Structural Integrity</h3>
              <p className="text-neutral-500 text-sm font-sans leading-relaxed">
                As carpentry-first contractors, our knowledge of timber framing and structural loads is the foundation of every build. We never compromise on the bones of a project.
              </p>
            </div>
            <div className="space-y-6 md:border-l md:border-neutral-100 md:pl-16">
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-accent">Standard 02</h4>
              <h3 className="text-3xl font-serif text-black italic">Bespoke Finish</h3>
              <p className="text-neutral-500 text-sm font-sans leading-relaxed">
                From kitchen fitting to commercial shop fit-outs, we pride ourselves on zero-tolerance joinery. If it is not perfect, it is not JSC.
              </p>
            </div>
            <div className="space-y-6 md:border-l md:border-neutral-100 md:pl-16">
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-accent">Standard 03</h4>
              <h3 className="text-3xl font-serif text-black italic">Operational Depth</h3>
              <p className="text-neutral-500 text-sm font-sans leading-relaxed">
                With 20 years in the trade, our project management is as sharp as our tools. From site safety to logistics, we run a clean, professional operation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
