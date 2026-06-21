/**
 * BizOSBrain — the flagship "one brain" visual.
 * A glowing core (deterministic engines) wrapped by three orbiting rings
 * of agent nodes (the JAIOS swarm) with faint synapse paths. Pure SVG + CSS,
 * so it's crisp at any size, weightless, themeable, and frozen under
 * prefers-reduced-motion. Decorative only — pointer-events-none.
 */

const ORBITS = [
  { r: 90, nodes: 6, dur: 36, dir: 1, color: "#D97757", size: 4.5 },
  { r: 140, nodes: 9, dur: 52, dir: -1, color: "#31C6A9", size: 3.8 },
  { r: 192, nodes: 12, dur: 72, dir: 1, color: "#5B8DEF", size: 3.2 },
];

export default function BizOSBrain({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`brain pointer-events-none ${className}`}>
      <svg viewBox="-220 -220 440 440" className="w-full h-full">
        <defs>
          <radialGradient id="brainCore" cx="50%" cy="42%" r="60%">
            <stop offset="0%" stopColor="#FFF6E9" />
            <stop offset="28%" stopColor="#FFC98A" />
            <stop offset="62%" stopColor="#D97757" />
            <stop offset="100%" stopColor="#7a2d12" />
          </radialGradient>
          <radialGradient id="brainGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(217,119,87,0.55)" />
            <stop offset="55%" stopColor="rgba(217,119,87,0.12)" />
            <stop offset="100%" stopColor="rgba(217,119,87,0)" />
          </radialGradient>
          <filter id="brainBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
        </defs>

        {/* Ambient glow */}
        <circle cx="0" cy="0" r="210" fill="url(#brainGlow)" className="brain-breathe" />

        {/* Orbit rings + nodes */}
        {ORBITS.map((orbit, oi) => (
          <g
            key={oi}
            className="brain-orbit"
            style={{
              transformOrigin: "0 0",
              animation: `brainSpin ${orbit.dur}s linear infinite`,
              animationDirection: orbit.dir === -1 ? "reverse" : "normal",
            }}
          >
            <circle cx="0" cy="0" r={orbit.r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            {Array.from({ length: orbit.nodes }).map((_, ni) => {
              const a = (ni / orbit.nodes) * Math.PI * 2;
              const x = Math.cos(a) * orbit.r;
              const y = Math.sin(a) * orbit.r;
              return (
                <g key={ni}>
                  <line x1="0" y1="0" x2={x} y2={y} stroke={orbit.color} strokeOpacity="0.07" strokeWidth="1" />
                  <circle cx={x} cy={y} r={orbit.size} fill={orbit.color} filter="url(#brainBlur)" />
                  <circle cx={x} cy={y} r={orbit.size * 0.55} fill="#fff" fillOpacity="0.85" />
                </g>
              );
            })}
          </g>
        ))}

        {/* Core */}
        <circle cx="0" cy="0" r="46" fill="url(#brainGlow)" className="brain-breathe" />
        <circle cx="0" cy="0" r="26" fill="url(#brainCore)" className="brain-core" />
        <circle cx="-8" cy="-9" r="7" fill="#fff" fillOpacity="0.85" filter="url(#brainBlur)" />
      </svg>

      <style>{`
        .brain { aspect-ratio: 1; }
        @keyframes brainSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .brain-core { transform-origin: 0 0; animation: brainCorePulse 4.5s ease-in-out infinite; }
        .brain-breathe { transform-origin: 0 0; animation: brainBreathe 6s ease-in-out infinite; }
        @keyframes brainCorePulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @keyframes brainBreathe { 0%,100% { opacity: 0.75; transform: scale(1); } 50% { opacity: 1; transform: scale(1.06); } }
        @media (prefers-reduced-motion: reduce) {
          .brain-orbit, .brain-core, .brain-breathe { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
