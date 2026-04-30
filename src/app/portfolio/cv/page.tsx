import type { Metadata } from "next";
import { Github, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import PortfolioNav from "../components/PortfolioNav";
import ContactCTA from "../components/ContactCTA";

export const metadata: Metadata = {
  title: "CV — Jonny Allum | Facilities & Maintenance Management",
  description:
    "Jonny Allum — Facilities and maintenance professional with experience running complex multi-use sites, coordinating contractors and ensuring compliance.",
};

const keySkills = [
  "Facilities and maintenance management across community, hospitality and care environments",
  "Planning and delivery of planned and reactive maintenance for building fabric, plant and services",
  "Contractor management including scopes, quotes, RAMS, supervision, sign off and defect resolution",
  "Health and safety, fire safety, Legionella and statutory compliance, including practical checklists and logs",
  "Budget awareness and cost control, including supplier negotiations and value engineering",
  "Strong IT skills including spreadsheets, databases, cloud systems, basic app building and automation",
  "Technical mindset including experience with sensors, Raspberry Pi, web apps, multi-agent AI systems and simple dashboards for monitoring and compliance",
];

const employment = [
  {
    role: "Facilities Manager then General Manager",
    company: "The Fishbourne Centre, Fishbourne",
    period: "2022 — 2025",
    content: [
      "I was initially brought in to get the building and site under control and took responsibility for day to day facilities and maintenance at a busy community and hospitality venue including bar, kitchen, function rooms, sports pitches and external areas. This included planned and reactive maintenance, working with contractors, dealing with breakdowns and ensuring the building was safe, open and ready for users. I used my building experience to carry out minor repairs and improvements myself where appropriate, and I put simple systems in place to log issues, prioritise work and track what had been done.",
      "My role then expanded into full general management. I continued to oversee facilities and compliance while leading a team of staff, managing budgets and reporting to the Board and Trustees. During my time the centre achieved its highest ever grossing periods, driven by tighter cost control, better use of the building and improved events. I held a Personal Alcohol Licence and maintained a five star food hygiene rating through strong health and safety, food safety and building checks.",
    ],
  },
  {
    role: "Facilities and Operations Manager",
    company: "Community First, Leigh Park Community Centre",
    period: "2017 — 2022",
    content: [
      "I was responsible for the facilities and day to day operation of a large community centre serving a wide range of user groups. This included managing room bookings, ensuring hire agreements and licences were in place, managing cleaning and set up so spaces were turned around correctly, and acting as key holder responsible for alarms, security and first response when issues arose.",
      "I carried out risk assessments, coordinated with the local council, contractors and inspectors for building checks and maintenance, and ensured compliance with health and safety, safeguarding and GDPR. I managed budgets for the centre, monitoring income and costs and reporting against targets. I constantly looked at how the building and systems could be improved, from signage and layout to booking processes and communication between teams.",
    ],
  },
  {
    role: "Installer then Compliance and Contracts Manager",
    company: "Virgin Media",
    period: "2011 — 2017",
    content: [
      "I joined Virgin Media as an installer, which gave me a grounding in how telecoms infrastructure is installed, tested and handed over to customers. I then moved into an office based compliance and contracts role supporting field engineers rather than working in the field myself.",
      "In the compliance and contracts role I helped to plan and schedule installation and maintenance work, prepared and reviewed method statements and risk assessments, and liaised between customers, engineering teams and third party contractors. I used internal systems to log faults, track assets, monitor job progress and ensure work met company standards and legal obligations. This gave me a solid understanding of how large maintenance operations are structured and how important accurate information flow is between office, field and client.",
    ],
  },
  {
    role: "Trainee Contracts Manager then Contracts Manager",
    company: "Assured Office Solutions",
    period: "2005 — 2011",
    content: [
      "I joined Assured Office Solutions as a trainee contracts manager and progressed to running my own contracts. Working initially alongside senior staff, I learned how to take projects from initial enquiry and survey through to quote, programme, delivery and handover. I assisted with RAMS, ordering materials, coordinating trades and keeping site records up to date.",
      "As I stepped into a full contracts manager role I took responsibility for multiple jobs at different stages, from small works through to larger fit out or maintenance projects. I planned labour and subcontractors, monitored progress against programme, managed variations and ensured health and safety documentation and O&M information were completed. This sharpened my commercial awareness and gave me a strong base in contractor and project management.",
    ],
  },
  {
    role: "Founder — technical systems, websites, apps and automation",
    company: "JonnyAI",
    period: "2025 — Present",
    note: "Run alongside other roles",
    content: [
      "JonnyAI is my own technical business. I design and build websites, simple mobile apps and automation for small businesses. I handle domains, DNS, hosting, SSL, email, forms and basic CRM, and I build and maintain sites such as jonnyai.co.uk, djwaste.co.uk, marzerpro.co.uk, primordialstone.co.uk and others. This has given me strong, practical experience with digital systems, cloud services and integrating different tools so that information does not get lost between them.",
      "For B&L Motorcycles I built a full dropshipping website and system, including N8N based automations that create and update eBay listings, send follow up emails and manage customer relations, with algorithms to add and maintain a catalogue of hundreds of active products. Across my portfolio I use an AI agent ecosystem based on my Antigravity Orchestra and JaiOS work to help manage content, monitoring and routine updates, so that many day to day tasks on the sites are semi-automated rather than manual.",
      "I also build internal tools and pipelines, such as an automated guided meditation video system that generates scripts, structures scenes and outputs rough edits for YouTube using my jAIlbreakO.S stack. The same approach — using small, focused tools and agents to remove friction — is what I bring to facilities and maintenance, where good digital records and simple automation can make inspections and compliance much easier to stay on top of.",
    ],
  },
  {
    role: "Consultancy and Part Time Chef",
    company: "Manor Barn Care Group",
    period: "2025 — Present",
    note: "Systems and compliance focused, part time",
    content: [
      "Alongside JonnyAI I have worked part time as a chef for a care home group, mainly as a way to explore another environment while applying my systems mindset. I write menus and cook daily meals for residents and staff, and I have overhauled several of their systems.",
      "I negotiated better supplier deals that saved significant amounts across the homes, and I designed and implemented an automated HACCP logging system so that food safety checks are recorded consistently and are easy to audit. I also built a simple facilities management app for the group which logs Legionella checks, RAMS, fire safety tasks and other routine inspections, turning paperwork and ad hoc spreadsheets into a structured, trackable process.",
    ],
  },
];

const qualifications = [
  "Health and safety, fire safety and working at height",
  "Safeguarding and mental health and wellbeing including Level 3 awards",
  "Customer service excellence and train the trainer development",
  "Food safety and hygiene including HACCP principles",
  "Personal Alcohol Licence",
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
              Facilities & Maintenance Management
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
              I am a practical, hands-on facilities and maintenance professional with experience running complex multi-use sites, coordinating contractors and trades, and keeping buildings safe, compliant and working. I have managed community centres, hospitality venues and care environments where something is always breaking and budgets are tight, so I am used to planning, prioritising and fixing with what is available.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
              I am technically minded and obsessive about improvement. I enjoy designing systems as much as turning a spanner, and I am confident with digital tools, compliance records, asset tracking and automation. Alongside my facilities work I run JonnyAI, where I build websites, apps and automation for small businesses, and use a team of AI agents to help monitor and maintain a portfolio of client and internal sites. I am now looking to bring that mix of facilities, technical and systems thinking into a full time maintenance manager role.
            </p>
          </div>
        </section>

        {/* Key Skills */}
        <section>
          <SectionHeading>Key Skills</SectionHeading>
          <ul className="flex flex-col gap-3">
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
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-3">
                  <div>
                    <h3 className="text-base font-semibold">{job.role}</h3>
                    <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
                      {job.company}
                    </p>
                    {job.note && (
                      <p className="text-xs italic mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
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
                <div className="flex flex-col gap-3">
                  {job.content.map((para, i) => (
                    <p
                      key={i}
                      className="text-sm leading-relaxed"
                      style={{ color: "rgba(255,255,255,0.55)" }}
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education and Training */}
        <section>
          <SectionHeading>Education and Training</SectionHeading>
          <div className="mb-6">
            <h3 className="text-sm font-semibold">Staunton Park School, Havant</h3>
            <p className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.45)" }}>
              1998 — 2003
            </p>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              GCSEs with a mix of A and B grades across core subjects.
            </p>
          </div>
          <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
            Further training includes multiple Level 2 and Level 3 vocational qualifications covering:
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
              I am a strong IT user and confident with Microsoft Office, spreadsheets, databases and cloud based systems. I have practical experience with web hosting, DNS, SSL, email routing, website content management systems and basic CRM platforms through JonnyAI. I am comfortable with automation tools, APIs and simple scripting to move data between systems and create basic dashboards or alerts.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              I have a practical understanding of sensors, Raspberry Pi and small scale monitoring systems for compliance and environmental data, and I build and maintain GitHub repositories both for my own projects (including Antigravity Orchestra and jAIlbreakO.S) and for client code. I can read and work from technical information, manuals and drawings and produce clear written instructions and checklists for others.
            </p>
          </div>
        </section>

        {/* Interests */}
        <section>
          <SectionHeading>Interests</SectionHeading>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
            Outside of work I am happiest with my family, and most of my free time is spent with my wife and three daughters. I enjoy building and fixing things, whether that is around the house or on a laptop. I am an ideas person by nature and my mind is always looking for problems to solve and ways to make things work better. I like change, I like learning and I read a lot, especially around personal development and how people and systems improve over time.
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
