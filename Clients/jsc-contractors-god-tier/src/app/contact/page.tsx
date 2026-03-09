"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-48 pb-32 px-6 md:px-12 bg-black overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/IMG-20260219-WA0004.jpg"
            alt="JSC Contact"
            fill
            className="object-cover opacity-15 grayscale"
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
              Start Your Build
            </span>
            <h1 className="text-6xl md:text-9xl font-serif text-white leading-none mb-8">
              Get in <br /><span className="italic text-neutral-400">Touch</span>.
            </h1>
            <p className="text-white/50 text-xl font-sans max-w-2xl leading-relaxed">
              Whether planning a luxury extension or a complex commercial fit-out, our team is ready to bring 20 years of expertise to your project.
            </p>
          </motion.div>
          <div className="mt-16 flex items-center gap-4 text-[11px] uppercase tracking-widest text-white/30">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <span>/</span>
            <span className="text-accent">Contact</span>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24">

            {/* Contact Info */}
            <div className="space-y-16">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-serif text-black leading-tight">
                  Let&apos;s discuss <em>your</em> project.
                </h2>
                <p className="text-neutral-500 text-xl font-sans leading-relaxed">
                  We respond to all enquiries within one business day. For urgent quotes, please email directly.
                </p>
              </div>

              <div className="space-y-10">
                <div className="space-y-3">
                  <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-accent">Phone</h3>
                  <Link
                    href="tel:07506699826"
                    className="text-2xl md:text-3xl font-serif text-black hover:text-accent transition-colors duration-300"
                  >
                    07506 699 826
                  </Link>
                </div>

                <div className="space-y-3 pt-10 border-t border-neutral-100">
                  <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-accent">Email</h3>
                  <Link
                    href="mailto:info@jsccontractors.co.uk"
                    className="text-2xl md:text-3xl font-serif text-black hover:text-accent transition-colors duration-300"
                  >
                    info@jsccontractors.co.uk
                  </Link>
                </div>

                <div className="space-y-3 pt-10 border-t border-neutral-100">
                  <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-accent">Service Area</h3>
                  <p className="text-xl font-sans text-neutral-600">Portsmouth, Hampshire, West Sussex</p>
                  <p className="text-sm font-sans text-neutral-400">and across the South East of England</p>
                </div>

                <div className="space-y-3 pt-10 border-t border-neutral-100">
                  <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-accent">Our Services</h3>
                  <div className="flex flex-wrap gap-3">
                    {["Extensions", "Loft Conversions", "New Builds", "Commercial Fit-Outs", "Kitchen Fitting", "Roofing", "Summer Houses"].map(s => (
                      <span key={s} className="px-4 py-2 border border-neutral-200 text-[10px] uppercase tracking-widest text-neutral-500 font-black">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <form
                action="mailto:Jamesshieldcarpentry@gmail.com"
                method="GET"
                className="space-y-8 p-10 md:p-16 bg-[#f8f8f8] border border-neutral-100"
              >
                <h3 className="text-2xl font-serif text-black">Project Enquiry Form</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-black">First Name</label>
                    <input
                      type="text"
                      name="firstname"
                      required
                      className="w-full bg-white border border-neutral-200 px-4 py-4 focus:border-accent focus:outline-none transition-colors text-black font-sans"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-black">Last Name</label>
                    <input
                      type="text"
                      name="lastname"
                      required
                      className="w-full bg-white border border-neutral-200 px-4 py-4 focus:border-accent focus:outline-none transition-colors text-black font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-black">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full bg-white border border-neutral-200 px-4 py-4 focus:border-accent focus:outline-none transition-colors text-black font-sans"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-black">Service Required</label>
                  <select
                    name="service"
                    className="w-full bg-white border border-neutral-200 px-4 py-4 focus:border-accent focus:outline-none transition-colors text-black font-sans appearance-none"
                  >
                    <option value="">Select a service...</option>
                    <option>Residential Extension</option>
                    <option>Loft Conversion</option>
                    <option>New Build</option>
                    <option>Commercial Fit-Out</option>
                    <option>Kitchen Fitting</option>
                    <option>Roofing</option>
                    <option>Summer House / Garden Room</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-black">Project Details</label>
                  <textarea
                    rows={5}
                    name="body"
                    placeholder="Tell us about your project, location, and approximate budget..."
                    className="w-full bg-white border border-neutral-200 px-4 py-4 focus:border-accent focus:outline-none transition-colors text-black font-sans resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-14 py-6 bg-black text-white text-[12px] uppercase tracking-[0.4em] font-black hover:bg-accent hover:text-black transition-all duration-500 shadow-xl"
                >
                  Send Enquiry
                </button>

                <p className="text-[10px] text-neutral-400 font-sans text-center">
                  We respond to all enquiries within 1 business day.
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
