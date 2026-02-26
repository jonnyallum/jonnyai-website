import Link from 'next/link';

export default function StatusPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 px-6 max-w-3xl mx-auto text-center">
      <div className="inline-flex items-center gap-2 text-xs font-mono text-signal border border-signal/20 bg-signal/5 px-4 py-2 rounded-full mb-8">
        <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />
        All Systems Operational
      </div>
      <h1 className="font-outfit font-extrabold text-4xl mb-4">System Status</h1>
      <p className="text-white/40 mb-12">Jai.OS 4.0 Orchestra is running at full capacity.</p>
      
      <div className="grid grid-cols-1 gap-4 text-left max-w-md mx-auto">
        {[
          { name: 'Core Engine (Marcus)', status: 'Operational' },
          { name: 'Design Hive (Priya)', status: 'Operational' },
          { name: 'Dev Factory (Sebastian)', status: 'Operational' },
          { name: 'Intelligence Grid (Dreamer)', status: 'Operational' },
          { name: 'Edge Node 01 (Pi)', status: 'Operational' },
        ].map(node => (
          <div key={node.name} className="glass-card flex items-center justify-between p-4">
            <span className="text-sm text-white/70 font-medium">{node.name}</span>
            <span className="text-[10px] font-mono text-signal uppercase tracking-widest">{node.status}</span>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <Link href="/" className="btn-ghost text-xs">← Back to Homepage</Link>
      </div>
    </main>
  );
}
