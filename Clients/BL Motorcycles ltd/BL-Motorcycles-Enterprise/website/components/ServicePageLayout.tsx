import Link from "next/link";
import { Phone, Mail, ArrowRight } from "lucide-react";
import { TechButton } from "@/components/ui/TechButton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { LucideIcon } from "lucide-react";

interface ServicePageLayoutProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  contentTitle: string;
  contentTitleHighlight: string;
  paragraphs: string[];
  listTitle: string;
  listItems: string[];
  ctaTitle: string;
  ctaDescription: string;
}

export default function ServicePageLayout({
  icon: Icon,
  title,
  subtitle,
  image,
  imageAlt,
  contentTitle,
  contentTitleHighlight,
  paragraphs,
  listTitle,
  listItems,
  ctaTitle,
  ctaDescription,
}: ServicePageLayoutProps) {
  return (
    <>
      <Navbar />
      <div className="flex flex-col pt-20">
        {/* Hero */}
        <section className="relative py-20 bg-secondary">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-black border-2 border-brand-gold/30 mb-6">
                <Icon className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-white uppercase mb-6">
                {title}
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">{subtitle}</p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div>
                <img
                  src={image}
                  alt={imageAlt}
                  className="w-full h-auto border border-gray-800 grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div>
                <h2 className="text-3xl font-heading font-bold text-white uppercase mb-6">
                  {contentTitle} <span className="text-primary">{contentTitleHighlight}</span>
                </h2>
                <div className="space-y-4 text-gray-300 leading-relaxed">
                  {paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                  <h3 className="text-xl font-heading font-bold text-primary uppercase mt-8 mb-4">
                    {listTitle}
                  </h3>
                  <ul className="space-y-2">
                    {listItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-secondary border-t border-brand-gold/20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-heading font-bold text-white uppercase mb-6">
              {ctaTitle}
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">{ctaDescription}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:07881274193">
                <TechButton size="lg" className="gap-2">
                  <Phone className="w-5 h-5" />
                  Call Us: 07881 274193
                </TechButton>
              </a>
              <a href="mailto:blmotorcyclesltd@gmail.com">
                <TechButton variant="outline" size="lg" className="gap-2">
                  <Mail className="w-5 h-5" />
                  Email Us
                </TechButton>
              </a>
            </div>
            <div className="mt-8">
              <Link
                href="/"
                className="text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-2"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Back to Home
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
