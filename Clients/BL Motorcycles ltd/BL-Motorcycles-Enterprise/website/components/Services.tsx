"use client";

import { motion } from "framer-motion";
import { Wrench, Droplets, Disc, Settings2, Bike, Phone } from "lucide-react";

const services = [
  {
    icon: Bike,
    title: "Motorcycle Breaking",
    body: "We buy and break a range of motorcycles. Looking for a specific part from a breaker? Give us a ring — if we've got it, we'll sort you out.",
  },
  {
    icon: Settings2,
    title: "Carburettor Restoration",
    body: "Specialist carb cleaning, rebuild and restoration. We work on all types — from old Japanese classics to modern multi-carb setups.",
  },
  {
    icon: Droplets,
    title: "Ultrasonic Cleaning",
    body: "Professional ultrasonic cleaning for carburettors, small engine components, and precision parts. Gets into every passage a brush can't reach.",
  },
  {
    icon: Disc,
    title: "Brake Restoration",
    body: "Brake system repair, caliper refurbishment, disc and pad replacement. We'll get your stopping sorted safely.",
  },
  {
    icon: Wrench,
    title: "Throttle Body Balancing",
    body: "Multi-cylinder throttle body synchronisation for smoother running and better fuelling. Bikes feel like a different machine after.",
  },
  {
    icon: Phone,
    title: "Local & Trade Enquiries",
    body: "Got something you can't find online? Call us. We deal with local riders, garages, and trade customers — always happy to have a chat.",
  },
];

export default function Services() {
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
            What We <span className="text-brand-gold">Do</span>
          </h2>
          <p className="text-gray-500">
            More than just a parts shop. We're hands-on motorcycle people — we break bikes,
            fix them, and know the parts inside out. Based in Fareham and available for
            local work across Hampshire.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative bg-brand-dark border border-white/5 rounded-2xl p-7 hover:border-brand-gold/30 transition-all overflow-hidden group"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 border border-brand-gold/30 shrink-0"
                style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0.04) 100%)" }}
              >
                <s.icon className="w-5 h-5 text-brand-gold" />
              </div>
              <h3 className="font-bold text-base mb-2 group-hover:text-brand-gold transition-colors">
                {s.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{s.body}</p>
            </motion.div>
          ))}
        </div>

        {/* Local CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 rounded-2xl border border-brand-gold/20 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.07) 0%, rgba(212,175,55,0.02) 100%)" }}
        >
          <div>
            <h3 className="font-bold text-lg mb-1">Need something specific? Just ask.</h3>
            <p className="text-gray-500 text-sm">
              Call us on <a href="tel:07881274193" className="text-brand-gold hover:underline">07881 274193</a> or
              come and find us at 95 Newgate Lane, Fareham, Hampshire, PO14 1BA.
            </p>
          </div>
          <a
            href="tel:07881274193"
            className="shrink-0 bg-gradient-to-r from-brand-gold to-brand-gold-dark text-black px-7 py-3 rounded-full font-bold text-sm hover:from-brand-gold-dark hover:to-[#A8891E] transition-all shadow-lg shadow-brand-gold/15 whitespace-nowrap"
          >
            Call Brett
          </a>
        </motion.div>
      </div>
    </section>
  );
}
