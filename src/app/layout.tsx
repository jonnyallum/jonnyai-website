import type { Metadata } from "next";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GlassNavbar from "@/components/GlassNavbar";
import FiberCanvas from "@/components/FiberCanvas";
import { ModeProvider } from "@/context/ModeContext";

export const metadata: Metadata = {
  title: "JonnyAI | Private AI Installation for UK Businesses",
  description: "We install a private AI system inside your business — configured for your workflows, trained on your data, running on your hardware. Not a SaaS. Yours forever. From £997.",
  keywords: "private AI install UK, AI for small business UK, business AI system, AI installation service UK, n8n automation UK, AI workforce UK, custom AI build UK",
  metadataBase: new URL("https://jonnyai.co.uk"),
  alternates: { canonical: "https://jonnyai.co.uk/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  openGraph: {
    title: "JonnyAI | Private AI Installation for UK Businesses",
    description: "We install a private AI system inside your business — configured for your workflows, trained on your data, on your hardware. From £997.",
    type: "website",
    url: "https://jonnyai.co.uk",
    locale: "en_GB",
    siteName: "JonnyAI",
    images: [{ url: "/brand/og_card.png", width: 1200, height: 630, alt: "JonnyAI — Private AI Installation for UK Businesses" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["ProfessionalService", "LocalBusiness"],
  "name": "JonnyAI",
  "url": "https://jonnyai.co.uk",
  "logo": "https://jonnyai.co.uk/jai_logo_clean.png",
  "image": "https://jonnyai.co.uk/brand/og_card.png",
  "description": "Private AI installation, automation, and AI workforce services for UK small businesses. We build AI systems that live inside your business — on your hardware, trained on your data.",
  "priceRange": "£297-£1997",
  "address": { "@type": "PostalAddress", "addressCountry": "GB", "addressRegion": "United Kingdom" },
  "areaServed": { "@type": "Country", "name": "United Kingdom" },
  "email": "hello@jonnyai.co.uk",
  "founder": { "@type": "Person", "name": "Jonny Allum" },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "AI Services for UK Businesses",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Private AI Install",
          "description": "A private AI system installed on your hardware, configured for your workflows, trained on your data.",
        },
        "price": "997",
        "priceCurrency": "GBP",
        "priceSpecification": { "@type": "PriceSpecification", "minPrice": "997", "maxPrice": "1997", "priceCurrency": "GBP" },
      },
      {
        "@type": "Offer",
        "itemOffered": { "@type": "Service", "name": "Automation Packs", "description": "n8n workflows that eliminate repetitive business tasks." },
        "price": "297",
        "priceCurrency": "GBP",
      },
      {
        "@type": "Offer",
        "itemOffered": { "@type": "Service", "name": "AI Workforce", "description": "A dedicated AI agent trained on your business, running 24/7." },
        "price": "1000",
        "priceCurrency": "GBP",
      },
    ],
  },
  "sameAs": ["https://jonnyai.co.uk", "https://github.com/jonnyallum"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <head>
        <GoogleAnalytics measurementId="G-K44SB55BCD" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <FiberCanvas />
        <ModeProvider>
          <GlassNavbar />
          {children}
        </ModeProvider>
      </body>
    </html>
  );
}
