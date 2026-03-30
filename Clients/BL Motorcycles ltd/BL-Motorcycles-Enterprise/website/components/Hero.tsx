"use client";

import Link from "next/link";
import { TechButton } from "@/components/ui/TechButton";

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-bg-v2.jpg"
          alt="Motorcycle workshop offering expert repairs and servicing in Hampshire and Portsmouth"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <div className="mb-8">
          <img
            src="/images/logo-transparent.png"
            alt="B&L Motorcycles - Trusted Motorcycle Parts and Repairs in Fareham"
            className="w-64 h-auto mx-auto mb-8 gold-glow-lg"
          />
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white uppercase tracking-tight mb-2">
            Welcome to <span className="text-primary">BL Motorcycles</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-mono tracking-widest uppercase mb-8">
            Quality Used Motorcycle Parts & Repairs
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-12">
          <p className="text-gray-300 leading-relaxed text-lg mb-8">
            At B&L Motorcycles, we specialise in supplying high-quality used motorcycle
            parts at affordable prices. Based in Hampshire, we&apos;re a family-run business
            passionate about bikes, offering expert service to riders in Portsmouth,
            Fareham, Gosport, Havant, Southampton, Petersfield, and Chichester.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <TechButton size="lg" className="w-full sm:w-auto">
                Shop Parts
              </TechButton>
            </Link>
            <Link href="/services">
              <TechButton variant="outline" size="lg" className="w-full sm:w-auto">
                Garage Services
              </TechButton>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
