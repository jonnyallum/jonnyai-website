"use client";

import { motion } from "framer-motion";
import { Wrench, Users, Search } from "lucide-react";

const reasons = [
  {
    icon: Search,
    title: "Find the Right Part, First Time",
    body: "With over 560,000 fitment records in our database, we help you find exactly the right part for your make, model, and year — no guesswork.",
  },
  {
    icon: Wrench,
    title: "Genuine Parts, Every Time",
    body: "We source directly from trusted UK suppliers including Bike It and CMPO. Every part we sell meets OEM standards or better.",
  },
  {
    icon: Users,
    title: "Trade & Retail Welcome",
    body: "Whether you're a private rider or a trade workshop, we cater to both. Our catalogue covers everything from consumables to specialist components.",
  },
];

export default function WhyChoose() {
  return (
    <section className="py-24 bg-brand-gray">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 max-w-2xl"
        >
          <h2 className="text-4xl font-black tracking-tighter mb-3">
            Why Choose <span className="text-brand-gold">B&L Motorcycles?</span>
          </h2>
          <p className="text-gray-500">
            We're a Hampshire-based motorcycle parts business with a passion for keeping
            riders on the road. No gimmicks — just genuine parts, reliable stock, and
            straightforward service.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {reasons.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="relative bg-brand-dark border border-white/5 rounded-2xl p-8 hover:border-brand-gold/30 transition-all overflow-hidden group"
            >
              {/* Gradient corner accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand-gold/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-brand-gold/30"
                style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(212,175,55,0.05) 100%)" }}
              >
                <r.icon className="w-6 h-6 text-brand-gold" />
              </div>
              <h3 className="text-lg font-bold mb-3">{r.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{r.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
