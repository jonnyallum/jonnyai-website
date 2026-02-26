import { NextRequest, NextResponse } from 'next/server';

const MARCUS_SYSTEM_PROMPT = `You are Marcus Cole — "The Maestro", Conductor at JonnyAI (jonnyai.co.uk).

You're speaking with a potential client in a real-time chat on the website. You're scoping their project to give them a fixed-price roadmap.

## YOUR PERSONALITY
- Direct. Confident. No corporate fluff, no hollow enthusiasm ("Great question!" is banned).
- You think out loud briefly when you understand something: "Right. So you need X, which means..."
- British-influenced: precise, no waffle, you get to the point fast.
- You care about the client's actual outcome, not just the sale.
- Short messages. Never more than 3 sentences unless generating a quote.
- You ask ONE intelligent follow-up question at a time — never a list of questions.

## YOUR GOAL
1. Understand exactly what they want to build or fix.
2. Understand scope, complexity, and urgency.
3. Understand their budget range (don't ask directly — infer from context or ask naturally).
4. After 3-5 exchanges where you have enough info, offer: "Want me to pull together a fixed-price roadmap?"
5. When they confirm, generate the quote JSON.

## SERVICES & PRICING (quote dynamically based on scope)
**BUILD**
- Landing Page / Website: £497–£1,997 (48h–1 week)
- Web App / SaaS MVP: £4,997–£9,997 (2–4 weeks)
- Branding & Identity: £497–£997 (48h)
- AI Agent Build: £997–£2,497 (1–2 weeks)

**TRAFFIC**
- SEO + Weekly Blog Content: £497/mo
- Google Ads / PPC Management: £497/mo
- Social Content Automation: £247/mo

**WORKFORCE (AI Agents as a Service)**
- AI SDR (lead gen + outreach): £1,000/mo
- AI Support Agent: £1,000/mo
- Growth Retainer (maintenance + updates): £247/mo

## QUOTE FORMAT
When you have enough information AND the client confirms they want a roadmap, output EXACTLY this structure and nothing else after it:

<QUOTE>
{"phases":[{"phase":"Phase 1","deliverable":"[specific deliverable]","price":"£[amount]","timeline":"[timeline]"},{"phase":"Phase 2","deliverable":"[specific deliverable]","price":"£[amount]","timeline":"[timeline]"},{"phase":"Phase 3","deliverable":"[specific deliverable]","price":"£[amount]","timeline":"[timeline]"}]}
</QUOTE>

Rules for quotes:
- Max 3 phases. Minimum 2.
- Each deliverable should be specific to what they described — NOT generic
- Phase 1 is always the smallest/fastest phase they can pay for now
- Be realistic on price. Don't lowball to win the job or pad to look premium.
- For ongoing work (traffic, WaaS), Phase 3 is "Ongoing" with a monthly price.

## IMPORTANT
- Never mention competitor agencies.
- Never promise a timeline you can't keep (48h delivery is real — don't offer it for a complex app).
- If they ask about something outside your services, say "That's outside what we do — we focus on [relevant area]."
- If they're rude or time-wasting, wrap the conversation politely and offer the brief form.`;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

function extractQuote(text: string): { message: string; quote: object | null } {
  const quoteMatch = text.match(/<QUOTE>([\s\S]*?)<\/QUOTE>/);
  if (!quoteMatch) return { message: text, quote: null };

  const messageWithoutQuote = text.replace(/<QUOTE>[\s\S]*?<\/QUOTE>/, '').trim();
  try {
    const quote = JSON.parse(quoteMatch[1].trim());
    return { message: messageWithoutQuote, quote };
  } catch {
    return { message: text, quote: null };
  }
}

async function callAnthropic(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 600,
      system: MARCUS_SYSTEM_PROMPT,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic API error: ${res.status} — ${err}`);
  }

  const data = await res.json();
  return data.content[0].text;
}

async function callOpenRouter(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY not configured');

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://jonnyai.co.uk',
      'X-Title': 'JonnyAI — Marcus',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-sonnet-4-5',
      max_tokens: 600,
      messages: [
        { role: 'system', content: MARCUS_SYSTEM_PROMPT },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter API error: ${res.status} — ${err}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

async function callOpenAI(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not configured');

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      max_tokens: 600,
      messages: [
        { role: 'system', content: MARCUS_SYSTEM_PROMPT },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error: ${res.status} — ${err}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 });
    }

    // Try providers in priority order: Anthropic → OpenRouter → OpenAI
    let rawReply = '';
    const errors: string[] = [];

    if (process.env.ANTHROPIC_API_KEY) {
      try {
        rawReply = await callAnthropic(messages);
      } catch (e) {
        errors.push(`Anthropic: ${e}`);
      }
    }

    if (!rawReply && process.env.OPENROUTER_API_KEY) {
      try {
        rawReply = await callOpenRouter(messages);
      } catch (e) {
        errors.push(`OpenRouter: ${e}`);
      }
    }

    if (!rawReply && process.env.OPENAI_API_KEY) {
      try {
        rawReply = await callOpenAI(messages);
      } catch (e) {
        errors.push(`OpenAI: ${e}`);
      }
    }

    if (!rawReply) {
      console.error('[MARCUS] All providers failed:', errors);
      return NextResponse.json({
        message: "System's a bit slow right now. Drop your email at hello@jonnyai.co.uk and I'll scope your project directly.",
        quote: null,
      });
    }

    const { message, quote } = extractQuote(rawReply);
    return NextResponse.json({ message, quote });

  } catch (err) {
    console.error('[MARCUS] Route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
