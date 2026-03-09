import { Phone, MapPin, Facebook, Instagram, ShoppingBag } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-brand-gray border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="lg:col-span-2">
            <img
              src="/images/logo-transparent.png"
              alt="B&L Motorcycles"
              className="h-12 w-auto mb-4"
            />
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-6">
              B&L Motorcycles Ltd — specialist motorcycle repairs, servicing, and parts.
              Based in Fareham, Hampshire. Serving riders across the South of England.
            </p>
            {/* Social & store links */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/brettfarley8206"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-brand-dark border border-white/10 flex items-center justify-center text-gray-400 hover:text-brand-gold hover:border-brand-gold/40 transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/blmotorcycles/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-brand-dark border border-white/10 flex items-center justify-center text-gray-400 hover:text-brand-gold hover:border-brand-gold/40 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.ebay.co.uk/sch/blmotorcycles/m.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 h-9 px-3 rounded-xl bg-brand-dark border border-white/10 text-xs font-semibold text-gray-400 hover:text-brand-gold hover:border-brand-gold/40 transition-all"
                aria-label="eBay Store"
              >
                <ShoppingBag className="w-4 h-4" />
                eBay Store
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              {[
                { label: "Parts Catalogue", href: "/shop" },
                { label: "eBay Store", href: "https://www.ebay.co.uk/sch/blmotorcycles/m.html", external: true },
                { label: "About Us", href: "#about" },
                { label: "Contact", href: "#contact" },
                { label: "Privacy Policy", href: "/privacy-policy" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="hover:text-brand-gold transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-gold mt-0.5 shrink-0" />
                <span>95 Newgate Lane, Peel Common, Fareham, Hampshire, PO14 1BA</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                <a href="tel:07881274193" className="hover:text-brand-gold transition-colors">
                  07881 274193
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-600">
          <span>© {year} B&L Motorcycles Ltd. All rights reserved. Company No: 14122962</span>
          <a href="/privacy-policy" className="hover:text-gray-400 transition-colors">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
