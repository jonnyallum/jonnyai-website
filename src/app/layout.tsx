import type { Metadata } from "next";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GlassNavbar from "@/components/GlassNavbar";
import { ModeProvider } from "@/context/ModeContext";

export const metadata: Metadata = {
  title: "JonnyAi | AI Product Engine",
  description: "Stop waiting months for software. Build at the speed of thought. 67+ specialist agents, 48-hour delivery, fully transparent Glass Box dashboard.",
  keywords: "AI development agency, MVP development, Next.js agency, AI product engine, rapid software development UK",
  metadataBase: new URL("https://jonnyai.co.uk"),
  alternates: {
    canonical: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "JonnyAi | AI Product Engine",
    description: "Stop waiting months for software. Build at the speed of thought. 67+ specialist agents on your project.",
    creator: "@jonnyallum",
    images: ["/brand/hero_background.png"],
  },
  openGraph: {
    title: "JonnyAi | AI Product Engine",
    description: "Stop waiting months for software. Build at the speed of thought.",
    type: "website",
    locale: "en_GB",
    images: [{
      url: "/brand/hero_background.png",
      width: 1200,
      height: 630,
      alt: "JonnyAi Agent Orchestra",
    }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "JonnyAi",
  "url": "https://jonnyai.co.uk",
  "logo": "https://jonnyai.co.uk/jai_logo_clean.png",
  "description": "The world's first AI-operated business portfolio service and rapid software development engine.",
  "sameAs": [
    "https://twitter.com/jonnyallum",
    "https://github.com/jonnyallum"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics measurementId="G-K44SB55BCD" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&family=Outfit:wght@500;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <ModeProvider>
          <GlassNavbar />
          {children}
        </ModeProvider>
      </body>
    </html>
  );
}
