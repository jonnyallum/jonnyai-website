import Link from "next/link";
import { Wrench, Settings, Gauge, Zap, Package, Droplet } from "lucide-react";
import { TechCard } from "@/components/ui/TechCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const services = [
  {
    icon: Wrench,
    title: "Service & Repairs",
    desc: "Expert maintenance for all makes and models.",
    image: "/images/user-image-6.jpg",
    href: "/services/service-repairs",
  },
  {
    icon: Settings,
    title: "Specialist Restoration",
    desc: "Dedicated restoration services for classic components.",
    image: "/images/mechanic-work.jpg",
    href: "/services/specialist-restoration",
  },
  {
    icon: Gauge,
    title: "Carb Specialist",
    desc: "Expert carburetor and throttle body specialists.",
    image: "/images/balancing-gauges.jpg",
    href: "/services/carb-specialist",
  },
  {
    icon: Zap,
    title: "Ultrasonic Cleaning",
    desc: "Deep cleaning using advanced ultrasonic technology.",
    image: "/images/ultrasonic-clean.jpg",
    href: "/services/ultrasonic-cleaning",
  },
  {
    icon: Droplet,
    title: "Brake Restoration",
    desc: "Complete brake system restoration to factory standards.",
    image: "/images/user-image-10.jpg",
    href: "/services/brake-restoration",
  },
  {
    icon: Settings,
    title: "Recommissioning",
    desc: "Getting your bike back on the road after storage.",
    image: "/images/commissioning-new.jpg",
    href: "/services/recommissioning",
  },
];

export default function ServicesIndex() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="py-20 bg-secondary">
          <div className="max-w-7xl mx-auto px-6">
            <SectionTitle subtitle="What We Do">Our Services</SectionTitle>
            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service, i) => (
                <Link key={i} href={service.href} className="block h-full">
                  <TechCard className="h-full flex flex-col overflow-hidden group p-0 cursor-pointer hover:border-primary/50 transition-all">
                    <div className="h-48 w-full overflow-hidden relative">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-300" />
                      <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-black border border-brand-gold/30 flex items-center justify-center group-hover:border-primary transition-all duration-300 z-10">
                        <service.icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-heading font-bold text-white uppercase mb-2 group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-gray-400 text-sm">{service.desc}</p>
                    </div>
                  </TechCard>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
