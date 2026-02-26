import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 px-6 max-w-3xl mx-auto">
      <h1 className="font-outfit font-extrabold text-4xl mb-8">Privacy Policy</h1>
      <div className="prose prose-invert text-white/60 space-y-6">
        <p>Last updated: February 26, 2026</p>
        <p>
          At JonnyAi, we are committed to protecting your privacy. This policy explains how we collect and use your data.
        </p>
        <h2 className="text-white font-bold text-xl mt-8">1. Data Collection</h2>
        <p>
          We collect your name and email when you brief our conductor (Marcus) or apply for Empire OS. This data is used solely to provide our service and communicate project roadmaps.
        </p>
        <h2 className="text-white font-bold text-xl mt-8">2. AI Processing</h2>
        <p>
          Inputs provided during project scoping are processed by our internal AI models and third-party LLM providers (Anthropic) to generate roadmaps. No personal data is used to train these models.
        </p>
        <h2 className="text-white font-bold text-xl mt-8">3. Contact</h2>
        <p>
          Questions about this policy can be sent to <a href="mailto:support@jonnyai.co.uk" className="text-citrus">support@jonnyai.co.uk</a>.
        </p>
      </div>
      <div className="mt-12">
        <Link href="/" className="btn-ghost text-xs">← Back to Homepage</Link>
      </div>
    </main>
  );
}
