import type { Metadata } from "next";
import { Github, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import PortfolioNav from "../components/PortfolioNav";
import ContactCTA from "../components/ContactCTA";

export const metadata: Metadata = {
  title: "CV — Jonny Allum | Facilities & Maintenance Management",
  description:
    "Jonny Allum — Facilities and maintenance management professional with extensive experience across community, hospitality and care environments.",
};

const keySkills = [
  "Planned Preventive Maintenance (PPM) scheduling, management and delivery",
  "Reactive maintenance coordination, fault diagnosis and resolution",
  "Contractor management — tendering, scoping, RAMS review, supervision, defect resolution and sign-off",
  "Legionella risk assessment and L8 compliance — temperature monitoring, flushing regimes and records",
  "Fire safety management — FRA coordination, alarm testing, emergency lighting checks and evacuation procedures",
  "Electrical compliance — EICR programme management, PAT testing and certification records",
  "Gas safety — boiler servicing coordination, CP12 documentation and plant maintenance",
  "Health and safety management — COSHH assessments, risk assessments, accident investigation and reporting",
  "Statutory compliance documentation — permits to work, O&M packs and maintenance records",
  "Contracts management — scope preparation, programming, procurement, variations and final account",
  "CDM compliance and construction phase planning",
  "Asset register management and lifecycle planning",
  "Budget management, cost control and supplier negotiation",
  "Digital compliance systems — automated logging, dashboards and bespoke FM application development",
];

const employment = [
  {
    role: "Facilities Manager, then General Manager",
    company: "The Fishbourne Centre, Fishbourne",
    period: "2022 — 2025",
    intro: "Appointed initially to stabilise the building and site at a busy multi-use community and hospitality venue comprising bar, commercial kitchen, function suites, sports pitches and external areas. Role subsequently expanded to full General Management while retaining responsibility for all facilities and compliance.",
    bullets: [
      "Managed all PPM and reactive maintenance across building fabric, plant and services, maintaining a forward maintenance register and scheduling works to minimise disruption to bookings and lettings",
      "Coordinated and supervised all contractors, reviewing RAMS and method statements prior to mobilisation and issuing permits to work where required",
      "Maintained full L8 Legionella compliance — oversaw risk assessments, implemented temperature monitoring and flushing regimes, and maintained auditable records",
      "Managed fire safety programme including monthly and weekly alarm tests, emergency lighting inspections, fire risk assessment reviews, extinguisher servicing and evacuation drill coordination",
      "Coordinated EICR and PAT testing programmes, maintaining asset registers and ensuring all certification was current and accessible",
      "Managed gas safety compliance including annual boiler servicing, CP12 documentation and plant maintenance records",
      "Conducted COSHH assessments and maintained H&S records, accident books and risk assessment documentation",
      "Tendered and let maintenance contracts, evaluated quotes and managed contractor performance against agreed SLAs",
      "Managed facilities and maintenance budget, controlling costs, negotiating with suppliers and reporting against targets to the Board of Trustees",
      "Implemented digital systems for logging maintenance requests, scheduling recurring tasks and tracking completion",
      "Carried out minor building repairs and improvements directly, reducing contractor call-out costs",
      "Held Personal Alcohol Licence; maintained a five-star food hygiene rating throughout tenure",
      "As General Manager, led a team of fifteen staff, managed P&L and reported to the Board — centre achieved its highest ever grossing day, week, month and year during this period",
    ],
  },
  {
    role: "Facilities and Operations Manager",
    company: "Community First, Leigh Park Community Centre",
    period: "2017 — 2022",
    intro: "Responsible for the full facilities management and day-to-day operation of a large multi-use community centre serving a broad range of user groups, community organisations and commercial hirers.",
    bullets: [
      "Managed all planned and reactive maintenance across the building and site, coordinating contractor attendance and supervising works through to completion and sign-off",
      "Reviewed and maintained RAMS, method statements and insurance documentation for all contractors working on site",
      "Managed Legionella monitoring programme — maintained temperature logs, flushing records and coordinated periodic risk assessments",
      "Coordinated fire safety compliance including alarm testing schedules, emergency lighting checks, FRA reviews and liaison with the fire authority",
      "Liaised with Havant Borough Council, statutory inspectors and enforcement authorities on building compliance and condition matters",
      "Conducted and maintained risk assessments, COSHH records and health and safety documentation across all areas of the building",
      "Acted as designated keyholder — responsible for alarm response, security and first response to building emergencies out of hours",
      "Managed room bookings, hire agreements, licences and all compliance documentation associated with lettings",
      "Managed budgets for the centre including income, expenditure and reporting against targets",
      "Ensured compliance with safeguarding, GDPR and equality requirements across centre operations",
      "Implemented improvements to signage, layout, booking processes and internal communication systems",
    ],
  },
  {
    role: "Installer, then Compliance and Contracts Manager",
    company: "Virgin Media",
    period: "2011 — 2017",
    intro: "Joined as a field installer gaining hands-on experience of telecoms infrastructure installation and testing. Progressed to an office-based compliance and contracts role supporting field engineering operations across the South of England.",
    bullets: [
      "Prepared and reviewed method statements, risk assessments and RAMS for field engineering activities, ensuring compliance with company standards and legislative requirements",
      "Planned and scheduled installation and maintenance works, coordinating resource allocation across engineering teams and third-party contractors",
      "Liaised between customers, field engineers and subcontractors to ensure accurate information flow and timely delivery",
      "Used internal CAFM and job management systems to log faults, track assets, monitor job progress and maintain compliance records",
      "Ensured all engineering works met regulatory obligations and company quality standards prior to sign-off and handover",
    ],
  },
  {
    role: "Trainee Contracts Manager, then Contracts Manager",
    company: "Assured Office Solutions",
    period: "2005 — 2011",
    intro: "Progressed from trainee through to full contracts management responsibility across a portfolio of commercial fit-out, refurbishment and maintenance projects.",
    bullets: [
      "Managed contracts from initial survey and quotation through to programme, delivery and handover",
      "Prepared and reviewed RAMS, CDM documentation, O&M packs and health and safety files",
      "Coordinated and supervised trades including electricians, plumbers, decorators and groundworkers",
      "Managed labour and subcontractor programmes, monitoring progress and resolving site issues",
      "Administered variations, managed defect resolution and prepared documentation for final account",
      "Maintained site records, progress reports and all statutory compliance documentation throughout each project",
      "Developed commercial awareness through direct client liaison, cost management and supplier negotiation",
    ],
  },
  {
    role: "Founder — Web, App and Automation Development",
    company: "JonnyAI",
    period: "2025 — Present",
    note: "Operated alongside primary roles",
    intro: "Design and delivery of websites, applications and automation systems for small businesses. Responsible for all technical delivery including architecture, hosting, DNS, SSL, integrations and ongoing maintenance.",
    bullets: [
      "Designed, built and maintain client websites including blmotorcyclesltd.co.uk, dj-waste.co.uk, dudleymotors.co.uk, villagebakeryandcafe.co.uk, wonderingsoulstudio.co.uk, marzerpro.co.uk and primordialstone.co.uk",
      "Built a full dropshipping e-commerce platform for BL Motorcycles Ltd, including N8N-based automations for eBay listing creation and management, customer follow-up and catalogue maintenance across hundreds of live products",
      "Developed and maintain a multi-agent AI ecosystem (Antigravity Orchestra and JaiOS) for automated content management, site monitoring and routine workflow execution across the client portfolio",
      "Built and deployed a bespoke facilities management compliance application for Manor Barn Care Group, covering Legionella monitoring, fire safety schedules, RAMS registers and routine inspection logging",
      "Designed and implemented an automated HACCP food safety logging system for the same group, replacing manual paperwork with a structured, auditable digital process",
      "Manages all hosting infrastructure, domain configuration, SSL certificates, email routing and third-party integrations for all client sites",
    ],
  },
  {
    role: "Systems and Compliance Consultant, Part-Time Chef",
    company: "Manor Barn Care Group",
    period: "2025 — Present",
    intro: "Engaged to overhaul compliance and operational systems across a care home group, alongside providing part-time culinary cover.",
    bullets: [
      "Designed and implemented a bespoke facilities management application to log Legionella checks, fire safety tasks, RAMS records and routine building inspections — replacing ad hoc spreadsheets with a structured, trackable digital system",
      "Built and deployed an automated HACCP compliance logging system, enabling consistent daily food safety recording across the group and simplifying audit preparation",
      "Negotiated supplier contracts across the homes, achieving significant reductions in food and consumable costs",
      "Introduced standardised menus, prep lists and service procedures to improve consistency and reduce waste",
    ],
  },
];

const qualifications = [
  "Personal Alcohol Licence",
  "Level 3 Award in Safeguarding Children, Young People and Vulnerable Adults",
  "Level 3 Award in Supervising First Aid for Mental Health",
  "IOSH / Health and Safety at Work",
  "Fire Safety and Fire Marshal",
  "Working at Height — Levels 1 and 2",
  "Food Safety and Hygiene Level 2 (HACCP)",
  "NRSWA Road Safety",
  "Train the Trainer",
  "Customer Service Excellence",
  "Full, clean UK driving licence",
];

export default function CVPage() {
  return (
    <div className="min-h-screen" style={{ background: "#000", color: "#fff" }}>
      <PortfolioNav />

      {/* Print-only header */}
      <div className="hidden print:block pt-8 pb-4 px-10 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-black">Jonny Allum</h1>
        <p className="text-gray-600 text-sm mt-1">
          9 Ward Crescent, Emsworth, PO10 7RR &bull; 07723 959178 &bull; info@jonnyai.co.uk
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
              Jonny Allum
            </h1>
            <p
              className="text-base md:text-lg font-medium mb-4"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Facilities &amp; Maintenance Management
            </p>
            <p
              className="text-sm leading-relaxed flex items-center gap-1.5"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              9 Ward Crescent, Emsworth, PO10 7RR
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

        {/* Profile */}
        <section>
          <SectionHeading>Profile</SectionHeading>
          <div className="flex flex-col gap-4">
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
              Experienced facilities and maintenance professional with a background spanning community venues, hospitality and care environments. Proven ability to manage complex, multi-use sites — delivering statutory compliance, planned and reactive maintenance, and contractor management within budgeted cost and to a consistently high standard.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
              Technically capable across building systems, compliance frameworks and digital tools. Operates with a systems-led approach, implementing structured processes for PPM scheduling, RAMS management, Legionella monitoring, fire safety, EICR and PAT programmes, and compliance record-keeping. Currently seeking a full-time Facilities or Maintenance Manager position.
            </p>
          </div>
        </section>

        {/* Key Skills */}
        <section>
          <SectionHeading>Key Skills</SectionHeading>
          <ul className="flex flex-col gap-2.5">
            {keySkills.map((skill, i) => (
              <li
                key={i}
                className="text-sm leading-relaxed flex gap-3"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                <span className="text-white/20 flex-shrink-0 mt-0.5">&bull;</span>
                {skill}
              </li>
            ))}
          </ul>
        </section>

        {/* Employment History */}
        <section>
          <SectionHeading>Employment History</SectionHeading>
          <div className="flex flex-col gap-12">
            {employment.map((job) => (
              <div key={job.company + job.role}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
                  <div>
                    <h3 className="text-base font-semibold">{job.role}</h3>
                    <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>
                      {job.company}
                    </p>
                    {job.note && (
                      <p className="text-xs italic mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                        {job.note}
                      </p>
                    )}
                  </div>
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
                </div>
                <p
                  className="text-sm leading-relaxed mb-3 italic"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  {job.intro}
                </p>
                <ul className="flex flex-col gap-2">
                  {job.bullets.map((item, i) => (
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

        {/* Education and Training */}
        <section>
          <SectionHeading>Education and Training</SectionHeading>
          <div className="mb-6">
            <h3 className="text-sm font-semibold">Staunton Park School, Havant</h3>
            <p className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.45)" }}>1998 — 2003</p>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              Nine GCSEs, grades A–C across core and vocational subjects.
            </p>
          </div>
          <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.45)" }}>
            Further vocational qualifications and professional certifications:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {qualifications.map((q, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-sm px-3 py-2 rounded-lg"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                <span className="text-white/20 flex-shrink-0">&bull;</span>
                {q}
              </div>
            ))}
          </div>
        </section>

        {/* Technical Skills */}
        <section>
          <SectionHeading>Technical Skills</SectionHeading>
          <div className="flex flex-col gap-4">
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              Proficient with Microsoft Office, spreadsheets, databases and cloud-based platforms. Experienced in producing and maintaining compliance logs, asset registers, PPM schedules and maintenance records in both proprietary and custom-built systems. Able to read and interpret technical drawings, O&amp;M documentation, SFG20 maintenance schedules and statutory guidance.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              Through JonnyAI, has designed and deployed bespoke facilities management applications covering Legionella monitoring logs, fire safety inspection schedules, RAMS registers and routine compliance trackers. Also built and implemented an automated HACCP digital recording system for a care group, replacing manual paperwork with a structured, auditable process. Practical experience with Raspberry Pi, environmental sensors and small-scale monitoring systems applicable to building compliance and data capture.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              Comfortable with automation tools, APIs and workflow integrations (N8N) for connecting systems and reducing manual administration. Maintains active GitHub repositories for client and internal technical projects. Experienced with web hosting infrastructure, DNS management and cloud services.
            </p>
          </div>
        </section>

        {/* Interests */}
        <section>
          <SectionHeading>Interests</SectionHeading>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
            Outside work, time is primarily spent with family. Has a longstanding interest in building, engineering and problem-solving — both practical and digital. An avid reader, particularly in the areas of operational performance, leadership and continuous improvement. Competitive motorcycle and sidecar racing background, including multiple championships at club and national level.
          </p>
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
