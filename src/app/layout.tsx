import type { Metadata } from "next";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GlassNavbar from "@/components/GlassNavbar";
import SiteCanvas from "@/components/SiteCanvas";
import { ModeProvider } from "@/context/ModeContext";

export const metadata: Metadata = {
  title: "JonnyAI | Private AI for Small Business",
  description: "We install, configure, and train a private AI system inside your business. Not a SaaS. Not a chatbot. Yours. From £997.",
  keywords: "private AI install UK, AI for small business, business automation UK, AI installation service, n8n automation, AI workforce UK",
  metadataBase: new URL("https://jonnyai.co.uk"),
  alternates: { canonical: "/" },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  twitter: {
    card: "summary_large_image",
    title: "JonnyAI | Private AI for Small Business",
    description: "Your own private AI system, installed in your business in a day. From £997.",
    creator: "@jonnyallum",
    images: ["/brand/hero_background.png"],
  },
  openGraph: {
    title: "JonnyAI | Private AI for Small Business",
    description: "We install a private AI system inside your business. Configured for your workflow. Trained on your data. From £997.",
    type: "website",
    locale: "en_GB",
    images: [{ url: "/brand/hero_background.png", width: 1200, height: 630, alt: "JonnyAI — Private AI for Small Business" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "JonnyAI",
  "url": "https://jonnyai.co.uk",
  "logo": "https://jonnyai.co.uk/jai_logo_clean.png",
  "description": "Private AI installation, automation, and digital services for UK small businesses.",
  "address": { "@type": "PostalAddress", "addressCountry": "GB" },
  "email": "hello@jonnyai.co.uk",
  "sameAs": ["https://twitter.com/jonnyallum", "https://github.com/jonnyallum"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
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
        <SiteCanvas />
        <ModeProvider>
          <GlassNavbar />
          {children}
        </ModeProvider>
      </body>
    </html>
  );
}
