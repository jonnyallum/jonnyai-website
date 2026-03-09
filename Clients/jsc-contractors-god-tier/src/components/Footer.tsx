import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="md:col-span-2">
            <Link href="/" className="relative group">
              <div className="h-16 w-48 relative mb-12 transition-all duration-700 group-hover:scale-105">
                <Image
                  src="/assets/jsc-logo-white.svg"
                  alt="JSC Contractors"
                  fill
                  className="object-contain transition-all duration-700"
                  priority
                />
              </div>
            </Link>
            <p className="text-white/40 text-lg font-sans max-w-sm mb-12 italic leading-relaxed">
              &ldquo;Building legacies for 20 years across Portsmouth, Hampshire and West Sussex through precision carpentry and master contracting.&rdquo;
            </p>
            <div className="flex gap-8">
              <Link
                href="https://www.instagram.com/jsc_carpentrycontractors/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] uppercase tracking-widest text-white/60 hover:text-accent transition-colors font-black"
              >
                Instagram
              </Link>
              <Link
                href="https://www.houzz.co.uk/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] uppercase tracking-widest text-white/60 hover:text-accent transition-colors font-black"
              >
                Houzz
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.4em] font-black mb-8 text-neutral-500">Residential</h4>
            <div className="flex flex-col space-y-4 text-[12px] font-sans text-white/50">
              <Link href="/services/" className="hover:text-accent transition-colors">Luxury Extensions</Link>
              <Link href="/services/" className="hover:text-accent transition-colors">Bespoke Loft Conversions</Link>
              <Link href="/services/" className="hover:text-accent transition-colors">Custom New Builds</Link>
              <Link href="/services/" className="hover:text-accent transition-colors">Traditional Cut & Pitch Roofing</Link>
              <Link href="/services/" className="hover:text-accent transition-colors">Kitchen & Bathroom Fitting</Link>
              <Link href="/services/" className="hover:text-accent transition-colors">Bespoke Summer Houses</Link>
              <Link href="/services/" className="hover:text-accent transition-colors">Premium Decking & Fencing</Link>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.4em] font-black mb-8 text-neutral-500">Company</h4>
            <div className="flex flex-col space-y-4 text-[12px] font-sans text-white/50 mb-12">
              <Link href="/services/" className="hover:text-accent transition-colors">Our Services</Link>
              <Link href="/projects/" className="hover:text-accent transition-colors">Case Studies</Link>
              <Link href="/about/" className="hover:text-accent transition-colors">About JSC</Link>
              <Link href="/contact/" className="hover:text-accent transition-colors font-black text-white">Contact & Quotes</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-12 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col items-center md:items-start gap-4">
               <span className="text-[10px] uppercase tracking-widest text-neutral-600">
                © 2026 JSC Contractors Ltd. All rights reserved. Registered in England.
              </span>
              <div className="flex gap-8 text-[10px] uppercase tracking-widest text-neutral-700 font-bold">
                <span>Hampshire & West Sussex</span>
                <span>Est. 2004</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-3">
              <p className="text-[10px] uppercase tracking-[0.5em] text-neutral-400 font-black mb-2">Direct Contact</p>
              <Link href="tel:07506699826" className="text-xl md:text-2xl font-serif text-white hover:text-accent transition-colors">07506 699 826</Link>
              <Link href="mailto:info@jsccontractors.co.uk" className="text-xs font-sans text-neutral-500 hover:text-accent transition-colors font-medium">info@jsccontractors.co.uk</Link>
            </div>
          </div>

          {/* JonnyAI Signature - God-Tier Branding */}
          <div className="border-t border-white/10 pt-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <Link
                href="https://jonnyai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center md:items-start gap-2"
              >
                <div className="flex items-center gap-3 text-neutral-500 group-hover:text-accent transition-colors duration-500">
                  <span className="text-[10px] uppercase tracking-[0.5em] font-medium">Built by</span>
                  <span className="text-lg font-serif italic tracking-wider group-hover:text-white transition-colors">JonnyAI</span>
                </div>
                <div className="w-full h-[1px] bg-neutral-900 group-hover:bg-accent transition-all duration-700" />
              </Link>
              
              <div className="flex flex-col items-center md:items-end gap-3 text-center md:text-right">
                <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-700 font-black">
                  Antigravity Orchestra 4.0 Engineers:
                </p>
                <div className="flex flex-wrap justify-center md:justify-end gap-x-4 gap-y-2 text-[8px] uppercase tracking-[0.2em] text-neutral-800">
                  <span className="px-2 py-1 border border-neutral-900 hover:border-accent hover:text-accent transition-colors">@Priya</span>
                  <span className="px-2 py-1 border border-neutral-900 hover:border-accent hover:text-accent transition-colors">@Vivienne</span>
                  <span className="px-2 py-1 border border-neutral-900 hover:border-accent hover:text-accent transition-colors">@Blaise</span>
                  <span className="px-2 py-1 border border-neutral-900 hover:border-accent hover:text-accent transition-colors">@Elena</span>
                  <span className="px-2 py-1 border border-neutral-900 hover:border-accent hover:text-accent transition-colors">@Sebastian</span>
                  <span className="px-2 py-1 border border-neutral-900 hover:border-accent hover:text-accent transition-colors">@Marcus</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
