"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Building2 } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-24 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black tracking-tighter mb-6">
              About <span className="text-brand-gold">B&L Motorcycles</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-5">
              B&L Motorcycles Ltd is a family-run motorcycle breaker and parts business
              based in Fareham, Hampshire. We buy and break bikes, carry out specialist
              repairs, and supply quality new and used parts to local riders and customers
              across the UK.
            </p>
            <p className="text-gray-400 leading-relaxed mb-8">
              From a single brake pad to a complete stripped bike — we know our stuff.
              Our online catalogue carries over 32,000 new genuine parts, and if
              you're after something specific from a breaker, give us a call.
              We get local enquiries daily and are always happy to help.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-brand-gold mt-0.5 shrink-0" />
                <span>95 Newgate Lane, Peel Common, Fareham, Hampshire, PO14 1BA</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                <a href="tel:07881274193" className="hover:text-brand-gold transition-colors">
                  07881 274193
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Building2 className="w-4 h-4 text-brand-gold shrink-0" />
                <span>Registered Company No: 14122962</span>
              </div>
            </div>
          </motion.div>

          {/* Right — stats cards */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { value: "32,000+", label: "Parts in catalogue" },
              { value: "560K+", label: "Fitment records" },
              { value: "2", label: "Trusted UK suppliers" },
              { value: "UK", label: "Dispatched from Hampshire" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative bg-brand-gray border border-white/5 rounded-2xl p-6 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent" />
                <div className="text-3xl font-black bg-gradient-to-r from-brand-gold to-brand-gold-light bg-clip-text text-transparent mb-1">{item.value}</div>
                <div className="text-sm text-gray-400">{item.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
