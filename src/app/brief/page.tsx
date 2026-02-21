'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

type Step = 'welcome' | 'project_type' | 'budget' | 'timeline' | 'contact' | 'generating' | 'quote' | 'paying';

interface Message {
  from: 'marcus' | 'user';
  text: string;
}

interface QuoteRow {
  phase: string;
  deliverable: string;
  price: string;
  timeline: string;
}

const projectTypes = [
  { id: 'website', label: 'Website / Landing Page', price: '£997–£1,997' },
  { id: 'app', label: 'Web App / MVP', price: '£4,997–£9,997' },
  { id: 'traffic', label: 'SEO / Ads / Traffic Growth', price: '£497/mo+' },
  { id: 'workforce', label: 'AI Agent / Automation', price: '£1,000/mo+' },
];

const budgets = [
  { id: 'starter', label: 'Under £1,000', tier: 'Facelift' },
  { id: 'growth', label: '£1,000–£5,000', tier: 'Launchpad / Sprint' },
  { id: 'scale', label: '£5,000–£10,000', tier: 'Full MVP' },
  { id: 'enterprise', label: '£10,000+', tier: 'Enterprise Build' },
];

const timelines = [
  { id: 'asap', label: 'ASAP — ship in 48 hours' },
  { id: 'month', label: 'Within a month' },
  { id: 'quarter', label: 'This quarter' },
  { id: 'planning', label: 'Just planning ahead' },
];

function generateQuote(projectType: string): QuoteRow[] {
  if (projectType === 'website') {
    return [
      { phase: 'Phase 1', deliverable: 'Design System & Wireframes', price: '£247', timeline: '24h' },
      { phase: 'Phase 2', deliverable: 'Full Website Build + Supabase CMS', price: '£497', timeline: '48h' },
      { phase: 'Phase 3', deliverable: 'SEO, Lighthouse Audit & Launch', price: '£253', timeline: '24h' },
    ];
  }
  if (projectType === 'app') {
    return [
      { phase: 'Phase 1', deliverable: 'UX Design & Technical Architecture', price: '£997', timeline: '48h' },
      { phase: 'Phase 2', deliverable: 'Core App Build + Supabase Backend', price: '£2,500', timeline: '1 week' },
      { phase: 'Phase 3', deliverable: 'Testing, RLS Security & Launch', price: '£500', timeline: '48h' },
    ];
  }
  if (projectType === 'traffic') {
    return [
      { phase: 'Phase 1', deliverable: 'Audit, Strategy & Keyword Mapping', price: '£0', timeline: '24h' },
      { phase: 'Phase 2', deliverable: 'Campaign Setup & Content Calendar', price: '£247', timeline: '48h' },
      { phase: 'Phase 3', deliverable: 'Live Campaigns + Monthly Reporting', price: '£497/mo', timeline: 'Monthly' },
    ];
  }
  return [
    { phase: 'Phase 1', deliverable: 'Process Audit & Agent Blueprint', price: '£0', timeline: '24h' },
    { phase: 'Phase 2', deliverable: 'Agent Build & Integration', price: '£497', timeline: '48h' },
    { phase: 'Phase 3', deliverable: 'Live Agent + Monitoring Dashboard', price: '£1,000/mo', timeline: 'Monthly' },
  ];
}

export default function BriefPage() {
  const [step, setStep] = useState<Step>('welcome');
  const [messages, setMessages] = useState<Message[]>([]);
  const [projectType, setProjectType] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [quote, setQuote] = useState<QuoteRow[]>([]);
  const [checkoutError, setCheckoutError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages([{
        from: 'marcus',
        text: "Hey. I'm Marcus — The Conductor. I'm going to map out your project in about 2 minutes and hand you a fixed-price roadmap. No fluff, no commitment. What are you building?",
      }]);
      setTimeout(() => setStep('project_type'), 600);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, step]);

  const addMsg = (from: 'marcus' | 'user', text: string) => {
    setMessages(prev => [...prev, { from, text }]);
  };

  const handleProjectType = (type: typeof projectTypes[0]) => {
    setProjectType(type.id);
    addMsg('user', type.label);
    setTimeout(() => {
      addMsg('marcus', `Solid. ${type.label} is one of our core pillars — I have specialists ready for that. What budget range are you working with?`);
      setStep('budget');
    }, 400);
  };

  const handleBudget = (b: typeof budgets[0]) => {
    addMsg('user', b.label);
    setTimeout(() => {
      addMsg('marcus', `Perfect — that maps to our ${b.tier} tier. Last question: when do you need this live?`);
      setStep('timeline');
    }, 400);
  };

  const handleTimeline = (t: typeof timelines[0]) => {
    addMsg('user', t.label);
    setTimeout(() => {
      addMsg('marcus', `Got it. Drop your email and I\'ll send the full roadmap there too.`);
      setStep('contact');
    }, 400);
  };

  const handleContact = () => {
    if (!emailInput.includes('@')) return;
    setContactEmail(emailInput);
    addMsg('user', emailInput);
    addMsg('marcus', 'Building your roadmap now...');
    setStep('generating');
    setTimeout(() => {
      const q = generateQuote(projectType);
      setQuote(q);
      setStep('quote');
    }, 2200);
  };

  const handleCheckout = async (row: QuoteRow) => {
    const raw = row.price.replace(/[^0-9.]/g, '');
    const amount = parseFloat(raw);
    if (!amount) return;
    setStep('paying');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, productName: row.deliverable, customerEmail: contactEmail }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setCheckoutError(data.error || 'Checkout failed. Please try again.');
        setStep('quote');
      }
    } catch {
      setCheckoutError('Network error. Please try again.');
      setStep('quote');
    }
  };

  return (
    <div className="min-h-screen bg-void flex flex-col pt-16">
      {/* Header */}
      <div className="border-b border-white/8 bg-surface/70 backdrop-blur-xl sticky top-16 z-40">
        <div className="max-w-2xl mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-citrus/10 border border-citrus/20 flex items-center justify-center text-[10px] font-bold text-citrus">
              MC
            </div>
            <span className="text-sm font-medium text-white">Marcus</span>
            <span className="text-white/20 text-xs font-mono">— Free Project Scope</span>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] text-signal font-mono uppercase tracking-widest">
            <span className="w-1 h-1 rounded-full bg-signal animate-pulse" />
            Live
          </span>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-8 space-y-4">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-end gap-2 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.from === 'marcus' && (
                <div className="w-7 h-7 rounded-full bg-citrus/10 border border-citrus/20 flex items-center justify-center text-[10px] font-bold text-citrus shrink-0 mb-0.5">
                  MC
                </div>
              )}
              <div
                className={`max-w-sm px-4 py-3 rounded-sm text-sm leading-relaxed ${
                  msg.from === 'marcus'
                    ? 'bg-surface border border-white/8 text-white/80'
                    : 'bg-citrus text-white'
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Option buttons */}
        <AnimatePresence mode="wait">
          {step === 'project_type' && (
            <motion.div key="pt" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2 pl-9">
              {projectTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => handleProjectType(type)}
                  className="w-full text-left glass-card p-3.5 hover:border-citrus/30 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm group-hover:text-white transition-colors">{type.label}</span>
                    <span className="text-citrus text-xs font-mono shrink-0 ml-3">{type.price}</span>
                  </div>
                </button>
              ))}
            </motion.div>
          )}

          {step === 'budget' && (
            <motion.div key="budget" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2 pl-9">
              {budgets.map(b => (
                <button
                  key={b.id}
                  onClick={() => handleBudget(b)}
                  className="w-full text-left glass-card p-3.5 hover:border-citrus/30 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm group-hover:text-white transition-colors">{b.label}</span>
                    <span className="text-white/25 text-xs font-mono">{b.tier}</span>
                  </div>
                </button>
              ))}
            </motion.div>
          )}

          {step === 'timeline' && (
            <motion.div key="timeline" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2 pl-9">
              {timelines.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleTimeline(t)}
                  className="w-full text-left glass-card p-3.5 text-white/70 hover:text-white hover:border-citrus/30 transition-all duration-200 text-sm"
                >
                  {t.label}
                </button>
              ))}
            </motion.div>
          )}

          {step === 'contact' && (
            <motion.div key="contact" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="pl-9 flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleContact()}
                autoFocus
                className="flex-1 bg-surface border border-white/12 rounded-sm px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-citrus/50 transition-colors"
              />
              <button onClick={handleContact} className="btn-citrus text-xs py-2 px-5">
                Send
              </button>
            </motion.div>
          )}

          {step === 'generating' && (
            <motion.div key="gen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pl-9 flex items-center gap-3 text-white/40 text-sm font-mono">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-citrus animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
              Marcus is building your roadmap...
            </motion.div>
          )}

          {step === 'quote' && (
            <motion.div key="quote" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pl-9 space-y-4">
              <div className="glass-panel overflow-hidden">
                <div className="px-5 py-3 border-b border-white/8 flex items-center justify-between">
                  <span className="text-xs font-mono text-white/40 uppercase tracking-widest">Your Roadmap</span>
                  <span className="text-xs text-signal font-mono">{quote.length} Phases</span>
                </div>
                <div className="divide-y divide-white/8">
                  {quote.map((row, i) => (
                    <div key={i} className="px-5 py-4 flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs text-citrus font-mono mb-0.5">{row.phase}</div>
                        <div className="text-sm text-white/80">{row.deliverable}</div>
                        <div className="text-xs text-white/30 mt-0.5 font-mono">{row.timeline}</div>
                      </div>
                      <div className="text-citrus font-outfit font-bold text-lg shrink-0">{row.price}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => quote[0] && handleCheckout(quote[0])}
                  className="btn-citrus flex-1"
                >
                  Fund Phase 1 via Stripe →
                </button>
                <Link href="/" className="btn-ghost text-xs text-center py-3 px-6">
                  Back to Home
                </Link>
              </div>

              {checkoutError && (
                <p className="text-red-400/80 text-xs font-mono text-center">{checkoutError}</p>
              )}
              {contactEmail && (
                <p className="text-white/20 text-xs font-mono text-center">
                  Roadmap also sent to {contactEmail}
                </p>
              )}
            </motion.div>
          )}

          {step === 'paying' && (
            <motion.div key="paying" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pl-9 flex items-center gap-3 text-white/40 text-sm font-mono">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full bg-citrus animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
              Redirecting to Stripe checkout...
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
