import { Github, Linkedin, Mail } from "lucide-react";

export default function ContactCTA() {
  return (
    <section
      className="py-28 px-6"
      style={{ background: "#fff", color: "#000" }}
    >
      <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-8">
        <h2
          className="text-3xl md:text-5xl font-bold leading-tight"
          style={{ fontFamily: "var(--font-instrument-serif, serif)" }}
        >
          Ready to build something real?
        </h2>
        <p
          className="text-base md:text-lg leading-relaxed max-w-xl mx-auto"
          style={{ color: "rgba(0,0,0,0.55)" }}
        >
          Not a chatbot. Not a proof-of-concept. Production AI infrastructure
          that runs inside your business and does the work.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
          <a
            href="mailto:jonnyallum@gmail.com"
            className="flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold transition-opacity duration-200 hover:opacity-80 text-sm"
            style={{ background: "#000", color: "#fff" }}
          >
            <Mail className="w-4 h-4" />
            jonnyallum@gmail.com
          </a>
          <a
            href="/portfolio/cv"
            className="flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold transition-all duration-200 text-sm hover:bg-black/5"
            style={{
              border: "2px solid #000",
              color: "#000",
            }}
          >
            View CV
          </a>
        </div>

        <div className="flex items-center gap-8 mt-4">
          <a
            href="https://github.com/jonnyallum"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs uppercase tracking-widest transition-colors duration-200 hover:opacity-70"
            style={{ color: "rgba(0,0,0,0.4)" }}
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/jonny-allum-12a757140/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs uppercase tracking-widest transition-colors duration-200 hover:opacity-70"
            style={{ color: "rgba(0,0,0,0.4)" }}
          >
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
