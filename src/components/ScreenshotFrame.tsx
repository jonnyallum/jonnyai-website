import Image from "next/image";

interface ScreenshotFrameProps {
  src: string;
  alt: string;
  /** Faux address-bar label, e.g. "compliance-hub.co.uk". Omit to hide the bar. */
  label?: string;
  /** CSS aspect-ratio, default "16 / 10". Use "4 / 3" for case heroes. */
  aspect?: string;
  /** object-position for the image. Default "top". */
  objectPosition?: string;
  /** Show the soft citrus glow behind the frame. Default true. */
  glow?: boolean;
  /** Accent colour for the glow + address bar dot. Default citrus. */
  accent?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

/**
 * Stages a screenshot inside a dark glass browser frame with a soft accent
 * glow — so flat product screenshots read as intentional, on-brand assets
 * rather than raw captures. Used across the portfolio and case studies.
 */
export default function ScreenshotFrame({
  src,
  alt,
  label,
  aspect = "16 / 10",
  objectPosition = "top",
  glow = true,
  accent = "#D97757",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className = "",
}: ScreenshotFrameProps) {
  return (
    <div className={`relative ${className}`}>
      {glow && (
        <div
          aria-hidden="true"
          className="absolute -inset-6 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 70% 60% at 50% 30%, ${accent}26 0%, transparent 70%)`,
            filter: "blur(8px)",
          }}
        />
      )}

      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          background: "#0d0d10",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow:
            "0 24px 60px -20px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Browser chrome */}
        {label !== undefined && (
          <div
            className="flex items-center gap-2 px-3.5 h-9 shrink-0"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
          >
            <span className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: `${accent}66` }} />
            </span>
            {label && (
              <span
                className="ml-2 flex-1 truncate text-center text-[10px] font-mono px-3 py-1 rounded-md"
                style={{ background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.4)" }}
              >
                {label}
              </span>
            )}
          </div>
        )}

        {/* Image */}
        <div className="relative w-full" style={{ aspectRatio: aspect }}>
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            className="object-cover"
            style={{ objectPosition }}
          />
          {/* Soft bottom fade into the dark canvas */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-1/4 pointer-events-none"
            style={{ background: "linear-gradient(to top, rgba(13,13,16,0.55), transparent)" }}
          />
        </div>
      </div>
    </div>
  );
}
