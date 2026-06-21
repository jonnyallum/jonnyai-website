import type { Metadata } from "next";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GlassNavbar from "@/components/GlassNavbar";
import FiberCanvas from "@/components/FiberCanvas";
import { ModeProvider } from "@/context/ModeContext";

export const metadata: Metadata = {
  title: "JonnyAI | A one-man, AI-native digital marketing agency",
  description: "JonnyAI is Jonny Allum — a one-man, AI-native digital marketing agency. Branding, websites, apps, content, paid media, SEO and automation, plus a live software line: the HubSuite blades and the flagship BizOS platform.",
  keywords: "digital marketing agency UK, one man agency, AI marketing UK, web design UK, rebrand UK, logo design UK, content and reels UK, paid media UK, SEO UK, AI automation UK, vertical SaaS UK, BizOS, HubSuite, Hampshire web design",
  metadataBase: new URL("https://jonnyai.co.uk"),
  alternates: { canonical: "https://jonnyai.co.uk/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  openGraph: {
    title: "JonnyAI | A one-man, AI-native digital marketing agency",
    description: "Branding, websites, apps, content, paid media, SEO and automation — plus a live software line: the HubSuite blades and the flagship BizOS platform. You hire me, you get me.",
    type: "website",
    url: "https://jonnyai.co.uk",
    locale: "en_GB",
    siteName: "JonnyAI",
    // Share image is generated dynamically by src/app/opengraph-image.tsx
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "JonnyAI",
  "url": "https://jonnyai.co.uk",
  "logo": "https://jonnyai.co.uk/jai_logo_clean.png",
  "image": "https://jonnyai.co.uk/opengraph-image",
  "description": "A one-man, AI-native digital marketing agency. Branding, websites, apps, content, paid media, SEO and automation — plus a live software line: the HubSuite and the flagship BizOS platform.",
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
        "itemOffered": { "@type": "Service", "name": "Paid Media & SEO", "description": "Google, Meta and TikTok campaigns plus technical and local SEO, wired to real tracking." },
      },
      {
        "@type": "Offer",
        "itemOffered": { "@type": "Service", "name": "AI & Automation", "description": "Private AI systems and automations that remove repetitive work and run 24/7." },
      },
      {
        "@type": "Offer",
        "itemOffered": { "@type": "SoftwareApplication", "name": "BizOS", "description": "Flagship white-label business operating system with 85+ modules and a 108-agent AI swarm." },
      },
    ],
  },
  "sameAs": [
    "https://jonnyai.co.uk",
    "https://github.com/jonnyallum",
    "https://www.linkedin.com/in/jonnyallum/",
    "https://www.instagram.com/jonnyai.co.uk",
    "https://www.tiktok.com/@jonnyai",
    "https://youtube.com/@jonnyaitube",
    "https://hub-suite.co.uk",
    "https://compliance-hub.co.uk",
    "https://care-hub.app",
    "https://fm-control-hub.co.uk"
  ],
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
