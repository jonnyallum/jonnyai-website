import Link from "next/link";
import Image from "next/image";
import type { CaseStudy } from "@/lib/data/case-studies";

interface CaseStudyCardProps {
  study: CaseStudy;
  variant?: "default" | "featured";
}

export default function CaseStudyCard({
  study,
  variant = "default",
}: CaseStudyCardProps) {
  const isFeatured = variant === "featured";

  return (
    <Link href={`/portfolio/case-studies/${study.slug}`} className="block group">
      <article
        className="rounded-sm overflow-hidden transition-all duration-300 h-full flex flex-col border border-white/10 bg-white/[0.02] hover:border-[#D97757] hover:bg-[rgba(217,119,87,0.03)]"
      >
        {/* Hero image */}
        <div
          className={`relative overflow-hidden ${isFeatured ? "h-56 md:h-64" : "h-44"}`}
          style={{ background: "#111" }}
        >
          <Image
            src={study.heroImage}
            alt={study.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Category pill */}
          <div className="absolute top-4 left-4">
            <span
              className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-sm font-medium"
              style={{
                background: "rgba(10,10,10,0.85)",
                color: "#D97757",
                border: "1px solid rgba(217,119,87,0.3)",
              }}
            >
              {study.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-3 flex-1">
          <div>
            <h3
              className={`font-semibold leading-tight mb-1 ${isFeatured ? "text-xl" : "text-base"}`}
            >
              {study.title}
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              {study.hook}
            </p>
          </div>

          {/* Key metrics */}
          <div className="flex flex-wrap gap-2 mt-auto pt-3">
            {study.metrics.slice(0, 3).map((m) => (
              <div
                key={m.label}
                className="text-[11px] px-2 py-1 rounded-sm"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <span style={{ color: "#D97757" }} className="font-semibold">
                  {m.value}
                </span>{" "}
                {m.label}
              </div>
            ))}
          </div>

          {/* Arrow CTA */}
          <div
            className="flex items-center gap-1 text-xs font-medium mt-1 transition-colors duration-200"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            <span className="group-hover:text-[#D97757] transition-colors duration-200">
              Read Case Study
            </span>
            <span className="group-hover:translate-x-1 transition-transform duration-200 group-hover:text-[#D97757]">
              →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
