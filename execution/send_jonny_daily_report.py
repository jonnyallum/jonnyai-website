import os, sys, requests
from dotenv import load_dotenv

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')
load_dotenv()

RESEND_API_KEY = os.getenv("RESEND_API_KEY")

html = """
<div style="font-family:'Inter',Arial,sans-serif;background-color:#0a0a0f;color:#ffffff;max-width:750px;margin:auto;padding:0;border:1px solid #1a1a2e;">
    <div style="background:linear-gradient(135deg,#0a0a1a,#1a0a2e);padding:40px 40px 30px;border-bottom:2px solid #d97757;">
        <h1 style="margin:0;font-size:28px;color:#d97757;letter-spacing:3px;text-transform:uppercase;font-weight:800;">Daily Operations Report</h1>
        <p style="margin:8px 0 0;font-size:13px;color:#666;letter-spacing:1px;">ANTIGRAVITY ORCHESTRA | MARCH 5, 2026 | EVENING SESSION</p>
    </div>

    <div style="padding:35px 40px;font-size:15px;line-height:1.9;color:#bbb;">
        <p style="font-size:17px;color:#fff;">Evening Jonny,</p>
        <p>Here is your full operational report for today's session. Three major areas of progress, one critical bug squashed, and the foundation is stronger than yesterday.</p>

        <h2 style="color:#fff;margin-top:35px;font-size:20px;border-left:4px solid #d97757;padding-left:15px;">1. MCP Sequential Thinking Server</h2>
        <p>Installed and configured the <strong>Sequential Thinking MCP Server</strong> from the official ModelContextProtocol repository. This gives us a structured, step-by-step reasoning tool for complex problem-solving directly inside our AI workflow. It supports branching logic, thought revision, and dynamic scope adjustment. Configured in <code style="background:#1a1a2e;padding:2px 8px;border-radius:4px;color:#d97757;">cline_mcp_settings.json</code> and ready for use.</p>

        <h2 style="color:#fff;margin-top:35px;font-size:20px;border-left:4px solid #d97757;padding-left:15px;">2. Critical Bug Fix: Email Delivery Failure</h2>
        <table style="width:100%;border-collapse:collapse;margin:15px 0;background:#0d0d15;border:1px solid #1a1a2e;">
            <tr><td style="padding:15px;border-bottom:1px solid #1a1a2e;">
                <strong style="color:#ef4444;">THE PROBLEM:</strong><br/>
                All three email reports requested today (Brett's BL report + your daily standup) silently failed. No emails were delivered despite the Resend API being healthy and the jonnyai.co.uk domain fully verified.
            </td></tr>
            <tr><td style="padding:15px;">
                <strong style="color:#10b981;">ROOT CAUSE:</strong><br/>
                Emoji characters in Python <code style="background:#1a1a2e;padding:2px 6px;border-radius:4px;">print()</code> statements crash on Windows cp1252 encoding. The scripts died on the very first print line before ever reaching the Resend API call. This was a silent killer that affected <strong>12 scripts</strong> across the execution directory.
            </td></tr>
            <tr><td style="padding:15px;background:#0a1a0a;border-top:1px solid #1a1a2e;">
                <strong style="color:#10b981;">THE FIX:</strong><br/>
                Patched all 12 affected scripts with <code style="background:#1a1a2e;padding:2px 6px;border-radius:4px;">sys.stdout.reconfigure(encoding='utf-8', errors='replace')</code> at the top of each file. This is a permanent, one-line fix. Also corrected Brett's email address to <strong>blmotorcyclesltd@gmail.com</strong>.
            </td></tr>
        </table>
        <p><strong>Result:</strong> All emails now delivering successfully. Brett has received his full operational intelligence report at the correct address.</p>

        <h2 style="color:#fff;margin-top:35px;font-size:20px;border-left:4px solid #d97757;padding-left:15px;">3. BL Motorcycles Repository Architecture</h2>
        <p>Investigated the relationship between the GitHub <code style="background:#1a1a2e;padding:2px 8px;border-radius:4px;">jonnyallum/blwebsite</code> repo and the local <code style="background:#1a1a2e;padding:2px 8px;border-radius:4px;">BL-Motorcycles-Enterprise</code> codebase:</p>
        <ul style="padding-left:20px;">
            <li><strong>blwebsite repo</strong> contains the original Vite-based site (client/server/shared architecture). This is already synced with the local copy and represents Brett's preferred design.</li>
            <li><strong>BL-Motorcycles-Enterprise</strong> is the new Next.js App Router rebuild &mdash; a completely different framework and file structure.</li>
            <li>Created a <strong>legacy-vite-backup</strong> branch on GitHub to preserve Brett's preferred gold-and-black industrial design before any migration work.</li>
            <li>Documented every design detail in <strong>BL_STYLE_REFERENCE.md</strong>: the gold (#d3c065) and asphalt black (#050505) palette, Oswald typography, chamfered clip-path shapes, tech-style borders, grayscale image filters, and the full component architecture.</li>
        </ul>
        <p>Brett prefers the original site's look. The next session will port that styling faithfully into the Enterprise Next.js rebuild.</p>

        <h2 style="color:#fff;margin-top:35px;font-size:20px;border-left:4px solid #d97757;padding-left:15px;">4. Git Commits Today</h2>
        <table style="width:100%;border-collapse:collapse;margin:15px 0;">
            <tr style="background:#0d0d15;">
                <td style="padding:10px 15px;color:#d97757;font-family:monospace;font-size:13px;border:1px solid #1a1a2e;">b3618fa</td>
                <td style="padding:10px 15px;border:1px solid #1a1a2e;">153 files &mdash; BL admin ops, n8n workflows, MCP sequential thinking, CRM deploy, daily scripts</td>
            </tr>
            <tr style="background:#0a0a15;">
                <td style="padding:10px 15px;color:#d97757;font-family:monospace;font-size:13px;border:1px solid #1a1a2e;">c1919fd</td>
                <td style="padding:10px 15px;border:1px solid #1a1a2e;">Work log update + BL style reference document for Brett</td>
            </tr>
            <tr style="background:#0d0d15;">
                <td style="padding:10px 15px;color:#d97757;font-family:monospace;font-size:13px;border:1px solid #1a1a2e;">147c5fd</td>
                <td style="padding:10px 15px;border:1px solid #1a1a2e;">Patched 12 execution scripts with UTF-8 encoding fix</td>
            </tr>
        </table>
        <p>Push to <code style="background:#1a1a2e;padding:2px 8px;border-radius:4px;">jonnyallum/Antigravity_Orchestra</code> was initiated and is uploading in the background.</p>

        <h2 style="color:#fff;margin-top:35px;font-size:20px;border-left:4px solid #d97757;padding-left:15px;">Outstanding Items for Next Session</h2>
        <ul style="padding-left:20px;">
            <li>Port Brett's gold/black styling into the Enterprise Next.js rebuild</li>
            <li>Apply Supabase migration <code style="background:#1a1a2e;padding:2px 6px;border-radius:4px;">001_admin_ops_hub.sql</code> to the BL production database</li>
            <li>Deploy 4 n8n workflows (dispatch email, overdue escalator, oversell guard, weekly summary)</li>
            <li>Verify all 70 agents are reflected in the Supabase Shared Brain</li>
        </ul>

        <div style="margin-top:40px;padding:20px;background:#1a0a0a;border:1px solid #d97757;">
            <p style="margin:0;font-size:14px;color:#d97757;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">Key Learning of the Day</p>
            <p style="margin:10px 0 0;color:#fff;">Windows cp1252 encoding silently kills Python scripts that use emoji in print() statements. Always add <code style="background:#1a1a2e;padding:2px 6px;border-radius:4px;">sys.stdout.reconfigure(encoding='utf-8')</code> at the top of every execution script. This single line would have prevented all three email failures today.</p>
        </div>

        <p style="margin-top:30px;color:#666;font-size:13px;">Report compiled by the Antigravity Orchestra | @Arthur (The Librarian) &amp; @Nathan (The Automation)</p>
    </div>

    <div style="padding:25px 40px;background:#050508;border-top:1px solid #1a1a2e;text-align:center;">
        <p style="font-size:11px;color:#333;margin:0;letter-spacing:1px;">Jai.OS 5.0 | 70 AGENTS | SHARED BRAIN: ONLINE | ANTIGRAVITY.AI</p>
    </div>
</div>
"""

resp = requests.post("https://api.resend.com/emails",
    headers={"Authorization": f"Bearer {RESEND_API_KEY}", "Content-Type": "application/json"},
    json={
        "from": "Antigravity Orchestra <reports@jonnyai.co.uk>",
        "to": "jonnyallum@gmail.com",
        "subject": "Daily Operations Report - March 5, 2026 | Evening Session",
        "html": html
    })

print(f"Status: {resp.status_code}")
print(f"Response: {resp.text}")
