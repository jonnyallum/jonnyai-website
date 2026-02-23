import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { blogPosts } from '@/lib/data/blog-posts';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find(p => p.slug === slug);
  if (!post) return {};
  return {
    title: `${post.title} | JonnyAi`,
    description: post.excerpt,
    keywords: post.tags.join(', '),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      locale: 'en_GB',
    },
  };
}

/** Converts **text** → <strong>text</strong> and renders paragraphs */
function renderContent(raw: string) {
  return raw.split('\n\n').map((para, i) => {
    const isHeading = para.startsWith('**') && para.endsWith('**') && !para.slice(2).includes('**');
    if (isHeading) {
      return (
        <h2 key={i} className="font-outfit font-bold text-2xl text-white mt-10 mb-4">
          {para.replace(/\*\*/g, '')}
        </h2>
      );
    }

    // Inline bold
    const parts = para.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} className="text-white/50 leading-relaxed mb-5">
        {parts.map((part, j) =>
          part.startsWith('**') ? (
            <strong key={j} className="text-white font-semibold">
              {part.replace(/\*\*/g, '')}
            </strong>
          ) : (
            part
          )
        )}
      </p>
    );
  });
}

const categoryColours: Record<string, string> = {
  'System Update': 'text-signal border-signal/30 bg-signal/5',
  'Product': 'text-citrus border-citrus/30 bg-citrus/5',
  'Case Study': 'text-blue-400 border-blue-400/30 bg-blue-400/5',
  'Insight': 'text-purple-400 border-purple-400/30 bg-purple-400/5',
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find(p => p.slug === slug);
  if (!post) notFound();

  const related = blogPosts
    .filter(p => p.slug !== slug)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-void">
      {/* ── ARTICLE HEADER ─────────────────────────────────────────────── */}
      <section className="pt-32 pb-12 px-6 border-b border-white/5 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(217,119,87,0.07) 0%, transparent 60%)' }}
        />
        <div className="relative max-w-2xl mx-auto">
          <Link
            href="/blog"
            className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/25 hover:text-citrus transition-colors mb-8 inline-block"
          >
            ← Back to Blog
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className={`text-[9px] font-mono uppercase tracking-[0.25em] border px-2 py-0.5 rounded-sm ${categoryColours[post.category] ?? 'text-white/40 border-white/10'}`}>
              {post.category}
            </span>
            <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
              {post.date} · {post.readTime} min read
            </span>
          </div>

          <h1 className="font-outfit font-extrabold text-4xl md:text-5xl text-white leading-tight mb-6">
            {post.title}
          </h1>
          <p className="text-white/40 text-lg leading-relaxed">
            {post.excerpt}
          </p>
        </div>
      </section>

      {/* ── ARTICLE BODY ───────────────────────────────────────────────── */}
      <section className="py-12 px-6 border-b border-white/5">
        <article className="max-w-2xl mx-auto">
          {renderContent(post.content)}
        </article>
      </section>

      {/* ── TAGS ───────────────────────────────────────────────────────── */}
      <section className="py-8 px-6 border-b border-white/5">
        <div className="max-w-2xl mx-auto flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <span key={tag} className="text-[9px] font-mono text-white/20 border border-white/8 px-2 py-1 rounded-sm">
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* ── RELATED ────────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="py-16 px-6 border-b border-white/5">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-white/25 mb-8">— More Insights</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map(p => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group block bg-surface border border-white/8 rounded-sm p-5 hover:border-citrus/20 transition-all duration-300"
                >
                  <span className={`text-[9px] font-mono uppercase tracking-[0.2em] border px-2 py-0.5 rounded-sm mb-3 inline-block ${categoryColours[p.category] ?? 'text-white/40 border-white/10'}`}>
                    {p.category}
                  </span>
                  <h3 className="font-outfit font-bold text-base text-white group-hover:text-citrus transition-colors leading-tight mb-2">
                    {p.title}
                  </h3>
                  <p className="text-white/30 text-xs leading-relaxed line-clamp-2">
                    {p.excerpt}
                  </p>
                  <div className="mt-4 text-[9px] font-mono uppercase tracking-[0.2em] text-citrus/50 group-hover:text-citrus transition-colors">
                    Read →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-citrus">Start Building</span>
          <h2 className="font-outfit font-extrabold text-4xl text-white mt-4 mb-6 leading-tight">
            Ready to Ship in 48 Hours?
          </h2>
          <Link href="/brief" className="btn-citrus">
            Brief The Conductor
          </Link>
        </div>
      </section>
    </main>
  );
}
