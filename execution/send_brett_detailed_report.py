import os
import sys
import requests
from datetime import datetime
from dotenv import load_dotenv

# Fix Windows cp1252 encoding crash with emoji
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

load_dotenv()

RESEND_API_KEY = os.getenv("RESEND_API_KEY")
RESEND_URL = "https://api.resend.com/emails"

def send_brett_report():
    print("🚀 Preparing detailed report for Brett (BL Motorcycles)...")
    
    html_content = """
    <div style="font-family:'Inter',Arial,sans-serif;background-color:#050508;color:#ffffff;max-width:750px;margin:auto;padding:0;border:1px solid #111;">
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#000000,#221a0f);padding:40px;border-bottom:2px solid #f97316;">
            <h1 style="margin:0;font-size:24px;color:#f97316;letter-spacing:2px;text-transform:uppercase;">Operational Intelligence Report</h1>
            <p style="margin:10px 0 0;font-size:14px;color:#888;">BL MOTORCYCLES | FAREHAM HUB | INFRASTRUCTURE RECONSTRUCTION</p>
        </div>
        
        <!-- Content -->
        <div style="padding:40px;font-size:16px;line-height:1.8;color:#ccc;">
            <p>Hi Brett,</p>
            
            <p>I am sending this detailed update again to ensure you have the full picture of the major reconstruction we have just completed on the <strong>BL Motorcycles</strong> digital infrastructure. We have officially cut the cord on local dependencies and moved to a 100% autonomous server-side ecosystem.</p>
            
            <h3 style="color:#fff;margin-top:30px;border-left:3px solid #f97316;padding-left:15px;">1. Admin Intelligence Hub: Rebuilt from Source</h3>
            <p>During our migration to Hostinger, we discovered a significant "rogue" element in the previous setup that was causing the admin portal to fail.</p>
            
            <table style="width:100%; border-collapse: collapse; margin: 20px 0; background: #0a0a0c; border: 1px solid #1a1a1f;">
                <tr>
                    <td style="padding:15px; border-bottom: 1px solid #1a1a1f;">
                        <strong style="color:#ef4444;">THE PROBLEM:</strong><br/>
                        The `/admin` page existed only as "orphaned" compiled files on the server. There was no actual source code in our codebase, and critical credentials were <strong>hardcoded in plain text</strong> within the JavaScript bundle—meaning anyone inspecting the site could see them.
                    </td>
                </tr>
                <tr>
                    <td style="padding:15px;">
                        <strong style="color:#10b981;">THE FIX:</strong><br/>
                        We have completely reconstructed the admin architecture tonight:
                        <ul style="margin:10px 0; padding-left:20px;">
                            <li><strong>Source Logic:</strong> Created a proper Next.js source file (`page.tsx`) so we now "own" the logic.</li>
                            <li><strong>Secure Auth:</strong> Replaced hardcoded keys with individual Supabase <code>email + password</code> authentication.</li>
                            <li><strong>Session Persistence:</strong> Integrated <code>onAuthStateChange</code> and secure sign-out flows.</li>
                            <li><strong>Fresh Deploy:</strong> Recompiled the entire site and deployed 55 clean files via SFTP, wiping out the old rogue artifacts.</li>
                        </ul>
                    </td>
                </tr>
            </table>

            <p><strong>LIVE RESULT:</strong> The <a href="https://blmotorcyclesltd.co.uk/admin" style="color:#f97316; text-decoration:none;">Intelligence Hub</a> is now fully operational. You will see the <strong>B&L DIRECT</strong> terminal aesthetic, a live clock, and a real-time Order Matrix showing all 15 recent orders (13 rejected, 1 processing) with the correct "Trace" data for troubleshooting.</p>

            <h3 style="color:#fff;margin-top:30px;border-left:3px solid #f97316;padding-left:15px;">2. 24/7 Autonomous Server (n8n Migration)</h3>
            <p>Previously, all the "heavy lifting"—scraping supplier stock from <strong>LL Exeter</strong> and <strong>Bike It</strong>, recalculating pricing, and pushing to eBay—was running on my local computer. This created a bottleneck where the system went "dark" if my computer was off.</p>
            
            <ul style="list-style-type:none;padding-left:0;">
                <li>⚡ <strong>Full Spec n8n:</strong> We have migrated all these processes to a dedicated high-performance Linux server running n8n.</li>
                <li>🔄 <strong>Eternal Monitoring:</strong> These workflows now run autonomously 24/7. The inventory sync and order routing are always "listening," even when we are asleep.</li>
                <li>📈 <strong>Scalability:</strong> This new architecture is built to handle thousands of SKUs without manual intervention.</li>
            </ul>

            <h3 style="color:#fff;margin-top:30px;border-left:3px solid #f97316;padding-left:15px;">3. Local Intelligence Cluster (Ollama)</h3>
            <p>To power the "decision making" of our routing agents, we have also brought our local <strong>Ollama Cluster</strong> online on the server. This node is currently operational and running a <code>llama3</code> model to help classify order errors and route alerts to the correct channels instantly.</p>

            <p style="margin-top:40px;">The foundation is now rock-solid. We have moved from a "local setup" to a "SaaS-grade infrastructure."</p>
            
            <p style="margin-top:30px;font-weight:bold;color:#f97316;">Best regards,</p>
            <p style="margin:0;color:#fff;">Jonny (The Boss) & The Antigravity Orchestra</p>
        </div>
        
        <!-- Footer -->
        <div style="padding:30px 40px;background:#000;border-top:1px solid #111;text-align:center;">
            <p style="font-size:12px;color:#444;margin:0;">Jai.OS 5.0 | Antigravity AI Cluster | NODE_ACTIVE</p>
        </div>
    </div>
    """

    
    payload = {
        "from": "Antigravity Orchestra <reports@jonnyai.co.uk>",
        "to": "blmotorcyclesltd@gmail.com",
        "subject": f"Operational Update: BL Motorcycles Intelligence Hub & Automation Migration",
        "html": html_content,
        "reply_to": "jonny@jonnyai.co.uk"
    }
    
    headers = {
        "Authorization": f"Bearer {RESEND_API_KEY}",
        "Content-Type": "application/json"
    }
    
    try:
        resp = requests.post(RESEND_URL, headers=headers, json=payload, timeout=15)
        if resp.status_code in (200, 201):
            print(f"✅ Report sent successfully to Brett!")
            return True
        else:
            print(f"❌ Resend error ({resp.status_code}): {resp.text}")
            return False
    except Exception as e:
        print(f"❌ Connection error: {e}")
        return False

if __name__ == "__main__":
    send_brett_report()
