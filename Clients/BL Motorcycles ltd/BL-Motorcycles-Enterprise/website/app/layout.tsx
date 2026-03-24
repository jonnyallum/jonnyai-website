import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-Q7XVHQ8K25";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "B&L Motorcycles | Motorcycle Parts, Repairs & Servicing | Fareham, Hampshire",
  description:
    "B&L Motorcycles Ltd — over 32,000 genuine motorcycle parts in stock. Specialist repairs, servicing and parts supplier based in Fareham, Hampshire. Covering Portsmouth, Gosport, Southampton and beyond.",
  keywords: [
    "motorcycle parts Hampshire",
    "motorcycle parts Fareham",
    "motorcycle parts Portsmouth",
    "motorcycle repairs Fareham",
    "motorcycle servicing Hampshire",
    "brake pads motorcycle UK",
    "chain kits motorcycle",
    "air filters motorcycle",
    "Bike It parts",
    "BL Motorcycles",
    "B&L Motorcycles Fareham",
    "motorcycle parts online UK",
  ],
  openGraph: {
    type: "website",
    url: "https://blmotorcyclesltd.co.uk",
    title: "B&L Motorcycles | 32,000+ Genuine Parts | Fareham, Hampshire",
    description:
      "Genuine motorcycle parts for all makes and models. Based in Fareham, Hampshire. Shop online or visit us.",
    images: [{ url: "/images/logo-transparent.png" }],
    siteName: "B&L Motorcycles",
  },
  twitter: {
    card: "summary_large_image",
    title: "B&L Motorcycles | Genuine Parts & Repairs | Hampshire",
    description:
      "Over 32,000 genuine motorcycle parts in stock. Specialist repairs and servicing. Based in Fareham, Hampshire.",
    images: ["/images/logo-transparent.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        />
        <Script id="ga-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { page_path: window.location.pathname });
        `}</Script>
      </head>
      <body className={`${inter.variable} font-sans bg-brand-dark text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
