import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ListingCard from "./components/ListingCard";
import { getByTrack } from "@/lib/data/marketplace";

export const metadata: Metadata = {
  title: "Marketplace — Projects For Sale & Seeking Funding · JonnyAI",
  description:
    "Finished websites, tools and platforms for sale, plus unfinished products seeking acquisition or funding. Direct from the builder.",
};

export default function MarketplacePage() {
  const forSale = getByTrack("for-sale");
  const fundOrAcquire = getByTrack("fund-or-acquire");

  return (
    <div className="min-h-screen" style={{ background: "#0A0A0A", color: "#fff" }}>
      {/* ─── HERO ─── */}
      <section className="pt-32 pb-12 px-6 md:px-10 max-w-6xl mx-auto">
        <p
          className="text-xs uppercase tracking-[0.3em] mb-6 font-medium"
          style={{ color: "#D97757" }}
        >
          Marketplace · Direct from the builder
        </p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Projects for sale.<br />
          Products seeking funding.
        </h1>
        <p
          className="text-lg md:text-xl max-w-3xl leading-relaxed mb-8"
          style={{ color: "rgba(255,255,255,0.7)" }}
        >
          Some of these were built, delivered, and never paid for — they&apos;re now on the block. Others are
          unfinished platforms with real traction or architecture, available for acquisition or a
          funded completion sprint. Every one is a working repo, not a pitch deck.
        </p>

        <div className="flex flex-wrap gap-4 text-xs">
          <a
            href="#for-sale"
            className="inline-flex items-center gap-2 px-5 py-3 rounded font-medium transition-opacity hover:opacity-85"
            style={{ background: "#D97757", color: "#0A0A0A" }}
          >
            For sale ({forSale.length}) <ArrowRight className="w-3 h-3" />
          </a>
          <a
            href="#fund-or-acquire"
            className="inline-flex items-center gap-2 px-5 py-3 rounded font-medium transition-colors"
            style={{
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            Fund or acquire ({fundOrAcquire.length}) <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </section>

      {/* ─── FOR SALE ─── */}
      <section
        id="for-sale"
        className="py-16 px-6 md:px-10 max-w-6xl mx-auto scroll-mt-24"
      >
        <div className="mb-10">
          <p
            className="text-[11px] uppercase tracking-[0.3em] mb-3"
            style={{ color: "#D97757" }}
          >
            Track 01 — For sale
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Built. Delivered. Unpaid.
          </h2>
          <p className="max-w-3xl text-base" style={{ color: "rgba(255,255,255,0.65)" }}>
            These sites were commissioned by clients who went dark on the invoice. They&apos;re complete
            enough to stand on their own and each sale includes the domain, matching email inbox,
            Google Business Profile and full GitHub repo. First serious offer takes it.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {forSale.map((l) => (
            <ListingCard key={l.slug} listing={l} />
          ))}
        </div>
      </section>

      {/* ─── FUND OR ACQUIRE ─── */}
      <section
        id="fund-or-acquire"
        className="py-16 px-6 md:px-10 max-w-6xl mx-auto scroll-mt-24"
      >
        <div className="mb-10">
          <p
            className="text-[11px] uppercase tracking-[0.3em] mb-3"
            style={{ color: "#EFBE5A" }}
          >
            Track 02 — Fund or acquire
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Unfinished products. Real architecture.
          </h2>
          <p className="max-w-3xl text-base" style={{ color: "rgba(255,255,255,0.65)" }}>
            Each of these is a working codebase with a clear remaining scope. Two routes: buy the
            asset as-is at the sale price, or fund the completion sprint at the funding figure and
            take the finished product to market under a revenue share or full acquisition.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {fundOrAcquire.map((l) => (
            <ListingCard key={l.slug} listing={l} />
          ))}
        </div>
      </section>

      {/* ─── CONTACT CTA ─── */}
      <section className="py-20 px-6 md:px-10 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Serious enquiries only.
        </h2>
        <p className="text-base mb-8" style={{ color: "rgba(255,255,255,0.65)" }}>
          Every project here is transferable with full source, domain, and handover call. Offers
          below the stated range will not be replied to. Offers within range get a response the same
          day.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="mailto:jonny@littlejonnys.co.uk?subject=Marketplace%20enquiry"
            className="inline-flex items-center gap-2 px-6 py-3 rounded font-medium transition-opacity hover:opacity-85"
            style={{ background: "#D97757", color: "#0A0A0A" }}
          >
            jonny@littlejonnys.co.uk <ArrowRight className="w-3 h-3" />
          </a>
          <Link
            href="/brief"
            className="inline-flex items-center gap-2 px-6 py-3 rounded font-medium"
            style={{
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            Structured brief form
          </Link>
        </div>
      </section>
    </div>
  );
}
