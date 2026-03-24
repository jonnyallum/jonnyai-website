"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const categories = [
  { name: "Brakes & Discs", desc: "Brake pads, discs, callipers, lines", query: "brake" },
  { name: "Exhausts", desc: "Silencers, headers, cans, slip-ons", query: "exhaust" },
  { name: "Filters", desc: "Air, oil & fuel filters for all models", query: "filter" },
  { name: "Chains & Sprockets", desc: "Chain kits, sprockets, tensioners", query: "chain" },
  { name: "Electrical & Lighting", desc: "Bulbs, indicators, relays, switches", query: "electrical" },
  { name: "Grips & Controls", desc: "Handlebar grips, levers, mirrors", query: "grip" },
  { name: "Tyres & Tubes", desc: "Inner tubes, tyre repair, valves", query: "tyre" },
  { name: "Bodywork", desc: "Panels, huggers, screen, mudguards", query: "bodywork" },
];

export default function Categories() {
  return (
    <section className="py-24 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-4xl font-black tracking-tighter mb-3">
            Shop by <span className="text-brand-gold">Category</span>
          </h2>
          <p className="text-gray-500 text-base max-w-xl">
            Browse our full range of motorcycle parts across every major category.
            From consumables to performance upgrades — we stock it all.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.a
              key={cat.name}
              href={`/shop?q=${encodeURIComponent(cat.query)}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className="group relative bg-brand-gray border border-white/5 rounded-2xl p-6 hover:border-brand-gold/40 transition-all cursor-pointer overflow-hidden"
            >
              {/* Gold gradient top accent on hover */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <h3 className="font-bold text-base mb-1.5 group-hover:text-brand-gold transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">{cat.desc}</p>
              <div className="flex items-center gap-1 text-xs text-brand-gold font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Browse <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <a
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-gold hover:underline"
          >
            View all 32,000+ parts <ChevronRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
