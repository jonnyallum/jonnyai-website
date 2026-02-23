import { NextRequest, NextResponse } from 'next/server';
import { blogPosts } from '@/lib/data/blog-posts';
import { upsertPosts } from '@/lib/supabase-blog';

/**
 * POST /api/seed-blog
 * Seeds / re-syncs all blog posts from blog-posts.ts into the Shared Brain.
 * Protected by SEED_SECRET header — only call from seed script or locally.
 *
 * Required env:
 *   SHARED_BRAIN_SERVICE_ROLE_KEY — service role key for lkwydqtfbdjhxaarelaz
 *   SEED_SECRET                   — shared secret for auth (set in .env.local)
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-seed-secret');
  if (secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.SHARED_BRAIN_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: 'SHARED_BRAIN_SERVICE_ROLE_KEY not set' },
      { status: 500 }
    );
  }

  try {
    const { upserted, errors } = await upsertPosts(blogPosts);
    return NextResponse.json({ upserted, errors, total: blogPosts.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
