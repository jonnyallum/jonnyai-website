import type { Metadata } from "next";
import { Github, Linkedin, Mail, Phone } from "lucide-react";
import PortfolioNav from "../components/PortfolioNav";
import ContactCTA from "../components/ContactCTA";

export const metadata: Metadata = {
  title: "CV — Jonny Allum | AI Systems Architect & Full Stack Engineer",
  description:
    "Jonathan Allum — AI systems architect and full stack engineer specialising in autonomous multi-agent systems, workflow automation and business operating systems.",
};

const coreExpertise = [
  "AI systems architecture",
  "Multi-agent orchestration",
  "Workflow automation",
  "Full stack development",
  "Business operating systems",
  "Rapid product deployment",
  "Operational turnaround",
  "Revenue growth strategy",
  "RAG and knowledge systems",
  "Technical leadership",
  "Community and stakeholder management",
  "Event and hospitality operations",
];

const techStack = [
  "Python, TypeScript, JavaScript, SQL, Bash",
  "LangGraph, FastAPI, Next.js, React",
  "Supabase, PostgreSQL, vector databases",
  "Docker, GCP, Render, Hostinger",
  "OpenAI API, Claude API, RAG pipelines",
  "N8N, automation orchestration",
];

const experience = [
  {
    role: "Founder and AI Systems Architect",
    company: "JonnyAI",
    period: "",
    contributions: [
      "Built multi-agent orchestration platforms",
      "Delivered production AI systems for business automation",
      "Designed full stack web and data products",
      "Implemented RAG based knowledge systems",
      "Developed operational dashboards and internal tooling",
      "Automated complex workflows and business processes",
      "Delivered rapid build cycles from concept to deployment",
    ],
  },
  {
    role: "Centre Manager",
    company: "Fishbourne Centre",
    period: "",
    contributions: [
      "Delivered best day, week, month and year financially in centre history",
      "Cleared historic £18,000 liability with Fishbourne Playing Field Association",
      "Designed and launched full service in house wedding packages from £3,000",
      "Delivered complete wedding offering including catering and coordination",
      "Personally acted as chef for all wedding events",
      "Designed wedding brochures and promotional materials",
      "Organised and hosted wedding fayres generating bookings",
      "Achieved exceptional customer feedback for catering and events",
      "Expanded access to affordable weddings within local community",
      "Developed new catering and event revenue streams",
      "Managed staffing, operations and venue delivery",
    ],
  },
  {
    role: "Centre Manager",
    company: "Community First, Leigh Park Community Centre",
    period: "",
    contributions: [
      "Managed day to day centre operations",
      "Oversaw staff, volunteers and facility usage",
      "Supported budgeting and financial oversight",
      "Improved service coordination and operational workflows",
      "Maintained compliance and safety standards",
      "Coordinated community events and bookings",
      "Strengthened stakeholder engagement",
    ],
  },
  {
    role: "Founder",
    company: "Little Jonny's Catering",
    period: "",
    contributions: [
      "Built and ran catering business delivering event services and food operations",
    ],
  },
  {
    role: "Founder",
    company: "RNJ Customs",
    period: "",
    contributions: [
      "Automotive customisation and engineering venture managing workshop operations and client delivery",
    ],
  },
  {
    role: "Founder",
    company: "Savage Spanner Garage",
    period: "",
    contributions: [
      "Motorcycle and mechanical services business providing technical and engineering work",
    ],
  },
  {
    role: "Technical Engineer",
    company: "Sky, BT and Virgin Media",
    period: "",
    contributions: [
      "Telecommunications engineering roles covering installation, fault diagnosis and customer support",
    ],
  },
];

const selectedImpact = [
  "Built AI systems and automation platforms for real business use",
  "Delivered operational turnaround at Fishbourne Centre",
  "Cleared £18,000 historic liability",
  "Created affordable wedding packages expanding community access",
  "Designed and delivered full service catering operations",
  "Founded and ran multiple ventures across technology and services",
];

export default function CVPage() {
  return (
    <div className="min-h-screen" style={{ background: "#000", color: "#fff" }}>
      <PortfolioNav />

      {/* Print-only header */}
      <div className="hidden print:block pt-8 pb-4 px-10 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-black">Jonathan Allum</h1>
        <p className="text-gray-600 text-sm mt-1">
          AI Systems Architect & Full Stack Engineer | jonnyallum@gmail.com | 07723 959178 | jonnyai.co.uk
        </p>
      </div>

      {/* Page header */}
      <section className="pt-32 pb-12 px-6 md:px-10 max-w-4xl mx-auto print:pt-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div className="flex-1">
            <p
              className="text-[10px] uppercase tracking-[0.35em] mb-3 font-medium print:hidden"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Curriculum Vitae
            </p>
            <h1
              className="text-4xl md:text-5xl font-bold leading-none mb-1"
              style={{ fontFamily: "var(--font-instrument-serif, serif)" }}
            >
              Jonathan Allum
            </h1>
            <p
              className="text-base md:text-lg font-medium mb-6"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              AI Systems Architect & Full Stack Engineer
            </p>
            <p
              className="text-sm leading-relaxed max-w-2xl"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              Emsworth, Hampshire &middot;{" "}
              <a href="https://jonnyai.co.uk" className="underline hover:text-white transition-colors">
                jonnyai.co.uk
              </a>{" "}
              &middot;{" "}
              <a href="https://github.com/jonnyallum" className="underline hover:text-white transition-colors">
                GitHub
              </a>
            </p>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3 flex-shrink-0">
            <a
              href="mailto:jonnyallum@gmail.com"
              className="flex items-center gap-2 text-xs px-5 py-2.5 rounded-full font-medium transition-opacity hover:opacity-80"
              style={{ background: "#fff", color: "#000" }}
            >
              <Mail className="w-3.5 h-3.5" />
              jonnyallum@gmail.com
            </a>
            <a
              href="tel:07723959178"
              className="flex items-center gap-2 text-xs px-5 py-2.5 rounded-full font-medium transition-opacity hover:opacity-80"
              style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <Phone className="w-3.5 h-3.5" />
              07723 959178
            </a>
            <div className="flex gap-2">
              <a
                href="https://github.com/jonnyallum"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full transition-all duration-200 flex-1 justify-center"
                style={{
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                <Github className="w-3.5 h-3.5" />
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/jonny-allum-12a757140/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full transition-all duration-200 flex-1 justify-center"
                style={{
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                <Linkedin className="w-3.5 h-3.5" />
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div
          className="mt-10 h-px"
          style={{
            background: "linear-gradient(to right, rgba(255,255,255,0.2), rgba(255,255,255,0.05), transparent)",
          }}
        />
      </section>

      {/* Main CV content */}
      <div className="max-w-4xl mx-auto px-6 md:px-10 pb-16 flex flex-col gap-16">

        {/* Professional Profile */}
        <section>
          <SectionHeading>Professional Profile</SectionHeading>
          <div className="flex flex-col gap-4">
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
              AI systems architect and full stack engineer specialising in autonomous multi-agent systems, workflow automation and business operating systems. Founder of JonnyAI, designing and deploying production AI infrastructure, automation platforms and digital products across commercial and operational environments.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
              Combines technical architecture with commercial execution. Proven track record in operational turnaround, revenue generation, community leadership and building scalable systems that improve real world performance. Equally comfortable delivering hands-on engineering work or leading strategic transformation.
            </p>
          </div>
        </section>

        {/* Core Expertise */}
        <section>
          <SectionHeading>Core Expertise</SectionHeading>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {coreExpertise.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-sm px-3 py-2 rounded-lg"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                <span className="text-white/20 flex-shrink-0">&bull;</span>
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* Technical Stack */}
        <section>
          <SectionHeading>Technical Stack</SectionHeading>
          <div className="flex flex-col gap-2">
            {techStack.map((line, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-sm px-4 py-2.5 rounded-lg font-mono"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                {line}
              </div>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section>
          <SectionHeading>Professional Experience</SectionHeading>
          <div className="flex flex-col gap-10">
            {experience.map((job) => (
              <div key={job.company + job.role}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-3">
                  <div>
                    <h3 className="text-base font-semibold">{job.role}</h3>
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                      {job.company}
                    </p>
                  </div>
                  {job.period && (
                    <span
                      className="text-[11px] font-mono px-3 py-1 rounded-full flex-shrink-0 h-fit mt-1"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        color: "rgba(255,255,255,0.4)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      {job.period}
                    </span>
                  )}
                </div>
                <ul className="flex flex-col gap-2">
                  {job.contributions.map((item, i) => (
                    <li
                      key={i}
                      className="text-sm leading-relaxed flex gap-3"
                      style={{ color: "rgba(255,255,255,0.55)" }}
                    >
                      <span className="text-white/20 flex-shrink-0 mt-0.5">&bull;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Selected Impact */}
        <section>
          <SectionHeading>Selected Impact</SectionHeading>
          <ul className="flex flex-col gap-3">
            {selectedImpact.map((item, i) => (
              <li
                key={i}
                className="text-sm leading-relaxed flex gap-3"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                <span className="text-white/20 flex-shrink-0 mt-0.5">&bull;</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Motorsport and Personal Interests */}
        <section>
          <SectionHeading>Motorsport and Personal Interests</SectionHeading>
          <div className="flex flex-col gap-4">
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              Competitive motorcycle and sidecar racer with experience across BEMSEE, NG Road Racing and British Superbike support classes.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              Career highlights include assisting Simon Gilbert in securing a BEMSEE championship at the final round while achieving first race wins as a newcomer. Won the 2009 NG Road Racing Championship with Ian Drowne. Captured the 2019 BEMSEE F1 Sidecar Championship with Tommy Philp, winning every race finished during the season, with one recovery from mechanical issue resulting in a fourth place finish. Competed in British Superbike Championship events in 2020, securing multiple podium finishes with Ricky Stevens.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              Solo motorcycle racing career began with a win at the opening round at Silverstone, followed by multiple race wins across the season in an aggressive win-first racing style.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              After around fifteen years of racing, winning championships and competing at British Championship level with regular podium finishes, I now follow the sport closely and remain connected to the racing community.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              Outside of motorsport, I enjoy cooking, meditation and reading, particularly around personal development and awareness. These interests influence how I approach leadership, focus and decision making, reinforcing a calm, disciplined and performance-driven mindset.
            </p>
          </div>
        </section>

      </div>

      <ContactCTA />
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-xs uppercase tracking-[0.3em] mb-6 font-medium pb-3"
      style={{
        color: "rgba(255,255,255,0.4)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {children}
    </h2>
  );
}
