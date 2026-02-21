'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

function NewDashboardInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState<'loading' | 'creating' | 'done' | 'error'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId) {
      setError('No payment session found.');
      setStatus('error');
      return;
    }

    async function createProject() {
      setStatus('creating');
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          // Not logged in — send to login first, come back after
          router.push(`/login?next=/dashboard/new?session_id=${sessionId}`);
          return;
        }

        // Verify Stripe session + get product name via API
        const res = await fetch('/api/verify-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId }),
        });
        const data = await res.json();

        if (!res.ok || data.error) {
          setError(data.error || 'Could not verify payment.');
          setStatus('error');
          return;
        }

        // Create project in Supabase
        const { data: project, error: dbError } = await supabase
          .from('glasbox_projects')
          .insert({
            client_id: user.id,
            name: data.productName || 'Your Project',
            stripe_session_id: sessionId,
            status: 'active',
          })
          .select('id')
          .single();

        if (dbError) {
          setError(dbError.message);
          setStatus('error');
          return;
        }

        setStatus('done');
        setTimeout(() => router.push(`/dashboard/${project.id}`), 1200);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unexpected error');
        setStatus('error');
      }
    }

    createProject();
  }, [sessionId, router]);

  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-6">
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(217,119,87,0.08) 0%, transparent 65%)' }}
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center max-w-sm"
      >
        {status === 'loading' || status === 'creating' ? (
          <>
            <div className="flex justify-center gap-1.5 mb-6">
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full bg-citrus animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
            <h1 className="font-outfit font-extrabold text-2xl text-white mb-2">
              {status === 'loading' ? 'Verifying payment...' : 'Spinning up your Glass Box...'}
            </h1>
            <p className="text-white/40 text-sm">
              {status === 'creating' ? 'Marcus is assembling your workforce.' : 'Just a moment.'}
            </p>
          </>
        ) : status === 'done' ? (
          <>
            <div className="text-4xl mb-4">🚀</div>
            <h1 className="font-outfit font-extrabold text-2xl text-white mb-2">Glass Box activated.</h1>
            <p className="text-white/40 text-sm">Redirecting to your dashboard...</p>
          </>
        ) : (
          <>
            <div className="text-4xl mb-4">⚠️</div>
            <h1 className="font-outfit font-extrabold text-xl text-white mb-2">Something went wrong</h1>
            <p className="text-red-400/80 text-xs font-mono mb-6">{error}</p>
            <a href="mailto:hello@jonnyai.co.uk" className="btn-citrus text-xs px-6 py-2.5 inline-block">
              Contact Support →
            </a>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function NewDashboardPage() {
  return (
    <Suspense>
      <NewDashboardInner />
    </Suspense>
  );
}
