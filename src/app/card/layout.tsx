import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jonny Allum · JonnyAI',
  description: 'AI-native creative + tech studio. We brand it, build it, film it & automate it.',
  openGraph: {
    title: 'Jonny Allum · JonnyAI',
    description: 'AI-native creative + tech studio. We brand it, build it, film it & automate it.',
    images: [{ url: '/jonny-profile.png' }],
  },
};

export default function CardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
