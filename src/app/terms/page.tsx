import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 px-6 max-w-3xl mx-auto">
      <h1 className="font-outfit font-extrabold text-4xl mb-8">Terms of Service</h1>
      <div className="prose prose-invert text-white/60 space-y-6">
        <p>Last updated: February 26, 2026</p>
        <p>
          By using JonnyAi research and build services, you agree to the following terms.
        </p>
        <h2 className="text-white font-bold text-xl mt-8">1. Service Delivery</h2>
        <p>
          JonnyAi provides AI-orchestrated software development. Delivery timelines (e.g., 48 hours for milestones) are targets based on typical workflows and may vary by project complexity.
        </p>
        <h2 className="text-white font-bold text-xl mt-8">2. Intellectual Property</h2>
        <p>
          Upon final payment, the client owns the copyright to all software code and assets specifically built for the project, excluding pre-existing Jai.OS infrastructure.
        </p>
        <h2 className="text-white font-bold text-xl mt-8">3. Payments</h2>
        <p>
          Payments are structured per milestone. Fees are non-refundable once a milestone is delivered and approved in the Glass Box dashboard.
        </p>
      </div>
      <div className="mt-12">
        <Link href="/" className="btn-ghost text-xs">← Back to Homepage</Link>
      </div>
    </main>
  );
}
