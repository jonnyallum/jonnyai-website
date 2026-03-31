import { createClient } from '@supabase/supabase-js';
import type { BlogPost } from './data/blog-posts';

// Server-side client for blog_posts — uses Shared Brain (lkwydqtfbdjhxaarelaz)
function getClient(serviceRole = false) {
  const url = process.env.NEXT_PUBLIC_SHARED_BRAIN_URL;
  const key = serviceRole
    ? process.env.SHARED_BRAIN_SERVICE_ROLE_KEY
    : process.env.NEXT_PUBLIC_SHARED_BRAIN_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function rowToPost(row: Record<string, unknown>): BlogPost {
  return {
    slug: row.slug as string,
    title: row.title as string,
    excerpt: row.excerpt as string,
    content: row.content as string,
    date: typeof row.date === 'string' ? row.date.slice(0, 10) : String(row.date),
    category: row.category as BlogPost['category'],
    readTime: row.read_time as number,
    featured: (row.featured as boolean) ?? false,
    tags: (row.tags as string[]) ?? [],
  };
}

export async function fetchPublishedPosts(): Promise<BlogPost[]> {
  const client = getClient();
  if (!client) return [];
  const { data, error } = await client
    .from('blog_posts')
    .select('slug,title,excerpt,content,date,category,read_time,featured,tags')
    .eq('status', 'published')
    .order('date', { ascending: false });
  if (error || !data?.length) return [];
  return data.map(rowToPost);
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  const client = getClient();
  if (!client) return null;
  const { data, error } = await client
    .from('blog_posts')
    .select('slug,title,excerpt,content,date,category,read_time,featured,tags')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  if (error || !data) return null;
  return rowToPost(data as Record<string, unknown>);
}

export async function upsertPosts(posts: BlogPost[]): Promise<{ upserted: number; errors: string[] }> {
  const client = getClient(true);
  if (!client) return { upserted: 0, errors: ['Supabase not configured'] };
  const errors: string[] = [];
  let upserted = 0;
  for (const post of posts) {
    const row = {
      slug: post.slug, title: post.title, excerpt: post.excerpt,
      content: post.content, date: post.date, category: post.category,
      read_time: post.readTime, featured: post.featured ?? false,
      tags: post.tags, status: 'published',
    };
    const { error } = await client.from('blog_posts').upsert(row, { onConflict: 'slug' });
    if (error) { errors.push(`${post.slug}: ${error.message}`); } else { upserted++; }
  }
  return { upserted, errors };
}
