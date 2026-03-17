# jonnyai.co.uk — Design Brief
**Direction:** Logo-First. Magnificent. Unmistakable.
**Signed off by:** Jonny Allum
**Date:** 2026-03-15

---

## The One Rule

The JonnyAI logo is the star. Every design decision on this site either serves the logo
or gets out of its way. The site should feel like visiting the home base of something real,
powerful, and quietly confident.

---

## Brand Colours (Locked — Do Not Change)

| Token | Hex | Use |
|---|---|---|
| `--void` | `#070708` | Background — the canvas everything lives on |
| `--citrus` | `#D97757` | Primary accent — hero elements, CTAs, logo glow |
| `--signal` | `#22C55E` | Live indicators, checkmarks, success states |
| `--white-high` | `rgba(255,255,255,0.90)` | Primary text |
| `--white-mid` | `rgba(255,255,255,0.45)` | Secondary text |
| `--white-low` | `rgba(255,255,255,0.15)` | Borders, dividers |
| `--glass` | `rgba(255,255,255,0.03)` | Card backgrounds |
| `--citrus-glow` | `rgba(217,119,87,0.15)` | Radial backgrounds, halos |

---

## Logo Treatment

**The logo must:**
- Appear large in the hero — not tucked into a corner
- Have its own breathing space (never crowded)
- Carry a soft citrus glow halo behind it on hover and on load
- Animate in on page load: scale from 0.85 → 1.0 with opacity fade, duration 0.8s ease-out
- On scroll: logo in navbar shrinks and locks — stays visible but deferential

**What the logo communicates:**
- This is a real operation, not a side project
- Premium without being corporate
- The person behind it knows exactly what they're doing

**Logo in hero:** Large, centred, above the headline. The headline frames the logo — not the other way around. Think: album cover energy.

---

## Animated Background — The Gravity Field

**Concept: Orbital Gravity Field**

Replace the current neural node canvas with a logo-centric particle system:

- The logo sits at the centre of the hero
- Particles (150-200 tiny dots, citrus-tinted) orbit the logo in slow elliptical paths
- Each particle has a slightly different orbital radius, speed, and opacity (0.1–0.4)
- The field creates a sense of gravitational pull toward the logo
- Particles never cross the logo zone — they orbit around it
- On mouse move: nearest particles subtly deflect toward the cursor, then return to orbit
- The whole system breathes — radius expands and contracts by ~5% on a 8s sine cycle

**Technical implementation:**
```typescript
// Canvas-based, requestAnimationFrame
// ~150 particles, each with:
interface Particle {
  angle: number;         // current orbital angle
  radius: number;        // distance from logo centre
  speed: number;         // angular velocity (0.0003 – 0.001 rad/frame)
  size: number;          // 0.5 – 2px
  opacity: number;       // 0.08 – 0.35
  eccentricity: number;  // 0 – 0.3 (how elliptical the orbit is)
  tilt: number;          // orbital plane tilt
}
// Each frame: angle += speed, draw at elliptical position
// Mouse repulsion: particles within 80px deflect outward, return on exit
// Breathing: globalRadius *= (1 + 0.05 * Math.sin(Date.now() / 8000))
```

**Why this is better than the current canvas:**
- The logo becomes the gravitational centre — everything orbits it
- Feels alive without being distracting
- The mouse interaction creates a sense that the system responds to the visitor
- The breathing rhythm makes the hero feel like it has a heartbeat

**Secondary backgrounds (inner pages):**
- Slow, large citrus radial gradient that drifts top-left → bottom-right over 20s (CSS only)
- Faint dot grid overlay (0.015 opacity) — the current grid works, keep it
- No canvas on inner pages — performance and focus

---

## Typography (Keep Existing, Enforce Consistently)

| Use | Font | Weight | Notes |
|---|---|---|---|
| Hero H1 | Outfit | 800 | `tracking-tight`, `leading-none` |
| Section titles | Outfit | 700 | |
| Body | System sans | 400 | Not Outfit — too heavy at small sizes |
| Labels / mono | JetBrains Mono or system-mono | 400 | ALL CAPS, `tracking-[0.3em]` |
| Logo text | Outfit | 800 | If text-based |

---

## Component Design Language

### Glass Cards
```css
background: rgba(255,255,255,0.025);
border: 1px solid rgba(255,255,255,0.07);
border-radius: 12px;
backdrop-filter: blur(12px);
```
On hover: border brightens to `rgba(217,119,87,0.2)`, subtle upward shift (`translateY(-2px)`)

### Primary CTA Button (citrus)
```css
background: #D97757;
color: #070708;
font: 700 12px Outfit;
letter-spacing: 0.15em;
text-transform: uppercase;
padding: 14px 32px;
border-radius: 6px;
box-shadow: 0 0 40px rgba(217,119,87,0.25);
```
Hover: `background: white; color: #070708` — sharp, confident

### Secondary CTA Button (ghost)
```css
background: transparent;
border: 1px solid rgba(255,255,255,0.15);
color: rgba(255,255,255,0.7);
```
Hover: `border-color: rgba(217,119,87,0.4); color: white`

### Live indicator dot
```css
width: 8px; height: 8px;
border-radius: 50%;
background: #22C55E;
box-shadow: 0 0 8px rgba(34,197,94,0.6);
animation: pulse 2s infinite;
```

---

## Page-Level Design Direction

### Homepage Hero
- Logo: Large, centred, ~120px tall on desktop, with citrus glow halo
- Orbital particle field behind it
- Headline below logo, max 2 lines
- Two CTAs side by side
- Stats bar at bottom (kept from current — it works)

### /install — The Anchor Page
- Bold opener: "Your AI. Your Hardware. Your Control."
- 3-step visual showing the install process (icon → icon → icon, connected by a line)
- Before/after comparison panel (what they have now vs with AI installed)
- Pricing cards — glass panels with citrus border on the recommended tier

### /build, /automate, /youtube, /workforce
- Consistent section structure: Problem → Solution → How it works → Pricing → CTA
- Each page gets a unique accent illustration or icon treatment (not photos)
- Lightweight CSS gradient accent (no canvas on these pages)

### /empire
- Keeps the premium feel
- Removes all agent names
- Adds "Apply" gating (you don't just buy Empire — you apply)

### /brief (The Intake Form)
- Minimal, focused, no distractions
- Progress indicator (Step 1/3 → Step 2/3 → Step 3/3)
- Single question per step
- Citrus accent throughout
- "Being reviewed by our team" state animation on submit

---

## What Magnificent Looks Like

Reference energy (not copy):
- Linear.app — dark, precise, every pixel intentional
- Vercel.com — confident whitespace, nothing wasted
- Stripe.com — copywriting and design in perfect sync
- Arc browser launch pages — playful but not frivolous

**jonnyai.co.uk should feel like:** You stumbled onto the personal site of someone who has quietly built something extraordinary. Not a startup trying to look big. Not an agency hiding behind stock photos. A real operation with real capability — and the confidence to show it simply.

---

## What Magnificent Does NOT Look Like

- Gradients everywhere (pick your moments)
- Emoji in headings
- Stock photography of people at laptops
- Too many animations competing with each other
- Cluttered navbars
- "Book a free call" as the hero CTA (transactional, weak)
- More than 2 typefaces
- Light mode

---

## Handoff to Implementation

Design decisions are locked. Implementation is Claude Code reading this brief + agent copy outputs.

Order of implementation:
1. Global: layout.tsx, globals.css — brand tokens, fonts, base styles
2. Components: GlassNavbar (new nav structure), footer, GlassCard, CTAButton
3. Hero: OrbitalCanvas component (new animated background)
4. Homepage: full rebuild using agent copy
5. New pages: /install, /automate, /youtube
6. Updated pages: /build, /workforce, /empire
7. Legal: /privacy, /terms (agent output)
8. Remove: /agentport, /review-coach, /ai-firewall
9. SEO: metadata.ts for all pages, schema markup
10. Deploy: vercel --prod
