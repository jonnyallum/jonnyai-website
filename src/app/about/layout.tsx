import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Jonny Allum — a one-man, AI-native digital marketing agency",
  description:
    "JonnyAI is Jonny Allum: a one-man, AI-native digital marketing agency. Branding, websites, apps, content, paid media, SEO and automation — plus a live software line (the HubSuite) and the flagship BizOS platform. You hire me, you get me.",
  alternates: { canonical: "https://jonnyai.co.uk/about" },
  openGraph: {
    title: "About | Jonny Allum — a one-man, AI-native digital marketing agency",
    description:
      "One person, AI-amplified. The brand, the build, the content, the campaigns and the software — all from the person doing the work.",
    url: "https://jonnyai.co.uk/about",
    siteName: "JonnyAI",
    type: "profile",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
