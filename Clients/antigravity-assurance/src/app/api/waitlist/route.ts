import { NextRequest, NextResponse } from "next/server";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";

const LEADS_FILE = join(process.cwd(), "leads.json");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, source } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const existing = existsSync(LEADS_FILE)
      ? JSON.parse(readFileSync(LEADS_FILE, "utf-8"))
      : [];

    const entry = {
      email: email.toLowerCase().trim(),
      source: source || "assurance-waitlist",
      timestamp: new Date().toISOString(),
    };

    existing.push(entry);
    writeFileSync(LEADS_FILE, JSON.stringify(existing, null, 2));

    console.log(`[ASSURANCE WAITLIST] New lead: ${entry.email} — ${entry.timestamp}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[ASSURANCE WAITLIST] Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
