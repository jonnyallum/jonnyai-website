import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JSC Contractors | Master Carpenters & Builders | Portsmouth & Hampshire",
  description: "20 years of carpentry-led excellence. Specialising in luxury extensions, new builds, loft conversions, and master building across Portsmouth, Hampshire, and West Sussex.",
  keywords: ["Carpentry Portsmouth", "Builders Hampshire", "Joinery West Sussex", "Luxury Extensions Portsmouth", "Loft Conversions Hampshire", "Building Contractors Portsmouth", "Commercial Fit Outs", "Shop Fitting", "Kitchen Installation"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
