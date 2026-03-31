import PortfolioNav from "../components/PortfolioNav";
import CaseStudyCard from "../components/CaseStudyCard";
import ContactCTA from "../components/ContactCTA";
import { caseStudies } from "@/lib/data/case-studies";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Studies — Jonny Allum Portfolio",
  description:
    "6 in-depth case studies: jAIlbreakO.S, BL Motorcycles, Antigravity Orchestra, InsydeTradar, PoundTrades, and 10+ client builds.",
};

const categories = [
  "All",
  "Multi-Agent Orchestration",
  "E-Commerce & Operations Automation",
  "Multi-Agent AI Platform",
  "AI Trading Infrastructure",
  "Mobile Marketplace",
  "Full-Stack Web Development",
];

export default function CaseStudiesPage() {
  const featured = caseStudies.filter((cs) => cs.featured);
  const other = caseStudies.filter((cs) => !cs.featured);

  return (
    <div className="min-h-screen" style={{ background: "#0A0A0A", color: "#fff" }}>
      <PortfolioNav />

      {/* Header */}
      <section className="pt-32 pb-16 px-6 md:px-10 max-w-6xl mx-auto">
        <p
          className="text-[10px] uppercase tracking-[0.35em] mb-4 font-medium"
          style={{ color: "#D97757" }}
        >
          Case Studies
        </p>
        <h1
          className="text-3xl md:text-5xl font-bold leading-tight mb-6"
          style={{ fontFamily: "var(--font-instrument-serif, serif)" }}
        >
          The Work
        </h1>
        <p
          className="text-base md:text-lg max-w-2xl leading-relaxed"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          Six in-depth case studies across multi-agent systems, e-commerce
          automation, AI trading infrastructure, and full-stack applications.
          Every project documented from problem through architecture to result.
        </p>
        <div
          className="mt-10 h-px w-32"
          style={{ background: "#D97757" }}
        />
      </section>

      {/* Featured */}
      <section className="px-6 md:px-10 pb-16 max-w-6xl mx-auto">
        <p
          className="text-[10px] uppercase tracking-[0.35em] mb-8 font-medium"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          Featured Projects
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featured.map((study) => (
            <CaseStudyCard key={study.slug} study={study} variant="featured" />
          ))}
        </div>
      </section>

      {/* Other */}
      {other.length > 0 && (
        <section
          className="px-6 md:px-10 py-16 max-w-6xl mx-auto"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p
            className="text-[10px] uppercase tracking-[0.35em] mb-8 font-medium"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            More Work
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {other.map((study) => (
              <CaseStudyCard key={study.slug} study={study} />
            ))}
          </div>
        </section>
      )}

      <ContactCTA />
    </div>
  );
}
