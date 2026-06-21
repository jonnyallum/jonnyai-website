# JonnyAI — jonnyai.co.uk

> A one-man, AI-native digital marketing agency. Next.js 16 · React 19 · Tailwind CSS v4 · Supabase · Vercel.

---

## Overview

The marketing site for **JonnyAI** — Jonny Allum. It positions the business around three layers:

- **JonnyAI Services** — the crew: branding, websites, mobile apps, content & reels, paid media, SEO, social, email and automation.
- **The HubSuite** — sharp, regulated SaaS "blades" that solve one painful problem fast: [Compliance Hub](https://compliance-hub.co.uk), [Care Hub](https://care-hub.app), [FM Control Hub](https://fm-control-hub.co.uk).
- **BizOS** — the flagship: a white-label, composable business operating system (85+ modules, 50+ live) with a runtime Section Builder and JAIOS, a 108-agent AI swarm. The hubs are the door; BizOS is the building.

## Site structure

| Route | Purpose |
| --- | --- |
| `/` | Home — three-layer positioning, full services, HubSuite, BizOS flagship section, "how it all works together", featured work |
| `/bizos` | BizOS flagship deep-dive (what it is, how it works, what's live, capabilities) |
| `/about` | The one-man, AI-native agency story + backlinks to every live product/project |
| `/portfolio`, `/portfolio/case-studies`, `/portfolio/case-studies/[slug]` | Case studies (unified with the main site UI) |
| `/portfolio/cv` | CV |
| `/marketplace` | SaaS products, projects for sale, products seeking funding |
| `/brief` | AI-assisted project scoping + fixed-price roadmap |
| `/card` | JonnyAI digital business card (powered by KLIQT) |
| `/blog`, `/blog/[slug]` | Blog (static + live Supabase posts) |

## Design system

- **Palette**: void `#070708`, citrus `#D97757`, signal green `#22C55E`; hub accents — Compliance `#5B8DEF`, Care `#31C6A9`, FM `#5EC86E`.
- **Type**: Outfit (display) + Inter (body).
- **Look**: glassmorphic cards, hairline borders, radial citrus glows.
- **Motion / brand art** (`src/components/`):
  - `FiberCanvas` — ambient neural-lattice background.
  - `BizOSBrain` — animated SVG "one brain" (core + orbiting agent rings) on the BizOS hero.
  - `AtmosphereField` — drifting citrus/teal CSS aurora for section depth.
  - `AmbientBackdrop` — slow Ken Burns drift over a brand image (homepage hero).
  - `ScreenshotFrame` — stages screenshots in a glass browser frame with a citrus glow.

## Content & data

- `src/lib/data/case-studies.ts` — case studies (+ `caseStudyLiveUrls` backlink map). Section content supports `**bold**`, `- ` bullets and `[label](url)` links.
- `src/lib/data/ecosystem.ts` — single source of truth for backlinks (HubSuite, live projects, socials).
- `src/lib/data/marketplace.ts`, `blog-posts.ts` — marketplace listings and static blog posts.

## SEO & indexing

- **Dynamic sitemap** (`src/app/sitemap.ts`) — includes all top-level pages, every case study, and all blog posts (static + live Supabase).
- **Canonical URLs + OpenGraph** on home, key pages, case studies and blog posts.
- **Dynamic share card** (`src/app/opengraph-image.tsx`) — code-generated 1200×630 OG image with the JonnyAI logo.
- **Image optimization** enabled (AVIF/WebP via `next.config.ts`).
- `robots.ts` allows crawling and points to the sitemap.

## Tech stack

- **Framework**: Next.js 16 (App Router) · React 19 · TypeScript
- **Styling**: Tailwind CSS v4 · Framer Motion
- **Backend**: Supabase (PostgreSQL) · Resend · Stripe
- **Deploy**: Vercel

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

## Changelog — June 2026 rebuild

- **Repositioned** the site around Services → HubSuite → BizOS, with new `/about` and `/bizos` pages and the full digital-marketing service offering.
- **Unified the portfolio UI** with the rest of the site (void/citrus, Outfit, glassmorphic) and added live-site backlinks.
- **Case studies**: render markdown (bold/bullets/links) instead of literal asterisks; added a comprehensive Google Ads section to the Little Joe's study; added the **KLIQT** smart-business-card case study.
- **Brand art**: `BizOSBrain`, `AtmosphereField`, `AmbientBackdrop` hero, `ScreenshotFrame`.
- **SEO**: dynamic sitemap, canonicals/OG everywhere, generated OG share card, image optimization.

---

_We brand it, build it, film it & automate it._
