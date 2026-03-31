import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Portfolio — Jonny Allum | AI Systems Architect",
  description:
    "Production AI infrastructure, multi-agent orchestration, and full-stack systems for real businesses. 10+ clients automated. Built by an operator, not a consultant.",
  metadataBase: new URL("https://jonnyai.co.uk"),
  openGraph: {
    title: "Portfolio — Jonny Allum | AI Systems Architect",
    description:
      "Production AI infrastructure, multi-agent orchestration, and full-stack systems for real businesses.",
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
      className={`${instrumentSerif.variable} ${inter.variable} portfolio-root`}
      style={{
        background: "#0A0A0A",
        color: "#FFFFFF",
        fontFamily: "var(--font-inter), Inter, sans-serif",
      }}
    >
      {children}
    </div>
  );
}
