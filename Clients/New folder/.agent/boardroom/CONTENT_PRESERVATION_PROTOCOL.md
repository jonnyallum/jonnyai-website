# Content Preservation Protocol

> **Status:** MANDATORY | **Gate:** Truth-Lock Pre-Deployment
> **Origin:** La-Aesthetician incident (2026-02-05) - stock photo deployed instead of real client

---

## The Rule

**NO PLACEHOLDER IMAGES. EVER.**

If real client assets don't exist, the deployment is BLOCKED until they do.

---

## Pre-Redesign Checklist

Before ANY UI update or website redesign, complete this checklist:

### 1. Asset Audit
```
[ ] Archive existing images to `Clients/[name]/assets/originals/`
[ ] Screenshot current live website
[ ] Document all image sources (where did each come from?)
[ ] List client's social media handles in CLIENT_BRIEF.md
```

### 2. Content Verification
```
[ ] Verify client's real name/business name
[ ] Verify phone numbers are correct
[ ] Verify address/location is accurate
[ ] Verify social media links work
[ ] Verify booking links are functional
```

### 3. Photo Source Documentation
```
[ ] Each image must have a source tag:
    - [CLIENT] - Provided by client directly
    - [SOCIAL] - Downloaded from client's social media (with permission)
    - [STOCK] - Stock photo (REQUIRES JUSTIFICATION)
    - [GENERATED] - AI generated (REQUIRES APPROVAL)
```

---

## CLIENT_BRIEF.md Template

Every client project MUST have this file:

```markdown
# Client Brief: [Business Name]

## Contact
- Owner: [Name]
- Phone: [Number]
- Email: [Email]

## Social Media
- Instagram: @[handle] - https://instagram.com/[handle]
- Facebook: [link]
- TikTok: [link]

## Brand Assets
- Logo: `assets/logo.png` [CLIENT]
- Hero Photo: `assets/hero.jpg` [CLIENT]
- Profile Photo: `assets/profile.jpg` [SOCIAL]

## Real Photos Available
- [ ] Owner/staff headshots
- [ ] Premises/location photos
- [ ] Product/service photos
- [ ] Before/after examples
- [ ] Testimonial photos

## Content Truth-Lock
- [ ] All photos verified as real client assets
- [ ] All claims verified against source
- [ ] No placeholder images
```

---

## Blocked Actions

The following will FAIL the Truth Gate (@Rowan/@Eckhart):

1. Using Unsplash/Pexels/stock photos for client portraits
2. Using AI-generated photos of people without disclosure
3. Deploying with "placeholder" marked images
4. Missing CLIENT_BRIEF.md file
5. Unverified social media links

---

## Instagram Content Protocol

Since Instagram blocks scraping:

1. **Manual Download Required**
   - Ask client for photos directly
   - OR have client approve screenshot downloads
   - Save to `Clients/[name]/assets/instagram/`

2. **Reel Embedding**
   - Use official Instagram embed code
   - Requires public post
   - Test embed before deployment

3. **Instagram Feed Widgets**
   - Use official Instagram Basic Display API
   - OR embed via approved widgets (Elfsight, Curator.io)
   - Requires client OAuth approval

---

## Sign-Off Requirement

Before deployment, @Rowan must verify:

```
[ ] All photos are real client assets (not stock)
[ ] CLIENT_BRIEF.md exists and is complete
[ ] Social media links verified working
[ ] No placeholder URLs in codebase
```

Only after this verification can @Owen proceed with deployment.

---

## Lesson Learned

> *"A stock photo of a random nurse representing a real business owner is a lie.
> It damages trust and violates Truth-Lock. Never again."*
> - La-Aesthetician Incident, 2026-02-05

---

*Protocol established by: The Antigravity Orchestra | Jai.OS 5.0*
