import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

export async function POST(req: NextRequest) {
  try {
    const { email, projectType, budget, timeline } = await req.json();
    if (!email) return NextResponse.json({ ok: false }, { status: 400 });

    const client = new Client({
      connectionString: process.env.ANTIGRAVITY_BRAIN_CONNECTION_STRING,
      ssl: { rejectUnauthorized: false },
    });

    await client.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS glasbox_leads (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        email TEXT NOT NULL,
        project_type TEXT,
        budget TEXT,
        timeline TEXT,
        created_at TIMESTAMPTZ DEFAULT now()
      )
    `);
    await client.query(
      'INSERT INTO glasbox_leads (email, project_type, budget, timeline) VALUES ($1, $2, $3, $4)',
      [email, projectType || null, budget || null, timeline || null]
    );
    await client.end();

    return NextResponse.json({ ok: true });
  } catch (err) {
    // Don't block the user flow if lead save fails
    console.error('Lead save error:', err);
    return NextResponse.json({ ok: false });
  }
}
