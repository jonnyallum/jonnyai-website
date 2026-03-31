import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

export default function ContactCTA() {
  return (
    <section
      className="py-24 px-6"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-8">
        <div>
          <h2
            className="text-3xl md:text-4xl font-bold mb-4 leading-tight"
            style={{ fontFamily: "var(--font-instrument-serif, serif)" }}
          >
            Ready to build real AI infrastructure?
          </h2>
          <p
            className="text-base md:text-lg leading-relaxed max-w-xl mx-auto"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Not a chatbot. Not an integration. Real systems that run inside your
            business and do the work. Let&#39;s talk about what you need.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <a
            href="mailto:jonnyallum@gmail.com"
            className="flex items-center gap-2 px-6 py-3 rounded-sm font-medium transition-opacity duration-200 hover:opacity-80 text-sm"
            style={{ background: "#D97757", color: "#0A0A0A" }}
          >
            <Mail className="w-4 h-4" />
            jonnyallum@gmail.com
          </a>
          <a
            href="/portfolio/cv"
            className="flex items-center gap-2 px-6 py-3 rounded-sm font-medium transition-all duration-200 text-sm"
            style={{
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            View CV
          </a>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://github.com/jonnyallum"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs uppercase tracking-widest transition-colors duration-200 hover:text-white"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/jonnyallum"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs uppercase tracking-widest transition-colors duration-200 hover:text-white"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </a>
          <a
            href="https://jonnyai.co.uk"
            className="flex items-center gap-2 text-xs uppercase tracking-widest transition-colors duration-200 hover:text-white"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            jonnyai.co.uk
          </a>
        </div>
      </div>
    </section>
  );
}
