import { NextResponse } from 'next/server';
import { blogPosts } from '@/lib/data/blog_posts';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SHARED_BRAIN_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SHARED_BRAIN_SERVICE_ROLE_KEY;
const SEED_SECRET = process.env.SEED_SECRET;

export async function POST(req: Request) {
  try {
    const { secret } = await req.json();

    if (secret !== SEED_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Supabase credentials missing' }, { status: 500 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Filter posts to only seed verified ones or all
    const postsToSeed = blogPosts.map(post => ({
      ...post,
      updated_at: new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from('blog_posts')
      .upsert(postsToSeed, { onConflict: 'slug' })
      .select();

    if (error) {
      console.error('Seed Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      count: data.length,
      message: `Successfully seeded ${data.length} blog posts.` 
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
