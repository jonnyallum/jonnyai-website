import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 'temp');

export async function GET() {
  try {
    const data = await resend.emails.send({
      from: 'Marcus Cole <marcus@jonnyai.co.uk>',
      to: ['jonnyallum@gmail.com'],
      subject: 'System Diagnostic: Production Outbound Test',
      html: '<p>Outbound email capability is being verified from /api/diag-outbound.</p>'
    });
    return NextResponse.json({ ok: true, data });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
