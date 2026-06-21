/**
 * BackgroundVideo — ambient, muted, looping background video done properly.
 * Autoplays muted + inline, sits behind content with a dark scrim so text
 * always reads, and falls back to a static poster image when the user
 * prefers reduced motion (the <video> is hidden via CSS, the poster shows).
 * Decorative only — pointer-events-none.
 */
export default function BackgroundVideo({
  src,
  poster,
  className = "",
  opacity = 0.4,
  /** Extra CSS gradient layered over the video to keep content legible. */
  scrim = "linear-gradient(to bottom, rgba(7,7,8,0.6) 0%, rgba(7,7,8,0.4) 50%, rgba(7,7,8,0.85) 100%)",
}: {
  src: string;
  poster: string;
  className?: string;
  opacity?: number;
  scrim?: string;
}) {
  return (
    <div aria-hidden="true" className={`bgvid pointer-events-none absolute inset-0 overflow-hidden ${className}`} style={{ zIndex: 0 }}>
      {/* Poster underlay — also the reduced-motion fallback */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={poster} alt="" className="bgvid-poster absolute inset-0 w-full h-full object-cover" style={{ opacity }} />
      <video
        className="bgvid-video absolute inset-0 w-full h-full object-cover"
        style={{ opacity }}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
      >
        <source src={src} type="video/mp4" />
      </video>
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
