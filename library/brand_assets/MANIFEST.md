# 🎨 Brand Asset Library — Manifest
> **Directive:** All images used by the Social Engine MUST pull from this library.  
> **Maintained by:** @Blaise (Art Direction) + @Priya (UI Polish)  
> **Last updated:** 2026-03-04

---

## Directory Structure

```
library/brand_assets/
├── MANIFEST.md              ← This file
├── logos/                   ← All brand logos (SVG + PNG)
├── flyers/                  ← Social media flyer templates
├── fonts/                   ← Brand typography files
└── screenshots/
    └── baselines/           ← Visual regression test baselines
```

---

## Active Brands

| Brand | Logo File | Primary Colour | Font |
|:------|:----------|:--------------|:-----|
| **Antigravity** | `logos/antigravity-logo.svg` | `#000000` / `#FFFFFF` | Inter / Space Grotesk |
| **JonnyAI** | `logos/jonnyai-logo.svg` | `#6366F1` (Indigo) | Inter |
| **BL Motorcycles** | `logos/bl-motorcycles-logo.png` | `#FF6B00` (Orange) | Roboto |
| **Gold Standard** | `logos/gold-standard-logo.svg` | `#D4AF37` (Gold) | Playfair Display |

---

## Flyer Templates

| File | Brand | Format | Usage |
|:-----|:------|:-------|:------|
| `flyers/ag-square-dark.png` | Antigravity | 1080×1080 | Instagram Feed |
| `flyers/ag-story-dark.png` | Antigravity | 1080×1920 | Instagram Story |
| `flyers/jonnyai-square.png` | JonnyAI | 1080×1080 | Instagram Feed |

---

## Fonts

| File | Family | Weight | Usage |
|:-----|:-------|:-------|:------|
| `fonts/inter-variable.woff2` | Inter | 100–900 | UI Body |
| `fonts/space-grotesk.woff2` | Space Grotesk | 400–700 | Headlines |
| `fonts/playfair-display.woff2` | Playfair Display | 400–700 | Gold Standard |

---

## Social Engine Rules

1. **Every flyer** must use an asset from `flyers/` as the base background
2. **Overlay text** uses brand font from `fonts/`
3. **Logo placement** — bottom-right corner, 48px padding, from `logos/`
4. **No off-brand colours** — stick to the palette above
5. **All assets must be committed here** before use in any automated pipeline

---

## Visual Regression Baselines

Baseline screenshots are stored in `screenshots/baselines/` and captured by:
```bash
python execution/visual_regression.py --capture-baselines
```

| Page | Baseline File | Last Captured |
|:-----|:-------------|:-------------|
| `/` (Home) | `screenshots/baselines/home.png` | pending |
| `/workforce` | `screenshots/baselines/workforce.png` | pending |
| `/brief` | `screenshots/baselines/brief.png` | pending |
| `/status` | `screenshots/baselines/status.png` | pending |

---

_Initialised by @Marcus | Jai.OS 5.0 | 2026-03-04_
