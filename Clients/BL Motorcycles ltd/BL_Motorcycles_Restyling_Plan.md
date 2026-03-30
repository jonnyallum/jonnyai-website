# BL Motorcycles — Implementation Plan: Restyle Enterprise Site to Match Original Design

**Date:** 30 March 2026
**Prepared for:** Brett (BL Motorcycles Ltd)
**Objective:** Restyle the Next.js enterprise site to match the original Vite site's industrial/kinetic look, while keeping all shop, admin, Supabase, and Stripe functionality intact.

---

## Executive Summary

**Recommended approach: Restyle the new (enterprise) site to look like the old one.**

The enterprise site (Next.js 15 + Supabase + Stripe) has the critical business functionality — a working shop with 32,000+ products, admin dashboard, order management, Stripe checkout, and supplier notification system. The old Vite site has the visual identity Brett's client loves — sharp industrial styling, chamfered buttons, grayscale-to-color effects, tech borders, and the full "kinetic precision" design language.

Porting the shop/admin/Supabase/Stripe stack into the old Vite site would mean re-implementing Next.js API routes, server components, and the entire app router structure in a client-only Vite/wouter setup — far more risky and time-consuming than simply restyling the enterprise site.

---

## Current Architecture Comparison

### Old Site (Vite + Express) — "The Look"
- **Framework:** Vite + React 19 + Express backend
- **Routing:** wouter (client-side)
- **Styling:** Tailwind CSS v4 with oklch colors, custom `tech-components.tsx`
- **Fonts:** Inter (body), Oswald (headings, uppercase), JetBrains Mono (labels)
- **Design language:** Sharp corners, chamfered clip-paths, tech borders with corner accents, grayscale images, gold glow effects
- **Pages:** Home, 6 service pages (Carb Specialist, Brake Restoration, etc.), placeholder shop ("Coming Soon")
- **Components:** TechButton, TechCard, SectionTitle, Layout, BookingForm, Map
- **No shop, no Supabase, no Stripe, no admin**

### New Site (Next.js 15) — "The Function"
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v3 with hex colors
- **Fonts:** Inter + Oswald + JetBrains Mono (same fonts, loaded in globals.css)
- **Design language:** Rounded corners (rounded-2xl, rounded-xl), gradients, softer/modern SaaS aesthetic
- **Pages:** Home, Shop (full product catalogue from Supabase), Admin dashboard, Auth pages, Privacy Policy
- **Backend:** Supabase (products, orders, fitments), Stripe payments, API route for email
- **Components:** Navbar, Hero, Services, Categories, About, Footer, TrustBar, WhyChoose
- **Working:** Product search, filtering, cart, checkout, order confirmation, admin order management

---

## Phase-by-Phase Implementation Plan

### PHASE 0: Safety & Git Cleanup (DO FIRST)
**Goal:** Create a clean working branch so nothing can be lost.

1. **Clone the repo fresh** from `https://github.com/jonnyallum/blwebsite`
2. **Audit branches** — identify what's on `main` vs `enterprise-rebuild` vs any others
3. **Create a new branch** `enterprise-restyled` from `enterprise-rebuild` — this is our working branch
4. **Tag the current state** of `enterprise-rebuild` as `pre-restyling-backup` so we can always roll back
5. **Verify the enterprise site builds** (`npm install && npm run build`) before making any changes

**Risk mitigation:** We never touch `main` or `enterprise-rebuild` directly. All work happens on `enterprise-restyled`.

---

### PHASE 1: Design System Foundation
**Goal:** Replace the soft/modern design tokens with the industrial design language.

#### 1A. Tailwind Config Overhaul (`tailwind.config.js`)

**Current (new site):**
```js
colors: {
  brand: {
    gold: "#D4AF37",
    "gold-light": "#E2C35C",
    "gold-dark": "#BF9B30",
    dark: "#050505",
    gray: "#1a1a1a",
  }
}
```

**Target (match old site with oklch):**
```js
colors: {
  brand: {
    gold: "#d3c065",           // oklch(0.82 0.13 85) — the signature gold
    "gold-light": "#E2C35C",
    "gold-dark": "#BF9B30",
    dark: "#050505",           // oklch(0.15 0 0)
    gray: "#1a1a1a",           // card bg
  },
  background: "#050505",
  foreground: "#f0f0f0",       // oklch(0.95 0 0)
  card: "#1c1c1c",             // oklch(0.18 0 0)
  secondary: "#2e2e2e",        // oklch(0.25 0 0)
  muted: "#999999",            // oklch(0.70 0 0)
  border: "rgba(211,192,101,0.2)",
}
```

Also add:
- `borderRadius: { none: '0' }` — enforce sharp corners globally
- `fontFamily: { heading: ['Oswald', 'sans-serif'], mono: ['JetBrains Mono', 'monospace'] }`

#### 1B. Global CSS (`globals.css`)

The new site already has the right fonts imported and heading styles. Changes needed:
- Add the **chamfered clip-path** utilities (`.btn-chamfer` — already partially present)
- Add **tech-border** utilities with corner accents
- Add **gold gradient dividers** utility
- Add **grayscale hover** utilities
- Ensure **scrollbar** styling matches old site
- Remove all `rounded-*` classes from base layer (enforce sharp corners)

#### 1C. Create Shared UI Components

Port these from the old site's `tech-components.tsx`:
- **`TechButton`** — Chamfered clip-path, gold bg/black text (primary) or gold border (outline), uppercase, bold, Oswald font
- **`TechCard`** — Black bg, gold border on hover, tech corner accents
- **`SectionTitle`** — Mono uppercase gold subtitle + large Oswald heading with gold span

These go into `/components/ui/` in the enterprise site.

---

### PHASE 2: Component-by-Component Restyling
**Goal:** Restyle every visible component to match the old site's aesthetic.

#### 2A. Navbar (`components/Navbar.tsx`)

| Current (new) | Target (old) |
|---|---|
| Logo only, no text | Logo + "B&L MOTORCYCLES" heading + "Parts & Repairs" mono subtitle |
| Rounded pill CTA (`rounded-full`) | Chamfered gold CTA with `btn-chamfer` clip-path |
| Gradient gold button | Solid gold bg, black text, uppercase |
| `text-gray-400` links | White links with gold underline animation on hover |
| Rounded mobile menu | Full-width dropdown with black backdrop + blur |
| Missing: service page links | Add: Services, Shop, About, Contact links (matching old nav) |

#### 2B. Hero (`components/Hero.tsx`)

| Current (new) | Target (old) |
|---|---|
| Split layout (text left, image right) | **Full-screen centered** with background image |
| Search bar in hero | Move search to shop page; hero is purely atmospheric |
| Rounded badge pill | Remove — replace with logo glow effect |
| `text-6xl font-black tracking-tighter` | `text-4xl md:text-6xl lg:text-7xl font-heading font-bold uppercase tracking-tight` |
| Workshop photo in card | Full-bleed bg image with `bg-black/70` + gradient overlay |
| Info card overlay at bottom | Remove — replace with centered logo, heading, tagline, 2 CTAs |
| Quick search links | Remove |

**Key elements to recreate:**
- Full-screen `h-screen` with `hero-bg-v2.jpg` background
- Heavy dark overlay: `bg-black/70` + `bg-gradient-to-t from-black via-transparent to-black/50`
- Centered: Large logo with gold glow `drop-shadow`, massive heading, mono subtitle
- Two CTAs: "Shop Parts" (primary/chamfered) + "Garage Services" (outline/chamfered)
- Entrance animation: `animate-in fade-in zoom-in duration-1000`

#### 2C. Services (`components/Services.tsx`)

| Current (new) | Target (old) |
|---|---|
| Text-only cards, no images | Image header cards (48px tall, object-cover, zoom on hover) |
| Rounded cards (`rounded-2xl`) | Sharp corners, tech borders with corner accents |
| Icon in rounded square | Circular icon badge floating over image (gold border, black bg) |
| 6 generic services | 7 specific services with images and links to service pages |
| No "View Full Services" CTA | Add outline CTA at bottom |

**Critical:** The old site has individual service pages (BrakeRestoration, CarbSpecialist, etc.). These need to be ported as new Next.js pages under `/app/services/[slug]/page.tsx`.

#### 2D. New Sections to Add (from old site)

The old Home page has sections the new site is missing:
1. **"Our Story" section** — 2-column with grayscale image + text + 3 trust icons
2. **"Shop Parts" section** — The "Online Store Coming Soon" banner (update to link to actual `/shop`)
3. **"Our Products" section** — Image + text about product quality
4. **Gallery section** — 6-image grid with hover overlay zoom effect
5. **Mission section** — Centered quote with decorative quote marks

#### 2E. Footer (`components/Footer.tsx`)

| Current (new) | Target (old) |
|---|---|
| 4-col grid, rounded social icons | 4-col grid: Brand, Quick Links, Contact, Opening Hours |
| Missing opening hours | Add opening hours column |
| Missing Instagram/Facebook image grids | Add social image grids with hover overlay |
| Rounded icon buttons | Sharp square social icons with gold borders |
| `rounded-xl` on everything | Sharp corners throughout |
| Monospace copyright — already similar | Match exactly |

#### 2F. Shop Page (`app/shop/page.tsx`)

The shop page is functional and critical — restyle but don't break:
- Replace all `rounded-*` classes with sharp corners
- Apply tech-border and corner accent styles to product cards
- Gold borders on hover for product cards
- Grayscale product images with color on hover
- Chamfered buttons for "Add to Cart" / "View Details"
- Match search/filter UI to the industrial aesthetic
- Keep all Supabase queries, cart logic, and Stripe integration untouched

#### 2G. Admin Dashboard (`app/admin/page.tsx`)

Lower priority — this is internal-facing:
- Apply consistent dark theme
- Gold accent colors for stats/highlights
- Sharp corners on cards and buttons
- Can be done after the public-facing pages are complete

---

### PHASE 3: Port Missing Pages from Old Site
**Goal:** Bring across the service pages and any other content pages.

#### 3A. Service Pages

Create these under `app/services/`:
- `app/services/page.tsx` — Services index
- `app/services/service-repairs/page.tsx`
- `app/services/specialist-restoration/page.tsx`
- `app/services/carb-specialist/page.tsx`
- `app/services/ultrasonic-cleaning/page.tsx`
- `app/services/brake-restoration/page.tsx`
- `app/services/recommissioning/page.tsx`

Port content from old site's `client/src/pages/services/` directory, converting from wouter routing to Next.js App Router pages. Each page needs the Navbar and Footer wrapping.

#### 3B. Contact/Map

The old site has a Map component and contact section. Evaluate whether to create a standalone `/contact` page or keep it as a section in the footer/home.

#### 3C. Image Assets

Ensure all images from the old site's `public/images/` are copied to the new site's `public/images/`:
- `hero-bg-v2.jpg`, `logo-transparent.png`
- All service images (`mechanic-work.jpg`, `balancing-gauges.jpg`, `ultrasonic-clean.jpg`, etc.)
- Gallery images (`user-image-1.png` through `user-image-13.jpg`)
- `products-new.jpg`, `services-bg.jpg`, `commissioning-new.jpg`

---

### PHASE 4: Layout & Responsive Refinement
**Goal:** Ensure the restyled site works perfectly across all devices.

1. Create a `Layout` wrapper component (or modify `app/layout.tsx`) to include Navbar + Footer on all pages
2. Ensure mobile hamburger menu matches old site style (full-width, black backdrop with blur)
3. Test responsive breakpoints: `grid-cols-1 → md:grid-cols-2 → lg:grid-cols-4`
4. Verify shop page responsive behaviour with new styling
5. Test on mobile, tablet, desktop

---

### PHASE 5: Testing & QA
**Goal:** Ensure nothing is broken.

1. **Shop functionality:** Search, filter, pagination, product detail modal, image gallery
2. **Cart & Checkout:** Add to cart, Stripe payment flow, order confirmation
3. **Admin dashboard:** Order management, stats display
4. **Service pages:** All 7 service pages render correctly
5. **Navigation:** All internal links work, external links (eBay, social) open correctly
6. **Images:** All images load (no 404s from missing assets)
7. **SEO:** Check meta tags, alt text, heading hierarchy
8. **Performance:** Lighthouse audit — ensure restyling hasn't hurt load times
9. **Cross-browser:** Chrome, Firefox, Safari, Edge

---

### PHASE 6: Deployment
**Goal:** Get the restyled site live.

1. Merge `enterprise-restyled` → `enterprise-rebuild` (or set as new default branch)
2. Build and deploy to Hostinger (or wherever the site is hosted)
3. Purge CDN cache (`s-maxage=31536000` means manual purge needed)
4. Verify live site
5. Test Stripe webhook still works
6. Test n8n workflow integrations still function

---

## Files That Will Be Modified

| File | Change Type | Risk Level |
|---|---|---|
| `tailwind.config.js` | Major overhaul | LOW — visual only |
| `app/globals.css` | Major additions | LOW — visual only |
| `components/Navbar.tsx` | Major restyle | LOW |
| `components/Hero.tsx` | Major rewrite | LOW — no business logic |
| `components/Services.tsx` | Major restyle + images | LOW |
| `components/Footer.tsx` | Major restyle | LOW |
| `components/About.tsx` | Major restyle | LOW |
| `components/Categories.tsx` | Restyle | LOW |
| `components/TrustBar.tsx` | Restyle | LOW |
| `components/WhyChoose.tsx` | Restyle or replace | LOW |
| `app/page.tsx` | Add new sections | LOW |
| `app/shop/page.tsx` | Visual restyle only | **MEDIUM** — must not break Supabase/cart |
| `app/admin/page.tsx` | Visual restyle only | **MEDIUM** — must not break admin functions |
| `app/layout.tsx` | Add layout wrapper | LOW |

## New Files to Create

| File | Purpose |
|---|---|
| `components/ui/TechButton.tsx` | Chamfered button component |
| `components/ui/TechCard.tsx` | Industrial card with tech borders |
| `components/ui/SectionTitle.tsx` | Section header with mono subtitle |
| `app/services/page.tsx` | Services index page |
| `app/services/[slug]/page.tsx` | Individual service pages (6 total) |
| Various images in `public/images/` | Ported from old site |

---

## What We Will NOT Change

- **Supabase queries** — all database interactions stay exactly as-is
- **Stripe integration** — payment flow, webhooks, checkout session creation untouched
- **API routes** (`app/api/send-email/`) — backend logic untouched
- **Admin dashboard logic** — order management, stats calculations untouched
- **Environment variables** — no changes to Supabase keys, Stripe keys, etc.
- **n8n workflows** — completely separate system, unaffected
- **Shop business logic** — search, filtering, pagination, cart state management untouched

---

## Estimated Effort

| Phase | Effort | Priority |
|---|---|---|
| Phase 0: Safety & Git | 15 mins | CRITICAL |
| Phase 1: Design System | 1-2 hours | HIGH |
| Phase 2: Component Restyling | 3-4 hours | HIGH |
| Phase 3: Port Service Pages | 1-2 hours | MEDIUM |
| Phase 4: Responsive Refinement | 1 hour | MEDIUM |
| Phase 5: Testing & QA | 1 hour | HIGH |
| Phase 6: Deployment | 30 mins | HIGH |
| **Total** | **~8-10 hours** | |

---

## Key Decisions — CONFIRMED by Brett (30 March 2026)

1. **Opening hours** — YES. Mon–Fri 10am–5:30pm (hours might differ), Sat–Sun Closed
2. **Gallery images** — Use the 6 from old site, add more if available
3. **Service page content** — Port as-is, individual pages for each service
4. **Contact page** — Footer section only (no standalone page)
5. **Booking form** — YES, include it
6. **Google Maps** — YES, include it. GCP project: `outstanding-box-450907-s8`

---

*This plan is designed to be executed in Claude Code, phase by phase, with verification at each step.*
