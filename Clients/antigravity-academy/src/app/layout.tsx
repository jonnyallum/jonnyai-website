import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Antigravity Academy — AI Agent Practitioner Certification",
  description:
    "Run your first multi-agent build in 4 weeks. Practitioner certification in Jai.OS 5.0 — the same methodology that powers jonnyai.co.uk.",
  openGraph: {
    title: "Antigravity Academy",
    description: "AI Agent Practitioner Certification. 20 founding member spots at £297.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
