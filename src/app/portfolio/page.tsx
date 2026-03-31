import Link from "next/link";
import { ArrowRight, Github, Code2, Cpu, Layers } from "lucide-react";
import PortfolioNav from "./components/PortfolioNav";
import CaseStudyCard from "./components/CaseStudyCard";
import MetricBadge from "./components/MetricBadge";
import ContactCTA from "./components/ContactCTA";
import { caseStudies, getFeaturedCaseStudies } from "@/lib/data/case-studies";

const credibilityStats = [
  { value: "954", label: "Commits, March 2026" },
  { value: "71", label: "Production Agents" },
  { value: "10+", label: "Businesses Automated" },
  { value: "54", label: "Active Repos" },
  { value: "1,583", label: "Contributions (12mo)" },
];

const whatIBuild = [
  {
    icon: Cpu,
    title: "Multi-Agent Systems",
    description:
      "Networks of specialised AI agents that collaborate, hand off context, share memory, and self-correct. Not chatbots. Infrastructure. 108-agent systems with persistent vector memory and self-annealing routing loops.",
  },
  {
    icon: Layers,
    title: "Autonomous Pipelines",
    description:
      "End-to-end workflows that run without human intervention — from data ingestion to content production to deployment. Script to YouTube in one command. Stock sync to marketplace listing without manual entry.",
  },
  {
    icon: Code2,
    title: "Full-Stack Applications",
    description:
      "The web apps, dashboards, and interfaces that surface AI capability to real users. Next.js, React Native, Supabase. Built for production, not demos. 34+ deployments running 24/7.",
  },
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
    <div className="min-h-screen" style={{ background: "#0A0A0A", color: "#fff" }}>
      <PortfolioNav />

      {/* ─── HERO ─── */}
      <section className="pt-32 pb-20 px-6 md:px-10 max-w-6xl mx-auto">
        <div className="max-w-4xl">
          <p
            className="text-xs uppercase tracking-[0.3em] mb-6 font-medium"
            style={{ color: "#D97757" }}
          >
            AI Systems Architect · Full-Stack Developer · Founder
          </p>
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-8"
            style={{ fontFamily: "var(--font-instrument-serif, serif)" }}
          >
            I build the AI infrastructure that makes businesses{" "}
            <em className="not-italic" style={{ color: "#D97757" }}>
              actually work
            </em>
            .
          </h1>
          <p
            className="text-lg md:text-xl leading-relaxed mb-10 max-w-2xl"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            Multi-agent orchestration. Autonomous pipelines. Production systems.
            10+ businesses transformed. Built by an operator who&#39;s run the
            businesses the software is meant to fix.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/portfolio/case-studies"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-sm font-medium text-sm transition-opacity duration-200 hover:opacity-80"
              style={{ background: "#D97757", color: "#0A0A0A" }}
            >
              View Case Studies
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/portfolio/cv"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-sm font-medium text-sm transition-all duration-200"
              style={{
                border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              Download CV
            </Link>
          </div>
        </div>

        {/* Accent line */}
        <div
          className="mt-16 h-px w-full max-w-4xl"
          style={{
            background:
              "linear-gradient(to right, #D97757, rgba(217,119,87,0.2), transparent)",
          }}
        />
      </section>

      {/* ─── CREDIBILITY BAR ─── */}
      <section
        className="py-10 px-6 md:px-10"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-px" style={{ background: "rgba(255,255,255,0.04)" }}>
          {credibilityStats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center py-6 px-4 text-center"
              style={{ background: "#0A0A0A" }}
            >
              <span
                className="text-2xl md:text-3xl font-bold tabular-nums"
                style={{ color: "#D97757" }}
              >
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

      {/* ─── WHAT I BUILD ─── */}
      <section className="py-20 px-6 md:px-10 max-w-6xl mx-auto">
        <p
          className="text-[10px] uppercase tracking-[0.35em] mb-12 font-medium"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          What I Build
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: "rgba(255,255,255,0.06)" }}>
          {whatIBuild.map((item) => (
            <div
              key={item.title}
              className="p-8 flex flex-col gap-4"
              style={{ background: "#0A0A0A" }}
            >
              <div
                className="w-10 h-10 rounded-sm flex items-center justify-center"
                style={{ background: "rgba(217,119,87,0.1)", border: "1px solid rgba(217,119,87,0.2)" }}
              >
                <item.icon className="w-5 h-5" style={{ color: "#D97757" }} />
              </div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURED CASE STUDIES ─── */}
      <section className="py-20 px-6 md:px-10 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <p
            className="text-[10px] uppercase tracking-[0.35em] font-medium"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Featured Work
          </p>
          <Link
            href="/portfolio/case-studies"
            className="flex items-center gap-1 text-xs uppercase tracking-widest transition-colors duration-200 hover:text-white"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            All Case Studies <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featured.slice(0, 4).map((study) => (
            <CaseStudyCard key={study.slug} study={study} variant="featured" />
          ))}
        </div>
      </section>

      {/* ─── THE DIFFERENCE ─── */}
      <section
        className="py-20 px-6 md:px-10"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.01)",
        }}
      >
        <div className="max-w-3xl mx-auto">
          <p
            className="text-[10px] uppercase tracking-[0.35em] mb-8 font-medium"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            The Difference
          </p>
          <blockquote
            className="text-xl md:text-2xl leading-relaxed font-medium mb-8"
            style={{
              fontFamily: "var(--font-instrument-serif, serif)",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            &ldquo;I&rsquo;ve done quotes, payroll, stock management, compliance, sales,
            and customer service in real businesses. So when I automate
            something, I know what the actual bottlenecks look like from the
            inside. That means the systems I build get used — because
            they&rsquo;re built around how teams genuinely work, not how a
            product manager imagines they might.&rdquo;
          </blockquote>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Before the development career: a mobile catering company (Little
            Jonnys), a motorcycle repair workshop (Savage Spanner), national
            pub refits and trade carpentry (RNJ Customs), and community centre
            operations. The same discipline applied in every physical business
            is what makes the software actually fit the problem.
          </p>
        </div>
      </section>

      {/* ─── TECH STACK ─── */}
      <section className="py-20 px-6 md:px-10 max-w-6xl mx-auto">
        <p
          className="text-[10px] uppercase tracking-[0.35em] mb-12 font-medium"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          Technology
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {techGroups.map((group) => (
            <div key={group.label}>
              <p
                className="text-[10px] uppercase tracking-widest mb-3 font-medium"
                style={{ color: "#D97757" }}
              >
                {group.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="text-xs px-2.5 py-1 rounded-sm"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      color: "rgba(255,255,255,0.55)",
                      border: "1px solid rgba(255,255,255,0.07)",
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
          className="mt-16 p-6 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
        >
          <div>
            <p className="text-sm font-medium mb-1">See it in production</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              54 active repositories. 1,583 contributions in the last 12 months.
              The commits don&#39;t lie.
            </p>
          </div>
          <a
            href="https://github.com/jonnyallum"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs px-4 py-2 rounded-sm transition-all duration-200 whitespace-nowrap flex-shrink-0"
            style={{
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            <Github className="w-4 h-4" />
            github.com/jonnyallum
          </a>
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <ContactCTA />
    </div>
  );
}
