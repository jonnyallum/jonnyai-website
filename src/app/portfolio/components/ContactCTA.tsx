import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

export default function ContactCTA() {
  return (
    <section
      className="relative overflow-hidden py-28 px-6"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(217,119,87,0.1) 0%, transparent 70%)" }}
      />
      <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center gap-8">
        <p
          className="text-xs uppercase tracking-[0.3em] font-semibold"
          style={{ color: "#D97757", fontFamily: "monospace" }}
        >
          Let&rsquo;s build
        </p>
        <h2
          className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          Ready to build something real?
        </h2>
        <p
          className="text-base md:text-lg leading-relaxed max-w-xl mx-auto"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          Brand, website, app, content and automation — or production software that
          runs inside your business and does the work. Tell me what you need and
          I&rsquo;ll come back with a clear, fixed-price plan.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
          <Link href="/brief" className="btn-citrus py-3.5 px-8 text-sm">
            Start a Project →
          </Link>
          <a
            href="mailto:hello@jonnyai.co.uk"
            className="btn-ghost py-3.5 px-8 text-sm normal-case tracking-normal"
          >
            <Mail className="w-4 h-4 mr-2" />
            hello@jonnyai.co.uk
          </a>
        </div>

        <div className="flex items-center gap-8 mt-2">
          <a
            href="https://github.com/jonnyallum"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs uppercase tracking-widest transition-colors duration-200 hover:text-white"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/jonnyallum/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs uppercase tracking-widest transition-colors duration-200 hover:text-white"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
