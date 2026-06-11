'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const LINKS = {
  phone: '07723959178',
  email: 'info@jonnyai.co.uk',
  website: 'https://jonnyai.co.uk',
  linkedin: 'https://www.linkedin.com/in/jonnyallum/',
  whatsapp: 'https://wa.me/qr/GKUEOTHG3JQMM1',
  whatsappDirect: 'https://wa.me/447723959178?text=Hi%20Jonny%2C%20I%20found%20your%20profile%20and%20I%27d%20like%20to%20discuss%20a%20project.',
  fbPersonal: 'https://www.facebook.com/share/18bPPjmPvg/',
  fbBusiness: 'https://www.facebook.com/share/1JT92LVV3M/',
  googleReview: 'https://g.page/r/CR8p8wmFKwVYEBI/review',
  fbReview: 'https://www.facebook.com/share/1JT92LVV3M/',
  tiktok: 'https://www.tiktok.com/@jonnyai',
  igPersonal: 'https://www.instagram.com/jonnyallum',
  igBusiness: 'https://www.instagram.com/jonnyai.co.uk',
  github: 'https://github.com/jonnyallum',
  maps: 'https://maps.google.com/?q=PO10+7RR',
  youtube: 'https://youtube.com/@jonnyaitube?si=HfxtIFFdFYEsl6du',
  telegram: 'https://t.me/Xvdjfnk',
};

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.5 12.1 19.79 19.79 0 011.5 3.5 2 2 0 013.5 1.32h3a2 2 0 012 1.72 12.8 12.8 0 00.7 2.81A2 2 0 018.71 8l-1.27 1.27a16 16 0 006.29 6.29L15 14.29a2 2 0 012.18-.47 12.8 12.8 0 002.81.7 2 2 0 011.72 2z"/>
    </svg>
  );
}
function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
    </svg>
  );
}
function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

/* ── Full-colour app-icon style social icons ── */
function AppIcon({ bg, circle, children }: { bg: string; circle?: boolean; children: React.ReactNode }) {
  return (
    <span
      className="flex items-center justify-center w-12 h-12 flex-shrink-0"
      style={{ background: bg, borderRadius: circle ? '50%' : '22%' }}
    >
      {children}
    </span>
  );
}

function LinkedInAppIcon() {
  return (
    <AppIcon bg="#0A66C2">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    </AppIcon>
  );
}
function YouTubeAppIcon() {
  return (
    <AppIcon bg="#FF0000">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
        <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
      </svg>
    </AppIcon>
  );
}
function TikTokAppIcon() {
  return (
    <AppIcon bg="#000000" circle>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.83a8.18 8.18 0 004.77 1.52V6.9a4.85 4.85 0 01-1-.21z"/>
      </svg>
    </AppIcon>
  );
}
function InstagramAppIcon() {
  return (
    <AppIcon bg="linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    </AppIcon>
  );
}
function WhatsAppAppIcon() {
  return (
    <AppIcon bg="#25D366">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </AppIcon>
  );
}
function FacebookAppIcon() {
  return (
    <AppIcon bg="#1877F2" circle>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    </AppIcon>
  );
}
function GitHubAppIcon() {
  return (
    <AppIcon bg="#24292E">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
      </svg>
    </AppIcon>
  );
}
function TelegramAppIcon() {
  return (
    <AppIcon bg="#2AABEE" circle>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
        <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    </AppIcon>
  );
}
function EmailAppIcon() {
  return (
    <AppIcon bg="#1a1a1a">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    </AppIcon>
  );
}
function EmailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );
}
function LinkedInIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
}
function WhatsAppIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;
}
function FacebookIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
}

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
    'X-SOCIALPROFILE;TYPE=linkedin:https://www.linkedin.com/in/jonnyallum/',
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
      window.open(LINKS.googleReview, '_blank');
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

const contactButtons = [
  {
    icon: <PhoneIcon className="w-5 h-5" />,
    iconColor: '#c88300',
    label: 'Call',
    sub: LINKS.phone,
    href: `tel:${LINKS.phone}`,
    highlight: false,
  },
  {
    icon: <LinkedInIcon className="w-5 h-5" />,
    iconColor: '#0A66C2',
    label: 'LinkedIn',
    sub: 'linkedin.com/in/jonnyallum',
    href: LINKS.linkedin,
    highlight: false,
  },
  {
    icon: <WhatsAppIcon className="w-5 h-5" />,
    iconColor: '#25D366',
    label: 'WhatsApp',
    sub: 'Quick message me',
    href: LINKS.whatsappDirect,
    highlight: true,
  },
  {
    icon: <EmailIcon className="w-5 h-5" />,
    iconColor: '#c88300',
    label: 'Email',
    sub: LINKS.email,
    href: `mailto:${LINKS.email}`,
    highlight: false,
  },
  {
    icon: <GlobeIcon className="w-5 h-5" />,
    iconColor: '#c88300',
    label: 'Website',
    sub: 'jonnyai.co.uk',
    href: LINKS.website,
    highlight: false,
  },
];

const socialLinks = [
  { icon: <LinkedInAppIcon />,  label: 'LinkedIn',  sub: 'jonnyallum',      href: LINKS.linkedin },
  { icon: <YouTubeAppIcon />,   label: 'YouTube',   sub: '@jonnyaitube',    href: LINKS.youtube },
  { icon: <TikTokAppIcon />,    label: 'TikTok',    sub: '@jonnyai',        href: LINKS.tiktok },
  { icon: <InstagramAppIcon />, label: 'Instagram', sub: '@jonnyai.co.uk',  href: LINKS.igBusiness },
  { icon: <FacebookAppIcon />,  label: 'Facebook',  sub: 'jonnyai.co.uk',   href: LINKS.fbBusiness },
  { icon: <GitHubAppIcon />,    label: 'GitHub',    sub: 'jonnyallum',      href: LINKS.github },
  { icon: <WhatsAppAppIcon />,  label: 'WhatsApp',  sub: 'Message me',      href: LINKS.whatsappDirect },
  { icon: <TelegramAppIcon />,  label: 'Telegram',  sub: '@Xvdjfnk',        href: LINKS.telegram },
  { icon: <EmailAppIcon />,     label: 'Email',     sub: 'info@jonnyai.co.uk', href: `mailto:${LINKS.email}` },
];

export default function CardPage() {
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
          {contactButtons.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                if (item.href) window.open(item.href, item.href.startsWith('tel') || item.href.startsWith('mailto') ? '_self' : '_blank');
              }}
              className="w-full flex items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-white/5 active:bg-white/10"
              style={{ borderBottom: i < contactButtons.length - 1 ? '1px solid #c8830015' : 'none' }}
            >
              <span className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ color: item.iconColor }}>
                {item.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium"
                  style={{ color: item.highlight ? '#25D366' : '#fff' }}
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
          <span className="w-8 h-8 flex items-center justify-center flex-shrink-0 text-amber-600">
            <MapPinIcon className="w-5 h-5" />
          </span>
          <div>
            <p className="text-sm font-medium text-white">Emsworth, Hampshire</p>
            <p className="text-xs text-white/40">PO10 7RR · Serving UK-wide</p>
          </div>
          <span className="ml-auto text-white/20 text-lg">›</span>
        </a>

        {/* Social grid */}
        <div className="w-full mt-3 grid grid-cols-3 gap-2">
          {socialLinks.map((s, i) => (
            <a
              key={i}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 py-4 rounded-2xl transition-all hover:scale-105 active:scale-95"
              style={{ border: '1px solid #c8830020', background: '#0f0d0a' }}
            >
              {s.icon}
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

        {/* Google review — primary CTA */}
        <a
          href={LINKS.googleReview}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full mt-3 flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-bold text-base transition-all hover:scale-[1.03] active:scale-[0.97]"
          style={{
            background: '#fff',
            color: '#1a1a1a',
            boxShadow: '0 4px 24px #4285F430',
          }}
        >
          <GoogleIcon className="w-6 h-6 flex-shrink-0" />
          <span>Review us on Google</span>
          <span className="ml-1 text-yellow-500">⭐</span>
        </a>

        {/* Facebook review — secondary */}
        <a
          href={LINKS.fbReview}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-semibold text-sm transition-all hover:scale-105 active:scale-95"
          style={{ background: '#1a1a1a', border: '1px solid #1877F230', color: '#fff' }}
        >
          <FacebookIcon className="w-5 h-5 text-[#1877F2]" /> Facebook Review
        </a>

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

        {/* Get yours CTA */}
        <a
          href="https://kliqt.co.uk"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full mt-3 flex items-center justify-between px-5 py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] group"
          style={{
            background: 'linear-gradient(135deg, #0f0d0a 0%, #1a1000 100%)',
            border: '1px solid #c8830040',
            boxShadow: '0 0 20px #c8830010',
          }}
        >
          <div>
            <p className="text-sm font-semibold text-white">Want one of these?</p>
            <p className="text-xs text-white/40 mt-0.5">Smart profiles for your business</p>
          </div>
          <div
            className="px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all group-hover:scale-105"
            style={{ background: 'linear-gradient(90deg, #c88300, #e8a020)', color: '#000' }}
          >
            kliqt.co.uk →
          </div>
        </a>

        {/* Footer */}
        <p className="mt-4 mb-2 text-[10px] text-white/20 text-center">
          jonnyai.co.uk · Jonny Allum Innovations Ltd
        </p>
      </div>
    </main>
  );
}
