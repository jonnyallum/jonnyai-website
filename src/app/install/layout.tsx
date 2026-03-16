import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Private AI Install | JonnyAI — Your Own AI on Your Hardware',
  description: 'We install a private AI system inside your business — configured for your workflows, trained on your data, running on your hardware. From £997. Live within a week.',
  keywords: 'private AI install UK, AI installation small business, business AI system, n8n automation install, AI on premise UK',
  alternates: { canonical: 'https://jonnyai.co.uk/install' },
  openGraph: {
    title: 'Private AI Install | JonnyAI',
    description: 'Your own AI system, installed on your hardware. Not a subscription. Configured for your workflows, trained on your data. From £997.',
    url: 'https://jonnyai.co.uk/install',
    images: [{ url: '/brand/hero_background.png', width: 1200, height: 630 }],
  },
};

export default function InstallLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
