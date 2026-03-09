import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gold Standard | Agentic Audit Agency",
  description: "The world's first AI-powered quality certification for the agentic economy. Jai.OS 5.0 Standard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        <div className="noise-bg" />
        {children}
      </body>
    </html>
  );
}
