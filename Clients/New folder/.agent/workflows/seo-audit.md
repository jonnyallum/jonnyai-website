---
description: Run a complete SEO audit on a page or site using Goldie's methodology.
---

# /seo-audit - SEO Optimization Workflow

## Steps

1. **Define Target** (@Conductor)
   - Specify URL or page to audit
   - Identify primary keyword target

2. **Technical SEO Check** (@Goldie)
   - [ ] robots.txt accessible
   - [ ] sitemap.xml exists and valid
   - [ ] No noindex on key pages
   - [ ] Canonical tags correct
   - [ ] Mobile-friendly (responsive)

3. **On-Page SEO Audit** (@Goldie)
   - [ ] Title tag: 50-60 chars, keyword near front
   - [ ] Meta description: 150-160 chars, compelling
   - [ ] One H1 per page with primary keyword
   - [ ] H2-H6 hierarchy logical
   - [ ] Image alt text descriptive
   - [ ] Internal links to related content

4. **Structured Data** (@Goldie + @Jonny AI)
   - [ ] JSON-LD schema present
   - [ ] Schema type appropriate (Article, Product, LocalBusiness, FAQ)
   - [ ] Validate with Google Rich Results Test

5. **Performance Check** (@Metric)
   - [ ] Core Web Vitals pass (LCP < 2.5s, FID < 100ms, CLS < 0.1)
   - [ ] Page speed score > 90
   - [ ] Images optimized (WebP, lazy load)

6. **Content Quality** (@Echo + @Goldie)
   - [ ] Content depth > 1000 words for competitive terms
   - [ ] Keywords naturally integrated
   - [ ] No keyword stuffing
   - [ ] Clear value proposition

7. **Generate Report** (@Archivist)
   - Create SEO scorecard in `.tmp/seo_audit_[date].md`
   - List action items by priority

8. **Implement Fixes** (@Jonny AI + @Pixel)
   - Address critical issues first
   - Update meta tags, schema, content

9. **Deploy & Verify** (@Deploy)
   - Push changes to production
   - Request Google re-crawl via Search Console

## Output
- SEO Scorecard (`.tmp/seo_audit_[date].md`)
- Action items assigned to agents
- Before/after comparison

## Schedule
- Run weekly on key landing pages
- Run before any major content launch
