# CSS Architecture Refactor

## Description
Analyzes existing CSS/Tailwind styles to identify inconsistencies, duplication, and performance issues, refactoring into a scalable design system.

## Goal
Transform "spaghetti CSS" or messy ad-hoc Tailwind classes into a clean, maintainable, and typed design system.

## Implementation Instructions
1.  **Audit:** Identify hardcoded color values, inconsistent spacing, and duplicated utility combinations.
2.  **Theme Definition:** Move core values (Colors, Fonts, Shadows) into the `tailwind.config.ts` or CSS variables.
3.  **Componentization:** Identify repeating visual patterns and refactor them into reusable React components with optimized Tailwind classes.
4.  **Dynamic Logic:** Replace ad-hoc style strings with robust libraries like `clsx` or `tailwind-merge`.
5.  **Performance Check:** Ensure no unused CSS is being shipped and layout shifts are minimized.

## Constraints
- **DO NOT** use `!important` unless absolutely unavoidable for 3rd party overrides.
- **ALWAYS** prioritize Tailwind v4 `@theme` patterns.
- **DO NOT** create "Global" styles for element tags; use classes.
