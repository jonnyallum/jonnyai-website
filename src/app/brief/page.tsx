'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Message {
  from: 'marcus' | 'user';
  text: string;
  timestamp?: string;
}

interface QuotePhase {
  phase: string;
  deliverable: string;
  price: string;
  timeline: string;
}

interface QuoteData {
  phases: QuotePhase[];
}

const INITIAL_MESSAGE =
  "Hi — I'm Jonny. Tell me what you're trying to build or fix. Don't worry about the detail yet — just give me the one-line version.";

function getTimestamp() {
  return new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function TypingDots() {
  return (
    <div className="flex gap-1.5 items-center px-4 py-3.5">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-white/30"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 0.75, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </div>
  );
}

function QuoteCard({ quote, onCheckout }: { quote: QuoteData; onCheckout: (phase: QuotePhase) => void }) {
  const total = quote.phases
    .map(p => parseFloat(p.price.replace(/[^0-9.]/g, '')))
    .filter(n => !isNaN(n))
    .reduce((a, b) => a + b, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-panel overflow-hidden w-full"
    >
      <div className="px-5 py-3 border-b border-white/8 flex items-center justify-between">
        <span className="text-xs font-mono text-white/40 uppercase tracking-widest">Fixed-Price Roadmap</span>
        <span className="text-xs text-signal font-mono">{quote.phases.length} phases</span>
      </div>

      <div className="divide-y divide-white/8">
        {quote.phases.map((phase, i) => (
          <div key={i} className="px-5 py-4 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="text-xs text-citrus font-mono mb-0.5">{phase.phase}</div>
              <div className="text-sm text-white/85 leading-snug">{phase.deliverable}</div>
              <div className="text-xs text-white/30 mt-1 font-mono">{phase.timeline}</div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-citrus font-outfit font-bold text-lg">{phase.price}</div>
            </div>
          </div>
        ))}
      </div>

      {total > 0 && (
        <div className="px-5 py-3 border-t border-white/8 flex items-center justify-between bg-white/2">
          <span className="text-xs text-white/30 font-mono uppercase tracking-widest">Total</span>
          <span className="text-white/60 font-outfit font-bold">£{total.toLocaleString()}</span>
        </div>
      )}

      <div className="px-5 py-4 border-t border-white/8 flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => onCheckout(quote.phases[0])}
          className="btn-citrus flex-1 text-sm"
        >
          Book Phase 1 Now →
        </button>
        <Link href="mailto:hello@jonnyai.co.uk" className="btn-ghost text-xs text-center py-3 px-6">
          Email Instead
        </Link>
      </div>

      <div className="px-5 pb-4">
        <p className="text-white/15 text-xs font-mono text-center">
          Pay per milestone · Cancel if we miss · No hidden fees
        </p>
      </div>
    </motion.div>
  );
}

export default function BriefPage() {
  const [messages, setMessages] = useState<Message[]>([
    { from: 'marcus', text: INITIAL_MESSAGE, timestamp: getTimestamp() },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [checkoutError, setCheckoutError] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, quote]);

  useEffect(() => {
    if (!isLoading) inputRef.current?.focus();
  }, [isLoading]);

  // Extract email from conversation automatically
  useEffect(() => {
    const allText = messages.filter(m => m.from === 'user').map(m => m.text).join(' ');
    const emailMatch = allText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) setContactEmail(emailMatch[0]);
  }, [messages]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = { from: 'user', text, timestamp: getTimestamp() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setQuote(null);
    setCheckoutError('');

    // Send last 12 messages for context
    const apiMessages = newMessages.slice(-12).map(m => ({
      role: m.from === 'marcus' ? 'assistant' : 'user',
      content: m.text,
    }));

    try {
      const res = await fetch('/api/marcus-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();
      const marcusText = data.message || "Give me a moment — I'll have a response for you shortly.";

      setMessages(prev => [
        ...prev,
        { from: 'marcus', text: marcusText, timestamp: getTimestamp() },
      ]);

      if (data.quote?.phases?.length > 0) {
        setQuote(data.quote);
        if (contactEmail) {
          fetch('/api/save-lead', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: contactEmail,
              projectType: 'ai-scoped',
              budget: 'unknown',
              timeline: 'unknown',
              conversation: newMessages.map(m => `${m.from}: ${m.text}`).join('\n'),
            }),
          }).catch(() => {/* silent */});
        }
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          from: 'marcus',
          text: "Connection blip. Try again — or email hello@jonnyai.co.uk directly.",
          timestamp: getTimestamp(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, contactEmail]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleCheckout = async (phase: QuotePhase) => {
    const raw = phase.price.replace(/[^0-9.]/g, '');
    const amount = parseFloat(raw);
    if (!amount || isCheckingOut) return;
    setIsCheckingOut(true);
    setCheckoutError('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          productName: phase.deliverable,
          customerEmail: contactEmail || undefined,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setCheckoutError(data.error || 'Checkout failed. Try emailing hello@jonnyai.co.uk');
        setIsCheckingOut(false);
      }
    } catch {
      setCheckoutError('Network error. Try emailing hello@jonnyai.co.uk');
      setIsCheckingOut(false);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  return (
    <div className="min-h-screen bg-void flex flex-col pt-16">
      {/* Sticky header */}
      <div className="border-b border-white/8 bg-surface/80 backdrop-blur-xl sticky top-16 z-40">
        <div className="max-w-2xl mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative w-7 h-7 rounded-full bg-citrus/10 border border-citrus/20 flex items-center justify-center text-[10px] font-bold text-citrus shrink-0">
              JA
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-signal border-2 border-void" />
            </div>
            <div>
              <span className="text-sm font-medium text-white">Jonny</span>
              <span className="text-white/20 text-xs font-mono ml-2 hidden sm:inline">— Free Project Scope</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-signal font-mono uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-signal animate-pulse" />
              Online
            </span>
            <Link href="/" className="text-white/25 text-xs hover:text-white/50 transition-colors font-mono">
              ← Home
            </Link>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-6 space-y-4 pb-36">

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <span className="inline-flex items-center gap-2 text-[10px] font-mono text-white/20 border border-white/8 bg-surface/50 px-3 py-1.5 rounded-sm">
            <span className="w-1 h-1 rounded-full bg-citrus/60" />
            Powered by AI · Fixed-price roadmap in 5 min
          </span>
        </motion.div>

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex items-end gap-2.5 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.from === 'marcus' && (
                <div className="relative w-7 h-7 rounded-full bg-citrus/10 border border-citrus/20 flex items-center justify-center text-[10px] font-bold text-citrus shrink-0 mb-1">
                  JA
                </div>
              )}
              <div className={`flex flex-col gap-1 ${msg.from === 'user' ? 'items-end' : 'items-start'} max-w-sm`}>
                <div
                  className={`px-4 py-3 rounded-sm text-sm leading-relaxed ${
                    msg.from === 'marcus'
                      ? 'bg-surface border border-white/8 text-white/80'
                      : 'bg-citrus text-white'
                  }`}
                >
                  {msg.text}
                </div>
                {msg.timestamp && (
                  <span className="text-[10px] font-mono text-white/15">
                    {msg.timestamp}
                  </span>
                )}
              </div>
              {msg.from === 'user' && (
                <div className="w-7 h-7 rounded-full bg-white/8 border border-white/12 flex items-center justify-center text-[10px] font-bold text-white/40 shrink-0 mb-1">
                  You
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {isLoading && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-end gap-2.5"
            >
              <div className="w-7 h-7 rounded-full bg-citrus/10 border border-citrus/20 flex items-center justify-center text-[10px] font-bold text-citrus shrink-0">
                JA
              </div>
              <div className="bg-surface border border-white/8 rounded-sm">
                <TypingDots />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {quote && (
            <motion.div
              key="quote"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="pl-9"
            >
              <QuoteCard quote={quote} onCheckout={handleCheckout} />
              {isCheckingOut && (
                <p className="text-white/30 text-xs font-mono text-center mt-3 flex items-center justify-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-citrus animate-pulse" />
                  Heading to checkout...
                </p>
              )}
              {checkoutError && (
                <p className="text-red-400/80 text-xs font-mono text-center mt-3">{checkoutError}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Fixed input bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/8 bg-void/95 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Tell us what you need..."
                disabled={isLoading || isCheckingOut}
                rows={1}
                className="w-full bg-surface border border-white/12 rounded-sm px-4 py-3 pr-16 text-sm text-white placeholder-white/20 focus:outline-none focus:border-citrus/40 transition-colors resize-none overflow-hidden leading-relaxed disabled:opacity-50"
                style={{ minHeight: 48, maxHeight: 120 }}
              />
              <span className="absolute right-3 bottom-3 text-[10px] text-white/15 font-mono pointer-events-none">
                ↵ send
              </span>
            </div>
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading || isCheckingOut}
              className="btn-citrus text-sm shrink-0 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
              style={{ height: 48, minWidth: 48 }}
            >
              {isLoading ? '·' : '→'}
            </button>
          </div>
          <p className="text-white/12 text-[10px] font-mono text-center mt-2">
            Real AI · No scripts · Responses tailored to your project
          </p>
        </div>
      </div>
    </div>
  );
}
