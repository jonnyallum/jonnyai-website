import Link from "next/link";
import Image from "next/image";
import type { CaseStudy } from "@/lib/data/case-studies";

interface CaseStudyCardProps {
  study: CaseStudy;
  variant?: "default" | "featured";
}

// Gradient fallbacks for projects without screenshots
const gradients: Record<string, string> = {
  "jailbreak-os": "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
  "bl-motorcycles": "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)",
  "antigravity-orchestra": "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #2d1b4e 100%)",
  "insydetradar": "linear-gradient(135deg, #0d1117 0%, #161b22 50%, #21262d 100%)",
  "jonnyai-website": "linear-gradient(135deg, #070708 0%, #1a1510 50%, #070708 100%)",
  default: "linear-gradient(135deg, #111 0%, #1a1a1a 50%, #111 100%)",
};

export default function CaseStudyCard({
  study,
  variant = "default",
}: CaseStudyCardProps) {
  const isFeatured = variant === "featured";
  const hasScreenshots = study.screenshots && study.screenshots.length > 0;
  const gradient = gradients[study.slug] || gradients.default;

  return (
    <Link href={`/portfolio/case-studies/${study.slug}`} className="block group">
      <article className="h-full flex flex-col">
        {/* Image area */}
        <div
          className={`relative overflow-hidden ${isFeatured ? "h-56 md:h-72" : "h-48"}`}
          style={{ background: gradient }}
        >
          {hasScreenshots && (
            <Image
              src={study.screenshots[0]}
              alt={study.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          {!hasScreenshots && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="text-2xl md:text-3xl font-bold opacity-10"
                style={{ fontFamily: "var(--font-instrument-serif, serif)" }}
              >
                {study.title}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="pt-5 pb-2 flex flex-col gap-2 flex-1">
          {/* Category + Title */}
          <div className="flex items-center gap-3 mb-1">
            <span
              className="text-[10px] uppercase tracking-widest font-medium"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              {study.category}
            </span>
          </div>
          <h3
            className={`font-bold leading-tight ${isFeatured ? "text-xl md:text-2xl" : "text-lg"}`}
          >
            {study.title}
          </h3>
          <p
            className="text-sm leading-relaxed line-clamp-2"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            {study.hook}
          </p>

          {/* CTA */}
          <div
            className="flex items-center gap-1 text-xs font-semibold mt-auto pt-3 transition-colors duration-200"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            <span className="group-hover:text-white transition-colors duration-200">
              Read Case Study
            </span>
            <span className="group-hover:translate-x-1 transition-transform duration-200 group-hover:text-white">
              →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
