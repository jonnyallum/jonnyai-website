import { NextResponse } from "next/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "BL Motorcycles <brett@blmotorcycles.co.uk>";
const REPLY_TO = "brett@blmotorcycles.co.uk";

export async function POST(request: Request) {
  try {
    const { to, subject, body, emailType, orderId } = await request.json();

    if (!to || !subject || !body) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!RESEND_API_KEY) {
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }

    // Convert plain text body to branded HTML
    const htmlBody = generateBrandedEmail(body, subject, emailType);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject: subject,
        html: htmlBody,
        reply_to: REPLY_TO,
        tags: [
          { name: "email_type", value: emailType || "custom" },
          { name: "source", value: "bl-admin-dashboard" },
          ...(orderId ? [{ name: "order_id", value: orderId }] : []),
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", err);
      return NextResponse.json({ error: "Failed to send email", detail: err }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, id: data.id });
  } catch (error: any) {
    console.error("Email send error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function generateBrandedEmail(plainText: string, subject: string, emailType?: string): string {
  // Convert newlines to HTML breaks
  const bodyHtml = plainText
    .split("\n")
    .map((line: string) => {
      if (line.startsWith("📦") || line.startsWith("🚚") || line.startsWith("⭐") || line.startsWith("🔗") || line.startsWith("🏍")) {
        return `<p style="margin:8px 0;font-size:16px;">${line}</p>`;
      }
      if (line.match(/^\d+\./)) {
        return `<p style="margin:4px 0 4px 20px;font-size:15px;color:#ccc;">${line}</p>`;
      }
      if (line.trim() === "") return "<br/>";
      return `<p style="margin:8px 0;font-size:15px;line-height:1.7;color:#ddd;">${line}</p>`;
    })
    .join("");

  // Accent colour based on email type
  const accentColor = emailType === "dispatch" ? "#22c55e" 
    : emailType === "delay" ? "#eab308"
    : emailType === "review" ? "#a855f7"
    : emailType === "upsell" ? "#3b82f6"
    : emailType === "return_instructions" ? "#ef4444"
    : "#f97316";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#050508;font-family:'Segoe UI','Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background-color:#0a0a0c;">
    <!-- Header -->
    <div style="padding:30px 40px;border-bottom:2px solid ${accentColor};">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td>
            <div style="display:inline-block;width:40px;height:40px;background-color:#f97316;border-radius:8px;text-align:center;line-height:40px;font-weight:900;color:#000;font-size:18px;">B</div>
          </td>
          <td style="padding-left:12px;">
            <span style="font-weight:900;font-size:18px;color:#fff;letter-spacing:-0.5px;text-transform:uppercase;font-style:italic;">B&L </span>
            <span style="font-weight:900;font-size:18px;color:#f97316;text-decoration:underline;text-underline-offset:4px;text-transform:uppercase;font-style:italic;">Motorcycles</span>
          </td>
        </tr>
      </table>
    </div>

    <!-- Body -->
    <div style="padding:35px 40px;">
      ${bodyHtml}
    </div>

    <!-- Footer -->
    <div style="padding:25px 40px;border-top:1px solid #1a1a1f;text-align:center;">
      <p style="margin:0 0 8px;font-size:13px;color:#666;">BL Motorcycles Ltd — Fareham, Hampshire</p>
      <p style="margin:0 0 8px;font-size:12px;color:#444;">Quality Motorcycle Parts & Accessories</p>
      <p style="margin:0;font-size:11px;color:#333;">
        <a href="https://blmotorcyclesltd.co.uk" style="color:#f97316;text-decoration:none;">blmotorcyclesltd.co.uk</a>
        &nbsp;|&nbsp;
        <a href="https://www.ebay.co.uk/str/blmotorcyclesltd" style="color:#f97316;text-decoration:none;">eBay Store</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}
