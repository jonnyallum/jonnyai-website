/**
 * AmbientBackdrop — a slow, cinematic "Ken Burns" drift over a static brand
 * image. Gives a hero real motion without needing video footage (and without
 * any baked-in logo). A scrim keeps text legible; reduced-motion holds it
 * still. Decorative only — pointer-events-none.
 */
export default function AmbientBackdrop({
  image,
  className = "",
  opacity = 0.6,
  /** Tiny blur softens compression detail without dulling it. */
  blur = 1.5,
  scrim = "radial-gradient(ellipse 52% 42% at 50% 40%, rgba(7,7,8,0.8) 0%, rgba(7,7,8,0.38) 45%, transparent 72%), linear-gradient(to bottom, rgba(7,7,8,0.5) 0%, rgba(7,7,8,0.12) 38%, rgba(7,7,8,0.85) 100%)",
}: {
  image: string;
  className?: string;
  opacity?: number;
  blur?: number;
  scrim?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`ambient pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ zIndex: 0 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt=""
        className="ambient-img absolute inset-0 w-full h-full object-cover"
        style={{ opacity, filter: `blur(${blur}px) saturate(1.1)` }}
      />
      {/* Warm brand wash */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 25%, rgba(217,119,87,0.18) 0%, transparent 65%)" }} />
      {/* Legibility scrim */}
      <div className="absolute inset-0" style={{ background: scrim }} />
      <style>{`
        .ambient-img {
          transform-origin: 55% 45%;
          animation: ambientDrift 44s ease-in-out infinite alternate;
          will-change: transform;
        }
        @keyframes ambientDrift {
          from { transform: scale(1.12) translate(0, 0); }
          to   { transform: scale(1.28) translate(-2.5%, -2%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ambient-img { animation: none; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
