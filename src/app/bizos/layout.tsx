import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BizOS | The one intelligent operating system for your whole business · JonnyAI",
  description:
    "BizOS is the flagship JonnyAI platform — a white-label, composable business operating system with 85+ modules (50+ live), a runtime Section Builder, and JAIOS, a 108-agent AI swarm that runs the work. Care, compliance, facilities and finance, unified under one brain.",
  alternates: { canonical: "https://jonnyai.co.uk/bizos" },
  openGraph: {
    title: "BizOS | The one brain for your whole business",
    description:
      "A white-label, composable operating system with 85+ modules, runtime customisation and a 108-agent AI swarm. The HubSuite hubs are the door — BizOS is the building.",
    url: "https://jonnyai.co.uk/bizos",
    siteName: "JonnyAI",
    type: "website",
  },
};

export default function BizOSLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
