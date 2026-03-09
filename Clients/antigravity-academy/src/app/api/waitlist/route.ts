import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";

const CONNECTION_STRING = process.env.ANTIGRAVITY_BRAIN_CONNECTION_STRING;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, source } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = name?.trim() || "Founding Member";

    // 1. Sync to Shared Brain (Supabase)
    if (CONNECTION_STRING) {
      const client = new Client({ connectionString: CONNECTION_STRING });
      await client.connect();
      try {
        await client.query(
          `INSERT INTO academy_leads (email, name, source, status) 
           VALUES ($1, $2, $3, 'pending') 
           ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, source = EXCLUDED.source`,
          [cleanEmail, cleanName, source || "academy-waitlist"]
        );
        
        // Log to Chatroom
        await client.query(
          `INSERT INTO chatroom (id, agent_id, message, message_type, machine_id, ai_source, created_at)
           VALUES (gen_random_uuid(), 'successbot', $1, 'broadcast', 'academy-server', 'nextjs', NOW())`,
          [`[ACADEMY] New Founding Member Enrollment: ${cleanName} (${cleanEmail})`]
        );
      } finally {
        await client.end();
      }
    }

    // 2. Send Welcome Email via Resend
    if (RESEND_API_KEY) {
      const htmlContent = `
        <div style="font-family: sans-serif; background: #0c0c0c; color: #fff; padding: 40px; border: 1px solid #333;">
            <div style="border-left: 4px solid #FF5722; padding-left: 20px; margin-bottom: 30px;">
                <h1 style="color: #FF5722; text-transform: uppercase;">Antigravity Academy</h1>
                <p style="opacity: 0.6;">Mission Notification | Founding Member Intake</p>
            </div>
            <p>Welcome to the Orchestra, <strong>${cleanName}</strong>.</p>
            <p>You have secured your position in Cohort 01. Activation starts March 10th.</p>
            <div style="background: #1a1a1a; padding: 20px; border: 1px solid #FF5722; margin: 20px 0;">
                <p>📍 Cohort Activation: March 10, 2026</p>
                <p>🎯 Goal: AgOS 4.0 Deployment Mastery</p>
            </div>
            <p style="font-size: 12px; opacity: 0.5; margin-top: 40px;">Sent via Antigravity Hive Mind.</p>
        </div>
      `;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Antigravity Academy <academy@jonnyai.co.uk>",
          to: cleanEmail,
          subject: "WELCOME TO THE ORCHESTRA | Antigravity Academy",
          html: htmlContent,
        }),
      });
    }

    return NextResponse.json({ success: true, message: "Welcome to the Orchestra." });
  } catch (err) {
    console.error("[ACADEMY] Enrollment Error:", err);
    return NextResponse.json({ error: "System congestion. Try again later." }, { status: 500 });
  }
}
