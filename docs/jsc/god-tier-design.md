# Design Spec: God-Tier Heritage (JSC 2.0)

**Agent**: @Priya (Visual Designer) & @Blaise (Creative Director)
**Concept**: "Trillion-Dollar Craftsmanship"

## 1. The Upgrade: From Heritage to God-Tier

While `heritagewestsussex.co.uk` is the baseline, we are evolving it with:

- **Depth**: Using the `background 1.png` as a parallaxing, fixed background texture (low opacity, 3-5%) to create a "watermarked ivory" feel.
- **Glassmorphism**: Cards and navigation will use a frosted glass effect (`backdrop-filter: blur(12px)`) to feel modern yet premium.
- **Typography Evolution**:
  - **Headings**: `Playfair Display` (Black weight). It feels more "bespoke" and expensive than `Crimson Text`.
  - **Accents**: `Instrument Sans`. Ultra-clean for technical precision.
- **Micro-Animations**:
  - Smooth inertia scrolling (`Lenis`).
  - Grain texture overlay (subtle noise) to add tactility.

## 2. The Interaction: The "Revealer"

- **Foundation State**: Pure grayscale, high contrast. No grainy textures.
- **Revealed State**: Full color with a "Golden Hour" filter. Subtle bloom effect on highlights to emphasize "luxury."
- **Interaction**: The "Surgical" Hover (Option A from interaction-spec) with an additional "magnify" effect on the image scale.

## 3. Brand Presentation (The Trillion-Dollar Logo)

- Logo will be presented in a "floating" header with a subtle 3D shadow.
- Hovering the logo will trigger a subtle "gold leaf" shimmer effect (using CSS gradients and moving background-position).

## 4. Background Patterns

- **Base**: Off-white (`#F9F9F9`) with `background 1.png` tiled at 0.05 opacity.
- **Contrast**: Sections of deep charcoal (`#111`) with a subtle grid pattern to represent "The Blueprint."

---

**Status**: 🎨 DESIGNING
**Next Step**: Prototype <ImageReveal /> component.
