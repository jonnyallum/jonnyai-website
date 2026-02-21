'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Task {
  id: string;
  agent: string;
  action: string;
  status: string;
  created_at: string;
}

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  sort_order: number;
}

interface Project {
  id: string;
  name: string;
  status: string;
  created_at: string;
}

const AGENT_ROSTER = [
  { handle: '@Marcus', initials: 'MC' },
  { handle: '@Priya', initials: 'PS' },
  { handle: '@Sebastian', initials: 'SC' },
  { handle: '@Sam', initials: 'SB' },
  { handle: '@Derek', initials: 'DO' },
];

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    async function load() {
      // Verify session
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      // Fetch project
      const { data: proj, error: projErr } = await supabase
        .from('glasbox_projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (projErr || !proj) { router.push('/login'); return; }
      setProject(proj);

      // Fetch tasks
      const { data: taskData } = await supabase
        .from('glasbox_tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });
      setTasks(taskData || []);

      // Fetch milestones
      const { data: msData } = await supabase
        .from('glasbox_milestones')
        .select('*')
        .eq('project_id', projectId)
        .order('sort_order', { ascending: true });
      setMilestones(msData || []);

      setLoading(false);
    }

    load();

    // Realtime subscription for tasks
    const channel = supabase
      .channel(`tasks:${projectId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'glasbox_tasks',
        filter: `project_id=eq.${projectId}`,
      }, (payload) => {
        setTasks(prev => [...prev, payload.new as Task]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [projectId, router]);

  const completedMilestones = milestones.filter(m => m.completed).length;
  const progressPct = milestones.length > 0 ? Math.round((completedMilestones / milestones.length) * 100) : 0;

  if (loading) {
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

  return (
    <div className="min-h-screen bg-void pt-16">
      {/* Project header */}
      <div className="border-b border-white/8 bg-surface/70 backdrop-blur-xl sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs font-mono">
            <Link href="/" className="text-white/30 hover:text-white/60 transition-colors">JonnyAi</Link>
            <span className="text-white/15">/</span>
            <span className="text-white/50">{project?.name}</span>
            <span className="text-white/15">·</span>
            <span className="text-white/30 capitalize">{project?.status}</span>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] text-signal font-mono uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
            Live
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Live Terminal Feed */}
          <article className="lg:col-span-2 glass-panel">
            <header className="px-5 py-3 border-b border-white/8 flex items-center justify-between">
              <span className="text-xs font-mono text-white/40 uppercase tracking-widest">Live Terminal</span>
              <span className="flex items-center gap-1.5 text-[10px] text-signal font-mono">
                <span className="w-1 h-1 rounded-full bg-signal animate-pulse" />
                Streaming
              </span>
            </header>
            <div className="p-5 font-mono text-xs space-y-3 min-h-[400px]">
              {tasks.length === 0 ? (
                <p className="text-white/20">No activity yet. Your workforce is warming up...</p>
              ) : tasks.map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`leading-relaxed ${
                    task.status === 'error' ? 'text-yellow-400/80' :
                    task.status === 'done' ? 'text-signal/80' :
                    'text-white/40'
                  }`}
                >
                  <span className="text-white/20 mr-2">
                    [{new Date(task.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}]
                  </span>
                  {task.agent}: {task.action}
                </motion.div>
              ))}
              <div className="flex items-center gap-1.5 text-white/20 mt-4 pt-4 border-t border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" />
                <span>Waiting for next update...</span>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-5">

            {/* Workforce Roster */}
            <section className="glass-panel">
              <header className="px-5 py-3 border-b border-white/8">
                <span className="text-xs font-mono text-white/40 uppercase tracking-widest">Your Workforce</span>
              </header>
              <div className="p-5 space-y-3">
                {AGENT_ROSTER.map((agent) => {
                  const recentTask = tasks.findLast(t => t.agent === agent.handle);
                  const active = recentTask?.status === 'running';
                  return (
                    <div key={agent.handle} className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                          active
                            ? 'bg-citrus/10 text-citrus border border-citrus/20'
                            : 'bg-white/5 text-white/30 border border-white/8'
                        }`}>
                          {agent.initials}
                        </div>
                        {active && (
                          <motion.div
                            className="absolute -inset-0.5 rounded-full border border-signal"
                            animate={{ opacity: [0.8, 0.2, 0.8] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                          />
                        )}
                      </div>
                      <div>
                        <div className={`text-sm ${active ? 'text-white' : 'text-white/30'}`}>{agent.handle}</div>
                        <div className={`text-[10px] capitalize font-mono ${active ? 'text-signal' : 'text-white/20'}`}>
                          {recentTask?.status || 'standby'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Milestone Tracker */}
            <section className="glass-panel p-5">
              <div className="text-xs font-mono text-white/40 uppercase tracking-widest mb-4">Milestone Progress</div>
              {milestones.length === 0 ? (
                <p className="text-white/20 text-xs">Milestones loading...</p>
              ) : (
                <>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white">Overall Progress</span>
                      <span className="text-xs text-citrus font-mono">{progressPct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/8 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-citrus to-signal rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPct}%` }}
                        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    {milestones.map((ms) => (
                      <div key={ms.id} className="flex items-center gap-2 text-xs">
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${ms.completed ? 'bg-signal' : 'bg-white/15'}`} />
                        <span className={ms.completed ? 'text-white/70' : 'text-white/25'}>{ms.title}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </section>

            {/* Fund next phase CTA */}
            <section className="glass-card text-center">
              <div className="text-xs font-mono text-white/40 uppercase tracking-widest mb-1">Next Phase</div>
              <div className="font-outfit font-extrabold text-2xl text-citrus mt-2 mb-0.5">Unlock</div>
              <div className="text-xs text-white/30 mb-4">Ready to scale?</div>
              <Link href="/brief" className="btn-citrus w-full text-xs py-2.5 text-center block">
                Brief Marcus Again →
              </Link>
              <p className="text-white/15 text-[10px] mt-2 font-mono">Stripe · Secure · Instant kickoff</p>
            </section>

          </aside>
        </div>
      </div>
    </div>
  );
}
