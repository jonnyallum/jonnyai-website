'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';
import { newsItems } from '@/lib/data/blog-posts';

export default function NewsBar() {
  const x = useMotionValue(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useAnimationFrame((_t, delta) => {
    const speed = 45; // px per second
    const contentWidth = contentRef.current?.offsetWidth ?? 0;
    const halfWidth = contentWidth / 2;
    const newX = x.get() - (speed * delta) / 1000;
    x.set(Math.abs(newX) >= halfWidth ? newX + halfWidth : newX);
  });

  const doubled = [...newsItems, ...newsItems];

  return (
    <div className="sticky top-16 z-40 bg-panel/95 backdrop-blur-md border-b border-white/8 overflow-hidden">
      <div className="flex items-center h-8">
        {/* Label */}
        <Link
          href="/blog"
          className="shrink-0 px-4 border-r border-white/10 text-[9px] font-mono uppercase tracking-[0.25em] text-citrus h-full flex items-center bg-citrus/10 hover:bg-citrus/20 transition-colors whitespace-nowrap"
        >
          LIVE UPDATES
        </Link>

        {/* Ticker */}
        <div className="flex-1 overflow-hidden">
          <motion.div ref={contentRef} style={{ x }} className="flex items-center whitespace-nowrap">
            {doubled.map((item, i) => (
              <span key={i} className="inline-flex items-center text-[10px] font-mono text-white/40">
                <span className="px-5">{item}</span>
                <span className="text-citrus/30">·</span>
              </span>
            ))}
          </motion.div>
        </div>

        {/* Blog CTA */}
        <Link
          href="/blog"
          className="shrink-0 px-4 border-l border-white/10 text-[9px] font-mono uppercase tracking-[0.2em] text-white/30 hover:text-citrus h-full flex items-center transition-colors whitespace-nowrap"
        >
          Blog →
        </Link>
      </div>
    </div>
  );
}
