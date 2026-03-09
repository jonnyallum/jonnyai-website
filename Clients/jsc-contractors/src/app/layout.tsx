import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { JsonLd } from "@/components/ui/JsonLd";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "JSC Building | Carpentry Contractors | Hampshire & West Sussex",
  description: "Premium carpentry contractors specializing in high-end residential and commercial projects. Expert timber solutions, loft conversions, and new builds.",
  keywords: "carpentry, contractors, hampshire, west sussex, building, renovations, timber solutions, loft conversions, JSC Building",
  openGraph: {
    title: "JSC Building | Carpentry Contractors",
    description: "Premium carpentry contractors specializing in high-end projects in Hampshire & West Sussex.",
    url: "https://www.jsccontractors.co.uk",
    siteName: "JSC Building",
    locale: "en_GB",
    type: "website",
    images: ["/logos/jsc-logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSC Building | Carpentry Contractors",
    description: "Premium carpentry contractors specializing in high-end projects.",
    images: ["/logos/jsc-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className="scroll-smooth">
      <body
        className={`${inter.variable} ${cormorant.variable} antialiased selection:bg-black selection:text-white`}
      >
        <div className="blueprint-overlay" />
        <GoogleAnalytics />
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
