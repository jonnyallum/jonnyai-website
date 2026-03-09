"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, FileText, AlertTriangle, CheckCircle, ChevronRight, ArrowRight, Lock, TrendingUp, Zap } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

const RISK_CATEGORIES = [
  "Prompt Injection Resistance",
  "Identity Fragmentation Detection",
  "Data Leakage Surface Analysis",
  "Logic Parity Verification",
  "Hallucination Rate Assessment",
  "Autonomy Boundary Audit",
  "Tool-Use Security Review",
  "Escalation Pathway Integrity",
  "Adversarial Input Tolerance",
  "Decision Traceability Score",
  "Recovery & Rollback Protocol",
  "Deployment Readiness Certification",
  "Board-Level Risk Summary",
];

const PRODUCTS = [
  {
    name: "Standard Agent Audit",
    price: "£997",
    target: "Startups & AI Agencies",
    description: "Full 13-gate risk assessment with written report. Shareable with investors and clients.",
    features: [
      "Complete 13-gate methodology",
      "Antigravity Risk Report PDF",
      "Risk score (0–100)",
      "Remediation checklist",
      "Turnaround: 5 business days",
    ],
    accent: "#64748b",
    popular: false,
  },
  {
    name: "Enterprise Agent Audit",
    price: "£2,497",
    target: "Scale-ups & Series A+",
    description: "Deep-dive assessment with executive briefing. Structured for insurer and board presentation.",
    features: [
      "Everything in Standard",
      "Executive briefing call",
      "Insurer-formatted risk schedule",
      "Board presentation deck",
      "90-day monitoring window",
      "Turnaround: 7 business days",
    ],
    accent: "#e2e8f0",
    popular: true,
  },
  {
    name: "Monthly Monitoring",
    price: "£199/mo",
    target: "Post-audit clients",
    description: "Ongoing risk surveillance. Alerts when your agent's behaviour drifts outside assessed parameters.",
    features: [
      "Continuous agent health checks",
      "Drift detection alerts",
      "Monthly compliance digest",
      "Priority re-assessment access",
    ],
    accent: "#475569",
    popular: false,
  },
];

const FAILURE_STATS = [
  { value: "67%", label: "of enterprises experienced an AI agent failure in 2025" },
  { value: "£2.1M", label: "average cost of a serious AI agent incident" },
  { value: "0", label: "standardised assessment products exist before Antigravity" },
];

export default function AssurancePage() {
  const [email, setEmail] = useState("");
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
        body: JSON.stringify({ email, source: "assurance-waitlist" }),
      });
      if (res.ok) {
        setStatus("success");
        setMessage("You're on the list. We'll be in touch within 48 hours.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage("Something went wrong. Email hello@antigravity-assurance.com directly.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Email hello@antigravity-assurance.com directly.");
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text-primary)" }}>
      <div className="noise-overlay" />

      {/* NAV */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--border)", background: "rgba(8,8,8,0.9)", backdropFilter: "blur(12px)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 flex items-center justify-center"
            style={{ background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: 4 }}
          >
            <Shield className="w-4 h-4" style={{ color: "var(--accent-dim)" }} />
          </div>
          <span className="text-sm font-semibold tracking-wider uppercase" style={{ color: "var(--text-primary)", letterSpacing: "0.12em" }}>
            Antigravity Assurance
          </span>
        </div>
        <a
          href="#waitlist"
          className="text-xs font-medium px-4 py-2 transition-all duration-200"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border-light)",
            borderRadius: 6,
            color: "var(--text-primary)",
          }}
        >
          Join Waitlist
        </a>
      </nav>

      {/* HERO */}
      <section className="relative pt-32 pb-24 px-6 grid-bg overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(100,116,139,0.08) 0%, transparent 70%)" }} />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 text-xs font-medium tracking-widest uppercase"
              style={{
                background: "rgba(30,30,30,0.8)",
                border: "1px solid var(--border-light)",
                borderRadius: 4,
                color: "var(--text-secondary)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#22c55e" }} />
              Accepting assessment applications — Q1 2026
            </div>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            Your AI agent
            <br />
            <span style={{ color: "var(--text-secondary)" }}>is in production.</span>
            <br />
            Who&#39;s accountable?
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-xl max-w-2xl mb-10 leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Antigravity Assurance provides independent AI agent risk assessment using the Gold Standard 13-gate
            methodology. The output your board, insurer, and Series A investors can actually act on.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3} className="flex flex-col sm:flex-row gap-4">
            <a
              href="#waitlist"
              className="inline-flex items-center gap-2 px-6 py-3.5 font-medium text-sm transition-all duration-200 hover:opacity-90"
              style={{
                background: "var(--text-primary)",
                color: "var(--bg)",
                borderRadius: 6,
              }}
            >
              Request an Assessment
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#methodology"
              className="inline-flex items-center gap-2 px-6 py-3.5 font-medium text-sm transition-all duration-200"
              style={{
                border: "1px solid var(--border-light)",
                color: "var(--text-secondary)",
                borderRadius: 6,
              }}
            >
              View Methodology
              <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {FAILURE_STATS.map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              className="text-center md:text-left"
            >
              <div className="text-4xl font-bold mb-1" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                {stat.value}
              </div>
              <div className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WHY NOW */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: "var(--text-muted)" }}>
              The Problem
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight" style={{ letterSpacing: "-0.02em" }}>
              The market trusts your product.
              <br />
              <span style={{ color: "var(--text-secondary)" }}>Nobody has assessed your agents.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {[
              {
                icon: AlertTriangle,
                title: "Hallucinated outputs at scale",
                desc: "A single prompt-injected support bot gave away 100% discount codes. The cost: £400k in fraudulent claims before detection.",
              },
              {
                icon: Lock,
                title: "Data leakage you didn't know existed",
                desc: "LLMs trained on internal data will surface it. Identity fragmentation means your agent doesn't know where the boundary is.",
              },
              {
                icon: TrendingUp,
                title: "Insurers can't price what they can't see",
                desc: "Lloyd's Testudo launched AI underwriting this week. Without an assessment, you can't get cover — or you're priced punitively.",
              },
              {
                icon: FileText,
                title: "Boards are asking questions you can't answer",
                desc: '"Has this been audited?" is the question your enterprise customers, board, and investors are starting to ask. Now you have an answer.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.5}
                className="p-6"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                }}
              >
                <item.icon className="w-5 h-5 mb-4" style={{ color: "var(--text-muted)" }} />
                <h3 className="font-semibold mb-2 text-sm" style={{ color: "var(--text-primary)" }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* METHODOLOGY */}
      <section
        id="methodology"
        className="py-24 px-6"
        style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: "var(--text-muted)" }}>
              The Gold Standard — 13 Gates
            </p>
            <h2 className="text-4xl font-bold mb-4" style={{ letterSpacing: "-0.02em" }}>
              What we actually test.
            </h2>
            <p className="text-sm mb-12 max-w-xl" style={{ color: "var(--text-secondary)" }}>
              We publish the categories. The specific test vectors are proprietary — same as any penetration testing firm.
              Your competitors can&#39;t reverse-engineer your audit results.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {RISK_CATEGORIES.map((cat, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.05}
                className="flex items-center gap-3 px-4 py-3"
                style={{
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                }}
              >
                <span
                  className="text-xs font-mono font-bold"
                  style={{ color: "var(--text-muted)", minWidth: 24 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                  {cat}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: "var(--text-muted)" }}>
              Assessment Products
            </p>
            <h2 className="text-4xl font-bold mb-12" style={{ letterSpacing: "-0.02em" }}>
              Choose your assessment tier.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRODUCTS.map((product, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.15}
                className="relative flex flex-col p-6"
                style={{
                  background: product.popular ? "var(--surface)" : "transparent",
                  border: `1px solid ${product.popular ? "var(--border-light)" : "var(--border)"}`,
                  borderRadius: 8,
                }}
              >
                {product.popular && (
                  <div
                    className="absolute -top-3 left-6 px-3 py-1 text-xs font-semibold tracking-widest uppercase"
                    style={{
                      background: "var(--text-primary)",
                      color: "var(--bg)",
                      borderRadius: 4,
                    }}
                  >
                    Recommended
                  </div>
                )}
                <div className="mb-6">
                  <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>
                    {product.target}
                  </p>
                  <h3 className="text-lg font-bold mb-1">{product.name}</h3>
                  <div className="text-3xl font-bold mb-3" style={{ letterSpacing: "-0.02em" }}>
                    {product.price}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {product.description}
                  </p>
                </div>
                <ul className="space-y-2.5 flex-1 mb-8">
                  {product.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--text-muted)" }} />
                      <span style={{ color: "var(--text-secondary)" }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#waitlist"
                  className="block text-center py-3 text-sm font-medium transition-all duration-200"
                  style={{
                    background: product.popular ? "var(--text-primary)" : "transparent",
                    color: product.popular ? "var(--bg)" : "var(--text-secondary)",
                    border: product.popular ? "none" : "1px solid var(--border-light)",
                    borderRadius: 6,
                  }}
                >
                  Request Assessment
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO WE SERVE */}
      <section
        className="py-24 px-6"
        style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: "var(--text-muted)" }}>
              Who We Serve
            </p>
            <h2 className="text-4xl font-bold mb-12" style={{ letterSpacing: "-0.02em" }}>
              Built for the builder with production agents.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                role: "Startup CTO",
                scenario: "Just integrated an AI agent. Series A investors are asking whether it&#39;s been audited. You need a report in one week.",
                icon: Zap,
              },
              {
                role: "AI Agency Owner",
                scenario: "You want to offer clients certified deliverables. \"Antigravity Assessed\" becomes your quality mark and your differentiator.",
                icon: Shield,
              },
              {
                role: "SaaS Product Lead",
                scenario: "Your enterprise customer just asked \"has this AI feature been audited?\" You can&#39;t close the deal without an answer.",
                icon: TrendingUp,
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
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                }}
              >
                <item.icon className="w-5 h-5 mb-4" style={{ color: "var(--text-muted)" }} />
                <h3 className="font-bold mb-3 text-sm tracking-wide">{item.role}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }} dangerouslySetInnerHTML={{ __html: item.scenario }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WAITLIST */}
      <section id="waitlist" className="py-32 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: "var(--text-muted)" }}>
              Q1 2026 — Limited Assessment Slots
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ letterSpacing: "-0.02em" }}>
              Get your agent
              <br />
              on the assessment list.
            </h2>
            <p className="mb-12" style={{ color: "var(--text-secondary)" }}>
              We&apos;re onboarding our first cohort of assessments in Q1 2026. Leave your email and we&apos;ll be in
              touch within 48 hours to discuss your agent&apos;s deployment context.
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-6"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@company.com"
              required
              className="flex-1 px-4 py-3.5 text-sm outline-none"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border-light)",
                borderRadius: 6,
                color: "var(--text-primary)",
              }}
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="px-6 py-3.5 font-medium text-sm whitespace-nowrap transition-all duration-200 hover:opacity-90 disabled:opacity-50"
              style={{
                background: "var(--text-primary)",
                color: "var(--bg)",
                borderRadius: 6,
              }}
            >
              {status === "loading" ? "Submitting..." : status === "success" ? "You&#39;re in" : "Request Assessment"}
            </button>
          </motion.form>

          <AnimatePresence>
            {message && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm"
                style={{ color: status === "success" ? "var(--green)" : "var(--red)" }}
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
            className="text-xs mt-8"
            style={{ color: "var(--text-muted)" }}
          >
            No spam. No commitment. We&#39;ll outline the assessment process and quote within 48 hours.
          </motion.p>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="px-6 py-10"
        style={{ borderTop: "1px solid var(--border)", background: "var(--surface)" }}
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
            <span className="text-sm font-semibold tracking-wider uppercase" style={{ letterSpacing: "0.1em", color: "var(--text-secondary)" }}>
              Antigravity Assurance
            </span>
          </div>
          <div className="text-xs leading-relaxed max-w-xl" style={{ color: "var(--text-muted)" }}>
            Antigravity Assurance is a risk assessment consultancy. We do not sell, refer, or earn commission from
            insurance products. All assessments include a standard disclaimer. Reports reflect agent behaviour at time of
            testing and do not guarantee future performance. Professional Indemnity Insurance held with Hiscox.
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-6 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            © 2026 Antigravity Assurance. All rights reserved. Methodology by Antigravity Agency, London.
          </p>
        </div>
      </footer>
    </div>
  );
}
