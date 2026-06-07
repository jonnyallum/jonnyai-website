import type { Metadata } from "next";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GlassNavbar from "@/components/GlassNavbar";
import FiberCanvas from "@/components/FiberCanvas";
import { ModeProvider } from "@/context/ModeContext";

export const metadata: Metadata = {
  title: "JonnyAI | We brand it, build it, film it & automate it",
  description: "An AI-native creative + tech studio for local businesses. Rebrands, websites & apps, on-site content & reels, and AI automation — done end to end. Plus our own SaaS: the HubSuite.",
  keywords: "creative studio UK, web design UK, rebrand UK, logo design UK, content and reels UK, local business marketing UK, AI automation UK, vertical SaaS UK, Hampshire web design",
  metadataBase: new URL("https://jonnyai.co.uk"),
  alternates: { canonical: "https://jonnyai.co.uk/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  openGraph: {
    title: "JonnyAI | We brand it, build it, film it & automate it",
    description: "An AI-native creative + tech studio for local businesses — rebrands, websites & apps, content & reels, and AI automation. Plus our own SaaS product line.",
    type: "website",
    url: "https://jonnyai.co.uk",
    locale: "en_GB",
    siteName: "JonnyAI",
    images: [{ url: "/brand/og_card.png", width: 1200, height: 630, alt: "JonnyAI — We brand it, build it, film it & automate it" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["ProfessionalService", "LocalBusiness"],
  "name": "JonnyAI",
  "url": "https://jonnyai.co.uk",
  "logo": "https://jonnyai.co.uk/jai_logo_clean.png",
  "image": "https://jonnyai.co.uk/brand/og_card.png",
  "description": "An AI-native creative and technology studio for local businesses — rebrands, logos, websites and apps, on-site content and reels, and AI automation. We also build and sell our own vertical SaaS (the HubSuite).",
  "priceRange": "££",
  "address": { "@type": "PostalAddress", "addressCountry": "GB", "addressRegion": "United Kingdom" },
  "areaServed": { "@type": "Country", "name": "United Kingdom" },
  "email": "hello@jonnyai.co.uk",
  "founder": { "@type": "Person", "name": "Jonny Allum" },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Studio services for local businesses",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": { "@type": "Service", "name": "Branding & Rebrands", "description": "Logo design, brand identity and full rebrands that make local businesses look serious." },
      },
      {
        "@type": "Offer",
        "itemOffered": { "@type": "Service", "name": "Websites & Apps", "description": "Fast, modern Next.js websites and web apps built to convert, with local SEO baked in." },
      },
      {
        "@type": "Offer",
        "itemOffered": { "@type": "Service", "name": "Content & Reels", "description": "On-site filming, vertical reels and social content — produced and published for you." },
      },
      {
        "@type": "Offer",
        "itemOffered": { "@type": "Service", "name": "AI & Automation", "description": "Private AI systems and automations that remove repetitive work and run 24/7." },
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
