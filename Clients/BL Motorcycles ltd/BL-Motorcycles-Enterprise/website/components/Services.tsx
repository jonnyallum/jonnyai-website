"use client";

import Link from "next/link";
import { Wrench, Settings, Gauge, Zap, Package, Droplet } from "lucide-react";
import { TechButton } from "@/components/ui/TechButton";
import { TechCard } from "@/components/ui/TechCard";
import { SectionTitle } from "@/components/ui/SectionTitle";

const services = [
  {
    icon: Wrench,
    title: "Service & Repairs",
    desc: "Expert maintenance for all makes and models. From routine servicing to full diagnostics, our experienced team keeps your bike running at its peak.",
    image: "/images/user-image-6.jpg",
    link: "/services/service-repairs",
  },
  {
    icon: Settings,
    title: "Specialist Restoration",
    desc: "Dedicated restoration services including specialist brake restoration and carburetor restoration. We bring classic components back to life.",
    image: "/images/mechanic-work.jpg",
    link: "/services/specialist-restoration",
  },
  {
    icon: Gauge,
    title: "Carb Specialist",
    desc: "Expert carburetor and throttle body specialists. Carbs are stripped, ultrasonic cleaned, serviced, and precision balanced for optimal performance.",
    image: "/images/balancing-gauges.jpg",
    link: "/services/carb-specialist",
  },
  {
    icon: Zap,
    title: "Ultrasonic Cleaning",
    desc: "Deep cleaning for intricate parts using advanced ultrasonic technology, perfect for carburetors, injectors, and brake components.",
    image: "/images/ultrasonic-clean.jpg",
    link: "/services/ultrasonic-cleaning",
  },
  {
    icon: Package,
    title: "New & Used Parts",
    desc: "Quality parts at competitive prices. We stock a wide range of second-hand motorcycle spares, fully inspected and ready for your ride.",
    image: "/images/user-image-11.jpg",
    link: "https://www.ebay.co.uk/str/bnlmotorcycles",
  },
  {
    icon: Droplet,
    title: "Brake Restoration",
    desc: "Complete brake system restoration and rebuilding. We strip, clean, and rebuild calipers and master cylinders to factory standards.",
    image: "/images/user-image-10.jpg",
    link: "/services/brake-restoration",
  },
  {
    icon: Settings,
    title: "Recommissioning",
    desc: "Getting your bike back on the road after years of storage. We handle everything from fuel system cleaning to safety checks.",
    image: "/images/commissioning-new.jpg",
    link: "/services/recommissioning",
  },
];

export default function Services() {
  return (
    <section className="py-20 bg-secondary relative">
      <div className="absolute inset-0 opacity-10 bg-[url('/images/services-bg.jpg')] bg-cover bg-center bg-fixed mix-blend-overlay" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionTitle subtitle="What We Do">Our Services</SectionTitle>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, i) => {
            const isExternal = service.link.startsWith("http");
            const Wrapper = isExternal ? "a" : Link;
            const wrapperProps = isExternal
              ? { href: service.link, target: "_blank", rel: "noopener noreferrer" }
              : { href: service.link };

            return (
              <Wrapper key={i} {...(wrapperProps as any)} className="block h-full">
                <TechCard className="h-full flex flex-col overflow-hidden group p-0 cursor-pointer hover:border-primary/50 transition-all">
                  <div className="h-48 w-full overflow-hidden relative">
                    <img
                      src={service.image}
                      alt={`${service.title} - Specialist motorcycle service in Hampshire`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-300" />
                    <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-black border border-brand-gold/30 flex items-center justify-center group-hover:border-primary transition-all duration-300 z-10">
                      <service.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-heading font-bold text-white uppercase mb-4 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed text-sm">{service.desc}</p>
                  </div>
                </TechCard>
              </Wrapper>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            From carburettors and brake systems to a wide range of second-hand motorcycle
            spares, our online store is fully stocked and easy to use.
          </p>
          <Link href="/services">
            <TechButton variant="outline">View Full Services</TechButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
