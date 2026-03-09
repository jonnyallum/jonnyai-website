"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, CheckCircle, ArrowRight, Users, Star, Clock, Zap, BookOpen, Award, ChevronRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

const CURRICULUM = [
  {
    week: "Week 1",
    title: "The Jai.OS Foundation",
    topics: ["Agent architecture and the Orchestra model", "Shared Brain: persistent memory and sync", "Deterministic vs probabilistic agent design", "Your first SKILL.md: how agents think"],
    icon: BookOpen,
  },
  {
    week: "Week 2",
    title: "Building Your First Agent",
    topics: ["SKILL.md authoring from scratch", "Tool assignment and SOP design", "The @neo methodology for agent creation", "Quality gates: what your agent must pass"],
    icon: Zap,
  },
  {
    week: "Week 3",
    title: "Multi-Agent Orchestration",
    topics: ["The @marcus routing model explained", "The Ralph Loop: iterative autonomous build", "Handoffs, error recovery, and escalation", "Running your first 3-agent pipeline"],
    icon: Users,
  },
  {
    week: "Week 4",
    title: "Monetising the System",
    topics: ["The Empire Builder model: 5 revenue streams", "Gold Standard audit methodology", "Client delivery: what 'done' actually means", "Scaling to your first £5k/month with agents"],
    icon: Star,
  },
];

const OUTCOMES = [
  "Build and deploy a working multi-agent system from scratch",
  "Author professional-grade SKILL.md files for any agent type",
  "Implement the Ralph Loop for autonomous iterative builds",
  "Design quality gates that actually prevent production failures",
  "Deliver AI agent work to clients with certified methodology",
  "Leave with a complete, deployable Jai.OS 5.0 setup",
];

const TIERS = [
  {
    name: "Founding Member",
    price: "£297",
    was: "£997",
    spots: 20,
    highlight: true,
    badge: "Only 20 spots",
    features: [
      "Full 4-week programme",
      "Jai.OS 5.0 Practitioner Certificate",
      "Lifetime access to all materials",
      "Agent-assessed final project (by @vigil)",
      "Private founding member cohort",
      "Direct access to Jonny for Q&A",
    ],
    cta: "Claim Founding Spot",
  },
  {
    name: "Standard Practitioner",
    price: "£597",
    was: null,
    spots: null,
    highlight: false,
    badge: "Cohorts 2-5",
    features: [
      "Full 4-week programme",
      "Jai.OS 5.0 Practitioner Certificate",
      "Lifetime access to all materials",
      "Agent-assessed final project",
      "Community cohort access",
    ],
    cta: "Join Waitlist",
  },
];

const PROOF_POINTS = [
  { value: "67", label: "Agents in the Antigravity Orchestra" },
  { value: "4 weeks", label: "To your first working multi-agent build" },
  { value: "£0", label: "Fluff. Zero theoretical filler." },
];

export default function AcademyPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, source: "academy-founding-member" }),
      });
      if (res.ok) {
        setStatus("success");
        setMessage("You're on the founding member list. We'll email you within 24 hours with next steps.");
        setEmail("");
        setName("");
      } else {
        setStatus("error");
        setMessage("Something went wrong. Email hello@antigravityacademy.com directly.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Email hello@antigravityacademy.com directly.");
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text-primary)" }}>
      <div className="noise-overlay" />

      {/* NAV */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--border)", background: "rgba(10,10,15,0.92)", backdropFilter: "blur(12px)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 flex items-center justify-center"
            style={{ background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: 4 }}
          >
            <GraduationCap className="w-4 h-4" style={{ color: "var(--accent)" }} />
          </div>
          <span className="text-sm font-semibold tracking-wider uppercase" style={{ color: "var(--text-primary)", letterSpacing: "0.12em" }}>
            Antigravity Academy
          </span>
        </div>
        <a
          href="#enrol"
          className="text-xs font-semibold px-4 py-2 transition-all duration-200 hover:opacity-90"
          style={{
            background: "var(--accent)",
            color: "#fff",
            borderRadius: 6,
          }}
        >
          20 Founding Spots →
        </a>
      </nav>

      {/* HERO */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 50% -5%, rgba(249,115,22,0.07) 0%, transparent 65%)" }} />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 text-xs font-semibold tracking-widest uppercase"
              style={{
                background: "rgba(249,115,22,0.1)",
                border: "1px solid rgba(249,115,22,0.25)",
                borderRadius: 4,
                color: "var(--accent)",
              }}
            >
              <Clock className="w-3 h-3" />
              20 founding member spots — £297 (saves £700)
            </div>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-5xl md:text-7xl font-bold leading-tight mb-6"
            style={{ letterSpacing: "-0.02em" }}
          >
            Run your first
            <br />
            <span style={{ color: "var(--accent)" }}>multi-agent build</span>
            <br />
            in 4 weeks.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-xl max-w-2xl mb-8 leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Antigravity Academy certifies practitioners in the Jai.OS 5.0 methodology — the same system powering a
            67-agent AI orchestra at{" "}
            <a href="https://jonnyai.co.uk" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "none" }}>
              jonnyai.co.uk
            </a>
            . No theory. No fluff. Just working agents.
          </motion.p>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2.5}
            className="text-sm mb-10 font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            First cohort enrols <strong style={{ color: "var(--text-secondary)" }}>2026-03-10</strong> — if you&apos;re reading this, the window is open.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3} className="flex flex-col sm:flex-row gap-4">
            <a
              href="#enrol"
              className="inline-flex items-center gap-2 px-6 py-3.5 font-semibold text-sm transition-all duration-200 hover:opacity-90"
              style={{ background: "var(--accent)", color: "#fff", borderRadius: 6 }}
            >
              Claim Founding Spot — £297
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#curriculum"
              className="inline-flex items-center gap-2 px-6 py-3.5 font-medium text-sm"
              style={{ border: "1px solid var(--border-light)", color: "var(--text-secondary)", borderRadius: 6 }}
            >
              See Curriculum
              <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* PROOF STATS */}
      <section style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
        <div className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {PROOF_POINTS.map((p, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i * 0.1}
              className="text-center md:text-left"
            >
              <div
                className="text-4xl font-bold mb-1"
                style={{ letterSpacing: "-0.02em", color: i === 0 ? "var(--accent)" : "var(--text-primary)" }}
              >
                {p.value}
              </div>
              <div className="text-sm" style={{ color: "var(--text-muted)" }}>{p.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WHO THIS IS FOR */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: "var(--text-muted)" }}>
              Who This Is For
            </p>
            <h2 className="text-4xl font-bold mb-4" style={{ letterSpacing: "-0.02em" }}>
              Not students. Practitioners.
            </h2>
            <p className="mb-12" style={{ color: "var(--text-secondary)" }}>
              This is not a beginner&apos;s course. This is for people already building AI — who want a battle-tested methodology and a credential to prove it.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "The Agency Owner",
                desc: "Already running an AI agency. Wants to systematise their process using Jai.OS 5.0 and stop reinventing the wheel on every client build.",
                icon: Users,
              },
              {
                title: "The Ambitious Freelancer",
                desc: "Building AI products for clients. Needs a credible methodology, a certificate they can put in proposals, and a system that scales.",
                icon: Zap,
              },
              {
                title: "The Corporate AI Lead",
                desc: "Tasked with building their company&#39;s AI agent infrastructure. Needs a proven framework — not a theoretical MBA slide deck.",
                icon: Award,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.15}
                className="p-6"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                }}
              >
                <item.icon className="w-5 h-5 mb-4" style={{ color: "var(--accent)" }} />
                <h3 className="font-bold mb-2 text-sm">{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }} dangerouslySetInnerHTML={{ __html: item.desc }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CURRICULUM */}
      <section
        id="curriculum"
        className="py-24 px-6"
        style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: "var(--text-muted)" }}>
              4-Week Curriculum
            </p>
            <h2 className="text-4xl font-bold mb-4" style={{ letterSpacing: "-0.02em" }}>
              The full Jai.OS 5.0
              <br />
              methodology. Uncut.
            </h2>
            <p className="mb-12 max-w-xl" style={{ color: "var(--text-secondary)" }}>
              Every module is built around a real Antigravity project — not hypothetical examples. You see the actual
              code, the actual agents, and the actual failures we learned from.
            </p>
          </motion.div>

          <div className="space-y-4">
            {CURRICULUM.map((module, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.1}
                className="p-6"
                style={{
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg"
                    style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)" }}
                  >
                    <module.icon className="w-5 h-5" style={{ color: "var(--accent)" }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-mono font-bold" style={{ color: "var(--accent)" }}>
                        {module.week}
                      </span>
                      <h3 className="font-bold text-sm">{module.title}</h3>
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-3">
                      {module.topics.map((t, ti) => (
                        <li key={ti} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                          <span style={{ color: "var(--accent)", marginTop: 2 }}>›</span>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={4}
            className="mt-8 p-6"
            style={{
              background: "rgba(249,115,22,0.05)",
              border: "1px solid rgba(249,115,22,0.2)",
              borderRadius: 8,
            }}
          >
            <div className="flex items-start gap-3">
              <Award className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "var(--accent)" }} />
              <div>
                <h4 className="font-bold text-sm mb-1">Assessment & Certification</h4>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Submit a complete SKILL.md + 1 working agent demo. Your project is reviewed by <strong>@vigil</strong>
                  , the Antigravity truth-verification agent — not a generic rubric. Pass, and you earn{" "}
                  <strong>Jai.OS 5.0 Practitioner — Antigravity Academy</strong>.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* OUTCOMES */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: "var(--text-muted)" }}>
              What You Leave With
            </p>
            <h2 className="text-4xl font-bold mb-12" style={{ letterSpacing: "-0.02em" }}>
              Not just a certificate.
              <br />
              <span style={{ color: "var(--text-secondary)" }}>A working system.</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {OUTCOMES.map((outcome, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.08}
                className="flex items-start gap-3 p-4"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                }}
              >
                <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--accent)" }} />
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{outcome}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING + ENROL */}
      <section
        id="enrol"
        className="py-24 px-6"
        style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: "var(--text-muted)" }}>
              Founding Member Pricing
            </p>
            <h2 className="text-4xl font-bold mb-4" style={{ letterSpacing: "-0.02em" }}>
              20 spots. No extensions.
            </h2>
            <p className="mb-12" style={{ color: "var(--text-secondary)" }}>
              The founding price exists to fill Cohort 1 fast and generate the testimonials that prove this works. Once
              the spots are gone, they&apos;re gone. Standard price from Cohort 2 is £597.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {TIERS.map((tier, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.15}
                className="relative p-6 flex flex-col"
                style={{
                  background: tier.highlight ? "linear-gradient(135deg, rgba(249,115,22,0.08) 0%, transparent 100%)" : "transparent",
                  border: `1px solid ${tier.highlight ? "rgba(249,115,22,0.3)" : "var(--border)"}`,
                  borderRadius: 8,
                }}
              >
                {tier.spots && (
                  <div
                    className="absolute -top-3 left-6 px-3 py-1 text-xs font-bold"
                    style={{ background: "var(--accent)", color: "#fff", borderRadius: 4 }}
                  >
                    {tier.badge}
                  </div>
                )}
                <div className="mb-6">
                  <p className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>
                    {tier.badge}
                  </p>
                  <h3 className="text-lg font-bold mb-2">{tier.name}</h3>
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-4xl font-bold" style={{ letterSpacing: "-0.02em", color: tier.highlight ? "var(--accent)" : "var(--text-primary)" }}>
                      {tier.price}
                    </span>
                    {tier.was && (
                      <span className="text-lg line-through" style={{ color: "var(--text-muted)" }}>
                        {tier.was}
                      </span>
                    )}
                  </div>
                  {tier.spots && (
                    <p className="text-xs font-medium" style={{ color: "var(--accent)" }}>
                      Saves £700 · First {tier.spots} students only
                    </p>
                  )}
                </div>
                <ul className="space-y-2.5 flex-1 mb-8">
                  {tier.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: tier.highlight ? "var(--accent)" : "var(--text-muted)" }} />
                      <span style={{ color: "var(--text-secondary)" }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={tier.highlight ? "#founding-form" : "#founding-form"}
                  className="block text-center py-3 text-sm font-semibold transition-all duration-200 hover:opacity-90"
                  style={{
                    background: tier.highlight ? "var(--accent)" : "transparent",
                    color: tier.highlight ? "#fff" : "var(--text-secondary)",
                    border: tier.highlight ? "none" : "1px solid var(--border-light)",
                    borderRadius: 6,
                  }}
                >
                  {tier.cta}
                </a>
              </motion.div>
            ))}
          </div>

          {/* EMAIL FORM */}
          <motion.div
            id="founding-form"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-lg mx-auto text-center"
          >
            <h3 className="text-xl font-bold mb-2">Claim your founding member spot</h3>
            <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
              Leave your details. We&apos;ll send payment details and onboarding instructions within 24 hours.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3.5 text-sm outline-none"
                style={{
                  background: "var(--bg)",
                  border: "1px solid var(--border-light)",
                  borderRadius: 6,
                  color: "var(--text-primary)",
                }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3.5 text-sm outline-none"
                style={{
                  background: "var(--bg)",
                  border: "1px solid var(--border-light)",
                  borderRadius: 6,
                  color: "var(--text-primary)",
                }}
              />
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="w-full py-3.5 font-semibold text-sm transition-all duration-200 hover:opacity-90 disabled:opacity-50"
                style={{ background: "var(--accent)", color: "#fff", borderRadius: 6 }}
              >
                {status === "loading" ? "Submitting..." : status === "success" ? "Spot Claimed" : "Claim Founding Spot — £297"}
              </button>
            </form>
            <AnimatePresence>
              {message && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm mt-4"
                  style={{ color: status === "success" ? "var(--accent)" : "#ef4444" }}
                >
                  {message}
                </motion.p>
              )}
            </AnimatePresence>
            <p className="text-xs mt-6" style={{ color: "var(--text-muted)" }}>
              No payment taken here. We send details directly. First cohort: 2026-03-10.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-10" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-4 h-4" style={{ color: "var(--accent)" }} />
            <span className="text-sm font-semibold tracking-wider uppercase" style={{ letterSpacing: "0.1em", color: "var(--text-secondary)" }}>
              Antigravity Academy
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              A practitioner certification programme by{" "}
              <a href="https://jonnyai.co.uk" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
                Jonny AI
              </a>
              . Not an academic institution.
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              CPD Accreditation application in progress (CPD Standards Office, 2026).
            </p>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-6 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            © 2026 Antigravity Academy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
