import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Activity,
  Video,
  BookOpen,
  RefreshCw,
  Users,
  Sparkles,
  Globe2,
  Cpu,
  ShieldCheck,
  Check,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Resort Entertainment Tech · Jonny AI",
  description:
    "Capture, standardise and scale your resort's entertainment. Motion-capture training packs, multilingual onboarding, identity playbooks. B2B hospitality tech from Jonny AI.",
};

const ACCENT = "#D97757";
const GOLD = "#EFBE5A";
const MAIL = "info@jonnyai.co.uk";

function mailto(subject: string) {
  return `mailto:${MAIL}?subject=${encodeURIComponent(subject)}`;
}

const problems = [
  {
    title: "Entertainment lives in people, not in systems.",
    body: "When the head animator leaves at the end of the season, the choreography, the guest-interaction style, and the unwritten standards leave with them. Nothing is recorded. Nothing is documented. Every handover starts from zero.",
  },
  {
    title: "Onboarding is slow and inconsistent.",
    body: "New recruits learn from whoever is shouting across the stage that morning. The same routines get retaught every season, in slightly different versions, at wildly different speeds, with no baseline anyone can reference.",
  },
  {
    title: "Chains can't standardise live entertainment.",
    body: "You can standardise buffet layout, housekeeping scripts and check-in flows. But the animation team in Tunisia does not deliver the same show as the team in Tenerife — and there's no training system in place to change that.",
  },
  {
    title: "You spend on entertainment. You own nothing afterwards.",
    body: "Contracts, travel, salaries, choreographers — and at the end of the season the IP is gone. No reusable library, no branded training asset, no handover material. Just another round of recruitment starting in March.",
  },
];

const services = [
  {
    icon: Activity,
    title: "Motion-Capture Training Packs",
    body: "We record your lead animators performing your routines, then convert the footage into training modules with skeleton-tracked movement overlays. New staff learn faster, the routines stay true to the original, and the library compounds every season.",
  },
  {
    icon: Video,
    title: "AI Onboarding Video System",
    body: "Induction videos for every new entertainment recruit — covering routines, standards, guest-interaction expectations, show structure and timing. Delivered in up to four languages for multilingual teams.",
  },
  {
    icon: BookOpen,
    title: "Entertainment Identity Playbook",
    body: "A documented guide to your resort's entertainment style, signature routines, daily rhythm and performance standards. Turns something informal and personality-driven into something teachable, transferable and protectable.",
  },
  {
    icon: RefreshCw,
    title: "Annual Refresh & Certification",
    body: "Yearly updates, new choreography modules, refreshed onboarding content and staff reassessment. Keeps the system current across every season without the full rebuild cost each time.",
  },
];

const packages = [
  {
    name: "Discovery Pack",
    tagline: "Prove the concept in one resort, one season.",
    standard: "£3,500",
    founder: "£1,800",
    deliverables: [
      "2 routines captured & documented",
      "Skeleton-tracked training videos",
      "1 onboarding video, 1 language",
      "1-call handover",
    ],
    highlight: false,
  },
  {
    name: "Core System",
    tagline: "The full starter operating system.",
    standard: "£8,500",
    founder: "£4,500",
    deliverables: [
      "5 routines captured & documented",
      "Onboarding set, 2 languages",
      "Entertainment Identity Playbook",
      "2 refinement rounds + handover",
    ],
    highlight: true,
  },
  {
    name: "Full Brand System",
    tagline: "A complete entertainment IP layer for the resort.",
    standard: "£14,000",
    founder: "£8,000",
    deliverables: [
      "8+ routines captured & documented",
      "Onboarding set, 4 languages",
      "Playbook + avatar-style reference content",
      "Staff certification framework",
      "On-site launch session",
    ],
    highlight: false,
  },
  {
    name: "Chain Rollout",
    tagline: "Deployed across three or more properties.",
    standard: "£6,500 / property",
    founder: "£4,000 / property",
    deliverables: [
      "Core System adapted per property",
      "Central brand standards layer",
      "Group-level onboarding portal",
      "Regional trainer certification",
    ],
    highlight: false,
  },
];

const recurring = [
  { service: "Annual content refresh", price: "£2,400 / resort", role: "Keep routines and training systems current" },
  { service: "Remote staff module", price: "£750 / module", role: "New-hire catch-up and incremental changes" },
  { service: "Certification renewal", price: "£1,800 / year", role: "Reassess team quality against your documented standards" },
  { service: "Support retainer", price: "£400 / month", role: "Small edits, advisory access, quick-response help" },
  { service: "Content licensing", price: "£650 / month", role: "Premium templates, branded systems, extended rights" },
];

const workflow = [
  { n: "01", t: "Discovery call", b: "30-minute call to pin down your routines, pain points, and which package fits." },
  { n: "02", t: "On-site capture", b: "We come to the resort. 1–3 days filming routines, interviewing leads, documenting the style." },
  { n: "03", t: "System build", b: "Editing, skeleton overlays, onboarding edits, playbook drafting, translation rounds." },
  { n: "04", t: "Handover", b: "Full delivery of the training library, playbook and onboarding modules. Your team keeps it forever." },
  { n: "05", t: "Optional refresh", b: "Annual refresh, new modules, and certification renewals keep the system alive across seasons." },
];

const audiences = [
  { icon: Users, title: "Animation-heavy resorts", body: "Family and active all-inclusive properties where daytime sports and evening shows are a real part of the brand." },
  { icon: Globe2, title: "Regional resort groups", body: "Multi-property operators across North Africa, the Canary Islands, Turkey, the Caribbean and Mexico." },
  { icon: Sparkles, title: "International chains", body: "TUI, RIU, Iberostar, Royalton and similar operators looking to standardise entertainment delivery across properties." },
  { icon: ShieldCheck, title: "Entertainment agencies", body: "Providers already staffing resorts who want a white-label training system to embed in their offer." },
];

export default function ResortsPage() {
  return (
    <div className="min-h-screen" style={{ background: "#0A0A0A", color: "#fff" }}>
      {/* ─── HERO ─── */}
      <section className="pt-32 pb-20 px-6 md:px-10 max-w-6xl mx-auto">
        <p className="text-xs uppercase tracking-[0.3em] mb-6 font-medium" style={{ color: ACCENT }}>
          Jonny AI · Resort entertainment technology
        </p>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.05]">
          Turn your entertainment team<br />
          into an <span style={{ color: ACCENT }}>owned operating system</span>.
        </h1>
        <p
          className="text-lg md:text-xl max-w-3xl leading-relaxed mb-10"
          style={{ color: "rgba(255,255,255,0.72)" }}
        >
          We capture your routines, your teaching style, and the unwritten standards that make your
          entertainment team unique — then turn them into a motion-tracked training library, a
          multilingual onboarding system, and a playbook your resort keeps forever. One capture
          trip. A training asset that lasts every season.
        </p>

        <div className="flex flex-wrap gap-3">
          <a
            href={mailto("Book a discovery call — Jonny AI Resorts")}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded font-medium text-sm transition-opacity hover:opacity-85"
            style={{ background: ACCENT, color: "#0A0A0A" }}
          >
            Book a discovery call <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#packages"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded font-medium text-sm transition-colors"
            style={{
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            See the packages
          </a>
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { k: "1 trip", v: "On-site capture" },
            { k: "4 languages", v: "Onboarding output" },
            { k: "Season after season", v: "Reusable IP" },
            { k: "Your team keeps it", v: "No licence trap" },
          ].map((s) => (
            <div
              key={s.k}
              className="rounded-lg p-4"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <p className="text-lg md:text-xl font-semibold" style={{ color: ACCENT }}>
                {s.k}
              </p>
              <p className="text-[11px] uppercase tracking-[0.2em] mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
                {s.v}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PROBLEM ─── */}
      <section className="py-20 px-6 md:px-10 max-w-6xl mx-auto">
        <p className="text-[11px] uppercase tracking-[0.3em] mb-3" style={{ color: GOLD }}>
          The problem
        </p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-12">
          Entertainment is the hardest department to standardise.
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {problems.map((p) => (
            <div
              key={p.title}
              className="rounded-lg p-6 md:p-7"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <h3 className="text-lg md:text-xl font-semibold mb-3 text-white">{p.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SOLUTION ─── */}
      <section className="py-20 px-6 md:px-10 max-w-6xl mx-auto">
        <p className="text-[11px] uppercase tracking-[0.3em] mb-3" style={{ color: ACCENT }}>
          The solution
        </p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          Four services. One operating system.
        </h2>
        <p className="max-w-3xl text-base md:text-lg mb-12" style={{ color: "rgba(255,255,255,0.65)" }}>
          We're not an outsourced performer agency. We're a system builder. Every deliverable is
          designed to live inside your resort long after we've left — owned by you, re-used every
          season, and extensible as your team evolves.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-lg p-6 md:p-7"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center mb-5"
                style={{ background: "rgba(217,119,87,0.12)" }}
              >
                <Icon className="w-5 h-5" style={{ color: ACCENT }} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PACKAGES ─── */}
      <section id="packages" className="py-20 px-6 md:px-10 max-w-6xl mx-auto scroll-mt-24">
        <p className="text-[11px] uppercase tracking-[0.3em] mb-3" style={{ color: ACCENT }}>
          Packages
        </p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          Clear scope. Clear price. No custom consulting fog.
        </h2>
        <p className="max-w-3xl text-base md:text-lg mb-4" style={{ color: "rgba(255,255,255,0.65)" }}>
          Each package has a fixed deliverable list. The early-partner rate is available to the
          first resorts that agree to be referenced as case studies — it's a limited window, not
          the normal rate card.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
          {packages.map((p) => (
            <div
              key={p.name}
              className="rounded-lg p-6 flex flex-col"
              style={{
                background: p.highlight ? "rgba(217,119,87,0.06)" : "rgba(255,255,255,0.03)",
                border: p.highlight
                  ? `1px solid ${ACCENT}`
                  : "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {p.highlight && (
                <span
                  className="self-start text-[10px] uppercase tracking-[0.22em] px-2 py-1 rounded mb-4 font-medium"
                  style={{ background: ACCENT, color: "#0A0A0A" }}
                >
                  Most popular
                </span>
              )}
              <h3 className="text-xl font-semibold mb-1 text-white">{p.name}</h3>
              <p className="text-xs mb-5" style={{ color: "rgba(255,255,255,0.55)" }}>
                {p.tagline}
              </p>

              <div className="mb-5 space-y-1">
                <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Standard
                </p>
                <p className="text-2xl font-bold" style={{ color: "#fff" }}>
                  {p.standard}
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] mt-2" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Early-partner rate
                </p>
                <p className="text-lg font-semibold" style={{ color: ACCENT }}>
                  {p.founder}
                </p>
              </div>

              <ul className="space-y-2 mb-6 flex-1">
                {p.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
                    <Check className="w-4 h-4 mt-[3px] shrink-0" style={{ color: ACCENT }} />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>

              <a
                href={mailto(`Enquiry: ${p.name} — Jonny AI Resorts`)}
                className="mt-auto inline-flex items-center justify-center gap-1.5 text-xs font-medium px-4 py-2.5 rounded transition-opacity hover:opacity-85"
                style={
                  p.highlight
                    ? { background: ACCENT, color: "#0A0A0A" }
                    : { border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.85)" }
                }
              >
                Enquire <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>

        {/* Recurring */}
        <div className="mt-16">
          <h3 className="text-2xl font-semibold mb-2 text-white">Keep it alive, every season.</h3>
          <p className="text-sm mb-6 max-w-2xl" style={{ color: "rgba(255,255,255,0.6)" }}>
            Optional recurring services that keep your system current after handover. Picked à la
            carte — no subscription lock-in.
          </p>
          <div
            className="rounded-lg overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-[0.18em] font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
                    Service
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-[0.18em] font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
                    Price
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-[0.18em] font-medium hidden md:table-cell" style={{ color: "rgba(255,255,255,0.5)" }}>
                    Role
                  </th>
                </tr>
              </thead>
              <tbody>
                {recurring.map((r, i) => (
                  <tr
                    key={r.service}
                    style={{
                      borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <td className="px-4 py-3 font-medium text-white">{r.service}</td>
                    <td className="px-4 py-3" style={{ color: ACCENT }}>
                      {r.price}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell" style={{ color: "rgba(255,255,255,0.65)" }}>
                      {r.role}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── WORKFLOW ─── */}
      <section className="py-20 px-6 md:px-10 max-w-6xl mx-auto">
        <p className="text-[11px] uppercase tracking-[0.3em] mb-3" style={{ color: GOLD }}>
          How it works
        </p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-12">
          From first call to finished library.
        </h2>
        <div className="grid md:grid-cols-5 gap-5">
          {workflow.map((w) => (
            <div
              key={w.n}
              className="rounded-lg p-5"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <p className="text-xs font-mono mb-3" style={{ color: ACCENT }}>
                {w.n}
              </p>
              <h3 className="text-base font-semibold mb-2 text-white">{w.t}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                {w.b}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── WHO IT'S FOR ─── */}
      <section className="py-20 px-6 md:px-10 max-w-6xl mx-auto">
        <p className="text-[11px] uppercase tracking-[0.3em] mb-3" style={{ color: ACCENT }}>
          Who we build for
        </p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-12">
          Built for resorts where entertainment actually matters.
        </h2>
        <div className="grid md:grid-cols-2 gap-5">
          {audiences.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-lg p-6 flex gap-4 items-start"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "rgba(217,119,87,0.12)" }}
              >
                <Icon className="w-5 h-5" style={{ color: ACCENT }} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1 text-white">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TECH / TRUST ─── */}
      <section className="py-20 px-6 md:px-10 max-w-6xl mx-auto">
        <div
          className="rounded-xl p-8 md:p-12 grid md:grid-cols-[auto_1fr] gap-8 items-center"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            className="w-20 h-20 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(217,119,87,0.12)" }}
          >
            <Cpu className="w-9 h-9" style={{ color: ACCENT }} />
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
              Production-grade capture. Without the production-grade circus.
            </h3>
            <p className="text-base" style={{ color: "rgba(255,255,255,0.7)" }}>
              Our on-site rig runs edge-accelerated pose estimation with a Raspberry Pi 5 + AI HAT+
              — portable enough to move between stages, quiet enough to sit in a rehearsal room,
              detailed enough to drive skeleton-tracked training overlays. Premium Rokoko motion
              capture is available as an upgrade for Full Brand System and Chain Rollout packages.
            </p>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-24 px-6 md:px-10 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-5">
          Own your entertainment.<br />
          Stop renting it every season.
        </h2>
        <p className="text-base md:text-lg mb-10 max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.7)" }}>
          A 30-minute discovery call is free. You'll leave with a clear view of which package fits,
          what the capture trip looks like, and exactly what your team keeps at the end.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={mailto("Book a discovery call — Jonny AI Resorts")}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded font-medium text-sm transition-opacity hover:opacity-85"
            style={{ background: ACCENT, color: "#0A0A0A" }}
          >
            Book a discovery call <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href={`mailto:${MAIL}?subject=${encodeURIComponent("Requesting the Jonny AI Resorts one-pager")}`}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded font-medium text-sm"
            style={{
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            Request the one-pager
          </a>
        </div>
        <p className="text-xs mt-10" style={{ color: "rgba(255,255,255,0.45)" }}>
          Jonny AI · operated by Aleejy AI Ltd · {MAIL}
        </p>
        <p className="mt-4">
          <Link href="/marketplace" className="text-xs underline" style={{ color: "rgba(255,255,255,0.4)" }}>
            Looking for finished websites or unfinished products? Visit the marketplace →
          </Link>
        </p>
      </section>
    </div>
  );
}
