import type { Metadata } from 'next';
import Link from 'next/link';
import { blogPosts, timeline } from '@/lib/data/blog-posts';

export const metadata: Metadata = {
  title: 'Insights & Updates | JonnyAi — AI Product Engine UK',
  description:
    'Deep dives into AI-powered development, the Antigravity Orchestra, and how we build production-grade software in 48 hours. Real insights from a real AI agency.',
  keywords:
    'AI development agency UK, AI product engine, specialist agents, transparent AI development, MVP development AI, Jai.OS',
  openGraph: {
    title: 'Insights & Updates | JonnyAi',
    description:
      'How we build production-grade software in 48 hours using 65 specialist AI agents.',
    type: 'website',
    locale: 'en_GB',
  },
};

const categoryColours: Record<string, string> = {
  'System Update': 'text-signal border-signal/30 bg-signal/5',
  'Product': 'text-citrus border-citrus/30 bg-citrus/5',
  'Case Study': 'text-blue-400 border-blue-400/30 bg-blue-400/5',
  'Insight': 'text-purple-400 border-purple-400/30 bg-purple-400/5',
  'Weekly Intel': 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5',
};

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className={`text-[9px] font-mono uppercase tracking-[0.25em] border px-2 py-0.5 rounded-sm ${categoryColours[category] ?? 'text-white/40 border-white/10'}`}>
      {category}
    </span>
  );
}

export default function BlogPage() {
  const sorted = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));
  const featured = sorted.find(p => p.featured) ?? sorted[0];
  const weeklyPosts = sorted.filter(p => p.category === 'Weekly Intel');
  const rest = sorted.filter(p => p.slug !== featured.slug && p.category !== 'Weekly Intel');

  return (
    <main className="min-h-screen bg-void">
      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-16 px-6 border-b border-white/5 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(217,119,87,0.08) 0%, transparent 60%)' }}
        />
        <div className="relative max-w-5xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-citrus">Insights & Updates</span>
          <h1 className="font-outfit font-extrabold text-5xl md:text-6xl leading-none tracking-tight mt-4 mb-4">
            Inside the Orchestra.
          </h1>
          <p className="text-white/40 text-lg max-w-xl">
            How we build, what we've learned, and why 65 specialists beat one generalist every time.
          </p>
        </div>
      </section>

      {/* ── FEATURED ───────────────────────────────────────────────────── */}
      <section className="py-16 px-6 border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-white/25 mb-8">— Featured</p>
          <Link
            href={`/blog/${featured.slug}`}
            className="group block bg-surface border border-white/8 rounded-sm p-8 md:p-12 hover:border-citrus/20 transition-all duration-300"
          >
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <CategoryBadge category={featured.category} />
              <span className="text-[10px] font-mono text-white/25 uppercase tracking-widest">
                {featured.date} · {featured.readTime} min read
              </span>
            </div>
            <h2 className="font-outfit font-extrabold text-3xl md:text-4xl text-white group-hover:text-citrus transition-colors leading-tight mb-4">
              {featured.title}
            </h2>
            <p className="text-white/40 text-base leading-relaxed mb-8 max-w-2xl">
              {featured.excerpt}
            </p>
            <div className="flex flex-wrap gap-2">
              {featured.tags.slice(0, 4).map(tag => (
                <span key={tag} className="text-[9px] font-mono text-white/20 border border-white/8 px-2 py-0.5 rounded-sm">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-6 text-xs font-mono uppercase tracking-[0.25em] text-citrus group-hover:gap-3 transition-all">
              Read Article →
            </div>
          </Link>
        </div>
      </section>

      {/* ── WEEK IN AI ─────────────────────────────────────────────────── */}
      {weeklyPosts.length > 0 && (
        <section className="py-16 px-6 border-b border-white/5">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <p className="text-xs font-mono uppercase tracking-[0.3em] text-yellow-400">— Week in AI</p>
              <span className="text-[9px] font-mono text-white/20 border border-white/8 px-2 py-0.5 rounded-sm">Every Monday</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {weeklyPosts.map(post => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block bg-surface border border-yellow-400/10 rounded-sm p-5 hover:border-yellow-400/30 transition-all duration-300"
                >
                  <span className="text-[9px] font-mono text-yellow-400/60 border border-yellow-400/20 bg-yellow-400/5 px-2 py-0.5 rounded-sm mb-3 inline-block">
                    Week in AI
                  </span>
                  <h3 className="font-outfit font-bold text-base text-white group-hover:text-yellow-400 transition-colors leading-tight mb-2">
                    {post.title}
                  </h3>
                  <p className="text-white/30 text-xs leading-relaxed line-clamp-2">{post.excerpt}</p>
                  <div className="mt-4 text-[9px] font-mono uppercase tracking-[0.2em] text-yellow-400/50 group-hover:text-yellow-400 transition-colors">
                    Read Intel →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── ARTICLE GRID ───────────────────────────────────────────────── */}
      <section className="py-16 px-6 border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-white/25 mb-8">— All Posts</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rest.map(post => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block bg-surface border border-white/8 rounded-sm p-6 hover:border-citrus/20 transition-all duration-300"
              >
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <CategoryBadge category={post.category} />
                  <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
                    {post.readTime} min
                  </span>
                </div>
                <h3 className="font-outfit font-bold text-xl text-white group-hover:text-citrus transition-colors leading-tight mb-3">
                  {post.title}
                </h3>
                <p className="text-white/35 text-sm leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="mt-5 text-[10px] font-mono uppercase tracking-[0.25em] text-citrus/60 group-hover:text-citrus transition-colors">
                  Read →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ───────────────────────────────────────────────────── */}
      <section className="py-16 px-6 border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-white/25 mb-2">— The Journey</p>
          <h2 className="font-outfit font-extrabold text-3xl text-white mb-12">
            From Zero to 65 Specialists.
          </h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[7px] top-0 bottom-0 w-px bg-gradient-to-b from-citrus/30 via-white/8 to-transparent" />

            <div className="space-y-10 pl-8">
              {[...timeline].reverse().map((event, i) => (
                <div key={i} className="relative">
                  {/* Dot */}
                  <div className="absolute -left-[21px] top-1.5 w-[15px] h-[15px] rounded-full border border-citrus/40 bg-citrus/10 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-citrus/60" />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-citrus border border-citrus/20 px-2 py-0.5 rounded-sm bg-citrus/5">
                      {event.phase}
                    </span>
                    <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
                      {event.date}
                    </span>
                    {event.metric && (
                      <span className="text-[9px] font-mono text-signal border border-signal/20 px-2 py-0.5 rounded-sm bg-signal/5">
                        {event.metric}
                      </span>
                    )}
                  </div>
                  <h3 className="font-outfit font-bold text-lg text-white mb-1">{event.title}</h3>
                  <p className="text-white/35 text-sm leading-relaxed">{event.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-citrus">Start Building</span>
          <h2 className="font-outfit font-extrabold text-4xl md:text-5xl text-white mt-4 mb-6 leading-tight">
            Ready to Ship?
          </h2>
          <p className="text-white/35 text-sm mb-8 leading-relaxed">
            Free scope session with Marcus. Fixed-price roadmap in 15 minutes.
          </p>
          <Link href="/brief" className="btn-citrus">
            Brief The Conductor
          </Link>
        </div>
      </section>
    </main>
  );
}
