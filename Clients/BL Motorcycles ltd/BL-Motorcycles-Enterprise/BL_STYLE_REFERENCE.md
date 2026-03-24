# BL Motorcycles — Brett's Preferred Style Reference

> Extracted from the original Vite-based `blwebsite` repo. Brett prefers this look over the new basic Enterprise version. Use this reference to port the styling to the Next.js rebuild.

---

## 🎨 Color Palette (Dark Mode Only)

| Token | Value | Description |
|:------|:------|:------------|
| **Background** | `oklch(0.15 0 0)` / ~`#050505` | Deep Asphalt Black |
| **Foreground** | `oklch(0.95 0 0)` | Near-white text |
| **Primary** | `oklch(0.82 0.13 85)` / ~`#d3c065` | **Gold** — the signature accent |
| **Card** | `oklch(0.18 0 0)` | Slightly lighter black |
| **Secondary** | `oklch(0.25 0 0)` | Dark Grey |
| **Muted Text** | `oklch(0.70 0 0)` | Grey for secondary text |
| **Border** | Gold with 20% opacity | `oklch(0.82 0.13 85 / 0.2)` |
| **Ring/Focus** | Gold | Same as primary |

## 🔤 Typography

| Element | Font | Style |
|:--------|:-----|:------|
| **Body** | `Inter` (sans-serif) | Clean, modern |
| **Headings** | `Oswald` | **UPPERCASE**, `tracking-wide`, bold |
| **Monospace** | `JetBrains Mono` | Used for small labels, timestamps |
| **Labels/Tags** | `font-mono text-xs uppercase tracking-[0.2em]` | Technical feel |

## 📐 Design System

### Industrial / Kinetic Precision Theme

- **Sharp corners everywhere** — `border-radius: 0` (no rounding)
- **Chamfered clip-paths** on CTAs: `clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)`
- **Tech borders** with corner accents (tiny L-shaped gold borders at corners)
- **Gold gradient dividers** — `bg-gradient-to-r from-transparent via-primary/50 to-transparent`
- **Grayscale-to-color** image hover effect — `grayscale hover:grayscale-0 transition-all duration-500`

### Navigation

- Fixed, transparent → solid black on scroll with gold border
- Logo + "B&L MOTORCYCLES" heading with small "Parts & Repairs" mono subtitle
- Gold underline animation on active link (`scale-x-0 → scale-x-100`)
- CTA button: Gold bg, black text, chamfered, uppercase, bold

### Cards (Service Cards)

- Black background with gold border on hover
- Image header (48px tall, `object-cover`, zoom on hover)
- Circular icon badge (gold border, black bg) floating over image
- Heading: White, uppercase, turns gold on hover
- Body: `text-gray-400`, small, relaxed leading

### Hero Section

- Full-screen (`h-screen`) with background image
- Heavy dark overlay: `bg-black/70` + gradient `from-black via-transparent to-black/50`
- Centered layout: Large logo (with gold glow `drop-shadow`), massive heading, mono subtitle
- Two CTAs: Primary (gold bg) + Outline (gold border)

### Footer

- Black bg, gold-bordered dividers
- 4-column grid: Brand, Quick Links, Contact, Opening Hours
- Instagram + Facebook image grids (aspect-square, hover overlay with icon)
- Monospace copyright text

### Section Titles

- Component: `SectionTitle` with subtitle prop
- Subtitle: Small, mono, uppercase, gold
- Title: Large, heading font, uppercase, white with gold span

### Buttons (`TechButton`)

- Primary: Gold bg, black text, chamfered, bold uppercase
- Outline: Transparent bg, gold border, gold text
- Hover: `bg-white` transition (primary) or `bg-primary` (outline)

## 🎭 Key Visual Effects

1. **Gold glow on logo**: `drop-shadow-[0_0_25px_rgba(211,192,101,0.4)]`
2. **Grayscale images**: `grayscale hover:grayscale-0 transition-all duration-500`
3. **Image zoom on hover**: `group-hover:scale-110 transition-transform duration-500`
4. **Overlay on gallery**: `bg-black/50 opacity-0 group-hover:opacity-100`
5. **Scrollbar**: Custom gold-themed scrollbar
6. **Animated entrance**: `animate-in fade-in zoom-in duration-1000`

## 📱 Responsive Approach

- Mobile-first with `md:` and `lg:` breakpoints
- Hamburger menu: Full-width dropdown, black backdrop with blur
- Grid columns: `grid-cols-1 → md:grid-cols-2 → lg:grid-cols-4`

## 🏗️ Component Architecture (Old Vite Site)

- `Layout.tsx` — Shell with nav + footer
- `Home.tsx` — Hero, Story, Services, Shop, Products, Gallery, Mission
- `TechButton` — Styled button with chamfer
- `TechCard` — Card with tech border effects
- `SectionTitle` — Consistent section header
- Service pages: Individual pages for each service

---

_Reference created: March 5, 2026 | For @Priya and @Sebastian to apply to the Next.js Enterprise rebuild_
