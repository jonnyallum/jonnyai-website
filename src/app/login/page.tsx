'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import Link from 'next/link';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const next = searchParams.get('next') || '/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setLoading(true);
    setError('');

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}${next}`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="text-4xl mb-4">📨</div>
        <h2 className="font-outfit font-extrabold text-2xl text-white mb-2">Check your email.</h2>
        <p className="text-white/40 text-sm max-w-xs mx-auto leading-relaxed">
          We sent a magic link to <span className="text-white/70">{email}</span>. Click it to access your Glass Box.
        </p>
        <Link href="/" className="btn-ghost text-xs py-2 px-5 mt-8 inline-flex">
          Back to Home
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm"
    >
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="font-outfit font-extrabold text-xl text-white">JonnyAi</span>
          <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-citrus border border-citrus/30 px-1.5 py-0.5 rounded-sm">
            Glass Box
          </span>
        </div>
        <h1 className="font-outfit font-extrabold text-3xl text-white mb-2">Client Login</h1>
        <p className="text-white/40 text-sm">Enter your email for a magic link.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoFocus
          className="w-full bg-surface border border-white/12 rounded-sm px-4 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-citrus/50 transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-citrus w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Send Magic Link →'}
        </button>
      </form>

      {error && (
        <p className="text-red-400/80 text-xs font-mono text-center mt-3">{error}</p>
      )}

      <p className="text-white/20 text-xs text-center mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/brief" className="text-citrus/70 hover:text-citrus transition-colors">
          Brief Marcus first →
        </Link>
      </p>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-6 pt-16">
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(217,119,87,0.08) 0%, transparent 65%)' }}
      />
      <div className="relative z-10 w-full max-w-sm">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
