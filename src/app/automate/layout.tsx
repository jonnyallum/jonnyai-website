import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Automation Packs | JonnyAI — n8n Workflows for Small Business',
  description: 'Pre-scoped n8n automation workflows for small businesses. Order processing, invoicing, lead routing, reporting — live in days. From £297.',
  keywords: 'business automation UK, n8n workflows small business, automation packs, workflow automation UK, business process automation',
  alternates: { canonical: 'https://jonnyai.co.uk/automate' },
  openGraph: {
    title: 'Automation Packs | JonnyAI',
    description: 'Stop doing things a machine can do. Pre-scoped n8n automations for UK small businesses. From £297. Live in days.',
    url: 'https://jonnyai.co.uk/automate',
    images: [{ url: '/brand/hero_background.png', width: 1200, height: 630 }],
  },
};

export default function AutomateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
