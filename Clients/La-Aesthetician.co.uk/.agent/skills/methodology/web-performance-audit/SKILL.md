# Web Performance Audit

## Description
Analyzes web applications for performance bottlenecks using Core Web Vitals, generates actionable optimization recommendations with code examples.

## Implementation Instructions
1.  **Analyze Assets:** Audit code for large bundles, unused CSS, and non-optimized images.
2.  **Measure Metrics:** Check LCP, FID, CLS, and TTFB.
3.  **Identify Bottlenecks:** Scan for blocking scripts, excessive DOM size, and lack of caching.
4.  **Generate Recommendations:** Provide specific fixes (e.g., Code splitting, Image compression, Pre-fetching).
5.  **Verify:** Re-run the audit after implementation to quantify gains.

## Constraints
- **DO NOT** prioritize micro-optimizations over architectural improvements.
- **ALWAYS** provide before/after metrics.
- **DO NOT** break functionality to "gain speed."
