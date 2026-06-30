import { MetadataRoute } from 'next';
import { caseStudies } from '@/lib/data/case-studies';
import { blogPosts as staticPosts } from '@/lib/data/blog-posts';
import { fetchPublishedPosts } from '@/lib/supabase-blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://jonnyai.co.uk';
  const now = new Date();

  // Core pages — hand-ranked by importance.
  const core: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/bizos`, lastModified: now, changeFrequency: 'weekly', priority: 0.97 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/music`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/portfolio`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${base}/portfolio/case-studies`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/portfolio/cv`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/marketplace`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/install`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/build`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/automate`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/brief`, lastModified: now, changeFrequency: 'monthly', priority: 0.95 },
    { url: `${base}/card`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Every case study gets its own entry.
  const studies: MetadataRoute.Sitemap = caseStudies.map((cs) => ({
    url: `${base}/portfolio/case-studies/${cs.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: cs.featured ? 0.85 : 0.7,
  }));

  // Blog posts — static set plus any live Supabase posts (fails gracefully).
  let livePosts: { slug: string; date?: string }[] = [];
  try {
    livePosts = await fetchPublishedPosts();
  } catch {
    livePosts = [];
  }
  const seen = new Set(staticPosts.map((p) => p.slug));
  const allPosts = [
    ...staticPosts,
    ...livePosts.filter((p) => !seen.has(p.slug)),
  ];
  const posts: MetadataRoute.Sitemap = allPosts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: p.date ? new Date(p.date) : now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...core, ...studies, ...posts];
}
