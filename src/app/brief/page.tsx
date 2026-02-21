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
  { id: 'starter', label: 'Under £1,000' },
  { id: 'growth', label: '£1,000–£5,000' },
  { id: 'scale', label: '£5,000–£10,000' },
  { id: 'enterprise', label: '£10,000+' },
];

const timelines = [
  { id: 'asap', label: 'ASAP — I needed this yesterday' },
  { id: 'month', label: 'Within the next month' },
  { id: 'quarter', label: 'This quarter' },
  { id: 'planning', label: 'Just scoping for now' },
];

const projectTypeResponses: Record<string, string> = {
  website: "Good. Websites are our bread and butter — we've shipped dozens in 48-hour sprints. Fast, clean, built to convert. What budget are you working with?",
  app: "An app build. This is where the full team comes alive — Next.js, Supabase, shipped fast with zero cut corners. What's the budget range?",
  traffic: "Growth work. Our SEO and ads team have taken sites from zero to page one in 90 days. What budget are we playing with?",
  workforce: "AI agents — this is where we do our best work. We've automated lead pipelines, onboarding, reporting, you name it. What's the budget?",
};

const budgetResponses: Record<string, string> = {
  starter: "Tight but workable. I won't pad it with fluff — we'll focus only on what moves the needle. When do you need it live?",
  growth: "That's a solid working budget. Enough to build something that'll actually grow your business. What's the timeline?",
  scale: "Strong. We can do a proper job here — no corners cut, no shortcuts. When are you looking to launch?",
  enterprise: "Full build. Full team. No compromises. I like it. When do you need this?",
};

const timelineResponses: Record<string, string> = {
  asap: "Fast is what we do. Last thing — drop your email so I can get this plan across to you right now.",
  month: "A month is comfortable — enough time to do it properly. What's your email? I'll send the breakdown across.",
  quarter: "Smart to plan ahead. Drop your email and I'll send the full roadmap so you have it ready.",
  planning: "No rush. Still worth having a concrete plan in your pocket. What's your email?",
};

const quoteRevealMessages: Record<string, string> = {
  website: "Right. Here's how I'd approach this. Three clean phases — nail the design first, build fast second, then SEO and launch. No surprises, no scope creep.",
  app: "Here's the plan. Architecture before code — always. Phase 1 locks in exactly what we're building so Phase 2 ships clean and fast.",
  traffic: "Here's the playbook. Audit first so we know exactly what we're fighting, then we build the machine and let it run.",
  workforce: "Here's the blueprint. We audit your process, build the agent to spec, then hand you something that runs 24/7 without you.",
};

function generateQuote(projectType: string): QuoteRow[] {
  if (projectType === 'website') {
    return [
      { phase: 'Phase 1', deliverable: 'Design System & Wireframes', price: '£247', timeline: '24h' },
      { phase: 'Phase 2', deliverable: 'Full Website Build + CMS', price: '£497', timeline: '48h' },
      { phase: 'Phase 3', deliverable: 'SEO, Speed Audit & Launch', price: '£253', timeline: '24h' },
    ];
  }
  if (projectType === 'app') {
    return [
      { phase: 'Phase 1', deliverable: 'UX Design & Technical Architecture', price: '£997', timeline: '48h' },
      { phase: 'Phase 2', deliverable: 'Core App Build + Auth + Database', price: '£2,500', timeline: '1 week' },
      { phase: 'Phase 3', deliverable: 'Testing, Security Audit & Launch', price: '£500', timeline: '48h' },
    ];
  }
  if (projectType === 'traffic') {
    return [
      { phase: 'Phase 1', deliverable: 'Full SEO & Competitor Audit', price: '£0', timeline: '24h' },
      { phase: 'Phase 2', deliverable: 'Campaign Setup & Content Calendar', price: '£247', timeline: '48h' },
      { phase: 'Phase 3', deliverable: 'Live Campaigns + Monthly Reporting', price: '£497/mo', timeline: 'Ongoing' },
    ];
  }
  return [
    { phase: 'Phase 1', deliverable: 'Process Audit & Agent Blueprint', price: '£0', timeline: '24h' },
    { phase: 'Phase 2', deliverable: 'Agent Build & System Integration', price: '£497', timeline: '48h' },
    { phase: 'Phase 3', deliverable: 'Live Agent + Monitoring Dashboard', price: '£1,000/mo', timeline: 'Ongoing' },
  ];
}

export default function BriefPage() {
  const [step, setStep] = useState<Step>('welcome');
  const [messages, setMessages] = useState<Message[]>([]);
  const [projectType, setProjectType] = useState('');
  const [budgetId, setBudgetId] = useState('');
  const [timelineId, setTimelineId] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [quote, setQuote] = useState<QuoteRow[]>([]);
  const [checkoutError, setCheckoutError] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages([{
        from: 'marcus',
        text: "Hey. I'm Marcus — I run the project team here at JonnyAi. Tell me what you're trying to build or fix, and I'll have a concrete fixed-price plan in your hands in under 2 minutes.",
      }]);
      setTimeout(() => setStep('project_type'), 500);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, step, isTyping]);

  const marcusReply = (text: string, nextStep: Step, delay = 1000) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { from: 'marcus', text }]);
      setStep(nextStep);
    }, delay);
  };

  const handleProjectType = (type: typeof projectTypes[0]) => {
    setProjectType(type.id);
    setMessages(prev => [...prev, { from: 'user', text: type.label }]);
    marcusReply(projectTypeResponses[type.id], 'budget', 900);
  };

  const handleBudget = (b: typeof budgets[0]) => {
    setBudgetId(b.id);
    setMessages(prev => [...prev, { from: 'user', text: b.label }]);
    marcusReply(budgetResponses[b.id], 'timeline', 800);
  };

  const handleTimeline = (t: typeof timelines[0]) => {
    setTimelineId(t.id);
    setMessages(prev => [...prev, { from: 'user', text: t.label }]);
    marcusReply(timelineResponses[t.id], 'contact', 800);
  };

  const handleContact = () => {
    if (!emailInput.includes('@')) return;
    const email = emailInput;
    setContactEmail(email);
    setMessages(prev => [...prev, { from: 'user', text: email }]);
    setIsTyping(true);

    // Save lead
    fetch('/api/save-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, projectType, budget: budgetId, timeline: timelineId }),
    }).catch(() => {/* silent */});

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { from: 'marcus', text: 'On it. Give me a moment...' }]);
      setStep('generating');

      setTimeout(() => {
        const q = generateQuote(projectType);
        setQuote(q);
        const reveal = quoteRevealMessages[projectType] || "Here's your plan.";
        setMessages(prev => [...prev, { from: 'marcus', text: reveal }]);
        setStep('quote');
      }, 2000);
    }, 1200);
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
              transition={{ duration: 0.28 }}
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

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-end gap-2"
            >
              <div className="w-7 h-7 rounded-full bg-citrus/10 border border-citrus/20 flex items-center justify-center text-[10px] font-bold text-citrus shrink-0">
                MC
              </div>
              <div className="bg-surface border border-white/8 px-4 py-3.5 rounded-sm flex gap-1.5 items-center">
                {[0, 1, 2].map(i => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-white/30"
                    animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.18 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Option buttons */}
        <AnimatePresence mode="wait">
          {!isTyping && step === 'project_type' && (
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

          {!isTyping && step === 'budget' && (
            <motion.div key="budget" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2 pl-9">
              {budgets.map(b => (
                <button
                  key={b.id}
                  onClick={() => handleBudget(b)}
                  className="w-full text-left glass-card p-3.5 hover:border-citrus/30 transition-all duration-200 group"
                >
                  <span className="text-white/70 text-sm group-hover:text-white transition-colors">{b.label}</span>
                </button>
              ))}
            </motion.div>
          )}

          {!isTyping && step === 'timeline' && (
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

          {!isTyping && step === 'contact' && (
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
                Send →
              </button>
            </motion.div>
          )}

          {step === 'generating' && (
            <motion.div key="gen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pl-9 flex items-center gap-2 text-white/30 text-xs font-mono">
              <span className="w-1 h-1 rounded-full bg-citrus animate-pulse" />
              Compiling your roadmap...
            </motion.div>
          )}

          {step === 'quote' && (
            <motion.div key="quote" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pl-9 space-y-4">
              <div className="glass-panel overflow-hidden">
                <div className="px-5 py-3 border-b border-white/8 flex items-center justify-between">
                  <span className="text-xs font-mono text-white/40 uppercase tracking-widest">Fixed-Price Roadmap</span>
                  <span className="text-xs text-signal font-mono">{quote.length} phases</span>
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
                  Book Phase 1 →
                </button>
                <Link href="/" className="btn-ghost text-xs text-center py-3 px-6">
                  Back to Home
                </Link>
              </div>

              {checkoutError && (
                <p className="text-red-400/80 text-xs font-mono text-center">{checkoutError}</p>
              )}
              <p className="text-white/20 text-xs font-mono text-center">
                Roadmap sent to {contactEmail} · No commitment required
              </p>
            </motion.div>
          )}

          {step === 'paying' && (
            <motion.div key="paying" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pl-9 flex items-center gap-3 text-white/40 text-sm font-mono">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full bg-citrus animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
              Heading to checkout...
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
