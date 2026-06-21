import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Optimise on-demand (Vercel): large source PNGs are served as resized
    // WebP/AVIF, which is a major LCP win on this image-heavy site.
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
};

export default nextConfig;
