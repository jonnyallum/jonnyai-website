import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Workforce | JonnyAI — Dedicated AI Agents for Your Business',
  description: 'Deploy a dedicated AI agent trained on your business — handling leads, customer support, or outreach. Runs 24/7. £1,000/mo. Live within 2 weeks.',
  keywords: 'AI SDR UK, AI customer support agent, AI sales agent, AI workforce UK, dedicated AI agent business',
  alternates: { canonical: 'https://jonnyai.co.uk/workforce' },
  openGraph: {
    title: 'AI Workforce | JonnyAI',
    description: 'A dedicated AI agent, trained on your business. Handles leads, support, or outreach 24/7. Never calls in sick. £1,000/mo.',
    url: 'https://jonnyai.co.uk/workforce',
    images: [{ url: '/brand/hero_background.png', width: 1200, height: 630 }],
  },
};

export default function WorkforceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
