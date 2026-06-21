/**
 * AtmosphereField — soft, slow-drifting brand "aurora".
 * Pure CSS blurred radial blobs in citrus + teal over the void, so flat
 * sections gain depth without leaning on screenshots. GPU-friendly,
 * pointer-events-none, and frozen for prefers-reduced-motion.
 */
export default function AtmosphereField({
  className = "",
  intensity = 0.5,
}: {
  className?: string;
  /** 0–1 multiplier on blob opacity. Default 0.5 (subtle). */
  intensity?: number;
}) {
  const o = (n: number) => Math.min(1, n * intensity);
  return (
    <div
      aria-hidden="true"
      className={`atmos pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ zIndex: 0 }}
    >
      <span className="atmos-blob atmos-1" style={{ background: `radial-gradient(circle, rgba(217,119,87,${o(0.5)}) 0%, transparent 65%)` }} />
      <span className="atmos-blob atmos-2" style={{ background: `radial-gradient(circle, rgba(49,198,169,${o(0.32)}) 0%, transparent 65%)` }} />
      <span className="atmos-blob atmos-3" style={{ background: `radial-gradient(circle, rgba(91,141,239,${o(0.22)}) 0%, transparent 65%)` }} />
      <style>{`
        .atmos-blob {
          position: absolute;
          border-radius: 9999px;
          filter: blur(70px);
          will-change: transform;
        }
        .atmos-1 { width: 46vw; height: 46vw; top: -10%; left: -8%; animation: atmosDrift1 26s ease-in-out infinite; }
        .atmos-2 { width: 40vw; height: 40vw; bottom: -14%; right: -6%; animation: atmosDrift2 32s ease-in-out infinite; }
        .atmos-3 { width: 34vw; height: 34vw; top: 30%; left: 45%; animation: atmosDrift3 38s ease-in-out infinite; }
        @keyframes atmosDrift1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(8vw,6vh) scale(1.12); } }
        @keyframes atmosDrift2 { 0%,100% { transform: translate(0,0) scale(1.05); } 50% { transform: translate(-7vw,-5vh) scale(0.95); } }
        @keyframes atmosDrift3 { 0%,100% { transform: translate(0,0) scale(0.95); } 50% { transform: translate(-5vw,7vh) scale(1.1); } }
        @media (prefers-reduced-motion: reduce) {
          .atmos-blob { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
