import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import ScreenshotFrame from "@/components/ScreenshotFrame";
import MetricBadge from "../../components/MetricBadge";
import ContactCTA from "../../components/ContactCTA";
import { caseStudies, getCaseStudyBySlug, caseStudyLiveUrls } from "@/lib/data/case-studies";

interface Props {
  params: Promise<{ slug: string }>;
}

// Render inline **bold** markup as real <strong> elements.
function renderInline(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} style={{ color: "rgba(255,255,255,0.92)", fontWeight: 700 }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

// Lightweight renderer for case-study section content: paragraphs and
// "- " bullet lists, with inline **bold** — so no literal markdown shows.
function CaseStudyContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let bullets: string[] = [];
  let key = 0;

  const flushBullets = () => {
    if (bullets.length === 0) return;
    blocks.push(
      <ul key={`ul-${key++}`} className="flex flex-col gap-2 my-2 pl-1">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-3 leading-[1.7]">
            <span className="mt-2.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#D97757" }} />
            <span>{renderInline(b)}</span>
          </li>
        ))}
      </ul>
    );
    bullets = [];
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith("- ")) {
      bullets.push(line.slice(2));
      continue;
    }
    flushBullets();
    if (line === "") continue;
    blocks.push(
      <p key={`p-${key++}`} className="leading-[1.8]">
        {renderInline(line)}
      </p>
    );
  }
  flushBullets();

  return <div className="flex flex-col gap-4">{blocks}</div>;
}

export async function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  if (!study) return {};
  const url = `https://jonnyai.co.uk/portfolio/case-studies/${study.slug}`;
  const image = study.screenshots?.[0] ?? "/brand/og_card.png";
  return {
    title: `${study.title} — JonnyAI Case Study`,
    description: study.hook,
    alternates: { canonical: url },
    openGraph: {
      title: `${study.title} — JonnyAI Case Study`,
      description: study.hook,
      url,
      siteName: "JonnyAI",
      type: "article",
      images: [{ url: image, alt: study.title }],
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  if (!study) notFound();

  const currentIndex = caseStudies.findIndex((cs) => cs.slug === slug);
  const prevStudy = currentIndex > 0 ? caseStudies[currentIndex - 1] : null;
  const nextStudy =
    currentIndex < caseStudies.length - 1 ? caseStudies[currentIndex + 1] : null;

  const hasHeroScreenshot = study.screenshots && study.screenshots.length > 0;
  const liveUrl = caseStudyLiveUrls[study.slug];

  return (
    <div className="min-h-screen" style={{ background: "transparent", color: "#fff" }}>
      {/* ─── HERO ─── */}
      <section className="pt-32 pb-0">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          {/* Breadcrumb */}
          <Link
            href="/portfolio/case-studies"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest mb-10 transition-colors duration-200 hover:text-white"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            <ArrowLeft className="w-3 h-3" />
            All Case Studies
          </Link>

          {/* Category + Title */}
          <div className="mb-6">
            <span
              className="inline-block text-[10px] uppercase tracking-[0.3em] mb-4 font-semibold"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              {study.category}
            </span>
            <h1
              className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-3"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              {study.title}
            </h1>
            {study.subtitle && (
              <p
                className="text-lg md:text-xl"
                style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Outfit', sans-serif" }}
              >
                {study.subtitle}
              </p>
            )}
          </div>

          <p
            className="text-base md:text-lg leading-relaxed max-w-3xl mb-12"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            {study.hook}
          </p>

          {/* Metrics row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-12">
            {study.metrics.map((m) => (
              <MetricBadge key={m.label} value={m.value} label={m.label} size="sm" />
            ))}
          </div>
        </div>

        {/* Hero image — staged in a glass frame */}
        {hasHeroScreenshot && (
          <div className="max-w-5xl mx-auto px-6 md:px-10 mt-2">
            <ScreenshotFrame
              src={study.screenshots[0]}
              alt={study.title}
              label={liveUrl ? liveUrl.replace(/^https?:\/\/(www\.)?/, "") : study.title}
              aspect="16 / 9"
              priority
              sizes="(max-width: 1024px) 100vw, 1000px"
            />
          </div>
        )}
      </section>

      {/* ─── CONTENT ─── */}
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-16">

          {/* Main content */}
          <main className="flex flex-col gap-14">
            {study.sections.map((section) => (
              <article
                key={section.id}
                id={section.id}
                className="scroll-mt-24"
              >
                <h2
                  className="text-xl md:text-2xl font-bold mb-5 pb-4"
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  {section.title}
                </h2>
                <div
                  className="text-sm md:text-base"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                >
                  <CaseStudyContent content={section.content} />
                </div>
              </article>
            ))}
          </main>

          {/* Sidebar */}
          <aside className="flex flex-col gap-8">
            <div
              className="p-6 rounded-xl sticky top-24"
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <p
                className="text-[10px] uppercase tracking-[0.3em] mb-4 font-semibold"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {study.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-[11px] px-2.5 py-1 rounded-full"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      color: "rgba(255,255,255,0.6)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Jump links */}
              <div className="mt-6 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <p
                  className="text-[10px] uppercase tracking-[0.3em] mb-3 font-semibold"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  Sections
                </p>
                <div className="flex flex-col gap-1">
                  {study.sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="text-xs py-1.5 transition-colors duration-200 hover:text-white leading-snug"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      {section.title}
                    </a>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="mt-6 pt-6 flex flex-col gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                {liveUrl && (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full text-xs font-semibold transition-all duration-200"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(217,119,87,0.4)", color: "#D97757" }}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Visit the live site
                  </a>
                )}
                <Link
                  href="/brief"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-200"
                  style={{ background: "#D97757", color: "#070708" }}
                >
                  Discuss a project →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ─── SCREENSHOTS GALLERY ─── */}
      {study.screenshots && study.screenshots.length > 1 && (
        <section
          className="py-20 px-6 md:px-10 max-w-5xl mx-auto"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p
            className="text-xs uppercase tracking-[0.3em] mb-10 font-semibold"
            style={{ color: "#D97757", fontFamily: "monospace" }}
          >
            Screenshots
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {study.screenshots.slice(1).map((src, i) => (
              <ScreenshotFrame
                key={i}
                src={src}
                alt={`${study.title} screenshot ${i + 2}`}
                label=""
                aspect="16 / 10"
                glow={false}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ))}
          </div>
        </section>
      )}

      {/* ─── PREV / NEXT ─── */}
      <section
        className="py-14 px-6 md:px-10 max-w-5xl mx-auto"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center justify-between gap-6">
          {prevStudy ? (
            <Link
              href={`/portfolio/case-studies/${prevStudy.slug}`}
              className="flex items-center gap-3 group flex-1"
            >
              <ArrowLeft
                className="w-4 h-4 flex-shrink-0 transition-transform group-hover:-translate-x-1"
                style={{ color: "rgba(255,255,255,0.5)" }}
              />
              <div>
                <p
                  className="text-[10px] uppercase tracking-widest mb-1"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  Previous
                </p>
                <p className="text-sm font-medium group-hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.65)" }}>
                  {prevStudy.title}
                </p>
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {nextStudy ? (
            <Link
              href={`/portfolio/case-studies/${nextStudy.slug}`}
              className="flex items-center gap-3 group flex-1 justify-end text-right"
            >
              <div>
                <p
                  className="text-[10px] uppercase tracking-widest mb-1"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  Next
                </p>
                <p className="text-sm font-medium group-hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.65)" }}>
                  {nextStudy.title}
                </p>
              </div>
              <ArrowRight
                className="w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-1"
                style={{ color: "rgba(255,255,255,0.5)" }}
              />
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      </section>

      <ContactCTA />
    </div>
  );
}
