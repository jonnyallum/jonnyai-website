import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'YouTube Automation | JonnyAI — 20 Videos a Month, Zero Effort',
  description: 'We run your faceless YouTube channel end-to-end. Research, scripting, voiceover, rendering, uploading, SEO optimisation. 20 videos/month for £500. You do nothing.',
  keywords: 'YouTube automation service, faceless YouTube channel UK, YouTube content automation, AI YouTube videos, automated YouTube channel',
  alternates: { canonical: 'https://jonnyai.co.uk/youtube' },
  openGraph: {
    title: 'YouTube Automation | JonnyAI',
    description: '20 videos a month, zero involvement. Research, script, voice, render, upload — fully automated. £500/mo flat.',
    url: 'https://jonnyai.co.uk/youtube',
    images: [{ url: '/brand/hero_background.png', width: 1200, height: 630 }],
  },
};

export default function YouTubeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
