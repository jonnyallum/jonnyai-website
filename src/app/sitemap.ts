import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://jonnyai.co.uk';
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/bizos`, lastModified: now, changeFrequency: 'weekly', priority: 0.97 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/portfolio`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${base}/portfolio/case-studies`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/marketplace`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/install`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/build`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/automate`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/brief`, lastModified: now, changeFrequency: 'monthly', priority: 0.95 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
