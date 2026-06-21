import CaseStudyCard from "../components/CaseStudyCard";
import ContactCTA from "../components/ContactCTA";
import { caseStudies } from "@/lib/data/case-studies";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Studies — Jonny Allum Portfolio",
  description:
    "21 in-depth case studies: multi-agent orchestration, e-commerce automation, AI trading, mobile apps, web development, AI security, and multi-tenant SaaS platforms.",
};

export default function CaseStudiesPage() {
  const featured = caseStudies.filter((cs) => cs.featured);
  const other = caseStudies.filter((cs) => !cs.featured);

  return (
    <div className="min-h-screen" style={{ background: "transparent", color: "#fff" }}>
      {/* Header */}
      <section className="pt-36 pb-16 px-6 md:px-10 max-w-5xl mx-auto text-center">
        <p
          className="text-xs uppercase tracking-[0.3em] mb-4 font-semibold"
          style={{ color: "#D97757", fontFamily: "monospace" }}
        >
          21 Case Studies
        </p>
        <h1
          className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 tracking-tight"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          The Work
        </h1>
        <p
          className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          Multi-agent systems, e-commerce automation, AI security, trading
          infrastructure, and full-stack applications. Every project documented
          from problem through architecture to result.
        </p>
      </section>

      {/* Featured */}
      <section className="px-6 md:px-10 pb-20 max-w-5xl mx-auto">
        <p
          className="text-xs uppercase tracking-[0.3em] mb-10 font-semibold"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          Featured Projects
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {featured.map((study) => (
            <CaseStudyCard key={study.slug} study={study} variant="featured" />
          ))}
        </div>
      </section>

      {/* Other */}
      {other.length > 0 && (
        <section
          className="px-6 md:px-10 py-20 max-w-5xl mx-auto"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p
            className="text-xs uppercase tracking-[0.3em] mb-10 font-semibold"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            More Work
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
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
