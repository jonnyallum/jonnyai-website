import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY || 'temp');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SHARED_BRAIN_URL || 'https://placeholder.supabase.co',
  process.env.SHARED_BRAIN_SERVICE_ROLE_KEY || 'placeholder'
);

function routeToAgent(toAddresses: string[]): { agent: string; label: string; from: string } {
  for (const addr of toAddresses) {
    const local = addr.split('@')[0].toLowerCase();
    if (['marcus', 'brief', 'hello', 'hi', 'jonny', 'start'].includes(local)) {
      return { agent: 'marcus', label: 'Marcus Cole', from: 'marcus@jonnyai.co.uk' };
    }
    if (['support', 'help', 'hannah'].includes(local)) {
      return { agent: 'hannah', label: 'Hannah Park', from: 'support@jonnyai.co.uk' };
    }
  }
  return { agent: 'marcus', label: 'Marcus Cole', from: 'marcus@jonnyai.co.uk' };
}

const AUTO_REPLIES: Record<string, { subject: (orig: string) => string; html: (from: string) => string }> = {
  marcus: {
    subject: (orig) => `Re: ${orig}`,
    html: (senderName) => `
      <div style="font-family:monospace;max-width:520px;margin:0 auto;background:#0a0a0a;color:#fff;padding:40px;border:1px solid #1a1a1a;border-radius:4px;">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.3em;color:#d97757;margin-bottom:24px;">Antigravity Orchestra</div>
        <h2 style="font-size:20px;font-weight:700;margin:0 0 16px;">Got it${senderName ? `, ${senderName.split(' ')[0]}` : ''}.</h2>
        <p style="color:#888;font-size:14px;line-height:1.7;margin:0 0 24px;">
          Your message landed. I'm reviewing it now and will come back with a proper response — usually within a few hours.
        </p>
        <p style="color:#888;font-size:14px;line-height:1.7;margin:0 0 24px;">
          If this is a project brief, expect a scope outline with fixed-price milestones.
        </p>
        <div style="border-top:1px solid #1a1a1a;padding-top:20px;margin-top:8px;">
          <p style="color:#444;font-size:11px;margin:0;">Marcus Cole · The Conductor · Antigravity Orchestra<br/>
          <a href="https://jonnyai.co.uk" style="color:#d97757;text-decoration:none;">jonnyai.co.uk</a></p>
        </div>
      </div>`,
  },
  hannah: {
    subject: (orig) => `Support ticket received — Re: ${orig}`,
    html: (senderName) => `
      <div style="font-family:monospace;max-width:520px;margin:0 auto;background:#0a0a0a;color:#fff;padding:40px;border:1px solid #1a1a1a;border-radius:4px;">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.3em;color:#d97757;margin-bottom:24px;">Antigravity Support</div>
        <h2 style="font-size:20px;font-weight:700;margin:0 0 16px;">We've got your ticket${senderName ? `, ${senderName.split(' ')[0]}` : ''}.</h2>
        <p style="color:#888;font-size:14px;line-height:1.7;margin:0 0 24px;">
          Your request has been logged. We respond within 2–4 hours during business hours.
        </p>
        <div style="border-top:1px solid #1a1a1a;padding-top:20px;margin-top:8px;">
          <p style="color:#444;font-size:11px;margin:0;">Hannah Park · Customer Success · Antigravity Orchestra<br/>
          <a href="https://jonnyai.co.uk" style="color:#d97757;text-decoration:none;">jonnyai.co.uk</a></p>
        </div>
      </div>`,
  },
};

export async function POST(req: NextRequest) {
  try {
    // Verify Resend webhook signature if secret is set
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
    if (webhookSecret) {
      const payload = await req.text();
      const signature = req.headers.get('svix-signature') ?? '';
      try {
        resend.webhooks.verify({
          webhookSecret,
          payload,
          headers: {
            id: req.headers.get('svix-id') ?? '',
            timestamp: req.headers.get('svix-timestamp') ?? '',
            signature: req.headers.get('svix-signature') ?? '',
          },
        });
      } catch {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
      const body = JSON.parse(payload);
      return await processEmail(body);
    }

    const body = await req.json();
    return await processEmail(body);
  } catch (err) {
    console.error('[inbound]', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

async function processEmail(payload: Record<string, unknown>) {
  // Resend inbound payload: { type: "email.received", data: { from, to, subject, text, html, ... } }
  const data = (payload.data ?? payload) as Record<string, unknown>;
  const from = String(data.from ?? '');
  const to: string[] = Array.isArray(data.to) ? data.to : [String(data.to ?? '')];
  const subject = String(data.subject ?? '(no subject)');
  const text = String(data.text ?? '');

  // Extract sender name from "Name <email>" format
  const nameMatch = from.match(/^"?([^"<]+)"?\s*</);
  const senderName = nameMatch ? nameMatch[1].trim() : '';
  const senderEmail = from.replace(/.*<(.+)>/, '$1').trim() || from;

  const { agent, label, from: replyFrom } = routeToAgent(to);

  // Post to Shared Brain chatroom for agent pickup
  const { error: supabaseError } = await supabase.from('chatroom').insert({
    agent_id: agent,
    message: `📧 **Inbound email**\n**From:** ${from}\n**To:** ${to.join(', ')}\n**Subject:** ${subject}\n\n${text.slice(0, 600)}${text.length > 600 ? '…' : ''}`,
    ai_source: 'system',
    machine_id: 'inbound_webhook',
    message_type: 'broadcast',
    project_context: null,
    mentions: [],
  });

  if (supabaseError) {
    console.error('[Supabase Insert Error]', supabaseError);
  }

  // Auto-reply
  const reply = AUTO_REPLIES[agent] ?? AUTO_REPLIES.marcus;
  await resend.emails.send({
    from: `${label} <${replyFrom}>`,
    to: [senderEmail],
    replyTo: replyFrom,
    subject: reply.subject(subject),
    html: reply.html(senderName),
  });

  console.log(`[inbound] ${from} → ${agent} | "${subject}"`);
  return NextResponse.json({ ok: true, routed_to: agent, agent_label: label });
}
