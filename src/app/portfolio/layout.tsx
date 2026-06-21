import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work — JonnyAI | Real sites, real products, built by one person",
  description:
    "Case studies from JonnyAI: branding and websites for local businesses, e-commerce automation, mobile apps, and the live SaaS line (Compliance Hub, Care Hub, FM Control Hub). Built by an operator, not a consultant.",
  metadataBase: new URL("https://jonnyai.co.uk"),
  openGraph: {
    title: "Work — JonnyAI | Real sites, real products, built by one person",
    description:
      "Branding, websites, apps and live SaaS — every project documented from problem through to result.",
    url: "https://jonnyai.co.uk/portfolio",
    siteName: "JonnyAI",
  },
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="portfolio-root"
      style={{
        position: "relative",
        zIndex: 10,
        background: "#070708",
        color: "#FFFFFF",
        // Match the rest of the site: headings that previously used the
        // serif variable now render in Outfit (the brand display face).
        ["--font-instrument-serif" as string]: "'Outfit', sans-serif",
        ["--font-inter" as string]: "'Inter', sans-serif",
        fontFamily: "'Inter', sans-serif",
        minHeight: "100vh",
        isolation: "isolate",
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
