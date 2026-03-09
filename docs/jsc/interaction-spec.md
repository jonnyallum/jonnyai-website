# Interaction Spec: The Color Reveal (Option A/B/C)

**Agent**: @Priya (UI/Visual Designer)
**Goal**: Create a premium, engaged interaction that showcases JSC's craftsmanship.

## Option A: The "Surgical" Hover (Recommended)

- **Visual**: Projects are rendered in ultra-detailed, high-contrast B&W.
- **Interaction**: A "surgical mask" or "spotlight" circle follows the user's cursor.
- **Effect**: Inside the circle, the image is revealed in full, vibrant color.
- **Logic**: It mimics a magnifying glass, inviting the user to _examine_ the detail.
- **Implementation**: CSS `mask-image` or `clip-path` synchronized with mouse coords.

## Option B: The "Foundation" Scroll

- **Visual**: The hero image begins as a technical, high-contrast B&W shot.
- **Interaction**: As the user scrolls down, a "flood" of color washes over the image from bottom to top.
- **Effect**: It mimics the building process—starting with the raw foundation (B&W) and completing the finish (Color).
- **Implementation**: Framer Motion `useScroll` and `useTransform` on a greyscale filter.

## Option C: The "Heritage" Toggle

- **Visual**: A global switch in the navigation bar labeled "Foundation / Finish" (or B&W / Color).
- **Interaction**: A physical toggle.
- **Effect**: The entire site flips between a noir-style blueprint look and a rich, color-saturated "Architectural Digest" look.
- **Logic**: Total user control. Shows the versatility of their work.

## Accessibility Backstop

- A "Color Always" button in the footer or settings for users with visual impairments who struggle with B&W contrast.

---

**Technical Feasibility**: @Sebastian
**Sign-off**: @Marcus
