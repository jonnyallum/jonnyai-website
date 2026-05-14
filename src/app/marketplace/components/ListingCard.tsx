import Link from "next/link";
import { ExternalLink, Github, ArrowRight } from "lucide-react";
import type { MarketplaceListing } from "@/lib/data/marketplace";

function formatGbpRange(range: { low: number; high: number } | null) {
  if (!range) return null;
  const fmt = (n: number) =>
    n >= 1000 ? `£${(n / 1000).toLocaleString("en-GB", { maximumFractionDigits: 1 })}k` : `£${n}`;
  return `${fmt(range.low)} – ${fmt(range.high)}`;
}

export default function ListingCard({ listing }: { listing: MarketplaceListing }) {
  const saleRange = formatGbpRange(listing.priceGbp);
  const fundRange = formatGbpRange(listing.fundingGbp);
  const isSaas = listing.track === "saas" && listing.saasPricing;

  const subject = encodeURIComponent(
    listing.track === "for-sale"
      ? `Interested in acquiring ${listing.title}`
      : listing.track === "saas"
      ? `Subscribe to ${listing.title}`
      : `Interested in ${listing.title} (fund / acquire)`
  );
  const mailto = `mailto:info@jonnyai.co.uk?subject=${subject}`;

  return (
    <article
      className="rounded-lg p-6 md:p-7 flex flex-col h-full"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h3 className="text-xl md:text-2xl font-semibold mb-1 text-white truncate">
            {listing.title}
          </h3>
          {listing.domain && (
            <p className="text-xs tracking-wide" style={{ color: "rgba(255,255,255,0.45)" }}>
              {listing.domain}
            </p>
          )}
        </div>
        <span
          className="shrink-0 text-[10px] uppercase tracking-[0.18em] px-2.5 py-1 rounded font-medium"
          style={{
            background: isSaas
              ? "rgba(110, 231, 139, 0.14)"
              : listing.percentComplete >= 85
              ? "rgba(110, 231, 139, 0.14)"
              : listing.percentComplete >= 55
              ? "rgba(217, 119, 87, 0.15)"
              : "rgba(239, 190, 90, 0.12)",
            color: isSaas
              ? "#6EE78B"
              : listing.percentComplete >= 85
              ? "#6EE78B"
              : listing.percentComplete >= 55
              ? "#D97757"
              : "#EFBE5A",
          }}
        >
          {isSaas ? "Live · subscribe now" : `${listing.percentComplete}% built`}
        </span>
      </div>

      <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.75)" }}>
        {listing.tagline}
      </p>

      <div className="mb-5">
        <p
          className="text-[10px] uppercase tracking-[0.2em] mb-2"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          Stack
        </p>
        <div className="flex flex-wrap gap-1.5">
          {listing.stack.map((t) => (
            <span
              key={t}
              className="text-[11px] px-2 py-1 rounded"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.65)" }}>
        {listing.summary}
      </p>

      {listing.includes.length > 0 && (
        <div className="mb-5">
          <p
            className="text-[10px] uppercase tracking-[0.2em] mb-2"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Included in sale
          </p>
          <ul className="space-y-1">
            {listing.includes.map((i) => (
              <li
                key={i}
                className="text-[13px] pl-4 relative"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                <span
                  className="absolute left-0 top-[9px] w-1.5 h-1.5 rounded-full"
                  style={{ background: "#D97757" }}
                />
                {i}
              </li>
            ))}
          </ul>
        </div>
      )}

      <details className="mb-5 group">
        <summary
          className="text-[11px] uppercase tracking-[0.2em] cursor-pointer list-none flex items-center gap-2"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          <span className="group-open:rotate-90 transition-transform">▸</span>
          What's built · what's left
        </summary>
        <div className="mt-3 grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "#6EE78B" }}>
              Built
            </p>
            <ul className="space-y-1">
              {listing.builtFeatures.map((f) => (
                <li key={f} className="text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>
                  · {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "#EFBE5A" }}>
              Remaining
            </p>
            <ul className="space-y-1">
              {listing.remaining.map((f) => (
                <li key={f} className="text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>
                  · {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </details>

      <div className="mt-auto pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        {isSaas && listing.saasPricing && (
          <div className="mb-5">
            <p
              className="text-[10px] uppercase tracking-[0.2em] mb-3"
              style={{ color: "#6EE78B" }}
            >
              Subscription pricing
            </p>
            <ul className="space-y-2">
              {listing.saasPricing.tiers.map((tier) => (
                <li
                  key={tier.name}
                  className="text-xs p-3 rounded"
                  style={{
                    background: "rgba(110, 231, 139, 0.04)",
                    border: "1px solid rgba(110, 231, 139, 0.12)",
                  }}
                >
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <span className="font-semibold" style={{ color: "#fff" }}>
                      {tier.name}
                    </span>
                    <span className="font-semibold" style={{ color: "#6EE78B" }}>
                      £{tier.monthlyGbp}/mo
                      {tier.setupGbp ? ` + £${tier.setupGbp.toLocaleString("en-GB")} setup` : ""}
                    </span>
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.55)" }}>
                    {tier.includesUserCap} · {tier.includesSiteCap}
                  </p>
                </li>
              ))}
            </ul>
            <p
              className="text-[11px] mt-2 italic"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              Overage: £{listing.saasPricing.overagePerUserGbp}/user/mo above tier cap (Starter and
              Pro).
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-baseline gap-4 mb-4">
          {saleRange && (
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.2em] mb-0.5"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                Sale price
              </p>
              <p className="text-lg font-semibold" style={{ color: "#D97757" }}>
                {saleRange}
              </p>
            </div>
          )}
          {fundRange && (
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.2em] mb-0.5"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                Funding to complete
              </p>
              <p className="text-lg font-semibold" style={{ color: "#EFBE5A" }}>
                {fundRange}
              </p>
            </div>
          )}
        </div>

        <p className="text-xs mb-4 italic" style={{ color: "rgba(255,255,255,0.5)" }}>
          <span style={{ color: "rgba(255,255,255,0.7)" }}>Ideal buyer:</span> {listing.buyerProfile}
        </p>

        <div className="flex flex-wrap gap-2">
          <a
            href={mailto}
            className="inline-flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded transition-opacity hover:opacity-85"
            style={{
              background: isSaas ? "#6EE78B" : "#D97757",
              color: "#0A0A0A",
            }}
          >
            {isSaas ? "Subscribe / enquire" : "Make an offer"} <ArrowRight className="w-3 h-3" />
          </a>
          {isSaas && listing.saasPricing?.caseStudySlug && (
            <Link
              href={`/portfolio/case-studies/${listing.saasPricing.caseStudySlug}`}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded transition-colors"
              style={{
                color: "rgba(255,255,255,0.65)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              Case study <ArrowRight className="w-3 h-3" />
            </Link>
          )}
          {listing.liveUrl && (
            <Link
              href={listing.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded transition-colors"
              style={{
                color: "rgba(255,255,255,0.65)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              Live site <ExternalLink className="w-3 h-3" />
            </Link>
          )}
          {listing.repoUrl && (
            <Link
              href={listing.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded transition-colors"
              style={{
                color: "rgba(255,255,255,0.65)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              Repo <Github className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
