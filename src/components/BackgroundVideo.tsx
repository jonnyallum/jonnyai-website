/**
 * BackgroundVideo — ambient, muted, looping background video done properly.
 *
 * The footage is recoloured through an SVG tri-tone (void → teal → citrus)
 * and only lightly blurred, so it reads as vivid branded *motion* rather
 * than a literal clip — energetic, not a dull wash. A scrim keeps text
 * legible, and reduced-motion falls back to the (same-treated) poster.
 * Decorative only — pointer-events-none.
 */
export default function BackgroundVideo({
  src,
  poster,
  className = "",
  opacity = 0.8,
  /** Light blur keeps motion lively while softening literal detail. */
  blur = 7,
  /** Scale > 1 crops hard edges. */
  scale = 1.2,
  /** Dark scrim layered last to guarantee legibility. */
  scrim = "radial-gradient(ellipse 52% 42% at 50% 40%, rgba(7,7,8,0.82) 0%, rgba(7,7,8,0.4) 45%, transparent 72%), linear-gradient(to bottom, rgba(7,7,8,0.55) 0%, rgba(7,7,8,0.12) 38%, rgba(7,7,8,0.82) 100%)",
}: {
  src: string;
  poster: string;
  className?: string;
  opacity?: number;
  blur?: number;
  scale?: number;
  scrim?: string;
}) {
  const mediaStyle: React.CSSProperties = {
    opacity,
    filter: `url(#jai-duotone) blur(${blur}px) contrast(1.15)`,
    transform: `scale(${scale})`,
  };
  return (
    <div
      aria-hidden="true"
      className={`bgvid pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ zIndex: 0 }}
    >
      {/* Tri-tone recolour: shadows → void, mids → teal, highlights → citrus */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <filter id="jai-duotone" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="0.33 0.33 0.33 0 0
                    0.33 0.33 0.33 0 0
                    0.33 0.33 0.33 0 0
                    0    0    0    1 0"
          />
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0.027 0.19 0.85" />
            <feFuncG type="table" tableValues="0.027 0.78 0.47" />
            <feFuncB type="table" tableValues="0.031 0.66 0.34" />
          </feComponentTransfer>
        </filter>
      </svg>

      {/* Poster underlay — also the reduced-motion fallback */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={poster} alt="" className="bgvid-poster absolute inset-0 w-full h-full object-cover" style={mediaStyle} />
      <video
        className="bgvid-video absolute inset-0 w-full h-full object-cover"
        style={mediaStyle}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={poster}
      >
        <source src={src} type="video/mp4" />
      </video>
      {/* Legibility scrim */}
      <div className="absolute inset-0" style={{ background: scrim }} />
      <style>{`
        .bgvid-poster { display: none; }
        @media (prefers-reduced-motion: reduce) {
          .bgvid-video { display: none; }
          .bgvid-poster { display: block; }
        }
      `}</style>
    </div>
  );
}
