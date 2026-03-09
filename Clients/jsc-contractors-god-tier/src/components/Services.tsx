"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const services = [
  {
    title: "Master Carpentry & Bespoke Joinery",
    slug: "carpentry",
    experience: "20 Years of Mastery",
    description: "At our core, we are carpenters. Every project we undertake is informed by two decades of technical timber expertise.",
    longContent: "We specialise in the technical side of wood. Whether it is a heritage restoration requiring sympathetic timber replacement or a modern architectural masterpiece with complex structural demands, our team ensures every joint is perfect. We handle hardwood flooring, bespoke staircases, and one-of-a-kind internal cabinetry that transforms a house into a bespoke home.",
    details: [
      "Traditional Cut & Pitch Roofing",
      "Structural Timber Framing",
      "Bespoke Internal Cabinetry",
      "Hardwood Staircases & Flooring"
    ],
    image: "/assets/IMG-20260219-WA0004.jpg",
  },
  {
    title: "Architectural Extensions & Loft Conversions",
    slug: "extensions",
    experience: "Structural Excellence",
    description: "Expanding your living space requires more than just building walls; it requires a deep structural understanding. We specialise in seamless extensions and luxury loft conversions that integrate perfectly with your existing property.",
    longContent: "Our carpentry-led approach means we excel at the complex roofing and structural work that these projects often demand, blending aesthetics with modern energy efficiency and engineering.",
    details: [
      "Single & Multi-Storey Extensions",
      "Luxury Dormer & Hip-to-Gable Lofts",
      "Structural Steel Integration",
      "Full Project Management"
    ],
    image: "/assets/IMG-20260219-WA0003.jpg",
  },
  {
    title: "Commercial Refurbishment & Fit-Outs",
    slug: "commercial",
    experience: "Precision at Scale",
    description: "Our commercial portfolio spans high-traffic pub refurbishments, boutique restaurant fit-outs, and professional office refits.",
    longContent: "We are the preferred contractors for complex commercial refits, including service station restroom transformations and full-scale hospitality refurbs. We handle office partitions, retail fit-outs, and technical shop fitting, ensuring your commercial space is both functional and visually stunning.",
    details: [
      "Pub & Restaurant Refurbishment",
      "Service Station Restroom Refits",
      "Office Partitioning & Re-fits",
      "Bespoke Retail Shop Fitting"
    ],
    image: "/assets/IMG-20260219-WA0001.jpg",
  },
  {
    title: "Luxury Kitchens & Interior Transformations",
    slug: "interiors",
    experience: "Detail Obsessed",
    description: "The kitchen is the heart of the home, and our fitting service treats it with technical reverence.",
    longContent: "Beyond just fitting cabinets, we manage the technical implementation of your entire interior layout. This includes bespoke media units, custom wardrobe systems, and precision bathroom fitting. Our background in joinery allows us to create entirely bespoke interiors that maximize space and luxury.",
    details: [
      "Designer Kitchen Installation",
      "Custom Interior Media Units",
      "Bespoke Wardrobe Systems",
      "Luxury Bathroom Transformations"
    ],
    image: "/assets/IMG-20260219-WA0002.jpg",
  },
  {
    title: "Outdoor Living & Summer Houses",
    slug: "outdoor",
    experience: "External Craftsmanship",
    description: "We extend JSC's precision to your exterior property with garden rooms and premium decking.",
    longContent: "We build more than just sheds; we build sanctuaries. Our bespoke summer houses and garden offices are fully insulated and structurally sound. We also provide heavy-duty fencing solutions and high-end timber decking that stands up to the British elements while providing a luxury aesthetic.",
    details: [
      "Insulated Garden Offices",
      "Bespoke Summer Houses",
      "Premium Timber & Composite Decking",
      "Heavy-Duty Acoustic Fencing"
    ],
    image: "/assets/IMG-20260219-WA0005.jpg",
  },
  {
    title: "New Builds & Full-Scale Construction",
    slug: "new-builds",
    experience: "Foundation to Finish",
    description: "JSC Contractors provides full-service new build construction across Hampshire and the South East.",
    longContent: "A new build by JSC is a mark of quality. We work with architects and planners to bring vision to life, handling everything from the initial foundation work to the final flick of a joiner's chisel. Our team is experienced in both traditional brick-and-mortar builds and modern timber-frame construction.",
    details: [
      "Custom Residential New Builds",
      "Modern Timber-Frame Homes",
      "Traditional Masonry Build",
      "Site Management & Turnkey Delivery"
    ],
    image: "/assets/IMG-20260219-WA0007.jpg",
  }
];

export default function Services() {
  return (
    <section className="bg-white py-24 md:py-40 px-6 md:px-12 relative overflow-hidden" id="services">
      {/* Background depth texture */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none bg-[url('/assets/background.png')] bg-repeat z-0" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-24 md:mb-40">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-[1px] bg-accent" />
            <span className="text-accent text-[11px] uppercase tracking-[0.5em] font-black">
              Foundational Expertise
            </span>
          </div>
          <h2 className="text-5xl md:text-9xl font-serif text-black leading-[0.9] mb-12">
            Master <br /><span className="italic text-neutral-400">Contracting</span>.
          </h2>
          <p className="text-neutral-500 text-lg md:text-2xl font-sans max-w-4xl leading-relaxed">
            With over 20 years of experience, JSC Contractors has redefined building standards. Every extension, conversion, and commercial fit-out is informed by our technical joinery roots.
          </p>
        </header>

        <div className="space-y-32 md:space-y-60">
          {services.map((service, idx) => (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={cn(
                "flex flex-col gap-10 md:gap-32 items-start",
                idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              )}
            >
              <div className="w-full md:flex-1 space-y-8 md:space-y-12 order-2 md:order-none">
                <div className="space-y-4 md:space-y-6">
                  <span className="text-[11px] md:text-sm font-sans font-black text-accent block tracking-[0.3em] uppercase">
                    {service.experience} 
                  </span>
                  <h3 className="text-4xl md:text-7xl font-serif text-black leading-tight">
                    {service.title}
                  </h3>
                </div>
                
                <div className="space-y-6 md:space-y-8 border-l border-neutral-100 pl-6 md:pl-10">
                  <p className="text-black text-xl md:text-2xl font-sans leading-relaxed font-bold">
                    {service.description}
                  </p>
                  <p className="text-neutral-500 text-base md:text-lg font-sans leading-relaxed">
                    {service.longContent}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 pt-10 border-t border-neutral-100">
                  {service.details.map((detail) => (
                    <div key={detail} className="flex items-center gap-4">
                      <div className="w-1.5 h-1.5 bg-accent rotate-45 flex-shrink-0" />
                      <span className="text-[11px] md:text-xs uppercase tracking-[0.2em] text-black font-black leading-tight">{detail}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-8">
                  <Link href="/contact/" className="group relative inline-block px-12 py-5 bg-black text-white text-[11px] uppercase tracking-[0.4em] font-black hover:bg-accent hover:text-black transition-all duration-500 shadow-xl overflow-hidden">
                    <span className="relative z-10">Start Your Project</span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  </Link>
                </div>
              </div>

              <div className="w-full md:flex-1 relative aspect-[4/3] md:aspect-[4/5] group overflow-hidden shadow-2xl order-1 md:order-none">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-1000" />
                
                {/* Mobile-Fixed Meta details - cleaner hierarchy */}
                <div className="absolute bottom-6 left-6 md:bottom-12 md:right-12 bg-white/95 backdrop-blur-xl p-6 md:p-10 border-l-4 border-accent shadow-2xl max-w-[240px] md:max-w-[280px] transform translate-y-0 md:translate-y-8 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-700 delay-200">
                   <h4 className="text-[10px] md:text-[12px] uppercase tracking-[0.4em] font-black mb-3 text-black italic">Technical Precision</h4>
                   <p className="text-[12px] md:text-[13px] text-neutral-600 leading-relaxed font-sans font-medium">
                     Leveraging our foundational joinery skills to ensure zero-tolerance accuracy on every structural element.
                   </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
