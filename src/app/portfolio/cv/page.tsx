import type { Metadata } from "next";
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import PortfolioNav from "../components/PortfolioNav";
import ContactCTA from "../components/ContactCTA";

export const metadata: Metadata = {
  title: "CV — Jonny Allum | AI Infrastructure & Automation",
  description:
    "Jonny Allum — AI Infrastructure & Automation, Operations & Systems Management. CV and full work history.",
};

const experience = [
  {
    role: "Founder & AI Systems Lead",
    company: "JonnyAI",
    period: "January 2025 — Present",
    content: [
      "JonnyAI is my own venture, built to answer a simple question for small businesses: if we wire AI properly into what you do, what can we improve today?",
      "I design and run custom AI agents that support operations, customer service, marketing and content, with everything tailored to the specific business rather than bolted on from a generic one-click tool. This includes planning, building and hosting websites, landing pages and simple mobile apps, and connecting them to back-end automations and live data.",
      "My core technical work centres on my own AI operating system and orchestration layer, including Antigravity Orchestra and JaiOS, an ecosystem of around sixty LangGraph-based agents that can be composed into larger, multi-step workflows. These agents handle tasks such as intake, routing, research, drafting, editing and publishing, and I am constantly adjusting prompts, tools and monitoring to make them more robust in production.",
      "A significant part of my work is building fully automated content pipelines. I have created systems that generate and assemble guided meditation videos for YouTube, where AI writes character-driven scripts, structures scenes, suggests visuals, and passes everything through to video tooling via API. I have also built a video editing agent that takes folders of rough footage and produces hundreds of short-form reels ready for social media, allowing a creator or brand to test ideas at a scale that would simply be impossible by hand.",
      "Alongside the agent work, I design and maintain websites for small businesses, including jonnyai.co.uk and client sites such as djwaste.co.uk, marzerpro.co.uk and primordialstone.co.uk. I handle DNS, hosting, SSL, forms, analytics, email routing and basic CRM, always working to close the gap between someone landing on a page and the business being able to act on it.",
    ],
  },
  {
    role: "Centre Manager",
    company: "The Fishbourne Centre",
    period: "September 2023 — February 2025",
    content: [
      "I managed the day-to-day operation of a busy hospitality and community venue, covering bar, catering, events, staffing, finances and facilities. I led a team of around fifteen people, planned rotas, led recruitment, trained staff and worked directly with a Board of Directors and Charity Trustees, making sure they received clear numbers and honest updates.",
      "During my time in the role, the centre recorded its highest grossing day, week, month and year. This came from tightening margins, bringing catering in-house, improving the events offer and paying close attention to how every decision flows through to the bottom line. I used my building trade background to maintain and improve the site, and I introduced simple systems for stock management, bookings, CRM and staff training that made the whole operation easier to run consistently.",
      "I hold a Personal Alcohol Licence and maintained a five-star food hygiene rating through strong health and safety processes and day-to-day discipline.",
    ],
  },
  {
    role: "General Manager, Leigh Park Community Centre",
    company: "Community First",
    period: "October 2022 — September 2023",
    content: [
      "I was responsible for the smooth running of a large community centre serving a wide range of user groups. I managed room bookings, leases and licences, reception, cleaning and security, and led staff and volunteers across the social enterprise cafe and children's play provision.",
      "I ensured compliance with health and safety, safeguarding and GDPR requirements, working alongside Havant Borough Council, contractors and inspectors. I developed simple marketing and outreach to increase footfall while keeping the centre accessible and welcoming. My consistent approach was to watch how people actually used the building, then adjust processes, information flow and layout to make their experience better.",
    ],
  },
  {
    role: "Director & Owner, Motorcycle Repair Garage",
    company: "Savage Spanner",
    period: "November 2019 — July 2021",
    content: [
      "I founded and ran a motorcycle repair and service business. I handled mechanical work, customer service, front of house, brand design, the website and printed materials, and produced uniforms and vinyl graphics using my own embroidery and printing equipment.",
      "I built an online booking system that brought together the website, Google, Facebook and Instagram into a single calendar. This reduced admin, improved communication with customers and helped us hit deadlines consistently. The business closed during the Covid-19 pandemic, but it was an early proof point for how much impact well-designed systems can have on a small workshop.",
    ],
  },
  {
    role: "Business Co-Owner, Carpentry & Refurbishment",
    company: "RNJ Customs Limited",
    period: "November 2018 — July 2022",
    content: [
      "I co-founded and led a carpentry business delivering residential projects and national pub refits. I carried out hands-on joinery, liaised with clients and main contractors, and coordinated across trades to deliver complete projects on time. I created the brand, ran social media and advertising, and managed all finances and VAT.",
      "I expanded the business into multi-trade work including painting, decorating, groundwork and basic electrics, so that we could offer a more complete service and maintain quality end to end. Wherever possible, I standardised methods and materials to improve speed and reliability.",
    ],
  },
  {
    role: "Owner & Operator",
    company: "Little Jonnys Catering",
    period: "June 2015 — September 2018, continued 2025 to present",
    content: [
      "I built and ran a catering business serving farmers' markets, food festivals, weddings and private events. I designed menus, sourced ingredients, cooked on site from a catering trailer, a mobile pizza oven and a van I converted myself.",
      "I created the branding, website, social media and printed materials, and handled bookings, finances and direct relationships with customers and event organisers. Every event was treated as a project to be analysed and improved, from prep lists and packing through to service and clean-down.",
    ],
  },
  {
    role: "Telecommunications Field & Customer Service Engineer",
    company: "Virgin Media, BT Openreach, Sky",
    period: "February 2007 — June 2015",
    content: [
      "I installed television, telephone and broadband services across the south of England, working at height on poles and underground in pits and ducts, using power tools safely in domestic environments. I particularly enjoyed the fault-finding work and learning the underground network.",
      "I was trained to a high standard in customer service and became a customer service ambassador, regularly sent to complex jobs that required patience and clear communication. These roles gave me a strong understanding of how infrastructure actually reaches the end user and taught me to explain technical problems in plain English, a skill that feeds directly into my AI and automation work today.",
    ],
  },
];

const techSkills = [
  {
    category: "AI & Automation",
    description:
      "Design and implementation of custom AI agents and multi-agent systems using LangGraph and LLM APIs. Orchestrating workflows that chain research, reasoning, drafting, editing and publishing. Building autonomous pipelines for video content, guided meditations and short-form clips.",
  },
  {
    category: "Web & Product",
    description:
      "Planning, building and maintaining small business websites and simple applications from idea through to deployment. Managing domains, DNS, hosting, SSL, email routing, contact forms and basic CRM integrations.",
  },
  {
    category: "Systems & Operations",
    description:
      "Designing booking systems, calendars and lightweight CRMs that connect websites, social media and internal tools. Creating documentation, runbooks and checklists so that teams can run the systems without needing to understand the underlying code.",
  },
  {
    category: "Data & Tooling",
    description:
      "Confident with common office tools including Excel. Experienced in using automation platforms, APIs and scripts to move data between systems, generate reports and trigger the right actions at the right time.",
  },
  {
    category: "General",
    description:
      "Comfortable with version control and GitHub-based workflows, issue tracking and iterative development. Used to testing ideas quickly, capturing what works and rolling it out, while always keeping a clear rollback plan.",
  },
];

const qualifications = [
  "Personal Alcohol Licence",
  "Level 3 Award in Safeguarding Children, Young People and Vulnerable Adults (2023)",
  "Level 3 Award in Supervising First Aid for Mental Health (2023)",
  "NVQ Level 2, BSkyB (2014)",
  "Train the Trainer (2022)",
  "Food Hygiene Level 2 (2022)",
  "Customer Service Excellence, Health & Safety, Fire Safety",
  "NRSWA Road Safety, Safety at Sea",
  "Working at Heights Levels 1 and 2",
  "Full, clean UK driving licence",
];

const keyStrengths = [
  "Obsessive improvement mindset, always asking how to make processes, systems and experiences better",
  "Strong mix of hands-on operational management and technical implementation, equally comfortable in a board meeting and deep in the code",
  "Self-taught AI and automation builder with real-world deployment experience across multi-agent orchestration, APIs and production systems",
  "Clear, plain-English communicator with non-technical stakeholders, honest about trade-offs and limitations",
  "Proven track record of turning struggling or average operations into higher-performing ones through better systems and discipline",
];

export default function CVPage() {
  return (
    <div className="min-h-screen" style={{ background: "#000", color: "#fff" }}>
      <PortfolioNav />

      {/* Print-only header */}
      <div className="hidden print:block pt-8 pb-4 px-10 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-black">Jonny Allum</h1>
        <p className="text-gray-600 text-sm mt-1">
          AI Infrastructure & Automation | jonnyallum@gmail.com | jonnyai.co.uk
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
              className="text-base md:text-lg font-medium mb-6"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              AI Infrastructure & Automation | Operations & Systems Management
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
              I am an obsessive builder of systems who cannot look at anything without asking one question: how can we make this better?
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
              I combine years of running real-world operations in hospitality venues, community centres and small businesses with deep, self-driven experience in AI, automation, web development and digital infrastructure. I am happiest when I am deep in a project, pulling apart messy processes and rebuilding them as simple, reliable workflows that normal people can actually use every day.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
              I think in feedback loops and continuous improvement. I notice the small things that slow people down, and I take ownership for fixing them rather than waiting for permission. I am direct, honest and easy to work with, and I care far more about outcomes than job titles.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
              I am now looking for a role where I can own AI and automation for a small or medium-sized business, from designing and building the infrastructure through to maintaining, monitoring and iterating it over time.
            </p>
          </div>
        </section>

        {/* Target Role */}
        <section
          className="p-6 rounded-xl"
          style={{
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.03)",
          }}
        >
          <h2
            className="text-xs uppercase tracking-[0.3em] mb-4 font-medium"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Target Role
          </h2>
          <p className="text-sm leading-relaxed font-medium mb-3">
            AI Infrastructure and Automation Manager, AI Systems Lead, or a similar role in a small or medium-sized organisation that wants to take AI and automation seriously.
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            I want to be the person who designs, builds and looks after the AI systems that sit across the business, someone who works directly with owners and teams and never stops asking how we can make it better.
          </p>
        </section>

        {/* Experience */}
        <section>
          <SectionHeading>Experience</SectionHeading>
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

          {/* Earlier Career */}
          <div className="mt-8 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <h3 className="text-sm font-semibold mb-2">Earlier Career</h3>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
              Bar roles up to bar manager, motorcycle mechanic, welder and trawler fisherman. These gave me a strong work ethic, physical resilience and a genuine respect for teamwork in demanding environments.
            </p>
          </div>
        </section>

        {/* Other Ventures */}
        <section>
          <SectionHeading>Other Ventures & Projects</SectionHeading>
          <div className="flex flex-col gap-4">
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              I co-founded Primordial Stone, a company specialising in faux stone wall installations. Drawing on more than thirty years of combined building trade experience, we work on residential and commercial projects nationwide from our base in Portsmouth and Hampshire.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              I also built and run the BL Motorcycles dropshipping operation and website, and I maintain multiple projects running in parallel at any one time. My GitHub has 54 active repositories, a mix of client and personal work. Many of them start the same way: I am lying in bed, an idea comes, and then I have to build it.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              On the AI side, I maintain Antigravity Orchestra as a public lab for multi-agent orchestration and standardised agent profiles, and I continue to extend the JaiOS ecosystem. I have built agents for video editing, sports betting analytics, translation, meditation content and more, often chaining many tools into complete workflows that can run for extended periods with minimal intervention. Every project starts the same way: watching how people really work now, and asking how to make that better with the tools available.
            </p>
          </div>
        </section>

        {/* Key Strengths */}
        <section>
          <SectionHeading>Key Strengths</SectionHeading>
          <ul className="flex flex-col gap-3">
            {keyStrengths.map((strength, i) => (
              <li
                key={i}
                className="text-sm leading-relaxed flex gap-3"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                <span className="text-white/20 flex-shrink-0 mt-0.5">&bull;</span>
                {strength}
              </li>
            ))}
          </ul>
        </section>

        {/* Technical Skills */}
        <section>
          <SectionHeading>Technical Skills</SectionHeading>
          <div className="flex flex-col gap-5">
            {techSkills.map((skill) => (
              <div key={skill.category}>
                <h3 className="text-sm font-semibold mb-1.5">{skill.category}</h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  {skill.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Education & Qualifications */}
        <section>
          <SectionHeading>Education & Qualifications</SectionHeading>
          <div className="mb-5">
            <h3 className="text-sm font-semibold">Staunton Park School, Havant</h3>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              Nine GCSEs grades A to C (1998 — 2003)
            </p>
          </div>
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

        {/* Interests */}
        <section>
          <SectionHeading>Interests</SectionHeading>
          <div className="flex flex-col gap-4">
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              I am a family man, and time with my wife and three daughters keeps everything else in perspective. I do not drink or smoke, and most of my energy goes into building, learning and creating.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              Motorcycle racing has been a huge part of my life. After around fifteen years of racing, winning championships and competing at British Championship level with regular podium finishes, I now follow the sport closely and stay connected to that world.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              I also love cooking, meditation and reading, particularly around personal development and awareness. These feed directly back into how I approach both work and life.
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
