import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Website & App Build | JonnyAI — Next.js Sites Built to Convert',
  description: 'Fast, modern websites and web applications built on Next.js. Marketing sites from £497. E-commerce from £997. Web apps from £1,997. Fixed price, delivered on time.',
  keywords: 'Next.js website build UK, web app development UK, small business website UK, conversion website build, Next.js developer UK',
  alternates: { canonical: 'https://jonnyai.co.uk/build' },
  openGraph: {
    title: 'Website & App Build | JonnyAI',
    description: 'Fast, modern websites and web apps built on Next.js. Fixed price. Delivered on time. From £497.',
    url: 'https://jonnyai.co.uk/build',
    images: [{ url: '/brand/hero_background.png', width: 1200, height: 630 }],
  },
};

export default function BuildLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
