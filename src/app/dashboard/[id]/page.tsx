'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Phase 3.1: Replace mock data with Supabase Realtime subscriptions
// @Sebastian: subscribe to tasks table, @Diana: verify RLS policies

const mockProject = {
  name: 'ACME App',
  phase: 1,
  totalPhases: 3,
  healthScore: 35,
};

const mockTasks = [
  { id: 1, text: '@Sebastian committed: setup-supabase-auth.ts', time: '10:43', type: 'commit' },
  { id: 2, text: '@Priya committed: GlassNavbar.tsx — dark mode approved', time: '10:45', type: 'commit' },
  { id: 3, text: '@Marcus reviewing: milestone-1-auth', time: '10:48', type: 'info' },
  { id: 4, text: '@Sam raised alert: RLS policy missing on tasks table', time: '10:51', type: 'alert' },
  { id: 5, text: '@Victor patched: multi-tenant RLS secured', time: '10:52', type: 'commit' },
  { id: 6, text: '@Sebastian committed: dashboard-realtime-hooks.ts', time: '10:54', type: 'commit' },
];

const mockAgents = [
  { handle: '@Marcus', initials: 'MC', status: 'reviewing', active: true },
  { handle: '@Priya', initials: 'PS', status: 'designing', active: true },
  { handle: '@Sebastian', initials: 'SC', status: 'idle', active: false },
  { handle: '@Sam', initials: 'SB', status: 'idle', active: false },
  { handle: '@Derek', initials: 'DO', status: 'idle', active: false },
];

export default function DashboardPage() {
  const params = useParams();
  const projectId = params?.id as string;

  return (
    <div className="min-h-screen bg-void pt-16">
      {/* Project header */}
      <div className="border-b border-white/8 bg-surface/70 backdrop-blur-xl sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs font-mono">
            <Link href="/" className="text-white/30 hover:text-white/60 transition-colors">JonnyAi</Link>
            <span className="text-white/15">/</span>
            <span className="text-white/50">{mockProject.name}</span>
            <span className="text-white/15">·</span>
            <span className="text-white/30">Phase {mockProject.phase} of {mockProject.totalPhases}</span>
            {projectId && <span className="text-white/15 hidden sm:inline">· {projectId}</span>}
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
              {mockTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: task.id * 0.12 }}
                  className={`leading-relaxed ${
                    task.type === 'alert' ? 'text-yellow-400/80' :
                    task.type === 'commit' ? 'text-signal/80' :
                    'text-white/40'
                  }`}
                >
                  <span className="text-white/20 mr-2">[{task.time}]</span>
                  {task.text}
                </motion.div>
              ))}
              <div className="flex items-center gap-1.5 text-white/20 mt-4 pt-4 border-t border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" />
                <span>Waiting for next commit...</span>
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
                {mockAgents.map((agent) => (
                  <div key={agent.handle} className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                        agent.active
                          ? 'bg-citrus/10 text-citrus border border-citrus/20'
                          : 'bg-white/5 text-white/30 border border-white/8'
                      }`}>
                        {agent.initials}
                      </div>
                      {agent.active && (
                        <motion.div
                          className="absolute -inset-0.5 rounded-full border border-signal"
                          animate={{ opacity: [0.8, 0.2, 0.8] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        />
                      )}
                    </div>
                    <div>
                      <div className={`text-sm ${agent.active ? 'text-white' : 'text-white/30'}`}>{agent.handle}</div>
                      <div className={`text-[10px] capitalize font-mono ${agent.active ? 'text-signal' : 'text-white/20'}`}>
                        {agent.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Milestone Tracker */}
            <section className="glass-panel p-5">
              <div className="text-xs font-mono text-white/40 uppercase tracking-widest mb-4">Milestone Progress</div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white">Phase 1: Foundation</span>
                  <span className="text-xs text-citrus font-mono">{mockProject.healthScore}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-citrus to-signal rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${mockProject.healthScore}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                {['Phase 1: Foundation', 'Phase 2: Core Features', 'Phase 3: Launch'].map((phase, i) => (
                  <div key={phase} className="flex items-center gap-2 text-xs">
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${i === 0 ? 'bg-citrus' : 'bg-white/15'}`} />
                    <span className={i === 0 ? 'text-white/70' : 'text-white/25'}>{phase}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Fund Milestone CTA */}
            <section className="glass-card text-center">
              <div className="text-xs font-mono text-white/40 uppercase tracking-widest mb-1">Phase 1 Complete</div>
              <div className="font-outfit font-extrabold text-2xl text-citrus mt-2 mb-0.5">£997</div>
              <div className="text-xs text-white/30 mb-4">Foundation milestone</div>
              <button className="btn-citrus w-full text-xs py-2.5">
                Fund Phase 2 →
              </button>
              <p className="text-white/15 text-[10px] mt-2 font-mono">Stripe · Secure · Instant kickoff</p>
            </section>

          </aside>
        </div>
      </div>
    </div>
  );
}
