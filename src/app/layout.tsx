import type { Metadata } from "next";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GlassNavbar from "@/components/GlassNavbar";

export const metadata: Metadata = {
  title: "JonnyAi | AI Product Engine",
  description: "Stop waiting months for software. Build at the speed of thought. 40+ specialist agents, 48-hour delivery, fully transparent Glass Box dashboard.",
  keywords: "AI development agency, MVP development, Next.js agency, AI product engine, rapid software development UK",
  openGraph: {
    title: "JonnyAi | AI Product Engine",
    description: "Stop waiting months for software. Build at the speed of thought.",
    type: "website",
    locale: "en_GB",
  },
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&family=Outfit:wght@500;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <GlassNavbar />
        {children}
      </body>
    </html>
  );
}
