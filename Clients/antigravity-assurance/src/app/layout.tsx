import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Antigravity Assurance — AI Agent Risk Assessment",
  description:
    "Independent risk assessment for AI agent deployments. Insurer-readable. Boardroom-ready. The standard your enterprise AI deserves.",
  openGraph: {
    title: "Antigravity Assurance",
    description: "AI Agent Risk Assessment for serious deployments.",
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
