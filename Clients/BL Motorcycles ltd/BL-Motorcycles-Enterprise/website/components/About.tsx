"use client";

import { ShieldCheck, Truck, Star } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-20 bg-black relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="absolute -inset-4 bg-brand-gold/5 transform -rotate-2" />
            <img
              src="/images/user-image-4.jpg"
              alt="Inside our motorcycle repair workshop in Fareham"
              className="relative shadow-2xl border border-gray-800 grayscale hover:grayscale-0 transition-all duration-500"
            />
            <div className="absolute -bottom-6 -right-6 bg-card p-6 border border-brand-gold/20 shadow-xl hidden md:block">
              <p className="font-heading font-bold text-4xl text-primary mb-1">2020</p>
              <p className="text-xs font-mono uppercase tracking-widest text-gray-400">
                Established
              </p>
            </div>
          </div>

          {/* Copy */}
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white uppercase mb-6">
              Our <span className="text-primary">Story</span>
            </h2>
            <div className="space-y-6 text-gray-400 leading-relaxed">
              <p>
                At B&L Motorcycles, we live and breathe motorcycles and the lifestyle that
                comes with them. Our founders have been passionate riders for over 20 years,
                gaining hands-on experience and a deep understanding of the biking world.
              </p>
              <p>
                B&L Motorcycles Ltd was created to share that passion, offering fellow riders
                access to quality used motorcycle parts, expert repairs, and unbeatable service.
                Whether you&apos;re restoring a classic bike or keeping your pride and joy on the road,
                we&apos;re here to support every rider&apos;s journey.
              </p>
              <p>
                Founded in 2020 during the Covid-19 pandemic, B&L Motorcycles has grown into a
                trusted name in the motorcycle community. Whether you&apos;re a home mechanic or a trade
                buyer, we&apos;re here to keep your bike on the road with parts you can trust.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="text-center p-4 border border-gray-800 bg-card/50">
                <ShieldCheck className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-xs font-mono uppercase tracking-wider">Trusted Quality</p>
              </div>
              <div className="text-center p-4 border border-gray-800 bg-card/50">
                <Truck className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-xs font-mono uppercase tracking-wider">Fast UK Delivery</p>
              </div>
              <div className="text-center p-4 border border-gray-800 bg-card/50">
                <Star className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-xs font-mono uppercase tracking-wider">Expert Service</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
