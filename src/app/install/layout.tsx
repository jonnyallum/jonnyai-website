import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Private AI Install | JonnyAI — Your Own AI System, On Your Hardware',
  description: 'We install a private AI system inside your UK business — configured for your workflows, trained on your data, running on your hardware. Not a subscription. Yours forever. From £997.',
  keywords: 'private AI install UK, AI installation small business UK, business AI system UK, on-premise AI UK, AI on your hardware, custom AI build UK',
  alternates: { canonical: 'https://jonnyai.co.uk/install' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Private AI Install | JonnyAI — Your Own AI System, On Your Hardware',
    description: 'Your own AI system, installed on your hardware. Not a subscription. Configured for your workflows, trained on your data. From £997.',
    url: 'https://jonnyai.co.uk/install',
    locale: 'en_GB',
    images: [{ url: '/brand/og_card.png', width: 1200, height: 630, alt: 'JonnyAI Private AI Install' }],
  },
};

export default function InstallLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
