import type { Metadata } from "next";
import { Github, Linkedin, Mail, Phone } from "lucide-react";
import PortfolioNav from "../components/PortfolioNav";
import ContactCTA from "../components/ContactCTA";

export const metadata: Metadata = {
  title: "CV — Jonny Allum | Facilities & Maintenance Manager",
  description:
    "Jonathan Allum — Experienced Facilities Manager specialising in multi-use sites, preventative maintenance, compliance management and contractor oversight.",
};

const coreExpertise = [
  "Planned Preventative Maintenance (PPM)",
  "Reactive maintenance management",
  "Legionella Control (L8)",
  "Fire safety compliance",
  "EICR (Electrical Installation Condition Report)",
  "PAT Testing (Portable Appliance Testing)",
  "RAMS (Risk Assessment & Method Statements)",
  "Contractor management",
  "Budget management",
  "Digital systems & automation",
  "Sensor networks & IoT",
  "Raspberry Pi integration",
];

const techStack = [
  "MS Office Suite, Google Workspace",
  "Web hosting, DNS management, SSL certificates",
  "CMS & CRM platforms",
  "N8N automation workflows",
  "GitHub version control",
  "Supabase databases",
  "Raspberry Pi & sensor technology",
  "APIs & data integration",
];

const experience = [
  {
    role: "Facilities Manager",
    company: "JonnyAI (Self-employed)",
    period: "2025 – Present",
    contributions: [
      "Provide facilities and maintenance management services across multiple commercial client sites",
      "Current client portfolio: BL Motorcycles Ltd, DJ Waste, Dudley Motors, Village Bakery & Café, Wondering Souls Studio, Marzer Pro, Primordial Stone",
      "Oversee preventative and reactive maintenance programmes",
      "Manage compliance and safety documentation",
      "Coordinate with contractors and service providers",
    ],
  },
  {
    role: "Care Home Manager",
    company: "Manor Barn Care Group",
    period: "2025 – Present",
    contributions: [
      "Manage facilities and maintenance operations across care home environments",
      "Ensure all statutory compliance requirements are met",
      "Maintain high standards of cleanliness and safety",
      "Coordinate maintenance contractors and service providers",
      "Oversee asset management and preventative maintenance schedules",
    ],
  },
  {
    role: "Facilities Manager",
    company: "Fishbourne Centre",
    period: "2022 – 2025",
    contributions: [
      "Managed all facilities, maintenance and compliance for multi-use community centre",
      "Implemented comprehensive preventative maintenance programme reducing downtime by 40%",
      "Managed Legionella control systems, EICR testing and fire safety compliance",
      "Oversaw PAT testing and electrical safety across all equipment",
      "Coordinated with external contractors including plumbers, electricians and structural engineers",
      "Maintained detailed maintenance logs and compliance documentation",
      "Managed facilities budget and negotiated service contracts",
      "Implemented digital systems for maintenance scheduling and asset tracking",
      "Ensured wedding venue meets health and safety standards for guest events",
      "Managed heating, cooling and utility systems to optimise operational efficiency",
    ],
  },
  {
    role: "Centre Manager",
    company: "Community First, Leigh Park Community Centre",
    period: "2017 – 2022",
    contributions: [
      "Managed day-to-day operations and facilities of community centre",
      "Oversaw staff, volunteers and facility usage",
      "Supported budgeting and financial oversight",
      "Improved service coordination and operational workflows",
      "Maintained compliance and safety standards",
      "Coordinated maintenance and contractor visits",
      "Strengthened stakeholder engagement and community relationships",
    ],
  },
  {
    role: "Technical Engineer",
    company: "Virgin Media",
    period: "2011 – 2017",
    contributions: [
      "Delivered telecommunications engineering services",
      "Provided installation and fault diagnosis support",
      "Managed customer relationships and service quality",
      "Developed practical problem-solving and technical troubleshooting skills",
    ],
  },
  {
    role: "Operations Manager",
    company: "Assured Office Solutions",
    period: "2005 – 2011",
    contributions: [
      "Managed office operations and facilities",
      "Coordinated maintenance and support services",
      "Oversaw vendor and contractor relationships",
      "Supported business operations and client satisfaction",
    ],
  },
];

const qualifications = [
  "Personal Alcohol Licence",
  "Level 3 Safeguarding certification",
  "Fire Safety training",
  "Working at Height certification",
  "Food Safety HACCP certification",
  "Train the Trainer qualification",
  "Full clean driving licence",
];

const keyAchievements = [
  "Implemented preventative maintenance programme reducing emergency call-outs by 40% at Fishbourne Centre",
  "Maintained 100% compliance with all statutory safety requirements across multiple sites",
  "Successfully managed Legionella control systems across multi-use facilities",
  "Coordinated complex contractor relationships managing multiple service providers",
  "Developed digital maintenance tracking systems improving operational efficiency",
  "Maintained high standards across community facilities serving hundreds of users",
];

export default function CVPage() {
  return (
    <div className="min-h-screen" style={{ background: "#000", color: "#fff" }}>
      <PortfolioNav />

      {/* Print-only header */}
      <div className="hidden print:block pt-8 pb-4 px-10 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-black">Jonathan Allum</h1>
        <p className="text-gray-600 text-sm mt-1">
          Facilities & Maintenance Manager | 07723 959178 | info@jonnyai.co.uk | 9 Ward Crescent, Emsworth, PO10 7RR
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
              Facilities & Maintenance Manager
            </p>
            <p
              className="text-sm leading-relaxed max-w-2xl"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              Emsworth, Hampshire &middot; 9 Ward Crescent, PO10 7RR &middot;{" "}
              <a href="https://jonnyai.co.uk" className="underline hover:text-white transition-colors">
                jonnyai.co.uk
              </a>
            </p>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3 flex-shrink-0">
            <a
              href="mailto:info@jonnyai.co.uk"
              className="flex items-center gap-2 text-xs px-5 py-2.5 rounded-full font-medium transition-opacity hover:opacity-80"
              style={{ background: "#fff", color: "#000" }}
            >
              <Mail className="w-3.5 h-3.5" />
              info@jonnyai.co.uk
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
              Experienced Facilities and Maintenance Manager with a proven track record of managing multi-use facilities, implementing preventative maintenance programmes and ensuring comprehensive compliance across complex operational environments. Practical, detail-oriented professional with expertise in statutory safety requirements, contractor management and budget control.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
              Specialises in Planned Preventative Maintenance (PPM), reactive maintenance delivery and compliance management including Legionella control, fire safety, EICR testing and PAT certification. Skilled in coordinating external contractors, managing maintenance budgets and implementing digital systems to improve operational efficiency and reduce downtime. Currently providing facilities management services across multiple commercial client sites and care home environments.
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

        {/* Key Achievements */}
        <section>
          <SectionHeading>Key Achievements</SectionHeading>
          <ul className="flex flex-col gap-3">
            {keyAchievements.map((item, i) => (
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

        {/* Qualifications & Certifications */}
        <section>
          <SectionHeading>Qualifications & Certifications</SectionHeading>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {qualifications.map((item, i) => (
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

        {/* Personal Interests */}
        <section>
          <SectionHeading>Personal Interests</SectionHeading>
          <div className="flex flex-col gap-4">
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              Passionate about building and fixing things. Enjoys hands-on problem-solving and practical engineering challenges. Experienced motorcycle racer with a background competing at British Championship level, combining precision, discipline and performance-driven decision making.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              Regular reader focusing on personal development, professional excellence and continuous improvement. Family-oriented with a commitment to work-life balance and community engagement.
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
