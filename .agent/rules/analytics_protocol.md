# Analytics Protocol — Mandatory for All New Websites

**Rule: Every new client website MUST have Google Analytics 4 (GA4) tracking configured before or at deployment.**

---

## Standard Implementation

### Next.js Apps
Add to `app/layout.tsx` (or `src/app/layout.tsx`):

```tsx
import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX";

// Inside <html>:
<head>
  <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
  <Script id="ga-init" strategy="afterInteractive">{`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_ID}', { page_path: window.location.pathname });
  `}</Script>
</head>
```

### Vite / Static HTML Sites
Add to `index.html` before `</body>`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## GA4 Property Setup Checklist

- [ ] Create property in GA4 Console → Admin → Create → Property
- [ ] Set timezone: Europe/London, currency: GBP
- [ ] Add Web data stream with the live domain
- [ ] Copy Measurement ID (format: `G-XXXXXXXXXX`)
- [ ] Add to codebase (hardcoded or via env var)
- [ ] Build and deploy
- [ ] Verify data appears in GA4 Realtime within 24h

---

## Current Client GA4 Measurement IDs

| Client | Domain | Measurement ID |
|--------|---------|----------------|
| Jonny AI | jonnyai.co.uk | `G-K44SB55BCD` |
| Village Bakery | villagebakeryandcafe.co.uk | `G-PH6XCLJMX0` |
| CD Waste | cd-waste.co.uk | `G-57X16574EP` |
| DJ Waste | dj-waste.co.uk | `G-00MC1KK8W1` |
| Construct FM | construct-fm.co.uk | `G-9H2PVF17RF` |
| BL Motorcycles | blmotorcyclesltd.co.uk | `G-Q7XVHQ8K25` |
| JSC Contractors | jsccontractors.co.uk | `G-MB5628X5NY` |
| Marzer Pro | marzer-pro.co.uk | `G-R93TZFH69Z` |
| Sparta Coatings | sparta-coatings.co.uk | `G-SWFD03F3P0` |

---

_Jai.OS 4.0 | Mandatory Agency Rule | Owner: @jonny | Enforced by: @genesis, @neo_
