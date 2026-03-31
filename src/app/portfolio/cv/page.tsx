import type { Metadata } from "next";
import Link from "next/link";
import { Github, Linkedin, Mail, ExternalLink, Download } from "lucide-react";
import PortfolioNav from "../components/PortfolioNav";
import ContactCTA from "../components/ContactCTA";

export const metadata: Metadata = {
  title: "CV — Jonny Allum | AI Systems Architect",
  description:
    "Jonny Allum — AI Systems Architect, Multi-Agent Orchestration, Full-Stack Developer, Founder. CV and work history.",
};

const flagshipSystems = [
  {
    name: "Antigravity Orchestra — Jai.OS 5.0",
    tech: "Python · Supabase",
    metrics: "71 agents · 269 documented skills · 12 tiers · Supabase Shared Brain (live)",
    description:
      "Python-based multi-agent hive mind running 71 specialist agents, each with a defined SKILL.md persona, tool catalogue, and collaboration protocol. Wired into a Supabase Shared Brain — a persistent knowledge graph that accumulates context across every project. The infrastructure behind every client build.",
  },
  {
    name: "jAIlbreakO.S — JaiOS 6.0 Personal Fork",
    tech: "LangGraph · Python",
    metrics: "108 agents · 455 tests · 416 commits (1 month) · 14/14 spec compliance",
    description:
      "LangGraph-native agent system with 108 agents passing a 14/14 orchestration specification. Full pgvector hippocampus (5 memory types), RALPH self-annealing routing loop, LLM-as-judge eval gate, and a fully autonomous end-to-end meditation video pipeline.",
  },
  {
    name: "Prometheus.OS",
    tech: "TypeScript · Node.js",
    metrics: "188 commits (March 2026 alone)",
    description:
      "TypeScript-native agent infrastructure exploring alternative orchestration patterns and cross-language agent interop. Parallel OS project running alongside jAIlbreakO.S.",
  },
];

const selectedClients = [
  {
    name: "InsydeTradar",
    url: "insydetrader.com",
    tech: "TypeScript",
    summary:
      "Autonomous financial trading infrastructure. Real-time market data → AI signal generation → paper trading validation → human-approved execution.",
  },
  {
    name: "BL Motorcycles",
    url: "blmotorcyclesltd.co.uk",
    tech: "Next.js 15 · Supabase · n8n · Python",
    summary:
      "4-phase build: brand site → enterprise platform → ops automation → 3,000+ eBay listings automated.",
  },
  {
    name: "PoundTrades",
    url: "poundtrades.app",
    tech: "React Native · Expo · Supabase",
    summary:
      "Mobile marketplace for UK tradespeople to buy and sell surplus building materials. Trade-authentic UX built from genuine industry experience.",
  },
  {
    name: "Kwizz",
    url: "kwizz.co.uk",
    tech: "TypeScript · Next.js · WebSocket",
    summary: "Speed quizzing web app with live scoring and real-time WebSocket state management.",
  },
  {
    name: "Translate-R",
    url: null,
    tech: "React Native · Deepgram · GPT-4o-mini",
    summary:
      "Real-time translated subtitle overlay for live video calls. Sub-100ms end-to-end pipeline.",
  },
  {
    name: "Construct FM",
    url: null,
    tech: "TypeScript · PDF generation",
    summary:
      "Internal estimator tool. 50+ rates, 11 categories. Replaced a 4-hour quoting process with 12 minutes.",
  },
  {
    name: "SafeGuardian",
    url: null,
    tech: "Python",
    summary: "Child safety detection tool with strict human-in-the-loop review before any action.",
  },
  {
    name: "DJ Waste / CD Waste",
    url: "dj-waste.co.uk",
    tech: "TypeScript",
    summary: "Marketing and lead-capture sites. Full analytics, form routing, and CRM integration.",
  },
  {
    name: "Marzer Pro",
    url: "marzer-pro.co.uk",
    tech: "TypeScript",
    summary: "Full-service roofing contractor build. Domains, DNS, SSL, hosting, analytics managed.",
  },
  {
    name: "Sparta Coatings",
    url: "sparta-coatings.co.uk",
    tech: "TypeScript",
    summary:
      "Industrial spray-coating business site backed by operational systems and automation workflows.",
  },
];

const techSkills = [
  { category: "Languages", items: "Python · TypeScript · JavaScript · SQL" },
  {
    category: "AI & Agents",
    items: "LangGraph · LangChain · Claude API · GPT-4o · Gemini · pgvector · RAG",
  },
  {
    category: "Frontend",
    items: "Next.js 15 · React 19 · React Native · Expo · Tailwind CSS · Framer Motion",
  },
  {
    category: "Backend & DB",
    items: "Supabase · PostgreSQL · FastAPI · Node.js · n8n · REST · WebSocket",
  },
  {
    category: "Infrastructure",
    items: "Docker · Vercel · Hostinger (SSH/rsync) · GitHub Actions · GCP · Nginx",
  },
  {
    category: "Voice & Media",
    items: "ElevenLabs (PVC/TTS/SFX) · Deepgram · FFmpeg · Whisper (local GPU)",
  },
  {
    category: "Integrations",
    items: "Stripe · Meta Graph API · eBay API · Resend · Postmark · Telegram",
  },
];

const operationsHistory = [
  {
    role: "Little Jonnys Catering",
    period: "2019 – 2022",
    summary:
      "Founded and operated a mobile catering company — custom-converted van, menu development, festival and wedding circuit. Every job was a project: prep lists, logistics, margins, customer service, continuous iteration. The same discipline now applied in code.",
  },
  {
    role: "Savage Spanner — Motorcycle Repair Garage",
    period: "2018 – 2021",
    summary:
      "Founded a motorcycle repair workshop. Built a booking system from scratch unifying the website, Google Business, Facebook, and Instagram into a single live calendar. Designed branding, uniforms, and the full customer journey from first enquiry to collection.",
  },
  {
    role: "RNJ Customs / Trade Carpentry",
    period: "2016 – 2019",
    summary:
      "Carpentry and national pub refits. Standardised materials lists and method statements to control quality and speed on multi-site jobs. The operational discipline behind this work feeds directly into how I approach building repeatable systems today.",
  },
  {
    role: "Fishbourne Centre / Community First",
    period: "2014 – 2018",
    summary:
      "Community centre management — programme management, stakeholder reporting, safeguarding compliance, and team coordination. The direct root of the SafeGuardian project.",
  },
];

export default function CVPage() {
  return (
    <div className="min-h-screen" style={{ background: "#0A0A0A", color: "#fff" }}>
      <PortfolioNav />

      {/* Print-only header */}
      <div className="hidden print:block pt-8 pb-4 px-10 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-black">Jonny Allum</h1>
        <p className="text-gray-600 text-sm mt-1">
          AI Systems Architect · jonnyallum@gmail.com · jonnyai.co.uk
        </p>
      </div>

      {/* Page header */}
      <section className="pt-32 pb-12 px-6 md:px-10 max-w-5xl mx-auto print:pt-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div className="flex-1">
            <p
              className="text-[10px] uppercase tracking-[0.35em] mb-3 font-medium print:hidden"
              style={{ color: "#D97757" }}
            >
              Curriculum Vitae
            </p>
            <h1
              className="text-4xl md:text-5xl font-bold leading-none mb-1"
              style={{ fontFamily: "var(--font-instrument-serif, serif)" }}
            >
              Jonny Allum
            </h1>
            <p
              className="text-base md:text-lg font-medium mb-5"
              style={{ color: "#D97757" }}
            >
              AI Systems Architect · Multi-Agent Orchestration · Full-Stack Developer · Founder
            </p>
            <p
              className="text-sm leading-relaxed max-w-2xl"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              I design, build and operate private AI systems — not chatbots, not
              SaaS subscriptions. Real infrastructure installed inside businesses
              and wired into the way they actually work. The thing that separates
              me from most developers is the operations background: I&rsquo;ve run
              physical businesses, so when I automate something I know what the
              actual bottlenecks look like from the inside.
            </p>
          </div>

          {/* Contact + download */}
          <div className="flex flex-col gap-3 flex-shrink-0">
            <a
              href="mailto:jonnyallum@gmail.com"
              className="flex items-center gap-2 text-xs px-4 py-2.5 rounded-sm font-medium transition-opacity hover:opacity-80"
              style={{ background: "#D97757", color: "#0A0A0A" }}
            >
              <Mail className="w-3.5 h-3.5" />
              jonnyallum@gmail.com
            </a>
            <div className="flex gap-2">
              <a
                href="https://github.com/jonnyallum"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-sm transition-all duration-200 flex-1 justify-center"
                style={{
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                <Github className="w-3.5 h-3.5" />
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/jonnyallum"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-sm transition-all duration-200 flex-1 justify-center"
                style={{
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                <Linkedin className="w-3.5 h-3.5" />
                LinkedIn
              </a>
            </div>
            <p
              className="text-[10px] text-center"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              📍 Emsworth, Hampshire, UK
            </p>
          </div>
        </div>

        <div
          className="mt-10 h-px"
          style={{
            background: "linear-gradient(to right, #D97757, rgba(217,119,87,0.1), transparent)",
          }}
        />
      </section>

      {/* Main CV content */}
      <div className="max-w-5xl mx-auto px-6 md:px-10 pb-16 flex flex-col gap-16">

        {/* Flagship Systems */}
        <section>
          <h2
            className="text-xs uppercase tracking-[0.3em] mb-6 font-medium pb-3"
            style={{
              color: "#D97757",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            Flagship Systems
          </h2>
          <div className="flex flex-col gap-6">
            {flagshipSystems.map((sys) => (
              <div
                key={sys.name}
                className="p-5 rounded-sm"
                style={{
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                  <h3 className="text-base font-semibold">{sys.name}</h3>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded-sm flex-shrink-0"
                    style={{
                      background: "rgba(217,119,87,0.1)",
                      color: "#D97757",
                      border: "1px solid rgba(217,119,87,0.2)",
                    }}
                  >
                    {sys.tech}
                  </span>
                </div>
                <p
                  className="text-[11px] font-mono mb-3"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  {sys.metrics}
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  {sys.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* JonnyAI / Founder Role */}
        <section>
          <h2
            className="text-xs uppercase tracking-[0.3em] mb-6 font-medium pb-3"
            style={{
              color: "#D97757",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            Current Role
          </h2>
          <div
            className="p-5 rounded-sm"
            style={{
              border: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
              <div>
                <h3 className="text-base font-semibold">Founder & Lead Architect</h3>
                <p className="text-sm" style={{ color: "#D97757" }}>
                  JonnyAI / Jonny Allum Innovations Ltd (Aleejy AI Ltd)
                </p>
              </div>
              <span
                className="text-[10px] font-mono px-2 py-0.5 rounded-sm flex-shrink-0 h-fit"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  color: "rgba(255,255,255,0.4)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                2024 – Present · Emsworth, UK
              </span>
            </div>
            <p
              className="text-sm leading-relaxed mb-4"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              JonnyAI (jonnyai.co.uk) delivers private AI installations, web
              applications, automation packs, and AI workforce tools to UK SMEs.
              Two years in, 10+ businesses automated, and systems running 24/7.
              The business has six product lines: Private AI Install, Website/App
              Build, Automation Packs, YouTube Automation, AI Workforce, and
              Empire OS.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { value: "10+", label: "Businesses Automated" },
                { value: "34+", label: "Production Deployments" },
                { value: "954", label: "Commits, March 2026" },
              ].map((m) => (
                <div
                  key={m.label}
                  className="text-center p-3 rounded-sm"
                  style={{
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.01)",
                  }}
                >
                  <p className="text-xl font-bold" style={{ color: "#D97757" }}>
                    {m.value}
                  </p>
                  <p
                    className="text-[10px] uppercase tracking-widest mt-1"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Selected Client Work */}
        <section>
          <h2
            className="text-xs uppercase tracking-[0.3em] mb-6 font-medium pb-3"
            style={{
              color: "#D97757",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            Selected Client & Product Work
          </h2>
          <div className="flex flex-col gap-0" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
            {selectedClients.map((client, i) => (
              <div
                key={client.name}
                className="p-4 flex flex-col sm:flex-row sm:items-start gap-3"
                style={{
                  borderBottom:
                    i < selectedClients.length - 1
                      ? "1px solid rgba(255,255,255,0.05)"
                      : "none",
                }}
              >
                <div className="flex-shrink-0 w-full sm:w-44">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{client.name}</span>
                    {client.url && (
                      <a
                        href={`https://${client.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors"
                        style={{ color: "rgba(255,255,255,0.25)" }}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <p
                    className="text-[10px] font-mono mt-0.5"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    {client.tech}
                  </p>
                </div>
                <p
                  className="text-xs leading-relaxed flex-1"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  {client.summary}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Skills */}
        <section>
          <h2
            className="text-xs uppercase tracking-[0.3em] mb-6 font-medium pb-3"
            style={{
              color: "#D97757",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            Technical Skills
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {techSkills.map((skill) => (
              <div key={skill.category} className="flex gap-3">
                <p
                  className="text-[10px] uppercase tracking-widest font-medium flex-shrink-0 w-28 pt-0.5"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  {skill.category}
                </p>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  {skill.items}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* GitHub Activity */}
        <section>
          <h2
            className="text-xs uppercase tracking-[0.3em] mb-6 font-medium pb-3"
            style={{
              color: "#D97757",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            GitHub Activity
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: "1,583", label: "Contributions (12mo)" },
              { value: "54", label: "Active Repos" },
              { value: "954", label: "Commits (March 2026)" },
              { value: "416", label: "jAIlbreakO.S commits (1mo)" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center p-4 rounded-sm"
                style={{
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <p className="text-2xl font-bold tabular-nums" style={{ color: "#D97757" }}>
                  {stat.value}
                </p>
                <p
                  className="text-[10px] uppercase tracking-widest mt-1 leading-snug"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <a
              href="https://github.com/jonnyallum"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-sm transition-all duration-200"
              style={{
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              <Github className="w-3.5 h-3.5" />
              github.com/jonnyallum
            </a>
          </div>
        </section>

        {/* Operations Background */}
        <section>
          <h2
            className="text-xs uppercase tracking-[0.3em] mb-2 font-medium pb-3"
            style={{
              color: "#D97757",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            Operations Background
          </h2>
          <p
            className="text-xs leading-relaxed mb-6"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Before the development career, I ran physical businesses. That
            experience is the reason the software I build actually fits the
            problems it&rsquo;s supposed to solve.
          </p>
          <div className="flex flex-col gap-4">
            {operationsHistory.map((role) => (
              <div
                key={role.role}
                className="flex gap-4 p-4 rounded-sm"
                style={{
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.01)",
                }}
              >
                <div className="flex-shrink-0 w-36">
                  <p className="text-xs font-semibold leading-tight">{role.role}</p>
                  <p
                    className="text-[10px] font-mono mt-1"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    {role.period}
                  </p>
                </div>
                <p
                  className="text-xs leading-relaxed flex-1"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  {role.summary}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* What I'm Looking For */}
        <section
          className="p-6 rounded-sm"
          style={{
            border: "1px solid rgba(217,119,87,0.2)",
            background: "rgba(217,119,87,0.03)",
          }}
        >
          <h2
            className="text-xs uppercase tracking-[0.3em] mb-4 font-medium"
            style={{ color: "#D97757" }}
          >
            What I&rsquo;m Looking For
          </h2>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            Companies that want to move beyond toy AI integrations and into
            production-grade autonomous systems — agent orchestration, real-time
            AI pipelines, private LLM deployments, workflow automation, and the
            full-stack applications that surface all of it. I&rsquo;m most
            effective as a founding engineer, AI infrastructure lead, or
            fractional CTO: the person who takes an architecture from concept to
            production without needing a large team around them.
          </p>
        </section>

      </div>

      <ContactCTA />
    </div>
  );
}
