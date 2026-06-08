'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const LINKS = {
  phone: '07723959178',
  email: 'info@jonnyai.co.uk',
  website: 'https://jonnyai.co.uk',
  whatsapp: 'https://wa.me/qr/GKUEOTHG3JQMM1',
  whatsappDirect: 'https://wa.me/447723959178?text=Hi%20Jonny%2C%20I%20found%20your%20profile%20and%20I%27d%20like%20to%20discuss%20a%20project.',
  fbPersonal: 'https://www.facebook.com/share/18bPPjmPvg/',
  fbBusiness: 'https://www.facebook.com/share/1JT92LVV3M/',
  tiktok: 'https://www.tiktok.com/@jonnyai',
  igPersonal: 'https://www.instagram.com/jonnyallum',
  igBusiness: 'https://www.instagram.com/jonnyai.co.uk',
  github: 'https://github.com/jonnyallum',
  maps: 'https://maps.google.com/?q=PO10+7RR',
};

function downloadVCard() {
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'FN:Jonny Allum',
    'ORG:Jonny Allum Innovations Ltd',
    'TITLE:AI-Native Studio | Founder',
    'TEL;TYPE=CELL:+447723959178',
    'EMAIL:info@jonnyai.co.uk',
    'URL:https://jonnyai.co.uk',
    'ADR;TYPE=WORK:;;9 Ward Crescent;Emsworth;;PO10 7RR;UK',
    'X-SOCIALPROFILE;TYPE=instagram:https://www.instagram.com/jonnyai.co.uk',
    'X-SOCIALPROFILE;TYPE=tiktok:https://www.tiktok.com/@jonnyai',
    'X-SOCIALPROFILE;TYPE=github:https://github.com/jonnyallum',
    'END:VCARD',
  ].join('\r\n');

  const blob = new Blob([vcard], { type: 'text/vcard' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'jonny-allum.vcf';
  a.click();
  URL.revokeObjectURL(url);
}

function StarRating() {
  const [hovered, setHovered] = useState(0);

  function handleStar(n: number) {
    if (n >= 4) {
      window.open('https://g.page/r/review', '_blank');
    } else {
      window.open(`mailto:info@jonnyai.co.uk?subject=Feedback&body=Rating: ${n}/5 - `, '_blank');
    }
  }

  return (
    <div className="flex flex-col items-center gap-2 py-4">
      <p className="text-xs text-white/50 uppercase tracking-widest">Leave a review</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => handleStar(n)}
            className="text-3xl transition-transform hover:scale-125"
            style={{ color: n <= hovered ? '#F59E0B' : '#ffffff20' }}
          >
            ★
          </button>
        ))}
      </div>
      <p className="text-xs text-white/30">4–5 stars → Google Review · 1–3 → private feedback</p>
    </div>
  );
}

export default function CardPage() {
  const [copied, setCopied] = useState(false);

  function copyPhone() {
    navigator.clipboard.writeText(LINKS.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main
      className="min-h-screen flex items-start justify-center py-8 px-4"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, #1a0e00 0%, #0a0a0a 60%, #000 100%)',
      }}
    >
      {/* Subtle grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(#c8830020 1px, transparent 1px), linear-gradient(90deg, #c8830020 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative w-full max-w-sm flex flex-col items-center gap-0">
        {/* Hero card */}
        <div
          className="w-full rounded-3xl overflow-hidden shadow-2xl"
          style={{
            background: 'linear-gradient(160deg, #1c1002 0%, #0f0d0a 60%, #000 100%)',
            border: '1px solid #c8830030',
            boxShadow: '0 0 60px #c8830015, 0 25px 50px #00000080',
          }}
        >
          {/* Backdrop strip */}
          <div
            className="relative w-full h-36"
            style={{
              background:
                'linear-gradient(135deg, #0f0d0a 0%, #1a1000 40%, #2d1800 70%, #1a0e00 100%)',
            }}
          >
            {/* Circuit pattern overlay */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23c88300' stroke-width='0.5'%3E%3Cpath d='M10 30h10M40 30h10M30 10v10M30 40v10'/%3E%3Ccircle cx='30' cy='30' r='3'/%3E%3Ccircle cx='10' cy='30' r='2'/%3E%3Ccircle cx='50' cy='30' r='2'/%3E%3Ccircle cx='30' cy='10' r='2'/%3E%3Ccircle cx='30' cy='50' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px',
              }}
            />
            {/* Logo top-right */}
            <div className="absolute top-4 right-4">
              <Image src="/jai_logo_clean.png" alt="JAI" width={80} height={30} className="opacity-80" />
            </div>
          </div>

          {/* Profile photo — overlaps backdrop */}
          <div className="flex flex-col items-center -mt-16 px-6 pb-6">
            <div
              className="relative w-32 h-32 rounded-full overflow-hidden shadow-xl"
              style={{ border: '3px solid #c88300', boxShadow: '0 0 30px #c8830040' }}
            >
              <Image
                src="/jonny-profile.png"
                alt="Jonny Allum"
                fill
                className="object-cover object-top"
              />
            </div>

            <h1
              className="mt-4 text-2xl font-bold tracking-tight"
              style={{
                background: 'linear-gradient(90deg, #c88300, #e8a020, #c88300)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Jonny Allum
            </h1>
            <p className="text-white/60 text-sm mt-0.5">Jonny Allum Innovations Ltd</p>
            <p className="text-white/40 text-xs mt-1 tracking-wider uppercase">
              AI-Native Studio · Founder
            </p>

            {/* Tagline */}
            <p
              className="mt-3 text-center text-sm text-white/70 leading-relaxed px-2"
              style={{ fontStyle: 'italic' }}
            >
              "We brand it, build it, film it & automate it."
            </p>

            {/* Save to contacts — primary CTA */}
            <button
              onClick={downloadVCard}
              className="mt-5 w-full py-3 rounded-xl font-semibold text-sm tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(90deg, #c88300, #e8a020)',
                color: '#000',
                boxShadow: '0 4px 20px #c8830040',
              }}
            >
              + Save to Contacts
            </button>
          </div>
        </div>

        {/* Contact buttons */}
        <div
          className="w-full mt-3 rounded-2xl overflow-hidden"
          style={{ border: '1px solid #c8830020', background: '#0f0d0a' }}
        >
          {[
            {
              icon: '📞',
              label: 'Call',
              sub: LINKS.phone,
              href: `tel:${LINKS.phone}`,
              action: null,
            },
            {
              icon: copied ? '✅' : '📋',
              label: copied ? 'Copied!' : 'Copy Number',
              sub: LINKS.phone,
              href: null,
              action: copyPhone,
            },
            {
              icon: '💬',
              label: 'WhatsApp',
              sub: 'Quick message me',
              href: LINKS.whatsappDirect,
              action: null,
              highlight: true,
            },
            {
              icon: '📧',
              label: 'Email',
              sub: LINKS.email,
              href: `mailto:${LINKS.email}`,
              action: null,
            },
            {
              icon: '🌐',
              label: 'Website',
              sub: 'jonnyai.co.uk',
              href: LINKS.website,
              action: null,
            },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => {
                if (item.action) item.action();
                else if (item.href) window.open(item.href, item.href.startsWith('tel') || item.href.startsWith('mailto') ? '_self' : '_blank');
              }}
              className="w-full flex items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-white/5 active:bg-white/10"
              style={{
                borderBottom: i < 4 ? '1px solid #c8830015' : 'none',
              }}
            >
              <span className="text-xl w-8 text-center">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium"
                  style={{ color: item.highlight ? '#F97316' : '#fff' }}
                >
                  {item.label}
                </p>
                <p className="text-xs text-white/40 truncate">{item.sub}</p>
              </div>
              <span className="text-white/20 text-lg">›</span>
            </button>
          ))}
        </div>

        {/* Location */}
        <a
          href={LINKS.maps}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full mt-3 flex items-center gap-4 px-5 py-4 rounded-2xl transition-colors hover:bg-white/5"
          style={{ border: '1px solid #c8830020', background: '#0f0d0a' }}
        >
          <span className="text-xl">📍</span>
          <div>
            <p className="text-sm font-medium text-white">Emsworth, Hampshire</p>
            <p className="text-xs text-white/40">PO10 7RR · Serving UK-wide</p>
          </div>
          <span className="ml-auto text-white/20 text-lg">›</span>
        </a>

        {/* Social grid */}
        <div className="w-full mt-3 grid grid-cols-3 gap-2">
          {[
            { icon: '📸', label: 'Instagram', href: LINKS.igBusiness, sub: '@jonnyai.co.uk' },
            { icon: '🎵', label: 'TikTok', href: LINKS.tiktok, sub: '@jonnyai' },
            { icon: '💻', label: 'GitHub', href: LINKS.github, sub: 'jonnyallum' },
            { icon: '📘', label: 'Facebook', href: LINKS.fbBusiness, sub: 'Business' },
            { icon: '👤', label: 'Personal IG', href: LINKS.igPersonal, sub: '@jonnyallum' },
            { icon: '📘', label: 'Personal FB', href: LINKS.fbPersonal, sub: 'Personal' },
          ].map((s, i) => (
            <a
              key={i}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 py-4 rounded-2xl transition-all hover:scale-105 active:scale-95"
              style={{ border: '1px solid #c8830020', background: '#0f0d0a' }}
            >
              <span className="text-2xl">{s.icon}</span>
              <p className="text-xs font-medium text-white/80">{s.label}</p>
              <p className="text-[10px] text-white/30">{s.sub}</p>
            </a>
          ))}
        </div>

        {/* Smart review router */}
        <div
          className="w-full mt-3 rounded-2xl px-5"
          style={{ border: '1px solid #c8830020', background: '#0f0d0a' }}
        >
          <StarRating />
        </div>

        {/* Services teaser */}
        <div
          className="w-full mt-3 rounded-2xl px-5 py-5"
          style={{ border: '1px solid #c8830020', background: '#0f0d0a' }}
        >
          <p className="text-xs text-white/40 uppercase tracking-widest mb-3">What I do</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { emoji: '🎨', label: 'Branding & Logo' },
              { emoji: '💻', label: 'Websites & Apps' },
              { emoji: '🎬', label: 'Content & Reels' },
              { emoji: '🤖', label: 'AI & Automation' },
            ].map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-2 py-2 px-3 rounded-xl"
                style={{ background: '#c8830010' }}
              >
                <span className="text-lg">{s.emoji}</span>
                <span className="text-xs text-white/70">{s.label}</span>
              </div>
            ))}
          </div>
          <Link
            href="/"
            className="mt-4 block text-center text-xs py-3 rounded-xl font-semibold tracking-wide transition-all hover:scale-[1.02]"
            style={{
              border: '1px solid #c88300',
              color: '#c88300',
            }}
          >
            View full portfolio →
          </Link>
        </div>

        {/* Footer */}
        <p className="mt-6 mb-2 text-[10px] text-white/20 text-center">
          jonnyai.co.uk · Jonny Allum Innovations Ltd
        </p>
      </div>
    </main>
  );
}
