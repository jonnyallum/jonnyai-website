import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const alt = "JonnyAI — a one-man, AI-native digital marketing agency";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Dynamically rendered share card (Facebook / LinkedIn / etc.) — crisp,
// correctly spelled, on-brand, with the JonnyAI logo. Replaces og_card.png.
export default function OpengraphImage() {
  const logo = readFileSync(join(process.cwd(), "public", "jai_logo_clean.png")).toString("base64");
  const logoSrc = `data:image/png;base64,${logo}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background: "#070708",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Ambient brand glows */}
        <div style={{ position: "absolute", top: -240, left: -180, width: 780, height: 780, display: "flex", backgroundImage: "radial-gradient(circle, rgba(217,119,87,0.38), rgba(217,119,87,0) 60%)" }} />
        <div style={{ position: "absolute", bottom: -300, right: -140, width: 780, height: 780, display: "flex", backgroundImage: "radial-gradient(circle, rgba(49,198,169,0.18), rgba(49,198,169,0) 60%)" }} />

        {/* Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={470} height={262} alt="JonnyAI" style={{ objectFit: "contain", marginBottom: 14, marginLeft: -8 }} />

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", fontSize: 58, fontWeight: 800, lineHeight: 1.05, color: "#ffffff", maxWidth: 940 }}>
          <div style={{ display: "flex" }}>We brand it, build it,</div>
          <div style={{ display: "flex", color: "#D97757" }}>film it &amp; automate it.</div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", marginTop: 34 }}>
          <div style={{ display: "flex", color: "#ffffff", fontSize: 30, fontWeight: 700 }}>jonnyai.co.uk</div>
          <div style={{ display: "flex", width: 6, height: 6, borderRadius: 6, background: "#D97757", margin: "0 20px" }} />
          <div style={{ display: "flex", color: "rgba(255,255,255,0.55)", fontSize: 25 }}>One-man, AI-native agency · BizOS · HubSuite</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
