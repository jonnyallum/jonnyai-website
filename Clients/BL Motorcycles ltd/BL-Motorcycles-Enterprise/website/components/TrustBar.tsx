"use client";

import { motion } from "framer-motion";
import { Package, MapPin, Truck, ShieldCheck } from "lucide-react";

const stats = [
  {
    icon: Package,
    value: "Local Breaker",
    label: "Fareham, Hampshire",
    sub: "Buy, break and sell — new & used parts available",
  },
  {
    icon: MapPin,
    value: "Call First",
    label: "07881 274193",
    sub: "We deal with local enquiries daily — just give us a ring",
  },
  {
    icon: Truck,
    value: "32,000+",
    label: "New Parts Online",
    sub: "Genuine stock from UK's leading suppliers",
  },
  {
    icon: ShieldCheck,
    value: "Specialist",
    label: "Carbs, Brakes & More",
    sub: "Ultrasonic cleaning, carb restoration, throttle balancing",
  },
];

export default function TrustBar() {
  return (
    <section className="relative bg-brand-gray border-t border-white/5 border-b border-white/5 py-16 overflow-hidden">
      {/* Subtle gold gradient sweep */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-gold/3 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex gap-4 items-start"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-brand-gold/30"
              style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(212,175,55,0.05) 100%)" }}
            >
              <stat.icon className="w-5 h-5 text-brand-gold" />
            </div>
            <div>
              <div className="text-lg font-black bg-gradient-to-r from-brand-gold to-brand-gold-light bg-clip-text text-transparent">{stat.value}</div>
              <div className="text-sm font-semibold text-gray-300 mb-0.5">{stat.label}</div>
              <div className="text-xs text-gray-500 leading-relaxed">{stat.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
