import { ArrowRight } from "lucide-react";
import { TechButton } from "@/components/ui/TechButton";
import { SectionTitle } from "@/components/ui/SectionTitle";

export default function Products() {
  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle subtitle="Shop With Confidence">Our Products</SectionTitle>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="order-2 md:order-1">
            <h3 className="text-2xl font-heading font-bold text-white uppercase mb-4">
              High-Quality Parts & Accessories
            </h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              We stock a wide range of high-quality motorcycle parts and accessories,
              including exhaust systems, helmets, and premium riding gear. Every product
              we offer is carefully selected to meet our high standards for performance,
              durability, and value — so you can ride with confidence knowing you&apos;re
              getting the best.
            </p>
            <a
              href="https://www.ebay.co.uk/str/bnlmotorcycles"
              target="_blank"
              rel="noopener noreferrer"
            >
              <TechButton className="gap-2">
                Visit eBay Store <ArrowRight className="w-4 h-4" />
              </TechButton>
            </a>
          </div>
          <div className="order-1 md:order-2 relative">
            <div className="absolute inset-0 bg-brand-gold/10 transform translate-x-4 translate-y-4 border border-brand-gold/20" />
            <img
              src="/images/products-new.jpg"
              alt="Quality used motorcycle parts and spares available for delivery across the UK"
              className="relative w-full h-auto border border-gray-800 grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
