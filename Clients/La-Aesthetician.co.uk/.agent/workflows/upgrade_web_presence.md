---
description: Upgrade any website to "God-Tier" status using High-Impact aesthetics and Social Proof integrations.
---

# Web Presence Upgrade Protocol (The "CD Waste" Standard)

This workflow outlines the procedure for upgrading a standard website into a high-performance, aesthetically dominant digital asset. It incorporates lessons from the "CD Waste" build (Neon Noir, Glassmorphism, Framer Motion, seamless integrations).

## 1. Aesthetic Overhaul ("Neon Noir" / High Contrast)

Turn generic designs into cinematic experiences.
- **Direction**: Move away from flat, white/grey sites. Adopt "Dark Mode Primary" or "High Contrast" themes.
- **Color Palette**: Use deep void blacks (e.g., `#050508`) paired with neon accents (Red `#FF2D55`, Cyan `#00D4FF`).
- **Texture**: Apply subtle grain overlays (`opacity: 0.03`) to backgrounds to reduce "digital flatness".
- **Glassmorphism**: Use backdrop-blur and semi-transparent backgrounds for cards and sticky navs.
  - *Example*: `bg-black/40 backdrop-blur-md border-white/10`

## 2. Interaction & Animation (Framer Motion)

Static sites feel dead. Make it breathe.
- **Entrance Animations**: Staggered fades/slides for all list items and cards.
- **Scroll Triggers**: Elements should only animate when they enter the viewport (Lazy Animation).
- **Micro-Interactions**:
  - Buttons: Glow and scale on hover.
  - Cards: Border glow or subtle tilt on mouseover.
- **Smart Navigation**: Implement smooth scrolling for all anchor links. Nav items must highlight as the user scrolls past sections.

## 3. Social Proof & Trust Integration

Trust is the currency. Embed it everywhere.
- **Dynamic Review Widgets**:
  - Don't just paste text. Create "Review Cards" that pull (or simulate) data from Google/Trustpilot/Checkatrade.
  - Include "Verification" badges (e.g., "9.9/10 Rating", "Verified License").
- **Evidence Galleries**:
  - Implement "Before & After" sliders or toggles for service businesses.
  - Add "Verified" badges to project photos.
- **External Linking**: Provide direct, transparent links to external profiles (e.g., "View our 500+ reviews on Checkatrade").

## 4. Conversion Accelerators (Direct Contact)

Remove friction between "Interest" and "Action".
- **Floating Visual CTAs**:
  - Implement a **Floating WhatsApp Button** (bottom-right) that appears after 100px scroll.
  - Pre-fill the message: "Hi, I'm interested in [Service]..."
- **Sticky Actions**: On mobile, ensure the "Call Now" or "Book" button is always accessible at the bottom or top.

## 5. Technical Stack Standards

- **Framework**: React 19 + TypeScript.
- **Styling**: Tailwind CSS v4 (Use `@theme` for custom tokens).
- **Icons**: Lucide React (Clean, consistent).
- **Routing**: Client-side smooth routing (Wouter or React Router).

## 6. Execution Checklist

- [ ] **Audit**: Metrics & Visuals (Current state vs Target).
- [ ] **Theme**: Define the "God-Tier" palette (Void Dark + Neon).
- [ ] **Components**: Build the "Glass Card" and "Glow Button" primitives.
- [ ] **Integrate**: Add the WhatsApp Float and Review Widgets.
- [ ] **Polish**: Add grain, stagger animations, and verify mobile touch targets.
