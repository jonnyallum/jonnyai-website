import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { TechButton } from "@/components/ui/TechButton";
import { SectionTitle } from "@/components/ui/SectionTitle";

export default function ShopSection() {
  return (
    <section className="py-20 bg-black border-y border-brand-gold/10">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <SectionTitle subtitle="Browse Our Inventory">Shop Parts</SectionTitle>

        <div className="max-w-4xl mx-auto bg-card border border-brand-gold/20 p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-3xl -ml-16 -mb-16" />

          <ShoppingBag className="w-16 h-16 text-primary mx-auto mb-6" />
          <h3 className="text-3xl font-heading font-bold text-white uppercase mb-4">
            Online Store Now Live
          </h3>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Browse our full catalogue of over 32,000 genuine motorcycle parts.
            <br />
            <span className="text-primary font-bold">
              Order online or contact us for any requests.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <TechButton size="lg">Shop Now</TechButton>
            </Link>
            <a
              href="https://www.ebay.co.uk/str/bnlmotorcycles"
              target="_blank"
              rel="noopener noreferrer"
            >
              <TechButton variant="outline" size="lg" className="gap-2">
                Visit eBay Store <ArrowRight className="w-4 h-4" />
              </TechButton>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
