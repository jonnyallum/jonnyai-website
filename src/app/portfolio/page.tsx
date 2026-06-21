import Link from "next/link";
import { ArrowRight, Github } from "lucide-react";
import CaseStudyCard from "./components/CaseStudyCard";
import ContactCTA from "./components/ContactCTA";
import { getFeaturedCaseStudies } from "@/lib/data/case-studies";

const credibilityStats = [
  { value: "954", label: "Commits, March 2026" },
  { value: "108", label: "Production Agents" },
  { value: "21", label: "Case Studies" },
  { value: "54", label: "Active Repos" },
  { value: "1,583", label: "Contributions (12mo)" },
];

const techGroups = [
  {
    label: "AI & Agents",
    items: ["Python", "LangGraph", "LangChain", "Claude API", "GPT-4o", "Gemini"],
  },
  {
    label: "Frontend",
    items: ["Next.js 15", "React 19", "TypeScript", "React Native", "Tailwind CSS"],
  },
  {
    label: "Backend & DB",
    items: ["Supabase", "PostgreSQL", "pgvector", "FastAPI", "Node.js", "n8n"],
  },
  {
    label: "Infrastructure",
    items: ["Docker", "Vercel", "Hostinger", "GitHub Actions", "GCP"],
  },
  {
    label: "Voice & Media",
    items: ["ElevenLabs", "Deepgram", "FFmpeg", "Whisper"],
  },
  {
    label: "Integrations",
    items: ["Stripe", "Meta Graph API", "eBay API", "Resend", "Telegram"],
  },
];

export default function PortfolioPage() {
  const featured = getFeaturedCaseStudies();

  return (
    <div className="min-h-screen" style={{ background: "transparent", color: "#fff" }}>
      {/* ─── HERO ─── */}
      <section className="pt-36 pb-24 px-6 md:px-10 max-w-5xl mx-auto text-center">
        <p
          className="text-xs uppercase tracking-[0.3em] mb-6 font-semibold"
          style={{ color: "#D97757", fontFamily: "monospace" }}
        >
          The Work &middot; 21 Case Studies &middot; Built by one person
        </p>
        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.04] mb-8 mx-auto max-w-4xl tracking-tight"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          Real sites. Real products.<br />
          <span style={{ color: "#D97757" }}>Built by one person.</span>
        </h1>
        <p
          className="text-lg md:text-xl leading-relaxed mb-12 max-w-2xl mx-auto"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          Branding and websites for local businesses, e-commerce automation, mobile
          apps and a live SaaS line — built by an operator who&rsquo;s run the
          businesses the software is meant to fix.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/portfolio/case-studies"
            className="btn-citrus py-3.5 px-8 text-sm"
          >
            View Case Studies
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <Link
            href="/brief"
            className="btn-ghost py-3.5 px-8 text-sm"
          >
            Start a Project
          </Link>
        </div>
      </section>

      {/* ─── CREDIBILITY BAR ─── */}
      <section
        className="py-12 px-6 md:px-10"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
          {credibilityStats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center text-center"
            >
              <span className="text-3xl md:text-4xl font-bold tabular-nums text-white">
                {stat.value}
              </span>
              <span
                className="text-[10px] uppercase tracking-widest mt-1"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── THE DIFFERENCE (Personal Narrative) ─── */}
      <section className="py-24 px-6 md:px-10" style={{ background: "rgba(217,119,87,0.03)", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <p
            className="text-xs uppercase tracking-[0.3em] mb-8 font-semibold"
            style={{ color: "#D97757", fontFamily: "monospace" }}
          >
            Founder. Builder. Operator.
          </p>
          <blockquote
            className="text-xl md:text-3xl leading-relaxed font-bold mb-8"
            style={{ fontFamily: "'Outfit', sans-serif", color: "#fff" }}
          >
            &ldquo;I&rsquo;ve done quotes, payroll, stock management, compliance,
            sales, and customer service in real businesses. So when I build
            something, I know what the actual bottlenecks look like from the
            inside.&rdquo;
          </blockquote>
          <p
            className="text-sm md:text-base leading-relaxed max-w-xl mx-auto"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Before the development career: a mobile catering company, a motorcycle
            repair workshop, national pub refits and trade carpentry, and community
            centre operations. The same discipline applied in every physical
            business is what makes the software actually fit the problem.
          </p>
        </div>
      </section>

      {/* ─── FEATURED CASE STUDIES ─── */}
      <section className="py-24 px-6 md:px-10 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-14">
          <h2
            className="text-2xl md:text-3xl font-bold"
            style={{ fontFamily: "var(--font-instrument-serif, serif)" }}
          >
            Selected Work
          </h2>
          <Link
            href="/portfolio/case-studies"
            className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold transition-colors duration-200 hover:text-white"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            All 21 Case Studies <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {featured.slice(0, 4).map((study) => (
            <CaseStudyCard key={study.slug} study={study} variant="featured" />
          ))}
        </div>
      </section>

      {/* ─── TECH STACK ─── */}
      <section
        className="py-24 px-6 md:px-10"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-bold mb-14"
            style={{ fontFamily: "var(--font-instrument-serif, serif)" }}
          >
            Technology
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {techGroups.map((group) => (
              <div key={group.label}>
                <p
                  className="text-xs uppercase tracking-widest mb-4 font-semibold"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="text-xs px-3 py-1.5 rounded-full"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        color: "rgba(255,255,255,0.6)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* GitHub CTA */}
          <div
            className="mt-16 p-8 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}
          >
            <div>
              <p className="text-base font-semibold mb-1">See it in production</p>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                54 active repositories. 1,583 contributions in the last 12 months.
              </p>
            </div>
            <a
              href="https://github.com/jonnyallum"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm px-6 py-2.5 rounded-full transition-all duration-200 whitespace-nowrap flex-shrink-0 hover:bg-white/5"
              style={{
                border: "1px solid rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              <Github className="w-4 h-4" />
              github.com/jonnyallum
            </a>
          </div>
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <ContactCTA />
    </div>
  );
}
