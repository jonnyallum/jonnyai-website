/**
 * BackgroundVideo — ambient, muted, looping background video done properly.
 *
 * The source footage is deliberately *abstracted*: scaled up to crop its
 * edges, heavily blurred, and pushed toward the brand palette by a tint
 * overlay — so recognisable subject matter dissolves into soft moving
 * colour rather than reading as a literal photo/clip. A scrim keeps text
 * legible, and reduced-motion falls back to the (same-treated) poster.
 * Decorative only — pointer-events-none.
 */
export default function BackgroundVideo({
  src,
  poster,
  className = "",
  opacity = 0.55,
  /** CSS filter applied to the media — heavy blur is what abstracts it. */
  filter = "blur(46px) saturate(1.35) brightness(0.8)",
  /** Scale > 1 crops hard edges so the blur has no visible border. */
  scale = 1.4,
  /** Brand-colour wash blended over the media. */
  tint = "linear-gradient(120deg, rgba(217,119,87,0.45), rgba(49,198,169,0.28) 60%, rgba(91,141,239,0.25))",
  /** Dark scrim layered last to guarantee legibility. */
  scrim = "radial-gradient(ellipse 55% 45% at 50% 42%, rgba(7,7,8,0.86) 0%, rgba(7,7,8,0.55) 45%, transparent 72%), linear-gradient(to bottom, rgba(7,7,8,0.75) 0%, rgba(7,7,8,0.35) 40%, rgba(7,7,8,0.85) 100%)",
}: {
  src: string;
  poster: string;
  className?: string;
  opacity?: number;
  filter?: string;
  scale?: number;
  tint?: string;
  scrim?: string;
}) {
  const mediaStyle: React.CSSProperties = {
    opacity,
    filter,
    transform: `scale(${scale})`,
  };
  return (
    <div
      aria-hidden="true"
      className={`bgvid pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ zIndex: 0 }}
    >
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
      {/* Brand tint */}
      <div className="absolute inset-0" style={{ background: tint, mixBlendMode: "color" }} />
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
