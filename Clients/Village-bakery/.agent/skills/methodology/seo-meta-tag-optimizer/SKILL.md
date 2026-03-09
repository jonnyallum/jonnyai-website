# SEO Meta Tag Optimizer

## Description
Analyzes web pages and generates optimized SEO meta tags, Open Graph tags, and structured data markup for improved search engine visibility.

## Goal
Create comprehensive, SEO-optimized meta tags and structured data for web pages based on content analysis and best practices.

## Implementation Instructions
1.  **Analyze Content:** Extract the main topic, headings, images, and page purpose.
2.  **Generate Tags:** Generate:
    *   Title tag (50-60 characters, keyword-focused).
    *   Meta description (150-160 characters, compelling).
    *   Open Graph tags (`og:title`, `og:image`, etc.).
    *   Twitter Card tags.
3.  **Structured Data:** Create appropriate JSON-LD structured data (Product, Article, FAQ).
4.  **Density Check:** Check for keyword density and suggest improvements.
5.  **Implementation:** Provide implementation code for the specific framework (e.g., Next.js `generateMetadata`).

## Constraints
- **DO NOT** exceed character limits for title (60) and description (160) tags.
- **DO NOT** use generic descriptions.
- **ALWAYS** use absolute URLs for images.
- **ENSURE** structured data follows schema.org exactly.
