import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SHARED_BRAIN_URL!,
  process.env.SHARED_BRAIN_SERVICE_ROLE_KEY!
);

// Route inbound address → agent handle
function routeToAgent(toAddress: string): { agent: string; label: string } {
  const local = toAddress.split('@')[0].toLowerCase();
  if (['marcus', 'brief', 'hello', 'hi'].includes(local)) {
    return { agent: 'marcus', label: 'Marcus Cole' };
  }
  if (['support', 'help', 'hannah'].includes(local)) {
    return { agent: 'hannah', label: 'Hannah Park' };
  }
  if (['jonny', 'jonnyai'].includes(local)) {
    return { agent: 'marcus', label: 'Marcus Cole' };
  }
  return { agent: 'marcus', label: 'Marcus Cole' };
}

const AUTO_REPLIES: Record<string, { subject: string; html: string }> = {
  marcus: {
    subject: 'Got it — Marcus is reviewing your message',
    html: `
      <div style="font-family:monospace;max-width:520px;margin:0 auto;background:#0a0a0a;color:#fff;padding:40px;border:1px solid #1a1a1a;">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.3em;color:#d97757;margin-bottom:24px;">Antigravity Orchestra</div>
        <h2 style="font-size:20px;font-weight:700;margin:0 0 16px;">Message received.</h2>
        <p style="color:#888;font-size:14px;line-height:1.7;margin:0 0 24px;">
          Your message has landed with the orchestra. I'll review it and come back to you with a proper response — usually within a few hours.
        </p>
        <p style="color:#888;font-size:14px;line-height:1.7;margin:0 0 24px;">
          If this is a project brief, I'll have a scope outline ready for your review.
        </p>
        <div style="border-top:1px solid #1a1a1a;padding-top:20px;margin-top:20px;">
          <p style="color:#444;font-size:11px;margin:0;">Marcus Cole · The Conductor · Antigravity Orchestra<br/>
          <a href="https://jonnyai.co.uk" style="color:#d97757;">jonnyai.co.uk</a></p>
        </div>
      </div>
    `,
  },
  hannah: {
    subject: 'Support ticket received — we\'re on it',
    html: `
      <div style="font-family:monospace;max-width:520px;margin:0 auto;background:#0a0a0a;color:#fff;padding:40px;border:1px solid #1a1a1a;">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.3em;color:#d97757;margin-bottom:24px;">Antigravity Support</div>
        <h2 style="font-size:20px;font-weight:700;margin:0 0 16px;">We've got your ticket.</h2>
        <p style="color:#888;font-size:14px;line-height:1.7;margin:0 0 24px;">
          Your support request has been logged and assigned. We typically respond within 2–4 hours during business hours.
        </p>
        <div style="border-top:1px solid #1a1a1a;padding-top:20px;margin-top:20px;">
          <p style="color:#444;font-size:11px;margin:0;">Hannah Park · Customer Success · Antigravity Orchestra<br/>
          <a href="https://jonnyai.co.uk" style="color:#d97757;">jonnyai.co.uk</a></p>
        </div>
      </div>
    `,
  },
};

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // Resend inbound payload shape
    const email = payload.data ?? payload;
    const from: string = email.from ?? '';
    const to: string[] = Array.isArray(email.to) ? email.to : [email.to ?? ''];
    const subject: string = email.subject ?? '(no subject)';
    const text: string = email.text ?? '';
    const html: string = email.html ?? '';

    const primaryTo = to[0] ?? '';
    const { agent, label } = routeToAgent(primaryTo);

    // Store in Supabase shared brain chatroom as an agent message
    await supabase.from('chatroom').insert({
      agent_id: agent,
      message: `📧 **Inbound email from ${from}**\n\n**To:** ${primaryTo}\n**Subject:** ${subject}\n\n${text.slice(0, 800)}${text.length > 800 ? '…' : ''}`,
      project_context: null,
      mentions: [],
    });

    // Auto-reply
    const reply = AUTO_REPLIES[agent] ?? AUTO_REPLIES.marcus;
    await resend.emails.send({
      from: `${label} <${agent === 'hannah' ? 'support' : 'marcus'}@jonnyai.co.uk>`,
      to: [from],
      subject: reply.subject,
      html: reply.html,
      headers: {
        'X-Entity-Ref-ID': `inbound-${Date.now()}`,
      },
    });

    return NextResponse.json({ ok: true, routed_to: agent });
  } catch (err) {
    console.error('[inbound]', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
