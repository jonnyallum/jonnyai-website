'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function DashboardIndexPage() {
  const router = useRouter();

  useEffect(() => {
    async function redirect() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      // Find most recent project
      const { data: projects } = await supabase
        .from('glasbox_projects')
        .select('id')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (projects && projects.length > 0) {
        router.push(`/dashboard/${projects[0].id}`);
      } else {
        // No project yet — send to brief
        router.push('/brief');
      }
    }
    redirect();
  }, [router]);

  return (
    <div className="min-h-screen bg-void flex items-center justify-center">
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <span key={i} className="w-2 h-2 rounded-full bg-citrus animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
    </div>
  );
}
